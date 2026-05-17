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
"""

import librosa
import numpy as np

try:
    import stutter_solver_service
    STUTTER_SOLVER_AVAILABLE = True
except ImportError as e:
    print(f"Stutter-Solver not available: {e}")
    STUTTER_SOLVER_AVAILABLE = False


def detect_repetitions(words):
    if not words or len(words) < 2:
        return {"count": 0, "total_repeated": 0, "repetitions": []}
    
    repetitions = []
    i = 0
    while i < len(words):
        current = words[i]["word"].lower().strip(".,!?;:'\"")
        if len(current) == 0:
            i += 1
            continue
        
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
        
        if repeat_count >= 2:
            repetitions.append({
                "word": current,
                "times": repeat_count,
                "position": words[i]["start"],
                "indices": indices
            })
        i = j if repeat_count >= 2 else i + 1
    
    total_repeated = sum(r["times"] - 1 for r in repetitions)
    return {
        "count": len(repetitions),
        "total_repeated": total_repeated,
        "repetitions": repetitions
    }


def detect_pauses(audio_path, min_pause_duration=0.3, silence_threshold=25):
    try:
        audio, sr = librosa.load(audio_path, sr=16000)
        intervals = librosa.effects.split(audio, top_db=silence_threshold)
        pauses = []
        
        if len(intervals) < 2:
            return {"count": 0, "total_duration_ms": 0, "pauses": []}
        
        for i in range(1, len(intervals)):
            gap_start_sample = intervals[i - 1][1]
            gap_end_sample = intervals[i][0]
            gap_duration = (gap_end_sample - gap_start_sample) / sr
            
            if gap_duration >= min_pause_duration:
                position = gap_start_sample / sr
                pauses.append({
                    "position": round(position, 2),
                    "durationMs": round(gap_duration * 1000)
                })
        
        total_duration = sum(p["durationMs"] for p in pauses)
        return {
            "count": len(pauses),
            "total_duration_ms": total_duration,
            "pauses": pauses
        }
    except Exception as e:
        print(f"❌ Pause detection error: {e}")
        return {"count": 0, "total_duration_ms": 0, "pauses": []}


def detect_audio_level_repetitions(audio_path):
    """
    Detect phoneme and word-level repetition stutters directly from raw audio.

    Handles BOTH:
      - Plosive bursts:  p-p-p-peter, b-b-b-ball  (very short, 50-200ms each)
      - Vowel repeats:   I-I-I, a-a-a              (longer, 200-500ms each)

    WHY ONSET DETECTION instead of silence-splitting:
      librosa.effects.split only finds segments separated by silence.
      The old code required segments to be < 400ms — meaning 'I' (400-600ms)
      BROKE the cluster loop. Onset detection finds the START of every sound
      event regardless of how long it lasts, which is exactly what we need.
    """
    try:
        audio, sr = librosa.load(audio_path, sr=16000)

        if len(audio) == 0:
            return {"count": 0, "repetitions": []}

        # onset_detect finds the beginning of each new sound event
        # delta=0.05 → sensitive enough to catch quiet plosives
        # units='time' → returns onset times in seconds directly
        onset_times = librosa.onset.onset_detect(
            y=audio,
            sr=sr,
            units='time',
            delta=0.05,
            wait=3           # minimum ~6ms between detected onsets
        )

        if len(onset_times) < 2:
            return {"count": 0, "repetitions": []}

        repetitions = []
        i = 0

        while i < len(onset_times):
            j = i + 1

            # Grow a cluster while consecutive onsets are within 550ms
            # 550ms covers: fast plosive bursts (50-200ms gap) AND
            # stuttered word repeats like I-I-I (200-500ms gap)
            while j < len(onset_times):
                gap_ms = (onset_times[j] - onset_times[j - 1]) * 1000
                if gap_ms < 550:
                    j += 1
                else:
                    break

            cluster_size = j - i

            if cluster_size >= 2:
                cluster_times = onset_times[i:j]
                total_ms = (cluster_times[-1] - cluster_times[0]) * 1000
                avg_gap_ms = total_ms / (len(cluster_times) - 1) if len(cluster_times) > 1 else 0

                # Guard: average gap must be < 450ms
                # This prevents flagging rapid but NORMAL fluent speech
                if avg_gap_ms < 450:
                    # Classify: phoneme burst (< 250ms avg) vs word repetition
                    stutter_subtype = "phoneme burst" if avg_gap_ms < 250 else "word repetition"
                    repetitions.append({
                        "type": "sound_repetition",
                        "position": round(float(cluster_times[0]), 2),
                        "burst_count": cluster_size,
                        "details": f"{cluster_size}x {stutter_subtype} (avg gap {avg_gap_ms:.0f}ms)"
                    })
                i = j
            else:
                i += 1

        return {"count": len(repetitions), "repetitions": repetitions}

    except Exception as e:
        print(f"❌ Audio-level repetition detection error: {e}")
        return {"count": 0, "repetitions": []}


def detect_fillers(words):
    FILLER_WORDS = {"um", "uh", "er", "ah", "eh", "hmm", "hm", "mm", "like", "basically", "actually", "literally", "you know"}
    detected = []
    positions = []
    for w in words:
        word = w["word"].lower().strip(".,!?;:'\"")
        if word in FILLER_WORDS:
            detected.append(word)
            positions.append(w["start"])
    return {"count": len(detected), "fillers": detected, "positions": positions}


def calculate_speech_rate(words, duration):
    if not words or duration <= 0:
        return {"wpm": 0, "total_words": 0, "assessment": "insufficient_data"}
    wpm = round(len(words) / (duration / 60.0))
    assessment = "below_normal" if wpm < 100 else "normal" if wpm <= 160 else "above_normal"
    return {"wpm": wpm, "total_words": len(words), "assessment": assessment}


def merge_transcript_and_stutters(whisper_words, stutters):
    merged = []
    for stutter in stutters:
        overlapping = [w["word"] for w in whisper_words if not (w["end"] < stutter["start"] or w["start"] > stutter["end"])]
        if not overlapping and whisper_words:
            closest = min(whisper_words, key=lambda w: abs(w["start"] - stutter["start"]))
            overlapping = [closest["word"]]
        merged.append({
            "type": stutter["type"],
            "word": " ".join(overlapping) if overlapping else "[silence]",
            "position": stutter["start"],
            "details": f"{stutter['type'].capitalize()} detected"
        })
    return merged


def calculate_fluency_score(repetition_data, pause_data, filler_data, speech_rate_data, audio_repetition_data=None, advanced_stutters=None, total_words=0, duration=0):
    if total_words == 0:
        return 0.0

    # 1. Calculate weighted penalty total (P_total) - Balanced Weights
    p_total = 0.0
    p_total += repetition_data["count"] * 7.0  # Middle ground
    p_total += pause_data["count"] * 3.0       # Middle ground
    p_total += filler_data["count"] * 1.5       # Middle ground
    
    if advanced_stutters:
        for s in advanced_stutters:
            if s["type"] in ["block", "prolongation"]:
                p_total += 9.0  # Middle ground
            elif s["type"] in ["replace", "missing"]:
                p_total += 4.5  # Middle ground
    
    # 2. Normalized Scoring Formula - Balanced Constant
    # S = max(0, 100 - ((P_total / N) * k))
    k = 12.5  # Re-centered for meaningful feedback
    density_penalty = (p_total / total_words) * k
    score = 100.0 - density_penalty
    
    # 3. Handle Speech Rate (WPM) with 15s Threshold
    wpm = speech_rate_data["wpm"]
    if duration >= 15.0 and wpm > 0:
        if wpm < 100:
            score -= (100 - wpm) / 5.5
        elif wpm > 185:
            score -= (wpm - 185) / 7
            
    return round(max(0, min(100, score)), 1)


def analyze_audio(audio_path, transcript_data):
    words = transcript_data.get("words", [])
    duration = transcript_data.get("duration", 0)
    transcript_text = transcript_data.get("text", "")
    
    # Calculate RMS energy of the audio file to detect silence/static/ambient noise
    try:
        audio, sr = librosa.load(audio_path, sr=16000)
        rms_energy = np.sqrt(np.mean(audio**2)) if len(audio) > 0 else 0.0
    except Exception as e:
        print(f"⚠️ Failed to calculate RMS energy: {e}")
        rms_energy = 0.0

    print(f"📊 RMS Energy: {rms_energy:.5f} | Words transcribed: {len(words)}")

    # Strict Silence/Ambient Noise/Insufficient Data Safeguard:
    # If the energy level is extremely low (silent room / static hum / dead mic),
    # or if fewer than 3 words are transcribed,
    # or if the transcript text is completely empty/whitespace,
    # then nothing was spoken. The fluency score must be exactly 0.0.
    if rms_energy < 0.008 or len(words) < 3 or not transcript_text.strip():
        print("🚨 Silent or ambient recording intercepted! Enforcing strict 0.0 fluency score.")
        return {
            "fluencyScore": 0.0, "speechRateWPM": 0, "speechRateAssessment": "insufficient_data",
            "repetitionCount": 0, "pauseCount": 0, "fillerCount": 0,
            "repetitions": [], "pauses": [], "fillers": [],
            "totalWords": len(words), "durationSeconds": duration, "detectedStutters": []
        }

    advanced_stutters = []
    if STUTTER_SOLVER_AVAILABLE:
        advanced_stutters = stutter_solver_service.predict_stutters(audio_path, transcript_text)
    
    repetition_data = detect_repetitions(words)
    filler_data = detect_fillers(words)
    speech_rate_data = calculate_speech_rate(words, duration)
    pause_data = detect_pauses(audio_path)
    audio_rep_data = detect_audio_level_repetitions(audio_path)
    
    fluency_score = calculate_fluency_score(
        repetition_data, pause_data, filler_data, speech_rate_data, 
        audio_rep_data, advanced_stutters,
        total_words=speech_rate_data["total_words"],
        duration=duration
    )
    
    # Count advanced stutters for the summary
    advanced_count = len(advanced_stutters) if advanced_stutters else 0
    
    return {
        "fluencyScore": fluency_score,
        "speechRateWPM": speech_rate_data["wpm"],
        "speechRateAssessment": speech_rate_data["assessment"],
        "repetitionCount": max(repetition_data["count"], len([s for s in advanced_stutters if s["type"] == "repetition"]) if advanced_stutters else 0),
        "pauseCount": pause_data["count"],
        "fillerCount": filler_data["count"],
        "advancedStutterCount": len([s for s in (advanced_stutters or []) if s["type"] not in ["repetition"]]),
        "repetitions": [{"word": r["word"], "times": r["times"], "position": r["position"]} for r in repetition_data["repetitions"]],
        "pauses": pause_data["pauses"],
        "fillers": filler_data["fillers"],
        "totalWords": speech_rate_data["total_words"],
        "durationSeconds": duration,
        "detectedStutters": _build_stutter_timeline(repetition_data, pause_data, filler_data, audio_rep_data, advanced_stutters, words)
    }


def _build_stutter_timeline(repetition_data, pause_data, filler_data, audio_rep_data=None, advanced_stutters=None, whisper_words=None):
    timeline = []
    if advanced_stutters and whisper_words is not None:
        timeline.extend(merge_transcript_and_stutters(whisper_words, advanced_stutters))
    else:
        for r in repetition_data["repetitions"]:
            timeline.append({"type": "repetition", "word": r["word"], "position": r["position"], "details": f"Repeated {r['times']}x"})
    
    for p in pause_data["pauses"]:
        timeline.append({"type": "pause", "word": None, "position": p["position"], "details": f"Pause of {p['durationMs']}ms"})
    
    for i, filler in enumerate(filler_data["fillers"]):
        timeline.append({"type": "filler", "word": filler, "position": filler_data["positions"][i], "details": f"Filler: {filler}"})
    
    timeline.sort(key=lambda x: x["position"])
    return timeline
