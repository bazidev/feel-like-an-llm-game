# 🏗️ NEW CONNECTED ARCHITECTURE

## Training Data Flow

### Initial Training Text (Added to Game.state):
```
"A cat sat on a mat. The dog played with a ball."
```
- **12 words** → perfect size for training
- **Simple patterns** → easy to learn
- **Relationships** → cat/mat, dog/ball  
- **Token count** → ~13-15 tokens after tokenization

## Phase-by-Phase Data Flow:

### Phase -1: OVERVIEW (NEW)
- Show journey diagram
- Display the training text in a beautiful UI
- Explain: "You'll break this down, learn patterns, and generate NEW text!"
- User picks name + avatar

### Phase 0: TOKENIZATION
**Input:** Raw text from Game.state.trainingText  
**User Task:** Choose how to split words (multiple choice, current system works!)  
**Output:** `Game.state.tokens = ["A", "cat", "sat", "on", "a", "mat", ".", "The", "dog", "play", "ed", "with", "a", "ball", "."]`  
**Calc Shown:** "15 tokens created from 12 words"

### Phase 1: EMBEDDINGS  
**Input:** Game.state.tokens  
**User Task:** Place tokens in 2D space (drag & drop)  
**Output:** `Game.state.embeddings = { "cat": [0.8, 0.6], "dog": [0.7, 0.5], ... }`  
**Calc Shown:** "Similar tokens clustered. Distance cat↔dog = 0.14"

### Phase 2: ATTENTION
**Input:** Game.state.tokens + embeddings  
**User Task:** Mark which words matter for context  
**Output:** `Game.state.attention = { "cat": {"sat": 0.9, "mat": 0.7}, ... }`  
**Calc Shown:** "Attention weights: 'cat' → 'sat' (0.9), 'cat' → 'mat' (0.7)"

### Phase 3: TRAINING
**Input:** tokens + embeddings + attention  
**User Task:** See how errors adjust weights (watch animation)  
**Output:** `Game.state.model = { weights: {...}, biases: {...} }`  
**Calc Shown:** "Adjusted 47 parameters. Loss reduced: 2.3 → 0.4"

### Phase 4: GENERATION
**Input:** Full trained model  
**User Task:** Pick starting words, AI generates next  
**Output:** Real predictions based on learned patterns!  
**Examples:**
- "cat sat" → predict "on" (90%)
- "dog play" → predict "ed" (85%)

## Key State Structure (game.js):

```javascript
Game.state = {
    // Existing
    currentPhase: 0,
    score: 0,
    level: 0,
    tokensProcessed: 0,
    modelName: 'Unnamed Model',
    avatar: 'robot1.png',
    
    // NEW - Training Data
    trainingText: "A cat sat on a mat. The dog played with a ball.",
    tokens: [],           // Filled in Phase 0
    embeddings: {},       // Filled in Phase 1
    attention: {},        // Filled in Phase 2
    model: {},            // Filled in Phase 3
    
    // Progress tracking
    phaseCompleted: {},
    phaseScores: {}
}
```

## Benefits:

✅ **Connected Journey** - Each phase builds on the last  
✅ **Real Learning** - User sees how their work creates the model  
✅ **Actual Generation** - Phase 4 uses REAL data from training  
✅ **Educational** - Shows the full AI pipeline  
✅ **Gamified** - User's choices directly impact results

## Implementation Order:

1. ✅ Remove tour, add reset modal
2. 🔄 Add trainingText to Game.state (CURRENT)
3. Create Phase -1 (Overview)
4. Refactor Phase 0 to use trainingText
5. Refactor Phase 1 to use stored tokens
6. Refactor Phase 2 to use embeddings
7. Refactor Phase 3 to build model
8. Refactor Phase 4 to generate from model
9. Add recap system
10. Add avatars
11. Fix scroll/centering

Let's GO! 🚀

