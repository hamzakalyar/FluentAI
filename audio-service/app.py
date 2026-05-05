from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'message': 'Audio analysis service is running',
        'services': {
            'whisper': 'ready',
            'librosa': 'ready',
            'spacy': 'ready'
        }
    })


@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Analyze audio file for stuttering patterns.
    Expects a WAV/WebM audio file in the 'audio' field.
    Returns transcript + stutter metrics + NLP analysis.
    """
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    filepath = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    audio_file.save(filepath)

    # Placeholder response — will be implemented on Day 4
    result = {
        'transcript': {
            'text': 'Analysis service ready. Whisper integration pending.',
            'words': []
        },
        'metrics': {
            'fluencyScore': 0,
            'speechRateWPM': 0,
            'repetitionCount': 0,
            'pauseCount': 0,
            'fillerCount': 0,
            'repetitions': [],
            'pauses': [],
            'fillers': []
        },
        'nlpAnalysis': {
            'posDistribution': {},
            'complexity': {
                'typeTokenRatio': 0,
                'avgWordLength': 0,
                'lexicalDensity': 0
            },
            'avoidanceDetected': False
        },
        'weakSoundsDetected': [],
        'status': 'pending_implementation'
    }

    # Clean up temp file
    if os.path.exists(filepath):
        os.remove(filepath)

    return jsonify(result)


@app.route('/generate-exercises', methods=['POST'])
def generate_exercises():
    """
    Generate practice exercises based on weak sounds.
    Expects JSON with 'weakSounds' array and 'difficulty' string.
    """
    data = request.get_json()
    weak_sounds = data.get('weakSounds', [])
    difficulty = data.get('difficulty', 'easy')

    # Placeholder — will be implemented on Day 8
    return jsonify({
        'exercises': [],
        'status': 'pending_implementation'
    })


if __name__ == '__main__':
    print('🎤 Audio Analysis Service starting...')
    print('📍 Endpoints:')
    print('   GET  /health')
    print('   POST /analyze')
    print('   POST /generate-exercises')
    app.run(debug=True, port=5000)
