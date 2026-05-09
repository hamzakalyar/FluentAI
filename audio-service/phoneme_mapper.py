"""
PHONEME MAPPER — Maps Words to Speech Sounds
==============================================
This module uses the CMU Pronouncing Dictionary to map stuttered words
to their PHONEMES (individual speech sounds).

WHY PHONEME MAPPING?
When a user stutters on "store", "street", "start" — the real problem
isn't those specific words, it's the /S/ SOUND at the beginning.

By mapping stuttered words to phonemes, we identify the USER'S WEAK SOUNDS
and generate practice exercises targeting those specific sounds.

CMU PRONOUNCING DICTIONARY:
- Free, maintained by Carnegie Mellon University
- Contains 134,000+ English words with phoneme breakdowns
- Example: "store" → S T AO R
- Example: "the" → DH AH
- Example: "think" → TH IH NG K

PHONEME TYPES (ARPAbet notation):
- Consonants: B, CH, D, DH, F, G, HH, JH, K, L, M, N, NG, P, R, S, SH, T, TH, V, W, Y, Z, ZH
- Vowels: AA, AE, AH, AO, AW, AY, EH, ER, EY, IH, IY, OW, OY, UH, UW
"""

import nltk
from collections import Counter

# Download CMU dict if not already present
try:
    nltk.data.find('corpora/cmudict')
except LookupError:
    print("📥 Downloading CMU Pronouncing Dictionary...")
    nltk.download('cmudict', quiet=True)

from nltk.corpus import cmudict

# Load the CMU dictionary
_cmu_dict = cmudict.dict()


# Human-readable phoneme names
PHONEME_NAMES = {
    "B": "B (as in 'bat')",
    "CH": "CH (as in 'chat')",
    "D": "D (as in 'dog')",
    "DH": "TH (as in 'the')",
    "F": "F (as in 'fan')",
    "G": "G (as in 'go')",
    "HH": "H (as in 'hat')",
    "JH": "J (as in 'jump')",
    "K": "K (as in 'cat')",
    "L": "L (as in 'lamp')",
    "M": "M (as in 'man')",
    "N": "N (as in 'no')",
    "NG": "NG (as in 'sing')",
    "P": "P (as in 'pat')",
    "R": "R (as in 'run')",
    "S": "S (as in 'sun')",
    "SH": "SH (as in 'she')",
    "T": "T (as in 'top')",
    "TH": "TH (as in 'think')",
    "V": "V (as in 'van')",
    "W": "W (as in 'win')",
    "Y": "Y (as in 'yes')",
    "Z": "Z (as in 'zoo')",
    "ZH": "ZH (as in 'measure')"
}


def word_to_phonemes(word):
    """
    Look up a word in the CMU dictionary and return its phonemes.
    
    Args:
        word (str): English word to look up
    
    Returns:
        list: List of phonemes, or empty list if word not found
    
    Examples:
        word_to_phonemes("store")  → ['S', 'T', 'AO', 'R']
        word_to_phonemes("the")    → ['DH', 'AH']
        word_to_phonemes("think")  → ['TH', 'IH', 'NG', 'K']
        word_to_phonemes("she")    → ['SH', 'IY']
    """
    word_lower = word.lower().strip(".,!?;:'\"")
    
    if word_lower in _cmu_dict:
        # CMU dict returns phonemes with stress markers (e.g., 'AO1')
        # We strip the stress numbers to get clean phonemes
        phonemes = _cmu_dict[word_lower][0]  # take first pronunciation
        return [p.rstrip("0123456789") for p in phonemes]
    
    return []


def get_onset_phoneme(word):
    """
    Get the FIRST phoneme (onset) of a word.
    
    WHY THE FIRST PHONEME?
    Stuttering most commonly occurs at the ONSET (beginning) of a word.
    When someone says "s-s-store", they're struggling with the /S/ sound
    at the start, not the /R/ at the end.
    
    Args:
        word (str): English word
    
    Returns:
        str: First phoneme, or None if word not found
    
    Examples:
        get_onset_phoneme("store")   → 'S'
        get_onset_phoneme("the")     → 'DH'
        get_onset_phoneme("running") → 'R'
    """
    phonemes = word_to_phonemes(word)
    if phonemes:
        return phonemes[0]
    return None


def identify_weak_sounds(stuttered_words):
    """
    Map all stuttered words to their onset phonemes and find
    the most problematic sounds.
    
    Args:
        stuttered_words (list): List of words that were stuttered
                                e.g., ["store", "street", "the", "think", "store"]
    
    Returns:
        dict: {
            'weakSounds': [
                {'sound': 'S', 'label': "S (as in 'sun')", 'frequency': 3, 'words': ['store', 'street']},
                {'sound': 'TH', 'label': "TH (as in 'think')", 'frequency': 1, 'words': ['think']},
                {'sound': 'DH', 'label': "TH (as in 'the')", 'frequency': 1, 'words': ['the']}
            ],
            'top3': ['S', 'TH', 'DH'],
            'totalStutteredWords': 5
        }
    """
    if not stuttered_words:
        return {"weakSounds": [], "top3": [], "totalStutteredWords": 0}
    
    # Map each stuttered word to its onset phoneme
    phoneme_counter = Counter()
    phoneme_words = {}  # track which words caused each phoneme
    
    for word in stuttered_words:
        onset = get_onset_phoneme(word)
        if onset:
            phoneme_counter[onset] += 1
            if onset not in phoneme_words:
                phoneme_words[onset] = set()
            phoneme_words[onset].add(word.lower())
    
    # Sort by frequency (most problematic first)
    sorted_phonemes = phoneme_counter.most_common()
    
    weak_sounds = []
    for phoneme, freq in sorted_phonemes:
        weak_sounds.append({
            "sound": phoneme,
            "label": PHONEME_NAMES.get(phoneme, phoneme),
            "frequency": freq,
            "words": list(phoneme_words.get(phoneme, []))
        })
    
    # Get top 3 weak sounds
    top3 = [ws["sound"] for ws in weak_sounds[:3]]
    
    return {
        "weakSounds": weak_sounds,
        "top3": top3,
        "totalStutteredWords": len(stuttered_words)
    }


def aggregate_weak_sounds(session_results):
    """
    Aggregate weak sounds across MULTIPLE sessions to find
    long-term patterns in the user's stuttering.
    
    This is called when we want to update the user's profile
    with their overall weak sound trends.
    
    Args:
        session_results (list): List of weak sound results from multiple sessions
                                [{'weakSounds': [...], 'top3': [...]}, ...]
    
    Returns:
        dict: Aggregated weak sounds with trends
    """
    overall_counter = Counter()
    overall_words = {}
    
    for session in session_results:
        for ws in session.get("weakSounds", []):
            sound = ws["sound"]
            overall_counter[sound] += ws["frequency"]
            if sound not in overall_words:
                overall_words[sound] = set()
            overall_words[sound].update(ws.get("words", []))
    
    sorted_sounds = overall_counter.most_common()
    
    aggregated = []
    for sound, freq in sorted_sounds:
        aggregated.append({
            "sound": sound,
            "label": PHONEME_NAMES.get(sound, sound),
            "frequency": freq,
            "words": list(overall_words.get(sound, [])),
            "trend": "stable"  # trend is calculated by comparing with previous aggregation
        })
    
    return {
        "weakSounds": aggregated,
        "top3": [s["sound"] for s in aggregated[:3]]
    }


# --- FOR TESTING ---
if __name__ == "__main__":
    print("=== PHONEME MAPPER TEST ===\n")
    
    # Test word-to-phoneme mapping
    test_words = ["store", "the", "think", "she", "running", "street", "cat"]
    for word in test_words:
        phonemes = word_to_phonemes(word)
        onset = get_onset_phoneme(word)
        print(f"  {word:10} → {phonemes}  (onset: {onset})")
    
    # Test weak sound identification
    print("\n--- Weak Sound Detection ---")
    stuttered = ["store", "street", "start", "the", "think", "she", "store"]
    result = identify_weak_sounds(stuttered)
    
    print(f"\nTop 3 weak sounds: {result['top3']}")
    for ws in result["weakSounds"]:
        print(f"  {ws['label']:30} — frequency: {ws['frequency']}, words: {ws['words']}")
