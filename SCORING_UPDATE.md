# Scoring System Update - Combined Rating

## What Changed

Updated the scoreboard system to send a **combined rating** (that includes both score and time) as the `totale_score`, while keeping score and time separate for display purposes.

## Changes Made

### 1. `scoreboard-api.js` - Score Calculation
**Before:**
```javascript
totale_score: Game.state.score, // Just the raw score
```

**After:**
```javascript
// Calculate elapsed time and rating
const elapsedTimeSeconds = this.getElapsedTime();
const rating = Game.calculateRating(Game.state.score, elapsedTimeSeconds, Game.state.tokensProcessed);

totale_score: rating, // Combined rating (score + time)
score: Game.state.score, // Raw score
counter_time: elapsedTimeSeconds, // Time in seconds
```

### 2. Success Messages Updated

**End Game (game.js):**
- Now shows: `🎉 Score saved! Rating: 127.5 (850 pts, 12:34)`
- Displays rating, raw score, and time together

**Game Complete (phase6-finale.js):**
- Now shows: `🎉 New high score! Rating: 145.2 (1250 pts, 15:42)`
- Displays rating, raw score, and time together

## How It Works

### Rating Formula (from `game.js`)
```javascript
calculateRating(score, timeSeconds, tokens) {
    const maxScore = 2000; // Maximum achievable score
    const targetTime = 900; // 15 minutes (target completion time)
    
    // Score Component (0-100 scale) - 50% weight
    const scoreComponent = Math.min((score / maxScore) * 100, 100);
    
    // Time Component (0-100 scale) - 50% weight
    // Fast completion gets bonus, slow gets penalty
    const timeComponent = Math.max(0, Math.min(100, (targetTime / timeSeconds) * 100));
    
    // Token Bonus (small multiplier for engagement)
    const tokenBonus = 1 + (tokens / 1000); // Each 1000 tokens adds 100% bonus
    
    // Final Rating: 50% score + 50% time, with token multiplier
    const rating = ((scoreComponent * 0.5) + (timeComponent * 0.5)) * tokenBonus;
    
    return Math.round(rating * 10) / 10; // Round to 1 decimal
}
```

## Data Sent to API

```javascript
{
    user_name: "user_abc123",           // Unique username
    game_name: "Feel like an LLM",
    game_version: "1.0.0",
    totale_score: 142.8,                // ✨ RATING (score + time combined)
    name: "MyAI",                       // Display name
    avatar_code: "robot",               // Avatar ID
    score: 1150,                        // Raw game points
    counter_time: 780,                  // Time in seconds (13:00)
    playedAt: "2025-11-11T10:30:00.000Z"
}
```

## Benefits

1. **Fair Ranking**: Players are ranked by overall performance (both accuracy and speed)
2. **Separate Display**: Score and time are still available separately for detailed stats
3. **Transparent**: Success messages show all three values (rating, score, time)
4. **Consistent**: Works in both "End Game" and game completion scenarios

## Testing

To verify the changes work correctly:
1. Complete a game or click "End Game"
2. Check console logs for: `totale_score (rating)`, `score (raw)`, and `counter_time`
3. Success popup should show: `Rating: X (Y pts, MM:SS)`
4. Leaderboard should rank by `totale_score` (the combined rating)

## Example Scenarios

| Score | Time | Tokens | Rating | Reasoning |
|-------|------|--------|--------|-----------|
| 1000  | 600s (10min) | 150 | ~87.5 | Good score, fast time |
| 2000  | 900s (15min) | 200 | ~110.0 | Perfect score, target time |
| 800   | 1200s (20min) | 100 | ~52.5 | Lower score, slow time |
| 1500  | 450s (7.5min) | 250 | ~143.8 | High score, very fast, high engagement |

---

**Date**: November 11, 2025
**Changes Applied To**: 
- `scoreboard-api.js`
- `game.js` 
- `phases/phase6-finale.js`


