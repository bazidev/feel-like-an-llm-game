// Phase 1: Tokenization - V1 DESIGN WITH PROPER LOGIC
window.phase1 = {
    currentStep: 'concept1', // 'concept1' -> 'concept2' -> 'examples' -> 'yourdata' -> 'info1' -> 'info2' -> 'recap'
    currentExample: 0,
    
    // For interactive tokenization
    userSplits: [],         // Where user clicked (character indices)
    validatedTokens: [],    // Array of correctly validated tokens
    currentText: '',
    correctTokens: [],      // Target tokens to match
    colorIndex: 0,
    
    tokenColors: [
        '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', 
        '#ec4899', '#14b8a6', '#f97316', '#06b6d4'
    ],
    
    tutorialChallenges: [
        {
            word: "playing",
            options: [
                { tokens: ["play", "ing"], correct: true },
                { tokens: ["playing"], correct: false },
                { tokens: ["p", "l", "a", "y", "i", "n", "g"], correct: false }
            ],
            explanation: "The suffix '-ing' splits from the root word"
        },
        {
            word: "I'm",
            options: [
                { tokens: ["I", "'m"], correct: true },
                { tokens: ["I'm"], correct: false },
                { tokens: ["I", "m"], correct: false }
            ],
            explanation: "Contractions split at the apostrophe"
        },
        {
            word: "happiness",
            options: [
                { tokens: ["happi", "ness"], correct: true },
                { tokens: ["happiness"], correct: false },
                { tokens: ["happy", "ness"], correct: false }
            ],
            explanation: "The suffix '-ness' splits, with spelling adjustment"
        },
        {
            word: "walked",
            options: [
                { tokens: ["walk", "ed"], correct: true },
                { tokens: ["walked"], correct: false },
                { tokens: ["wal", "ked"], correct: false }
            ],
            explanation: "The suffix '-ed' splits from the root verb"
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
    
    // STEP 1: Why LLMs tokenize + How we simplified
    renderConcept1(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px;">
                <div style="max-width: 850px; width: 100%;">
                    
                    <h1 style="font-size: 32px; margin-bottom: 16px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ✂️ Tokenization
                    </h1>
                    <p style="font-size: 16px; color: var(--text-secondary); text-align: center; margin-bottom: 36px;">
                        Break text into tokens - the atoms of AI understanding
                    </p>
                    
                    <!-- Why LLMs tokenize -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 28px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <span style="font-size: 28px;">🤖</span>
                            <h2 style="font-size: 20px; color: var(--primary); margin: 0;">Why do LLMs tokenize?</h2>
                        </div>
                        <div style="font-size: 14px; line-height: 1.7; color: var(--text-secondary);">
                            <p style="margin-bottom: 14px;">
                                <strong style="color: var(--primary);">Computers don't understand words.</strong> 
                                They only understand numbers. Tokenization is the bridge between human text and machine math.
                            </p>
                            <p style="margin-bottom: 14px;">
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
                               border: 2px solid rgba(191, 0, 255, 0.3); border-radius: 16px; padding: 28px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <span style="font-size: 28px;">🎮</span>
                            <h2 style="font-size: 20px; color: var(--secondary); margin: 0;">How we simplified it for this game</h2>
                        </div>
                        <div style="font-size: 14px; line-height: 1.7; color: var(--text-secondary);">
                            <p style="margin-bottom: 14px;">
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
                                style="padding: 14px 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Next →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    // STEP 2: Rules + Reality check
    renderConcept2(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px;">
                <div style="max-width: 850px; width: 100%;">
                    
                    <h1 style="font-size: 32px; margin-bottom: 16px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ✂️ Tokenization
                    </h1>
                    <p style="font-size: 16px; color: var(--text-secondary); text-align: center; margin-bottom: 36px;">
                        Break text into tokens - the atoms of AI understanding
                    </p>
                    
                    <!-- Rules Card (OLD DESIGN) -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">📋</span>
                            <h3 style="font-size: 18px; color: var(--primary); margin: 0;">Tokenization rules (for this game)</h3>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">1. Split suffixes</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">-ing, -ed, -ness separate</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">2. Spaces are separate</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Each space is a token</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">3. Punctuation splits</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">. , ! ? are separate tokens</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 13px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">4. Contractions split</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">I'm → I + 'm</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Reality Check (OLD DESIGN) -->
                    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                            <span style="font-size: 22px;">⚡</span>
                            <h3 style="font-size: 16px; color: #ef4444; margin: 0;">Reality check: How real LLMs actually tokenize</h3>
                        </div>
                        <div style="font-size: 13px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                <strong style="color: #ef4444;">NO FIXED RULES!</strong> Real LLMs like GPT use <strong>BPE (Byte-Pair Encoding)</strong> which learns tokenization from data patterns:
                            </p>
                            <ul style="margin: 0; padding-left: 20px; list-style: none;">
                                <li style="margin-bottom: 7px; padding-left: 18px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Spaces are INCLUDED with words:</strong> "cat" becomes " cat" (space attached!)
                                </li>
                                <li style="margin-bottom: 7px; padding-left: 18px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">100% data-driven:</strong> If "playing" appears often, it stays whole. If "play" + "ing" is more common in training, it splits!
                                </li>
                                <li style="margin-bottom: 7px; padding-left: 18px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">No suffix rules:</strong> "walked" might be ["walk", "ed"] OR ["walked"] depending on training frequency
                                </li>
                                <li style="margin: 0; padding-left: 18px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Subword units:</strong> Rare words split into pieces: "tokenization" → ["token", "ization"]
                                </li>
                            </ul>
                            <p style="margin-top: 12px; font-style: italic; color: rgba(239, 68, 68, 0.8); font-size: 12px;">
                                For this game, we use simple rules to teach the concept. Real LLMs are smarter! 🧠
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phase1.nextStep()" 
                                style="padding: 14px 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Let's practice! →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    // STEP 3: Multiple choice examples (V1 STYLE)
    renderExamples(container) {
        const challenge = this.tutorialChallenges[this.currentExample];
        if (!challenge) {
            this.currentStep = 'yourdata';
            this.render(container);
            return;
        }
        
        // Shuffle options
        const shuffledOptions = [...challenge.options].sort(() => Math.random() - 0.5);
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 350px 1fr; height: 100%; overflow: hidden;">
                
                <!-- Sidebar -->
                <div style="background: rgba(0, 0, 0, 0.4); padding: 32px 24px; overflow-y: auto; border-right: 2px solid rgba(0, 212, 255, 0.3);">
                    <h2 style="font-size: 20px; color: var(--primary); margin-bottom: 12px; font-weight: 600;">Tokenization: Pattern Rules</h2>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 28px;">
                        You don't understand words - you split by patterns
                    </p>
                    <p style="font-size: 12px; color: rgba(255, 255, 255, 0.5); line-height: 1.6; margin-bottom: 32px;">
                        You're a machine following rules. You split text into tokens based on patterns you learned during training
                        - not because you "understand" language.
                    </p>
                    
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.25); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                        <h3 style="font-size: 14px; color: #f59e0b; margin-bottom: 14px; font-weight: 600;">Tokenization Rules</h3>
                        <div style="font-size: 12px; line-height: 1.8; color: var(--text-secondary);">
                            <div style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">1. Common suffixes split:</strong> -ing, -ed, -ness
                            </div>
                            <div style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">2. Spaces are tokens</strong>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">3. Punctuation separates</strong>
                            </div>
                            <div>
                                <strong style="color: var(--primary);">4. Common prefixes split:</strong> un-, re-
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 18px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 18px;">⚡</span>
                            <h3 style="font-size: 13px; color: #ef4444; margin: 0; font-weight: 600;">Reality Check:</h3>
                        </div>
                        <p style="font-size: 11px; line-height: 1.6; color: rgba(255, 255, 255, 0.65); margin: 0;">
                            You learned these patterns from millions of text examples. You don't "know" what 
                            "playing" means - you just pattern-match that "-ing" usually splits.
                        </p>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px; overflow-y: auto; background: rgba(0, 0, 0, 0.2);">
                    <div style="max-width: 700px; width: 100%; text-align: center;">
                        
                        <div style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin-bottom: 32px;">
                            ${this.currentExample + 1} of ${this.tutorialChallenges.length}
                        </div>
                        
                        <h1 style="font-size: 32px; margin-bottom: 32px; color: white; font-weight: 600;">
                            Challenge ${this.currentExample + 1}: How should this tokenize?
                        </h1>
                        
                        <!-- Curved bracket showing rule -->
                        <div style="background: rgba(0, 212, 255, 0.06); border: 2px solid rgba(0, 212, 255, 0.3); 
                                   border-radius: 16px; padding: 16px 24px; margin-bottom: 40px; display: inline-block;">
                            <div style="font-size: 13px; color: var(--primary); font-weight: 500;">
                                Rule: ${challenge.explanation}
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 12px;">Text to tokenize:</div>
                            <div style="font-size: 48px; font-weight: 700; color: var(--primary); font-family: 'JetBrains Mono', monospace; letter-spacing: 2px;">
                                ${challenge.word}
                            </div>
                        </div>
                        
                        <div style="height: 50px;"></div>
                        
                        <div id="exampleChoices" style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                            ${shuffledOptions.map((option, idx) => `
                                <button onclick="phase1.checkExample(${option.correct})" 
                                        style="padding: 18px 32px; background: rgba(0, 0, 0, 0.4); border: 2px solid rgba(0, 212, 255, 0.3); 
                                               border-radius: 12px; color: white; font-size: 20px; cursor: pointer; 
                                               transition: all 0.3s; font-family: 'JetBrains Mono', monospace; font-weight: 500;
                                               box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
                                    ${option.tokens.map(t => `<span style="display: inline-block; background: rgba(0, 212, 255, 0.15); padding: 6px 16px; 
                                                                      margin: 0 6px; border-radius: 8px; border: 1px solid rgba(0, 212, 255, 0.4);">${t}</span>`).join(' ')}
                                </button>
                            `).join('')}
                        </div>
                        
                        <div id="exampleFeedback" style="min-height: 100px; font-size: 16px; line-height: 1.6;"></div>
                        
                    </div>
                </div>
                
            </div>
        `;
    },
    
    checkExample(isCorrect) {
        const feedback = document.getElementById('exampleFeedback');
        const challenge = this.tutorialChallenges[this.currentExample];
        const explanation = challenge.explanation;
        
        if (isCorrect) {
            SoundManager.play('success');
            Game.addScore(10);
            feedback.innerHTML = `
                <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1)); 
                           border: 2px solid #22c55e; border-radius: 12px; padding: 24px;">
                    <div style="font-size: 28px; margin-bottom: 12px; color: #22c55e;">✓ Correct!</div>
                    <div style="font-size: 15px; color: rgba(255, 255, 255, 0.8);">${explanation}</div>
                </div>
            `;
            
            setTimeout(() => {
                this.currentExample++;
                const container = document.getElementById('phaseContainer');
                this.render(container);
            }, 2000);
        } else {
            SoundManager.play('error');
            Game.addScore(-5);
            feedback.innerHTML = `
                <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1)); 
                           border: 2px solid #ef4444; border-radius: 12px; padding: 24px;">
                    <div style="font-size: 28px; margin-bottom: 12px; color: #ef4444;">✗ Not quite!</div>
                    <div style="font-size: 15px; color: rgba(255, 255, 255, 0.8);">Hint: ${explanation}</div>
                </div>
            `;
        }
    },
    
    // STEP 4: Interactive tokenization of full text (V1 STYLE - WORD BY WORD REMOVAL)
    renderYourData(container) {
        // Initialize if first time
        if (!this.currentText) {
            this.currentText = Game.state.trainingText;
            this.correctTokens = this.calculateCorrectTokens(Game.state.trainingText);
            this.validatedTokens = [];
            this.userSplits = [];
        }
        
        const targetCount = this.correctTokens.length;
        const currentCount = this.validatedTokens.length;
        const accuracy = targetCount > 0 ? Math.round((currentCount / targetCount) * 100) : 0;
        
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 350px 1fr; height: 100%; overflow: hidden;">
                
                <!-- Sidebar -->
                <div style="background: rgba(0, 0, 0, 0.4); padding: 32px 24px; overflow-y: auto; border-right: 2px solid rgba(0, 212, 255, 0.3);">
                    <h2 style="font-size: 20px; color: var(--primary); margin-bottom: 12px; font-weight: 600;">Tokenize your data</h2>
                    <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 28px;">
                        Apply rules to your training text
                    </p>
                    <p style="font-size: 12px; color: rgba(255, 255, 255, 0.5); line-height: 1.6; margin-bottom: 32px;">
                        Now tokenize your actual training data. Click between characters to add split marks (|).
                    </p>
                    
                    <div style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(251, 191, 36, 0.05)); 
                               border: 2px solid rgba(255, 193, 7, 0.4); border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 18px;">💡</span>
                            <h3 style="font-size: 14px; color: #fbbf24; margin: 0; font-weight: 600;">Target</h3>
                        </div>
                        <p style="font-size: 12px; line-height: 1.6; color: rgba(255, 255, 255, 0.7); margin: 0;">
                            You need approximately <strong style="color: #fbbf24;">${targetCount} tokens</strong> based on the rules.
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <h3 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">✅ Validated tokens:</h3>
                        <div id="tokenProgressBar" style="display: flex; flex-wrap: wrap; gap: 6px; min-height: 60px; padding: 12px; 
                                                          background: rgba(0, 0, 0, 0.3); border-radius: 8px; max-height: 200px; overflow-y: auto;">
                            ${this.validatedTokens.length === 0 ? '<div style="color: rgba(255, 255, 255, 0.3); font-size: 11px;">No tokens yet...</div>' : 
                              this.validatedTokens.map((t, idx) => 
                                `<span style="background: ${this.tokenColors[idx % this.tokenColors.length]}; padding: 4px 10px; border-radius: 6px; 
                                               font-size: 11px; font-weight: 600; color: white;">${t}</span>`
                              ).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px; overflow-y: auto; background: rgba(0, 0, 0, 0.2);">
                    <div style="max-width: 900px; width: 100%;">
                        
                        <div id="feedbackMessage" style="min-height: 60px; margin-bottom: 32px; text-align: center; font-size: 15px;"></div>
                        
                        <div id="interactiveText" style="font-size: 24px; line-height: 2.2; font-weight: 500; 
                                                       color: white; text-align: left; font-family: 'JetBrains Mono', monospace; 
                                                       padding: 32px; background: rgba(0, 0, 0, 0.3); border-radius: 16px; 
                                                       border: 2px solid rgba(0, 212, 255, 0.2); margin-bottom: 32px; min-height: 300px;">
                            ${this.makeClickableText(this.currentText)}
                        </div>
                        
                        <!-- Stats & Submit -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                            <div style="text-align: center; padding: 20px; background: rgba(0, 212, 255, 0.1); border-radius: 12px; border: 2px solid rgba(0, 212, 255, 0.3);">
                                <div style="font-size: 40px; font-weight: 700; color: var(--primary);">${currentCount}</div>
                                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Your Tokens</div>
                            </div>
                            <div style="text-align: center; padding: 20px; background: rgba(191, 0, 255, 0.1); border-radius: 12px; border: 2px solid rgba(191, 0, 255, 0.3);">
                                <div style="font-size: 40px; font-weight: 700; color: var(--secondary);">${targetCount}</div>
                                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Target Tokens</div>
                            </div>
                        </div>
                        
                        ${this.currentText.trim().length === 0 ? `
                            <button onclick="phase1.finishTokenization()" 
                                    style="width: 100%; padding: 20px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                           border: none; border-radius: 12px; color: white; font-size: 18px; font-weight: 600; 
                                           cursor: pointer; box-shadow: 0 6px 30px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                                ✓ Finish tokenization
                            </button>
                        ` : ''}
                        
                        ${currentCount > 0 && this.currentText.trim().length > 0 ? `
                            <div id="accuracyFeedback" style="padding: 20px; background: ${accuracy >= 80 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; 
                                                             border: 2px solid ${accuracy >= 80 ? '#22c55e' : '#ef4444'}; border-radius: 12px;">
                                <div style="font-size: 16px; color: ${accuracy >= 80 ? '#22c55e' : '#ef4444'}; font-weight: 600; margin-bottom: 8px;">
                                    ${accuracy >= 80 ? '✓ Good progress!' : '✗ Needs improvement'}
                                </div>
                                <div style="font-size: 13px; color: var(--text-secondary);">
                                    Accuracy: ${accuracy}%<br>
                                    Correct splits: ${currentCount}/${targetCount}
                                </div>
                            </div>
                        ` : ''}
                        
                    </div>
                </div>
                
            </div>
        `;
    },
    
    makeClickableText(text) {
        if (!text || text.trim().length === 0) {
            return '<div style="color: rgba(255, 255, 255, 0.3); text-align: center; font-size: 16px;">All text tokenized! 🎉</div>';
        }
        
        let html = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const idx = i;
            
            // Add clickable boundary BEFORE this character
            html += `<span class="token-boundary" onclick="phase1.toggleBoundary(${idx})" 
                           style="display: inline-block; width: ${this.userSplits.includes(idx) ? '12px' : '4px'}; height: 28px; cursor: pointer; 
                                  background: ${this.userSplits.includes(idx) ? 'rgba(0, 212, 255, 0.5)' : 'transparent'}; 
                                  border-left: ${this.userSplits.includes(idx) ? '3px solid var(--primary)' : '1px dashed rgba(0, 212, 255, 0.3)'}; 
                                  margin: 0 2px; transition: all 0.2s; position: relative; top: 3px; vertical-align: middle;"
                           onmouseover="this.style.background='rgba(0, 212, 255, 0.4)'; this.style.borderLeft='2px solid var(--primary)'; this.style.width='10px'" 
                           onmouseout="this.style.background='${this.userSplits.includes(idx) ? 'rgba(0, 212, 255, 0.5)' : 'transparent'}'; 
                                      this.style.borderLeft='${this.userSplits.includes(idx) ? '3px solid var(--primary)' : '1px dashed rgba(0, 212, 255, 0.3)'}';
                                      this.style.width='${this.userSplits.includes(idx) ? '12px' : '4px'}'"></span>`;
            
            // Add the character itself
            html += `<span class="token-char" style="display: inline;">${char === ' ' ? '&nbsp;' : char}</span>`;
        }
        
        // Add final boundary AFTER last character
        const lastIdx = text.length;
        html += `<span class="token-boundary" onclick="phase1.toggleBoundary(${lastIdx})" 
                       style="display: inline-block; width: ${this.userSplits.includes(lastIdx) ? '12px' : '4px'}; height: 28px; cursor: pointer; 
                              background: ${this.userSplits.includes(lastIdx) ? 'rgba(0, 212, 255, 0.5)' : 'transparent'}; 
                              border-left: ${this.userSplits.includes(lastIdx) ? '3px solid var(--primary)' : '1px dashed rgba(0, 212, 255, 0.3)'}; 
                              margin: 0 2px; transition: all 0.2s; position: relative; top: 3px; vertical-align: middle;"
                       onmouseover="this.style.background='rgba(0, 212, 255, 0.4)'; this.style.borderLeft='2px solid var(--primary)'; this.style.width='10px'" 
                       onmouseout="this.style.background='${this.userSplits.includes(lastIdx) ? 'rgba(0, 212, 255, 0.5)' : 'transparent'}'; 
                                  this.style.borderLeft='${this.userSplits.includes(lastIdx) ? '3px solid var(--primary)' : '1px dashed rgba(0, 212, 255, 0.3)'}';
                                  this.style.width='${this.userSplits.includes(lastIdx) ? '12px' : '4px'}'"></span>`;
        
        return html;
    },
    
    toggleBoundary(idx) {
        SoundManager.play('click');
        
        if (this.userSplits.includes(idx)) {
            // Remove boundary
            this.userSplits = this.userSplits.filter(i => i !== idx);
        } else {
            // Add boundary
            this.userSplits.push(idx);
            this.userSplits.sort((a, b) => a - b);
        }
        
        // Check if we have at least 2 boundaries (a complete token)
        if (this.userSplits.length >= 2) {
            this.validateCurrentToken();
        } else {
            // Just re-render to show updated boundaries
            const container = document.getElementById('interactiveText');
            if (container) {
                container.innerHTML = this.makeClickableText(this.currentText);
            }
        }
    },
    
    validateCurrentToken() {
        // Get the first token marked by boundaries
        const start = this.userSplits[0];
        const end = this.userSplits[1];
        const userToken = this.currentText.substring(start, end);
        
        // Check if this token matches the next expected token
        const nextExpectedToken = this.correctTokens[this.validatedTokens.length];
        const isCorrect = userToken === nextExpectedToken;
        
        const feedback = document.getElementById('feedbackMessage');
        
        if (isCorrect) {
            // Success! Remove token from text
            SoundManager.play('success');
            Game.addScore(10);
            
            this.validatedTokens.push(userToken);
            
            feedback.innerHTML = `<div style="color: #22c55e; font-weight: 600; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px;">✓ Correct! "${userToken}" +10 points</div>`;
            
            // Remove the validated part from text and reset splits
            this.currentText = this.currentText.substring(end);
            this.userSplits = [];
            
            // Re-render everything
            setTimeout(() => {
                const container = document.getElementById('phaseContainer');
                this.render(container);
            }, 500);
            
        } else {
            // Error! Show red highlight for 2 seconds
            SoundManager.play('error');
            Game.addScore(-5);
            
            feedback.innerHTML = `<div style="color: #ef4444; font-weight: 600; padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">✗ Incorrect! Expected "${nextExpectedToken}" but got "${userToken}". Try again! -5 points</div>`;
            
            // Highlight the selected text in red
            const textContainer = document.getElementById('interactiveText');
            if (textContainer) {
                const beforeText = this.currentText.substring(0, start);
                const highlightedText = this.currentText.substring(start, end);
                const afterText = this.currentText.substring(end);
                
                textContainer.innerHTML = `
                    ${beforeText}
                    <span style="background: rgba(239, 68, 68, 0.3); color: #ef4444; padding: 4px; border-radius: 4px;">${highlightedText}</span>
                    ${afterText}
                `;
            }
            
            // Clear splits and feedback after 2 seconds
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
        let current = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === ' ') {
                if (current) tokens.push(current);
                current = '';
            } else if ('.!?,'.includes(char)) {
                if (current) tokens.push(current);
                tokens.push(char);
                current = '';
            } else if (char === "'") {
                if (current) tokens.push(current);
                current = char;
            } else {
                current += char;
                
                // Check for suffixes
                const remaining = text.substring(i);
                if (remaining.match(/^(ing|ed|ness)\b/)) {
                    const suffix = remaining.match(/^(ing|ed|ness)/)[1];
                    if (current.endsWith(suffix) && current.length > suffix.length) {
                        tokens.push(current.substring(0, current.length - suffix.length));
                        current = suffix;
                    }
                }
            }
        }
        
        if (current) tokens.push(current);
        
        return tokens;
    },
    
    // INFO STEPS (same as before, keeping them short)
    renderInfoStep1(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; padding: 40px;">
                <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                    
                    <h2 style="font-size: 28px; margin-bottom: 20px; color: var(--primary);">
                        🔢 Token IDs
                    </h2>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 40px;">
                        Each token gets converted to a unique number (ID)
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); 
                               border-radius: 16px; padding: 32px; margin-bottom: 32px; text-align: left;">
                        <div style="font-size: 15px; line-height: 1.8; color: var(--text-secondary);">
                            <p style="margin-bottom: 20px;">
                                Computers can't work with text directly. Each token is assigned a unique numerical ID from a vocabulary:
                            </p>
                            
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 12px; font-family: monospace; font-size: 14px;">
                                ${Game.state.tokens.slice(0, 10).map((token, idx) => 
                                    `<div style="margin-bottom: 8px;"><span style="color: var(--primary);">"${token}"</span> → <span style="color: #22c55e;">ID: ${idx + 1}</span></div>`
                                ).join('')}
                                ${Game.state.tokens.length > 10 ? '<div style="color: var(--text-secondary); font-style: italic;">...and more</div>' : ''}
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="phase1.nextStep()" 
                            style="padding: 16px 48px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   border: none; border-radius: 12px; color: white; font-size: 18px; font-weight: 600; 
                                   cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                        Next →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    renderInfoStep2(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; padding: 40px;">
                <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                    
                    <h2 style="font-size: 28px; margin-bottom: 20px; color: var(--primary);">
                        📍 Positional Encoding
                    </h2>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 40px;">
                        Token order matters! We add position information to each token.
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); 
                               border-radius: 16px; padding: 32px; margin-bottom: 32px; text-align: left;">
                        <div style="font-size: 15px; line-height: 1.8; color: var(--text-secondary);">
                            <p style="margin-bottom: 20px;">
                                "The cat" and "cat The" are different! Position encoding tells the model where each token appears in the sequence:
                            </p>
                            
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 12px; font-family: monospace; font-size: 14px;">
                                ${Game.state.tokens.slice(0, 8).map((token, idx) => 
                                    `<div style="margin-bottom: 8px;">
                                        <span style="color: var(--primary);">"${token}"</span> 
                                        <span style="color: var(--text-secondary);">at position</span> 
                                        <span style="color: #f59e0b;">${idx + 1}</span>
                                    </div>`
                                ).join('')}
                                ${Game.state.tokens.length > 8 ? '<div style="color: var(--text-secondary); font-style: italic;">...and more</div>' : ''}
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="phase1.nextStep()" 
                            style="padding: 16px 48px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   border: none; border-radius: 12px; color: white; font-size: 18px; font-weight: 600; 
                                   cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                        Next →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    renderRecap(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; padding: 40px;">
                <div style="max-width: 900px; margin: 0 auto;">
                    
                    <h2 style="font-size: 32px; margin-bottom: 20px; text-align: center; color: var(--primary);">
                        ✅ Tokenization Complete!
                    </h2>
                    <p style="font-size: 16px; color: var(--text-secondary); text-align: center; margin-bottom: 40px;">
                        You successfully broke down your training text into ${Game.state.tokens.length} tokens
                    </p>
                    
                    <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid rgba(0, 212, 255, 0.3); 
                               border-radius: 16px; padding: 32px; margin-bottom: 32px;">
                        <h3 style="font-size: 20px; color: var(--primary); margin-bottom: 20px;">Your tokens:</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 12px; max-height: 300px; overflow-y: auto; padding: 16px; 
                                   background: rgba(0, 0, 0, 0.3); border-radius: 12px;">
                            ${Game.state.tokens.map((token, idx) => 
                                `<span style="background: ${this.tokenColors[idx % this.tokenColors.length]}; 
                                               padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600;">${token}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div style="background: rgba(34, 197, 94, 0.1); border: 2px solid rgba(34, 197, 94, 0.3); 
                               border-radius: 16px; padding: 32px; margin-bottom: 40px;">
                        <h3 style="font-size: 20px; color: #22c55e; margin-bottom: 16px;">What you learned:</h3>
                        <div style="font-size: 15px; line-height: 1.8; color: var(--text-secondary);">
                            <p style="margin-bottom: 12px;">✓ Tokenization converts text into processable pieces</p>
                            <p style="margin-bottom: 12px;">✓ Each token gets a unique numerical ID</p>
                            <p style="margin-bottom: 12px;">✓ Position information is added to maintain order</p>
                            <p style="margin: 0;">✓ This is the foundation for all LLM processing!</p>
                        </div>
                    </div>
                    
                    <div style="background: rgba(139, 92, 246, 0.1); border: 2px solid rgba(139, 92, 246, 0.3); 
                               border-radius: 16px; padding: 32px; margin-bottom: 40px;">
                        <h3 style="font-size: 20px; color: #8b5cf6; margin-bottom: 16px;">What's next:</h3>
                        <div style="font-size: 15px; line-height: 1.8; color: var(--text-secondary);">
                            <p style="margin: 0;">
                                Now that we have tokens, we'll convert them into <strong style="color: #8b5cf6;">embeddings</strong> 
                                - mathematical vectors that capture meaning and relationships!
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="Game.nextPhase()" 
                                style="padding: 16px 48px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 18px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Continue to embeddings →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
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
