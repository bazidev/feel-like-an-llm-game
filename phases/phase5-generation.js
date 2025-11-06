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
                               border-radius: 12px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <span style="font-size: 18px;">⚡</span>
                            <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                Reality Check: You're rolling dice weighted by training data. No creativity - just probability!
                            </span>
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
        const trainingText = Game.state.trainingData || '';
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
                    
                    <!-- What's Next -->
                    <div style="padding: 20px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.08), rgba(0, 212, 255, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 32px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">🔜 Next: Your Journey Complete</h3>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">
                            You've completed the full LLM journey! See your complete achievement and understand what you built.
                        </p>
                    </div>
                    
                    <button class="btn-primary" onclick="phase5.completePhase()" style="width: 100%; font-size: 17px; padding: 14px;">
                        View Final Summary →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    completePhase() {
        Game.completePhase(200);
        Game.saveState();
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

