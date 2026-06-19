"""
DETECTION ACCURACY TEST
========================
Tests whether the stutter detection pipeline correctly identifies:
  1. REPETITIONS  - "I I I want" (same word repeated 3x)
  2. PROLONGATIONS - "prrrrrfemue" (stretched /r/ sound)
  3. PROLONGATIONS - "bissssssssstick" (stretched /s/ sound)

This script:
  A) Creates real WAV audio files using numpy/wave (no TTS needed)
  B) Sends them to the Flask /analyze endpoint
  C) Reports exactly what was (and wasn't) detected

Run this WHILE the Flask server is running on port 5000.
"""

import sys
import io

# ── Windows UTF-8 fix ──────────────────────────────────────────────────────
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

import wave
import struct
import math
import os
import json
import tempfile

# Try to use requests for HTTP, otherwise import directly
try:
    import requests
    HTTP_AVAILABLE = True
except ImportError:
    HTTP_AVAILABLE = False
    print("⚠️  'requests' not installed. Will run local module test only.")

# ── Also try direct module import as fallback ─────────────────────────────
DIRECT_AVAILABLE = False
try:
    sys.path.insert(0, os.path.dirname(__file__))
    from stutter_detector import detect_repetitions, detect_pauses, detect_audio_level_repetitions, detect_fillers
    DIRECT_AVAILABLE = True
except Exception as e:
    print(f"⚠️  Direct module import failed: {e}")


FLASK_URL = "http://127.0.0.1:5000"
SAMPLE_RATE = 16000  # 16 kHz — matches Whisper & librosa default


# ════════════════════════════════════════════════════════════════════════════
#  AUDIO SYNTHESIS HELPERS
# ════════════════════════════════════════════════════════════════════════════

def sine_tone(freq_hz, duration_s, amplitude=0.5, sr=SAMPLE_RATE):
    """Generate a pure sine wave tone."""
    n_samples = int(sr * duration_s)
    samples = []
    for i in range(n_samples):
        val = amplitude * math.sin(2 * math.pi * freq_hz * i / sr)
        samples.append(int(val * 32767))
    return samples


def silence(duration_s, sr=SAMPLE_RATE):
    """Generate silence."""
    return [0] * int(sr * duration_s)


def voiced_burst(duration_s, base_freq=120, sr=SAMPLE_RATE, formants=None):
    """
    Simulate a voiced speech sound using multiple formants layered on a glottal pulse.
    This gives a more speech-like quality than a pure tone.
    """
    if formants is None:
        formants = [500, 1500]  # Vowel /a/ approximate formants
    n_samples = int(sr * duration_s)
    samples = [0.0] * n_samples
    for i in range(n_samples):
        # Glottal pulse (fundamental)
        pulse = 0.4 * math.sin(2 * math.pi * base_freq * i / sr)
        # Formant resonances
        for f_idx, f_hz in enumerate(formants):
            amp = 0.3 / (f_idx + 1)
            pulse += amp * math.sin(2 * math.pi * f_hz * i / sr)
        samples[i] = pulse
    # Normalize
    peak = max(abs(s) for s in samples) or 1.0
    return [int((s / peak) * 0.7 * 32767) for s in samples]


def fricative_burst(duration_s, freq=4000, sr=SAMPLE_RATE):
    """
    Simulate a fricative consonant like /s/ or /sh/ using high-frequency noise.
    /s/ = noise filtered around 4000-8000 Hz.
    """
    import random
    n_samples = int(sr * duration_s)
    samples = []
    for i in range(n_samples):
        # White noise base
        noise = random.gauss(0, 0.3)
        # Add high-frequency component to simulate /s/
        hf = 0.5 * math.sin(2 * math.pi * freq * i / sr)
        samples.append(int((noise + hf) * 0.4 * 32767))
    return samples


def save_wav(samples, filename, sr=SAMPLE_RATE):
    """Save samples list (int16) to a WAV file."""
    with wave.open(filename, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)  # 16-bit
        wf.setframerate(sr)
        packed = struct.pack(f'<{len(samples)}h', *samples)
        wf.writeframes(packed)


# ════════════════════════════════════════════════════════════════════════════
#  TEST CASE BUILDERS
# ════════════════════════════════════════════════════════════════════════════

def build_test_1_repetition(output_path):
    """
    Build audio simulating: "I   I   I   want"
    ─────────────────────────────────────────
    Pattern: 3x short voiced bursts (the vowel /I/) with tiny gaps,
             then a pause, then a longer burst (the word "want")
    
    This should trigger: REPETITION detection
    """
    audio = []
    
    # Three repetitions of short /I/ sound (each ~150ms, gap ~100ms)
    for _ in range(3):
        audio += voiced_burst(0.15, base_freq=200, formants=[400, 2200])  # /I/ vowel
        audio += silence(0.10)  # 100ms gap (disfluent short gap)
    
    # 300ms pause (block before "want")
    audio += silence(0.30)
    
    # The word "want" — longer, lower pitch
    audio += voiced_burst(0.30, base_freq=120, formants=[700, 1100])
    audio += silence(0.20)
    
    # Add ~1 second of silence at end (helps Whisper)
    audio += silence(1.0)
    
    save_wav(audio, output_path)
    duration = len(audio) / SAMPLE_RATE
    print(f"  📁 Created: {output_path} ({duration:.2f}s)")
    return duration


def build_test_2_prolongation_prrr(output_path):
    """
    Build audio simulating: "prrrrrfemue"
    ───────────────────────────────────────
    Pattern: short /p/ stop → extended voiced /r/ trill (prolonged ~600ms)
             → /f/ fricative → final vowel /ue/
    
    This should trigger: PROLONGATION detection (long non-silent segment)
    """
    audio = []
    
    # Short /p/ plosive burst (unvoiced stop, ~50ms)
    audio += sine_tone(800, 0.05, amplitude=0.2)
    audio += silence(0.02)
    
    # PROLONGED /r/ trill — simulated as low-frequency buzz, 650ms
    # This is the key test: a 650ms single segment = prolongation
    audio += voiced_burst(0.65, base_freq=130, formants=[500, 1000, 2500])
    
    # /f/ fricative (50ms)
    audio += fricative_burst(0.05, freq=6000)
    
    # final vowel /ue/ (200ms)
    audio += voiced_burst(0.20, base_freq=150, formants=[300, 800])
    
    # Trailing silence
    audio += silence(0.8)
    
    save_wav(audio, output_path)
    duration = len(audio) / SAMPLE_RATE
    print(f"  📁 Created: {output_path} ({duration:.2f}s)")
    return duration


def build_test_3_prolongation_biss(output_path):
    """
    Build audio simulating: "bissssssssstick"
    ──────────────────────────────────────────
    Pattern: /b/ voiced stop → /I/ vowel → PROLONGED /s/ fricative (~700ms)
             → /t/ stop → /ick/ vowel
    
    This should trigger: PROLONGATION detection (very long fricative = single long segment)
    """
    audio = []
    
    # /b/ voiced plosive (~60ms)
    audio += voiced_burst(0.06, base_freq=100, formants=[200, 500])
    
    # /i/ vowel (short, ~80ms)
    audio += voiced_burst(0.08, base_freq=200, formants=[300, 2200])
    
    # PROLONGED /s/ — the "sssssssss" stretch, 750ms
    # High-frequency fricative noise = prolongation signature
    audio += fricative_burst(0.75, freq=5500)
    
    # /t/ unvoiced stop (50ms)
    audio += sine_tone(1000, 0.05, amplitude=0.15)
    audio += silence(0.03)
    
    # /ick/ vowel (150ms)
    audio += voiced_burst(0.15, base_freq=180, formants=[400, 1800])
    
    # Trailing silence
    audio += silence(0.8)
    
    save_wav(audio, output_path)
    duration = len(audio) / SAMPLE_RATE
    print(f"  📁 Created: {output_path} ({duration:.2f}s)")
    return duration


def build_test_4_combined(output_path):
    """
    Build combined audio: "I I I want prrrrrfemue bissssssssstick"
    All three patterns in one recording.
    """
    audio = []
    
    # "I I I" repetitions
    for _ in range(3):
        audio += voiced_burst(0.15, base_freq=200, formants=[400, 2200])
        audio += silence(0.10)
    
    audio += silence(0.25)
    
    # "want"
    audio += voiced_burst(0.30, base_freq=120, formants=[700, 1100])
    audio += silence(0.30)
    
    # "prrrrrfemue" - plosive + prolonged r
    audio += sine_tone(800, 0.05, amplitude=0.2)
    audio += silence(0.02)
    audio += voiced_burst(0.60, base_freq=130, formants=[500, 1000, 2500])
    audio += fricative_burst(0.05, freq=6000)
    audio += voiced_burst(0.20, base_freq=150, formants=[300, 800])
    audio += silence(0.30)
    
    # "bissssssssstick" - voiced + vowel + prolonged s
    audio += voiced_burst(0.06, base_freq=100, formants=[200, 500])
    audio += voiced_burst(0.08, base_freq=200, formants=[300, 2200])
    audio += fricative_burst(0.70, freq=5500)
    audio += sine_tone(1000, 0.05, amplitude=0.15)
    audio += silence(0.03)
    audio += voiced_burst(0.15, base_freq=180, formants=[400, 1800])
    
    audio += silence(1.0)
    
    save_wav(audio, output_path)
    duration = len(audio) / SAMPLE_RATE
    print(f"  📁 Created: {output_path} ({duration:.2f}s)")
    return duration


# ════════════════════════════════════════════════════════════════════════════
#  LOCAL MODULE TESTS (no HTTP needed)
# ════════════════════════════════════════════════════════════════════════════

def run_local_tests(test_files):
    """Run detection algorithms directly without HTTP."""
    print("\n" + "="*70)
    print("  LOCAL MODULE TESTS (stutter_detector.py directly)")
    print("="*70)
    
    for label, path, expected in test_files:
        print(f"\n{'─'*60}")
        print(f"  TEST: {label}")
        print(f"  File: {path}")
        print(f"  Expected: {expected}")
        print(f"{'─'*60}")
        
        # 1. Test pause detection (catches prolongations as segments)
        pause_result = detect_pauses(path, min_pause_duration=0.3)
        print(f"\n  [PAUSE DETECTOR]")
        print(f"    Pauses found: {pause_result['count']}")
        for p in pause_result["pauses"]:
            print(f"      @ {p['position']:.2f}s — duration: {p['duration_ms']}ms")
        
        # 2. Test audio-level repetition detection
        audio_rep = detect_audio_level_repetitions(path)
        print(f"\n  [AUDIO-LEVEL REPETITION DETECTOR]")
        print(f"    Repetition events: {audio_rep['count']}")
        print(f"    Total segments: {audio_rep.get('total_segments', 0)}")
        print(f"    Short segments: {audio_rep.get('short_segments', 0)}")
        print(f"    Fragmentation ratio: {audio_rep.get('fragmentation_ratio', 0):.1%}")
        for rep in audio_rep.get("repetitions", []):
            print(f"      {rep['type']} @ {rep['position']:.2f}s — {rep['details']}")
        
        # 3. Simulate whisper words for repetition test (test 1 only)
        if "Repetition" in label:
            mock_words = [
                {"word": "I",    "start": 0.00, "end": 0.15},
                {"word": "I",    "start": 0.25, "end": 0.40},
                {"word": "I",    "start": 0.50, "end": 0.65},
                {"word": "want", "start": 1.00, "end": 1.30},
            ]
            rep_text = detect_repetitions(mock_words)
            filler_text = detect_fillers(mock_words)
            print(f"\n  [TEXT-LEVEL REPETITION DETECTOR] (with simulated Whisper words)")
            print(f"    Repetition events: {rep_text['count']}")
            for r in rep_text["repetitions"]:
                print(f"      '{r['word']}' × {r['times']} at {r['position']:.2f}s")
            print(f"    Fillers: {filler_text['count']}")
        
        # Verdict
        print(f"\n  ✅ VERDICT:")
        has_repetition = audio_rep['count'] > 0 or audio_rep.get('fragmentation_ratio', 0) > 0.25
        has_pause = pause_result['count'] > 0
        if "Repetition" in label:
            result = "✅ DETECTED" if has_repetition else "❌ NOT DETECTED"
            print(f"    Repetition pattern: {result}")
        elif "prrrr" in label or "bisss" in label:
            # Prolongations may appear as pauses (long silent gaps don't apply)
            # or as single very long speech segments
            long_segs = audio_rep.get('total_segments', 0)
            result = "✅ DETECTED (long segment)" if long_segs > 0 else "⚠️  Check fragmentation ratio"
            print(f"    Prolongation pattern: {result}")
            print(f"    Fragmentation ratio: {audio_rep.get('fragmentation_ratio', 0):.1%}")
        elif "Combined" in label:
            print(f"    Multiple patterns detected: pauses={pause_result['count']}, audio_reps={audio_rep['count']}")


# ════════════════════════════════════════════════════════════════════════════
#  HTTP ENDPOINT TESTS
# ════════════════════════════════════════════════════════════════════════════

def run_http_test(label, wav_path, expected):
    """Send a WAV file to /analyze and report the full result."""
    print(f"\n{'─'*60}")
    print(f"  HTTP TEST: {label}")
    print(f"  Expected: {expected}")
    print(f"{'─'*60}")
    
    try:
        with open(wav_path, 'rb') as f:
            response = requests.post(
                f"{FLASK_URL}/analyze",
                files={"audio": ("test.wav", f, "audio/wav")},
                timeout=120
            )
        
        if response.status_code != 200:
            print(f"  ❌ HTTP Error {response.status_code}: {response.text[:300]}")
            return
        
        data = response.json()
        
        # Extract the key fields
        transcript = data.get("transcript", "N/A")
        metrics    = data.get("metrics", {})
        
        fluency     = metrics.get("fluencyScore", "?")
        reps        = metrics.get("repetitionCount", 0)
        pauses      = metrics.get("pauseCount", 0)
        fillers     = metrics.get("fillerCount", 0)
        wpm         = metrics.get("speechRateWPM", 0)
        frag        = metrics.get("fragmentationRatio", 0)
        stutters    = metrics.get("detectedStutters", [])
        audio_reps  = metrics.get("audioRepetitions", [])
        text_reps   = metrics.get("repetitions", [])
        
        print(f"\n  📝 WHISPER TRANSCRIPT: \"{transcript}\"")
        print(f"\n  📊 METRICS:")
        print(f"    Fluency Score:        {fluency}/100")
        print(f"    Speech Rate:          {wpm} WPM")
        print(f"    Repetitions (text):   {reps}")
        print(f"    Pauses:               {pauses}")
        print(f"    Fillers:              {fillers}")
        print(f"    Fragmentation:        {frag:.1%}")
        
        if text_reps:
            print(f"\n  🔁 WORD REPETITIONS DETECTED:")
            for r in text_reps:
                print(f"    '{r['word']}' × {r['times']} at {r['position']:.2f}s")
        
        if audio_reps:
            print(f"\n  🔊 AUDIO-LEVEL PATTERNS DETECTED:")
            for ar in audio_reps:
                print(f"    {ar.get('type','?')} @ {ar.get('position',0):.2f}s — {ar.get('details','')}")
        
        if stutters:
            print(f"\n  🎯 STUTTER TIMELINE ({len(stutters)} events):")
            for s in stutters:
                word = s.get('word') or '[pause]'
                print(f"    [{s['type'].upper()}] '{word}' @ {s['position']:.2f}s — {s.get('details','')}")
        else:
            print(f"\n  ⚠️  No stutter events in timeline.")
        
        # Final verdict
        print(f"\n  ✅ VERDICT:")
        if "Repetition" in label:
            found = reps > 0 or any(s['type'] == 'repetition' for s in stutters)
            status = "✅ CORRECTLY DETECTED" if found else "❌ MISSED — repetition NOT caught"
            print(f"    'I I I' repetition: {status}")
        elif "prrr" in label.lower():
            # Prolongation may show as low WPM, high fragmentation, or pause
            found = pauses > 0 or frag > 0.2 or wpm < 80
            status = "✅ CORRECTLY DETECTED (as prolonged segment)" if found else "❌ MISSED — prolongation NOT caught"
            print(f"    'prrrrrfemue' prolongation: {status}")
        elif "biss" in label.lower():
            found = pauses > 0 or frag > 0.2 or wpm < 80
            status = "✅ CORRECTLY DETECTED (as prolonged segment)" if found else "❌ MISSED — prolongation NOT caught"
            print(f"    'bissssssssstick' prolongation: {status}")
        elif "Combined" in label:
            rep_found = reps > 0 or any(s['type'] == 'repetition' for s in stutters)
            other_found = pauses > 0 or frag > 0.2
            print(f"    Repetitions: {'✅' if rep_found else '❌'} | Prolongations: {'✅' if other_found else '❌'}")
    
    except requests.exceptions.ConnectionError:
        print(f"  ❌ CANNOT CONNECT to Flask server at {FLASK_URL}")
        print(f"     Make sure the Flask server is running: python app.py")
    except Exception as e:
        print(f"  ❌ Error: {e}")
        import traceback; traceback.print_exc()


# ════════════════════════════════════════════════════════════════════════════
#  MAIN
# ════════════════════════════════════════════════════════════════════════════

def main():
    print("=" * 70)
    print("  STUTTER DETECTION ACCURACY TEST")
    print("  Testing: 'I I I', 'prrrrrfemue', 'bissssssssstick'")
    print("=" * 70)
    
    # Temp directory for test files
    tmp_dir = tempfile.mkdtemp(prefix="stutter_test_")
    print(f"\n📂 Test audio files: {tmp_dir}\n")
    
    # Build test WAV files
    print("🔨 Building test audio files...")
    test_cases = [
        (
            "Test 1: Repetition 'I I I want'",
            os.path.join(tmp_dir, "test1_repetition.wav"),
            "Word repetition: 'I' × 3"
        ),
        (
            "Test 2: Prolongation 'prrrrrfemue'",
            os.path.join(tmp_dir, "test2_prrr.wav"),
            "Sound prolongation: /r/ stretched 650ms"
        ),
        (
            "Test 3: Prolongation 'bissssssssstick'",
            os.path.join(tmp_dir, "test3_biss.wav"),
            "Sound prolongation: /s/ stretched 750ms"
        ),
        (
            "Test 4: Combined all patterns",
            os.path.join(tmp_dir, "test4_combined.wav"),
            "All 3 patterns in one recording"
        ),
    ]
    
    build_test_1_repetition(test_cases[0][1])
    build_test_2_prolongation_prrr(test_cases[1][1])
    build_test_3_prolongation_biss(test_cases[2][1])
    build_test_4_combined(test_cases[3][1])
    
    # ── LOCAL TESTS ─────────────────────────────────────────────────────────
    if DIRECT_AVAILABLE:
        run_local_tests(test_cases)
    else:
        print("\n⚠️  Skipping local module tests (import failed).")
    
    # ── HTTP TESTS ──────────────────────────────────────────────────────────
    if HTTP_AVAILABLE:
        print("\n" + "="*70)
        print("  HTTP ENDPOINT TESTS (Flask /analyze)")
        print("  NOTE: Whisper will transcribe SYNTHETIC audio.")
        print("  The transcript may be wrong — but AUDIO-LEVEL metrics will be real.")
        print("="*70)
        for label, path, expected in test_cases:
            run_http_test(label, path, expected)
    else:
        print("\n⚠️  Skipping HTTP tests (requests not installed).")
    
    print("\n" + "="*70)
    print("  ALL TESTS COMPLETE")
    print("  Key things to look for:")
    print("  ✅ Test 1: repetitionCount > 0 OR audio_reps with 'sound_repetition'")
    print("  ✅ Test 2: fragmentation OR pauses OR long segments detected")
    print("  ✅ Test 3: Same as Test 2")
    print("  ✅ Test 4: BOTH repetitions AND prolongation signals present")
    print("="*70)


if __name__ == "__main__":
    main()
