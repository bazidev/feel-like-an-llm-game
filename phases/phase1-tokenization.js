// Phase 1: Tokenization - Pattern Splitting, Not Understanding
window.phase1 = {
    currentChallenge: 0,
    score: 0,
    
    challenges: [
        {
            word: "playing",
            question: "Challenge 1: How should this tokenize?",
            explanation: "Rule: Common suffixes like -ing, -ed, -ness typically split into separate tokens",
            options: [
                { tokens: ["playing"], correct: false, why: "❌ Too large - common suffixes like '-ing' split separately" },
                { tokens: ["play", "ing"], correct: true, why: "✓ Perfect! You recognized the pattern: 'play' (root) + 'ing' (suffix). This helps the AI understand word relationships like play/playing/played." },
                { tokens: ["p", "l", "a", "y", "i", "n", "g"], correct: false, why: "❌ Too granular - we don't split to individual letters" }
            ]
        },
        {
            word: "Hello World",
            question: "Challenge 2: How does this tokenize?",
            explanation: "Rule: Spaces and whitespace are their own tokens",
            options: [
                { tokens: ["Hello World"], correct: false, why: "❌ Spaces must be tokens! Otherwise you can't distinguish 'Hello World' from 'HelloWorld'" },
                { tokens: ["Hello", " ", "World"], correct: true, why: "✓ Excellent! You caught the space! Spaces are tokens because they're meaningful separators. Token 1='Hello', Token 2=' ', Token 3='World'." },
                { tokens: ["Hel", "lo", "Wor", "ld"], correct: false, why: "❌ Random splits don't follow learned patterns" }
            ]
        },
        {
            word: "I'm",
            question: "Challenge 3: How do contractions split?",
            explanation: "Rule: Contractions split at the apostrophe, keeping it with the suffix",
            options: [
                { tokens: ["I'm"], correct: false, why: "❌ Contractions typically split - 'I am' became 'I'm', so it splits back" },
                { tokens: ["I", "'m"], correct: true, why: "✓ Spot on! Contractions split: 'I' + ''m'. The apostrophe stays with 'm' because that's how the AI learned the pattern from training data." },
                { tokens: ["I", "'", "m"], correct: false, why: "❌ The apostrophe usually groups with the following letter, not as a separate token" }
            ]
        },
        {
            word: "unhappiness",
            question: "Challenge 4: How do prefixes and suffixes combine?",
            explanation: "Rule: Both prefixes (un-, re-) and suffixes (-ness, -ment) can split",
            options: [
                { tokens: ["unhappiness"], correct: false, why: "❌ Too large - both 'un-' (prefix) and '-ness' (suffix) are common patterns that split" },
                { tokens: ["un", "happy", "ness"], correct: true, why: "✓ Perfect understanding! Prefix 'un' + root 'happy' + suffix 'ness'. This is efficient - the AI learns 'happy' once and recognizes unhappy, happiness, happily, etc." },
                { tokens: ["u", "n", "h", "a", "p", "p", "y"], correct: false, why: "❌ Way too granular - letters aren't tokens" }
            ]
        },
        {
            word: "rocks!",
            question: "Challenge 5: What about punctuation?",
            explanation: "Rule: Punctuation marks are separate tokens",
            options: [
                { tokens: ["rocks!"], correct: false, why: "❌ Punctuation splits separately - it has its own meaning!" },
                { tokens: ["rocks", "!"], correct: true, why: "✓ You got it! Punctuation is always separate: 'rocks' + '!'. This lets the AI understand sentence structure, questions (?), and emphasis (!)." },
                { tokens: ["ro", "cks", "!"], correct: false, why: "❌ Don't split the word itself randomly - only the punctuation" }
            ]
        }
    ],
    
    render(container) {
        this.currentChallenge = 0;
        this.score = 0;
        
        container.innerHTML = `
            <div class="phase">
                <!-- Left Sidebar -->
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Tokenization: Pattern Rules</h2>
                        <p class="phase-subtitle">You don't understand words - you split by patterns</p>
                    </div>
                    
                    <div class="phase-description">
                        You're a machine following rules. You split text into tokens based on patterns you learned during training - not because you "understand" language.
                    </div>
                    
                    <div class="hint-section">
                        <h4>Tokenization Rules</h4>
                        <p><strong>1. Common suffixes split:</strong> -ing, -ed, -ness<br>
                        <strong>2. Spaces are tokens</strong><br>
                        <strong>3. Punctuation separates</strong><br>
                        <strong>4. Common prefixes split:</strong> un-, re-</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> You learned these patterns from millions of text examples. You don't "know" what "playing" means - you just pattern-match that "-ing" usually splits.
                        </p>
                    </div>
                </div>
                
                <!-- Right Content Area -->
                <div class="phase-content">
                
                    <div style="width: 100%; max-width: 600px;">
                        <div style="margin-bottom: 24px; text-align: center;">
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
                                <span id="challengeNum">1</span> of ${this.challenges.length}
                            </p>
                            <h3 id="questionText" style="font-size: 16px; color: var(--text-primary); margin-bottom: 12px;"></h3>
                            <p id="explanationText" style="font-size: 13px; color: rgba(0, 245, 255, 0.8); padding: 10px 16px; background: rgba(0, 245, 255, 0.05); border-radius: 8px; border-left: 3px solid var(--primary);"></p>
                        </div>
                        
                        <div style="padding: 32px; background: rgba(0, 245, 255, 0.05); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; margin-bottom: 32px; text-align: center;">
                            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">Text to tokenize:</p>
                            <div id="wordDisplay" style="font-size: 32px; font-weight: 700; color: var(--primary); font-family: 'JetBrains Mono', monospace;"></div>
                        </div>
                        
                        <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                        </div>
                        
                        <div id="feedback" style="margin-top: 20px; padding: 16px; border-radius: 8px; min-height: 60px; display: none;"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.displayChallenge();
    },
    
    displayChallenge() {
        const challenge = this.challenges[this.currentChallenge];
        const wordDisplay = document.getElementById('wordDisplay');
        const questionText = document.getElementById('questionText');
        const challengeNum = document.getElementById('challengeNum');
        const optionsContainer = document.getElementById('optionsContainer');
        const feedback = document.getElementById('feedback');
        
        if (!wordDisplay || !questionText) return;
        
        // Update display
        wordDisplay.textContent = challenge.word;
        questionText.textContent = challenge.question;
        challengeNum.textContent = this.currentChallenge + 1;
        
        // Show the rule/explanation
        const explanationText = document.getElementById('explanationText');
        if (explanationText) {
            explanationText.textContent = challenge.explanation;
        }
        
        feedback.style.display = 'none';
        
        // Render options as buttons
        optionsContainer.innerHTML = challenge.options.map((option, idx) => {
            const tokenDisplay = option.tokens.map(t => 
                t === ' ' ? '␣' : t
            ).join(' | ');
            
            return `
                <button class="token-option" data-idx="${idx}" 
                    style="padding: 16px 20px; background: rgba(15, 23, 42, 0.6); 
                    border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 8px; 
                    cursor: pointer; transition: all 0.2s; text-align: left; font-family: 'JetBrains Mono', monospace;">
                    <span style="font-size: 16px; color: var(--text-primary);">${tokenDisplay}</span>
                </button>
            `;
        }).join('');
        
        // Add click handlers
        optionsContainer.querySelectorAll('.token-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
                this.checkAnswer(idx);
            });
            
            btn.addEventListener('mouseenter', (e) => {
                e.currentTarget.style.background = 'rgba(0, 245, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.5)';
            });
            
            btn.addEventListener('mouseleave', (e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.2)';
            });
        });
    },
    
    checkAnswer(selectedIdx) {
        const challenge = this.challenges[this.currentChallenge];
        const option = challenge.options[selectedIdx];
        const feedback = document.getElementById('feedback');
        const optionsContainer = document.getElementById('optionsContainer');
        
        // Disable all buttons
        optionsContainer.querySelectorAll('.token-option').forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.5';
        });
        
        // Highlight selected
        const selectedBtn = optionsContainer.querySelector(`[data-idx="${selectedIdx}"]`);
        
        if (option.correct) {
            // Correct answer!
            selectedBtn.style.background = 'rgba(34, 197, 94, 0.2)';
            selectedBtn.style.borderColor = 'rgba(34, 197, 94, 0.8)';
            
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '1px solid rgba(34, 197, 94, 0.3)';
            feedback.innerHTML = `
                <div style="text-align: left;">
                    <p style="color: #22c55e; font-weight: 600; margin-bottom: 12px; font-size: 16px;">✓ Correct!</p>
                    <p style="color: var(--text-primary); font-size: 14px; line-height: 1.7;">${option.why}</p>
                </div>
            `;
            
            this.score += 20;
            Game.addScore(20);
            SoundManager.play('success');
            
            // Move to next challenge
            setTimeout(() => {
                this.currentChallenge++;
                if (this.currentChallenge >= this.challenges.length) {
                    this.completePhase();
                } else {
                    this.displayChallenge();
                }
            }, 2000);
            
        } else {
            // Wrong answer
            selectedBtn.style.background = 'rgba(239, 68, 68, 0.2)';
            selectedBtn.style.borderColor = 'rgba(239, 68, 68, 0.8)';
            
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = `
                <div style="text-align: left;">
                    <p style="color: #ef4444; font-weight: 600; margin-bottom: 12px; font-size: 16px;">✗ Try Again</p>
                    <p style="color: var(--text-primary); font-size: 14px; line-height: 1.7;">${option.why}</p>
                </div>
            `;
            
            Game.addScore(-5);
            SoundManager.play('error');
            
            // Re-enable after delay
            setTimeout(() => {
                optionsContainer.querySelectorAll('.token-option').forEach(btn => {
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = '1';
                    btn.style.background = 'rgba(15, 23, 42, 0.6)';
                    btn.style.borderColor = 'rgba(0, 245, 255, 0.2)';
                });
                feedback.style.display = 'none';
            }, 2000);
        }
    },
    
    completePhase() {
        const feedback = document.getElementById('feedback');
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(0, 245, 255, 0.1)';
        feedback.style.border = '1px solid rgba(0, 245, 255, 0.3)';
        feedback.innerHTML = `
            <p style="color: var(--primary); font-weight: 600; font-size: 18px; margin-bottom: 12px;">
                🎉 Phase Complete!
            </p>
            <p style="color: var(--text-secondary); margin-bottom: 16px;">
                You've learned how tokenization works through pattern matching - not understanding!
            </p>
        `;
        
        SoundManager.play('success');
        
        // Safe particle burst (don't let it crash if it fails)
        try {
            if (window.Particles && typeof window.Particles.burst === 'function') {
                Particles.burst();
            }
        } catch (e) {
            console.warn('Particles effect failed:', e);
        }
        
        // Actually complete the phase with proper parameters
        setTimeout(() => {
            Game.completePhase(this.score, "You've mastered tokenization! Tokens split by patterns, not meaning.");
        }, 1500);
    }
};

