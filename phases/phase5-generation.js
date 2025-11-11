// Phase 5: Generation - USER GENERATES TEXT WITH THE MODEL
window.phase5 = {
    currentStep: 'concept1', // 'concept1' -> 'concept2' -> 'challenge' -> 'generate' -> 'recap' -> 'journey_checkpoint'
    generatedSequence: [],
    currentChallenge: 0,
    challengeCorrect: 0,
    challengeWrong: 0,
    
    // Quiz challenges to test understanding
    challenges: [
        {
            type: 'predict',
            question: 'Which word is MORE LIKELY after "chef" based on training?',
            context: 'chef',
            options: ['cooked', 'swimming', 'rocket'],
            correct: 0,
            explanation: 'The model learned "chef cooked" from training data. "Swimming" and "rocket" likely never followed "chef" in training!'
        },
        {
            type: 'probability',
            question: 'If "cooked" appears after "chef" 80% of the time, what is the model doing?',
            options: [
                'Understanding that chefs cook food',
                'Counting patterns from training data',
                'Thinking about cooking'
            ],
            correct: 1,
            explanation: 'The model is just following statistics! It saw this pattern 80% of the time in training, so it predicts it 80% of the time. No understanding required.'
        },
        {
            type: 'deadend',
            question: 'You pick "pasta" but there are no next words. Why?',
            options: [
                'The model ran out of memory',
                '"pasta" only appeared at sentence endings in training',
                'The model is broken'
            ],
            correct: 1,
            explanation: 'Dead ends happen when a word only appeared at the END of sentences in training! The model never learned what comes after it.'
        },
        {
            type: 'concept',
            question: 'When generating, does the model "plan" the full sentence?',
            options: [
                'Yes, it thinks ahead 5-10 words',
                'No, it picks one word at a time with zero planning',
                'Sometimes yes, sometimes no'
            ],
            correct: 1,
            explanation: 'LLMs generate ONE token at a time with NO ability to plan or revise! That\'s why they sometimes start sentences they can\'t finish logically.'
        }
    ],
    
    render(container) {
        // Safety check: if currentStep is invalid, reset to concept1
        const validSteps = ['concept1', 'concept2', 'challenge', 'generate', 'recap', 'journey_checkpoint'];
        if (!validSteps.includes(this.currentStep)) {
            console.warn(`⚠️ phase5: Invalid currentStep "${this.currentStep}", resetting to "concept1"`);
            this.currentStep = 'concept1';
        }
        
        if (this.currentStep === 'concept1') {
            this.renderConcept1(container);
        } else if (this.currentStep === 'concept2') {
            this.renderConcept2(container);
        } else if (this.currentStep === 'challenge') {
            this.renderChallenge(container);
        } else if (this.currentStep === 'generate') {
            this.renderGenerate(container);
        } else if (this.currentStep === 'recap') {
            this.renderRecap(container);
        } else if (this.currentStep === 'journey_checkpoint') {
            this.renderJourneyCheckpoint(container);
        }
    },
    
    renderConcept1(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ✨ Generation
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        Create new text by sampling from probabilities
                    </p>
                    
                    <!-- What is Generation -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🎲</span>
                            <h2 style="font-size: 18px; color: var(--primary); margin: 0;">What is Generation?</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">Pick a starting word.</strong> 
                                Your model looks up: "What words came after this in training?" Then picks one based on probability.
                            </p>
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">Repeat the process.</strong> 
                                Take that new word, look up what comes next, pick again. Build text word by word!
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: var(--primary);">No creativity happens.</strong> 
                                You're rolling dice weighted by training data. If "chef" was followed by "cooked" 80% of the time, you'll mostly pick "cooked".
                            </p>
                        </div>
                    </div>
                    
                    <!-- The Process -->
                    <div style="background: linear-gradient(135deg, rgba(191, 0, 255, 0.1), rgba(139, 92, 246, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🔄</span>
                            <h2 style="font-size: 18px; color: var(--secondary); margin: 0;">The Generation Loop</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--secondary);">Step 1:</strong> Look at current context (generated tokens so far)
                            </p>
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--secondary);">Step 2:</strong> Model predicts probability distribution over all possible next tokens
                            </p>
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--secondary);">Step 3:</strong> Sample one token from that distribution (weighted random choice)
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: var(--secondary);">Step 4:</strong> Add token to sequence, repeat from Step 1 until stopping condition
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phase5.nextStep()" 
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
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ✨ Generation
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        Token-by-token text creation from learned patterns
                    </p>
                    
                    <!-- Key Insight -->
                    <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05)); 
                               border: 2px solid rgba(251, 191, 36, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">💡</span>
                            <h2 style="font-size: 18px; color: #fbbf24; margin: 0;">Key Insight: One Token at a Time</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                <strong style="color: #fbbf24;">No planning ahead!</strong> 
                                LLMs generate ONE token at a time with NO ability to plan or revise future tokens.
                            </p>
                            <p style="margin-bottom: 10px;">
                                <strong style="color: #fbbf24;">That's why they sometimes start sentences they can't finish logically!</strong> 
                                The model commits to each word before knowing what comes next.
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: #fbbf24;">Everything is probability.</strong> 
                                If "chef" was followed by "cooked" 80% of the time in training, you'll pick "cooked" with 80% probability.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Reality Check: How Real LLMs Do It -->
                    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">⚡</span>
                            <h2 style="font-size: 18px; color: #ef4444; margin: 0;">Reality Check: How Real LLMs Generate</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <ul style="margin: 0; padding-left: 20px; list-style: none;">
                                <li style="margin-bottom: 8px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Sampling parameters control generation:</strong> Temperature (0-2) controls randomness - low = predictable, high = creative chaos
                                </li>
                                <li style="margin-bottom: 8px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Top-p (nucleus sampling):</strong> Only sample from top probable tokens whose cumulative probability reaches p (typically 0.9)
                                </li>
                                <li style="margin-bottom: 8px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Autoregressive generation:</strong> Each new token gets fed back into the model as context for the next prediction
                                </li>
                                <li style="margin: 0; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Massive parallelism:</strong> GPT-4 processes ALL previous tokens in parallel using attention, but generates new tokens one at a time
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phase5.startChallenges()" 
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Start Quiz →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    nextStep() {
        const steps = ['concept1', 'concept2'];
        const currentIndex = steps.indexOf(this.currentStep);
        if (currentIndex < steps.length - 1) {
            this.currentStep = steps[currentIndex + 1];
            const container = document.getElementById('phaseContainer');
            this.render(container);
            SoundManager.play('click');
        }
    },
    
    startChallenges() {
        this.currentStep = 'challenge';
        this.currentChallenge = 0;
        this.challengeCorrect = 0;
        this.challengeWrong = 0;
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderChallenge(container) {
        if (this.currentChallenge >= this.challenges.length) {
            // All challenges complete, move to generation
            this.startGenerating();
            return;
        }
        
        const challenge = this.challenges[this.currentChallenge];
        const progress = this.currentChallenge + 1;
        const total = this.challenges.length;
        
        // Shuffle options to randomize correct answer position
        const shuffledOptions = challenge.options.map((option, idx) => ({ option, originalIdx: idx }));
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Test Your Knowledge</h2>
                        <p class="phase-subtitle">Answer questions about generation</p>
                    </div>
                    
                    <div class="phase-description">
                        Answer questions to test your understanding of how generation works!
                    </div>
                    
                    <div class="hint-section">
                        <h4>📊 Your Score</h4>
                        <div style="display: flex; gap: 16px; margin-top: 8px;">
                            <div style="flex: 1;">
                                <div style="font-size: 24px; color: #22c55e; font-weight: 700;">${this.challengeCorrect}</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Correct</div>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-size: 24px; color: #ef4444; font-weight: 700;">${this.challengeWrong}</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Wrong</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px; margin-top: 16px;">
                        <p style="font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            💡 Think about what you learned: LLMs follow patterns, not meaning!
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Question -->
                        <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
                                Question ${progress}/${total}
                            </div>
                            <div style="font-size: 18px; color: white; line-height: 1.6; font-weight: 500;">
                                ${challenge.question}
                            </div>
                        </div>
                        
                        <!-- Options -->
                        <div id="challengeOptions" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                            ${shuffledOptions.map((item, idx) => `
                                <button onclick="phase5.checkAnswer(${item.originalIdx})"
                                        class="challenge-option"
                                        data-original-idx="${item.originalIdx}"
                                        style="padding: 18px 20px; background: rgba(255, 255, 255, 0.02); 
                                               border: 2px solid rgba(0, 212, 255, 0.2); border-radius: 12px; 
                                               cursor: pointer; transition: all 0.3s; text-align: left; 
                                               font-size: 15px; color: white; font-weight: 500;">
                                    <span style="display: inline-block; width: 30px; height: 30px; 
                                                 background: rgba(0, 212, 255, 0.2); border-radius: 50%; 
                                                 text-align: center; line-height: 30px; margin-right: 12px; 
                                                 font-family: 'JetBrains Mono', monospace;">
                                        ${String.fromCharCode(65 + idx)}
                                    </span>
                                    ${item.option}
                                </button>
                            `).join('')}
                        </div>
                        
                        <!-- Feedback area -->
                        <div id="challengeFeedback" style="display: none; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        </div>
                        
                        <button id="nextChallengeBtn" class="btn-primary" onclick="phase5.nextChallenge()" 
                                style="width: 100%; display: none;">
                            Next Question →
                        </button>
                        
                    </div>
                </div>
            </div>
            
            <style>
                .challenge-option:hover {
                    background: rgba(0, 212, 255, 0.1) !important;
                    border-color: rgba(0, 212, 255, 0.5) !important;
                    transform: translateX(4px);
                }
                
                .challenge-option:active {
                    transform: scale(0.98);
                }
                
                .challenge-option.correct {
                    background: rgba(34, 197, 94, 0.2) !important;
                    border-color: #22c55e !important;
                }
                
                .challenge-option.wrong {
                    background: rgba(239, 68, 68, 0.2) !important;
                    border-color: #ef4444 !important;
                }
                
                .challenge-option.disabled {
                    cursor: not-allowed !important;
                    opacity: 0.5;
                }
            </style>
        `;
    },
    
    checkAnswer(selectedIdx) {
        const challenge = this.challenges[this.currentChallenge];
        const isCorrect = selectedIdx === challenge.correct;
        
        // Update score
        if (isCorrect) {
            this.challengeCorrect++;
            Game.addScore(50);
            SoundManager.play('success');
        } else {
            this.challengeWrong++;
            SoundManager.play('error');
        }
        
        // Disable all buttons and highlight correct/wrong
        const options = document.querySelectorAll('.challenge-option');
        options.forEach((btn) => {
            btn.style.pointerEvents = 'none';
            
            const btnOriginalIdx = parseInt(btn.getAttribute('data-original-idx'));
            
            if (btnOriginalIdx === challenge.correct) {
                // Highlight correct answer in green (full opacity)
                btn.classList.add('correct');
            } else if (btnOriginalIdx === selectedIdx && !isCorrect) {
                // Highlight wrong answer in red (full opacity)
                btn.classList.add('wrong');
            } else {
                // Fade out other options
                btn.classList.add('disabled');
            }
        });
        
        // Show feedback
        const feedbackEl = document.getElementById('challengeFeedback');
        feedbackEl.style.display = 'block';
        feedbackEl.style.background = isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        feedbackEl.style.border = isCorrect ? '2px solid #22c55e' : '2px solid #ef4444';
        feedbackEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <span style="font-size: 32px;">${isCorrect ? '✓' : '✗'}</span>
                <div>
                    <div style="font-size: 18px; color: ${isCorrect ? '#22c55e' : '#ef4444'}; font-weight: 700; margin-bottom: 4px;">
                        ${isCorrect ? 'Correct!' : 'Not quite!'}
                    </div>
                    <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
                        ${challenge.explanation}
                    </div>
                </div>
            </div>
        `;
        
        // Show next button
        document.getElementById('nextChallengeBtn').style.display = 'block';
    },
    
    nextChallenge() {
        this.currentChallenge++;
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    startGenerating() {
        this.currentStep = 'generate';
        this.generatedSequence = [];
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderGenerate(container) {
        const model = Game.state.model.bigrams;
        const startWords = Object.keys(model).filter(w => w.length > 2);
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Generate Text</h2>
                        <p class="phase-subtitle">Build sentences from patterns</p>
                    </div>
                    
                    <div class="phase-description">
                        Pick a starting word, then let your model predict what comes next based on training probabilities.
                    </div>
                    
                    <!-- Quiz Results -->
                    <div style="padding: 16px; background: rgba(34, 197, 94, 0.1); border: 2px solid rgba(34, 197, 94, 0.3); 
                               border-radius: 10px; margin-bottom: 16px;">
                        <div style="font-size: 13px; color: #22c55e; font-weight: 700; margin-bottom: 8px;">
                            ✓ Quiz Complete!
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 20px; color: #22c55e; font-weight: 700;">${this.challengeCorrect}</div>
                                <div style="font-size: 10px; color: var(--text-secondary);">Correct</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 20px; color: #ef4444; font-weight: 700;">${this.challengeWrong}</div>
                                <div style="font-size: 10px; color: var(--text-secondary);">Wrong</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How It Works</h4>
                        <p>Each word shows possible next words with their probabilities. Click to add to your sequence. The model only knows what it learned from YOUR training data!</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Generated Sequence -->
                        <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px; min-height: 100px;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">✨ Your Generated Text:</div>
                            <div style="font-size: 18px; font-family: 'JetBrains Mono', monospace; color: white; line-height: 1.8;">
                                ${this.generatedSequence.length > 0 ? this.generatedSequence.join(' ') : '<span style="color: var(--text-secondary);">Pick a word to start...</span>'}
                            </div>
                        </div>
                        
                        <!-- Word Selection -->
                        <div id="wordSelection">
                            ${this.generatedSequence.length === 0 ? this.renderStartWords(startWords) : this.renderNextWords()}
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-top: 24px;">
                            <button class="btn-secondary" onclick="phase5.resetSequence()" style="flex: 1;">
                                ↺ Start Over
                            </button>
                            <button class="btn-primary" onclick="phase5.finishGenerating()" style="flex: 1;" ${this.generatedSequence.length < 5 ? 'disabled' : ''}>
                                ${this.generatedSequence.length < 5 ? `Need ${5 - this.generatedSequence.length} more words` : 'Finish Generation'}
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
    },
    
    renderStartWords(words) {
        return `
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">Choose a starting word:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${words.slice(0, 12).map(word => `
                        <button onclick="phase5.addWord('${word}')"
                                style="padding: 10px 16px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(191, 0, 255, 0.1)); 
                                       border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; cursor: pointer; 
                                       font-size: 14px; color: white; font-family: 'JetBrains Mono', monospace; transition: all 0.3s;">
                            ${word}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    renderNextWords() {
        const lastWord = this.generatedSequence[this.generatedSequence.length - 1];
        const model = Game.state.model.bigrams;
        let nextOptions = model[lastWord] || {};
        
        // Check if this word appears at end of sentences in training data
        const canEndSentence = this.checkIfCanEnd(lastWord);
        
        if (Object.keys(nextOptions).length === 0 && !canEndSentence) {
            return `
                <div style="padding: 20px; background: rgba(239, 68, 68, 0.08); border-radius: 10px; text-align: center;">
                    <div style="font-size: 15px; color: #ef4444; margin-bottom: 8px;">⚠️ Dead End!</div>
                    <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                        "<strong>${lastWord}</strong>" never appeared before another word in training.<br>
                        This word only appears at the <strong>end of sentences</strong> in your training data!<br><br>
                        💡 <strong>Tip:</strong>Next time, Choose words that appear in the middle of sentences.
                    </div>
                </div>
            `;
        }
        
        // Add punctuation options if word can end sentence
        if (canEndSentence) {
            nextOptions = { ...nextOptions, '.': 0.4, '!': 0.1, '?': 0.05 };
        }
        
        // Sort by probability and take top 6 options
        const sortedOptions = Object.entries(nextOptions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
        
        return `
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                    After "<strong style="color: var(--primary);">${lastWord}</strong>", model predicts:
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${sortedOptions.map(([word, prob]) => {
                        const isPunctuation = /^[.,!?]$/.test(word);
                        const displayWord = word === ' ' ? '␣ (space)' : word;
                        return `
                        <button onclick="phase5.addWord('${word}')"
                                style="padding: 12px 16px; background: ${isPunctuation ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0, 0, 0, 0.3)'}; 
                                       border: 1px solid ${isPunctuation ? 'rgba(168, 85, 247, 0.4)' : 'rgba(0, 212, 255, 0.2)'}; 
                                       border-radius: 8px; cursor: pointer; transition: all 0.3s; text-align: left; display: flex; 
                                       justify-content: space-between; align-items: center;">
                            <span style="font-size: 14px; color: white; font-family: 'JetBrains Mono', monospace;">
                                ${displayWord} ${isPunctuation ? '<span style="font-size: 11px; color: #a855f7;">(end sentence)</span>' : ''}
                            </span>
                            <span style="font-size: 13px; color: ${prob > 0.5 ? '#22c55e' : prob > 0.2 ? '#f59e0b' : '#6b7280'}; font-weight: 600;">
                                ${(prob * 100).toFixed(0)}% likely
                            </span>
                        </button>
                    `}).join('')}
                </div>
                <div style="margin-top: 12px; padding: 10px; background: rgba(0, 212, 255, 0.05); border-radius: 8px; font-size: 11px; color: var(--text-secondary);">
                    💡 <strong>Showing top</strong> most likely continuations based on your training data patterns
                </div>
            </div>
        `;
    },
    
    checkIfCanEnd(word) {
        // Check if this word appears before punctuation or at end of training sentences
        const trainingText = Game.state.trainingText || '';
        const pattern = new RegExp(word + '\\s*[.!?]', 'i');
        return pattern.test(trainingText);
    },
    
    addWord(word) {
        this.generatedSequence.push(word);
        Game.addScore(20);
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    resetSequence() {
        this.generatedSequence = [];
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    finishGenerating() {
        if (this.generatedSequence.length >= 5) {
            Game.state.generatedText = this.generatedSequence.join(' ');
            Game.addScore(250); // Mini-game completion bonus (fixed)
            SoundManager.play('levelUp');
            this.currentStep = 'recap';
            this.render(document.getElementById('phaseContainer'));
        }
    },
    
    renderRecap(container) {
        const generated = Game.state.generatedText;
        
        // Calculate training data size
        const trainingText = Game.state.trainingText || '';
        const sentenceCount = trainingText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        
        // Calculate quiz performance
        const quizTotal = this.challenges.length;
        const quizPercent = Math.round((this.challengeCorrect / quizTotal) * 100);
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; overflow-y: auto;">
                <div style="max-width: 750px; width: 100%;">
                    
                    <h1 style="font-size: 22px; text-align: center; margin-bottom: 8px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✓ Phase 5 Complete: Generation
                    </h1>
                    
                    <p style="font-size: 12px; color: var(--text-secondary); text-align: center; margin-bottom: 16px;">
                        You generated NEW text using your trained model!
                    </p>
                    
                    <!-- Quiz Performance -->
                    <div style="padding: 12px; background: linear-gradient(135deg, ${quizPercent >= 75 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(251, 191, 36, 0.15)'}, rgba(0, 0, 0, 0.1)); 
                               border: 2px solid ${quizPercent >= 75 ? '#22c55e' : '#fbbf24'}; border-radius: 10px; margin-bottom: 14px; text-align: center;">
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
                            🎯 Your Quiz Score
                        </div>
                        <div style="font-size: 25px; font-weight: 700; color: ${quizPercent >= 75 ? '#22c55e' : '#fbbf24'}; margin-bottom: 4px;">
                            ${quizPercent}%
                        </div>
                        <div style="font-size: 11px; color: var(--text-secondary);">
                            ${this.challengeCorrect} correct out of ${quizTotal} questions
                        </div>
                        <div style="margin-top: 6px; font-size: 11px; color: ${quizPercent >= 75 ? '#22c55e' : '#f59e0b'}; font-weight: 600;">
                            ${quizPercent >= 100 ? '🏆 Perfect Score!' : quizPercent >= 75 ? '✓ Great!' : '👍 Keep Learning!'}
                        </div>
                    </div>
                    
                    <!-- Generated Text -->
                    <div style="padding: 16px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 10px; margin-bottom: 14px;">
                        <div style="text-align: center; margin-bottom: 10px;">
                            <span style="font-size: 10px; color: var(--text-secondary);">✨ YOUR AI-GENERATED TEXT</span>
                        </div>
                        <div style="font-size: 15px; font-family: 'JetBrains Mono', monospace; color: white; text-align: center; line-height: 1.6;">
                            "${generated}"
                        </div>
                    </div>
                    
                    <!-- Limited Dataset Explanation -->
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); 
                               border-radius: 10px; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 16px;">⚠️</span>
                            <h3 style="font-size: 14px; color: #ef4444; margin: 0; font-weight: 700;">About Your Generated Text</h3>
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                            <p style="margin: 0 0 6px 0;">
                                Your text might seem odd or hit "dead ends" - this is <strong style="color: #ef4444;">expected with limited training data</strong>! 
                            </p>
                            <p style="margin: 0 0 6px 0;">
                                <strong style="color: #fbbf24;">Why:</strong> With only ${sentenceCount} training sentences, 
                                the model has seen very few word combinations. Real LLMs train on trillions of tokens!
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: #22c55e;">What's impressive:</strong> Despite the tiny dataset, your text still makes SOME sense! 
                                The statistical patterns guide it toward sensible output.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button id="continueToJourneyBtn"
                                style="padding: 10px 28px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 10px; color: white; font-size: 13px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Continue: View Progress →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Trigger the animation after a short delay
        const generatedLength = generated.split(/\s+/).filter(w => w.length > 0).length;
        setTimeout(() => {
            if (window.ScaleAnimations && window.ScaleAnimations.animateContextComparison) {
                ScaleAnimations.animateContextComparison(generatedLength);
            }
        }, 500);
        
        // Add event listener for continue button after rendering
        setTimeout(() => {
            const btn = document.getElementById('continueToJourneyBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    this.currentStep = 'journey_checkpoint';
                    this.render(document.getElementById('phaseContainer'));
                });
            }
        }, 0);
    },
    
    renderJourneyCheckpoint(container) {
        const generated = Game.state.generatedText || '';
        const wordCount = generated.split(/\s+/).filter(w => w.length > 0).length;
        
        const phaseData = {
            title: 'Generation',
            subtitle: `You generated ${wordCount} words of new text`,
            whereYouAre: 'You have a <strong>complete working LLM</strong>! From tokenization to embeddings, attention to training, and now generation - you built the full pipeline used by GPT, Claude, and all modern LLMs.',
            whatYouDid: `You generated "${generated}" by sampling from probability distributions. Each word was picked based on training patterns, not rules. The model learned "which words follow which" and used that to create new text!`,
            whatsNext: '<strong>Sampling Parameters:</strong> Learn about Temperature, Top-p, Repetition Penalty, and Presence Penalty. These knobs control HOW the model picks tokens - turning deterministic math into creative generation!',
            whyItMatters: 'Generation is where everything comes together! Tokenization broke text into pieces, embeddings captured patterns, attention found relationships, training learned probabilities - and now generation CREATES new text from all that knowledge. This is what makes LLMs "AI"!',
            buttonText: 'Continue to Sampling Parameters',
            onContinue: 'phase5.completePhaseAndAdvance()'
        };
        
        Game.renderJourneyCheckpoint(5, phaseData);
    },
    
    completePhaseAndAdvance() {
        // Mark phase 5 as complete
        if (!Game.state.phaseCompleted[5]) {
            Game.state.phaseCompleted[5] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase5_transition']) {
            Game.addScore(100); // Phase transition bonus
            Game.state.pointsAwarded['phase5_transition'] = true;
            Game.saveState();
        }
        
        // Advance to next phase
        SoundManager.play('success');
        Game.nextPhase();
    },
    
    completePhase() {
        // Mark phase complete with fixed transition bonus
        if (!Game.state.phaseCompleted[5]) {
            Game.state.phaseCompleted[5] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase5_transition']) {
            Game.addScore(100); // Phase transition bonus (fixed)
            Game.state.pointsAwarded['phase5_transition'] = true;
            Game.saveState();
        }
        
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

