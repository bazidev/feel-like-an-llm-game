// Phase 1: Tokenization - V1 DESIGN RESTORED
window.phase1 = {
    // ⚙️ DEVELOPMENT FLAG - Set to true to enable skip button
    DEV_MODE: true,
    
    currentStep: 'concept1', // 'concept1' -> 'concept2' -> 'examples' -> 'yourdata' -> 'info1' -> 'info2' -> 'recap'
    currentExample: 0,
    
    // For interactive tokenization
    userSplits: [],
    validatedTokens: [],
    currentText: '',
    correctTokens: [],
    colorIndex: 0,
    tokenColorMap: {}, // Maps token value to color
    showTutorial: true, // Show tutorial on first visit
    
    tokenColors: [
        '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', 
        '#ec4899', '#14b8a6', '#f97316', '#06b6d4'
    ],
    
    // V1 CHALLENGES (5 total)
    challenges: [
        {
            word: "playing",
            question: "Challenge 1: How should this tokenize?",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Common suffixes like -ing, -ed, -ness typically split into separate tokens",
            options: [
                { tokens: ["playing"], correct: false, why: "❌ Too large - common suffixes like '-ing' split separately" },
                { tokens: ["play", "ing"], correct: true, why: "✓ Perfect! You recognized the pattern: 'play' (root) + 'ing' (suffix). This helps the AI understand word relationships like play/playing/played." },
                { tokens: ["p", "l", "a", "y", "i", "n", "g"], correct: false, why: "❌ Too granular - we don't split to individual letters" }
            ]
        },
        {
            word: "Hello World",
            question: "Challenge 2: How does this tokenize?",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Spaces and whitespace are their own tokens",
            options: [
                { tokens: ["Hello World"], correct: false, why: "❌ Spaces must be tokens! Otherwise you can't distinguish 'Hello World' from 'HelloWorld'" },
                { tokens: ["Hello", " ", "World"], correct: true, why: "✓ Excellent! You caught the space! Spaces are tokens because they're meaningful separators. Token 1='Hello', Token 2=' ', Token 3='World'." },
                { tokens: ["Hel", "lo", "Wor", "ld"], correct: false, why: "❌ Random splits don't follow learned patterns" }
            ]
        },
        {
            word: "I'm",
            question: "Challenge 3: How do contractions split?",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Contractions split at the apostrophe, keeping it with the suffix",
            options: [
                { tokens: ["I'm"], correct: false, why: "❌ Contractions typically split - 'I am' became 'I'm', so it splits back" },
                { tokens: ["I", "'m"], correct: true, why: "✓ Spot on! Contractions split: 'I' + ''m'. The apostrophe stays with 'm' because that's how the AI learned the pattern from training data." },
                { tokens: ["I", "'", "m"], correct: false, why: "❌ The apostrophe usually groups with the following letter, not as a separate token" }
            ]
        },
        {
            word: "unhappiness",
            question: "Challenge 4: How do prefixes and suffixes combine?",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Both prefixes (un-, re-) and suffixes (-ness, -ment) can split",
            options: [
                { tokens: ["unhappiness"], correct: false, why: "❌ Too large - both 'un-' (prefix) and '-ness' (suffix) are common patterns that split" },
                { tokens: ["un", "happy", "ness"], correct: true, why: "✓ Perfect understanding! Prefix 'un' + root 'happy' + suffix 'ness'. This is efficient - the AI learns 'happy' once and recognizes unhappy, happiness, happily, etc." },
                { tokens: ["u", "n", "h", "a", "p", "p", "y"], correct: false, why: "❌ Way too granular - letters aren't tokens" }
            ]
        },
        {
            word: "rocks!",
            question: "Challenge 5: What about punctuation?",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Punctuation marks are separate tokens",
            options: [
                { tokens: ["rocks!"], correct: false, why: "❌ Punctuation splits separately - it has its own meaning!" },
                { tokens: ["rocks", "!"], correct: true, why: "✓ You got it! Punctuation is always separate: 'rocks' + '!'. This lets the AI understand sentence structure, questions (?), and emphasis (!)." },
                { tokens: ["ro", "cks", "!"], correct: false, why: "❌ Don't split the word itself randomly - only the punctuation" }
            ]
        }
    ],
    
    render(container) {
        if (this.currentStep === 'concept1') {
            this.renderConcept1(container);
        } else if (this.currentStep === 'concept2') {
            this.renderConcept2(container);
        } else if (this.currentStep === 'examples') {
            this.renderExamples(container);
        } else if (this.currentStep === 'yourdata') {
            this.renderYourData(container);
        } else if (this.currentStep === 'info1') {
            this.renderInfoStep1(container);
        } else if (this.currentStep === 'info2') {
            this.renderInfoStep2(container);
        } else if (this.currentStep === 'recap') {
            this.renderRecap(container);
        }
    },
    
    // CONCEPT PAGES (same as before)
    renderConcept1(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ✂️ Tokenization
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        Break text into tokens - the atoms of AI understanding
                    </p>
                    
                    <!-- Why LLMs tokenize -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🤖</span>
                            <h2 style="font-size: 18px; color: var(--primary); margin: 0;">Why do LLMs tokenize?</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">Computers don't understand words.</strong> 
                                They only understand numbers. Tokenization is the bridge between human text and machine math.
                            </p>
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">Breaking text into pieces helps AI learn patterns.</strong>
                                Instead of memorizing every possible word, LLMs learn from common word parts (tokens).
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: var(--primary);">Tokens can be words, parts of words, or even single characters.</strong>
                                This flexibility helps handle rare words, typos, and multiple languages.
                            </p>
                        </div>
                    </div>
                    
                    <!-- How we simplified it -->
                    <div style="background: linear-gradient(135deg, rgba(191, 0, 255, 0.1), rgba(139, 92, 246, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🎮</span>
                            <h2 style="font-size: 18px; color: var(--secondary); margin: 0;">How we simplified it for this game</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                Real LLMs use complex algorithms like <strong style="color: var(--secondary);">BPE (Byte-Pair Encoding)</strong> 
                                that learn from massive datasets. They don't follow fixed rules.
                            </p>
                            <p style="margin: 0;">
                                For this game, we'll use <strong style="color: var(--secondary);">simple rules</strong> 
                                (split suffixes, spaces, punctuation) so you can understand the core concept without the complexity.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phase1.nextStep()" 
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Next →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    renderConcept2(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 1000px; width: 100%;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ✂️ Tokenization
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        Break text into tokens - the atoms of AI understanding
                    </p>
                    
                    <!-- Rules Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 14px; padding: 18px; margin-bottom: 16px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">📋</span>
                            <h3 style="font-size: 17px; color: var(--primary); margin: 0;">Tokenization rules (for this game)</h3>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">1. Split suffixes</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">-ing, -ed, -ness separate</div>
                            </div>
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">2. Spaces are separate</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Each space is a token</div>
                            </div>
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">3. Punctuation splits</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">. , ! ? are separate tokens</div>
                            </div>
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">4. Contractions split</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">I'm → I + 'm</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Reality Check -->
                    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 18px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">⚡</span>
                            <h3 style="font-size: 15px; color: #ef4444; margin: 0;">Reality check: How real LLMs actually tokenize</h3>
                        </div>
                        <div style="font-size: 12px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 8px;">
                                <strong style="color: #ef4444;">NO FIXED RULES!</strong> Real LLMs like GPT use <strong>BPE (Byte-Pair Encoding)</strong> which learns tokenization from data patterns:
                            </p>
                            <ul style="margin: 0; padding-left: 20px; list-style: none;">
                                <li style="margin-bottom: 5px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Spaces are included with words:</strong> "cat" becomes " cat" (space attached!)
                                </li>
                                <li style="margin-bottom: 5px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">100% data-driven:</strong> If "playing" appears often, it stays whole. If "play" + "ing" is more common in training, it splits!
                                </li>
                                <li style="margin-bottom: 5px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">No suffix rules:</strong> "walked" might be ["walk", "ed"] OR ["walked"] depending on training frequency
                                </li>
                                <li style="margin: 0; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Subword units:</strong> Rare words split into pieces: "tokenization" → ["token", "ization"]
                                </li>
                            </ul>
                            <p style="margin-top: 10px; font-style: italic; color: rgba(239, 68, 68, 0.8); font-size: 11px;">
                                For this game, we use simple rules to teach the concept. Real LLMs are smarter! 🧠
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phase1.nextStep()" 
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Let's practice! →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    // EXAMPLES - V1 DESIGN EXACT REPLICA
    renderExamples(container) {
        const challenge = this.challenges[this.currentExample];
        if (!challenge) {
            this.currentStep = 'yourdata';
            this.render(container);
            return;
        }
        
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
                
                    <div style="width: 100%; max-width: 650px;">
                        <div style="margin-bottom: 16px; text-align: center;">
                            <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
                                ${this.currentExample + 1} of ${this.challenges.length}
                            </p>
                            <h3 style="font-size: 15px; color: var(--text-primary); margin-bottom: 10px;">${challenge.question}</h3>
                            <div style="font-size: 12px; color: rgba(0, 245, 255, 0.9); padding: 10px 16px; 
                                        background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 245, 255, 0.05)); 
                                        border: 2px solid rgba(0, 245, 255, 0.3); border-radius: 10px; 
                                        box-shadow: 0 0 20px rgba(0, 245, 255, 0.1); text-align: left;">
                                ${challenge.explanation}
                            </div>
                        </div>
                        
                        <div style="padding: 24px; background: rgba(0, 245, 255, 0.05); border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 12px; margin-bottom: 20px; text-align: center;">
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px;">Text to tokenize:</p>
                            <div style="font-size: 28px; font-weight: 700; color: var(--primary); font-family: 'JetBrains Mono', monospace;">${challenge.word}</div>
                        </div>
                        
                        <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
                            ${challenge.options.map((option, idx) => {
                                const tokenDisplay = option.tokens.map(t => t === ' ' ? '␣' : t).join(' | ');
                                return `
                                    <button class="token-option" onclick="phase1.checkAnswer(${idx})" 
                                        style="padding: 12px 16px; background: rgba(15, 23, 42, 0.6); 
                                        border: 1px solid rgba(0, 245, 255, 0.2); border-radius: 8px; 
                                        cursor: pointer; transition: all 0.2s; text-align: left; font-family: 'JetBrains Mono', monospace;">
                                        <span style="font-size: 14px; color: var(--text-primary);">${tokenDisplay}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        
                        <div id="feedback" style="margin-top: 12px; padding: 12px; border-radius: 8px; min-height: 50px; display: none;"></div>
                    </div>
                </div>
            </div>
        `;
    },
    
    checkAnswer(selectedIdx) {
        const challenge = this.challenges[this.currentExample];
        const option = challenge.options[selectedIdx];
        const feedback = document.getElementById('feedback');
        const optionsContainer = document.getElementById('optionsContainer');
        
        // Disable all buttons
        optionsContainer.querySelectorAll('.token-option').forEach(btn => {
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.5';
        });
        
        // Highlight selected
        const selectedBtn = optionsContainer.querySelectorAll('.token-option')[selectedIdx];
        
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
            
            Game.addScore(20);
            SoundManager.play('success');
            
            // Move to next challenge
            setTimeout(() => {
                this.currentExample++;
                const container = document.getElementById('phaseContainer');
                this.render(container);
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
    
    // INTERACTIVE TOKENIZATION (V1 STYLE)
    renderYourData(container) {
        // Initialize if first time
        if (!this.currentText) {
            this.currentText = Game.state.trainingText;
            this.correctTokens = this.calculateCorrectTokens(Game.state.trainingText);
            this.validatedTokens = [];
            this.userSplits = [];
            this.tokenColorMap = {}; // Reset color map
            this.showTutorial = true; // Show tutorial on first visit to this step
        }
        
        const targetCount = this.correctTokens.length;
        const currentCount = this.validatedTokens.length;
        
        // Check if all tokens are completed
        if (currentCount >= targetCount && this.currentText.trim().length === 0) {
            this.finishTokenization();
            return;
        }
        
        container.innerHTML = `
            <div class="phase">
                <!-- Left Sidebar -->
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Tokenize your data</h2>
                        <p class="phase-subtitle">Apply rules to your training text</p>
                    </div>
                    
                    <div class="phase-description">
                        Now tokenize your actual training data. Click between characters to add split marks (|).
                    </div>
                    
                    <div class="hint-section" style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(251, 191, 36, 0.05)); padding: 12px;">
                        <h4 style="color: #fbbf24; font-size: 12px; margin-bottom: 8px;">💡 Target</h4>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 11px; margin: 0;">You need approximately <strong style="color: #fbbf24;">${targetCount} tokens</strong> based on the rules.</p>
                    </div>
                    
                    <div style="margin-top: 16px;">
                        <h4 style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px;">✅ Validated tokens:</h4>
                        <div id="tokenProgressBar" style="display: flex; flex-wrap: wrap; gap: 5px; padding: 10px; 
                                                          background: rgba(0, 0, 0, 0.3); border-radius: 8px; max-height: 180px; overflow-y: auto;
                                                          align-items: center; align-content: flex-start; min-height: 60px;">
                            ${this.validatedTokens.length === 0 ? '<div style="color: rgba(255, 255, 255, 0.3); font-size: 11px;">No tokens yet...</div>' : 
                              this.validatedTokens.map(t => {
                                const color = this.getTokenColor(t);
                                return `<span style="background: ${color}80; padding: 3px 8px; border-radius: 5px; 
                                               font-size: 10px; font-weight: 600; color: white; border: 1px solid ${color}cc;">${t === ' ' ? '␣' : t}</span>`;
                              }).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Right Content Area -->
                <div class="phase-content">
                    <div style="width: 100%; max-width: 900px;">
                        
                        <div id="feedbackMessage" style="min-height: 35px; margin-bottom: 12px; text-align: center; font-size: 13px;"></div>
                        
                        ${this.showTutorial ? `
                            <div id="tutorialHint" style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(251, 191, 36, 0.1)); 
                                                         border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 10px; padding: 12px 16px; 
                                                         margin-bottom: 14px; animation: pulse 2s ease-in-out infinite;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <span style="font-size: 20px;">👆</span>
                                    <h4 style="color: #fbbf24; font-size: 14px; margin: 0; font-weight: 700;">How to tokenize:</h4>
                                </div>
                                <ol style="margin: 0; padding-left: 22px; color: rgba(255, 255, 255, 0.9); font-size: 12px; line-height: 1.6;">
                                    <li style="margin-bottom: 5px;"><strong style="color: #fbbf24;">Hover</strong> between characters to see the <span style="color: var(--primary);">blue indicator</span></li>
                                    <li style="margin-bottom: 5px;"><strong style="color: #fbbf24;">Click</strong> the indicator where you want to end the token</li>
                                    <li style="margin-bottom: 5px;"><strong style="color: #fbbf24;">Spaces</strong> are highlighted in yellow - they're separate tokens!</li>
                                    <li style="margin: 0;">Start with the first token: "<strong style="color: var(--primary);">A</strong>"</li>
                                </ol>
                                <button onclick="phase1.dismissTutorial()" 
                                        style="margin-top: 10px; padding: 6px 16px; background: rgba(251, 191, 36, 0.2); 
                                               border: 1px solid rgba(251, 191, 36, 0.5); border-radius: 8px; 
                                               color: #fbbf24; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                                    Got it! ✓
                                </button>
                            </div>
                        ` : ''}
                        
                        <div id="interactiveText" style="font-size: 18px; line-height: 1.8; font-weight: 500; 
                                                       color: white; text-align: left; font-family: 'JetBrains Mono', monospace; 
                                                       padding: 20px; background: rgba(0, 245, 255, 0.05); border-radius: 10px; 
                                                       border: 1px solid rgba(0, 245, 255, 0.2); margin-bottom: 14px; min-height: 160px;">
                            ${this.makeClickableText(this.currentText)}
                        </div>
                        
                        <!-- Stats -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 0;">
                            <div style="text-align: center; padding: 16px; background: rgba(0, 245, 255, 0.05); border-radius: 10px; border: 1px solid rgba(0, 245, 255, 0.2);">
                                <div id="yourTokensCount" style="font-size: 32px; font-weight: 700; color: var(--primary);">${currentCount}</div>
                                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Your Tokens</div>
                            </div>
                            <div style="text-align: center; padding: 16px; background: rgba(191, 0, 255, 0.05); border-radius: 10px; border: 1px solid rgba(191, 0, 255, 0.2);">
                                <div style="font-size: 32px; font-weight: 700; color: var(--secondary);">${targetCount}</div>
                                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Target Tokens</div>
                            </div>
                        </div>
                        
                        ${this.DEV_MODE ? `
                            <button onclick="phase1.devSkipTokenization()" 
                                    style="width: 100%; padding: 12px; margin-top: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); 
                                           border: 2px solid #fbbf24; border-radius: 10px; color: white; font-size: 13px; font-weight: 700; 
                                           cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">
                                ⚡ DEV: Skip Tokenization
                            </button>
                        ` : ''}
                        
                    </div>
                </div>
            </div>
        `;
    },
    
    makeClickableText(text) {
        if (!text || text.trim().length === 0) {
            return '<div style="color: rgba(255, 255, 255, 0.3); text-align: center; font-size: 14px;">All text tokenized! 🎉</div>';
        }
        
        let html = '';
        const startIdx = this.userSplits.length > 0 ? this.userSplits[0] : 0;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const idx = i;
            
            // Add the character itself with highlight if in selection
            const isInSelection = this.userSplits.length > 0 && idx >= startIdx;
            const isSpace = char === ' ';
            const spaceHighlight = this.showTutorial && isSpace ? 'background: rgba(255, 193, 7, 0.3); border: 2px dashed #fbbf24; border-radius: 4px; padding: 2px;' : '';
            html += `<span class="token-char" style="display: inline; ${isInSelection ? 'background: rgba(0, 245, 255, 0.15); border-radius: 3px;' : ''} ${spaceHighlight}">${char === ' ' ? '&nbsp;' : char}</span>`;
            
            // Add clickable boundary AFTER this character (end boundary)
            const boundaryIdx = idx + 1;
            const isActive = this.userSplits.includes(boundaryIdx);
            html += `<span class="token-boundary" onclick="phase1.selectEndBoundary(${boundaryIdx})" 
                           style="display: inline-block; width: ${isActive ? '12px' : '4px'}; height: 24px; cursor: pointer; 
                                  background: ${isActive ? 'rgba(0, 245, 255, 0.5)' : 'transparent'}; 
                                  border-left: ${isActive ? '3px solid var(--primary)' : '1px dashed rgba(0, 245, 255, 0.2)'}; 
                                  margin: 0 1px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative; top: 2px; vertical-align: middle;
                                  box-shadow: ${isActive ? '0 0 15px rgba(0, 245, 255, 0.6)' : 'none'};"
                           onmouseover="this.style.background='rgba(0, 245, 255, 0.6)'; this.style.borderLeft='4px solid var(--primary)'; this.style.width='16px'; this.style.cursor='pointer'; this.style.boxShadow='0 0 20px rgba(0, 245, 255, 0.8)'; this.style.transform='scaleY(1.2)';" 
                           onmouseout="this.style.background='${isActive ? 'rgba(0, 245, 255, 0.5)' : 'transparent'}'; 
                                      this.style.borderLeft='${isActive ? '3px solid var(--primary)' : '1px dashed rgba(0, 245, 255, 0.2)'}';
                                      this.style.width='${isActive ? '12px' : '4px'}'; 
                                      this.style.boxShadow='${isActive ? '0 0 15px rgba(0, 245, 255, 0.6)' : 'none'}'; this.style.transform='scaleY(1)'"></span>`;
        }
        
        return html;
    },
    
    dismissTutorial() {
        this.showTutorial = false;
        const tutorial = document.getElementById('tutorialHint');
        if (tutorial) {
            tutorial.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                tutorial.style.display = 'none';
            }, 300);
        }
    },
    
    selectEndBoundary(idx) {
        SoundManager.play('click');
        
        // Dismiss tutorial on first interaction
        if (this.showTutorial) {
            this.dismissTutorial();
        }
        
        // Start is always 0, user selects the end
        const start = 0;
        const end = idx;
        
        if (end <= start) return;
        
        const userToken = this.currentText.substring(start, end);
        const nextExpectedToken = this.correctTokens[this.validatedTokens.length];
        const isCorrect = userToken === nextExpectedToken;
        
        const feedback = document.getElementById('feedbackMessage');
        
        if (isCorrect) {
            // Success!
            SoundManager.play('success');
            Game.addScore(10);
            
            this.validatedTokens.push(userToken);
            
            feedback.innerHTML = `<div style="color: #22c55e; font-weight: 600; padding: 8px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; display: inline-block;">✓ Correct! "${userToken === ' ' ? '␣' : userToken}" +10 points</div>`;
            
            // Remove the validated part from text and reset splits
            this.currentText = this.currentText.substring(end);
            this.userSplits = [];
            
            // Update only the necessary parts without full re-render
            setTimeout(() => {
                const textContainer = document.getElementById('interactiveText');
                const progressBar = document.getElementById('tokenProgressBar');
                const yourTokensCount = document.getElementById('yourTokensCount');
                
                if (textContainer) {
                    textContainer.innerHTML = this.makeClickableText(this.currentText);
                }
                if (progressBar) {
                    progressBar.innerHTML = this.validatedTokens.map(t => {
                        const color = this.getTokenColor(t);
                        return `<span style="background: ${color}80; padding: 3px 8px; border-radius: 5px; 
                                       font-size: 10px; font-weight: 600; color: white; border: 1px solid ${color}cc;">${t === ' ' ? '␣' : t}</span>`;
                    }).join('');
                }
                if (yourTokensCount) {
                    yourTokensCount.textContent = this.validatedTokens.length;
                }
                feedback.innerHTML = '';
                
                // Check if completed
                if (this.validatedTokens.length >= this.correctTokens.length) {
                    setTimeout(() => {
                        this.finishTokenization();
                    }, 800);
                }
            }, 500);
            
        } else {
            // Error!
            SoundManager.play('error');
            Game.addScore(-5);
            
            feedback.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 8px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; display: inline-block;">✗ Expected "${nextExpectedToken === ' ' ? '␣' : nextExpectedToken}" but got "${userToken === ' ' ? '␣' : userToken}". Try again! -5 points</div>`;
            
            // Just update the text display with error highlight
            const textContainer = document.getElementById('interactiveText');
            if (textContainer) {
                const beforeText = '';
                const highlightedText = this.currentText.substring(start, end);
                const afterText = this.currentText.substring(end);
                
                textContainer.innerHTML = `
                    ${beforeText}
                    <span style="background: rgba(239, 68, 68, 0.3); color: #ef4444; padding: 2px 4px; border-radius: 4px; border: 2px solid #ef4444;">${highlightedText === ' ' ? '␣' : highlightedText}</span>
                    ${afterText}
                `;
            }
            
            // Clear after 2 seconds
            setTimeout(() => {
                this.userSplits = [];
                feedback.innerHTML = '';
                const container = document.getElementById('interactiveText');
                if (container) {
                    container.innerHTML = this.makeClickableText(this.currentText);
                }
            }, 2000);
        }
    },
    
    getTokenColor(token) {
        // Return same color for same token value
        if (!this.tokenColorMap[token]) {
            const colorIndex = Object.keys(this.tokenColorMap).length % this.tokenColors.length;
            this.tokenColorMap[token] = this.tokenColors[colorIndex];
        }
        return this.tokenColorMap[token];
    },
    
    
    devSkipTokenization() {
        // DEV ONLY: Auto-complete tokenization
        if (!this.DEV_MODE) return;
        
        // Set all correct tokens as validated
        this.validatedTokens = [...this.correctTokens];
        this.currentText = '';
        
        // Finish immediately
        this.finishTokenization();
    },
    
    finishTokenization() {
        Game.state.tokens = this.validatedTokens;
        Game.saveState();
        this.currentStep = 'info1';
        const phaseContainer = document.getElementById('phaseContainer');
        this.render(phaseContainer);
        SoundManager.play('levelUp');
    },
    
    calculateCorrectTokens(text) {
        const tokens = [];
        let i = 0;
        
        while (i < text.length) {
            const char = text[i];
            
            // Handle spaces - tokenize them
            if (char === ' ') {
                tokens.push(' ');
                i++;
                continue;
            }
            
            // Handle punctuation
            if ('.!?,'.includes(char)) {
                tokens.push(char);
                i++;
                continue;
            }
            
            // Handle words
            let word = '';
            while (i < text.length && text[i] !== ' ' && !'.!?,'.includes(text[i])) {
                word += text[i];
                i++;
            }
            
            if (word) {
                // Check for contractions
                if (word.includes("'")) {
                    const parts = word.split("'");
                    tokens.push(parts[0]);
                    tokens.push("'" + parts[1]);
            } else {
                // Check for suffixes
                    const suffixes = ['ing', 'ed', 'ness'];
                    let foundSuffix = false;
                    for (const suffix of suffixes) {
                        if (word.endsWith(suffix) && word.length > suffix.length) {
                            tokens.push(word.substring(0, word.length - suffix.length));
                            tokens.push(suffix);
                            foundSuffix = true;
                            break;
                        }
                    }
                    if (!foundSuffix) {
                        tokens.push(word);
                    }
                }
            }
        }
        
        return tokens;
    },
    
    // INFO & RECAP (keeping them simple)
    renderInfoStep1(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 900px; width: 100%; text-align: center;">
                    
                    <h2 style="font-size: 26px; margin-bottom: 14px; color: var(--primary);">
                        🔢 Token IDs
                    </h2>
                    <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 24px;">
                        Each token gets converted to a unique number (ID)
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); 
                               border-radius: 14px; padding: 20px; margin-bottom: 20px; text-align: left;">
                        <div style="font-size: 13px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 14px;">
                                Computers can't work with text directly. Each token is assigned a unique numerical ID from a <strong style="color: var(--primary);">vocabulary</strong>:
                            </p>
                            
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: 10px; font-family: monospace; font-size: 12px; max-height: 240px; overflow-y: auto;">
                                ${Game.state.tokens.slice(0, 10).map((token, idx) => 
                                    `<div style="margin-bottom: 5px;"><span style="color: var(--primary);">"${token}"</span> → <span style="color: #22c55e;">ID: ${idx + 1}</span></div>`
                                ).join('')}
                                ${Game.state.tokens.length > 10 ? '<div style="color: var(--text-secondary); font-style: italic; margin-top: 5px;">...and more</div>' : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05)); 
                               border: 2px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">🧠</span>
                            <h3 style="font-size: 15px; color: #a855f7; margin: 0; font-weight: 700;">Real LLM Concept: Vocabulary Size</h3>
                        </div>
                        <div style="font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 8px;">
                                <strong style="color: #a855f7;">GPT-3:</strong> 50,257 tokens | <strong style="color: #a855f7;">GPT-4:</strong> 100,000 tokens
                            </p>
                            <p style="margin: 0;">
                                Larger vocabulary = more efficient encoding, but each token adds <strong style="color: #a855f7;">parameters</strong> to the model (more memory & compute needed).
                            </p>
                        </div>
                    </div>
                    
                    <button onclick="phase1.nextStep()" 
                            style="padding: 14px 42px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 600; 
                                   cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                        Next →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    renderInfoStep2(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 900px; width: 100%; text-align: center;">
                    
                    <h2 style="font-size: 26px; margin-bottom: 14px; color: var(--primary);">
                        📍 Positional Encoding
                    </h2>
                    <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 24px;">
                        Token order matters! We add position information to each token.
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); 
                               border-radius: 14px; padding: 20px; margin-bottom: 20px; text-align: left;">
                        <div style="font-size: 13px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 14px;">
                                "The cat" and "cat The" are different! Position encoding tells the model where each token appears in the sequence:
                            </p>
                            
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: 10px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto;">
                                ${Game.state.tokens.slice(0, 8).map((token, idx) => 
                                    `<div style="margin-bottom: 5px;">
                                        <span style="color: var(--primary);">"${token}"</span> 
                                        <span style="color: var(--text-secondary);">at position</span> 
                                        <span style="color: #f59e0b;">${idx + 1}</span>
                                    </div>`
                                ).join('')}
                                ${Game.state.tokens.length > 8 ? '<div style="color: var(--text-secondary); font-style: italic; margin-top: 5px;">...and more</div>' : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05)); 
                               border: 2px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">🧠</span>
                            <h3 style="font-size: 15px; color: #a855f7; margin: 0; font-weight: 700;">Real LLM Concept: Context Window</h3>
                        </div>
                        <div style="font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 8px;">
                                LLMs have a <strong style="color: #a855f7;">maximum context window</strong> - a limit on how many tokens they can process at once:
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: #a855f7;">GPT-3.5:</strong> 4,096 tokens | <strong style="color: #a855f7;">GPT-4:</strong> 8,192-32,768 tokens | <strong style="color: #a855f7;">Claude:</strong> 100,000+ tokens
                            </p>
                        </div>
                    </div>
                    
                    <button onclick="phase1.nextStep()" 
                            style="padding: 14px 42px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 600; 
                                   cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                        Next →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    renderRecap(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 1000px; width: 100%;">
                    
                    <h2 style="font-size: 28px; margin-bottom: 14px; text-align: center; color: var(--primary);">
                        ✅ Tokenization Complete!
                    </h2>
                    <p style="font-size: 14px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        You successfully broke down your training text into ${Game.state.tokens.length} tokens
                    </p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                        
                        <!-- Your Tokens -->
                    <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); 
                                   border-radius: 12px; padding: 20px;">
                            <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">Your tokens:</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 6px; max-height: 180px; overflow-y: auto; padding: 12px; 
                                       background: rgba(0, 0, 0, 0.3); border-radius: 10px;">
                                ${Game.state.tokens.map(token => {
                                    const color = this.getTokenColor(token);
                                    return `<span style="background: ${color}80; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; border: 1px solid ${color}cc;">${token === ' ' ? '␣' : token}</span>`;
                                }).join('')}
                        </div>
                    </div>
                    
                        <!-- What you learned + What's next -->
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="background: rgba(34, 197, 94, 0.1); border: 2px solid rgba(34, 197, 94, 0.3); 
                                       border-radius: 12px; padding: 16px;">
                                <h3 style="font-size: 16px; color: #22c55e; margin-bottom: 10px;">What you learned:</h3>
                                <div style="font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                                    <p style="margin-bottom: 6px;">✓ Tokenization converts text into processable pieces</p>
                                    <p style="margin-bottom: 6px;">✓ Each token gets a unique numerical ID</p>
                                    <p style="margin-bottom: 6px;">✓ Position information is added to maintain order</p>
                            <p style="margin: 0;">✓ This is the foundation for all LLM processing!</p>
                        </div>
                    </div>
                    
                    <div style="background: rgba(139, 92, 246, 0.1); border: 2px solid rgba(139, 92, 246, 0.3); 
                                       border-radius: 12px; padding: 16px;">
                                <h3 style="font-size: 16px; color: #8b5cf6; margin-bottom: 10px;">What's next:</h3>
                                <div style="font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin: 0;">
                                Now that we have tokens, we'll convert them into <strong style="color: #8b5cf6;">embeddings</strong> 
                                - mathematical vectors that capture meaning and relationships!
                            </p>
                                </div>
                        </div>
                        </div>
                        
                    </div>
                    
                    <div style="text-align: center;">
                        <button id="continueToEmbeddingsBtn"
                                style="padding: 14px 42px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Continue to embeddings →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Add event listener after rendering
        setTimeout(() => {
            const btn = document.getElementById('continueToEmbeddingsBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    // Mark phase 1 as complete before advancing
                    if (!Game.state.phaseCompleted[1]) {
                        Game.state.phaseCompleted[1] = true;
                        Game.addScore(100); // Bonus for completing tokenization
                        Game.saveState();
                    }
                    Game.nextPhase();
                });
            }
        }, 0);
    },
    
    nextStep() {
        const steps = ['concept1', 'concept2', 'examples', 'yourdata', 'info1', 'info2', 'recap'];
        const currentIndex = steps.indexOf(this.currentStep);
        if (currentIndex < steps.length - 1) {
            this.currentStep = steps[currentIndex + 1];
            const container = document.getElementById('phaseContainer');
            this.render(container);
        }
    }
};

