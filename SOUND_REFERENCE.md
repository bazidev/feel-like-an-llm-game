# Sound Library Reference Guide

## 🎵 Complete Sound Library

### Available Sounds (13 Total)

| Sound | Volume | Rate | Purpose | Best For |
|-------|--------|------|---------|----------|
| **hover** | 0.12 | 2.5 | Quick high C | Element hover feedback |
| **click** | 0.15 | 1.5 | High E crisp | Button clicks, selections |
| **correct** | 0.25 | 1.8 | A-C chirp | Quick correct answers |
| **wrong** | 0.2 | 0.5 | Low buzz | Quick wrong answers |
| **warning** | 0.22 | 0.9 | B-C alert | Rule violations, penalties |
| **coin** | 0.2 | 2.2 | B-E pickup | Token collection, progress |
| **notification** | 0.18 | 1.6 | G-C bell | Info messages, hints |
| **success** | 0.3 | 1.0 | E-G-C ascending | Section completions |
| **error** | 0.2 | 0.7 | Ab-Eb descending | System errors |
| **powerup** | 0.3 | 1.4 | A-C#-E-A rising | Big challenge completions |
| **levelUp** | 0.4 | 1.2 | C-E-G-C-E celebration | Phase completions |
| **victory** | 0.35 | 1.1 | C-E-G-C-E-C triumph | Game completion |
| **timeout** | 0.25 | 2.0 | Triple beep | Time warnings (future use) |

## 🎯 Usage Guidelines

### Quick Feedback (< 0.2 sec)
```javascript
// Use for immediate UI response
SoundManager.play('hover');  // On element hover
SoundManager.play('click');  // On button click
```

### Quiz/Challenge Feedback
```javascript
// Quick answers in quizzes/challenges
SoundManager.play('correct');  // ✓ Correct answer
SoundManager.play('wrong');    // ✗ Wrong answer
```

### Progress & Collection
```javascript
// For accumulative actions
SoundManager.play('coin');         // Token collected
SoundManager.play('notification'); // Hint appears
SoundManager.play('warning');      // Rule violation
```

### Achievements (Hierarchical)
```javascript
// Small achievement
SoundManager.play('success');  // Completed a section

// Medium achievement
SoundManager.play('powerup');  // Completed a big challenge

// Large achievement
SoundManager.play('levelUp');  // Completed entire phase

// Ultimate achievement
SoundManager.play('victory');  // Completed entire game!
```

### Errors & Alerts
```javascript
// System issues
SoundManager.play('error');    // Something went wrong

// User mistakes
SoundManager.play('wrong');    // Incorrect answer
SoundManager.play('warning');  // Breaking a rule
```

## 🎼 Sound Patterns (Musical Notes)

Each sound uses real musical notes for pleasant audio:

- **hover**: High C (1046.50 Hz) - Quick, non-intrusive
- **click**: High E (1318.51 Hz) - Crisp, definitive
- **correct**: A-C (880-1046 Hz) - Cheerful chirp
- **wrong**: Low buzz (220-185 Hz) - Descending, sad
- **warning**: B-C (493-523 Hz) - Alert, attention-grabbing
- **coin**: B-E (987-1318 Hz) - Pickup, collection
- **notification**: G-C (783-1046 Hz) - Gentle bell
- **success**: E-G-C (659-783-1046 Hz) - Ascending, uplifting
- **error**: Ab-Eb (415-311 Hz) - Descending, wrong
- **powerup**: A-C#-E-A (440-554-659-880 Hz) - Rising whoosh
- **levelUp**: C-E-G-C-E (523-659-783-1046-1318 Hz) - Full celebration
- **victory**: C-E-G-C-E-C (523-659-783-1046-1318-1046 Hz) - Grand triumph
- **timeout**: 1760 Hz triple beep - Urgent

## 📱 Implementation Examples

### Adding Hover Sound to Interactive Elements
```javascript
// Add to style initialization
setTimeout(() => {
    document.querySelectorAll('.interactive-element').forEach(el => {
        el.addEventListener('mouseenter', () => {
            SoundManager.play('hover');
        });
    });
}, 100);
```

### Token Collection Pattern
```javascript
// When user collects/validates a token
SoundManager.play('coin');
Game.addScore(10);
// Visual feedback...
```

### Quiz Answer Pattern
```javascript
if (isCorrect) {
    SoundManager.play('correct');
    Game.addScore(20);
} else {
    SoundManager.play('wrong');
    Game.addScore(-5);
}
```

### Achievement Hierarchy Pattern
```javascript
// Section complete
SoundManager.play('success');
Game.addScore(50);

// Challenge complete
SoundManager.play('powerup');
Game.addScore(100);

// Phase complete
SoundManager.play('levelUp');
Game.addScore(200);

// Game complete
SoundManager.play('victory');
Game.saveToScoreboard();
```

## 🎨 Sound Design Principles

### Volume Balance
- **Quiet** (0.12-0.18): hover, notification - Non-intrusive
- **Medium** (0.20-0.25): click, wrong, coin, correct, warning - Functional
- **Loud** (0.30-0.40): success, powerup, victory, levelUp - Celebratory

### Rate/Speed
- **Slow** (0.5-0.9): wrong, error, warning - Negative feedback
- **Normal** (1.0-1.4): success, powerup, levelUp - Neutral/positive
- **Fast** (1.5-2.5): click, hover, timeout, coin - Quick actions

### Musical Quality
All sounds use real musical intervals:
- **Major intervals** (E-G-C, A-C#-E) = Positive, uplifting
- **Minor intervals** (Ab-Eb) = Sad, negative
- **Perfect intervals** (G-C, B-C) = Neutral, informative

## 🚀 Best Practices

### DO:
✅ Use hover sounds on all interactive elements
✅ Use coin for progress/collection actions
✅ Use correct/wrong for quick feedback
✅ Use powerup for big accomplishments
✅ Use victory only for final game completion
✅ Use warning for rule violations
✅ Use notification for helpful messages

### DON'T:
❌ Don't use levelUp for small achievements
❌ Don't use success for everything
❌ Don't use error for user mistakes (use wrong/warning)
❌ Don't play victory multiple times
❌ Don't forget hover sounds on interactive elements
❌ Don't mix up quick feedback (correct) with achievements (success)

## 🎮 Current Usage Map

### Phase 0 (Overview)
- `click` - Button clicks
- `hover` - Avatar/dataset hover
- `success` - Dataset selection
- `levelUp` - Avatar confirmation

### Phase 1 (Tokenization)
- `click` - Auto-demo highlighting
- `coin` - Token collection
- `correct` - Quiz correct
- `wrong` - Quiz/selection wrong
- `warning` - Rule violation
- `notification` - Auto-demo complete
- `levelUp` - Phase complete

### Phase 2 (Embeddings)
- `click` - Drag & drop
- `powerup` - Grouping success
- `wrong` - Grouping fail

### Phase 3 (Attention)
- `click` - Word/slider selection
- `correct` - Attention correct
- `wrong` - Attention wrong
- `coin` - Sentence progress
- `powerup` - All sentences complete

### Phase 4 (Training)
- `click` - Counting actions
- `success` - Training complete
- `error` - Training errors

### Phase 5 (Generation)
- `click` - Token selection
- `success` - Generation steps
- `levelUp` - Generation complete

### Phase 6 (Finale)
- `click` - Navigation
- `victory` - Game complete
- `powerup` - High score achieved

### Game UI
- `click` - All buttons
- `notification` - Scoreboard open
- `warning` - Reset confirmation

## 📊 Sound Coverage

**Total Sounds**: 13
**Actively Used**: 12 (92%)
**Unused**: 1 (timeout - reserved for future time-based features)

**Total Sound Triggers**: ~150+ across entire game
**User Feedback Moments**: ~95% have appropriate sounds

This comprehensive sound design creates a polished, responsive, and rewarding user experience! 🎉

