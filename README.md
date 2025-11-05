# 🤖 Feel Like an LLM

**Experience the complete journey of building an AI from scratch!**

---

## 🚀 Quick Start

```bash
# Open index.html in your browser
# OR
# If using a local server:
python -m http.server 8000
# Then visit: http://localhost:8000
```

**Hard refresh after opening:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## 🎮 What Is This?

An interactive game where you:
1. **See** how LLMs work from the inside
2. **Build** a real (tiny) AI model
3. **Generate** text from your trained model
4. **Understand** the math behind the magic

**Not a simulation - it actually works!**

---

## 📚 The Journey

### Phase 0: Character Creation
Pick your AI name and avatar

### Phase 1: Tokenization
Break text into tokens (pattern-based splitting)

### Phase 2: Embeddings
Convert tokens to numerical vectors

### Phase 3: Attention
Calculate context importance weights

### Phase 4: Training
Build a bigram prediction model

### Phase 5: Generation ⭐
**Generate real text** from your trained model!

### Phase 6: Finale
Celebrate and see what you built

---

## 🔗 The Magic

**Your data flows through the entire pipeline:**

```
Training Text
    ↓
Tokens (Phase 1)
    ↓
Embeddings (Phase 2)
    ↓
Attention Weights (Phase 3)
    ↓
Trained Model (Phase 4)
    ↓
TEXT GENERATION! (Phase 5)
```

**Every phase uses the output from the previous phase!**

---

## ✨ Key Features

- ✅ **Real AI** - Builds actual bigram model
- ✅ **Text Generation** - Actually works!
- ✅ **Connected Pipeline** - Data flows through phases
- ✅ **Educational** - Learn by building
- ✅ **Interactive** - You do the work
- ✅ **Beautiful** - Modern UI with animations
- ✅ **Persistent** - Saves your progress

---

## 🎯 What You'll Learn

- How tokenization breaks down language
- Why embeddings are mathematical vectors
- How attention weights context
- How training counts patterns
- How generation uses probabilities
- **That LLMs don't "understand" - they do math!**

---

## 🛠️ Technical Stack

- **Pure JavaScript** - No frameworks
- **HTML/CSS** - Modern design
- **GSAP** - Smooth animations
- **Howler.js** - Sound effects
- **LocalStorage** - Save progress
- **Canvas API** - Visualizations

---

## 📖 Documentation

- `COMPLETE.md` - Full feature list
- `FINAL_SUMMARY.md` - Technical details
- `TEST_THIS_NOW.md` - Testing checklist
- `ARCHITECTURE_PLAN.md` - System design

---

## 🎮 How to Play

1. **Hard refresh** the page
2. **Pick your name** and avatar
3. **Complete each phase** by following instructions
4. **Watch your data** transform into an AI
5. **Generate text** in Phase 5!
6. **See statistics** in Phase 6

---

## 🔍 For Developers

### Key Files:
- `game.js` - Core state management
- `phases/phase*.js` - Individual phase logic
- `styles.css` - Modern UI styling
- `sounds.js` - Audio system

### Training Data:
Located in `Game.state.trainingText`:
```javascript
"A cat sat on the mat. The dog played with the ball. 
 The cat likes fish. The dog likes bones."
```

### Data Flow:
```javascript
Game.state = {
  trainingText: "...",
  tokens: [],           // Phase 1
  embeddings: {},       // Phase 2
  attentionWeights: {}, // Phase 3
  model: {},            // Phase 4
}
```

---

## 🐛 Troubleshooting

**Black screen?**
- Hard refresh: `Cmd+Shift+R`
- Clear localStorage: Console → `localStorage.clear()`

**Console errors?**
- Check all phase files loaded
- Verify GSAP and Howler.js CDNs

**Not generating text?**
- Complete Phase 4 first
- Check console: `Game.state.model`

---

## 🎉 Credits

**Built with:**
- Educational intent
- Real AI principles
- Lots of code
- Even more testing

**Purpose:**
Help people understand LLMs by building one!

---

## 📝 License

Educational use encouraged!

---

## 🚀 Get Started!

**Open `index.html` and begin your journey!**

Hard refresh first: `Cmd+Shift+R`

---

**Enjoy building your AI!** 🤖✨
