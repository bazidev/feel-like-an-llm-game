// Phase 3: Attention - USER CALCULATES WEIGHTS
window.phase3 = {
    currentStep: 'intro', // 'intro' -> 'examples' -> 'calculate' -> 'recap'
    currentExample: 0,
    sentences: [],
    currentSentence: 0,
    attentionWeights: {},
    
    // Tutorial examples
    exampleSentences: [
        {
            words: ["The", "cat", "sat"],
            explanation: "Click 'cat', then set attention to words that give it context",
            hints: {
                "The": "Low - articles don't add much meaning",
                "sat": "High - the action 'cat' is doing"
            }
        },
        {
            words: ["chef", "cooked", "pasta"],
            explanation: "Click 'cooked', then set attention based on relationships",
            hints: {
                "chef": "High - who is doing the cooking",
                "pasta": "High - what is being cooked"
            }
        }
    ],
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'examples') {
            this.renderExamples(container);
        } else if (this.currentStep === 'calculate') {
            this.renderCalculate(container);
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
                        🎯 Attention: Calculate Context
                    </h1>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 32px;">
                        Determine which tokens matter to each other
                    </p>
                    
                    <!-- Explanation Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">🧮</span>
                            <h3 style="font-size: 18px; color: var(--primary); margin: 0;">How Attention Works</h3>
                        </div>
                        <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin: 0;">
                            For each token, you calculate how much it should "attend to" every other token. This is <strong>pure math</strong> - comparing embedding vectors. High similarity = high attention weight. You're not "thinking" - you're multiplying matrices!
                        </p>
                    </div>
                    
                    <!-- Formula -->
                    <div style="padding: 20px; background: rgba(191, 0, 255, 0.08); border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">📐 The Calculation</h3>
                        <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.8;">
                            For each word pair, attention = <strong>vector similarity</strong><br>
                            Higher score = more important context<br>
                            It's all mathematical - no "understanding"
                        </div>
                    </div>
                    
                    <!-- Reality Check -->
                    <div style="padding: 16px; background: rgba(239, 68, 68, 0.08); border: 2px solid rgba(239, 68, 68, 0.25); 
                               border-radius: 12px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <span style="font-size: 18px;">⚡</span>
                            <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                Reality Check: You're doing matrix math, not thinking. "Chef" and "cooked" have high attention because their vectors are similar.
                            </span>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase3.startCalculating()" 
                            style="font-size: 17px; padding: 14px 40px;">
                        🚀 Start Calculating Attention
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    startCalculating() {
        this.currentStep = 'examples';
        this.currentExample = 0;
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderExamples(container) {
        const example = this.exampleSentences[this.currentExample];
        const selectedWord = example.words[1]; // Middle word by default
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Learn attention</h2>
                        <p class="phase-subtitle">Example ${this.currentExample + 1} of ${this.exampleSentences.length}</p>
                    </div>
                    
                    <div class="phase-description">
                        ${example.explanation}. High attention = strong relationship!
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 Hints</h4>
                        ${Object.entries(example.hints).map(([word, hint]) => `
                            <p style="font-size: 12px; margin-bottom: 8px;"><strong>"${word}":</strong> ${hint}</p>
                        `).join('')}
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 16px;">
                        <p style="font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality check:</strong> This is matrix math - not understanding!
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 600px;">
                        
                        <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 20px; text-align: center;">
                            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 16px;">
                                Focus word: <span style="color: var(--secondary); font-weight: 700;">${selectedWord}</span>
                            </div>
                            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                                ${example.words.map((word, idx) => `
                                    <div style="padding: 14px 20px; background: ${word === selectedWord ? 'rgba(191, 0, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'}; 
                                               border: 2px solid ${word === selectedWord ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.1)'}; 
                                               border-radius: 10px; font-size: 20px; font-weight: 600; font-family: 'JetBrains Mono', monospace;">
                                        ${word}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div id="attentionControls" style="margin-bottom: 20px;">
                            ${this.renderExampleControls(example, selectedWord)}
                        </div>
                        
                        <button class="btn-primary" id="checkBtn" onclick="phase3.checkExample()" style="width: 100%;">
                            Check my attention weights
                        </button>
                        
                        <div id="feedback" style="display: none; margin-top: 16px; padding: 16px; border-radius: 10px;"></div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.exampleWeights = {};
        example.words.forEach((word, idx) => {
            if (word !== selectedWord) {
                this.exampleWeights[word] = 0.5;
            }
        });
    },
    
    renderExampleControls(example, selectedWord) {
        return `
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                    How much should "<strong style="color: var(--secondary);">${selectedWord}</strong>" pay attention to:
                </div>
                ${example.words.map((word, idx) => {
                    if (word === selectedWord) return '';
                    return `
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
                            <div style="min-width: 80px; font-size: 14px; font-family: 'JetBrains Mono', monospace; color: var(--primary);">${word}</div>
                            <input type="range" min="0" max="1" step="0.1" value="0.5" 
                                   oninput="phase3.updateExampleWeight('${word}', this.value)"
                                   style="flex: 1;">
                            <div style="min-width: 40px; text-align: right; font-size: 14px; font-weight: 600;" id="weight-${word}">
                                0.5
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    updateExampleWeight(word, value) {
        this.exampleWeights[word] = parseFloat(value);
        const display = document.getElementById(`weight-${word}`);
        if (display) {
            const val = parseFloat(value);
            display.textContent = val.toFixed(1);
            display.style.color = val > 0.7 ? '#22c55e' : val > 0.4 ? '#f59e0b' : '#6b7280';
        }
    },
    
    checkExample() {
        const example = this.exampleSentences[this.currentExample];
        const feedback = document.getElementById('feedback');
        const selectedWord = example.words[1];
        
        // Check if weights are reasonable based on hints
        let correct = true;
        let message = '';
        
        Object.entries(example.hints).forEach(([word, hint]) => {
            const weight = this.exampleWeights[word];
            if (hint.startsWith('High') && weight < 0.6) {
                correct = false;
                message = `"${word}" should have higher attention (you set ${weight.toFixed(1)}, try 0.7+)`;
            } else if (hint.startsWith('Low') && weight > 0.5) {
                correct = false;
                message = `"${word}" should have lower attention (you set ${weight.toFixed(1)}, try 0.3-)`;
            }
        });
        
        feedback.style.display = 'block';
        
        if (correct) {
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #22c55e; font-weight: 700; margin-bottom: 8px;">✓ Perfect!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    You correctly identified the important relationships. Moving on!
                </div>
            `;
            SoundManager.play('success');
            Game.addScore(30);
            
            setTimeout(() => {
                if (this.currentExample < this.exampleSentences.length - 1) {
                    this.currentExample++;
                    this.render(document.getElementById('phaseContainer'));
                } else {
                    this.currentStep = 'calculate';
                    this.initializeSentences();
                    this.render(document.getElementById('phaseContainer'));
                }
            }, 2000);
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #ef4444; font-weight: 700; margin-bottom: 8px;">Try adjusting!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    ${message}
                </div>
            `;
            SoundManager.play('error');
        }
    },
    
    initializeSentences() {
        const text = Game.state.trainingText;
        this.sentences = text.split(/[.!?]+/).filter(s => s.trim());
        this.currentSentence = 0;
        this.attentionWeights = {};
    },
    
    renderCalculate(container) {
        const sentence = this.sentences[this.currentSentence];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 6); // First 6 words
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Calculate Attention</h2>
                        <p class="phase-subtitle">Sentence ${this.currentSentence + 1} of ${this.sentences.length}</p>
                    </div>
                    
                    <div class="phase-description">
                        Click a word (highlighted in purple), then click other words to set how much attention it should pay to them.
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How to Decide</h4>
                        <p>High attention (0.8-1.0): Words that appeared together often<br>
                        Low attention (0.1-0.3): Rarely appeared together<br>
                        It's based on <strong>training patterns</strong>, not meaning!</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 600px;">
                        
                        <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px; text-align: center;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">Click the highlighted word, then set attention to others:</div>
                            <div id="wordDisplay" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                                ${words.map((word, idx) => `
                                    <div class="attention-word ${idx === 0 ? 'selected' : ''}" data-idx="${idx}" onclick="phase3.selectWord(${idx})"
                                         style="padding: 12px 18px; background: ${idx === 0 ? 'rgba(191, 0, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'}; 
                                                border: 2px solid ${idx === 0 ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.1)'}; border-radius: 10px; 
                                                cursor: pointer; transition: all 0.3s; font-size: 16px; font-weight: 600;">
                                        ${word}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div id="attentionControls" style="margin-bottom: 24px;">
                            ${this.renderAttentionControls(words, 0)}
                        </div>
                        
                        <button class="btn-primary" onclick="phase3.nextSentence()" style="width: 100%;">
                            ${this.currentSentence < this.sentences.length - 1 ? 'Next Sentence' : 'Complete Attention'}
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.selectedWord = 0;
        this.initializeWeights(words);
    },
    
    initializeWeights(words) {
        if (!this.attentionWeights[this.currentSentence]) {
            this.attentionWeights[this.currentSentence] = {};
        }
        words.forEach((word, idx) => {
            if (!this.attentionWeights[this.currentSentence][idx]) {
                this.attentionWeights[this.currentSentence][idx] = {};
            }
        });
    },
    
    renderAttentionControls(words, fromIdx) {
        return `
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                    Set attention from "<strong style="color: var(--secondary);">${words[fromIdx]}</strong>" to:
                </div>
                ${words.map((word, toIdx) => {
                    if (toIdx === fromIdx) return '';
                    const weight = this.attentionWeights[this.currentSentence]?.[fromIdx]?.[toIdx] || 0.5;
                    return `
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
                            <div style="min-width: 80px; font-size: 14px; font-family: 'JetBrains Mono', monospace; color: var(--primary);">${word}</div>
                            <input type="range" min="0" max="1" step="0.1" value="${weight}" 
                                   onchange="phase3.setAttention(${fromIdx}, ${toIdx}, this.value)"
                                   style="flex: 1;">
                            <div style="min-width: 40px; text-align: right; font-size: 14px; font-weight: 600; color: ${weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#f59e0b' : '#6b7280'};">
                                ${parseFloat(weight).toFixed(1)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    selectWord(idx) {
        this.selectedWord = idx;
        const sentence = this.sentences[this.currentSentence];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 6);
        
        // Update UI
        document.querySelectorAll('.attention-word').forEach((el, i) => {
            if (i === idx) {
                el.style.background = 'rgba(191, 0, 255, 0.3)';
                el.style.borderColor = 'var(--secondary)';
                el.classList.add('selected');
            } else {
                el.style.background = 'rgba(255, 255, 255, 0.05)';
                el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                el.classList.remove('selected');
            }
        });
        
        // Update controls
        document.getElementById('attentionControls').innerHTML = this.renderAttentionControls(words, idx);
        SoundManager.play('click');
    },
    
    setAttention(fromIdx, toIdx, value) {
        if (!this.attentionWeights[this.currentSentence][fromIdx]) {
            this.attentionWeights[this.currentSentence][fromIdx] = {};
        }
        this.attentionWeights[this.currentSentence][fromIdx][toIdx] = parseFloat(value);
        SoundManager.play('click');
    },
    
    nextSentence() {
        if (this.currentSentence < this.sentences.length - 1) {
            this.currentSentence++;
            Game.addScore(50);
            SoundManager.play('success');
            this.render(document.getElementById('phaseContainer'));
        } else {
            Game.state.attentionWeights = this.attentionWeights;
            Game.addScore(100);
            SoundManager.play('levelUp');
            this.currentStep = 'recap';
            this.render(document.getElementById('phaseContainer'));
        }
    },
    
    renderRecap(container) {
        const totalWeights = Object.values(this.attentionWeights).reduce((sum, sent) => {
            return sum + Object.values(sent).reduce((s, weights) => s + Object.keys(weights).length, 0);
        }, 0);
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 32px; text-align: center; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✓ Phase 3 Complete: Attention
                    </h1>
                    
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 32px;">
                        You calculated ${totalWeights} attention weights across ${this.sentences.length} sentences
                    </p>
                    
                    <!-- Sample Weights -->
                    <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 12px; margin-bottom: 24px;">
                        <div style="text-align: center; margin-bottom: 12px;">
                            <span style="font-size: 12px; color: var(--text-secondary);">🎯 SAMPLE ATTENTION WEIGHTS</span>
                        </div>
                        <div style="font-size: 13px; font-family: 'JetBrains Mono', monospace; line-height: 1.8;">
                            ${this.formatSampleWeights()}
                        </div>
                    </div>
                    
                    <!-- What Happened -->
                    <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">📊 What Just Happened:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 1.8;">
                            <li>You calculated <strong>${totalWeights} attention scores</strong> - how much each word "pays attention" to others</li>
                            <li>High scores = strong relationship based on <strong>training patterns</strong></li>
                            <li>This is <strong>matrix multiplication</strong> in real LLMs - pure math, no thinking</li>
                            <li>These weights are now <strong>stored</strong> for training</li>
                        </ul>
                    </div>
                    
                    <!-- What's Next -->
                    <div style="padding: 20px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.08), rgba(0, 212, 255, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 32px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">🔜 Next: Training</h3>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">
                            Now you'll use your tokens, embeddings, and attention weights to <strong>train a bigram model</strong> - learning which tokens follow which based on your training data. Then you'll generate NEW text!
                        </p>
                    </div>
                    
                    <button class="btn-primary" onclick="phase3.completePhase()" style="width: 100%; font-size: 17px; padding: 14px;">
                        Continue to Training →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    formatSampleWeights() {
        const firstSent = this.attentionWeights[0];
        if (!firstSent) return '<div style="color: var(--text-secondary);">No weights calculated</div>';
        
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 6);
        
        let html = '';
        Object.entries(firstSent).slice(0, 2).forEach(([fromIdx, weights]) => {
            const from = words[parseInt(fromIdx)];
            html += `<div style="margin-bottom: 8px; color: var(--secondary);">"${from}" → </div>`;
            Object.entries(weights).forEach(([toIdx, weight]) => {
                const to = words[parseInt(toIdx)];
                const color = weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#f59e0b' : '#6b7280';
                html += `<div style="margin-left: 20px; color: ${color};">  "${to}": ${weight.toFixed(2)}</div>`;
            });
        });
        
        return html;
    },
    
    completePhase() {
        Game.completePhase(150);
        Game.saveState();
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

