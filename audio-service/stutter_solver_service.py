import os
import sys
import torch
from torch import nn
import torchaudio
import torchaudio.transforms as T

# Add stutter-solver to path so utils can be imported
current_dir = os.path.dirname(os.path.abspath(__file__))
stutter_solver_dir = os.path.join(current_dir, "Stutter-Solver", "stutter-solver")
if stutter_solver_dir not in sys.path:
    sys.path.append(stutter_solver_dir)

import utils.vits.utils as utils
from utils.vits.models import SynthesizerTrn
from utils.vits.text.symbols import symbols
from utils.vits.text import text_to_sequence
import utils.vits.commons as commons
from utils.vits.mel_processing import spectrogram_torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_hps = None
_net_g = None
_decoder = None

def load_stutter_solver_models():
    global _hps, _net_g, _decoder
    if _net_g is not None and _decoder is not None:
        return
    
    print("Loading Stutter-Solver models into memory...")
    config_path = os.path.join(stutter_solver_dir, "utils", "vits", "configs", "ljs_base.json")
    _hps = utils.get_hparams_from_file(config_path)
    
    _net_g = SynthesizerTrn(
        len(symbols),
        _hps.data.filter_length // 2 + 1,
        _hps.train.segment_size // _hps.data.hop_length,
        **_hps.model).to(device)
    _net_g.eval()
    
    pretrained_path = os.path.join(current_dir, "Stutter-Solver", "saved_models", "pretrained_ljs.pth")
    utils.load_checkpoint(pretrained_path, _net_g, None)
    
    decoder_path = os.path.join(current_dir, "Stutter-Solver", "saved_models", "stutter_solver.pth")
    _decoder = torch.load(decoder_path, map_location=device)
    _decoder.eval()
    print("Stutter-Solver models loaded successfully.")

def get_text(text, hps):
    text_norm = text_to_sequence(text, hps.data.text_cleaners)
    if hps.data.add_blank:
        text_norm = commons.intersperse(text_norm, 0)
    text_norm = torch.LongTensor(text_norm)
    return text_norm

def get_audio_spec(filename):
    _sampling_rate = 22050
    _max_wav_value = 32768.0
    _filter_length = 1024
    _hop_length = 256
    _win_length = 1024

    audio, sampling_rate = torchaudio.load(filename)
    if sampling_rate != _sampling_rate:
        resampler = T.Resample(orig_freq=sampling_rate, new_freq=_sampling_rate)
        audio = resampler(audio)
    
    # average channels if multi-channel
    if audio.shape[0] > 1:
        audio = torch.mean(audio, dim=0, keepdim=True)

    max_val = torch.max(torch.abs(audio))
    if max_val == 0:
        max_val = 1.0  # Prevent division by zero for silent audio
    normalized_waveform = audio / max_val
    audio = normalized_waveform * 32767
    audio_norm = audio / _max_wav_value
    audio_norm = audio_norm.unsqueeze(0).to(device)

    spec = spectrogram_torch(
        audio_norm,
        _filter_length,
        _sampling_rate,
        _hop_length,
        _win_length,
        center=False,
    )
    spec = torch.squeeze(spec, 0)
    return spec

def predict_stutters(audio_path, transcript_text):
    """
    Runs Stutter-Solver inference to detect dysfluencies in audio given the transcript.
    Returns a list of dicts: {"type": str, "start": float, "end": float, "confidence": float}
    """
    load_stutter_solver_models()
    
    if not transcript_text.strip():
        return []
        
    spec = get_audio_spec(audio_path)
    
    stn_tst = get_text(transcript_text, _hps)
    x_tst = stn_tst.unsqueeze(0).to(device)
    x_tst_lengths = torch.LongTensor([stn_tst.size(0)]).to(device)
    
    y = spec.unsqueeze(0).to(device)
    y_lengths = torch.LongTensor([y.shape[-1]]).to(device)
    
    with torch.no_grad():
        o, l_length, (neg_cent, attn), ids_slice, x_mask, y_mask, _ = _net_g(x_tst, x_tst_lengths, y, y_lengths)
        soft_attention = nn.functional.softmax(neg_cent, dim=-1)

    # Pad soft_attention to [batch, 1024, 768] expected by decoder
    pad_dim1 = 768 - soft_attention.shape[-1]
    pad_dim2 = 1024 - soft_attention.shape[-2]
    
    if pad_dim1 < 0:
        soft_attention = soft_attention[:, :, :768]
        pad_dim1 = 0
    if pad_dim2 < 0:
        soft_attention = soft_attention[:, :1024, :]
        pad_dim2 = 0
        
    soft_attention = nn.functional.pad(soft_attention, (0, pad_dim1, 0, pad_dim2))
    
    num_regions = int(spec.shape[-1] // 16)
    mask = torch.ones((1, 64), dtype=torch.bool).to(device)
    max_region = min(num_regions, 63)
    mask[0, :max_region + 1] = False
    
    with torch.no_grad():
        output = _decoder(soft_attention, mask)
        
    stutters = []
    labels = ["repetition", "block", "missing", "replace", "prolongation"]
    
    for i in range(max_region):
        exists_pred = torch.clamp(output[0, i, 2], 0, 1)
        if exists_pred > 0.85:  # Increased threshold to prevent false positives
            disf_type_pred = output[0, i, 3:]
            type_idx = torch.argmax(disf_type_pred).item()
            start_norm = output[0, i, 0].item()
            end_norm = output[0, i, 1].item()
            
            start_sec = (start_norm * 1024 * 256) / 22050
            end_sec = (end_norm * 1024 * 256) / 22050
            
            stutters.append({
                "type": labels[type_idx],
                "start": round(start_sec, 2),
                "end": round(end_sec, 2),
                "confidence": round(exists_pred.item(), 2)
            })
            
    return stutters
