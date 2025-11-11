# Test Guide: Verify Classification Fixes

## How to Test Each Dataset

### 1. Start the Game
Open `index.html` in a browser and start a new game.

---

## 🍕 Food Dataset Test

### Steps:
1. Select **🍕 Food** dataset
2. Complete tokenization phase
3. Get to embeddings grouping phase
4. Look at the tokens to group

### Expected Results:
✅ **SUBJECTS zone should contain:**
- chef
- pizza
- restaurant  
- meal

✅ **OBJECTS zone should contain:**
- pasta
- cuisine
- cheese
- ingredients
- sauce
- Italy
- recipes
- kitchen
- customers
- oven
- tomatoes (if appears)
- people (if appears)

✅ **ACTIONS zone should contain:**
- cooked
- came
- serves
- loves
- tastes
- has
- includes
- cooking (if appears)

✅ **PREPOSITIONS zone should contain:**
- from
- in
- for
- with
- on
- to (if appears)

### What Was Fixed:
- **pizza**: moved from objects → subjects
- **restaurant**: moved from objects → subjects
- **meal**: moved from objects → subjects

### Why It's Correct:
Look at the training data sidebar:
- "The **pizza** came from the oven" → pizza performs action
- "The **restaurant** serves meals" → restaurant performs action
- "The **meal** includes recipes" → meal performs action

---

## 🚀 Space Dataset Test

### Steps:
1. Select **🚀 Space** dataset
2. Complete tokenization phase
3. Get to embeddings grouping phase

### Expected Results:
✅ **SUBJECTS zone should contain:**
- rocket
- astronaut
- satellite
- moon
- stars

✅ **OBJECTS zone should contain:**
- Earth ← **FIXED!**
- planet ← **FIXED!**
- orbit ← **FIXED!**
- space
- sky
- night
- suit
- equipment
- patterns
- sunlight

### What Was Fixed:
- **Earth**: moved from subjects → objects
- **planet**: moved from subjects → objects
- **orbit**: added to objects

### Why It's Correct:
Look at the training data:
- "The moon orbits around **Earth**" → Earth is being orbited (object)
- "The satellite orbits the **planet**" → planet is being orbited (object)

Earth and planet DON'T perform actions in the training data!

---

## 🐾 Animals Dataset Test

### Expected Results:
✅ **SUBJECTS zone:**
- cat
- dog
- bird

✅ **OBJECTS zone:**
- mat
- window
- ball
- garden
- tree
- branch ← **FIXED!** (was missing)
- fish
- milk
- treats
- bones
- toys
- seeds
- water

### What Was Fixed:
- **branch**: added to objects (was missing from list)

---

## 💻 Technology Dataset Test

### Expected Results:
✅ **SUBJECTS zone:**
- programmer
- computer
- developer

✅ **OBJECTS zone:**
- code
- data
- software
- project
- applications
- users
- features
- programs
- solutions
- editor
- feedback
- calculations

### What Was Fixed:
- Nothing! Already perfect ✅

---

## ⚽ Sports Dataset Test

### Expected Results:
✅ **SUBJECTS zone:**
- player
- team
- coach

✅ **OBJECTS zone:**
- ball
- goal
- skill
- minute
- victory
- football
- games
- matches
- dedication
- rivals
- championship
- strategies ← **FIXED!** (was missing)

### What Was Fixed:
- **strategies**: added to objects (was missing)

---

## Quick Validation Checklist

For each dataset, verify:

### ✅ Balance Check:
- Each dataset should have **multiple subjects** (not just 1!)
- Food should have 4 subjects: chef, pizza, restaurant, meal
- Space should have 5 subjects: rocket, astronaut, satellite, moon, stars
- Animals should have 3 subjects: cat, dog, bird
- Tech should have 3 subjects: programmer, computer, developer
- Sports should have 3 subjects: player, team, coach

### ✅ Pattern Check:
- Words in SUBJECTS should appear at the START of sentences
- Words in OBJECTS should appear AFTER verbs (being acted upon)
- Words in ACTIONS should be verbs (doing words)
- Words in PREPOSITIONS should be connectors (in, with, from, etc.)

### ✅ Training Data Match:
- Open the game and look at the training data sidebar
- For each token, find it in the training sentences
- Verify its classification matches WHERE it appears (start = subject, after verb = object)

---

## Common Issues to Watch For

### ❌ If "pizza" still appears in objects:
- The fix didn't apply - check the code was updated

### ❌ If "Earth" still appears in subjects:
- The fix didn't apply - check the code was updated

### ❌ If the game doesn't accept correct groupings:
- Check browser console for errors
- Make sure you're testing with the updated file

---

## Visual Test (Quick Method)

1. Load the game with Food dataset
2. Get to embeddings phase
3. Look at the center of the canvas - you should see **4 tokens that naturally group as subjects**:
   - chef
   - pizza
   - restaurant
   - meal

If you only see "chef" and the other 3 are with objects like "cheese" and "sauce", the fix didn't apply!

---

## Browser Console Check

Open browser DevTools (F12) and type:
```javascript
phase2.targetGroups
```

Expected output for Food dataset:
```javascript
{
  subjects: ["chef", "pizza", "restaurant", "meal"],
  actions: ["cooked", "came", "serves", "loves", "tastes", "has", "includes", ...],
  objects: ["pasta", "cuisine", "cheese", "ingredients", "sauce", ...],
  prepositions: ["from", "in", "for", "with", "on", "to"]
}
```

If subjects only has ["chef"], the fix wasn't loaded!

---

## Final Verification

### All Tests Pass = ✅
- Food: 4 subjects (not 1)
- Space: Earth and planet in objects (not subjects)
- All datasets: classifications match sentence positions
- Game accepts correct groupings without errors

### Tests Fail = ❌
- Clear browser cache and reload
- Check file was saved correctly
- Check browser console for JavaScript errors


