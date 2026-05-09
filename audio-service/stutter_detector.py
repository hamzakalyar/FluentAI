"""
STUTTER DETECTOR — Core Detection Algorithms
==============================================
This module takes the Whisper transcript + raw audio and detects
4 types of stuttering patterns:

1. REPETITIONS  — "I-I-I want" (same word repeated consecutively)
2. PAUSES       — Abnormally long silences mid-sentence (>500ms)
3. FILLERS      — "um", "uh", "like", "you know"
4. SPEECH RATE  — Words per minute (normal: 120-150 WPM)

Then combines everything into a FLUENCY SCORE (0-100).

HOW EACH DETECTOR WORKS:
========================

REPETITION DETECTOR:
  Input:  Whisper word list ["I", "I", "I", "want", "to", "the", "the", "store"]
  Logic:  Walk through words. If word[i] == word[i-1], mark as repetition.
  Output: [{word: "I", times: 3, position: 0.0}, {word: "the", times: 2, position: 1.8}]

PAUSE DETECTOR (uses Librosa):
  Input:  Raw audio WAV file
  Logic:  librosa.effects.split() finds all non-silent intervals.
          Gap between intervals > 500ms = abnormal pause.
  Output: [{position: 3.5, duration_ms: 850}, {position: 7.2, duration_ms: 620}]

FILLER DETECTOR:
  Input:  Whisper word list
  Logic:  Check each word against known filler list
  Output: ["um", "uh", "like", "um"]

SPEECH RATE:
  Input:  Word count + total duration
  Logic:  (total_words / duration_minutes)
  Output: 95 WPM

FLUENCY SCORE:
  Formula: 100 - (repetitions × 5) - (pauses × 4) - (fillers × 2) - (WPM_penalty)
  Output: 66.5 / 100
"""

import librosa
import numpy as np


def detect_repetitions(words):
    """
    Detect consecutive word repetitions in the transcript.
    
    Stuttering often manifests as repeating the same word multiple times:
    "I-I-I want" or "the-the store"
    
    Args:
        words (list): List of word dicts from Whisper
                      [{'word': 'I', 'start': 0.0, 'end': 0.15}, ...]
    
    Returns:
        dict: {
            'count': 2,        # number of repetition EVENTS
            'total_repeated': 3, # total extra repeated words
            'repetitions': [
                {'word': 'I', 'times': 3, 'position': 0.0, 'indices': [0,1,2]},
                {'word': 'the', 'times': 2, 'position': 1.8, 'indices': [7,8]}
            ]
        }
    """
    if not words or len(words) < 2:
        return {"count": 0, "total_repeated": 0, "repetitions": []}
    
    repetitions = []
    i = 0
    
    while i < len(words):
        # Get the current word (lowercase, stripped of punctuation)
        current = words[i]["word"].lower().strip(".,!?;:'\"")
        
        # Skip very short words that might be noise
        if len(current) == 0:
            i += 1
            continue
        
        # Count how many times this word repeats consecutively
        repeat_count = 1
        indices = [i]
        j = i + 1
        
        while j < len(words):
            next_word = words[j]["word"].lower().strip(".,!?;:'\"")
            if next_word == current:
                repeat_count += 1
                indices.append(j)
                j += 1
            else:
                break
        
        # If word appeared 2+ times consecutively, it's a repetition
        if repeat_count >= 2:
            repetitions.append({
                "word": current,
                "times": repeat_count,
                "position": words[i]["start"],
                "indices": indices
            })
        
        # Move past the repeated block
        i = j if repeat_count >= 2 else i + 1
    
    # Total extra repetitions (times - 1 for each event, since saying it once is normal)
    total_repeated = sum(r["times"] - 1 for r in repetitions)
    
    return {
        "count": len(repetitions),       # How many repetition EVENTS
        "total_repeated": total_repeated, # Total extra words spoken
        "repetitions": repetitions
    }


def detect_pauses(audio_path, min_pause_duration=0.5, silence_threshold=30):
    """
    Detect abnormally long pauses/silences in the audio.
    
    Normal speech has ~200-400ms pauses between phrases (breathing).
    Pauses > 500ms mid-sentence often indicate a BLOCK (type of stutter).
    
    Uses Librosa to find silent intervals in the audio signal.
    
    Args:
        audio_path (str): Path to WAV file
        min_pause_duration (float): Minimum pause length in seconds to flag (default: 0.5s)
        silence_threshold (int): dB threshold below which audio is considered silent (default: 30)
    
    Returns:
        dict: {
            'count': 3,
            'total_duration_ms': 2100,
            'pauses': [
                {'position': 3.5, 'duration_ms': 850},
                {'position': 7.2, 'duration_ms': 620},
                {'position': 12.1, 'duration_ms': 630}
            ]
        }
    
    HOW librosa.effects.split() WORKS:
    - Converts audio to amplitude envelope
    - Finds intervals where amplitude is ABOVE the threshold (speech)
    - Returns array of [start_sample, end_sample] for each speech segment
    - The GAPS between these segments are the silent pauses
    """
    try:
        # Load audio file
        audio, sr = librosa.load(audio_path, sr=16000)
        
        # Find non-silent intervals
        # top_db=30 means anything 30dB below the peak is "silence"
        intervals = librosa.effects.split(audio, top_db=silence_threshold)
        
        pauses = []
        
        if len(intervals) < 2:
            return {"count": 0, "total_duration_ms": 0, "pauses": []}
        
        for i in range(1, len(intervals)):
            # Gap between end of previous speech and start of next speech
            gap_start_sample = intervals[i - 1][1]  # end of previous segment
            gap_end_sample = intervals[i][0]         # start of next segment
            
            # Convert samples to seconds
            gap_duration = (gap_end_sample - gap_start_sample) / sr
            
            if gap_duration >= min_pause_duration:
                position = gap_start_sample / sr  # position in seconds
                pauses.append({
                    "position": round(position, 2),
                    "duration_ms": round(gap_duration * 1000)  # convert to milliseconds
                })
        
        total_duration = sum(p["duration_ms"] for p in pauses)
        
        return {
            "count": len(pauses),
            "total_duration_ms": total_duration,
            "pauses": pauses
        }
    
    except Exception as e:
        print(f"❌ Pause detection error: {e}")
        return {"count": 0, "total_duration_ms": 0, "pauses": []}


def detect_fillers(words):
    """
    Detect filler words / interjections in the transcript.
    
    Filler words like "um", "uh", "er" are common disfluencies.
    Excessive use indicates speech anxiety or difficulty.
    
    Note: "like" is tricky — "I like cats" is valid, but 
    "it was like um" is a filler. For simplicity, we count all instances
    but flag it in the NLP layer for context-aware filtering.
    
    Args:
        words (list): List of word dicts from Whisper
    
    Returns:
        dict: {
            'count': 4,
            'fillers': ['um', 'uh', 'like', 'um'],
            'positions': [2.3, 5.1, 7.8, 11.2]
        }
    """
    FILLER_WORDS = {
        "um", "uh", "er", "ah", "eh",
        "hmm", "hm", "mm",
        "like",      # context-dependent (filtered in NLP layer)
        "basically", 
        "actually",  # when overused
        "literally",
        "you know",
        "i mean",
        "sort of",
        "kind of"
    }
    
    detected_fillers = []
    positions = []
    
    for word_info in words:
        word = word_info["word"].lower().strip(".,!?;:'\"")
        if word in FILLER_WORDS:
            detected_fillers.append(word)
            positions.append(word_info["start"])
    
    return {
        "count": len(detected_fillers),
        "fillers": detected_fillers,
        "positions": positions
    }


def calculate_speech_rate(words, duration):
    """
    Calculate words per minute (WPM).
    
    Normal adult speech rate: 120-150 WPM
    Disfluent speech:         < 100 WPM (due to pauses, repetitions)
    Fast speech:              > 160 WPM
    
    We exclude repeated words and fillers from the count to get
    the "effective" speech rate — how fast they communicate meaning.
    
    Args:
        words (list): List of word dicts from Whisper
        duration (float): Total audio duration in seconds
    
    Returns:
        dict: {
            'wpm': 95,
            'total_words': 45,
            'effective_words': 38,  # excluding repetitions/fillers
            'duration_minutes': 0.47,
            'assessment': 'below_normal'  # below_normal, normal, above_normal
        }
    """
    if not words or duration <= 0:
        return {
            "wpm": 0, "total_words": 0, "effective_words": 0,
            "duration_minutes": 0, "assessment": "insufficient_data"
        }
    
    total_words = len(words)
    duration_minutes = duration / 60.0
    
    # Raw WPM (including all words)
    raw_wpm = total_words / duration_minutes if duration_minutes > 0 else 0
    
    # Assess the speech rate
    if raw_wpm < 100:
        assessment = "below_normal"
    elif raw_wpm <= 160:
        assessment = "normal"
    else:
        assessment = "above_normal"
    
    return {
        "wpm": round(raw_wpm),
        "total_words": total_words,
        "effective_words": total_words,  # refined after repetition removal
        "duration_minutes": round(duration_minutes, 2),
        "assessment": assessment
    }


def calculate_fluency_score(repetition_data, pause_data, filler_data, speech_rate_data):
    """
    Calculate a composite fluency score from 0 to 100.
    
    SCORING FORMULA:
    score = 100 - penalties
    
    Penalties:
    - Each repetition EVENT:     -5 points  (e.g., "I-I-I" = 1 event = -5)
    - Each abnormal pause:       -4 points
    - Each filler word:          -2 points
    - WPM below 100:             -1 point per 10 WPM below 100
    - WPM above 180:             -1 point per 10 WPM above 180
    
    EXAMPLES:
    - Perfect speech (no issues):                    100
    - 3 repetitions, 2 pauses, 4 fillers, 95 WPM:   100 - 15 - 8 - 8 - 0.5 = 68.5
    - 0 repetitions, 1 pause, 2 fillers, 130 WPM:   100 - 0 - 4 - 4 - 0 = 92
    
    Args:
        repetition_data (dict): Output from detect_repetitions()
        pause_data (dict): Output from detect_pauses()
        filler_data (dict): Output from detect_fillers()
        speech_rate_data (dict): Output from calculate_speech_rate()
    
    Returns:
        float: Fluency score between 0 and 100
    """
    score = 100.0
    
    # Penalty for repetitions (-5 per event)
    score -= repetition_data["count"] * 5
    
    # Penalty for abnormal pauses (-4 per pause)
    score -= pause_data["count"] * 4
    
    # Penalty for fillers (-2 per filler)
    score -= filler_data["count"] * 2
    
    # Penalty for abnormal speech rate
    wpm = speech_rate_data["wpm"]
    if wpm > 0 and wpm < 100:
        # Below normal: -1 point for every 10 WPM below 100
        score -= (100 - wpm) / 10
    elif wpm > 180:
        # Too fast: -1 point for every 10 WPM above 180
        score -= (wpm - 180) / 10
    
    # Clamp between 0 and 100
    score = max(0, min(100, score))
    
    return round(score, 1)


def analyze_audio(audio_path, transcript_data):
    """
    MAIN FUNCTION — Run all detection algorithms on an audio recording.
    
    This is the entry point called by the Flask API.
    It orchestrates all 4 detectors and computes the fluency score.
    
    Args:
        audio_path (str): Path to the WAV audio file
        transcript_data (dict): Output from whisper_service.transcribe_audio()
    
    Returns:
        dict: Complete stutter analysis results
    """
    words = transcript_data.get("words", [])
    duration = transcript_data.get("duration", 0)
    
    # Run all 4 detectors
    repetition_data = detect_repetitions(words)
    pause_data = detect_pauses(audio_path)
    filler_data = detect_fillers(words)
    speech_rate_data = calculate_speech_rate(words, duration)
    
    # Calculate composite fluency score
    fluency_score = calculate_fluency_score(
        repetition_data, pause_data, filler_data, speech_rate_data
    )
    
    # Build the complete metrics object
    # This structure matches the Session model in MongoDB
    metrics = {
        "fluencyScore": fluency_score,
        "speechRateWPM": speech_rate_data["wpm"],
        "speechRateAssessment": speech_rate_data["assessment"],
        "repetitionCount": repetition_data["count"],
        "pauseCount": pause_data["count"],
        "fillerCount": filler_data["count"],
        "repetitions": [
            {
                "word": r["word"],
                "times": r["times"],
                "position": r["position"]
            }
            for r in repetition_data["repetitions"]
        ],
        "pauses": pause_data["pauses"],
        "fillers": filler_data["fillers"],
        "totalWords": speech_rate_data["total_words"],
        "durationSeconds": duration,
        "detectedStutters": _build_stutter_timeline(
            repetition_data, pause_data, filler_data
        )
    }
    
    return metrics


def _build_stutter_timeline(repetition_data, pause_data, filler_data):
    """
    Build a unified timeline of all detected stuttering events,
    sorted by position in the audio. This is useful for highlighting
    stuttered moments in the UI.
    """
    timeline = []
    
    for r in repetition_data["repetitions"]:
        timeline.append({
            "type": "repetition",
            "word": r["word"],
            "position": r["position"],
            "details": f"Repeated {r['times']} times"
        })
    
    for p in pause_data["pauses"]:
        timeline.append({
            "type": "pause",
            "word": None,
            "position": p["position"],
            "details": f"Pause of {p['duration_ms']}ms"
        })
    
    for i, filler in enumerate(filler_data["fillers"]):
        position = filler_data["positions"][i] if i < len(filler_data["positions"]) else 0
        timeline.append({
            "type": "filler",
            "word": filler,
            "position": position,
            "details": f"Filler word: {filler}"
        })
    
    # Sort by position in audio
    timeline.sort(key=lambda x: x["position"])
    
    return timeline


# --- FOR TESTING ---
if __name__ == "__main__":
    # Test with mock data
    mock_words = [
        {"word": "I", "start": 0.0, "end": 0.15},
        {"word": "I", "start": 0.25, "end": 0.40},
        {"word": "I", "start": 0.50, "end": 0.65},
        {"word": "want", "start": 0.80, "end": 1.10},
        {"word": "to", "start": 1.15, "end": 1.30},
        {"word": "um", "start": 1.40, "end": 1.55},
        {"word": "go", "start": 1.70, "end": 1.90},
        {"word": "to", "start": 2.00, "end": 2.15},
        {"word": "the", "start": 2.20, "end": 2.35},
        {"word": "the", "start": 2.80, "end": 2.95},
        {"word": "store", "start": 3.00, "end": 3.30},
    ]
    
    print("=== STUTTER DETECTION TEST ===\n")
    
    rep = detect_repetitions(mock_words)
    print(f"Repetitions: {rep['count']} events, {rep['total_repeated']} extra words")
    for r in rep["repetitions"]:
        print(f"  '{r['word']}' repeated {r['times']}x at {r['position']}s")
    
    fill = detect_fillers(mock_words)
    print(f"\nFillers: {fill['count']} — {fill['fillers']}")
    
    rate = calculate_speech_rate(mock_words, 3.3)
    print(f"\nSpeech Rate: {rate['wpm']} WPM ({rate['assessment']})")
    
    score = calculate_fluency_score(rep, {"count": 1, "total_duration_ms": 600, "pauses": []}, fill, rate)
    print(f"\nFluency Score: {score}/100")
