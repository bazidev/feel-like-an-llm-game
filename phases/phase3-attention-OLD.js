// Phase 3: Attention - Connected to Training Data
window.phase3 = {
    canvas: null,
    ctx: null,
    tokens: [],
    positions: [],
    connections: [],
    selectedWord: null,
    currentSentence: 0,
    score: 0,
    
    render(container) {
        // Get tokens from training data
        if (!Game.state.tokens || Game.state.tokens.length === 0) {
            container.innerHTML = '<p>Error: No tokens found.</p>';
            return;
        }
        
        // Build sentences from tokens for attention practice
        this.buildSentences();
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Attention: Learning Context</h2>
                        <p class="phase-subtitle">Calculate importance weights</p>
                    </div>
                    
                    <div class="phase-description">
                        You don't "understand" relationships. You calculate HOW MUCH each word matters to other words. This is attention - mathematical weights on context.
                    </div>
                    
                    <div class="hint-section">
                        <h4>How It Works</h4>
                        <p>For each word, calculate attention scores to other words. High score = important context. Low score = ignore. Pure math!</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> Attention isn't thinking. It's matrix multiplication. You learned from millions of examples that certain word positions statistically matter together.
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <div style="margin-bottom: 20px; text-align: center;">
                            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                                Sentence <span id="sentenceCounter">1</span> / ${this.sentences.length}
                            </p>
                            <div id="instruction" style="padding: 14px; background: rgba(255, 0, 255, 0.08); 
                                 border-left: 3px solid var(--secondary); border-radius: 8px; font-size: 14px; text-align: center;">
                                Click the <span style="color: var(--secondary); font-weight: 700;">highlighted word</span>, then click words that give it context
                            </div>
                        </div>
                        
                        <div style="width: 100%; max-width: 720px; margin: 0 auto; padding: 10px 0;">
                            <canvas id="attentionCanvas" width="700" height="280" 
                                    style="display: block; border: 2px solid rgba(255,255,255,0.1); 
                                    border-radius: 10px; background: rgba(0,0,0,0.3); cursor: pointer; max-width: 100%;">
                            </canvas>
                        </div>
                        
                        <div style="margin-top: 20px; text-align: center; display: flex; gap: 12px; justify-content: center;">
                            <button class="btn-primary" onclick="phase3.nextSentence()" id="nextBtn">
                                Next Sentence →
                            </button>
                            <button class="btn-secondary" onclick="phase3.resetSentence()">
                                Reset
                            </button>
                        </div>
                        
                        <div id="feedback" style="margin-top: 16px; padding: 14px; border-radius: 8px; min-height: 50px; display: none;"></div>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.setupCanvas();
            this.displaySentence();
        }, 100);
    },
    
    buildSentences() {
        // Split tokens into sentences (at periods)
        const tokens = Game.state.tokens;
        this.sentences = [];
        let currentSentence = [];
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            currentSentence.push(token);
            
            if (token === '.') {
                // Remove spaces for cleaner display
                const cleaned = currentSentence.filter(t => t !== ' ');
                if (cleaned.length > 2) { // Must have at least 3 tokens
                    this.sentences.push({
                        tokens: cleaned,
                        targetWord: this.pickTargetWord(cleaned)
                    });
                }
                currentSentence = [];
            }
        }
        
        // Take first 3 sentences for the exercise
        this.sentences = this.sentences.slice(0, 3);
        this.currentSentence = 0;
    },
    
    pickTargetWord(tokens) {
        // Pick a meaningful word (not period, not article)
        const meaningful = tokens.filter((t, i) => 
            t !== '.' && !['A', 'The', 'a', 'the'].includes(t) && i > 0
        );
        return meaningful.length > 0 ? meaningful[Math.floor(Math.random() * meaningful.length)] : tokens[1];
    },
    
    setupCanvas() {
        this.canvas = document.getElementById('attentionCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    },
    
    displaySentence() {
        if (!this.canvas || !this.sentences[this.currentSentence]) return;
        
        const sentence = this.sentences[this.currentSentence];
        this.tokens = sentence.tokens;
        const targetWord = sentence.targetWord;
        
        // Position words
        const padding = 40;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const spacing = Math.min(100, (width - 2 * padding) / this.tokens.length);
        
        this.positions = this.tokens.map((token, i) => ({
            token,
            x: padding + i * spacing + spacing / 2,
            y: height / 2,
            isTarget: token === targetWord,
            isSelected: false
        }));
        
        this.connections = [];
        this.selectedWord = null;
        
        // Update counter
        const counter = document.getElementById('sentenceCounter');
        if (counter) counter.textContent = this.currentSentence + 1;
        
        this.draw();
    },
    
    draw() {
        if (!this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        this.ctx.strokeStyle = 'rgba(255, 0, 255, 0.4)';
        this.ctx.lineWidth = 2;
        this.connections.forEach(conn => {
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.stroke();
            
            // Draw weight
            const midX = (conn.from.x + conn.to.x) / 2;
            const midY = (conn.from.y + conn.to.y) / 2 - 10;
            this.ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
            this.ctx.font = 'bold 12px Inter';
            this.ctx.fillText(conn.weight.toFixed(2), midX, midY);
        });
        
        // Draw words
        this.positions.forEach(pos => {
            // Circle
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
            
            if (pos.isTarget) {
                this.ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
                this.ctx.fill();
                this.ctx.strokeStyle = 'rgba(255, 0, 255, 1)';
                this.ctx.lineWidth = 3;
            } else if (pos.isSelected) {
                this.ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
                this.ctx.fill();
                this.ctx.strokeStyle = 'rgba(0, 212, 255, 1)';
                this.ctx.lineWidth = 2;
            } else {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.fill();
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 1;
            }
            this.ctx.stroke();
            
            // Text
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px JetBrains Mono';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(pos.token, pos.x, pos.y + 5);
        });
    },
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Find clicked word
        for (const pos of this.positions) {
            const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (dist < 25) {
                if (pos.isTarget) {
                    this.selectedWord = pos;
                    SoundManager.play('click');
                } else if (this.selectedWord && !pos.isTarget) {
                    // Add connection
                    const weight = 0.7 + Math.random() * 0.3; // Simulate attention weight
                    this.connections.push({
                        from: this.selectedWord,
                        to: pos,
                        weight
                    });
                    pos.isSelected = true;
                    SoundManager.play('success');
                }
                this.draw();
                break;
            }
        }
    },
    
    nextSentence() {
        if (this.connections.length < 2) {
            const feedback = document.getElementById('feedback');
            feedback.style.display = 'block';
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = '<strong>Not enough connections!</strong> Click the highlighted word, then click at least 2 context words.';
            SoundManager.play('error');
            return;
        }
        
        // Store attention weights
        this.storeAttentionWeights();
        
        this.currentSentence++;
        if (this.currentSentence >= this.sentences.length) {
            this.completeAttention();
        } else {
            this.displaySentence();
            document.getElementById('feedback').style.display = 'none';
        }
    },
    
    resetSentence() {
        this.connections = [];
        this.positions.forEach(p => p.isSelected = false);
        this.selectedWord = null;
        this.draw();
        SoundManager.play('click');
    },
    
    storeAttentionWeights() {
        const sentence = this.sentences[this.currentSentence];
        const targetWord = sentence.targetWord;
        
        if (!Game.state.attentionWeights[targetWord]) {
            Game.state.attentionWeights[targetWord] = {};
        }
        
        this.connections.forEach(conn => {
            Game.state.attentionWeights[targetWord][conn.to.token] = conn.weight;
        });
        
        Game.saveState();
    },
    
    completeAttention() {
        SoundManager.play('success');
        Game.addScore(150);
        
        console.log('✅ Attention weights stored:', Game.state.attentionWeights);
        
        Game.completePhase(150, `Calculated attention weights for ${Object.keys(Game.state.attentionWeights).length} words!`);
    }
};

