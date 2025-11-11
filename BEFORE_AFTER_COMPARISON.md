# Before vs After: Classification Comparison

## 🍕 Food Dataset - The Most Significant Fix

### Training Sentences:
```
1. The CHEF cooked fresh pasta in the kitchen today.
2. The PIZZA came from the oven hot.
3. The RESTAURANT serves delicious meals to customers.
4. The CHEF loves cooking Italian cuisine for people.
5. The PASTA tastes very delicious with tomato sauce.
6. The PIZZA has cheese and fresh ingredients on top.
7. The MEAL includes special recipes from Italy.
```

---

## ❌ BEFORE (INCORRECT)

### Subjects Category:
- chef ✓

**Problem:** Only 1 subject! But look at sentences 2, 3, and 7 - pizza, restaurant, and meal all perform actions!

### Objects Category:
- pizza ❌ (but "pizza came", "pizza has" - it's doing actions!)
- restaurant ❌ (but "restaurant serves" - it's doing an action!)
- meal ❌ (but "meal includes" - it's doing an action!)
- pasta ✓ (correct - "chef cooked pasta")
- cuisine ✓
- cheese ✓
- tomatoes ✓
- ingredients ✓
- sauce ✓
- Italy ✓
- recipes ✓
- people ✓
- food ✓
- kitchen ✓
- customers ✓
- oven ✓

**Issue:** 13 objects vs 1 subject - extremely imbalanced and wrong!

---

## ✅ AFTER (CORRECT)

### Subjects Category:
- chef ✓ (chef cooked, chef loves)
- pizza ✓ (pizza came, pizza has)
- restaurant ✓ (restaurant serves)
- meal ✓ (meal includes)

**Fixed:** Now 4 subjects! Matches actual sentence patterns.

### Objects Category:
- pasta ✓ (chef cooked pasta - acted upon)
- cuisine ✓
- cheese ✓
- tomatoes ✓
- ingredients ✓
- sauce ✓
- Italy ✓
- recipes ✓
- people ✓
- food ✓
- kitchen ✓
- customers ✓
- oven ✓

**Fixed:** 13 objects vs 4 subjects - much more balanced!

---

## 🚀 Space Dataset - Another Important Fix

### Sample Sentences:
```
1. The MOON orbits around Earth constantly.
2. The SATELLITE orbits the planet continuously.
```

## ❌ BEFORE (INCORRECT)

### Subjects:
- rocket ✓
- astronaut ✓
- satellite ✓
- moon ✓
- stars ✓
- **Earth** ❌ (Earth doesn't orbit anything in training data!)
- **planet** ❌ (planet doesn't orbit anything in training data!)

**Issue:** Earth and planet are being ORBITED, not doing the orbiting!

---

## ✅ AFTER (CORRECT)

### Subjects:
- rocket ✓ (rocket launched, rocket carried)
- astronaut ✓ (astronaut floated, astronaut wore)
- satellite ✓ (satellite orbits, satellite monitors)
- moon ✓ (moon orbits, moon reflects)
- stars ✓ (stars shine, stars form)

### Objects:
- **Earth** ✓ (orbits around Earth - thing being orbited)
- **planet** ✓ (orbits the planet - thing being orbited)
- space ✓
- orbit ✓
- equipment ✓
- suit ✓
- patterns ✓
- sky ✓
- night ✓
- sunlight ✓

**Fixed:** Earth and planet correctly classified based on their role in sentences!

---

## Key Insight: Pattern-Based vs Semantic Classification

### ❌ Wrong Approach (Semantic):
"Earth is a planet, planets don't 'do things', so... wait, but Earth is important, so maybe it's a subject?"

### ✅ Correct Approach (Pattern-Based):
"Where does 'Earth' appear in the training sentences? → 'orbits around **Earth**' → It appears AFTER verbs → It's an OBJECT"

---

## Why This Matters for LLM Learning

### Before Fix (Food Dataset):
```
Game tells you: "Group tokens by similar usage patterns"
Training data: "The pizza came from the oven"
Classification: pizza = OBJECT
Player thinks: "Wait, pizza appears at the START like 'chef', but it's in objects?"
Result: CONFUSING! Contradicts the actual patterns!
```

### After Fix (Food Dataset):
```
Game tells you: "Group tokens by similar usage patterns"
Training data: "The pizza came from the oven"
Classification: pizza = SUBJECT
Player thinks: "Pizza appears at START of sentences, just like chef! Both subjects!"
Result: CORRECT! Matches the actual patterns!
```

---

## The Core Principle

**Embeddings are learned from POSITION and CONTEXT, not meaning!**

- If a word appears at the start of sentences → Groups with other sentence-starters
- If a word appears after verbs → Groups with other post-verb words
- Doesn't matter if it's "alive" or "inanimate"
- Only matters: WHERE does it appear in the training data?

This is exactly how real LLMs learn - pure statistical patterns, no semantic rules!


