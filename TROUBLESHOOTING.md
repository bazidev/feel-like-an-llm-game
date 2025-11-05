# 🔧 Troubleshooting Guide

## Issue: "Phase not yet implemented" showing on screen

### Quick Fix Steps:

1. **Open Browser Console** (this is important!)
   - Chrome/Edge: Press `F12` or `Cmd+Option+J` (Mac) / `Ctrl+Shift+J` (Windows)
   - Firefox: Press `F12` or `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)
   - Safari: `Cmd+Option+C`

2. **Refresh the page** with `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows) to do a hard refresh

3. **Check the console output** - You should see:
   ```
   🚀 Feel Like an LLM - Game Starting...
   ✅ Loaded phases: phase0, phase1, phase2, ...
   📚 GSAP loaded: true
   🔊 Howler loaded: true
   🎮 Rendering phase: phase0
   ✅ phase0 rendered successfully
   ```

4. **If you see errors or missing phases**, look for:
   - ❌ Red errors in console
   - ⚠️ Missing phase warnings
   - 🔍 "Phase object exists: false"

### Common Issues & Solutions:

#### Issue 1: Scripts not loading (404 errors)
**Solution:** Make sure you're running a web server, not opening the file directly.

```bash
cd "/Users/melbazi/Desktop/feel like an llm"
python3 -m http.server 8888
```
Then visit: http://localhost:8888

#### Issue 2: CORS errors or security warnings
**Solution:** Use a local server (as above), don't open `index.html` directly with `file://`

#### Issue 3: Cached old version
**Solution:** Hard refresh:
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`
- Or clear browser cache

#### Issue 4: Phase files not loading
**Check file structure:**
```bash
cd "/Users/melbazi/Desktop/feel like an llm"
ls -la phases/
```

You should see:
- phase0-naming.js
- phase1-tokenization.js
- phase2-embeddings.js
- phase3-attention.js
- phase4-prediction.js
- phase5-training.js
- phase6-application.js

#### Issue 5: JavaScript errors in phase files
**Solution:** Check console for specific error messages. The debug version will show exactly which phase failed and why.

### Debug Commands:

Open browser console and type:

```javascript
// Check if phase0 exists
console.log(window.phase0);

// Check if all phases exist
for(let i = 0; i <= 6; i++) {
    console.log(`phase${i}:`, typeof window['phase'+i]);
}

// Manually try to render phase 0
if (window.phase0) {
    const container = document.getElementById('phaseContainer');
    window.phase0.render(container);
}
```

### Still Not Working?

1. **Check the test page:**
   Open: http://localhost:8888/test-phases.html
   This will show which phases are loading correctly.

2. **Try a different browser:**
   - Chrome
   - Firefox
   - Safari
   - Edge

3. **Check browser compatibility:**
   Make sure you're using a modern browser (2020+)
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

4. **Disable browser extensions:**
   Ad blockers or script blockers might interfere.
   Try in incognito/private mode.

5. **Check the server is running:**
   ```bash
   curl http://localhost:8888
   ```
   Should return the HTML content.

### Getting Detailed Debug Info:

The updated game now includes comprehensive logging. After refreshing:

1. Open console
2. Look for these logs:
   - `🚀 Feel Like an LLM - Game Starting...`
   - `✅ Loaded phases: ...`
   - `🎮 Rendering phase: phase0`
   - `🔍 Phase object exists: true/false`
   - `🔍 Render function exists: true/false`

3. If phase object exists but render fails, you'll see the exact error
4. If phase object doesn't exist, you'll see which phases ARE available

### Quick Test:

Try this in the browser console:
```javascript
// Test Phase 0
Game.state.currentPhase = 0;
Game.renderCurrentPhase();

// Test Phase 1
Game.state.currentPhase = 1;
Game.renderCurrentPhase();
```

This will manually trigger phase rendering and show any errors.

---

## Need More Help?

1. Share the console output
2. Share any red error messages
3. Try the test-phases.html file
4. Check Network tab for failed script loads

The game SHOULD work - all files are properly created and structured!

