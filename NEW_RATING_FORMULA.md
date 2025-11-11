# New Rating Formula - More Permissive & Intuitive

## Problem with Old Formula
The old formula was too harsh:
- 360 points in 1:17 → **Only 59 total score** ❌
- Score was scaled as percentage of 2000, making early game scores tiny
- 50/50 weighting meant even perfect speed couldn't overcome low raw score

## New Formula - Simple & Generous

### Core Concept
```
Total Score = Raw Score × Time Multiplier + Token Bonus
```

**Start with your actual points, then multiply based on speed!**

---

## Time Multipliers

| Completion Time | Multiplier | Description |
|----------------|------------|-------------|
| ≤ 1:30 (90s) | **2.0x** | 🔥 Super fast! Double your score! |
| 1:30 - 3:00 | **2.0x → 1.0x** | 📈 Fast bonus (linear decrease) |
| 3:00 (180s) | **1.0x** | ⚖️ Target time (score = points) |
| 3:00 - 10:00 | **1.0x → 0.8x** | 📉 Small penalty (linear decrease) |
| ≥ 10:00 (600s) | **0.8x** | 🐢 Slow (but still 80%!) |

**Token Bonus:** Each token processed adds 0.1 points

---

## Examples with Your Case

### Your Example: 360 points in 1:17 (77 seconds)

**Calculation:**
- Time: 77 seconds (faster than 90s!)
- Time Multiplier: **2.0x** (maximum bonus!)
- Token Bonus: ~150 tokens × 0.1 = 15
- **Total Score: (360 × 2.0) + 15 = 720 + 15 = 735** ✅

**Before:** 59 | **After:** 735 🎉 (Even better than expected!)

---

### Example: 360 points in 3:00 (180 seconds)

**Calculation:**
- Time: 180 seconds (target)
- Time Multiplier: **1.0x**
- Token Bonus: 150 × 0.1 = 15
- **Total Score: (360 × 1.0) + 15 = 375** ✅

**Matches your expectation:** ~360

---

### Example: 360 points in 5:00 (300 seconds)

**Calculation:**
- Time: 300 seconds (between 180s and 600s)
- Time Multiplier: `1.0 - (0.2 × (300 - 180) / (600 - 180))` = `1.0 - 0.057` = **0.94x**
- Token Bonus: 150 × 0.1 = 15
- **Total Score: (360 × 0.94) + 15 = 338 + 15 = 353** ✅

**Matches your expectation:** ~300-360

---

## More Examples

### Fast Player (High Score)
- **1200 points in 2:00 (120s)**
- Multiplier: ~1.66x
- **Total: 1200 × 1.66 = 1992** 🏆

### Perfect Speed Run
- **1800 points in 1:20 (80s)**
- Multiplier: 2.0x (max!)
- **Total: 1800 × 2.0 = 3600** 🔥

### Casual Player
- **800 points in 8:00 (480s)**
- Multiplier: ~0.86x
- **Total: 800 × 0.86 = 688** 😊

### Slow but Thorough
- **1500 points in 12:00 (720s)**
- Multiplier: 0.8x (minimum)
- **Total: 1500 × 0.8 = 1200** 👍

---

## Rating Grades (Updated)

| Grade | Total Score | Label | Color |
|-------|-------------|-------|-------|
| **S** | ≥ 3000 | Legendary | 🟡 Gold |
| **A+** | ≥ 2000 | Excellent | 🟢 Green |
| **A** | ≥ 1200 | Great | 🔵 Blue |
| **B** | ≥ 800 | Good | 🟣 Purple |
| **C** | ≥ 400 | Fair | 🟠 Pink |
| **D** | < 400 | Needs Practice | 🔴 Red |

---

## Key Benefits

1. ✅ **Intuitive**: Score starts with your actual points
2. ✅ **Rewarding**: Fast players get 2x bonus (not just 50% more)
3. ✅ **Permissive**: Even slow players keep 80% of their score
4. ✅ **Fair**: Linear scaling between breakpoints
5. ✅ **Transparent**: Easy to understand and calculate

---

## Formula Details

### Time Multiplier Calculation

```javascript
if (timeSeconds <= 90) {
    // Super fast: 2.0x
    timeMultiplier = 2.0;
    
} else if (timeSeconds <= 180) {
    // Fast: 2.0x → 1.0x (linear)
    timeMultiplier = 2.0 - ((timeSeconds - 90) / 90);
    
} else if (timeSeconds <= 600) {
    // Slow: 1.0x → 0.8x (linear)
    timeMultiplier = 1.0 - (0.2 * (timeSeconds - 180) / 420);
    
} else {
    // Very slow: 0.8x
    timeMultiplier = 0.8;
}
```

### Final Rating

```javascript
rating = (score × timeMultiplier) + (tokens × 0.1)
```

---

## Comparison Chart

| Raw Score | Time | Old Total | New Total | Change |
|-----------|------|-----------|-----------|--------|
| 360 | 1:17 | 59 | **735** | +1146% 🚀 |
| 360 | 3:00 | 36 | **375** | +942% 🎉 |
| 800 | 5:00 | 68 | **767** | +1028% ✨ |
| 1200 | 2:00 | 106 | **1992** | +1779% 🔥 |
| 2000 | 1:30 | 173 | **4000** | +2212% 💥 |

**Every scenario improved dramatically!**

---

**Date**: November 11, 2025
**File Modified**: `game.js` - `calculateRating()` and `getRatingGrade()`

