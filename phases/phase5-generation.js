// Phase 5: Generation - USER GENERATES TEXT WITH THE MODEL
window.phase5 = {
    currentStep: 'intro', // 'intro' -> 'challenge' -> 'generate' -> 'recap'
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
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'challenge') {
            this.renderChallenge(container);
        } else if (this.currentStep === 'generate') {
            this.renderGenerate(container);
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
                        ✨ Generation: Create New Text!
                    </h1>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 32px;">
                        Use your trained model to generate text
                    </p>
                    
                    <!-- Explanation Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">✍️</span>
                            <h3 style="font-size: 18px; color: var(--primary); margin: 0;">How Generation Works</h3>
                        </div>
                        <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px;">
                            Pick a starting word. Your model looks up: "What words came after this in training?" Then picks one based on <strong>probability</strong>. Repeat! You're not "thinking" - you're sampling from statistics.
                        </p>
                        <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--primary);">
                            Start: "chef" → Model says: 50% "cooked", 50% "loves"<br>
                            Pick "cooked" → repeat with "cooked"<br>
                            Build sentence word by word!
                        </div>
                    </div>
                    
                    <!-- Reality Check -->
                    <div style="padding: 16px; background: rgba(239, 68, 68, 0.08); border: 2px solid rgba(239, 68, 68, 0.25); 
                               border-radius: 12px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <span style="font-size: 18px;">⚡</span>
                            <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                Reality Check: You're rolling dice weighted by training data. No creativity - just probability!
                            </span>
                        </div>
                    </div>
                    
                    <!-- Real LLM Concept -->
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05)); 
                               border: 2px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 32px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">🧠</span>
                            <h3 style="font-size: 15px; color: #a855f7; margin: 0;">Real LLM Concept: Sampling & Temperature</h3>
                        </div>
                        <div style="font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                This game always picks from probabilities. Real LLMs have <strong style="color: #a855f7;">parameters to control creativity</strong>:
                            </p>
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                                <div style="font-size: 11px; line-height: 1.8;">
                                    • <strong style="color: #fbbf24;">Temperature (0-2):</strong> Controls randomness. Low = predictable, High = creative/chaotic<br>
                                    • <strong style="color: #fbbf24;">Top-K sampling:</strong> Only consider the top K most likely tokens<br>
                                    • <strong style="color: #fbbf24;">Top-P (nucleus) sampling:</strong> Consider tokens until cumulative probability reaches P<br>
                                    • <strong style="color: #fbbf24;">Beam search:</strong> Explore multiple generation paths simultaneously
                                </div>
                            </div>
                            <p style="margin: 0; padding: 10px; background: rgba(251, 191, 36, 0.1); border-radius: 8px; border-left: 3px solid #fbbf24;">
                                💡 <strong>Key Insight:</strong> LLMs don't "plan" sentences! They generate one token at a time, with NO ability to revise. 
                                That's why they sometimes start sentences they can't finish logically. It's pure statistical prediction!
                            </p>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase5.startChallenges()" 
                            style="font-size: 17px; padding: 14px 40px;">
                        🎮 Test Your Understanding
                    </button>
                    
                </div>
            </div>
        `;
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
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Test Your Knowledge</h2>
                        <p class="phase-subtitle">Challenge ${progress} of ${total}</p>
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
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
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
                            ${challenge.options.map((option, idx) => `
                                <button onclick="phase5.checkAnswer(${idx})"
                                        class="challenge-option"
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
                                    ${option}
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
                    background: rgba(34, 197, 94, 0.15) !important;
                    border-color: #22c55e !important;
                }
                
                .challenge-option.wrong {
                    background: rgba(239, 68, 68, 0.15) !important;
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
        options.forEach((btn, idx) => {
            btn.classList.add('disabled');
            btn.style.pointerEvents = 'none';
            
            if (idx === challenge.correct) {
                btn.classList.add('correct');
            } else if (idx === selectedIdx && !isCorrect) {
                btn.classList.add('wrong');
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
                        💡 <strong>Tip:</strong> Choose words that appear in the middle of sentences.
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
                    💡 <strong>Showing top 6</strong> most likely continuations based on your training data patterns
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
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 32px; text-align: center; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✓ Phase 5 Complete: Generation
                    </h1>
                    
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 32px;">
                        You generated NEW text using your trained model!
                    </p>
                    
                    <!-- Quiz Performance -->
                    <div style="padding: 20px; background: linear-gradient(135deg, ${quizPercent >= 75 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(251, 191, 36, 0.15)'}, rgba(0, 0, 0, 0.1)); 
                               border: 2px solid ${quizPercent >= 75 ? '#22c55e' : '#fbbf24'}; border-radius: 12px; margin-bottom: 24px; text-align: center;">
                        <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">
                            🎯 Your Quiz Score
                        </div>
                        <div style="font-size: 48px; font-weight: 700; color: ${quizPercent >= 75 ? '#22c55e' : '#fbbf24'}; margin-bottom: 8px;">
                            ${quizPercent}%
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary);">
                            ${this.challengeCorrect} correct out of ${quizTotal} questions
                        </div>
                        <div style="margin-top: 12px; font-size: 13px; color: ${quizPercent >= 75 ? '#22c55e' : '#f59e0b'}; font-weight: 600;">
                            ${quizPercent >= 100 ? '🏆 Perfect Score!' : quizPercent >= 75 ? '✓ Great Understanding!' : '👍 Keep Learning!'}
                        </div>
                    </div>
                    
                    <!-- Generated Text -->
                    <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 12px; margin-bottom: 24px;">
                        <div style="text-align: center; margin-bottom: 16px;">
                            <span style="font-size: 12px; color: var(--text-secondary);">✨ YOUR AI-GENERATED TEXT</span>
                        </div>
                        <div style="font-size: 20px; font-family: 'JetBrains Mono', monospace; color: white; text-align: center; line-height: 1.8;">
                            "${generated}"
                        </div>
                    </div>
                    
                    <!-- What Happened -->
                    <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">📊 What Just Happened:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 1.8;">
                            <li>You picked words based on <strong>learned probabilities</strong></li>
                            <li>Each choice came from <strong>your training data</strong></li>
                            <li>The model doesn't "know" what words mean - just which followed which</li>
                            <li>You created <strong>new text</strong> from statistical patterns!</li>
                        </ul>
                    </div>
                    
                    <!-- Limited Dataset Explanation -->
                    <div style="padding: 16px; background: rgba(239, 68, 68, 0.08); border: 2px solid rgba(239, 68, 68, 0.25); 
                               border-radius: 12px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">⚠️</span>
                            <h3 style="font-size: 15px; color: #ef4444; margin: 0; font-weight: 700;">About Your Generated Text</h3>
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">
                            <p style="margin: 0 0 10px 0;">
                                Your generated text might seem odd or hit "dead ends" - this is <strong style="color: #ef4444;">expected with limited training data</strong>! 
                            </p>
                            <p style="margin: 0 0 10px 0;">
                                <strong style="color: #fbbf24;">Why it happens:</strong> With only ${sentenceCount} training sentences, 
                                the model has seen very few word combinations. Real LLMs train on trillions of tokens!
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: #22c55e;">What's impressive:</strong> Despite the tiny dataset, your text still makes SOME sense! 
                                The words are real, the grammar often works, and it follows patterns from training. 
                                It won't generate completely random gibberish - the statistical patterns still guide it toward sensible output.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Journey Checkpoint -->
                    <div style="padding: 24px; background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.08)); 
                               border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 14px; margin-bottom: 32px;">
                        <div style="text-align: center; margin-bottom: 16px;">
                            <span style="font-size: 32px;">🏁</span>
                            <h3 style="font-size: 18px; color: #fbbf24; margin: 8px 0 0 0; font-weight: 700;">Final Checkpoint</h3>
                        </div>
                        
                        <div style="display: grid; gap: 14px;">
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid #22c55e; border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: #22c55e; margin-bottom: 6px;">🎉 What You Accomplished</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    You built a <strong>complete working LLM</strong> from scratch! Tokenization → Embeddings → Attention → Training → Generation. 
                                    That's the full pipeline used by GPT, Claude, and every modern LLM!
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid var(--primary); border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: var(--primary); margin-bottom: 6px;">✅ What You Created</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    Your AI generated "${generated}" using only statistical patterns. 
                                    No hard-coded rules, no human intervention after training - pure learned probabilities in action!
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid var(--secondary); border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: var(--secondary); margin-bottom: 6px;">🔬 What's Next</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    Learn about <strong>Sampling Parameters</strong>: Temperature, Top-p, Repetition Penalty, and Presence Penalty. 
                                    These control HOW the model picks tokens to generate more creative or focused output!
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid #fbbf24; border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: #fbbf24; margin-bottom: 6px;">💡 The Big Picture</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    You now understand how LLMs really work! They're not magic - just massive scale versions of what you built. 
                                    More data, more parameters, more compute, but the same fundamental process: pattern recognition through mathematics.
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ANIMATED SCALE COMPARISON -->
                    <div style="margin: 40px 0; padding: 32px; background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(20, 184, 166, 0.05)); 
                               border: 3px solid rgba(34, 197, 94, 0.3); border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h3 style="font-size: 22px; color: #22c55e; margin-bottom: 10px; font-weight: 700;">
                                📖 Context Window: Your Sequence vs. Real LLMs
                            </h3>
                            <p style="font-size: 14px; color: var(--text-secondary);">
                                See how much text production models can process at once
                            </p>
                        </div>
                        <div id="contextScaleAnimation" style="min-height: 600px;"></div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase5.completePhase()" style="width: 100%; font-size: 17px; padding: 14px;">
                        Continue to Sampling Parameters →
                    </button>
                    
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
    },
    
    completePhase() {
        // Mark phase complete with fixed transition bonus
        if (!Game.state.phaseCompleted[5]) {
            Game.state.phaseCompleted[5] = true;
            Game.addScore(100); // Phase transition bonus (fixed)
        }
        Game.saveState();
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

