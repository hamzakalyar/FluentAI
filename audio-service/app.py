"""
AUDIO ANALYSIS SERVICE — Main Flask Application
=================================================
This is the Python microservice that handles all AI/audio processing.

ENDPOINTS:
  GET  /health            → Service health check
  POST /analyze           → Full audio analysis (Whisper + Stutter + NLP)
  POST /generate-exercises → Get practice exercises for weak sounds
  GET  /available-sounds   → List all sounds with exercises

THE FULL PIPELINE (when /analyze is called):
  1. Receive WAV audio file
  2. WHISPER: Transcribe audio → text with word timestamps
  3. STUTTER DETECTOR: Find repetitions, pauses, fillers, calculate WPM
  4. NLP ANALYZER: POS tagging, complexity analysis, avoidance detection
  5. PHONEME MAPPER: Map stuttered words → onset phonemes → weak sounds
  6. Return complete analysis JSON to Express backend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# SILENCE VERBOSE LOGS BEFORE ANY OTHER IMPORTS
os.environ["NUMBA_LOG_LEVEL"] = "ERROR"
os.environ["KMP_WARNINGS"] = "0"

import traceback
import logging

# SILENCE VERBOSE LOGS (Fix for "too much long" logs)
logging.getLogger('numba').setLevel(logging.WARNING)
logging.getLogger('werkzeug').setLevel(logging.ERROR) # Only show errors for the web server

# CRITICAL FIX FOR WINDOWS: 
# Ensure ffmpeg.exe located in this folder can be found by Whisper/subprocess
os.environ["PATH"] += os.pathsep + os.path.dirname(os.path.abspath(__file__))

# Import our modules
from whisper_service import transcribe_audio, load_model
from stutter_detector import analyze_audio
from nlp_analyzer import analyze_transcript
from phoneme_mapper import identify_weak_sounds
from practice_generator import get_exercises, get_all_available_sounds
from assessment_passages import get_all_passages, get_passage_by_id, compare_expected_vs_actual

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# Pre-load the Whisper model at startup (takes ~10 seconds first time)
print("\n🔄 Initializing Audio Analysis Service...")
try:
    load_model("small")  # Upgraded from 'base' — better accuracy on dysfluent/accented speech
except Exception as e:
    print(f"⚠️ Whisper model loading deferred: {e}")


@app.route('/health', methods=['GET'])
def health():
    """Health check — verify all services are loaded."""
    return jsonify({
        'status': 'ok',
        'message': 'Audio analysis service is running',
        'services': {
            'whisper': 'loaded',
            'stutter_detector': 'ready',
            'nlp_analyzer': 'ready',
            'phoneme_mapper': 'ready',
            'practice_generator': 'ready'
        }
    })


@app.route('/analyze', methods=['POST'])
def analyze():
    """
    MAIN ENDPOINT — Full audio analysis pipeline.
    
    Expects:
        - Audio file in 'audio' field (WAV/WebM format)
    
    Returns:
        JSON with:
        - transcript: {text, words}
        - metrics: {fluencyScore, speechRateWPM, repetitions, pauses, fillers, ...}
        - nlpAnalysis: {posDistribution, complexity, avoidanceDetected, ...}
        - weakSoundsDetected: [{sound, frequency, words}, ...]
    
    This endpoint is called by the Express backend after a user
    uploads a recording. The complete flow is:
    
    User → React → Express → THIS ENDPOINT → Express → MongoDB → React
    """
    try:
        # Step 0: Validate input
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400

        # Check for assessment mode (passageId sent with the audio)
        passage_id = request.form.get('passageId', None)
        expected_text = request.form.get('expectedText', None)

        # Save the uploaded file temporarily
        filepath = os.path.join(UPLOAD_FOLDER, audio_file.filename)
        audio_file.save(filepath)
        print(f"\n📂 Received audio file: {audio_file.filename}")
        if passage_id:
            print(f"📋 Assessment mode: passage '{passage_id}'")

        # ============================================
        # STEP 1: WHISPER TRANSCRIPTION
        # ============================================
        print("🎤 Step 1: Transcribing with Whisper...")
        transcript_data = transcribe_audio(filepath)
        print(f"   Text: {transcript_data['text'][:100]}...")
        print(f"   Words: {len(transcript_data['words'])}")
        print(f"   Duration: {transcript_data['duration']}s")

        # ============================================
        # STEP 2: STUTTER DETECTION
        # ============================================
        print("🔍 Step 2: Running stutter detection...")
        metrics = analyze_audio(filepath, transcript_data)
        print(f"   Fluency Score: {metrics['fluencyScore']}/100")
        print(f"   Repetitions: {metrics['repetitionCount']}")
        print(f"   Pauses: {metrics['pauseCount']}")
        print(f"   Fillers: {metrics['fillerCount']}")
        print(f"   WPM: {metrics['speechRateWPM']}")

        # ============================================
        # STEP 3: NLP ANALYSIS
        # ============================================
        print("🧠 Step 3: Running NLP analysis...")
        # Get list of stuttered words for NLP analysis
        stuttered_words = [r["word"] for r in metrics.get("repetitions", [])]
        nlp_results = analyze_transcript(transcript_data["text"], stuttered_words)
        print(f"   Vocabulary Level: {nlp_results['vocabularyLevel']}")
        print(f"   Dominant Stutter Type: {nlp_results['dominantStutterType']}")
        print(f"   Avoidance Detected: {nlp_results['avoidanceDetected']}")

        # ============================================
        # STEP 4: PHONEME MAPPING (Weak Sounds)
        # ============================================
        print("🔤 Step 4: Mapping to phonemes...")

        # Signal 1: Word-level repetitions (classic stutter)
        rep_words = [r["word"] for r in metrics.get("repetitions", [])]

        # Signal 2: Paused words (blocks — silence before a word means struggle at onset)
        paused_positions = [p["position"] for p in metrics.get("pauses", [])]
        paused_words = []
        for w in transcript_data.get("words", []):
            for pause_pos in paused_positions:
                if abs(w["start"] - pause_pos) < 1.5:
                    paused_words.append(w["word"])
                    break

        # Signal 3: Audio-burst words (rapid short sound clusters = sound-level blocks like 'p-p-peter')
        # detect_audio_level_repetitions is already computed inside analyze_audio — re-use its output
        # from the detectedStutters timeline which includes sound_repetition events
        burst_words = []
        # Pre-build expected word list from passage for accurate phoneme mapping
        expected_words_list = []
        if passage_id and passage_id != 'dynamic':
            _passage = get_passage_by_id(passage_id)
            if _passage:
                import re as _re
                expected_words_list = _re.findall(r"[a-zA-Z']+", _passage.get('text', ''))

        for stutter_event in metrics.get("detectedStutters", []):
            if stutter_event.get("type") == "sound_repetition":
                burst_pos = stutter_event.get("position", -1)
                # Find the Whisper word closest to (and after) the burst
                closest_whisper = None
                closest_idx = None
                min_dist = float("inf")
                for idx_w, w in enumerate(transcript_data.get("words", [])):
                    dist = w["start"] - burst_pos
                    if 0 <= dist < 2.0 and dist < min_dist:
                        min_dist = dist
                        closest_whisper = w["word"]
                        closest_idx = idx_w

                if closest_whisper:
                    # FIX 5: Prefer the expected passage word at same position
                    # Whisper hallucinates (e.g. says "speak" when user said "p-p-peter")
                    # The expected word is the ground truth for phoneme mapping
                    if expected_words_list and closest_idx is not None and closest_idx < len(expected_words_list):
                        burst_words.append(expected_words_list[closest_idx])
                    else:
                        burst_words.append(closest_whisper)

        # Combine all signals for weak sound identification
        all_weak_candidates = rep_words + paused_words + burst_words
        weak_sounds_data = identify_weak_sounds(all_weak_candidates)
        print(f"   Signals — reps:{len(rep_words)} pauses:{len(paused_words)} bursts:{len(burst_words)}")
        print(f"   Top 3 weak sounds: {weak_sounds_data['top3']}")

        # ============================================
        # BUILD RESPONSE
        # ============================================
        result = {
            'status': 'completed',
            'transcript': {
                'text': transcript_data['text'],
                'words': transcript_data['words']
            },
            'metrics': metrics,
            'nlpAnalysis': nlp_results,
            'weakSoundsDetected': weak_sounds_data['weakSounds'],
            'top3WeakSounds': weak_sounds_data['top3'],
            'duration': transcript_data['duration']
        }

        # ============================================
        # STEP 5: ASSESSMENT COMPARISON (if passage was specified)
        # ============================================
        if passage_id and passage_id != 'dynamic':
            print("📋 Step 5: Comparing expected vs actual text...")
            comparison = compare_expected_vs_actual(passage_id, transcript_data['words'])
            result['assessmentComparison'] = comparison
            print(f"   Accuracy: {comparison.get('accuracy', 0)}%")
            print(f"   Skipped words: {len(comparison.get('skippedWords', []))}")
            
            if comparison.get('weakestSounds'):
                assessment_weak = [s['sound'] for s in comparison['weakestSounds']]
                result['top3WeakSounds'] = assessment_weak[:3]
                
        elif expected_text:
            print("📋 Step 5: Comparing with provided expected text...")
            import re
            expected_words = [w.lower() for w in re.findall(r"[a-zA-Z']+", expected_text)]
            actual_words = [w['word'].lower().strip(".,!?;:'\"") for w in transcript_data['words']]
            
            matched = sum(1 for w in expected_words if w in actual_words)
            result['assessmentComparison'] = {
                'passageId': passage_id or 'custom',
                'expectedWordCount': len(expected_words),
                'actualWordCount': len(actual_words),
                'matchedWords': matched,
                'accuracy': round((matched / len(expected_words)) * 100, 1) if expected_words else 100,
                'skippedWords': [],
                'soundsTestedResults': {}
            }
            print(f"   Accuracy: {result['assessmentComparison']['accuracy']}%")

        print(f"\n✅ Analysis complete! Fluency Score: {metrics['fluencyScore']}/100")

        # Clean up temp file
        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify(result)

    except Exception as e:
        print(f"\n❌ Analysis error: {e}")
        traceback.print_exc()
        
        # Clean up on error
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        
        return jsonify({
            'status': 'failed',
            'error': str(e)
        }), 500


@app.route('/generate-exercises', methods=['POST'])
def generate_exercises():
    """
    Generate personalized practice exercises.
    
    Expects JSON:
    {
        "weakSounds": ["S", "TH", "R"],
        "difficulty": "easy",
        "count": 5
    }
    
    Returns:
    {
        "exercises": [
            {
                "targetSound": "S",
                "soundLabel": "S (as in 'sun')",
                "difficulty": "easy",
                "sentence": "The sun is shining today.",
                "targetWords": ["sun", "shining"],
                "totalTargetWords": 2
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        weak_sounds = data.get('weakSounds', [])
        difficulty = data.get('difficulty', 'easy')
        count = data.get('count', 5)
        
        if not weak_sounds:
            return jsonify({'error': 'No weak sounds provided'}), 400
        
        if difficulty not in ('easy', 'medium', 'hard'):
            return jsonify({'error': 'Invalid difficulty. Use: easy, medium, hard'}), 400
        
        exercises = get_exercises(weak_sounds, difficulty, count)
        
        return jsonify({
            'exercises': exercises,
            'totalCount': len(exercises),
            'difficulty': difficulty,
            'targetSounds': weak_sounds
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/available-sounds', methods=['GET'])
def available_sounds():
    """List all sounds that have practice exercises available."""
    try:
        sounds = get_all_available_sounds()
        return jsonify({'sounds': sounds})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/assessment-passages', methods=['GET'])
def list_passages():
    """List all available assessment passages (metadata only)."""
    try:
        passages = get_all_passages()
        return jsonify({'passages': passages})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/assessment-passages/dynamic', methods=['GET'])
def get_dynamic_passage():
    """Return a random passage for the 'Random' button in RecordingStudio."""
    import random
    try:
        passages = get_all_passages()
        if not passages:
            return jsonify({'error': 'No passages available'}), 404
        chosen = random.choice(passages)
        full_passage = get_passage_by_id(chosen['id'])
        return jsonify({'passage': full_passage})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/assessment-passages/<passage_id>', methods=['GET'])
def get_passage(passage_id):
    """Get a specific passage with full text and sound map."""
    try:
        if passage_id == 'dynamic':
            # Dynamic generation based on difficulty parameter
            difficulty = request.args.get('difficulty', 'medium')
            import random
            from practice_generator import EXERCISE_DATABASE
            
            # Gather all sentences for this difficulty across all sounds
            all_sentences = []
            for sound, difficulties in EXERCISE_DATABASE.items():
                if difficulty in difficulties:
                    all_sentences.extend(difficulties[difficulty])
            
            if not all_sentences:
                return jsonify({'error': 'No sentences found for this difficulty'}), 404
            
            # Pick random sentences to form a passage of about 50 words
            random.shuffle(all_sentences)
            passage_text = []
            word_count = 0
            for sentence in all_sentences:
                passage_text.append(sentence)
                word_count += len(sentence.split())
                if word_count >= 50:
                    break
            
            text = " ".join(passage_text)
            
            # Build a mock passage object
            dynamic_passage = {
                "id": "dynamic",
                "title": f"Dynamic Reading ({difficulty.title()})",
                "description": "A completely randomized reading passage generated on the fly.",
                "difficulty": difficulty,
                "estimatedDuration": 30,
                "targetSounds": ["Mixed"],
                "text": text,
                "wordCount": word_count,
                "soundMap": {} # We can skip soundMap for dynamic, or we could calculate it. Whisper analysis falls back to expectedText.
            }
            return jsonify({'passage': dynamic_passage})
            
        passage = get_passage_by_id(passage_id)
        if not passage:
            return jsonify({'error': 'Passage not found'}), 404
        return jsonify({'passage': passage})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print('\n🎤 Audio Analysis Service')
    print('=' * 40)
    print('📍 Endpoints:')
    print('   GET  /health               → Health check')
    print('   POST /analyze              → Full audio analysis')
    print('   POST /generate-exercises   → Practice exercises')
    print('   GET  /available-sounds     → List available sounds')
    print('   GET  /assessment-passages  → List assessment passages')
    print('   GET  /assessment-passages/:id → Get passage details')
    print('=' * 40)
    app.run(debug=True, port=5000)
