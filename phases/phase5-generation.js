// Phase 5: Generation - USER GENERATES TEXT WITH THE MODEL
window.phase5 = {
    currentStep: 'intro', // 'intro' -> 'generate' -> 'recap'
    generatedSequence: [],
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
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
                    
                    <button class="btn-primary" onclick="phase5.startGenerating()" 
                            style="font-size: 17px; padding: 14px 40px;">
                        🚀 Start Generating
                    </button>
                    
                </div>
            </div>
        `;
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
            Game.addScore(200);
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
        Game.completePhase(200);
        Game.saveState();
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

