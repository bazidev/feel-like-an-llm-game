// Phase 1: Tokenization - V1 DESIGN RESTORED
window.phase1 = {
    currentStep: 'concept1', // 'concept1' -> 'concept2' -> 'examples' -> 'yourdata' -> 'info1' -> 'info2' -> 'recap'
    currentExample: 0,
    challengesShuffled: false, // Track if challenges have been shuffled
    
    // For interactive tokenization
    userSplits: [],
    validatedTokens: [],
    currentText: '',
    correctTokens: [],
    colorIndex: 0,
    tokenColorMap: {}, // Maps token value to color
    showTutorial: false, // Will show after auto-demo
    
    // Auto-demo tracking
    autoDemoInProgress: false,
    autoDemoComplete: false,
    userClickedStart: false, // Track if user manually started
    
    // Selection tracking
    selectionStart: null,
    selectionEnd: null,
    isSelecting: false,
    
    // Performance tracking
    correctAnswers: 0,
    wrongAnswers: 0,
    
    tokenColors: [
        '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', 
        '#ec4899', '#14b8a6', '#f97316', '#06b6d4'
    ],
    
    // Shuffle challenge options to randomize answer positions
    shuffleChallenges() {
        this.challenges.forEach(challenge => {
            // Fisher-Yates shuffle
            for (let i = challenge.options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [challenge.options[i], challenge.options[j]] = [challenge.options[j], challenge.options[i]];
            }
        });
    },
    
    // V1 CHALLENGES (5 total)
    challenges: [
        {
            word: "playing",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Common suffixes like -ing, -ed, -ness typically split into separate tokens",
            options: [
                { tokens: ["playing"], correct: false, why: "❌ Too large - common suffixes like '-ing' split separately" },
                { tokens: ["play", "ing"], correct: true, why: "✓ Perfect! You recognized the pattern: 'play' (root) + 'ing' (suffix). This helps the AI understand word relationships like play/playing/played." },
                { tokens: ["p", "l", "a", "y", "i", "n", "g"], correct: false, why: "❌ Too granular - we don't split to individual letters" }
            ]
        },
        {
            word: "Hello World",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Spaces attach to the word that follows them (most common pattern in training data)",
            options: [
                { tokens: ["Hello World"], correct: false, why: "❌ Must split into tokens! 'Hello World' is two separate concepts." },
                { tokens: ["Hello", "␣World"], correct: true, why: "✓ Perfect! The space attaches to 'World' because ' World' (with space) appears more frequently in training data than 'World' alone. Token 1='Hello', Token 2='␣World'." },
                { tokens: ["Hel", "lo", "Wor", "ld"], correct: false, why: "❌ Random splits don't follow learned patterns from training data" }
            ]
        },
        {
            word: "I'm",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Contractions split at the apostrophe, keeping it with the suffix",
            options: [
                { tokens: ["I'm"], correct: false, why: "❌ Contractions typically split - 'I am' became 'I'm', so it splits back" },
                { tokens: ["I", "'m"], correct: true, why: "✓ Spot on! Contractions split: 'I' + ''m'. The apostrophe stays with 'm' because that's how the AI learned the pattern from training data." },
                { tokens: ["I", "'", "m"], correct: false, why: "❌ The apostrophe usually groups with the following letter, not as a separate token" }
            ]
        },
        {
            word: "unhappiness",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Both prefixes (un-, re-) and suffixes (-ness, -ment) can split",
            options: [
                { tokens: ["unhappiness"], correct: false, why: "❌ Too large - both 'un-' (prefix) and '-ness' (suffix) are common patterns that split" },
                { tokens: ["un", "happy", "ness"], correct: true, why: "✓ Perfect understanding! Prefix 'un' + root 'happy' + suffix 'ness'. This is efficient - the AI learns 'happy' once and recognizes unhappy, happiness, happily, etc." },
                { tokens: ["u", "n", "h", "a", "p", "p", "y"], correct: false, why: "❌ Way too granular - letters aren't tokens" }
            ]
        },
        {
            word: "rocks!",
            explanation: "<strong style='color: var(--primary);'>Rule:</strong> Punctuation marks are separate tokens",
            options: [
                { tokens: ["rocks!"], correct: false, why: "❌ Punctuation splits separately - it has its own meaning!" },
                { tokens: ["rocks", "!"], correct: true, why: "✓ You got it! Punctuation is always separate: 'rocks' + '!'. This lets the AI understand sentence structure, questions (?), and emphasis (!)." },
                { tokens: ["ro", "cks", "!"], correct: false, why: "❌ Don't split the word itself randomly - only the punctuation" }
            ]
        }
    ],
    
    render(container) {
        // Award +50 points for completing Phase 0 setup when Phase 1 first loads
        // Only award once when Phase 1 renders for the first time
        if (Game.state.phaseCompleted[0] && !Game.state.pointsAwarded['phase1_setup']) {
            Game.addScore(50); // Setup completion bonus
            Game.state.pointsAwarded['phase1_setup'] = true;
            Game.saveState();
        }
        
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
        } else if (this.currentStep === 'journey_checkpoint') {
            this.renderJourneyCheckpoint(container);
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
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">2. Spaces attach to words</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Space goes with next word: "Hello World" → ["Hello", "␣World"]</div>
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
        // Shuffle challenges once when first entering examples
        if (this.currentExample === 0 && !this.challengesShuffled) {
            this.shuffleChallenges();
            this.challengesShuffled = true;
        }
        
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
                        <h4>📋 Tokenization Rules</h4>
                        <p><strong>1. Common suffixes split:</strong> -ing, -ed, -ness<br>
                        <strong>2. Spaces attach to following word</strong><br>
                        <strong>3. Punctuation separates</strong><br>
                        <strong>4. Common prefixes split:</strong> un-, re-</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>⚡ Reality Check:</strong> The LLM learns these patterns from millions of text examples. It doesn't "know" what "playing" means - it just pattern-match that "-ing" usually splits.
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
            
            Game.addScore(25); // Examples: +25 per correct (no penalties!)
            SoundManager.play('correct'); // Use 'correct' for quick quiz answers
            
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
            
            // NO PENALTY in examples/challenges (learning phase!)
            SoundManager.play('wrong'); // Use 'wrong' for quiz mistakes
            
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
            this.showTutorial = false; // Don't show tutorial until after auto-demo completes
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
                            Watch as the system tokenizes ~90% of your data automatically, then you'll complete the rest!
                    </div>
                    
                    <div class="hint-section" style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(251, 191, 36, 0.05)); padding: 12px;">
                        <h4 style="color: #fbbf24; font-size: 12px; margin-bottom: 8px;">💡 Target</h4>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 11px; margin: 0;">You need approximately <strong style="color: #fbbf24;">${targetCount} tokens</strong> based on the rules.</p>
                    </div>
                    
                    <div style="margin-top: 16px; flex: 1; display: flex; flex-direction: column; min-height: 0;">
                        <h4 style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px;">✅ Validated tokens:</h4>
                        <div id="tokenProgressBar" style="display: flex; flex-wrap: wrap; gap: 5px; padding: 10px; 
                                                          background: rgba(0, 0, 0, 0.3); border-radius: 8px; max-height: 500px; overflow-y: auto;
                                                          align-items: center; align-content: flex-start; min-height: 60px; scroll-behavior: smooth;">
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
                    
                    <!-- Play Button Overlay (shown before auto-demo) -->
                    ${!this.userClickedStart && !this.autoDemoInProgress && !this.autoDemoComplete ? `
                    <div id="startOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                                                   background: rgba(0, 0, 0, 0.9); z-index: 10000; 
                                                   display: flex; align-items: center; justify-content: center;
                                                   backdrop-filter: blur(10px);">
                        <div style="text-align: center; animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); max-width: 500px;">
                            <h2 style="font-size: 32px; margin-bottom: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">
                                Ready to Tokenize?
                            </h2>
                            <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 32px; line-height: 1.6;">
                                Watch as the AI automatically tokenizes your text,<br>then you'll finish the rest!
                            </p>
                            
                            <button onclick="phase1.startTokenization()" 
                                    style="padding: 16px 48px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                           border: none; border-radius: 12px; color: white; font-size: 17px; font-weight: 700; 
                                           cursor: pointer; box-shadow: 0 6px 25px rgba(0, 212, 255, 0.4); 
                                           transition: all 0.3s; animation: pulse 2s ease-in-out infinite;">
                                Start Tokenization →
                            </button>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div style="width: 100%; max-width: 900px;">
                        
                        <div id="feedbackMessage" style="min-height: 35px; margin-bottom: 12px; text-align: center; font-size: 13px;">
                            ${this.autoDemoInProgress ? '<div style="color: var(--primary); font-weight: 600;">👀 Watch how tokenization works...</div>' : ''}
                        </div>
                        
                        ${this.showTutorial ? `
                        <div id="tutorialHint" style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(251, 191, 36, 0.1)); 
                                                     border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 10px; padding: 12px 16px; 
                                                     margin-bottom: 14px; animation: slideInFromTop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                                                     position: relative;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                <span style="font-size: 20px;">✨</span>
                                <h4 style="color: #fbbf24; font-size: 15px; margin: 0; font-weight: 700;">Now it's your turn!</h4>
                            </div>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 13px; line-height: 1.6;">
                                Drag to select the remaining <strong style="color: #fbbf24;">${this.correctTokens.length - this.validatedTokens.length} tokens</strong>
                            </p>
                            <p style="margin: 8px 0 0 0; color: #fbbf24; font-size: 12px;">
                                💡 Remember: Spaces attach to the word that follows them!
                            </p>
                        </div>
                        ` : ''}
                        
                        <div id="interactiveText" style="font-size: 18px; line-height: 1.8; font-weight: 500; 
                                                       color: white; text-align: left; font-family: 'JetBrains Mono', monospace; 
                                                       padding: 20px; background: rgba(0, 245, 255, 0.05); border-radius: 10px; 
                                                       border: 1px solid rgba(0, 245, 255, 0.2); margin-bottom: 14px; min-height: 160px;
                                                       position: relative;">
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
                        
                    </div>
                </div>
            </div>
        `;
        
        // DON'T auto-start demo - wait for user to click play button
    },
    
    startTokenization() {
        // User clicked the play button
        this.userClickedStart = true;
        
        // Remove overlay
        const overlay = document.getElementById('startOverlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.4s ease';
            setTimeout(() => {
                overlay.remove();
                // Start auto-demo after overlay is gone
                this.startAutoDemo();
            }, 400);
        } else {
            this.startAutoDemo();
        }
    },
    
    makeClickableText(text) {
        if (!text || text.trim().length === 0) {
            return '<div style="color: rgba(255, 255, 255, 0.3); text-align: center; font-size: 14px;">All text tokenized! 🎉</div>';
        }
        
        let html = '<span style="user-select: none;">';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            // Clean, uniform design for all characters (no ugly borders!)
            if (char === ' ') {
                html += `<span class="token-char" data-idx="${i}" 
                           onmousedown="phase1.startSelection(${i})" 
                           onmouseenter="phase1.updateSelection(${i})" 
                           onmouseup="phase1.endSelection(${i})"
                           style="display: inline-block; cursor: pointer; 
                                  padding: 2px 4px; border-radius: 3px; min-width: 10px;
                                  transition: all 0.1s ease;">&nbsp;</span>`;
            } else {
                html += `<span class="token-char" data-idx="${i}" 
                           onmousedown="phase1.startSelection(${i})" 
                           onmouseenter="phase1.updateSelection(${i})" 
                           onmouseup="phase1.endSelection(${i})"
                           style="display: inline-block; cursor: text; 
                                  padding: 2px 1px; border-radius: 3px;
                                  transition: background 0.1s ease;">${char}</span>`;
            }
        }
        
        html += '</span>';
        return html;
    },
    
    startAutoDemo() {
        // Don't start if already in progress or user already started
        if (this.autoDemoInProgress || this.autoDemoComplete) return;
        
        this.autoDemoInProgress = true;
        
        // Calculate how many tokens to auto-complete (90%)
        const totalTokens = this.correctTokens.length;
        const autoTokenCount = Math.ceil(totalTokens * 0.85);
        
        // Auto-tokenize with delays
        this.autoTokenizeNext(0, autoTokenCount);
    },
    
    autoTokenizeNext(currentIndex, targetCount) {
        if (currentIndex >= targetCount || this.currentText.trim().length === 0) {
            // Auto-demo complete!
            this.autoDemoComplete = true;
            this.autoDemoInProgress = false;
            
            // Play notification sound for demo completion
            SoundManager.play('notification');
            
            // Clear the feedback message (no duplicate box!)
            const feedback = document.getElementById('feedbackMessage');
            if (feedback) {
                feedback.innerHTML = '';
            }
            
            // Show tutorial after demo
            this.showTutorial = true;
            
            // Create and insert tutorial box ABOVE the text area
            const interactiveText = document.getElementById('interactiveText');
            if (interactiveText && !document.getElementById('tutorialHint')) {
                const tutorialBox = document.createElement('div');
                tutorialBox.id = 'tutorialHint';
                tutorialBox.style.cssText = `background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(251, 191, 36, 0.1)); 
                                             border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 10px; padding: 12px 16px; 
                                             margin-bottom: 14px; animation: slideInFromTop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                                             position: relative;`;
                tutorialBox.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <span style="font-size: 20px;">✨</span>
                        <h4 style="color: #fbbf24; font-size: 15px; margin: 0; font-weight: 700;">Now it's your turn!</h4>
                    </div>
                    <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 13px; line-height: 1.6;">
                        Drag to select the remaining <strong style="color: #fbbf24;">${this.correctTokens.length - this.validatedTokens.length} tokens</strong>
                    </p>
                    <p style="margin: 8px 0 0 0; color: #fbbf24; font-size: 12px;">
                        💡 Remember: Spaces attach to the word that follows them!
                    </p>
                `;
                interactiveText.parentNode.insertBefore(tutorialBox, interactiveText);
                
                // Add blue pulsing animation to first token (not just first word!)
                setTimeout(() => {
                    if (this.validatedTokens.length >= this.correctTokens.length) return;
                    
                    // Get the NEXT expected token (not the first one in the original list)
                    const nextExpectedToken = this.correctTokens[this.validatedTokens.length];
                    if (!nextExpectedToken) return;
                    
                    const nextTokenLength = nextExpectedToken.length;
                    
                    // Apply blue pulsing animation to all characters of the next expected token
                    const chars = interactiveText.querySelectorAll('.token-char');
                    for (let i = 0; i < nextTokenLength && i < chars.length; i++) {
                        if (chars[i]) {
                            chars[i].style.animation = 'blueHighlight 1.5s ease-in-out infinite';
                            chars[i].style.background = 'rgba(0, 212, 255, 0.3)';
                            chars[i].style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
                            chars[i].classList.add('first-word-highlight');
                        }
                    }
                }, 100);
            }
            
            return;
        }
        
        // Progressive speed increase with different tiers
        // 0-2%: Normal (1x)
        // 2-7%: Fast (3x)
        // 7-85%: SUPER FAST (instant, no animation)
        // 85-90%: Fast (3x)
        // 90-100%: User does it!
        let highlightDelay, flashDelay, nextDelay;
        
        const percentComplete = (currentIndex / targetCount) * 100;
        
        if (currentIndex === 0) {
            // First token - slowest to show what's happening
            highlightDelay = 700;
            flashDelay = 400;
            nextDelay = 500;
        } else {
            let speedMultiplier;
            
            if (percentComplete < 2) {
                // 0-2%: Normal
                speedMultiplier = 1;
            } else if (percentComplete < 7) {
                // 2-7%: Fast
                speedMultiplier = 3;
            } else if (percentComplete < 80) {
                // 7-85%: SUPER FAST - will skip animation below
                speedMultiplier = 100; // Not actually used, just for logging
            } else if (percentComplete < 85) {
                // 85-90%: Fast
                speedMultiplier = 3;
            } else {
                // 90-100%: User's turn - shouldn't reach here
                speedMultiplier = 1;
            }
            
            // Base speeds
            const baseHighlight = 500;
            const baseFlash = 300;
            const baseNext = 400;
            
            // Divide by multiplier to increase speed
            highlightDelay = Math.max(30, baseHighlight / speedMultiplier);
            flashDelay = Math.max(20, baseFlash / speedMultiplier);
            nextDelay = Math.max(30, baseNext / speedMultiplier);
        }
        
        // Get the next correct token
        const token = this.correctTokens[currentIndex];
        const tokenLength = token.length;
        
        // SUPER FAST MODE (7-85%): Skip animation entirely, just add tokens instantly
        if (percentComplete >= 7 && percentComplete < 85) {
            // Play whoosh sound on entering this phase
            if (percentComplete >= 7 && percentComplete < 7.5) {
                SoundManager.play('whoosh'); // Fast whoosh sound for super speed!
            }
            
            // Instant token collection - no animation!
            this.validatedTokens.push(token);
            this.currentText = this.currentText.substring(tokenLength);
            
            // Update displays instantly
            const tokenCount = document.getElementById('yourTokensCount');
            if (tokenCount) {
                tokenCount.textContent = this.validatedTokens.length;
            }
            
            const progressBar = document.getElementById('tokenProgressBar');
            if (progressBar) {
                const color = this.getTokenColor(token);
                const displayToken = token === ' ' ? '␣' : token;
                const tokenBadge = `<span style="background: ${color}80; padding: 3px 8px; border-radius: 5px; 
                                              font-size: 10px; font-weight: 600; color: white; border: 1px solid ${color}cc;">${displayToken}</span>`;
                
                if (this.validatedTokens.length === 1) {
                    progressBar.innerHTML = tokenBadge;
                } else {
                    progressBar.innerHTML += tokenBadge;
                }
                progressBar.scrollTop = progressBar.scrollHeight;
            }
            
            // Re-render text
            const interactiveText = document.getElementById('interactiveText');
            if (interactiveText) {
                interactiveText.innerHTML = this.makeClickableText(this.currentText);
            }
            
            // Continue immediately with next token (just 10ms delay)
            setTimeout(() => {
                this.autoTokenizeNext(currentIndex + 1, targetCount);
            }, 10);
            
            return; // Skip the animation below
        }
        
        // Normal animation for non-FLASH zones
        // Highlight characters being tokenized with selection color
        const chars = document.querySelectorAll('.token-char');
        for (let i = 0; i < tokenLength; i++) {
            if (chars[i]) {
                chars[i].style.background = 'rgba(0, 212, 255, 0.4)';
                chars[i].style.transform = 'scale(1.05)';
                chars[i].style.transition = 'all 0.2s ease';
            }
        }
        
        SoundManager.play('click');
        
        setTimeout(() => {
            // Keep blue selection color while flashing green
            for (let i = 0; i < tokenLength; i++) {
                if (chars[i]) {
                    chars[i].style.background = 'rgba(34, 197, 94, 0.6)';
                }
            }
            
            SoundManager.play('coin'); // Use coin for auto-token collection
            
            setTimeout(() => {
                // Add to validated tokens
                this.validatedTokens.push(token);
                this.currentText = this.currentText.substring(tokenLength);
                
                // Fade out the validated token with selection color
                for (let i = 0; i < tokenLength; i++) {
                    if (chars[i]) {
                        chars[i].style.opacity = '0';
                        chars[i].style.transition = 'opacity 0.3s ease';
                    }
                }
                
                setTimeout(() => {
                    // Update displays after fade
                    const tokenCount = document.getElementById('yourTokensCount');
                    if (tokenCount) {
                        tokenCount.textContent = this.validatedTokens.length;
                    }
                    
                    const progressBar = document.getElementById('tokenProgressBar');
                    if (progressBar) {
                        const color = this.getTokenColor(token);
                        const displayToken = token === ' ' ? '␣' : token;
                        const tokenBadge = `<span style="background: ${color}80; padding: 3px 8px; border-radius: 5px; 
                                                      font-size: 10px; font-weight: 600; color: white; border: 1px solid ${color}cc;">${displayToken}</span>`;
                        
                        if (this.validatedTokens.length === 1) {
                            progressBar.innerHTML = tokenBadge;
                        } else {
                            progressBar.innerHTML += tokenBadge;
                        }
                        
                        // Auto-scroll to bottom when new token added
                        progressBar.scrollTop = progressBar.scrollHeight;
                    }
                    
                    // Re-render text and continue
                    const interactiveText = document.getElementById('interactiveText');
                    if (interactiveText) {
                        interactiveText.innerHTML = this.makeClickableText(this.currentText);
                    }
                    
                    // Continue with next token after delay
                    setTimeout(() => {
                        this.autoTokenizeNext(currentIndex + 1, targetCount);
                    }, nextDelay);
                }, 200);
                
            }, flashDelay);
        }, highlightDelay);
    },
    
    startSelection(idx) {
        // Don't allow interaction during auto-demo
        if (this.autoDemoInProgress) return;
        
        this.selectionStart = idx;
        this.selectionEnd = idx;
        this.isSelecting = true;
        this.updateSelectionDisplay();
        
        // Remove blue highlight animation from first word when user starts selecting
        const highlightedChars = document.querySelectorAll('.first-word-highlight');
        highlightedChars.forEach(char => {
            char.style.animation = 'none';
            char.style.background = 'transparent';
            char.style.boxShadow = 'none';
            char.classList.remove('first-word-highlight');
        });
        
        // Dismiss tutorial on first interaction
        if (this.showTutorial) {
            this.dismissTutorial();
        }
        
        // Mark auto-demo as complete if user interacts
        if (!this.autoDemoComplete) {
            this.autoDemoComplete = true;
        }
    },
    
    updateSelection(idx) {
        if (!this.isSelecting || this.autoDemoInProgress) return;
        this.selectionEnd = idx;
        this.updateSelectionDisplay();
    },
    
    endSelection(idx) {
        if (!this.isSelecting || this.autoDemoInProgress) return;
        this.isSelecting = false;
        this.selectionEnd = idx;
        
        // Validate the selection
        this.validateSelection();
    },
    
    updateSelectionDisplay() {
        if (this.selectionStart === null || this.selectionEnd === null) return;
        
        const start = Math.min(this.selectionStart, this.selectionEnd);
        const end = Math.max(this.selectionStart, this.selectionEnd) + 1;
        
        const chars = document.querySelectorAll('.token-char');
        chars.forEach((char, idx) => {
            if (idx >= start && idx < end) {
                char.style.background = 'rgba(0, 212, 255, 0.4)';
                char.style.borderRadius = '3px';
            } else {
                char.style.background = 'transparent';
            }
        });
    },
    
    validateSelection() {
        if (this.selectionStart === null || this.selectionEnd === null) return;
        
        const start = Math.min(this.selectionStart, this.selectionEnd);
        const end = Math.max(this.selectionStart, this.selectionEnd) + 1;
        
        // Selection must start at 0 (beginning of remaining text)
        if (start !== 0) {
            this.showFeedback('⚠️ Start from the beginning of the text!', 'error');
            this.clearSelection();
            SoundManager.play('warning'); // Use warning for rule violations
            return;
        }
        
        const userToken = this.currentText.substring(start, end);
        const nextExpectedToken = this.correctTokens[this.validatedTokens.length];
        const isCorrect = userToken === nextExpectedToken;
        
        // Visual feedback
        const chars = document.querySelectorAll('.token-char');
        const color = isCorrect ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';
        
        for (let i = start; i < end; i++) {
            if (chars[i]) {
                chars[i].style.background = color;
                chars[i].style.transition = 'background 0.3s ease';
            }
        }
        
        if (isCorrect) {
            this.correctAnswers++;
            this.showFeedback('✓ Correct!', 'success');
            SoundManager.play('coin'); // Use coin for token collection!
            Game.addScore(15); // Mini-game: +15 per correct token
            
            setTimeout(() => {
                // Add to validated tokens
            this.validatedTokens.push(userToken);
                this.currentText = this.currentText.substring(end);
                
                // Update display
                const tokenCount = document.getElementById('yourTokensCount');
                if (tokenCount) {
                    tokenCount.textContent = this.validatedTokens.length;
                }
                
                // Update token progress bar
                const progressBar = document.getElementById('tokenProgressBar');
                if (progressBar) {
                    const color = this.getTokenColor(userToken);
                    const displayToken = userToken === ' ' ? '␣' : userToken;
                    const tokenBadge = `<span style="background: ${color}80; padding: 3px 8px; border-radius: 5px; 
                                                  font-size: 10px; font-weight: 600; color: white; border: 1px solid ${color}cc;">${displayToken}</span>`;
                    
                    if (this.validatedTokens.length === 1) {
                        progressBar.innerHTML = tokenBadge;
                    } else {
                        progressBar.innerHTML += tokenBadge;
                    }
                    
                    // Auto-scroll to bottom when new token added
                    progressBar.scrollTop = progressBar.scrollHeight;
                }
                
                // Check if done
                if (this.currentText.trim().length === 0) {
                    this.finishTokenization();
        } else {
                    // Re-render for next token
                    const interactiveText = document.getElementById('interactiveText');
                    if (interactiveText) {
                        interactiveText.innerHTML = this.makeClickableText(this.currentText);
                    }
                    this.clearSelection();
                }
            }, 500);
        } else {
            this.wrongAnswers++;
            this.showFeedback(`Wrong! Expected: "${nextExpectedToken === ' ' ? '␣' : nextExpectedToken}"`, 'error');
            SoundManager.play('wrong'); // Use 'wrong' for wrong answers
            Game.addScoreSafe(-10); // Mini-game penalty (only if score > 0)
            
            setTimeout(() => {
                this.clearSelection();
                const interactiveText = document.getElementById('interactiveText');
                if (interactiveText) {
                    interactiveText.innerHTML = this.makeClickableText(this.currentText);
                }
            }, 1200);
        }
    },
    
    clearSelection() {
        this.selectionStart = null;
        this.selectionEnd = null;
        this.isSelecting = false;
        
        const chars = document.querySelectorAll('.token-char');
        chars.forEach((char) => {
            char.style.background = 'transparent';
        });
    },
    
    showFeedback(message, type) {
        const feedback = document.getElementById('feedbackMessage');
        if (!feedback) return;
        
        const color = type === 'success' ? '#22c55e' : '#ef4444';
        feedback.innerHTML = `<div style="color: ${color}; font-weight: 600;">${message}</div>`;
        
        if (type === 'success') {
            setTimeout(() => {
                feedback.innerHTML = '';
            }, 1500);
        }
    },
    
    dismissTutorial() {
        this.showTutorial = false;
        const tutorial = document.getElementById('tutorialHint');
        if (tutorial) {
            tutorial.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                tutorial.remove();
            }, 300);
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
    
    
    finishTokenization() {
        // Skip completion screen and go directly to Token IDs
        Game.state.tokens = this.validatedTokens;
        Game.saveState();
        SoundManager.play('levelUp');
        this.currentStep = 'info1';
        const phaseContainer = document.getElementById('phaseContainer');
        this.render(phaseContainer);
    },
    
    continueAfterCompletion() {
        Game.state.tokens = this.validatedTokens;
        Game.saveState();
        this.currentStep = 'info1';
        const phaseContainer = document.getElementById('phaseContainer');
        this.render(phaseContainer);
    },
    
    calculateCorrectTokens(text) {
        const tokens = [];
        let i = 0;
        let isFirstToken = true; // Track if this is the first token (no leading space)
        
        while (i < text.length) {
            const char = text[i];
            
            // Skip spaces - they'll be attached to the next word
            if (char === ' ') {
                i++;
                continue;
            }
            
            // Handle punctuation (no space attached)
            if ('.!?,'.includes(char)) {
                tokens.push(char);
                i++;
                isFirstToken = false; // After punctuation, next word needs space
                continue;
            }
            
            // Handle words (with space attached if not first token)
            let word = '';
            
            // Add leading space if not the first token and previous char was space
            if (!isFirstToken && i > 0 && text[i - 1] === ' ') {
                word = ' ';
            }
            
            // Collect the word characters
            while (i < text.length && text[i] !== ' ' && !'.!?,'.includes(text[i])) {
                word += text[i];
                i++;
            }
            
            if (word) {
                // Remove the space prefix temporarily to process the word
                const hasSpace = word.startsWith(' ');
                const wordWithoutSpace = hasSpace ? word.substring(1) : word;
                
                // Check for contractions
                if (wordWithoutSpace.includes("'")) {
                    const parts = wordWithoutSpace.split("'");
                    // First part gets the space
                    tokens.push((hasSpace ? ' ' : '') + parts[0]);
                    // Second part (with apostrophe) no space
                    tokens.push("'" + parts[1]);
                } else {
                    // Words that should NOT be split (complete words, not derived forms)
                    const doNotSplit = [
                        // -ing words that are NOT verb+ing
                        'thing', 'something', 'nothing', 'everything', 'anything',
                        'king', 'ring', 'sing', 'bring', 'string', 'spring', 'wing',
                        'morning', 'evening', 'during', 'amazing', 'interesting',
                        'running', 'eating', 'coding', 'winning', 'cooking',
                        // -ed words that are NOT verb+ed
                        'red', 'bed', 'fed', 'led', 'shed', 'wed',
                        'said', 'paid', 'laid', 'made', 'trade',
                        // Other complete words
                        'business', 'witness', 'fitness', 'darkness'
                    ];
                    
                    const lowerWord = wordWithoutSpace.toLowerCase();
                    
                    // Don't split if it's in the do-not-split list
                    if (doNotSplit.includes(lowerWord)) {
                        tokens.push(word);
                    } else {
                        // Check for suffixes only on words where it makes sense
                        const suffixes = ['ing', 'ed', 'ness'];
                        let foundSuffix = false;
                        for (const suffix of suffixes) {
                            // Only split if: word ends with suffix AND root is at least 3 chars
                            if (wordWithoutSpace.endsWith(suffix) && wordWithoutSpace.length > suffix.length + 2) {
                                // Root word gets the space
                                tokens.push((hasSpace ? ' ' : '') + wordWithoutSpace.substring(0, wordWithoutSpace.length - suffix.length));
                                // Suffix no space
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
                isFirstToken = false;
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
                        After <strong style="color: #22c55e;">tokenization</strong>, we need to assign IDs, because computers can't work with text directly. Each token is assigned a unique numerical ID from a <strong style="color: var(--primary);">vocabulary</strong>:
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); 
                               border-radius: 14px; padding: 16px; margin-bottom: 20px; text-align: left;">
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 10px; font-family: monospace; font-size: 11px; max-height: 180px; overflow-y: auto; line-height: 2;">
                            ${Game.state.tokens.slice(0, 10).map((token, idx) => {
                                const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];
                                const color = colors[idx % colors.length];
                                const displayToken = token === ' ' ? '␣' : token;
                                return `<span style="display: inline-block; margin: 2px; padding: 3px 8px; background: ${color}40; border: 1px solid ${color}; border-radius: 6px;">
                                    <span style="color: white;">"${displayToken}"</span>
                                    <span style="color: ${color}; margin-left: 6px; font-size: 10px;">ID:${idx + 1}</span>
                                </span>`;
                            }).join('')}
                            ${Game.state.tokens.length > 10 ? '<div style="color: var(--text-secondary); font-style: italic; margin-top: 8px; font-size: 10px;">...and more</div>' : ''}
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">⚡</span>
                            <h3 style="font-size: 15px; color: #ef4444; margin: 0; font-weight: 700;">Reality Check: How Real LLMs Assign IDs</h3>
                        </div>
                        <div style="font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 12px;">
                                This game assigns IDs sequentially (1, 2, 3...). <strong style="color: #ef4444;">Real LLMs use a pre-built vocabulary</strong> created during training:
                            </p>
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                                <div style="font-size: 11px; line-height: 1.8;">
                                    • <strong style="color: #fbbf24;">Fixed vocabulary:</strong> Each unique token gets a permanent ID (e.g., "the" = 257, "cat" = 4892)<br>
                                    • <strong style="color: #fbbf24;">Byte-Pair Encoding (BPE):</strong> Algorithm that learns common subwords from massive training data<br>
                                    • <strong style="color: #fbbf24;">Vocab size:</strong> GPT-3: 50,257 tokens | GPT-4: 100,000 tokens
                                </div>
                            </div>
                            <p style="margin: 0; padding: 10px; background: rgba(251, 191, 36, 0.1); border-radius: 8px; border-left: 3px solid #fbbf24;">
                                💡 <strong>Key Insight:</strong> The vocabulary is frozen after training. The model can't learn new token IDs - 
                                it only learns relationships between existing tokens through billions of parameters!
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
                        Token order matters! After IDs, our tokens need order. We add position information to each token.
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); 
                               border-radius: 14px; padding: 20px; margin-bottom: 20px; text-align: left;">
                        <div style="font-size: 13px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 14px;">
                                "The cat" and "cat The" are different! Position encoding tells the model where each token appears in the sequence:
                            </p>
                            
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: 10px; font-family: monospace; font-size: 12px; max-height: 240px; overflow-y: auto; line-height: 2.2;">
                                ${Game.state.tokens.slice(0, 15).map((token, idx) => {
                                    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];
                                    const color = colors[idx % colors.length];
                                    const displayToken = token === ' ' ? '␣' : token;
                                    return `<span style="display: inline-block; margin: 3px 4px; padding: 4px 10px; background: ${color}40; border: 1px solid ${color}; border-radius: 6px; white-space: nowrap;">
                                        <span style="color: white; font-weight: 600;">"${displayToken}"</span>
                                        <span style="color: ${color}; margin-left: 6px; font-size: 11px;">pos:${idx}</span>
                                    </span>`;
                                }).join('')}
                                ${Game.state.tokens.length > 15 ? '<div style="color: var(--text-secondary); font-style: italic; margin-top: 8px;">...and more</div>' : ''}
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
                            <p style="margin-bottom: 8px;">
                                <strong style="color: #a855f7;">GPT-3.5:</strong> 4,096 tokens | <strong style="color: #a855f7;">GPT-4:</strong> 8,192-32,768 tokens | <strong style="color: #a855f7;">Claude:</strong> 100,000+ tokens
                            </p>
                            <p style="margin: 0; padding: 8px; background: rgba(139, 92, 246, 0.1); border-radius: 6px; border-left: 3px solid #a855f7;">
                                💡 This includes <strong>everything</strong>: system prompts, your messages, and the AI's responses. When the conversation exceeds this limit, older messages get truncated.
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
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;">
                <div style="max-width: 950px; width: 100%;">
                    
                    <!-- ANIMATED SCALE COMPARISON -->
                    <div style="margin: 20px 0; padding: 24px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.05)); 
                               border: 3px solid rgba(139, 92, 246, 0.3); border-radius: 16px; overflow: visible;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="font-size: 20px; color: #a855f7; margin-bottom: 8px; font-weight: 700;">
                                🔬 Scale Comparison: Your Model vs. Real LLMs
                            </h3>
                            <p style="font-size: 13px; color: var(--text-secondary);">
                                Watch your vocabulary shrink as we compare it to production models
                            </p>
                        </div>
                        <div id="tokenScaleAnimation" style="min-height: 380px; max-height: 380px; overflow: visible;"></div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button id="continueToJourneyBtn"
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Continue: View Progress →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Trigger the animation after a short delay
        setTimeout(() => {
            if (window.ScaleAnimations && window.ScaleAnimations.animateTokenComparison) {
                ScaleAnimations.animateTokenComparison(Game.state.tokens);
            }
        }, 500);
        
        // Add event listener after rendering
        setTimeout(() => {
            const btn = document.getElementById('continueToJourneyBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    // Go to Journey Checkpoint page
                    this.currentStep = 'journey_checkpoint';
                    this.render(document.getElementById('phaseContainer'));
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
    },
    
    // Journey Checkpoint Page
    renderJourneyCheckpoint(container) {
        const phaseData = {
            title: 'Tokenization',
            subtitle: `You broke down your training text into ${Game.state.tokens.length} processable tokens`,
            whereYouAre: 'Your text is now split into tokens - the basic building blocks that neural networks can process. Each word, punctuation mark, and space has become a discrete unit with an ID and a position.',
            whatYouDid: `You successfully tokenized your training data into ${Game.state.tokens.length} tokens using space-attached tokenization (mimicking real LLM behavior). You learned that spaces attach to following words, suffixes are split ("-ing", "-ed"), and each token gets a unique ID.`,
            whatsNext: '<strong>Embeddings:</strong> Convert each token into a numerical vector (embedding). These vectors capture semantic meaning - similar words get similar vectors, allowing the model to understand relationships.',
            whyItMatters: 'Tokenization is the First step of every LLM! Without it, AI cannot process text. Good tokenization leads to efficient learning. GPT uses ~50K tokens to handle all of English + code + multilingual text efficiently.',
            buttonText: 'Continue to Embeddings',
            onContinue: 'phase1.completePhaseAndAdvance()'
        };
        
        Game.renderJourneyCheckpoint(1, phaseData);
    },
    
    // Complete Phase and Advance
    completePhaseAndAdvance() {
        // Mark phase 1 as complete
        if (!Game.state.phaseCompleted[1]) {
            Game.state.phaseCompleted[1] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase1_transition']) {
            Game.addScore(100); // Phase transition bonus
            Game.state.pointsAwarded['phase1_transition'] = true;
            Game.saveState();
        }
        
        // Advance to next phase
        SoundManager.play('success');
        Game.nextPhase();
    }
};

