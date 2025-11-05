// Phase 5: Generation - Actually Generate Text from Trained Model!
window.phase5 = {
    currentToken: null,
    generatedTokens: [],
    maxTokens: 5,
    
    render(container) {
        // Check if model exists
        if (!Game.state.model || !Game.state.model.bigrams) {
            container.innerHTML = '<p>Error: No trained model found. Complete Phase 4 first.</p>';
            return;
        }
        
        // Get starting tokens (first few from training data)
        const startingTokens = Game.state.tokens.slice(0, 10).filter(t => t !== ' ');
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Generation: Creating New Text!</h2>
                        <p class="phase-subtitle">Your model in action</p>
                    </div>
                    
                    <div class="phase-description">
                        This is it! Your model can now generate text. Pick a starting token, and watch as it predicts the next token based on what it learned.
                    </div>
                    
                    <div class="hint-section">
                        <h4>How It Works</h4>
                        <p>The model looks at the current token and calculates probabilities for every possible next token. Higher probability = more likely (based on training data).</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> It's not "thinking" or "understanding". It's pure math: "cat" appeared after "The" 75% of the time in training, so it predicts "cat" with 75% probability.
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Training Data Reference -->
                        <div style="margin-bottom: 24px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                            <h4 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; text-align: center;">
                                📖 What the model learned from:
                            </h4>
                            <div style="font-size: 14px; line-height: 1.7; color: var(--text-secondary); text-align: center;">
                                "${Game.state.trainingText}"
                            </div>
                        </div>
                        
                        <!-- Generation Area -->
                        <div style="margin-bottom: 24px; padding: 24px; background: rgba(0, 212, 255, 0.05); 
                             border: 2px solid var(--primary); border-radius: 12px; min-height: 120px;">
                            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; text-align: center;">
                                ✨ Generated Text
                            </h4>
                            <div id="generatedText" style="font-size: 28px; font-weight: 700; color: white; 
                                 text-align: center; font-family: 'JetBrains Mono', monospace; min-height: 60px; 
                                 display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px;">
                                <span style="color: var(--text-secondary);">Pick a starting token below...</span>
                            </div>
                        </div>
                        
                        <!-- Token Picker -->
                        <div id="tokenPicker" style="margin-bottom: 24px;">
                            <h4 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                                🎯 Choose Starting Token:
                            </h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                                ${startingTokens.map(token => `
                                    <button class="token-btn" onclick="phase5.startGeneration('${token}')" 
                                            style="padding: 10px 20px; background: rgba(255,255,255,0.05); 
                                            border: 2px solid rgba(255,255,255,0.2); border-radius: 8px; 
                                            color: white; cursor: pointer; font-family: 'JetBrains Mono', monospace; 
                                            font-weight: 600; font-size: 16px; transition: all 0.3s;">
                                        ${token}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Prediction Display -->
                        <div id="predictionArea" style="display: none; margin-bottom: 24px; padding: 20px; 
                             background: rgba(255, 0, 255, 0.05); border: 2px solid var(--secondary); border-radius: 10px;">
                            <h4 style="font-size: 14px; color: var(--secondary); margin-bottom: 16px; text-align: center;">
                                🎲 Next Token Predictions
                            </h4>
                            <div id="predictions" style="display: flex; flex-direction: column; gap: 8px;">
                            </div>
                        </div>
                        
                        <!-- Controls -->
                        <div id="controls" style="display: none; text-align: center; margin-bottom: 24px;">
                            <button class="btn-secondary" onclick="phase5.reset()" style="padding: 12px 32px;">
                                🔄 Start Over
                            </button>
                        </div>
                        
                        <!-- Complete Button -->
                        <div id="completeContainer" style="display: none; text-align: center;">
                            <button class="btn-primary" onclick="phase5.completeGeneration()" style="padding: 14px 40px; font-size: 17px;">
                                Complete Journey! →
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.addGenerationStyles();
    },
    
    addGenerationStyles() {
        if (!document.getElementById('generation-css')) {
            const style = document.createElement('style');
            style.id = 'generation-css';
            style.textContent = `
                .token-btn:hover {
                    background: rgba(0, 212, 255, 0.2) !important;
                    border-color: var(--primary) !important;
                    transform: translateY(-2px);
                }
                
                .prediction-option {
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .prediction-option:hover {
                    background: rgba(255, 0, 255, 0.15);
                    border-color: var(--secondary);
                    transform: translateX(4px);
                }
                
                .prediction-token {
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 700;
                    font-size: 18px;
                    color: white;
                }
                
                .prediction-prob {
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 600;
                    font-size: 14px;
                    color: var(--secondary);
                }
                
                .probability-bar {
                    height: 6px;
                    background: linear-gradient(90deg, var(--secondary), transparent);
                    border-radius: 3px;
                    margin-top: 6px;
                    transition: width 0.5s ease;
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    startGeneration(startToken) {
        this.generatedTokens = [startToken];
        this.currentToken = startToken;
        
        this.updateDisplay();
        this.showPredictions();
        
        // Hide token picker, show controls
        document.getElementById('tokenPicker').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
        
        SoundManager.play('success');
    },
    
    updateDisplay() {
        const display = document.getElementById('generatedText');
        display.innerHTML = this.generatedTokens.map((token, i) => `
            <span style="color: ${i === this.generatedTokens.length - 1 ? 'var(--primary)' : 'white'}; 
                         margin: 0 4px; animation: fadeIn 0.3s ease;">
                ${token}
            </span>
        `).join('');
    },
    
    showPredictions() {
        const model = Game.state.model;
        const predictions = model.bigrams[this.currentToken];
        
        if (!predictions || Object.keys(predictions).length === 0) {
            // No predictions available - end generation
            document.getElementById('predictionArea').style.display = 'none';
            document.getElementById('completeContainer').style.display = 'block';
            return;
        }
        
        // Sort by probability
        const sorted = Object.entries(predictions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5 predictions
        
        const predictionsHTML = sorted.map(([token, prob]) => `
            <div class="prediction-option" onclick="phase5.selectToken('${token.replace(/'/g, "\\'")}')">
                <span class="prediction-token">${token}</span>
                <span class="prediction-prob">${(prob * 100).toFixed(1)}%</span>
                <div class="probability-bar" style="width: ${prob * 100}%;"></div>
            </div>
        `).join('');
        
        document.getElementById('predictions').innerHTML = predictionsHTML;
        document.getElementById('predictionArea').style.display = 'block';
        
        // Animate
        if (typeof gsap !== 'undefined') {
            gsap.from('.prediction-option', {
                opacity: 0,
                x: -20,
                duration: 0.4,
                stagger: 0.08,
                ease: 'back.out(1.2)'
            });
        }
    },
    
    selectToken(token) {
        this.generatedTokens.push(token);
        this.currentToken = token;
        
        this.updateDisplay();
        SoundManager.play('click');
        
        // Check if we've generated enough
        if (this.generatedTokens.length >= this.maxTokens) {
            document.getElementById('predictionArea').style.display = 'none';
            document.getElementById('completeContainer').style.display = 'block';
        } else {
            this.showPredictions();
        }
    },
    
    reset() {
        this.generatedTokens = [];
        this.currentToken = null;
        
        document.getElementById('tokenPicker').style.display = 'block';
        document.getElementById('predictionArea').style.display = 'none';
        document.getElementById('controls').style.display = 'none';
        document.getElementById('completeContainer').style.display = 'none';
        
        const display = document.getElementById('generatedText');
        display.innerHTML = '<span style="color: var(--text-secondary);">Pick a starting token below...</span>';
        
        SoundManager.play('click');
    },
    
    completeGeneration() {
        SoundManager.play('levelUp');
        Game.addScore(250);
        
        const generatedText = this.generatedTokens.join(' ');
        console.log('✅ Generated text:', generatedText);
        
        Game.completePhase(250, `Generated "${generatedText}" from your trained model!`);
    }
};

