// Phase 1: Tokenization - USER DOES IT HANDS-ON
window.phase1 = {
    currentStep: 'intro', // 'intro' -> 'practice' -> 'yourdata' -> 'recap'
    userTokens: [],
    correctTokens: [],
    score: 0,
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'practice') {
            this.renderPractice(container);
        } else if (this.currentStep === 'yourdata') {
            this.renderYourData(container);
        } else if (this.currentStep === 'recap') {
            this.renderRecap(container);
        }
    },
    
    renderIntro(container) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px;">
                <div style="max-width: 800px; text-align: center;">
                    
                    <h1 style="font-size: 32px; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✂️ Tokenization
                    </h1>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 32px;">
                        Break text into tokens - the atoms of AI understanding
                    </p>
                    
                    <!-- Rules Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">📋</span>
                            <h3 style="font-size: 18px; color: var(--primary); margin: 0;">Tokenization Rules</h3>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">1. Split Suffixes</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">-ing, -ed, -ness separate</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">2. Spaces are Tokens</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Each space counts</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">3. Punctuation Splits</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Periods, commas separate</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">4. Contractions Split</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">At apostrophe: I'm → I | 'm</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Reality Check -->
                    <div style="padding: 16px; background: rgba(239, 68, 68, 0.08); border: 2px solid rgba(239, 68, 68, 0.25); 
                               border-radius: 12px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <span style="font-size: 18px;">⚡</span>
                            <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                Reality Check: You're a blind machine. You don't "understand" - you follow patterns learned from millions of examples.
                            </span>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase1.startPractice()" 
                            style="font-size: 17px; padding: 14px 40px;">
                        🚀 Start Tokenizing
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    startPractice() {
        this.currentStep = 'practice';
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderPractice(container) {
        // Simple practice: user types how to split a word
        const word = "playing";
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Practice: "${word}"</h2>
                        <p class="phase-subtitle">How would you tokenize this?</p>
                    </div>
                    
                    <div class="phase-description">
                        Type how you'd split this word, separated by spaces. Example: "play ing"
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 Hint</h4>
                        <p>The suffix "-ing" should split from the root word "play"</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 600px;">
                        
                        <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px; text-align: center;">
                            <div style="font-size: 36px; font-weight: 700; color: white; font-family: 'JetBrains Mono', monospace; margin-bottom: 16px;">
                                ${word}
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                                Your tokenization (separate with spaces):
                            </label>
                            <input type="text" id="tokenInput" 
                                   placeholder="e.g., play ing"
                                   style="width: 100%; padding: 14px; background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(255, 255, 255, 0.1); 
                                          border-radius: 10px; color: white; font-size: 16px; font-family: 'JetBrains Mono', monospace;"
                                   onkeypress="if(event.key==='Enter') phase1.checkPractice()">
                        </div>
                        
                        <div id="feedback" style="display: none; padding: 16px; border-radius: 10px; margin-bottom: 24px;"></div>
                        
                        <button class="btn-primary" onclick="phase1.checkPractice()" style="width: 100%;">
                            Check Answer
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => document.getElementById('tokenInput').focus(), 100);
    },
    
    checkPractice() {
        const input = document.getElementById('tokenInput').value.trim();
        const feedback = document.getElementById('feedback');
        
        if (input === 'play ing' || input === 'play | ing') {
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 15px; color: #22c55e; font-weight: 600; margin-bottom: 8px;">✓ Perfect!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    You correctly split "play" (root) + "ing" (suffix)
                </div>
            `;
            SoundManager.play('success');
            Game.addScore(50);
            
            setTimeout(() => {
                this.currentStep = 'yourdata';
                this.render(document.getElementById('phaseContainer'));
            }, 2000);
        } else {
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 15px; color: #ef4444; font-weight: 600; margin-bottom: 8px;">Try Again</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    Hint: The suffix "-ing" should be separate from "play"
                </div>
            `;
            SoundManager.play('error');
            Game.addScore(-10);
        }
    },
    
    renderYourData(container) {
        // Now tokenize THEIR training data
        const text = Game.state.trainingText;
        
        // Calculate correct answer
        this.correctTokens = this.tokenizeCorrectly(text);
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Tokenize YOUR Data</h2>
                        <p class="phase-subtitle">Apply rules to your training text</p>
                    </div>
                    
                    <div class="phase-description">
                        Now tokenize your actual training data. Click between characters to add split marks (|).
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 Target</h4>
                        <p>You need approximately <strong>${this.correctTokens.length} tokens</strong> based on the rules.</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px;">
                            <div id="tokenizeArea" style="font-size: 18px; font-family: 'JetBrains Mono', monospace; color: white; line-height: 1.8; cursor: text;">
                                ${this.makeClickable(text)}
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                            <div style="flex: 1; padding: 12px; background: rgba(0, 212, 255, 0.05); border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px; color: var(--primary); font-weight: 700;" id="tokenCount">0</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Your Tokens</div>
                            </div>
                            <div style="flex: 1; padding: 12px; background: rgba(191, 0, 255, 0.05); border-radius: 8px; text-align: center;">
                                <div style="font-size: 24px; color: var(--secondary); font-weight: 700;">${this.correctTokens.length}</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Target Tokens</div>
                            </div>
                        </div>
                        
                        <button class="btn-primary" onclick="phase1.submitTokenization()" style="width: 100%;">
                            Submit Tokenization
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.userTokens = [text]; // Start with full text
        this.updateTokenCount();
    },
    
    makeClickable(text) {
        let html = '';
        for (let i = 0; i < text.length; i++) {
            html += `<span class="char" data-idx="${i}">${text[i]}</span>`;
            if (i < text.length - 1) {
                html += `<span class="split-point" data-idx="${i}" onclick="phase1.toggleSplit(${i})"></span>`;
            }
        }
        return html;
    },
    
    toggleSplit(idx) {
        const splitPoints = document.querySelectorAll('.split-point');
        const point = splitPoints[idx];
        
        if (point.classList.contains('active')) {
            point.classList.remove('active');
            point.textContent = '';
        } else {
            point.classList.add('active');
            point.textContent = '|';
        }
        
        this.recalculateTokens();
        SoundManager.play('click');
    },
    
    recalculateTokens() {
        const text = Game.state.trainingText;
        const splitPoints = document.querySelectorAll('.split-point.active');
        const splits = Array.from(splitPoints).map(sp => parseInt(sp.dataset.idx));
        
        this.userTokens = [];
        let start = 0;
        
        splits.sort((a, b) => a - b).forEach(idx => {
            this.userTokens.push(text.substring(start, idx + 1));
            start = idx + 1;
        });
        
        if (start < text.length) {
            this.userTokens.push(text.substring(start));
        }
        
        if (this.userTokens.length === 0) {
            this.userTokens = [text];
        }
        
        this.updateTokenCount();
    },
    
    updateTokenCount() {
        const countElem = document.getElementById('tokenCount');
        if (countElem) {
            countElem.textContent = this.userTokens.length;
        }
    },
    
    tokenizeCorrectly(text) {
        // Simple tokenizer following the rules
        const tokens = [];
        const words = text.split(/(\s+|[.,!?])/);
        
        words.forEach(word => {
            if (word.trim() === '') {
                if (word) tokens.push(word);
                return;
            }
            
            if (/^[.,!?]$/.test(word)) {
                tokens.push(word);
                return;
            }
            
            // Split suffixes
            if (word.endsWith('ing') && word.length > 3) {
                tokens.push(word.slice(0, -3), 'ing');
            } else if (word.endsWith('ed') && word.length > 2) {
                tokens.push(word.slice(0, -2), 'ed');
            } else if (word.endsWith('ness') && word.length > 4) {
                tokens.push(word.slice(0, -4), 'ness');
            } else if (word.includes("'")) {
                const parts = word.split("'");
                tokens.push(parts[0], "'" + parts[1]);
            } else {
                tokens.push(word);
            }
        });
        
        return tokens.filter(t => t.length > 0);
    },
    
    submitTokenization() {
        const accuracy = this.calculateAccuracy();
        
        if (accuracy >= 0.8) { // 80% accurate
            Game.state.tokens = this.correctTokens; // Save correct version
            Game.addScore(100);
            Game.state.tokensProcessed = this.correctTokens.length;
            SoundManager.play('levelUp');
            
            this.currentStep = 'recap';
            this.render(document.getElementById('phaseContainer'));
        } else {
            Game.showMessage(`Not quite! You're ${Math.round(accuracy * 100)}% accurate. Try again!`, 'error');
            SoundManager.play('error');
        }
    },
    
    calculateAccuracy() {
        const ratio = Math.abs(this.userTokens.length - this.correctTokens.length) / this.correctTokens.length;
        return Math.max(0, 1 - ratio);
    },
    
    renderRecap(container) {
        const tokens = Game.state.tokens;
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 32px; text-align: center; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✓ Phase 1 Complete: Tokenization
                    </h1>
                    
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 32px;">
                        You successfully split your training data into ${tokens.length} tokens
                    </p>
                    
                    <!-- Tokens Display -->
                    <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 12px; margin-bottom: 24px;">
                        <div style="text-align: center; margin-bottom: 12px;">
                            <span style="font-size: 12px; color: var(--text-secondary);">✂️ YOUR TOKENS (${tokens.length} total)</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                            ${tokens.slice(0, 30).map(t => `
                                <span style="padding: 6px 10px; background: rgba(0, 212, 255, 0.15); border: 1px solid rgba(0, 212, 255, 0.3); 
                                             border-radius: 6px; font-size: 13px; color: var(--primary); font-family: 'JetBrains Mono', monospace;">
                                    ${t.replace(/ /g, '␣')}
                                </span>
                            `).join('')}
                            ${tokens.length > 30 ? `<span style="color: var(--text-secondary); font-size: 13px;">...and ${tokens.length - 30} more</span>` : ''}
                        </div>
                    </div>
                    
                    <!-- What Happened -->
                    <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">📊 What Just Happened:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 1.8;">
                            <li>Your text was broken into <strong>${tokens.length} tokens</strong></li>
                            <li>These tokens are now <strong>stored</strong> - every phase uses them</li>
                            <li>You followed patterns (suffixes, punctuation, spaces)</li>
                            <li>You didn't "understand" - you applied rules</li>
                        </ul>
                    </div>
                    
                    <!-- What's Next -->
                    <div style="padding: 20px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.08), rgba(0, 212, 255, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 32px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">🔜 Next: Embeddings</h3>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">
                            Now you'll convert these <strong>${tokens.length} tokens</strong> into numbers (vectors). Similar tokens will get similar numbers - not because you "know" they're similar, but because they appeared in similar contexts during training.
                        </p>
                    </div>
                    
                    <button class="btn-primary" onclick="phase1.completePhase()" style="width: 100%; font-size: 17px; padding: 14px;">
                        Continue to Embeddings →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    completePhase() {
        Game.completePhase(100);
        Game.saveState();
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

// Add CSS for split points
if (!document.getElementById('tokenize-css')) {
    const style = document.createElement('style');
    style.id = 'tokenize-css';
    style.textContent = `
        .char {
            cursor: pointer;
        }
        .split-point {
            display: inline-block;
            width: 4px;
            cursor: pointer;
            color: var(--primary);
            font-weight: bold;
            font-size: 18px;
            position: relative;
            top: -2px;
        }
        .split-point:hover {
            background: rgba(0, 212, 255, 0.2);
        }
        .split-point.active {
            color: var(--primary);
        }
    `;
    document.head.appendChild(style);
}

