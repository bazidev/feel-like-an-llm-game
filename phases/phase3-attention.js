// Phase 3: Attention Mechanism - Learning to Focus
window.phase3 = {
    currentSentence: 0,
    score: 0,
    selectedWord: null,
    connections: [],
    
    sentences: [
        {
            words: ['The', 'cat', 'sat', 'on', 'the', 'mat'],
            focus: 'sat',
            correctAttention: ['cat', 'on', 'mat'],
            explanation: '"sat" needs to know WHO sat (cat), WHERE (on), and ON WHAT (mat)'
        },
        {
            words: ['She', 'gave', 'him', 'a', 'gift'],
            focus: 'gave',
            correctAttention: ['She', 'him', 'gift'],
            explanation: '"gave" needs to know WHO gave (She), TO WHOM (him), and WHAT (gift)'
        },
        {
            words: ['The', 'quick', 'brown', 'fox', 'jumps'],
            focus: 'fox',
            correctAttention: ['quick', 'brown', 'jumps'],
            explanation: '"fox" is described by "quick" and "brown", and performs the action "jumps"'
        }
    ],
    
    render(container) {
        this.currentSentence = 0;
        this.score = 0;
        this.connections = [];
        this.selectedWord = null;
        
        container.innerHTML = `
            <div class="phase">
                <!-- Left Sidebar -->
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Attention: Learning to Focus</h2>
                        <p class="phase-subtitle">Assign importance to context words</p>
                    </div>
                    
                    <div class="phase-description">
                        You can't understand a word alone. You calculate HOW MUCH each surrounding word matters. This is attention - giving mathematical weights to context.
                    </div>
                    
                    <div class="hint-section">
                        <h4>How It Works</h4>
                        <p>For the highlighted word, click other words to mark them as important. The AI doesn't "understand" relationships - it learns which word positions statistically matter together.</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> Attention isn't "thinking". It's matrix multiplication. You learned from millions of examples that certain word patterns co-occur, so you weight them mathematically.
                        </p>
                    </div>
                </div>
                
                <!-- Right Content Area -->
                <div class="phase-content">
                    <div style="width: 100%; max-width: 800px;">
                        <div style="margin-bottom: 16px;">
                            <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; text-align: center;">
                                Sentence <span id="sentenceCounter">1</span> / ${this.sentences.length} • Connections: <span id="connectionCounter" style="color: var(--primary);">0</span>
                            </p>
                            <div id="instruction" style="padding: 12px; background: rgba(255, 0, 255, 0.08); 
                                 border-left: 3px solid var(--secondary); border-radius: 6px; text-align: center; font-size: 13px;">
                                Click words that give context to the <span style="color: var(--secondary); font-weight: 600;">highlighted</span> word
                            </div>
                        </div>
                        
                        <div style="width: 100%; max-width: 820px; margin: 0 auto; padding: 10px 0;">
                            <canvas id="attentionCanvas" width="800" height="350" 
                                    style="display: block; border: 2px solid rgba(255,255,255,0.1); 
                                    border-radius: 10px; background: rgba(0,0,0,0.3); cursor: pointer; max-width: 100%;">
                            </canvas>
                        </div>
                        
                        <div style="margin-top: 16px; text-align: center; display: flex; gap: 12px; justify-content: center;">
                            <button class="btn-primary" onclick="phase3.checkAttention()" id="checkBtn">
                                ✓ Check Pattern
                            </button>
                            <button class="btn-secondary" onclick="phase3.resetSentence()">
                                🔄 Reset
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
    
    setupCanvas() {
        this.canvas = document.getElementById('attentionCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 900;
        this.canvas.height = 400;
        
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    },
    
    displaySentence() {
        const sentence = this.sentences[this.currentSentence];
        this.connections = [];
        this.selectedWord = null;
        
        // Position words
        const padding = 100;
        const spacing = (this.canvas.width - 2 * padding) / (sentence.words.length - 1);
        
        this.wordPositions = sentence.words.map((word, i) => ({
            word: word,
            x: padding + i * spacing,
            y: this.canvas.height / 2,
            isFocus: word === sentence.focus,
            isSelected: false
        }));
        
        document.getElementById('sentenceCounter').textContent = 
            `${this.currentSentence + 1} / ${this.sentences.length}`;
        document.getElementById('connectionCounter').textContent = '0';
        document.getElementById('feedback').innerHTML = '';
        
        this.draw();
    },
    
    draw() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        const focusWord = this.wordPositions.find(w => w.isFocus);
        this.connections.forEach(targetWord => {
            this.ctx.beginPath();
            this.ctx.moveTo(focusWord.x, focusWord.y);
            this.ctx.lineTo(targetWord.x, targetWord.y);
            
            // Create gradient for line
            const gradient = this.ctx.createLinearGradient(
                focusWord.x, focusWord.y, targetWord.x, targetWord.y
            );
            gradient.addColorStop(0, 'rgba(255, 0, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0.8)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // Draw arrowhead
            const angle = Math.atan2(targetWord.y - focusWord.y, targetWord.x - focusWord.x);
            const arrowSize = 10;
            this.ctx.beginPath();
            this.ctx.moveTo(targetWord.x, targetWord.y);
            this.ctx.lineTo(
                targetWord.x - arrowSize * Math.cos(angle - Math.PI / 6),
                targetWord.y - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            this.ctx.lineTo(
                targetWord.x - arrowSize * Math.cos(angle + Math.PI / 6),
                targetWord.y - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            this.ctx.closePath();
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
            this.ctx.fill();
        });
        
        // Draw words
        this.wordPositions.forEach(wordPos => {
            // Draw circle
            this.ctx.beginPath();
            this.ctx.arc(wordPos.x, wordPos.y, 40, 0, Math.PI * 2);
            
            if (wordPos.isFocus) {
                // Focus word - bright glow
                this.ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
                this.ctx.shadowColor = '#ff00ff';
                this.ctx.shadowBlur = 20;
            } else if (this.connections.includes(wordPos)) {
                // Connected word
                this.ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
                this.ctx.shadowBlur = 0;
            } else {
                // Normal word
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            this.ctx.strokeStyle = wordPos.isFocus ? 
                'rgba(255, 0, 255, 1)' : 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = wordPos.isFocus ? 3 : 2;
            this.ctx.stroke();
            
            // Draw text
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = wordPos.isFocus ? 'bold 18px Inter' : '16px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(wordPos.word, wordPos.x, wordPos.y);
        });
    },
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    },
    
    handleClick(e) {
        const pos = this.getMousePos(e);
        
        // Check if clicked on a word (not the focus word)
        const clickedWord = this.wordPositions.find(wordPos => {
            if (wordPos.isFocus) return false;
            const dx = pos.x - wordPos.x;
            const dy = pos.y - wordPos.y;
            return Math.sqrt(dx * dx + dy * dy) < 40;
        });
        
        if (clickedWord) {
            // Toggle connection
            const index = this.connections.indexOf(clickedWord);
            if (index > -1) {
                this.connections.splice(index, 1);
            } else {
                this.connections.push(clickedWord);
            }
            
            document.getElementById('connectionCounter').textContent = this.connections.length;
            SoundManager.play('click');
            this.draw();
        }
    },
    
    checkAttention() {
        const sentence = this.sentences[this.currentSentence];
        const userConnections = this.connections.map(w => w.word);
        const correctConnections = sentence.correctAttention;
        
        // Check if user selected the correct words
        const correct = correctConnections.every(word => userConnections.includes(word)) &&
                       userConnections.every(word => correctConnections.includes(word));
        
        const feedback = document.getElementById('feedback');
        
        if (correct) {
            feedback.innerHTML = `
                <div class="success-message">
                    ✓ Perfect attention! ${sentence.explanation}
                </div>
            `;
            
            const points = 200;
            Game.addScore(points);
            this.score += points;
            SoundManager.play('success');
            
            setTimeout(() => {
                if (this.currentSentence < this.sentences.length - 1) {
                    this.currentSentence++;
                    this.displaySentence();
                } else {
                    Game.completePhase(this.score, 
                        "Outstanding! You've mastered the attention mechanism!");
                }
            }, 2500);
        } else {
            // Give helpful feedback
            const missing = correctConnections.filter(w => !userConnections.includes(w));
            const extra = userConnections.filter(w => !correctConnections.includes(w));
            
            let message = '✗ Not quite right. ';
            if (missing.length > 0) {
                message += `Missing: ${missing.join(', ')}. `;
            }
            if (extra.length > 0) {
                message += `Remove: ${extra.join(', ')}.`;
            }
            
            feedback.innerHTML = `<div class="error-message">${message}</div>`;
            SoundManager.play('error');
        }
    },
    
    resetSentence() {
        this.displaySentence();
        SoundManager.play('click');
    }
};

