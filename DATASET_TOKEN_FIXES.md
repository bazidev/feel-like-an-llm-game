# Dataset Token Categorization Fixes

## Issue
Tokens from various datasets were being tokenized (split by suffix rules) but the resulting root tokens weren't categorized in any zone during the "Group Similar Tokens" phase, blocking game progression.

## Root Cause
When words like "scored", "chased", "carried", etc. are tokenized, they split into:
- "scored" → "scor" + "ed"
- "chased" → "chas" + "ed"
- "carried" → "carri" + "ed"

The base forms ("scor", "chas", "carri") weren't in the categorization lists.

---

## Fixes Applied to `phases/phase2-embeddings.js`

### 1. ACTIONS Zone - Added Verb Roots
Added missing verb roots that result from tokenization:

- **`scor`** - from "scored" (Sports dataset)
- **`chas`** - from "chased" (Animals dataset)
- **`carri`** - from "carried" (Space dataset)

### 2. OBJECTS Zone - Added Missing Tokens

#### Adjectives/Descriptors
- `clean` - Tech: "clean code"
- `delicious` - Food: "delicious meals", "delicious with sauce"
- `beautiful` - Space: "beautiful patterns"
- `high` - Tech: "high speed"
- `modern` - Tech: "modern users"
- `new` - Tech: "new features"
- `protective` - Space: "protective suit"
- `useful` - Tech: "useful applications"
- `together` - Sports: "together loudly"

#### Adverbs (context patterns, not meaning)
- `carefully` - Animals/Tech: "watched carefully", "processed carefully"
- `eagerly` - Animals: "eagerly chased"
- `continuously` - Space: "orbits continuously"
- `efficiently` - Tech: "runs efficiently"
- `loudly` - Sports: "celebrates loudly"
- `proudly` - Sports: "celebrates proudly"
- `quickly` - Tech: "processed quickly"
- `regularly` - Sports: "trains regularly"

#### Nouns
- `goals` - Sports: "three goals"
- `toys` - Animals: "toys for dog"
- `bowls` - Animals: "water bowls"
- `action` - Sports: "into action"
- `rest` - Tech/Food: "can't we rest"
- `top` - Food: "on top"
- `three` - Sports: number in "three goals"
- `speed` - Tech: "high speed"
- `spe` - Edge case if "speed" gets split

#### Previously Added
- `great`, `greate` - Sports: "great skill"
- `final` - Sports: "final minute"

---

## Datasets Covered

### ✅ Animals Dataset
**Fixed tokens**: `chas`, `carefully`, `eagerly`, `toys`, `bowls`

**Training text**: "A cat sat on the mat near the window. The dog played with the ball in the garden. The bird sang from the tree branch. The cat likes fish and milk treats. The dog likes bones and toys. The bird likes seeds and water bowls. The cat watched the bird carefully. The dog chased after the ball eagerly. The bird chirped at dawn beautifully. The cat sleeps on the mat. They're running. Aren't they?"

---

### ✅ Space Dataset
**Fixed tokens**: `carri`, `beautiful`, `protective`, `continuously`

**Training text**: "The rocket launched into orbit successfully. The astronaut floated in space gracefully. The stars shine very brightly at night. The moon orbits around Earth constantly. The satellite orbits the planet continuously. The rocket carried equipment into space today. The astronaut wore a special protective suit. The stars form beautiful patterns in the sky. The satellite monitors weather patterns from orbit. The moon reflects sunlight beautifully. It's amazing. Won't you agree?"

---

### ✅ Food Dataset
**Fixed tokens**: `delicious`, `rest`, `top`

**Training text**: "The chef cooked fresh pasta in the kitchen today. The pizza came from the oven hot. The restaurant serves delicious meals to customers. The chef loves cooking Italian cuisine for people. The pasta tastes very delicious with tomato sauce. The pizza has cheese and fresh ingredients on top. The meal includes special recipes from Italy. I'm eating. Isn't it delicious?"

---

### ✅ Tech Dataset
**Fixed tokens**: `clean`, `modern`, `useful`, `new`, `carefully`, `efficiently`, `quickly`, `high`, `speed`, `spe`, `rest`

**Training text**: "The programmer wrote clean code for the project today. The computer processed the data quickly with software. The developer builds useful applications for modern users. The programmer loves working on new features daily. The computer runs programs very efficiently now. The developer wrote solutions in the code editor. The programmer processed user feedback carefully about features. The computer builds calculations at high speed. We're coding. Can't we rest?"

---

### ✅ Sports Dataset
**Fixed tokens**: `scor`, `great`, `greate`, `final`, `regularly`, `loudly`, `proudly`, `goals`, `action`, `three`

**Training text**: "The player kicked the ball with great skill. The team scored a goal in the final minute. The coach trains the team for victory regularly. The player loves football games very much. The team celebrates their victory together loudly. The coach kicked strategies into action daily. The player trains for matches with dedication. The team scored three goals against rivals today. The coach celebrates winning at championships proudly. They've won. Didn't they celebrate?"

---

## How It Works

### Tokenization Process
1. Words with common suffixes (-ing, -ed, -ness) split if:
   - Word length > suffix length + 2 characters
   - Not in the `doNotSplit` list

2. Examples:
   - "scored" (6 chars) → "scor" (4) + "ed" (2) ✅
   - "chased" (6 chars) → "chas" (4) + "ed" (2) ✅
   - "running" → stays whole (in doNotSplit list) ✅
   - "speed" (5 chars) → "spe" (3) + "ed" (2) ⚠️ (edge case)

### Context Patterns (Not Meaning!)
The game categorizes by **WHERE tokens appear in sentences**, not what they mean:

- **SUBJECTS**: Appear at START of sentences, perform actions
- **ACTIONS**: Appear after subjects, before objects (verb position)
- **OBJECTS**: Appear after verbs, descriptors, things acted upon
- **PREPOSITIONS**: Connectors (in, with, from, etc.)

---

## Testing

To verify all datasets work:
1. Start the game
2. For each dataset (Animals, Space, Food, Tech, Sports):
   - Complete Phase 1 (Tokenization)
   - Reach Phase 2 "Group Similar Tokens"
   - Verify all tokens can be placed in appropriate zones
   - No tokens should be rejected from all 4 zones

---

## Notes

- Words in `noiseWords` list (lines 745-748) are automatically filtered out:
  - Common adverbs: 'constantly', 'successfully', 'gracefully', 'brightly', 'beautifully'
  - Common words: 'very', 'much', 'today', 'daily', 'special', 'amazing'
  - These won't appear as draggable tokens

- Case-insensitive matching is used (`t.toLowerCase()`)
- Both 'Earth'/'earth', 'Italy'/'italy' are normalized to lowercase for matching

---

**Date**: November 11, 2025  
**File Modified**: `phases/phase2-embeddings.js`  
**Lines**: 786-820 (token categorization logic)

