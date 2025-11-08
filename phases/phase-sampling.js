// Phase: Sampling Parameters - INTERACTIVE PARAMETER CONTROL
window.phaseSampling = {
    DEV_MODE: true,
    currentStep: 'intro', // 'intro' -> 'temperature' -> 'top_p' -> 'repetition' -> 'presence' -> 'recap'
    
    // Game state
    temperatureValue: 0.7,
    topPValue: 0.9,
    repetitionValue: 1.2,
    presenceValue: 0.5,
    
    // For interactive demonstrations
    sampleText: "The cat",
    generationAttempts: 0,
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'temperature') {
            this.renderTemperature(container);
        } else if (this.currentStep === 'top_p') {
            this.renderTopP(container);
        } else if (this.currentStep === 'repetition') {
            this.renderRepetition(container);
        } else if (this.currentStep === 'presence') {
            this.renderPresence(container);
        } else if (this.currentStep === 'recap') {
            this.renderRecap(container);
        }
    },
    
    renderIntro(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        🎛️ Sampling Parameters
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        Control how your LLM generates text
                    </p>
                    
                    <!-- What are Sampling Parameters -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🎚️</span>
                            <h2 style="font-size: 18px; color: var(--primary); margin: 0;">What are Sampling Parameters?</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                When generating text, LLMs have <strong style="color: var(--primary);">probabilities for each possible next token</strong>. 
                                Sampling parameters control HOW you pick from these probabilities.
                            </p>
                            <p style="margin: 0;">
                                Without these knobs, every generation would be identical and boring! These parameters add creativity, variety, and control.
                            </p>
                        </div>
                    </div>
                    
                    <!-- The 4 Key Parameters -->
                    <div style="background: linear-gradient(135deg, rgba(191, 0, 255, 0.1), rgba(139, 92, 246, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">🔧</span>
                            <h2 style="font-size: 18px; color: var(--secondary); margin: 0;">The 4 Key Controls</h2>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 14px; color: var(--primary); font-weight: 600; margin-bottom: 4px;">🌡️ Temperature</div>
                                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Randomness dial: low = predictable, high = creative chaos</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 14px; color: var(--secondary); font-weight: 600; margin-bottom: 4px;">🎯 Top-p</div>
                                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Nucleus sampling: only pick from top probable tokens</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 14px; color: #f59e0b; font-weight: 600; margin-bottom: 4px;">🔁 Repetition Penalty</div>
                                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Discourage repeating recent tokens</div>
                            </div>
                            <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 14px; color: #22c55e; font-weight: 600; margin-bottom: 4px;">✨ Presence Penalty</div>
                                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Encourage topic diversity and new words</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phaseSampling.nextStep()" 
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Explore Parameters →
                        </button>
                        ${this.DEV_MODE ? `
                        <button onclick="phaseSampling.devSkipPhase()" 
                                style="margin-left: 12px; padding: 12px 24px; background: linear-gradient(135deg, #ef4444, #dc2626); 
                                       border: none; border-radius: 12px; color: white; font-size: 13px; font-weight: 600; 
                                       cursor: pointer; opacity: 0.7;">
                            ⚡ DEV: Skip Phase
                        </button>` : ''}
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    renderTemperature(container) {
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">🌡️ Temperature</h2>
                        <p class="phase-subtitle">Control randomness (0.0 - 2.0)</p>
                    </div>
                    
                    <div class="phase-description">
                        Temperature adjusts how "confident" the model is. Low = picks the most likely word. High = takes risks!
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How it works</h4>
                        <p style="font-size: 11px; line-height: 1.5;">
                        <strong>Temp = 0.0:</strong> Always picks highest probability (deterministic)<br>
                        <strong>Temp = 0.7:</strong> Balanced, typical default<br>
                        <strong>Temp = 1.5+:</strong> Wild, creative, unpredictable
                        </p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 12px;">
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            <strong>Reality:</strong> Temperature "flattens" or "sharpens" the probability distribution. Higher temp = more uniform probabilities.
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 680px;">
                        
                        <div style="margin-bottom: 20px; text-align: center;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 10px;">
                                🎮 Adjust temperature and see how it affects word choices
                            </div>
                        </div>
                        
                        <!-- Temperature Slider -->
                        <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <label style="font-size: 14px; color: var(--primary); font-weight: 600;">Temperature</label>
                                <span id="tempValue" style="font-size: 24px; font-weight: 700; color: var(--primary); font-family: 'JetBrains Mono', monospace;">0.7</span>
                            </div>
                            <input type="range" id="tempSlider" min="0" max="2" step="0.1" value="0.7" 
                                   oninput="phaseSampling.updateTemperature(this.value)"
                                   style="width: 100%; height: 8px; cursor: pointer; appearance: none; background: linear-gradient(90deg, #3b82f6, #f59e0b, #ef4444); border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: var(--text-secondary);">
                                <span>0.0 (Deterministic)</span>
                                <span>1.0 (Balanced)</span>
                                <span>2.0 (Chaotic)</span>
                            </div>
                        </div>
                        
                        <!-- Probability Visualization -->
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 20px;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; text-align: center;">
                                Next word probabilities after "The cat"
                            </div>
                            <canvas id="tempCanvas" width="640" height="280" 
                                    style="border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 10px; 
                                           background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.05));">
                            </canvas>
                        </div>
                        
                        <!-- Sample Outputs -->
                        <div style="padding: 16px; background: rgba(191, 0, 255, 0.08); border-radius: 10px; margin-bottom: 20px;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px;">📝 Sample generations:</div>
                            <div id="tempSamples" style="display: flex; flex-direction: column; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
                            </div>
                        </div>
                        
                        <button class="btn-primary" onclick="phaseSampling.nextStep()" style="width: 100%; padding: 12px;">
                            Next: Top-p →
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        
        // Initialize visualization
        setTimeout(() => {
            this.drawTemperatureVisualization(0.7);
            this.generateTemperatureSamples(0.7);
        }, 100);
    },
    
    updateTemperature(value) {
        this.temperatureValue = parseFloat(value);
        document.getElementById('tempValue').textContent = value;
        this.drawTemperatureVisualization(parseFloat(value));
        this.generateTemperatureSamples(parseFloat(value));
        SoundManager.play('click');
    },
    
    drawTemperatureVisualization(temp) {
        const canvas = document.getElementById('tempCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Sample word probabilities (before temperature)
        const words = ['sat', 'jumped', 'ran', 'sleeps', 'meowed'];
        const baseProbs = [0.40, 0.25, 0.15, 0.12, 0.08]; // Must sum to 1.0
        
        // Apply temperature transformation
        const applyTemp = (probs, t) => {
            if (t === 0) return [1, 0, 0, 0, 0]; // Deterministic
            
            // Temperature formula: p_i = exp(log(p_i) / T) / sum(exp(log(p_j) / T))
            const logits = probs.map(p => Math.log(Math.max(p, 0.0001)) / t);
            const expLogits = logits.map(l => Math.exp(l));
            const sumExp = expLogits.reduce((a, b) => a + b, 0);
            return expLogits.map(e => e / sumExp);
        };
        
        const adjustedProbs = applyTemp(baseProbs, Math.max(temp, 0.01));
        
        // Draw bars
        const barWidth = 100;
        const gap = 20;
        const maxHeight = 200;
        const startX = (width - (barWidth * words.length + gap * (words.length - 1))) / 2;
        const startY = height - 50;
        
        words.forEach((word, i) => {
            const x = startX + i * (barWidth + gap);
            const barHeight = adjustedProbs[i] * maxHeight;
            const y = startY - barHeight;
            
            // Bar gradient
            const gradient = ctx.createLinearGradient(x, y, x, startY);
            gradient.addColorStop(0, '#00d4ff');
            gradient.addColorStop(1, '#bf00ff');
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Border
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, barWidth, barHeight);
            
            // Probability label
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${(adjustedProbs[i] * 100).toFixed(1)}%`, x + barWidth / 2, y - 10);
            
            // Word label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '13px monospace';
            ctx.fillText(word, x + barWidth / 2, startY + 25);
        });
    },
    
    generateTemperatureSamples(temp) {
        const container = document.getElementById('tempSamples');
        if (!container) return;
        
        const samples = [
            { t: 0.0, text: 'The cat sat on the mat', label: 'T=0.0 (Always same)' },
            { t: 0.7, text: 'The cat jumped onto the couch', label: 'T=0.7 (Balanced)' },
            { t: 1.5, text: 'The cat meowed loudly at midnight', label: 'T=1.5 (Creative)' }
        ];
        
        const closest = samples.reduce((prev, curr) => 
            Math.abs(curr.t - temp) < Math.abs(prev.t - temp) ? curr : prev
        );
        
        container.innerHTML = samples.map(s => {
            const isActive = s === closest;
            return `
                <div style="padding: 10px; background: ${isActive ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)'}; 
                           border: 1px solid ${isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}; 
                           border-radius: 6px;">
                    <div style="font-size: 11px; color: ${isActive ? 'var(--primary)' : 'var(--text-secondary)'}; 
                               margin-bottom: 4px;">${s.label}</div>
                    <div style="color: white;">"${s.text}"</div>
                </div>
            `;
        }).join('');
    },
    
    renderTopP(container) {
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">🎯 Top-p (Nucleus Sampling)</h2>
                        <p class="phase-subtitle">Control diversity (0.0 - 1.0)</p>
                    </div>
                    
                    <div class="phase-description">
                        Only sample from the smallest set of tokens whose cumulative probability is ≥ p. Ignores unlikely options!
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How it works</h4>
                        <p style="font-size: 11px; line-height: 1.5;">
                        <strong>Top-p = 0.5:</strong> Only top 50% likely tokens<br>
                        <strong>Top-p = 0.9:</strong> Typical default, good variety<br>
                        <strong>Top-p = 1.0:</strong> All tokens considered
                        </p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 12px;">
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            <strong>Reality:</strong> Top-p dynamically adjusts how many tokens to consider. High probability word? Only a few options. Low probability word? More variety!
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 680px;">
                        
                        <div style="margin-bottom: 20px; text-align: center;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 10px;">
                                🎮 Adjust top-p and see which tokens get included
                            </div>
                        </div>
                        
                        <!-- Top-p Slider -->
                        <div style="padding: 24px; background: rgba(191, 0, 255, 0.08); border-radius: 12px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <label style="font-size: 14px; color: var(--secondary); font-weight: 600;">Top-p</label>
                                <span id="topPValue" style="font-size: 24px; font-weight: 700; color: var(--secondary); font-family: 'JetBrains Mono', monospace;">0.9</span>
                            </div>
                            <input type="range" id="topPSlider" min="0.1" max="1.0" step="0.05" value="0.9" 
                                   oninput="phaseSampling.updateTopP(this.value)"
                                   style="width: 100%; height: 8px; cursor: pointer; appearance: none; background: linear-gradient(90deg, #8b5cf6, #a855f7, #bf00ff); border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: var(--text-secondary);">
                                <span>0.1 (Very focused)</span>
                                <span>0.5 (Moderate)</span>
                                <span>1.0 (All tokens)</span>
                            </div>
                        </div>
                        
                        <!-- Token Selection Visualization -->
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 20px;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; text-align: center;">
                                Which tokens are sampled? (Sorted by probability)
                            </div>
                            <div id="topPTokens" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 100px;">
                            </div>
                            <div id="topPInfo" style="margin-top: 16px; padding: 12px; background: rgba(0, 212, 255, 0.08); border-radius: 8px; text-align: center; font-size: 12px; color: var(--text-secondary);">
                            </div>
                        </div>
                        
                        <button class="btn-primary" onclick="phaseSampling.nextStep()" style="width: 100%; padding: 12px;">
                            Next: Repetition Penalty →
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        
        // Initialize visualization
        setTimeout(() => this.drawTopPVisualization(0.9), 100);
    },
    
    updateTopP(value) {
        this.topPValue = parseFloat(value);
        document.getElementById('topPValue').textContent = value;
        this.drawTopPVisualization(parseFloat(value));
        SoundManager.play('click');
    },
    
    drawTopPVisualization(topP) {
        const container = document.getElementById('topPTokens');
        const infoBox = document.getElementById('topPInfo');
        if (!container || !infoBox) return;
        
        // Sample tokens sorted by probability
        const tokens = [
            { word: 'sat', prob: 0.40 },
            { word: 'jumped', prob: 0.25 },
            { word: 'ran', prob: 0.15 },
            { word: 'sleeps', prob: 0.12 },
            { word: 'meowed', prob: 0.08 }
        ];
        
        // Calculate cumulative probabilities
        let cumulative = 0;
        const included = [];
        const excluded = [];
        
        tokens.forEach(token => {
            if (cumulative < topP) {
                included.push(token);
                cumulative += token.prob;
            } else {
                excluded.push(token);
            }
        });
        
        container.innerHTML = tokens.map(token => {
            const isIncluded = included.includes(token);
            return `
                <div style="padding: 12px 16px; background: ${isIncluded ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.15)'}; 
                           border: 2px solid ${isIncluded ? '#22c55e' : '#ef4444'}; border-radius: 8px; 
                           opacity: ${isIncluded ? '1' : '0.5'}; transition: all 0.3s;">
                    <div style="font-size: 14px; font-weight: 700; color: white; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px;">
                        ${token.word}
                    </div>
                    <div style="font-size: 12px; color: ${isIncluded ? '#22c55e' : '#ef4444'};">
                        ${(token.prob * 100).toFixed(0)}% ${isIncluded ? '✓' : '✗'}
                    </div>
                </div>
            `;
        }).join('');
        
        infoBox.innerHTML = `
            <strong style="color: #22c55e;">${included.length} tokens included</strong> 
            (${(cumulative * 100).toFixed(1)}% cumulative probability) • 
            <strong style="color: #ef4444;">${excluded.length} tokens excluded</strong>
        `;
    },
    
    renderRepetition(container) {
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">🔁 Repetition Penalty</h2>
                        <p class="phase-subtitle">Prevent repetition (1.0 - 2.0)</p>
                    </div>
                    
                    <div class="phase-description">
                        Penalizes tokens that already appeared. Higher = less repetition. 1.0 = no penalty.
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How it works</h4>
                        <p style="font-size: 11px; line-height: 1.5;">
                        <strong>1.0:</strong> No penalty (default)<br>
                        <strong>1.2:</strong> Mild discouragement<br>
                        <strong>1.5+:</strong> Strong penalty, forces variety
                        </p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 12px;">
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            <strong>Reality:</strong> Divides the probability of any token that appeared before by the penalty value. Stops "The cat cat cat" loops!
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 680px;">
                        
                        <div style="margin-bottom: 20px; text-align: center;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 10px;">
                                🎮 Adjust repetition penalty and generate text
                            </div>
                        </div>
                        
                        <!-- Repetition Penalty Slider -->
                        <div style="padding: 24px; background: rgba(245, 158, 11, 0.08); border-radius: 12px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <label style="font-size: 14px; color: #f59e0b; font-weight: 600;">Repetition Penalty</label>
                                <span id="repValue" style="font-size: 24px; font-weight: 700; color: #f59e0b; font-family: 'JetBrains Mono', monospace;">1.2</span>
                            </div>
                            <input type="range" id="repSlider" min="1.0" max="2.0" step="0.1" value="1.2" 
                                   oninput="phaseSampling.updateRepetition(this.value)"
                                   style="width: 100%; height: 8px; cursor: pointer; appearance: none; background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444); border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: var(--text-secondary);">
                                <span>1.0 (No penalty)</span>
                                <span>1.5 (Moderate)</span>
                                <span>2.0 (Strong)</span>
                            </div>
                        </div>
                        
                        <!-- Interactive Example -->
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 20px;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; text-align: center;">
                                Watch how penalty affects generation
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; margin-bottom: 12px;">
                                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">Starting text:</div>
                                <div style="font-family: 'JetBrains Mono', monospace; color: white; font-size: 14px;">
                                    "The cat sat. The"
                                </div>
                            </div>
                            
                            <div id="repComparison" style="display: grid; gap: 12px;">
                            </div>
                        </div>
                        
                        <button class="btn-primary" onclick="phaseSampling.nextStep()" style="width: 100%; padding: 12px;">
                            Next: Presence Penalty →
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        
        // Initialize visualization
        setTimeout(() => this.drawRepetitionComparison(1.2), 100);
    },
    
    updateRepetition(value) {
        this.repetitionValue = parseFloat(value);
        document.getElementById('repValue').textContent = value;
        this.drawRepetitionComparison(parseFloat(value));
        SoundManager.play('click');
    },
    
    drawRepetitionComparison(penalty) {
        const container = document.getElementById('repComparison');
        if (!container) return;
        
        const examples = [
            { penalty: 1.0, text: 'The cat sat. The cat sat again.', label: 'No Penalty (1.0)', problem: '❌ Repetitive!' },
            { penalty: 1.2, text: 'The cat sat. The dog jumped.', label: 'Mild Penalty (1.2)', problem: '✓ Some variety' },
            { penalty: 1.8, text: 'The cat sat. A bird flew overhead.', label: 'Strong Penalty (1.8)', problem: '✓ Forced diversity' }
        ];
        
        const closest = examples.reduce((prev, curr) => 
            Math.abs(curr.penalty - penalty) < Math.abs(prev.penalty - penalty) ? curr : prev
        );
        
        container.innerHTML = examples.map(ex => {
            const isActive = ex === closest;
            return `
                <div style="padding: 14px; background: ${isActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.3)'}; 
                           border: 1px solid ${isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 12px; color: ${isActive ? '#f59e0b' : 'var(--text-secondary)'}; font-weight: 600;">
                            ${ex.label}
                        </span>
                        <span style="font-size: 11px; color: ${ex.problem.startsWith('✓') ? '#22c55e' : '#ef4444'};">
                            ${ex.problem}
                        </span>
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; color: white; font-size: 13px; line-height: 1.6;">
                        "${ex.text}"
                    </div>
                </div>
            `;
        }).join('');
    },
    
    renderPresence(container) {
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">✨ Presence Penalty</h2>
                        <p class="phase-subtitle">Encourage new topics (0.0 - 2.0)</p>
                    </div>
                    
                    <div class="phase-description">
                        Penalizes ANY token that appeared before, regardless of frequency. Encourages topic diversity!
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How it works</h4>
                        <p style="font-size: 11px; line-height: 1.5;">
                        <strong>0.0:</strong> No penalty<br>
                        <strong>0.5:</strong> Mild encouragement for new words<br>
                        <strong>1.5+:</strong> Strong push for novelty
                        </p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 12px;">
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            <strong>Difference:</strong> Repetition penalty cares about HOW OFTEN. Presence penalty just cares IF IT APPEARED (binary).
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 680px;">
                        
                        <div style="margin-bottom: 20px; text-align: center;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 10px;">
                                🎮 Adjust presence penalty and see topic drift
                            </div>
                        </div>
                        
                        <!-- Presence Penalty Slider -->
                        <div style="padding: 24px; background: rgba(34, 197, 94, 0.08); border-radius: 12px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <label style="font-size: 14px; color: #22c55e; font-weight: 600;">Presence Penalty</label>
                                <span id="presValue" style="font-size: 24px; font-weight: 700; color: #22c55e; font-family: 'JetBrains Mono', monospace;">0.5</span>
                            </div>
                            <input type="range" id="presSlider" min="0.0" max="2.0" step="0.1" value="0.5" 
                                   oninput="phaseSampling.updatePresence(this.value)"
                                   style="width: 100%; height: 8px; cursor: pointer; appearance: none; background: linear-gradient(90deg, #6b7280, #22c55e, #10b981); border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: var(--text-secondary);">
                                <span>0.0 (Stays on topic)</span>
                                <span>1.0 (Explores)</span>
                                <span>2.0 (Maximum drift)</span>
                            </div>
                        </div>
                        
                        <!-- Topic Drift Example -->
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 20px;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; text-align: center;">
                                How topics evolve with presence penalty
                            </div>
                            <div id="presComparison" style="display: grid; gap: 12px;">
                            </div>
                        </div>
                        
                        <!-- Summary Box -->
                        <div style="padding: 16px; background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.08)); 
                                   border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 12px; margin-bottom: 20px;">
                            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">
                                💡 <strong style="color: #fbbf24;">Pro Tip:</strong> Use <strong>repetition penalty</strong> to stop loops. 
                                Use <strong>presence penalty</strong> to explore diverse topics. Combine both for best results!
                            </div>
                        </div>
                        
                        <button class="btn-primary" onclick="phaseSampling.nextStep()" style="width: 100%; padding: 12px;">
                            Complete →
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        
        // Initialize visualization
        setTimeout(() => this.drawPresenceComparison(0.5), 100);
    },
    
    updatePresence(value) {
        this.presenceValue = parseFloat(value);
        document.getElementById('presValue').textContent = value;
        this.drawPresenceComparison(parseFloat(value));
        SoundManager.play('click');
    },
    
    drawPresenceComparison(penalty) {
        const container = document.getElementById('presComparison');
        if (!container) return;
        
        const examples = [
            { penalty: 0.0, text: 'The cat sat. The cat looked around. The cat meowed.', label: 'No Penalty (0.0)', note: 'Stays on "cat" topic' },
            { penalty: 0.5, text: 'The cat sat. A bird flew by. Clouds drifted overhead.', label: 'Mild Penalty (0.5)', note: 'Gradual topic shift' },
            { penalty: 1.5, text: 'The cat sat. Rain poured outside. Quantum physics fascinates.', label: 'Strong Penalty (1.5)', note: 'Random topic jumps!' }
        ];
        
        const closest = examples.reduce((prev, curr) => 
            Math.abs(curr.penalty - penalty) < Math.abs(prev.penalty - penalty) ? curr : prev
        );
        
        container.innerHTML = examples.map(ex => {
            const isActive = ex === closest;
            return `
                <div style="padding: 14px; background: ${isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0, 0, 0, 0.3)'}; 
                           border: 1px solid ${isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 12px; color: ${isActive ? '#22c55e' : 'var(--text-secondary)'}; font-weight: 600;">
                            ${ex.label}
                        </span>
                        <span style="font-size: 11px; color: ${isActive ? '#22c55e' : 'var(--text-secondary)'};">
                            ${ex.note}
                        </span>
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; color: white; font-size: 13px; line-height: 1.6;">
                        "${ex.text}"
                    </div>
                </div>
            `;
        }).join('');
    },
    
    renderRecap(container) {
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 32px; text-align: center; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✓ Sampling Parameters Mastered!
                    </h1>
                    
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 32px;">
                        You now understand how to control LLM generation
                    </p>
                    
                    <!-- Parameter Summary -->
                    <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 12px; margin-bottom: 24px;">
                        <div style="text-align: center; margin-bottom: 18px;">
                            <span style="font-size: 12px; color: var(--text-secondary);">🎛️ THE 4 CONTROL KNOBS</span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 16px; color: var(--primary); font-weight: 700; margin-bottom: 6px;">🌡️ Temperature</div>
                                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                                    Controls randomness. Low = predictable, High = creative.
                                </div>
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 16px; color: var(--secondary); font-weight: 700; margin-bottom: 6px;">🎯 Top-p</div>
                                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                                    Samples from top probable tokens. Dynamic cutoff.
                                </div>
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 16px; color: #f59e0b; font-weight: 700; margin-bottom: 6px;">🔁 Repetition Penalty</div>
                                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                                    Prevents repeating same tokens. Stops loops.
                                </div>
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 16px; color: #22c55e; font-weight: 700; margin-bottom: 6px;">✨ Presence Penalty</div>
                                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
                                    Encourages topic diversity. Binary penalty.
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Key Insights -->
                    <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">📊 What You Learned:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 1.8;">
                            <li>Sampling parameters control HOW you pick tokens from probabilities</li>
                            <li>Temperature adjusts the probability distribution shape</li>
                            <li>Top-p dynamically limits which tokens are considered</li>
                            <li>Repetition & presence penalties prevent boring, repetitive output</li>
                            <li>These knobs turn deterministic math into creative generation!</li>
                        </ul>
                    </div>
                    
                    <!-- Real World Usage -->
                    <div style="padding: 20px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05)); 
                               border: 2px solid rgba(139, 92, 246, 0.3); border-radius: 12px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 20px;">🎯</span>
                            <h3 style="font-size: 15px; color: #a855f7; margin: 0;">Real-World Recommendations</h3>
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">
                            <strong style="color: #fbbf24;">For creative writing:</strong> Temp 0.8-1.0, Top-p 0.9<br>
                            <strong style="color: #fbbf24;">For code generation:</strong> Temp 0.2-0.4, Top-p 0.95<br>
                            <strong style="color: #fbbf24;">For factual answers:</strong> Temp 0.1, Top-p 1.0<br>
                            <strong style="color: #fbbf24;">To avoid repetition:</strong> Repetition penalty 1.1-1.3<br>
                            <strong style="color: #fbbf24;">For diverse topics:</strong> Presence penalty 0.5-1.0
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phaseSampling.completePhase()" 
                                class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
                            Continue Journey →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    nextStep() {
        const steps = ['intro', 'temperature', 'top_p', 'repetition', 'presence', 'recap'];
        const currentIndex = steps.indexOf(this.currentStep);
        if (currentIndex < steps.length - 1) {
            this.currentStep = steps[currentIndex + 1];
            const container = document.getElementById('phaseContainer');
            this.render(container);
            SoundManager.play('click');
            Game.addScore(20);
        }
    },
    
    completePhase() {
        Game.addScore(150);
        Game.completePhase(150, "You mastered sampling parameters!");
        Game.saveState();
        SoundManager.play('levelUp');
    },
    
    devSkipPhase() {
        if (!this.DEV_MODE) return;
        Game.addScore(150);
        this.completePhase();
    }
};

