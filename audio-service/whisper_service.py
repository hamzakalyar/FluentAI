"""
WHISPER SERVICE — Speech-to-Text Transcription
================================================
This module uses OpenAI's Whisper model to convert audio recordings
into text with WORD-LEVEL TIMESTAMPS.

WHY WHISPER?
- Free, open-source, runs locally (no API key needed)
- Supports word-level timestamps (critical for stutter detection)
- Highly accurate even with disfluent speech
- Handles background noise well

MODEL SIZES:
- tiny   (~40MB)  → Fast but less accurate
- base   (~140MB) → Good balance (WE USE THIS)
- small  (~460MB) → Better accuracy, slower
- medium (~1.5GB) → High accuracy, much slower
- large  (~3GB)   → Best accuracy, very slow

HOW IT WORKS:
1. Load the Whisper model (done once at startup)
2. Receive a WAV audio file
3. Whisper processes the audio and returns:
   - Full transcript text
   - Word-by-word breakdown with start/end timestamps
4. These timestamps are critical because they let us:
   - Detect repeated words (same word appearing consecutively)
   - Calculate gaps between words (to find abnormal pauses)
   - Compute speech rate (words per minute)
"""

import whisper
import os
import json
import librosa
import numpy as np

# Global model variable — loaded once, reused for all requests
_model = None


def load_model(model_name="base"):
    """
    Load the Whisper model into memory.
    This is called once when the server starts.
    
    The 'base' model is ~140MB and provides good accuracy
    for stutter detection purposes.
    """
    global _model
    if _model is None:
        print(f"📥 Loading Whisper '{model_name}' model...")
        _model = whisper.load_model(model_name)
        print(f"✅ Whisper '{model_name}' model loaded successfully")
    return _model


def transcribe_audio(audio_path):
    """
    Transcribe an audio file and return word-level timestamps.
    
    Args:
        audio_path (str): Path to the WAV/audio file
        
    Returns:
        dict: {
            'text': 'full transcript text',
            'words': [
                {'word': 'hello', 'start': 0.0, 'end': 0.5},
                {'word': 'world', 'start': 0.6, 'end': 1.1},
                ...
            ],
            'language': 'en',
            'duration': 15.3
        }
    
    EXAMPLE OUTPUT:
    For someone saying "I I I want to go to the the store":
    {
        'text': 'I I I want to go to the the store',
        'words': [
            {'word': 'I',     'start': 0.00, 'end': 0.15},
            {'word': 'I',     'start': 0.25, 'end': 0.40},  ← repeated!
            {'word': 'I',     'start': 0.50, 'end': 0.65},  ← repeated!
            {'word': 'want',  'start': 0.80, 'end': 1.10},
            {'word': 'to',    'start': 1.15, 'end': 1.30},
            {'word': 'go',    'start': 1.35, 'end': 1.55},
            {'word': 'to',    'start': 1.60, 'end': 1.75},
            {'word': 'the',   'start': 1.80, 'end': 1.95},
            {'word': 'the',   'start': 2.30, 'end': 2.45},  ← repeated!
            {'word': 'store', 'start': 2.50, 'end': 2.85}
        ]
    }
    """
    model = load_model()
    
    # Pre-processing: Check if audio is completely silent before running Whisper
    # This completely prevents all "hallucination loops" and saves processing time.
    try:
        audio_data, sr = librosa.load(audio_path, sr=16000)
        max_amp = np.max(np.abs(audio_data))
        if max_amp < 0.0001:  # Absolute silence (dead mic)
            print("🔇 Absolute silence detected. Skipping Whisper transcription.")
            duration = len(audio_data) / sr if sr > 0 else 0.0
            return {
                "text": "",
                "words": [],
                "language": "en",
                "duration": round(duration, 2)
            }
    except Exception as e:
        print(f"⚠️ Silence check failed, proceeding to Whisper: {e}")
    
    
    # Disable SDPA (Scaled Dot Product Attention) to force naive attention weights,
    # which Whisper's word_timestamps alignment hooks require to avoid crashing on newer PyTorch versions.
    import torch
    import contextlib
    
    try:
        from torch.nn.attention import sdpa_kernel, SDPBackend
        sdpa_ctx = sdpa_kernel(SDPBackend.MATH)
    except Exception as e:
        print(f"⚠️ PyTorch sdpa_kernel not available, using fallback context: {e}")
        sdpa_ctx = contextlib.nullcontext()
        
    with sdpa_ctx:
        result = model.transcribe(
            audio_path,
            word_timestamps=True,              # CRITICAL: gives us per-word timing
            language="en",                     # Force English for consistency
            fp16=False,                        # Use FP32 for CPU compatibility
            condition_on_previous_text=False,  # CRITICAL: stops Whisper cleaning "I I I" → "I"
            suppress_blank=False,              # Don't suppress blank/hesitation tokens
            temperature=0.15,                  # KEY FIX: greedy (0.0) always picks the most
                                               # probable token = clean English = stutters erased.
                                               # 0.15 lets lower-prob tokens (repeats) appear.
            logprob_threshold=-2.0,            # More permissive: don't suppress quiet/uncertain
                                               # tokens that often represent stuttered sounds
            no_speech_threshold=0.6,           # Prevent hallucinations on silence
            compression_ratio_threshold=3.0,   # Allow repetitive output (don't skip stutter segments)
            initial_prompt="Umm, let me think... I I I want to go. P p p peter."  # Anchors Whisper to disfluent speech patterns
        )
    
    # Extract word-level data from Whisper's output
    words = []
    valid_text_segments = []
    
    for segment in result.get("segments", []):
        # Explicitly drop segments that Whisper is extremely sure are silence/noise
        # Increased threshold from 0.4 to 0.85 to prevent dropping hesitant/shaky stuttered speech
        if segment.get("no_speech_prob", 0.0) > 0.85:
            continue
            
        segment_text = segment.get("text", "").strip()
        valid_text_segments.append(segment_text)
        
        for word_info in segment.get("words", []):
            words.append({
                "word": word_info["word"].strip(),
                "start": round(word_info["start"], 3),
                "end": round(word_info["end"], 3)
            })
            
    final_text = " ".join(valid_text_segments).strip()
    
    # Post-processing: Filter out common Whisper hallucinations for short audio
    hallucinations = [
        "thank you", "subscribe", "amara.org", "i'm sorry", "thanks for watching", "bye",
        "umm, let me think", "i i i want to go"
    ]
    
    is_hallucination = False
    lower_text = final_text.lower()
    
    if len(final_text.split()) < 8:
        if any(h in lower_text for h in hallucinations):
            is_hallucination = True
    else:
        # Check for infinite loop of the initial prompt words (classic Whisper silence failure)
        import re
        clean_words = set(re.findall(r'[a-z]+', lower_text))
        prompt_words = {"i", "want", "to", "go", "umm", "let", "me", "think"}
        if len(clean_words) > 0 and clean_words.issubset(prompt_words):
            is_hallucination = True

    if is_hallucination:
        final_text = ""
        words = []
    
    # Calculate total audio duration
    duration = 0.0
    if words:
        duration = words[-1]["end"]
    elif result.get("segments"):
        duration = result["segments"][-1]["end"]
    
    return {
        "text": final_text,
        "words": words,
        "language": result.get("language", "en"),
        "duration": round(duration, 2)
    }


# --- FOR TESTING ---
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        audio_file = sys.argv[1]
        print(f"Transcribing: {audio_file}")
        result = transcribe_audio(audio_file)
        print(f"\nText: {result['text']}")
        print(f"Duration: {result['duration']}s")
        print(f"Words: {len(result['words'])}")
        print("\nWord-level timestamps:")
        for w in result['words']:
            print(f"  [{w['start']:.2f}s - {w['end']:.2f}s] {w['word']}")
    else:
        print("Usage: python whisper_service.py <audio_file.wav>")
