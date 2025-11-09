# Phase Structure Standard

## Core Principle
**Keep content minimal per page** - Break into multiple sub-pages when needed to fit viewport comfortably.

---

## Standard Structure (Flexible)

All learning phases should follow this flow:

```
1. INTRO     → Explain the concept
   ├─ intro (or concept1, concept2, concept3...)
   └─ Can have multiple pages if concept is complex

2. EXAMPLES  → Show how it works
   ├─ examples (or example1, example2, example3...)
   └─ Show 2-4 tutorial examples

3. MINI-GAME → Interactive practice
   ├─ Can be multiple challenges/exercises
   └─ 3-5 challenges recommended

4. RECAP     → Summary and journey
   ├─ recap (or recap1, recap2...)
   └─ Summary + journey checkpoint + scale comparison
```

**Key Rule**: Pages can be split (intro1, intro2, recap1, recap2) when content is too much for one page.

---

## Current Phase Status

### ✅ Phase 0: Overview (Setup Phase)
**Structure:** intro → data → name → avatar
- Special case - onboarding phase
- Keep as-is

### ✅ Phase 1: Tokenization (REFERENCE EXAMPLE)
**Structure:** concept1 → concept2 → examples → yourdata → info1 → info2 → recap

**Status:** ✅ **KEEP AS-IS** - User likes this structure

Contains:
- ✅ Intro split into concepts (concept1, concept2)
- ✅ Examples section
- ✅ Interactive data step (yourdata)
- ✅ Info pages (info1, info2)
- ✅ 5 mini-game challenges
- ✅ Recap with journey checkpoint

### ✅ Phase 2: Embeddings (REFERENCE EXAMPLE)
**Structure:** concept1 → concept2 → examples → group → recap1 → recap2

**Status:** ✅ **KEEP AS-IS** - User likes this structure

Contains:
- ✅ Intro split (concept1, concept2)
- ✅ Examples (3 language examples)
- ✅ Mini-game (drag-drop grouping)
- ✅ Recap split (recap1, recap2)

### ✅ Phase 3: Attention
**Structure:** intro → examples → calculate → recap1 → recap2

**Status:** ✅ **GOOD** - Follows structure

Contains:
- ✅ Intro
- ✅ Examples (2 tutorial examples)
- ✅ Mini-game (calculate attention)
- ✅ Recap split (recap1, recap2)

### ❌ Phase 4: Training (NEEDS FIX)
**Current:** intro → practice → build → recap

**Issue:** ❌ **MISSING EXAMPLES SECTION**

**Required Fix:**
```
intro → examples → practice → build → recap
```

Add examples section showing:
1. Example 1: Simple bigram counting demonstration
2. Example 2: Probability calculation walkthrough
3. (Optional) Example 3: Compare two different training datasets

### ✅ Phase 5: Generation
**Structure:** intro → challenge → generate → recap

**Status:** ✅ **PERFECT**

Contains:
- ✅ Intro
- ✅ Examples (quiz challenges)
- ✅ Mini-game (text generation)
- ✅ Recap with journey checkpoint + scale animation

### ⚠️ Phase 6: Sampling
**Structure:** intro → temperature → top_p → repetition → presence → challenge → recap

**Status:** ⚠️ **MISSING JOURNEY CHECKPOINT IN RECAP**

Contains:
- ✅ Intro
- ✅ Examples split by parameter (4 interactive demos)
- ✅ Mini-game (challenge scenarios)
- ⚠️ Recap missing journey checkpoint

**Required Fix:** Add journey checkpoint to recap

---

## Template Structure

### Minimal (Simple Concepts)
```javascript
{
    currentStep: 'intro',
    
    steps: [
        'intro',        // Single intro page
        'examples',     // Single examples page
        'mini-game',    // Interactive challenges
        'recap'         // Single recap page
    ]
}
```

### Extended (Complex Concepts - RECOMMENDED)
```javascript
{
    currentStep: 'concept1',  // or 'intro1'
    
    steps: [
        'concept1',     // First concept explanation
        'concept2',     // Second concept explanation
        'concept3',     // (Optional) Third concept if needed
        
        'examples',     // First set of examples
        'examples2',    // (Optional) More examples if needed
        
        'practice',     // First mini-game/challenge
        'challenge',    // (Optional) Additional challenges
        
        'recap1',       // First recap page
        'recap2'        // Journey checkpoint + scale comparison
    ]
}
```

---

## Page Content Guidelines

### Intro Pages (concept1, concept2, etc.)
**Content:**
- Main heading with phase emoji
- Concept explanation (clear, concise)
- "Real LLM Concept" box (purple gradient)
- "Reality Check" box (red gradient)
- Next button

**Max Content:** 
- 1-2 concept explanations per page
- Keep under viewport height (~700-800px)

### Examples Pages
**Content:**
- Tutorial examples (2-4)
- Interactive demonstrations
- Step-by-step walkthroughs
- Can be split into example1, example2 if needed

### Mini-Game Pages
**Content:**
- Interactive challenges (3-5 recommended)
- Clear instructions
- Immediate feedback
- Progress tracking

### Recap Pages (recap1, recap2, etc.)
**Content:**
- **recap1**: Summary of what was learned, key insights
- **recap2** (if split): Journey checkpoint + scale comparison animation
  - 📍 Where You Are
  - ✅ What You Did
  - 🎯 What's Next
  - 💡 Why It Matters

**Must Include:**
- Summary of phase
- Journey checkpoint (4 sections)
- Scale comparison animation (when applicable)
- Continue button to next phase

---

## Required Elements Per Phase

### Every Phase Must Have:
1. ✅ Intro/Concept explanation (1+ pages)
2. ✅ Examples section (1+ pages)
3. ✅ Mini-game/Interactive practice (1+ pages)
4. ✅ Recap with journey checkpoint (1+ pages)
5. ✅ "Real LLM Concept" boxes throughout
6. ✅ Scale comparison animation (where applicable)

### Optional Elements:
- Additional info pages (info1, info2...)
- Interactive data steps (yourdata, etc.)
- Multiple challenge types
- Split recaps for better pacing

---

## Fixes Required

### 🔴 CRITICAL
1. **Phase 4**: Add examples section (between intro and practice)
2. **Phase 6**: Add journey checkpoint to recap

### ✅ NO CHANGES NEEDED
- Phase 0: Overview (setup phase)
- Phase 1: Tokenization (keep as-is)
- Phase 2: Embeddings (keep as-is)
- Phase 3: Attention (already good)
- Phase 5: Generation (already perfect)

---

## Implementation Priority

1. ✅ **Fix Phase 4** - Add examples section
2. ✅ **Fix Phase 6** - Add journey checkpoint to recap
3. ✅ **Verify all phases** have examples section
4. ✅ **Ensure consistency** while allowing flexibility

