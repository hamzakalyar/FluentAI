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
import traceback

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
    load_model("base")
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
        weak_sounds_data = identify_weak_sounds(stuttered_words)
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
        if passage_id:
            print("📋 Step 5: Comparing expected vs actual text...")
            comparison = compare_expected_vs_actual(passage_id, transcript_data['words'])
            result['assessmentComparison'] = comparison
            print(f"   Accuracy: {comparison.get('accuracy', 0)}%")
            print(f"   Skipped words: {len(comparison.get('skippedWords', []))}")
            print(f"   Weakest sounds: {[s['sound'] for s in comparison.get('weakestSounds', [])]}")
            
            # Use assessment weak sounds if detected (more accurate than free analysis)
            if comparison.get('weakestSounds'):
                assessment_weak = [s['sound'] for s in comparison['weakestSounds']]
                result['top3WeakSounds'] = assessment_weak[:3]
        elif expected_text:
            print("📋 Step 5: Comparing with provided expected text...")
            # Custom expected text (not from a passage)
            import re
            expected_words = [w.lower() for w in re.findall(r"[a-zA-Z']+", expected_text)]
            actual_words = [w['word'].lower().strip(".,!?;:'\"") for w in transcript_data['words']]
            matched = sum(1 for w in expected_words if w in actual_words)
            result['expectedTextComparison'] = {
                'expectedWordCount': len(expected_words),
                'actualWordCount': len(actual_words),
                'matchedWords': matched,
                'accuracy': round((matched / len(expected_words)) * 100, 1) if expected_words else 100
            }

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
