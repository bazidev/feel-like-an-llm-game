// Phase 4: Training - BUILD BIGRAM MODEL (CRYSTAL CLEAR)
window.phase4 = {
    currentStep: 'intro', // 'intro' -> 'build' -> 'recap'
    bigramCounts: {},
    bigramProbs: {},
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'build') {
            this.renderBuild(container);
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
                        🏋️ Training: Build Your Model
                    </h1>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 32px;">
                        Learn patterns - which words follow which
                    </p>
                    
                    <!-- Explanation Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">📊</span>
                            <h3 style="font-size: 18px; color: var(--primary); margin: 0;">What is Training?</h3>
                        </div>
                        <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px;">
                            Training means <strong>counting patterns</strong> in your data. You'll build a <strong>bigram model</strong> - for each word, which words came next? How often?
                        </p>
                        <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--primary);">
                            Example: "chef" → "cooked" (appeared 1 time)<br>
                            "chef" → "loves" (appeared 1 time)<br>
                            → "chef" has 50% chance to be followed by each
                        </div>
                    </div>
                    
                    <!-- Process -->
                    <div style="padding: 20px; background: rgba(191, 0, 255, 0.08); border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">⚙️ The Process</h3>
                        <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.8; text-align: left;">
                            1. Count all word pairs in your training data<br>
                            2. Calculate probabilities (frequency ÷ total)<br>
                            3. Store as model - now you can predict next words!
                        </div>
                    </div>
                    
                    <!-- Reality Check -->
                    <div style="padding: 16px; background: rgba(239, 68, 68, 0.08); border: 2px solid rgba(239, 68, 68, 0.25); 
                               border-radius: 12px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <span style="font-size: 18px;">⚡</span>
                            <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                Reality Check: This is just counting! You're not "learning" meanings - just statistical patterns.
                            </span>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase4.startTraining()" 
                            style="font-size: 17px; padding: 14px 40px;">
                        🚀 Start Training
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    startTraining() {
        this.currentStep = 'build';
        this.buildBigramModel();
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    buildBigramModel() {
        const tokens = Game.state.tokens.filter(t => t.trim() && !/^[.,!?]$/.test(t));
        
        this.bigramCounts = {};
        this.bigramProbs = {};
        
        // Count bigrams
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            
            if (!this.bigramCounts[current]) {
                this.bigramCounts[current] = {};
            }
            
            this.bigramCounts[current][next] = (this.bigramCounts[current][next] || 0) + 1;
        }
        
        // Calculate probabilities
        Object.keys(this.bigramCounts).forEach(word => {
            const total = Object.values(this.bigramCounts[word]).reduce((sum, count) => sum + count, 0);
            this.bigramProbs[word] = {};
            
            Object.entries(this.bigramCounts[word]).forEach(([nextWord, count]) => {
                this.bigramProbs[word][nextWord] = count / total;
            });
        });
        
        // Store in game state
        Game.state.model = {
            bigrams: this.bigramProbs,
            counts: this.bigramCounts
        };
    },
    
    renderBuild(container) {
        const totalBigrams = Object.keys(this.bigramCounts).length;
        const sampleWord = Object.keys(this.bigramProbs)[0];
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Training Complete!</h2>
                        <p class="phase-subtitle">Your model is ready</p>
                    </div>
                    
                    <div class="phase-description">
                        Your bigram model learned ${totalBigrams} word patterns from your training data.
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 What You Built</h4>
                        <p>A statistical model that knows: given word X, what's likely to come next based on your training data.</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Model Stats -->
                        <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px; text-align: center;">
                            <div style="font-size: 48px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">${totalBigrams}</div>
                            <div style="font-size: 14px; color: var(--text-secondary);">Word patterns learned</div>
                        </div>
                        
                        <!-- Sample Pattern -->
                        ${sampleWord ? `
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">📊 Sample Pattern:</div>
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
                                <div style="color: var(--primary); margin-bottom: 12px;">After "<strong>${sampleWord}</strong>", you learned:</div>
                                ${Object.entries(this.bigramProbs[sampleWord]).map(([next, prob]) => `
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: var(--text-secondary);">
                                        <span>"${next}"</span>
                                        <span style="color: ${prob > 0.5 ? '#22c55e' : '#f59e0b'};">${(prob * 100).toFixed(0)}% chance</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <!-- The Math -->
                        <div style="padding: 20px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.08), rgba(0, 212, 255, 0.05)); 
                                   border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 24px;">
                            <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">🧮 The Math Behind It</h3>
                            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.8;">
                                For each word pair count:<br>
                                <code style="color: var(--primary);">Probability = Count ÷ Total Occurrences</code><br><br>
                                Example: "chef" appeared before 2 different words, each 1 time<br>
                                → Each has 1÷2 = 50% probability
                            </div>
                        </div>
                        
                        <button class="btn-primary" onclick="phase4.completeTraining()" style="width: 100%;">
                            View Training Summary
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
    },
    
    completeTraining() {
        Game.addScore(200);
        SoundManager.play('levelUp');
        this.currentStep = 'recap';
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderRecap(container) {
        const totalPatterns = Object.keys(Game.state.model.bigrams).length;
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 32px; text-align: center; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✓ Phase 4 Complete: Training
                    </h1>
                    
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 32px;">
                        You trained a bigram model with ${totalPatterns} word patterns
                    </p>
                    
                    <!-- Model Summary -->
                    <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 12px; margin-bottom: 24px;">
                        <div style="text-align: center; margin-bottom: 16px;">
                            <span style="font-size: 12px; color: var(--text-secondary);">🎯 YOUR TRAINED MODEL</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
                                <div style="font-size: 28px; color: var(--primary); font-weight: 700;">${totalPatterns}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Word Patterns</div>
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
                                <div style="font-size: 28px; color: var(--secondary); font-weight: 700;">${Game.state.tokens.length}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Training Tokens</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- What Happened -->
                    <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">📊 What Just Happened:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 1.8;">
                            <li>You counted every word pair in your training data</li>
                            <li>Calculated <strong>probabilities</strong> for what comes next</li>
                            <li>Built a <strong>statistical model</strong> - no understanding, just patterns</li>
                            <li>Your model is now ready to <strong>generate text</strong>!</li>
                        </ul>
                    </div>
                    
                    <!-- What's Next -->
                    <div style="padding: 20px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.08), rgba(0, 212, 255, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 32px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">🔜 Next: Text Generation</h3>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">
                            Now comes the magic! Use your trained model to <strong>generate NEW text</strong> - picking words based on probabilities you learned. Watch your AI create sentences!
                        </p>
                    </div>
                    
                    <button class="btn-primary" onclick="phase4.completePhase()" style="width: 100%; font-size: 17px; padding: 14px;">
                        Continue to Generation →
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

