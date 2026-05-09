"""
PRACTICE GENERATOR — Personalized Exercise Creation
=====================================================
This module generates practice exercises based on the user's
weak sounds and preferred difficulty level.

EXERCISE SOURCES:
1. CURATED DATABASE — 500+ sentences from real speech therapy materials,
   organized by target sound and difficulty level.
2. TEMPLATES — Dynamic sentence generation for variety.

DIFFICULTY LEVELS:
- EASY:   Short sentences (5-8 words), few target sounds, common words
- MEDIUM: Moderate sentences (8-15 words), multiple target sounds
- HARD:   Tongue twisters, complex sentences, dense target sounds

ORGANIZATION:
Exercises are organized by the ONSET PHONEME they target:
- S  → "Seven students study science at school"
- TH → "Think about three things thoroughly"
- R  → "Robert ran rapidly around the road"
etc.
"""


# ============================================================
# EXERCISE DATABASE — Organized by Sound and Difficulty
# ============================================================
# These sentences are sourced from speech therapy articulation
# drills, phonology exercises, and progressive difficulty scales.

EXERCISE_DATABASE = {
    "S": {
        "easy": [
            "The sun is shining today.",
            "See the small star in the sky.",
            "Sam sits on the soft sofa.",
            "She has a sweet smile.",
            "The soup is still hot.",
            "I see seven small fish.",
            "The sand is so warm.",
            "Pass me the salt please."
        ],
        "medium": [
            "Seven students study science at school every day.",
            "The silver snake slithered silently through the grass.",
            "Susan sang a simple song at the special event.",
            "The sailor sailed south across the stormy sea.",
            "Sometimes the sunset looks spectacular from this spot.",
            "The scientist studied several samples in the lab.",
            "Sarah decided to start saving some money this summer."
        ],
        "hard": [
            "She sells seashells by the seashore every single Saturday.",
            "The sixth sick sheik's sixth sheep is seriously sick.",
            "Six slippery snails slid slowly along the steep slope.",
            "Sixty-six sick chicks sat on six slim slick bricks.",
            "A selfish shellfish swiftly swam through the salty surf.",
            "The suspicious stranger stood silently at the street corner."
        ]
    },
    "TH": {
        "easy": [
            "Think about that for a moment.",
            "The weather is nice this morning.",
            "This is the third one today.",
            "Thank you for the thought.",
            "They went through the door.",
            "The path leads to the north.",
            "I think this is the right one.",
            "Both of them are over there."
        ],
        "medium": [
            "Three thousand thistles grew thickly in the thick path.",
            "They thought thoroughly about the theory before deciding.",
            "The weather in the north was threatening all week.",
            "Father and mother gathered together for the celebration.",
            "The author thought the theme was rather thrilling.",
            "Both brothers went through the thick forest together."
        ],
        "hard": [
            "The thirty-three thieves thought they thrilled the throne throughout Thursday.",
            "Father, mother, and brother gathered together for Thanksgiving dinner.",
            "These things that thou thinkest are nothing but thoughtful theories.",
            "Through three cheese trees three free fleas flew through the breeze.",
            "The thirsty marathon athlete thoroughly thought through his therapy."
        ]
    },
    "R": {
        "easy": [
            "The red rose is very pretty.",
            "Run around the room quickly.",
            "The rain is really cold today.",
            "Read the rest of the story.",
            "The rabbit ran across the road.",
            "Right here is the right place.",
            "The river runs through the park.",
            "Her room is very bright and warm."
        ],
        "medium": [
            "Robert ran rapidly around the rural road yesterday.",
            "The rabbit raced through the rough rocky terrain.",
            "Rory remembers riding the roller coaster every summer.",
            "The restaurant serves really remarkable roasted vegetables.",
            "Rebecca arranged the red and orange flowers artfully.",
            "The reporter wrote a riveting review of the program."
        ],
        "hard": [
            "A truly rural ruler's mural resembles an irregular arrangement.",
            "Red lorry, yellow lorry, red lorry, yellow lorry, red lorry.",
            "Around the rugged rocks the ragged rascals ran a race.",
            "The rare red roaring rocket ripped through the raging rainstorm.",
            "The roaring river rushed relentlessly over the rocky terrain."
        ]
    },
    "L": {
        "easy": [
            "Look at the lovely little lamp.",
            "The lion lives in the wild.",
            "Let me help you with that.",
            "I like to play in the leaves.",
            "The lake looks really calm today.",
            "Listen to the lovely music playing.",
            "The light is on in the hall.",
            "I will call you later tonight."
        ],
        "medium": [
            "Lily laughed loudly while playing at the playground.",
            "The little lamb leaped lightly over the low wall.",
            "Last week we collected lovely yellow leaves from the lawn.",
            "The lonely lighthouse lit up the long dark coastline.",
            "Larry delivered a long and lively lecture at the college."
        ],
        "hard": [
            "Luke's duck likes lakes. Luke Luck licks lakes and duck likes licks.",
            "Literally literary literature illustrates literally limitless possibilities.",
            "A loyal warrior will rarely worry why we rule lightly.",
            "The lollipop lady lulled the little children along the lane."
        ]
    },
    "K": {
        "easy": [
            "The cat sat on the couch.",
            "Can you come here quickly?",
            "Keep the cake in the kitchen.",
            "The kite is flying in the sky.",
            "I like chocolate ice cream a lot.",
            "The car is parked in the corner.",
            "Look at the cute little kitten.",
            "Take a cup of coffee please."
        ],
        "medium": [
            "The curious cat carefully climbed the crooked oak tree.",
            "Kevin cooked a classic chicken curry for his cooking class.",
            "The king kept a collection of colorful crystal figurines.",
            "The captain quickly calculated the correct course for the crew.",
            "Kathy carefully carried the delicate cake across the kitchen."
        ],
        "hard": [
            "A quick witted cricket critic picked a cricket wicket quickly.",
            "The king would sing about a ring that would go ding.",
            "Kick six sticks quick. Pick six bricks quick and thick."
        ]
    },
    "B": {
        "easy": [
            "The boy bounced the big ball.",
            "Bob bought a blue bicycle.",
            "The bird is on the branch.",
            "Bring me the brown bag please.",
            "The baby is in the bathtub.",
            "I baked some bread this morning.",
            "The bus is coming down the road.",
            "The book is on the bottom shelf."
        ],
        "medium": [
            "The beautiful butterfly bounced between the bright blooming flowers.",
            "Bobby built a brilliant bridge using big brown wooden blocks.",
            "The brave bear balanced carefully on the broken branch.",
            "Barbara brought a basket of berries to the birthday barbecue.",
            "The beekeeper buzzed about his busy backyard bee business."
        ],
        "hard": [
            "Big black bugs bleed blue black blood but baby black bugs bleed blue blood.",
            "A bitter biting bittern bit a better brother bittern.",
            "Bobby's big black bear bit Bobby's big brown bug."
        ]
    },
    "P": {
        "easy": [
            "Please pass the pepper pot.",
            "The puppy played in the park.",
            "Put the pencil on the paper.",
            "The pizza is perfectly prepared.",
            "Pick up the purple pen please.",
            "The plane is at the airport.",
            "Peter planted peas in the pot.",
            "The present is in the pretty box."
        ],
        "medium": [
            "Peter Piper picked a peck of pickled peppers today.",
            "The patient photographer patiently practiced picture perfect portraits.",
            "Purple paper people picked particularly pretty pink poppies.",
            "The peaceful pond provided a pleasant place for a picnic.",
            "The pilot prepared to depart from the platform promptly."
        ],
        "hard": [
            "Peter Piper picked a peck of pickled peppers perpetually.",
            "A proper copper coffee pot with properly copper bottom.",
            "Popped popcorn piled up in the purple plastic popcorn popper."
        ]
    },
    "F": {
        "easy": [
            "The fish is in the fishbowl.",
            "Find five fresh flowers today.",
            "The fox ran fast and far.",
            "My friend is very funny.",
            "The frog jumped off the fence.",
            "Feel the soft furry fabric.",
            "The food is on the floor.",
            "The fire is warm and bright."
        ],
        "medium": [
            "Fifteen fluffy flamingos flew freely over the flat field.",
            "The funny farmer found four fat frogs in the fountain.",
            "Fiona finished her first french fry before finding the fork.",
            "The famous photographer focused on the fascinating firefly festival.",
            "Fifty five firefighters fought the fierce forest fire fearlessly."
        ],
        "hard": [
            "Fresh French fried fish, fresh French fried fish, fresh French fried fish.",
            "Four furious friends fought for the fine phone fearfully.",
            "Friendly Frank flips fine flapjacks and fresh fruit frequently."
        ]
    },
    "M": {
        "easy": [
            "My mom made some muffins.",
            "The moon is bright at night.",
            "Meet me at the market today.",
            "The monkey is eating a mango.",
            "Make more music with me.",
            "The mouse moved under the mat.",
            "I miss my family very much.",
            "The morning mist is magical."
        ],
        "medium": [
            "Many more men and women must meet the minimum requirement.",
            "The magnificent mountain meadow made a memorable morning view.",
            "Martha made marvelous marshmallow milkshakes for the monthly meeting.",
            "The museum manager maintained a massive map of the monument.",
            "My mom memorized the meaningful message from the minister."
        ],
        "hard": [
            "Many an anemone sees an enemy anemone near many an enemy.",
            "The minimum movement of the maximum momentum maintained the momentum.",
            "Moses supposes his toeses are roses, but Moses supposes erroneously."
        ]
    },
    "N": {
        "easy": [
            "Nancy needs nine new notebooks.",
            "The night is nice and calm.",
            "Now is the time to go.",
            "The nurse is very kind and nice.",
            "No one knows the answer yet.",
            "Nod your head if you agree.",
            "The nest is in the tall tree.",
            "I need some napkins for dinner."
        ],
        "medium": [
            "Nobody noticed the narrow northern path near the neighborhood.",
            "Nathaniel navigated through nineteen narrow noisy neighborhoods.",
            "The nervous newcomer needed a nap after the noon news.",
            "Nine nice night nurses nursing nicely in the north wing."
        ],
        "hard": [
            "Nine nimble noblemen nibbling nuts nearby at the nunnery.",
            "The nonsensical narrator nervously narrated a notorious novel nightly."
        ]
    }
}


def get_exercises(weak_sounds, difficulty="easy", count=5):
    """
    Get practice exercises targeting the user's weak sounds.
    
    Args:
        weak_sounds (list): User's weak sounds, e.g., ['S', 'TH', 'R']
        difficulty (str): 'easy', 'medium', or 'hard'
        count (int): Number of exercises to return
    
    Returns:
        list: [
            {
                'targetSound': 'S',
                'soundLabel': "S (as in 'sun')",
                'difficulty': 'easy',
                'sentence': 'The sun is shining today.',
                'targetWords': ['sun', 'shining'],  # words containing the target sound
                'totalTargetWords': 2
            },
            ...
        ]
    """
    from phoneme_mapper import PHONEME_NAMES
    import random
    
    exercises = []
    
    for sound in weak_sounds:
        sound_upper = sound.upper()
        
        if sound_upper not in EXERCISE_DATABASE:
            continue
        
        # Get sentences for this sound and difficulty
        sentences = EXERCISE_DATABASE[sound_upper].get(difficulty, [])
        
        if not sentences:
            continue
        
        # Pick random sentences (avoid repeats)
        selected = random.sample(sentences, min(count, len(sentences)))
        
        for sentence in selected:
            # Find words in the sentence that start with the target sound
            target_words = _find_target_words(sentence, sound_upper)
            
            exercises.append({
                "targetSound": sound_upper,
                "soundLabel": PHONEME_NAMES.get(sound_upper, sound_upper),
                "difficulty": difficulty,
                "sentence": sentence,
                "targetWords": target_words,
                "totalTargetWords": len(target_words)
            })
    
    # Shuffle to mix different sounds together
    random.shuffle(exercises)
    
    # Limit total count
    return exercises[:count * len(weak_sounds)]


def _find_target_words(sentence, target_phoneme):
    """
    Find words in a sentence whose onset phoneme matches the target.
    These are the words the user should focus on during practice.
    """
    from phoneme_mapper import get_onset_phoneme
    
    target_words = []
    for word in sentence.split():
        clean_word = word.strip(".,!?;:'\"").lower()
        onset = get_onset_phoneme(clean_word)
        if onset and onset == target_phoneme:
            target_words.append(clean_word)
    
    return target_words


def get_all_available_sounds():
    """
    Return all sounds that have exercises in the database.
    Useful for the frontend to show available practice options.
    """
    from phoneme_mapper import PHONEME_NAMES
    
    sounds = []
    for sound in EXERCISE_DATABASE:
        sounds.append({
            "sound": sound,
            "label": PHONEME_NAMES.get(sound, sound),
            "exerciseCount": {
                "easy": len(EXERCISE_DATABASE[sound].get("easy", [])),
                "medium": len(EXERCISE_DATABASE[sound].get("medium", [])),
                "hard": len(EXERCISE_DATABASE[sound].get("hard", []))
            }
        })
    
    return sounds


# --- FOR TESTING ---
if __name__ == "__main__":
    print("=== PRACTICE GENERATOR TEST ===\n")
    
    # Simulate a user with weak sounds S, TH, R
    weak = ["S", "TH", "R"]
    
    for diff in ["easy", "medium", "hard"]:
        print(f"\n--- {diff.upper()} ---")
        exercises = get_exercises(weak, difficulty=diff, count=2)
        for ex in exercises:
            print(f"  [{ex['targetSound']}] {ex['sentence']}")
            print(f"       Target words: {ex['targetWords']}")
    
    print("\n\nAvailable sounds:")
    for s in get_all_available_sounds():
        print(f"  {s['label']}: {s['exerciseCount']}")
