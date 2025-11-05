// Phase 4: Prediction & Generation - Making Choices
window.phase4 = {
    currentRound: 0,
    score: 0,
    temperature: 0.7,
    
    scenarios: [
        {
            context: "The weather today is very",
            options: [
                { word: "sunny", probability: 0.45, appropriate: true },
                { word: "cloudy", probability: 0.25, appropriate: true },
                { word: "rainy", probability: 0.15, appropriate: true },
                { word: "purple", probability: 0.05, appropriate: false },
                { word: "delicious", probability: 0.03, appropriate: false }
            ],
            explanation: "Weather-related words have higher probability. Non-weather words are unlikely."
        },
        {
            context: "She opened the door and walked into the",
            options: [
                { word: "room", probability: 0.50, appropriate: true },
                { word: "house", probability: 0.20, appropriate: true },
                { word: "building", probability: 0.15, appropriate: true },
                { word: "ocean", probability: 0.08, appropriate: false },
                { word: "yesterday", probability: 0.02, appropriate: false }
            ],
            explanation: "Physical locations you can walk into have high probability."
        },
        {
            context: "The cat climbed up the",
            options: [
                { word: "tree", probability: 0.55, appropriate: true },
                { word: "wall", probability: 0.18, appropriate: true },
                { word: "stairs", probability: 0.12, appropriate: true },
                { word: "sky", probability: 0.07, appropriate: false },
                { word: "number", probability: 0.03, appropriate: false }
            ],
            explanation: "Things cats can physically climb have higher probabilities."
        }
    ],
    
    render(container) {
        this.currentRound = 0;
        this.score = 0;
        this.temperature = 0.7;
        
        container.innerHTML = `
            <div class="phase">
                <!-- Left Sidebar -->
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Prediction: Making Choices</h2>
                        <p class="phase-subtitle">Calculate probabilities for next tokens</p>
                    </div>
                    
                    <div class="phase-description">
                        You calculate probability scores for every possible next token. Higher score = more likely. Temperature controls randomness.
                    </div>
                    
                    <div class="hint-section">
                        <h4>How It Works</h4>
                        <p><strong>Temperature = 0:</strong> Always pick highest probability (boring, safe)<br>
                        <strong>Temperature = 1:</strong> More random sampling (creative, risky)<br>
                        You're not "thinking" - just doing math on probability distributions.</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> You don't "know" what makes sense. You learned statistical patterns from training data. "The cat climbed the tree" has high probability because that pattern appeared often in training.
                        </p>
                    </div>
                </div>
                
                <!-- Right Content Area -->
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        <div style="margin-bottom: 16px; text-align: center;">
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
                                Round <span id="roundCounter">1</span> / ${this.scenarios.length}
                            </p>
                        </div>
                        
                        <div style="padding: 16px; background: rgba(0, 212, 255, 0.08); border-radius: 10px; margin-bottom: 20px; text-align: center;">
                            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 8px;">Context:</div>
                            <div id="contextDisplay" style="font-size: 20px; font-weight: 600; color: white; font-family: 'JetBrains Mono', monospace;"></div>
                            <span id="cursor" class="pulse" style="font-size: 20px; color: var(--primary);">▌</span>
                        </div>
                        
                        <div style="margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <label style="color: var(--text-secondary); font-weight: 600; font-size: 13px;">
                                    🌡️ Temperature: <span id="tempValue" class="glow-text">0.7</span>
                                </label>
                                <span style="font-size: 11px; color: var(--text-secondary);">
                                    Low = Safe | High = Creative
                                </span>
                            </div>
                            <input 
                                type="range" 
                                id="temperatureSlider" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value="0.7"
                                style="width: 100%; height: 6px; background: linear-gradient(90deg, var(--primary), var(--error)); 
                                       border-radius: 3px; cursor: pointer;"
                                oninput="phase4.updateTemperature(this.value)"
                            />
                        </div>
                        
                        <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto;">
                        </div>
                        
                        <div id="feedback" style="margin-top: 16px; text-align: center; min-height: 40px;"></div>
                        <div id="explanation" style="margin-top: 12px; padding: 12px; background: rgba(255,255,255,0.03); 
                             border-radius: 8px; display: none; font-size: 13px;">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.displayScenario();
    },
    
    displayScenario() {
        const scenario = this.scenarios[this.currentRound];
        document.getElementById('contextDisplay').textContent = scenario.context;
        document.getElementById('roundCounter').textContent = 
            `${this.currentRound + 1} / ${this.scenarios.length}`;
        document.getElementById('feedback').innerHTML = '';
        document.getElementById('explanation').style.display = 'none';
        
        this.renderOptions();
    },
    
    renderOptions() {
        const scenario = this.scenarios[this.currentRound];
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        // Apply temperature to probabilities (simplified)
        const adjustedOptions = scenario.options.map(opt => {
            const adjusted = Math.pow(opt.probability, 1 / this.temperature);
            return { ...opt, displayProb: adjusted };
        });
        
        // Normalize
        const sum = adjustedOptions.reduce((acc, opt) => acc + opt.displayProb, 0);
        adjustedOptions.forEach(opt => {
            opt.displayProb = opt.displayProb / sum;
        });
        
        // Sort by probability
        adjustedOptions.sort((a, b) => b.displayProb - a.displayProb);
        
        adjustedOptions.forEach(option => {
            const percentage = (option.displayProb * 100).toFixed(1);
            const optionEl = document.createElement('div');
            optionEl.className = 'prediction-option';
            optionEl.style.cssText = `
                padding: 15px 20px;
                background: rgba(255,255,255,0.05);
                border: 2px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            `;
            
            optionEl.innerHTML = `
                <div style="position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 18px; font-weight: 600;">${option.word}</span>
                    <span style="font-family: 'JetBrains Mono', monospace; color: var(--primary);">${percentage}%</span>
                </div>
                <div style="position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, rgba(0,212,255,0.2), transparent); 
                     width: ${percentage}%; z-index: 1; transition: width 0.5s ease;"></div>
            `;
            
            optionEl.addEventListener('mouseenter', () => {
                optionEl.style.borderColor = 'var(--primary)';
                optionEl.style.transform = 'translateX(5px)';
            });
            
            optionEl.addEventListener('mouseleave', () => {
                optionEl.style.borderColor = 'rgba(255,255,255,0.1)';
                optionEl.style.transform = 'translateX(0)';
            });
            
            optionEl.addEventListener('click', () => this.selectOption(option));
            
            container.appendChild(optionEl);
            
            // Animate entrance
            gsap.from(optionEl, {
                opacity: 0,
                x: -20,
                duration: 0.3,
                delay: adjustedOptions.indexOf(option) * 0.1
            });
        });
    },
    
    updateTemperature(value) {
        this.temperature = parseFloat(value);
        document.getElementById('tempValue').textContent = value;
        this.renderOptions();
        SoundManager.play('click');
    },
    
    selectOption(option) {
        const scenario = this.scenarios[this.currentRound];
        const feedback = document.getElementById('feedback');
        const explanation = document.getElementById('explanation');
        
        SoundManager.play(option.appropriate ? 'success' : 'error');
        
        if (option.appropriate) {
            // Calculate points based on probability and temperature
            const basePoints = Math.round(option.probability * 200);
            const tempBonus = this.temperature > 0.5 ? 50 : 0; // Bonus for being creative
            const points = basePoints + tempBonus;
            
            feedback.innerHTML = `
                <div class="success-message">
                    ✓ Great choice! This makes sense in context. +${points} points
                </div>
            `;
            
            Game.addScore(points);
            this.score += points;
            
        } else {
            feedback.innerHTML = `
                <div class="error-message">
                    ✗ Hmm, that doesn't quite fit the context. Keep going!
                </div>
            `;
        }
        
        // Show explanation
        explanation.style.display = 'block';
        explanation.innerHTML = `
            <div style="color: var(--text-secondary);">
                <strong>💡 Explanation:</strong> ${scenario.explanation}
            </div>
        `;
        
        // Update success rate
        const successRate = Math.round((this.score / ((this.currentRound + 1) * 200)) * 100);
        document.getElementById('successRate').textContent = `${successRate}%`;
        
        // Move to next scenario
        setTimeout(() => {
            if (this.currentRound < this.scenarios.length - 1) {
                this.currentRound++;
                this.displayScenario();
            } else {
                Game.completePhase(this.score, 
                    "Fantastic! You understand how AI generates text token by token!");
            }
        }, 3000);
    }
};

