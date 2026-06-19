"""
NLP ANALYZER — Linguistic Analysis of Speech
==============================================
This module uses spaCy to analyze the LINGUISTIC patterns in the transcript.

WHY NLP?
Without NLP, we only know "the user stuttered 3 times."
With NLP, we know "the user stuttered 3 times, MOSTLY ON VERBS STARTING WITH S."

This module provides 4 analyses:

1. POS TAGGING — What TYPE of words does the user stutter on?
   (nouns? verbs? adjectives?) This guides practice exercises.

2. COMPLEXITY ANALYSIS — Is the user avoiding complex words?
   People who stutter often simplify vocabulary to avoid difficult words.

3. FILLER CONTEXT — Is "like" a filler or a real word?
   "I like cats" vs "it was like um..."

4. SENTIMENT — Is the user's speech positive/negative/neutral?
   Tracks confidence over time.
"""

import sys
import io

# Force UTF-8 output encoding for Windows command line compatibility
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import spacy

# Load spaCy model (small English model, ~12MB)
try:
    nlp = spacy.load("en_core_web_sm")
    print("✅ spaCy model loaded")
except OSError:
    print("⚠️ spaCy model not found. Run: python -m spacy download en_core_web_sm")
    nlp = None


def analyze_pos(text, stuttered_words=None):
    """
    Part-of-Speech (POS) tagging — identifies what TYPE of words
    the user stutters on.
    
    Research shows people stutter more on:
    - CONTENT WORDS (nouns, verbs, adjectives) — carry meaning
    - vs FUNCTION WORDS (the, is, a, to) — grammatical glue
    
    If a user primarily stutters on VERBS, we generate practice
    sentences heavy with verbs. Same for NOUNS, ADJ, etc.
    
    Args:
        text (str): Full transcript text
        stuttered_words (list): Words that were stuttered (from repetition detection)
    
    Returns:
        dict: {
            'posDistribution': {'NOUN': 12, 'VERB': 8, 'ADJ': 5, ...},
            'stutteredWordTypes': {'VERB': 3, 'NOUN': 1, 'PRON': 2},
            'contentVsFunctionRatio': 0.55,
            'dominantStutterType': 'VERB'
        }
    """
    if not nlp or not text:
        return {
            "posDistribution": {},
            "stutteredWordTypes": {},
            "contentVsFunctionRatio": 0,
            "dominantStutterType": "unknown"
        }
    
    doc = nlp(text)
    
    # Count POS tags across entire transcript
    pos_distribution = {}
    for token in doc:
        if token.is_alpha:  # skip punctuation and numbers
            pos = token.pos_
            pos_distribution[pos] = pos_distribution.get(pos, 0) + 1
    
    # Analyze which word types are stuttered
    stuttered_types = {}
    if stuttered_words:
        for sword in stuttered_words:
            # Find this word in the spaCy doc to get its POS
            sword_lower = sword.lower().strip()
            for token in doc:
                if token.text.lower() == sword_lower:
                    pos = token.pos_
                    stuttered_types[pos] = stuttered_types.get(pos, 0) + 1
                    break
    
    # Content vs Function word ratio
    content_pos = {"NOUN", "VERB", "ADJ", "ADV"}
    content_count = sum(1 for token in doc if token.pos_ in content_pos and token.is_alpha)
    total_alpha = sum(1 for token in doc if token.is_alpha)
    content_ratio = content_count / total_alpha if total_alpha > 0 else 0
    
    # Find dominant stutter type
    dominant = "none"
    if stuttered_types:
        dominant = max(stuttered_types, key=stuttered_types.get)
    
    return {
        "posDistribution": pos_distribution,
        "stutteredWordTypes": stuttered_types,
        "contentVsFunctionRatio": round(content_ratio, 2),
        "dominantStutterType": dominant
    }


def analyze_complexity(text):
    """
    Measure linguistic complexity of the speech.
    
    WHY THIS MATTERS:
    People who stutter often AVOID complex words and sentences.
    They say "nice" instead of "spectacular" because they know
    they'll stutter on "sp-". This is called AVOIDANCE BEHAVIOR.
    
    By tracking complexity over time, we can detect if the user
    is growing more confident (using richer vocabulary) or
    becoming more avoidant (simplifying their speech).
    
    Metrics:
    - TYPE-TOKEN RATIO (TTR): Unique words / Total words
      Low TTR = repetitive vocabulary, possibly avoiding variety
      Normal TTR: 0.4-0.7 for conversational speech
    
    - AVERAGE WORD LENGTH: Mean characters per word
      Low = simpler words. Normal: 4.0-5.5 characters
    
    - LEXICAL DENSITY: Content words / Total words
      Higher = more information-rich speech
      Normal: 0.4-0.6 for conversational speech
    
    Args:
        text (str): Full transcript text
    
    Returns:
        dict: {
            'typeTokenRatio': 0.72,
            'avgWordLength': 4.2,
            'lexicalDensity': 0.55,
            'vocabularyLevel': 'normal',
            'avoidanceDetected': False,
            'avoidanceDetails': ''
        }
    """
    if not nlp or not text:
        return {
            "typeTokenRatio": 0,
            "avgWordLength": 0,
            "lexicalDensity": 0,
            "vocabularyLevel": "insufficient_data",
            "avoidanceDetected": False,
            "avoidanceDetails": ""
        }
    
    doc = nlp(text)
    
    # Get all alphabetic tokens (words only)
    words = [token.text.lower() for token in doc if token.is_alpha]
    
    if not words:
        return {
            "typeTokenRatio": 0, "avgWordLength": 0, "lexicalDensity": 0,
            "vocabularyLevel": "insufficient_data",
            "avoidanceDetected": False, "avoidanceDetails": ""
        }
    
    unique_words = set(words)
    
    # Type-Token Ratio
    ttr = len(unique_words) / len(words)
    
    # Average word length
    avg_length = sum(len(w) for w in words) / len(words)
    
    # Lexical density (content words / total words)
    content_pos = {"NOUN", "VERB", "ADJ", "ADV"}
    content_count = sum(1 for token in doc if token.pos_ in content_pos and token.is_alpha)
    lexical_density = content_count / len(words)
    
    # Determine vocabulary level
    if ttr < 0.3 and avg_length < 3.5:
        vocab_level = "simplified"
    elif ttr < 0.4:
        vocab_level = "below_normal"
    elif ttr <= 0.7:
        vocab_level = "normal"
    else:
        vocab_level = "above_normal"
    
    # Detect avoidance behavior
    avoidance = False
    avoidance_details = ""
    if ttr < 0.35 and avg_length < 3.8:
        avoidance = True
        avoidance_details = (
            "Your vocabulary diversity is lower than expected. "
            "You may be avoiding complex words. Try using more descriptive "
            "words in your next recording."
        )
    
    return {
        "typeTokenRatio": round(ttr, 2),
        "avgWordLength": round(avg_length, 1),
        "lexicalDensity": round(lexical_density, 2),
        "vocabularyLevel": vocab_level,
        "avoidanceDetected": avoidance,
        "avoidanceDetails": avoidance_details
    }


def analyze_filler_context(text, fillers_detected):
    """
    Context-aware filler detection using NLP.
    
    The word "like" is tricky:
    - "I like cats" → NOT a filler (it's a verb meaning "enjoy")
    - "It was like um" → IS a filler (used as hesitation)
    
    This function uses dependency parsing to determine if "like"
    is used as a verb (valid) or as a discourse marker (filler).
    
    Args:
        text (str): Full transcript
        fillers_detected (list): Raw filler words from stutter_detector
    
    Returns:
        dict: {
            'confirmed_fillers': ['um', 'uh', 'like'],
            'false_positives': ['like'],  # "like" used as a verb
            'adjusted_count': 2
        }
    """
    if not nlp or not text:
        return {
            "confirmed_fillers": fillers_detected,
            "false_positives": [],
            "adjusted_count": len(fillers_detected)
        }
    
    doc = nlp(text)
    
    false_positives = []
    confirmed = []
    
    for filler in fillers_detected:
        if filler.lower() == "like":
            # Check if "like" is used as a verb in the transcript
            is_verb = False
            for token in doc:
                if token.text.lower() == "like" and token.pos_ == "VERB":
                    is_verb = True
                    break
            
            if is_verb:
                false_positives.append(filler)
            else:
                confirmed.append(filler)
        else:
            confirmed.append(filler)
    
    return {
        "confirmed_fillers": confirmed,
        "false_positives": false_positives,
        "adjusted_count": len(confirmed)
    }


def analyze_transcript(text, stuttered_words=None):
    """
    MAIN FUNCTION — Run all NLP analyses on a transcript.
    
    Called by the Flask API after stutter detection.
    
    Args:
        text (str): Full transcript text from Whisper
        stuttered_words (list): Words that were flagged as stuttered
    
    Returns:
        dict: Complete NLP analysis results
    """
    pos_analysis = analyze_pos(text, stuttered_words)
    complexity = analyze_complexity(text)
    
    return {
        "posDistribution": pos_analysis["posDistribution"],
        "stutteredWordTypes": pos_analysis["stutteredWordTypes"],
        "dominantStutterType": pos_analysis["dominantStutterType"],
        "contentVsFunctionRatio": pos_analysis["contentVsFunctionRatio"],
        "complexity": {
            "typeTokenRatio": complexity["typeTokenRatio"],
            "avgWordLength": complexity["avgWordLength"],
            "lexicalDensity": complexity["lexicalDensity"]
        },
        "vocabularyLevel": complexity["vocabularyLevel"],
        "avoidanceDetected": complexity["avoidanceDetected"],
        "avoidanceDetails": complexity["avoidanceDetails"]
    }


# --- FOR TESTING ---
if __name__ == "__main__":
    test_text = "I I I want to go to um the the store because I like um shopping"
    stuttered = ["I", "the"]
    
    print("=== NLP ANALYSIS TEST ===\n")
    result = analyze_transcript(test_text, stuttered)
    
    print(f"POS Distribution: {result['posDistribution']}")
    print(f"Stuttered Word Types: {result['stutteredWordTypes']}")
    print(f"Dominant Stutter Type: {result['dominantStutterType']}")
    print(f"Complexity: {result['complexity']}")
    print(f"Vocabulary Level: {result['vocabularyLevel']}")
    print(f"Avoidance Detected: {result['avoidanceDetected']}")
