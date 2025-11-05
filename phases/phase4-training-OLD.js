// Phase 4: Training - Build Actual Model from Data
window.phase4 = {
    trainingProgress: 0,
    model: null,
    
    render(container) {
        // Check prerequisites
        if (!Game.state.tokens || !Game.state.embeddings) {
            container.innerHTML = '<p>Error: Missing data from previous phases.</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Training: Building Your Model</h2>
                        <p class="phase-subtitle">Learning patterns from YOUR data</p>
                    </div>
                    
                    <div class="phase-description">
                        Watch as we build a simple language model from your training text. We'll create a bigram model that learns which tokens follow which.
                    </div>
                    
                    <div class="hint-section">
                        <h4>What's Happening</h4>
                        <p>• Analyzing token sequences<br>
                        • Counting co-occurrences<br>
                        • Building probability table<br>
                        • Creating prediction model</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> This is a TINY model. Real LLMs have billions of parameters trained on terabytes of text. But the principle is the same!
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Training Data Overview -->
                        <div style="margin-bottom: 24px; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px;">
                            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                                📖 Training Data
                            </h4>
                            <div style="font-size: 15px; line-height: 1.8; color: white; text-align: center;">
                                "${Game.state.trainingText}"
                            </div>
                        </div>
                        
                        <!-- Training Progress -->
                        <div style="margin-bottom: 24px;">
                            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                                ⚙️ Training Progress
                            </h4>
                            <div style="width: 100%; background: rgba(255,255,255,0.05); height: 30px; border-radius: 15px; overflow: hidden; border: 2px solid rgba(0, 212, 255, 0.2);">
                                <div id="progressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); 
                                     transition: width 0.3s ease; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">
                                    <span id="progressText">0%</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Training Steps -->
                        <div id="trainingSteps" style="margin-bottom: 24px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div class="training-step" data-step="1">
                                <div class="step-icon">⏳</div>
                                <div class="step-label">Analyzing sequences</div>
                            </div>
                            <div class="training-step" data-step="2">
                                <div class="step-icon">⏳</div>
                                <div class="step-label">Counting patterns</div>
                            </div>
                            <div class="training-step" data-step="3">
                                <div class="step-icon">⏳</div>
                                <div class="step-label">Building model</div>
                            </div>
                            <div class="training-step" data-step="4">
                                <div class="step-icon">⏳</div>
                                <div class="step-label">Ready to generate!</div>
                            </div>
                        </div>
                        
                        <!-- Start Button -->
                        <div style="text-align: center;" id="startContainer">
                            <button class="btn-primary" onclick="phase4.startTraining()" style="padding: 16px 48px; font-size: 18px;">
                                🚀 Start Training
                            </button>
                        </div>
                        
                        <!-- Model Stats (hidden initially) -->
                        <div id="modelStats" style="display: none; margin-bottom: 24px; padding: 20px; background: rgba(34, 197, 94, 0.1); 
                             border: 2px solid rgba(34, 197, 94, 0.3); border-radius: 12px;">
                            <h4 style="font-size: 16px; color: #22c55e; margin-bottom: 16px; text-align: center;">
                                ✅ Model Built Successfully!
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                                <div>
                                    <div id="bigramCount" style="font-size: 28px; font-weight: 800; color: var(--primary);">-</div>
                                    <div style="font-size: 11px; color: var(--text-secondary);">Bigrams Learned</div>
                                </div>
                                <div>
                                    <div id="vocabSize" style="font-size: 28px; font-weight: 800; color: var(--secondary);">-</div>
                                    <div style="font-size: 11px; color: var(--text-secondary);">Vocabulary Size</div>
                                </div>
                                <div>
                                    <div id="paramCount" style="font-size: 28px; font-weight: 800; color: var(--success);">-</div>
                                    <div style="font-size: 11px; color: var(--text-secondary);">Parameters</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Continue Button (hidden initially) -->
                        <div id="continueContainer" style="display: none; text-align: center;">
                            <button class="btn-primary" onclick="phase4.completeTraining()" style="padding: 14px 40px; font-size: 17px;">
                                Continue to Generation →
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.addTrainingStyles();
    },
    
    addTrainingStyles() {
        if (!document.getElementById('training-css')) {
            const style = document.createElement('style');
            style.id = 'training-css';
            style.textContent = `
                .training-step {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    text-align: center;
                    transition: all 0.3s ease;
                }
                
                .training-step.active {
                    background: rgba(0, 212, 255, 0.1);
                    border-color: var(--primary);
                }
                
                .training-step.complete {
                    background: rgba(34, 197, 94, 0.1);
                    border-color: #22c55e;
                }
                
                .training-step .step-icon {
                    font-size: 32px;
                    margin-bottom: 8px;
                }
                
                .training-step.active .step-icon {
                    animation: pulse 1s ease-in-out infinite;
                }
                
                .training-step .step-label {
                    font-size: 13px;
                    color: var(--text-secondary);
                    font-weight: 600;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    async startTraining() {
        // Hide start button
        document.getElementById('startContainer').style.display = 'none';
        
        // Build bigram model from tokens
        this.trainingProgress = 0;
        await this.animateStep(1, 'Analyzing sequences', 1000);
        await this.animateStep(2, 'Counting patterns', 1500);
        
        this.model = this.buildBigramModel(Game.state.tokens);
        
        await this.animateStep(3, 'Building model', 1000);
        await this.animateStep(4, 'Ready to generate!', 800);
        
        // Store model
        Game.state.model = this.model;
        Game.saveState();
        
        console.log('✅ Model trained:', this.model);
        
        // Show stats
        this.showModelStats();
    },
    
    async animateStep(step, label, duration) {
        return new Promise(resolve => {
            // Mark step as active
            const stepEl = document.querySelector(`[data-step="${step}"]`);
            if (stepEl) {
                stepEl.classList.add('active');
            }
            
            // Update progress
            const progress = (step / 4) * 100;
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            if (progressBar && progressText) {
                progressBar.style.width = progress + '%';
                progressText.textContent = Math.round(progress) + '%';
            }
            
            setTimeout(() => {
                // Mark as complete
                if (stepEl) {
                    stepEl.classList.remove('active');
                    stepEl.classList.add('complete');
                    stepEl.querySelector('.step-icon').textContent = '✅';
                }
                SoundManager.play('success');
                resolve();
            }, duration);
        });
    },
    
    buildBigramModel(tokens) {
        // Create bigram probability model
        // bigrams[token1][token2] = count of "token1 token2" sequences
        
        const bigrams = {};
        const counts = {};
        
        // Count bigrams
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            
            if (!bigrams[current]) {
                bigrams[current] = {};
                counts[current] = 0;
            }
            
            if (!bigrams[current][next]) {
                bigrams[current][next] = 0;
            }
            
            bigrams[current][next]++;
            counts[current]++;
        }
        
        // Convert to probabilities
        const probabilities = {};
        for (const current in bigrams) {
            probabilities[current] = {};
            for (const next in bigrams[current]) {
                probabilities[current][next] = bigrams[current][next] / counts[current];
            }
        }
        
        return {
            bigrams: probabilities,
            vocabulary: [...new Set(tokens)],
            tokenCount: tokens.length
        };
    },
    
    showModelStats() {
        const bigramCount = Object.keys(this.model.bigrams).reduce((sum, key) => 
            sum + Object.keys(this.model.bigrams[key]).length, 0
        );
        
        document.getElementById('bigramCount').textContent = bigramCount;
        document.getElementById('vocabSize').textContent = this.model.vocabulary.length;
        document.getElementById('paramCount').textContent = bigramCount;
        
        document.getElementById('modelStats').style.display = 'block';
        document.getElementById('continueContainer').style.display = 'block';
        
        // Animate stats
        if (typeof gsap !== 'undefined') {
            gsap.from('#modelStats', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'back.out(1.5)'
            });
        }
    },
    
    completeTraining() {
        SoundManager.play('levelUp');
        Game.addScore(200);
        
        Game.completePhase(200, `Trained model with ${this.model.vocabulary.length} tokens!`);
    }
};

