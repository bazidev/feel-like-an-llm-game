// Phase 1: Tokenization - Connected to Training Data
window.phase1 = {
    currentStep: 'tutorial', // 'tutorial' -> 'apply'
    currentChallenge: 0,
    score: 0,
    
    // Tutorial challenges to teach rules
    tutorialChallenges: [
        {
            word: "playing",
            explanation: "Rule: Common suffixes like -ing, -ed, -ness typically split",
            options: [
                { tokens: ["playing"], correct: false, why: "❌ Too large - '-ing' splits separately" },
                { tokens: ["play", "ing"], correct: true, why: "✓ Perfect! 'play' (root) + 'ing' (suffix)" },
                { tokens: ["p", "l", "a", "y", "i", "n", "g"], correct: false, why: "❌ Too granular" }
            ]
        },
        {
            word: "I'm",
            explanation: "Rule: Contractions split at the apostrophe",
            options: [
                { tokens: ["I'm"], correct: false, why: "❌ Contractions split" },
                { tokens: ["I", "'m"], correct: true, why: "✓ Correct! 'I' + ''m'" },
                { tokens: ["I", "'", "m"], correct: false, why: "❌ Apostrophe groups with suffix" }
            ]
        }
    ],
    
    render(container) {
        if (this.currentStep === 'tutorial') {
            this.renderTutorial(container);
        } else if (this.currentStep === 'apply') {
            this.renderApplyToData(container);
        }
    },
    
    renderTutorial(container) {
        // Don't reset currentChallenge if already in progress
        if (!this.currentChallenge) {
            this.currentChallenge = 0;
        }
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Tokenization: Pattern Rules</h2>
                        <p class="phase-subtitle">Split text by learned patterns</p>
                    </div>
                    
                    <div class="phase-description">
                        Before we tokenize your training data, learn the rules. You're a machine - you don't "understand" words, you follow patterns.
                    </div>
                    
                    <div class="hint-section">
                        <h4>Tokenization Rules</h4>
                        <p><strong>1.</strong> Common suffixes split: -ing, -ed, -ness<br>
                        <strong>2.</strong> Spaces are tokens<br>
                        <strong>3.</strong> Punctuation separates<br>
                        <strong>4.</strong> Contractions split at apostrophe</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> You learned these from millions of examples. You don't "know" meaning - just patterns.
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 600px;">
                        <div style="margin-bottom: 24px; text-align: center;">
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
                                Tutorial: <span id="challengeNum">1</span> of ${this.tutorialChallenges.length}
                            </p>
                            <h3 id="questionText" style="font-size: 16px; color: var(--text-primary); margin-bottom: 12px;">
                                How should "${this.tutorialChallenges[this.currentChallenge].word}" tokenize?
                            </h3>
                            <div style="padding: 12px 18px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(191, 0, 255, 0.05)); 
                                       border-radius: 10px; border: 2px solid rgba(0, 212, 255, 0.25); text-align: left;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 16px;">📋</span>
                                    <span style="font-size: 12px; color: rgba(0, 245, 255, 0.9); font-weight: 600;">
                                        ${this.tutorialChallenges[this.currentChallenge].explanation}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="padding: 20px; background: rgba(0, 212, 255, 0.05); border-radius: 10px; margin-bottom: 24px; text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; color: white; font-family: 'JetBrains Mono', monospace;" id="wordDisplay">
                                ${this.tutorialChallenges[this.currentChallenge].word}
                            </div>
                        </div>
                        
                        <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 12px;">
                            ${this.tutorialChallenges[this.currentChallenge].options.map((opt, i) => `
                                <button class="option-btn" onclick="phase1.selectTutorialOption(${i})" 
                                        style="padding: 16px; background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.1); 
                                        border-radius: 10px; color: white; cursor: pointer; transition: all 0.3s; text-align: center; font-size: 20px; font-family: 'JetBrains Mono', monospace;">
                                    ${opt.tokens.map(t => `<span style="margin: 0 4px; color: var(--primary);">${t}</span>`).join('|')}
                                </button>
                            `).join('')}
                        </div>
                        
                        <div id="feedback" style="margin-top: 20px; padding: 14px; border-radius: 8px; display: none;"></div>
                    </div>
                </div>
            </div>
        `;
    },
    
    selectTutorialOption(optionIndex) {
        const challenge = this.tutorialChallenges[this.currentChallenge];
        const option = challenge.options[optionIndex];
        const feedback = document.getElementById('feedback');
        
        feedback.style.display = 'block';
        
        if (option.correct) {
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            feedback.style.color = '#22c55e';
            feedback.innerHTML = `<strong>✓ Correct!</strong><br>${option.why}`;
            SoundManager.play('success');
            
            // Auto-advance after delay
            setTimeout(() => {
                this.currentChallenge++;
                if (this.currentChallenge >= this.tutorialChallenges.length) {
                    // Tutorial done, move to applying to real data
                    feedback.style.display = 'none';
                    this.currentStep = 'apply';
                    this.render(document.getElementById('phaseContainer'));
                } else {
                    feedback.style.display = 'none';
                    this.renderTutorial(document.getElementById('phaseContainer'));
                }
            }, 1500);
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.style.color = '#ef4444';
            feedback.innerHTML = `<strong>Try Again</strong><br>${option.why}`;
            SoundManager.play('error');
        }
    },
    
    renderApplyToData(container) {
        // Tokenize the training text
        const trainingText = Game.state.trainingText;
        const tokens = this.tokenizeText(trainingText);
        
        // Store in game state
        Game.state.tokens = tokens;
        Game.saveState();
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Tokenizing YOUR Data</h2>
                        <p class="phase-subtitle">Applying rules to training text</p>
                    </div>
                    
                    <div class="phase-description">
                        Now watch as we apply those rules to your actual training data. Each token becomes a number that the AI can work with.
                    </div>
                    
                    <div class="hint-section">
                        <h4>What's Happening</h4>
                        <p>Your text is being split into ${tokens.length} tokens. These tokens will be converted to numbers (embeddings) in the next phase.</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> These tokens are stored. Every phase from now on will use THESE tokens from YOUR data.
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Original Text -->
                        <div style="margin-bottom: 24px;">
                            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                                📖 Original Text
                            </h4>
                            <div style="padding: 20px; background: rgba(255, 255, 255, 0.03); border-radius: 10px; text-align: center; font-size: 18px; line-height: 1.8; color: white;">
                                "${trainingText}"
                            </div>
                        </div>
                        
                        <!-- Tokens Display -->
                        <div style="margin-bottom: 24px;">
                            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                                ✂️ Tokenized (${tokens.length} tokens)
                            </h4>
                            <div style="padding: 20px; background: rgba(0, 212, 255, 0.05); border: 2px solid var(--primary); border-radius: 10px; 
                                       display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center;">
                                ${tokens.map((token, i) => `
                                    <span style="padding: 8px 12px; background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); 
                                                border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--primary); font-weight: 600;">
                                        ${token === ' ' ? '␣' : token}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Stats -->
                        <div style="margin-bottom: 32px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px; text-align: center;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div>
                                    <div style="font-size: 32px; font-weight: 800; color: var(--primary);">${tokens.length}</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Total Tokens</div>
                                </div>
                                <div>
                                    <div style="font-size: 32px; font-weight: 800; color: var(--secondary);">${new Set(tokens).size}</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Unique Tokens</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Complete Button -->
                        <div style="text-align: center;">
                            <button class="btn-primary" onclick="phase1.completeTokenization()" style="padding: 14px 40px; font-size: 17px;">
                                Continue to Embeddings →
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
        
        // Animate tokens
        if (typeof gsap !== 'undefined') {
            gsap.from('span', {
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                stagger: 0.03,
                ease: 'back.out(1.5)'
            });
        }
    },
    
    tokenizeText(text) {
        // Simple tokenization following the rules we taught
        let tokens = [];
        let currentToken = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // Punctuation - separate token
            if (['.', ',', '!', '?', ';', ':'].includes(char)) {
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = '';
                }
                tokens.push(char);
            }
            // Space - separate token
            else if (char === ' ') {
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = '';
                }
                tokens.push(' ');
            }
            // Apostrophe - check for contractions
            else if (char === "'") {
                if (currentToken) {
                    tokens.push(currentToken);
                    currentToken = '';
                }
                currentToken = "'";
            }
            // Letter
            else {
                currentToken += char;
            }
        }
        
        if (currentToken) {
            tokens.push(currentToken);
        }
        
        return tokens;
    },
    
    completeTokenization() {
        SoundManager.play('success');
        Game.addScore(100);
        Game.addTokens(Game.state.tokens.length);
        
        // Mark phase as complete
        Game.completePhase(100, `Tokenized ${Game.state.tokens.length} tokens from your training data!`);
    }
};

