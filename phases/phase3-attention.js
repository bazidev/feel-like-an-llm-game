// Phase 3: Attention - USER CALCULATES WEIGHTS
window.phase3 = {
    currentStep: 'intro', // 'intro' -> 'examples' -> 'calculate' -> 'recap'
    currentExample: 0,
    sentences: [],
    currentSentence: 0,
    attentionWeights: {},
    
    // Tutorial examples - SIMPLE 3-4 words for learning
    exampleSentences: [
        {
            words: ["chef", "cooked", "pasta"],
            explanation: "Focus: 'cooked'. Set attention to show contextual relationships",
            hints: {
                "chef": "High (0.8-1.0) - WHO performs the action",
                "pasta": "High (0.8-1.0) - WHAT is being acted upon"
            }
        },
        {
            words: ["rocket", "launched", "orbit"],
            explanation: "Focus: 'launched'. Identify which words provide the most context",
            hints: {
                "rocket": "High (0.8-1.0) - WHAT is launching",
                "orbit": "High (0.7-0.9) - WHERE it's going"
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
        } else if (this.currentStep === 'recap1') {
            this.renderRecap1(container);
        } else if (this.currentStep === 'recap2') {
            this.renderRecap2(container);
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
                               border-radius: 12px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <span style="font-size: 18px;">⚡</span>
                            <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                Reality Check: You're doing matrix math, not thinking. "Chef" and "cooked" have high attention because their vectors are similar.
                            </span>
                        </div>
                    </div>
                    
                    <!-- Real LLM Concept -->
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05)); 
                               border: 2px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 32px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">🧠</span>
                            <h3 style="font-size: 15px; color: #a855f7; margin: 0;">Real LLM Concept: Multi-Head Attention</h3>
                        </div>
                        <div style="font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                This game shows simple attention. Real LLMs use <strong style="color: #a855f7;">Multi-Head Attention</strong>:
                            </p>
                            <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                                <div style="font-size: 11px; line-height: 1.8;">
                                    • <strong style="color: #fbbf24;">Multiple attention heads</strong> run in parallel (GPT-3 has 96 heads!)<br>
                                    • Each head learns different relationships: grammar, syntax, semantics, etc.<br>
                                    • Uses <strong style="color: #fbbf24;">Query, Key, Value</strong> matrices (Q, K, V) for more complex calculations<br>
                                    • Formula: Attention(Q, K, V) = softmax(QK<sup>T</sup>/√d<sub>k</sub>)V
                                </div>
                            </div>
                            <p style="margin: 0; padding: 10px; background: rgba(251, 191, 36, 0.1); border-radius: 8px; border-left: 3px solid #fbbf24;">
                                💡 <strong>Key Insight:</strong> Attention is the breakthrough that made LLMs powerful! Before attention, models couldn't understand long-range dependencies. 
                                The famous paper "Attention Is All You Need" (2017) introduced the Transformer architecture used by all modern LLMs.
                            </p>
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
            SoundManager.play('correct'); // Use 'correct' for quick success
            Game.addScore(50); // Examples: +50 per correct
            
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
            SoundManager.play('wrong'); // Use 'wrong' for incorrect weights
        }
    },
    
    initializeSentences() {
        // Pick ONE representative sentence based on the dataset
        const datasetKey = Game.state.selectedDataset;
        const sentenceMap = {
            'animals': 'The cat sat on the mat',
            'space': 'The rocket launched into orbit',
            'food': 'The chef cooked fresh pasta',
            'tech': 'The programmer wrote clean code',
            'sports': 'The player kicked the ball'
        };
        
        const sentence = sentenceMap[datasetKey] || 'The cat sat on the mat';
        this.sentences = [sentence];
        this.currentSentence = 0;
        this.currentWordIndex = 0; // Track which word we're building attention for
        this.attentionWeights = {};
        this.completedAttentions = []; // Store completed attention patterns
    },
    
    renderCalculate(container) {
        const sentence = this.sentences[0]; // Always use the same sentence
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        const focusedWord = words[this.currentWordIndex];
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Calculate Attention</h2>
                        <p class="phase-subtitle">Building attention for word ${this.currentWordIndex + 1} of ${words.length}</p>
                    </div>
                    
                    <div class="phase-description">
                        For "<strong style="color: var(--secondary);">${focusedWord}</strong>", set how much attention it pays to each other word.
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How to Decide</h4>
                        <p style="font-size: 12px; line-height: 1.7;">
                        <strong style="color: #22c55e;">High (0.8-1.0):</strong> Strong relationship<br>
                        <strong style="color: #fbbf24;">Medium (0.4-0.7):</strong> Moderate relationship<br>
                        <strong style="color: #9ca3af;">Low (0.1-0.3):</strong> Weak relationship<br><br>
                        <span style="color: #ef4444;">⚡ Remember:</span> Based on <strong>training patterns</strong>!</p>
                    </div>
                    
                    <!-- Hint Box -->
                    <div style="margin-top: 16px; padding: 12px; background: rgba(251, 191, 36, 0.08); 
                               border: 2px solid rgba(251, 191, 36, 0.3); border-radius: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 16px;">💡</span>
                            <h4 style="font-size: 12px; color: #fbbf24; margin: 0; font-weight: 700;">Hint</h4>
                        </div>
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            Think about which words relate to "${focusedWord}" in the sentence. Words that work together (like subjects and actions) need higher attention!
                        </p>
                    </div>
                    
                    <!-- Completed Attentions Matrix -->
                    ${this.completedAttentions.length > 0 ? `
                        <div style="margin-top: 16px; padding: 12px; background: rgba(34, 197, 94, 0.08); 
                                   border: 2px solid rgba(34, 197, 94, 0.3); border-radius: 10px; max-height: 280px; overflow-y: auto;">
                            <div style="font-size: 11px; color: #22c55e; font-weight: 600; margin-bottom: 10px; text-align: center;">
                                ✅ Attention Matrix
                            </div>
                            ${this.renderCompactAttentionMatrix()}
                        </div>
                    ` : ''}
                    
                    <!-- Reality Check -->
                    <div style="margin-top: 16px; padding: 12px; background: rgba(239, 68, 68, 0.08); 
                               border: 2px solid rgba(239, 68, 68, 0.25); border-radius: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="font-size: 16px;">⚡</span>
                            <h4 style="font-size: 12px; color: #ef4444; margin: 0; font-weight: 700;">Reality Check</h4>
                        </div>
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            Matrix multiplication, not thinking! High attention = mathematically similar vectors from training.
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 780px;">
                        
                        <!-- Explanation -->
                        <div style="padding: 14px; background: rgba(0, 212, 255, 0.08); border-radius: 10px; margin-bottom: 16px; text-align: center;">
                            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                🎯 We're building an attention pattern for <strong style="color: var(--secondary);">"${focusedWord}"</strong><br>
                                <span style="font-size: 11px;">Set how much it should pay attention to each other word</span>
                            </div>
                        </div>
                        
                        <!-- Linear Visualization with Curves -->
                        <div style="padding: 16px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 16px;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; text-align: center;">
                                📊 Attention Visualization
                            </div>
                            <canvas id="attentionCanvas" width="740" height="200" 
                                    style="border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 10px; 
                                           background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.05)); 
                                           display: block; margin: 0 auto;">
                            </canvas>
                            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 8px; text-align: center; line-height: 1.6;">
                                💜 Purple = focused word • Curves show attention flow • Thickness = attention strength
                            </div>
                        </div>
                        
                        <!-- Attention Controls -->
                        <div id="attentionControls" style="margin-bottom: 20px;">
                            ${this.renderLinearControls(words, this.currentWordIndex)}
                        </div>
                        
                        <button class="btn-primary" onclick="phase3.completeCurrentWord()" style="width: 100%;">
                            ${this.currentWordIndex < words.length - 1 ? `Complete "${focusedWord}" and continue →` : 'Show Complete Attention Map →'}
                        </button>
                        
                        <div id="errorFeedback" style="display: none; margin-top: 14px; padding: 14px; border-radius: 10px;"></div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.initializeWeightsForWord(words, this.currentWordIndex);
        
        // Draw initial canvas
        setTimeout(() => this.drawLinearAttention(words, this.currentWordIndex), 50);
    },
    
    initializeWeightsForWord(words, wordIdx) {
        if (!this.attentionWeights[wordIdx]) {
            this.attentionWeights[wordIdx] = {};
            // Initialize all weights to 0.5
        words.forEach((word, idx) => {
                if (idx !== wordIdx) {
                    this.attentionWeights[wordIdx][idx] = 0.5;
                }
            });
        }
    },
    
    renderCompactAttentionMatrix() {
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        
        // Build matrix: rows = from words, columns = to words
        let html = '<div style="font-family: monospace; font-size: 9px; line-height: 1.4;">';
        
        // Header row with target words
        html += '<div style="display: flex; margin-bottom: 4px;">';
        html += '<div style="min-width: 42px; font-weight: 600; color: var(--text-secondary);"></div>'; // Empty corner
        words.forEach(word => {
            html += `<div style="min-width: 38px; text-align: center; font-weight: 600; color: #00d4ff;">${word}</div>`;
        });
        html += '</div>';
        
        // Data rows
        this.completedAttentions.forEach((att, rowIdx) => {
            html += '<div style="display: flex; margin-bottom: 2px;">';
            
            // Row header (from word)
            html += `<div style="min-width: 42px; font-weight: 600; color: #bf00ff; text-align: right; padding-right: 6px;">${att.word}</div>`;
            
            // Weight cells
            words.forEach(targetWord => {
                const weight = att.weights[targetWord];
                if (weight !== undefined) {
                    const color = weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#fbbf24' : '#9ca3af';
                    html += `<div style="min-width: 38px; text-align: center; color: ${color}; font-weight: 600;">${weight.toFixed(1)}</div>`;
                } else {
                    html += `<div style="min-width: 38px; text-align: center; color: #4b5563;">-</div>`;
                }
            });
            
            html += '</div>';
        });
        
        // If not all words completed yet, show pending rows
        for (let i = this.completedAttentions.length; i < words.length; i++) {
            html += '<div style="display: flex; margin-bottom: 2px;">';
            html += `<div style="min-width: 42px; font-weight: 600; color: #6b7280; text-align: right; padding-right: 6px;">${words[i]}</div>`;
            words.forEach(() => {
                html += `<div style="min-width: 38px; text-align: center; color: #374151;">...</div>`;
            });
            html += '</div>';
        }
        
        html += '</div>';
        
        html += '<div style="margin-top: 8px; font-size: 9px; text-align: center; color: var(--text-secondary);">Each row shows attention from that word to all others</div>';
        
        return html;
    },
    
    renderLinearControls(words, fromIdx) {
        const fromWord = words[fromIdx];
        return `
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px; text-align: center;">
                    Set attention from "<strong style="color: var(--secondary);">${fromWord}</strong>" to each word:
                </div>
                ${words.map((word, toIdx) => {
                    if (toIdx === fromIdx) return '';
                    const weight = this.attentionWeights[fromIdx]?.[toIdx] || 0.5;
                    return `
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 10px; 
                                   background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
                            <div style="min-width: 100px; font-size: 14px; font-family: 'JetBrains Mono', monospace; color: var(--primary);">
                                ${word}
                            </div>
                            <input type="range" min="0" max="1" step="0.1" value="${weight}" 
                                   oninput="phase3.updateAttentionWeight(${fromIdx}, ${toIdx}, this.value)"
                                   style="flex: 1;">
                            <div id="weight-${fromIdx}-${toIdx}" style="min-width: 40px; text-align: right; font-size: 14px; font-weight: 600; 
                                    color: ${weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#fbbf24' : '#9ca3af'};">
                                ${weight.toFixed(1)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    updateAttentionWeight(fromIdx, toIdx, value) {
        const val = parseFloat(value);
        if (!this.attentionWeights[fromIdx]) {
            this.attentionWeights[fromIdx] = {};
        }
        this.attentionWeights[fromIdx][toIdx] = val;
        
        // Update display
        const display = document.getElementById(`weight-${fromIdx}-${toIdx}`);
        if (display) {
            display.textContent = val.toFixed(1);
            display.style.color = val > 0.7 ? '#22c55e' : val > 0.4 ? '#fbbf24' : '#9ca3af';
        }
        
        // Redraw canvas with updated weights
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        this.drawLinearAttention(words, this.currentWordIndex, toIdx);
        
        SoundManager.play('click');
    },
    
    completeCurrentWord() {
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        const currentWord = words[this.currentWordIndex];
        
        // Validate that user actually set meaningful weights (not all defaults)
        const weights = this.attentionWeights[this.currentWordIndex] || {};
        const weightValues = Object.values(weights);
        const allDefault = weightValues.every(w => w === 0.5);
        
        if (allDefault && weightValues.length > 0) {
            // Show error - user didn't adjust weights
            SoundManager.play('wrong');
            
            // Show error message in the proper feedback div
            const errorDiv = document.getElementById('errorFeedback');
            if (errorDiv) {
                errorDiv.style.display = 'block';
                errorDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                errorDiv.style.border = '2px solid rgba(239, 68, 68, 0.3)';
                errorDiv.innerHTML = `
                    <div style="font-size: 16px; color: #ef4444; font-weight: 700; margin-bottom: 8px;">
                        ⚠️ Adjust the attention weights!
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary);">
                        You need to set different attention values based on word relationships.
                    </div>
                `;
                
                // Auto-hide after 2.5 seconds
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 2500);
            }
            
            return;
        }
        
        // Save completed attention pattern
        const weightsObj = {};
        Object.entries(this.attentionWeights[this.currentWordIndex] || {}).forEach(([idx, weight]) => {
            weightsObj[words[parseInt(idx)]] = weight;
        });
        
        this.completedAttentions.push({
            word: currentWord,
            weights: weightsObj
        });
        
        SoundManager.play('coin');
        Game.addScore(20); // Mini-game: +20 per word processed
        
        // Move to next word or show final visualization
        if (this.currentWordIndex < words.length - 1) {
            this.currentWordIndex++;
            this.render(document.getElementById('phaseContainer'));
        } else {
            // Show complete attention map
            this.showCompleteAttentionMap();
        }
    },
    
    showCompleteAttentionMap() {
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        
        const container = document.getElementById('phaseContainer');
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 28px; text-align: center; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        🎯 Complete Attention Map
                    </h1>
                    
                    <p style="font-size: 14px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        You built attention patterns for all ${words.length} words!
                    </p>
                    
                    <!-- Complete Visualization -->
                    <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px;">
                        <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                            📊 All Attention Connections
                        </div>
                        <canvas id="completeAttentionCanvas" width="840" height="400" 
                                style="border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 10px; 
                                       background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.05)); 
                                       display: block; margin: 0 auto;">
                        </canvas>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 8px; text-align: center;">
                            Every word's attention to every other word - this is the attention matrix!
                        </div>
                    </div>
                    
                    <!-- Real LLM Attention Explanation -->
                    <div style="padding: 20px; background: rgba(168, 85, 247, 0.08); border: 2px solid rgba(168, 85, 247, 0.3); border-radius: 12px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🧠</span>
                            <h3 style="font-size: 16px; color: var(--secondary); margin: 0; font-weight: 700;">How Real LLMs Use This Attention Matrix</h3>
                        </div>
                        
                        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 16px;">
                            <p style="margin-bottom: 12px;">
                                In your training data "<strong style="color: white;">${sentence}</strong>", an actual LLM would:
                            </p>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; margin-bottom: 12px;">
                                <div style="color: #22c55e; font-weight: 600; margin-bottom: 8px;">✓ What You Just Built:</div>
                                <ul style="margin: 0; padding-left: 20px; color: #9ca3af;">
                                    <li>An attention matrix (${words.length}×${words.length}) showing relationships</li>
                                    <li>Each word "looks at" other words with different weights</li>
                                    <li>High weights = strong contextual relationship in training data</li>
                                </ul>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(168, 85, 247, 0.1); border-radius: 8px; margin-bottom: 12px;">
                                <div style="color: var(--secondary); font-weight: 600; margin-bottom: 8px;">🤖 In Real LLMs:</div>
                                <ul style="margin: 0; padding-left: 20px; color: #9ca3af; line-height: 1.7;">
                                    <li><strong style="color: white;">Multi-Head Attention:</strong> Not just 1 matrix, but 12-96 parallel attention patterns (heads) capturing different relationships simultaneously</li>
                                    <li><strong style="color: white;">Computed via Math:</strong> Uses Query (Q), Key (K), Value (V) matrices:<br>
                                        <code style="color: #00d4ff; background: rgba(0,0,0,0.4); padding: 2px 6px; border-radius: 4px;">Attention(Q,K,V) = softmax(QK^T / √d_k) × V</code>
                                    </li>
                                    <li><strong style="color: white;">No Manual Setting:</strong> Weights learned from <em>billions</em> of training examples, not manually adjusted</li>
                                    <li><strong style="color: white;">Context Window:</strong> Modern LLMs compute attention for 4,000-128,000 tokens at once</li>
                                    <li><strong style="color: white;">Layer Stacking:</strong> This happens in <em>every layer</em> (24-96 layers), each building on previous attention patterns</li>
                                </ul>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(239, 68, 68, 0.08); border-radius: 8px;">
                                <div style="color: #ef4444; font-weight: 600; margin-bottom: 8px;">⚡ Example with Your Data:</div>
                                <p style="margin: 0; color: #9ca3af; line-height: 1.6;">
                                    When predicting the next word after "<strong style="color: white;">${sentence}</strong>", the LLM's attention would heavily weight contextually similar words (like you did!). 
                                    For instance, if "<strong style="color: #00d4ff;">${words[1] || 'cat'}</strong>" had high attention to "<strong style="color: #00d4ff;">${words[words.length-1] || 'mat'}</strong>", 
                                    the model "knows" (via learned weights) these words co-occur in training data. This contextual understanding powers generation!
                                </p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; padding-top: 12px; border-top: 1px solid rgba(168, 85, 247, 0.2);">
                            <span style="font-size: 12px; color: var(--secondary); font-weight: 600;">
                                💡 You just experienced the core mechanism that makes transformers work!
                            </span>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase3.nextSentence()" style="width: 100%; font-size: 16px; padding: 14px;">
                        Continue to Recap →
                    </button>
                    
                </div>
            </div>
        `;
        
        setTimeout(() => this.drawCompleteAttentionMap(words), 50);
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
        
        // Update controls
        document.getElementById('attentionControls').innerHTML = this.renderAttentionControls(words, idx);
        
        // Redraw canvas
        this.drawAttentionCanvas(words, idx);
        
        SoundManager.play('click');
    },
    
    setAttention(fromIdx, toIdx, value) {
        if (!this.attentionWeights[this.currentSentence][fromIdx]) {
            this.attentionWeights[this.currentSentence][fromIdx] = {};
        }
        this.attentionWeights[this.currentSentence][fromIdx][toIdx] = parseFloat(value);
        
        // Redraw canvas to show updated weights with animation
        const sentence = this.sentences[this.currentSentence];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 6);
        this.drawAttentionCanvas(words, this.selectedWord, toIdx); // Pass changed word index for animation
        
        SoundManager.play('click');
    },
    
    drawLinearAttention(words, focusedIdx, changedIdx = null) {
        const canvas = document.getElementById('attentionCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Linear layout - words in a horizontal line
        const padding = 60;
        const wordSpacing = (width - padding * 2) / (words.length - 1);
        const yPosition = height / 2;
        
        const positions = words.map((word, idx) => ({
            x: padding + idx * wordSpacing,
            y: yPosition,
            word: word,
            idx: idx
        }));
        
        // Get weights for focused word
        const weights = this.attentionWeights[focusedIdx] || {};
        
        // Draw curved connections FIRST (so they appear behind circles)
        positions.forEach((toPos) => {
            if (toPos.idx === focusedIdx) return;
            
            const weight = weights[toPos.idx] || 0.5;
            const fromPos = positions[focusedIdx];
            const isChanged = changedIdx === toPos.idx;
            
            // Calculate control point for bezier curve (arc upward or downward)
            const midX = (fromPos.x + toPos.x) / 2;
            const distance = Math.abs(toPos.x - fromPos.x);
            const curveHeight = distance * 0.3; // Arc height based on distance
            const controlY = yPosition - curveHeight; // Arc upward
            
            // Draw curved line
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.quadraticCurveTo(midX, controlY, toPos.x, toPos.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${weight * 0.9})`;
            ctx.lineWidth = (1 + weight * 5) * (isChanged ? 1.4 : 1);
            ctx.stroke();
            
            // Draw weight label at the curve's peak
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            const labelWidth = 32;
            const labelHeight = 18;
            ctx.fillRect(midX - labelWidth/2, controlY - labelHeight/2, labelWidth, labelHeight);
            
            ctx.fillStyle = weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#fbbf24' : '#9ca3af';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(weight.toFixed(1), midX, controlY);
        });
        
        // Draw word circles ON TOP
        positions.forEach((pos) => {
            const isFocused = pos.idx === focusedIdx;
            const isChanged = changedIdx === pos.idx;
            const radius = isFocused ? 32 : (isChanged ? 28 : 26);
            
            // Outer glow for focused word
            if (isFocused) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius + 6, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(191, 0, 255, 0.3)';
                ctx.fill();
            }
            
            // Pulse for changed word
            if (isChanged) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius + 2, 0, 2 * Math.PI);
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            
            // Main circle
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = isFocused ? 'rgba(191, 0, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
            ctx.fill();
            ctx.strokeStyle = isFocused ? '#bf00ff' : 'rgba(0, 212, 255, 0.8)';
            ctx.lineWidth = isFocused ? 4 : 2;
            ctx.stroke();
            
            // Word text
            ctx.fillStyle = 'white';
            ctx.font = isFocused ? 'bold 13px monospace' : 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Split long words
            const text = pos.word.length > 8 ? pos.word.substring(0, 7) + '..' : pos.word;
            ctx.fillText(text, pos.x, pos.y);
        });
    },
    
    drawCompleteAttentionMap(words) {
        const canvas = document.getElementById('completeAttentionCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Linear layout
        const padding = 60;
        const wordSpacing = (width - padding * 2) / (words.length - 1);
        const yPosition = height / 2;
        
        const positions = words.map((word, idx) => ({
            x: padding + idx * wordSpacing,
            y: yPosition,
            word: word,
            idx: idx
        }));
        
        // Draw ALL attention connections WITH WEIGHT LABELS
        words.forEach((fromWord, fromIdx) => {
            const weights = this.attentionWeights[fromIdx] || {};
            const fromPos = positions[fromIdx];
            
            Object.entries(weights).forEach(([toIdxStr, weight]) => {
                const toIdx = parseInt(toIdxStr);
                const toPos = positions[toIdx];
                
                // Calculate curve - alternate above/below to reduce overlap
            const midX = (fromPos.x + toPos.x) / 2;
                const distance = Math.abs(toPos.x - fromPos.x);
                const curveHeight = distance * 0.25;
                // Alternate curves: if fromIdx < toIdx go up, else go down
                const controlY = fromIdx < toIdx ? yPosition - curveHeight : yPosition + curveHeight;
                
                // Draw curved line
                ctx.beginPath();
                ctx.moveTo(fromPos.x, fromPos.y);
                ctx.quadraticCurveTo(midX, controlY, toPos.x, toPos.y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${weight * 0.6})`;
                ctx.lineWidth = 0.5 + weight * 2.5;
                ctx.stroke();
                
                // Draw weight label at the curve's peak
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                const labelWidth = 28;
                const labelHeight = 16;
                ctx.fillRect(midX - labelWidth/2, controlY - labelHeight/2, labelWidth, labelHeight);
                
                ctx.fillStyle = weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#fbbf24' : '#9ca3af';
                ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(weight.toFixed(1), midX, controlY);
            });
        });
        
        // Draw word circles on top
        positions.forEach((pos) => {
            const radius = 26;
            
            // Circle
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Word text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const text = pos.word.length > 8 ? pos.word.substring(0, 7) + '..' : pos.word;
            ctx.fillText(text, pos.x, pos.y);
        });
        
        // Add legend
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('All attention connections shown - notice how each word relates to all others!', width/2, height - 20);
    },
    
    nextSentence() {
        // Since we only have one sentence, this moves to recap
            Game.state.attentionWeights = this.attentionWeights;
            Game.addScore(250); // Mini-game completion bonus (fixed)
        SoundManager.play('powerup');
            this.currentStep = 'recap1';
            this.render(document.getElementById('phaseContainer'));
    },
    
    renderRecap1(container) {
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
                    <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 32px;">
                        <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">📊 What Just Happened:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 1.8;">
                            <li>You calculated <strong>${totalWeights} attention scores</strong> - how much each word "pays attention" to others</li>
                            <li>High scores = strong relationship based on <strong>training patterns</strong></li>
                            <li>This is <strong>matrix multiplication</strong> in real LLMs - pure math, no thinking</li>
                            <li>These weights are now <strong>stored</strong> for training</li>
                        </ul>
                    </div>
                    
                    <button class="btn-primary" onclick="phase3.nextRecapPage()" style="width: 100%; font-size: 17px; padding: 14px;">
                        Continue (1/2) →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    renderRecap2(container) {
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
                        Understanding your progress (2/2)
                    </p>
                    
                    <!-- Journey Checkpoint -->
                    <div style="padding: 24px; background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.08)); 
                               border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 14px; margin-bottom: 32px;">
                        <div style="text-align: center; margin-bottom: 16px;">
                            <span style="font-size: 32px;">🗺️</span>
                            <h3 style="font-size: 18px; color: #fbbf24; margin: 8px 0 0 0; font-weight: 700;">Journey Checkpoint</h3>
                        </div>
                        
                        <div style="display: grid; gap: 14px;">
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid #22c55e; border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: #22c55e; margin-bottom: 6px;">📍 Where You Are</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    Your tokens now have <strong>relationships</strong>. The attention mechanism calculated how much each token should "focus on" others based on their vector similarity.
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid var(--primary); border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: var(--primary); margin-bottom: 6px;">✅ What You Did</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    You computed ${totalWeights} attention scores through pure math (dot products, softmax). 
                                    "Chef" pays high attention to "cooked" because their vectors are similar - discovered from training data, not programmed!
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid var(--secondary); border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: var(--secondary); margin-bottom: 6px;">🎯 What's Next</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    <strong>Training a language model:</strong> Build a bigram model that learns "which words follow which" from your training data. 
                                    This creates the statistical patterns needed for text generation!
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid #fbbf24; border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: #fbbf24; margin-bottom: 6px;">💡 Why It Matters</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    Attention is the BREAKTHROUGH that made modern LLMs possible! It allows the model to dynamically focus on relevant context. 
                                    "The chef who trained in Paris cooked" - attention helps "cooked" focus on "chef", not just the nearest word "Paris".
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase3.completePhase()" style="width: 100%; font-size: 17px; padding: 14px;">
                        Continue to Training →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    nextRecapPage() {
        this.currentStep = 'recap2';
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
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
        // Mark phase complete with fixed transition bonus
        if (!Game.state.phaseCompleted[3]) {
            Game.state.phaseCompleted[3] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase3_transition']) {
            Game.addScore(100); // Phase transition bonus (fixed)
            Game.state.pointsAwarded['phase3_transition'] = true;
            Game.saveState();
        }
        
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

