// Phase 2: Embeddings - Numbers, Not Understanding
window.phase2 = {
    canvas: null,
    ctx: null,
    words: [],
    draggedWord: null,
    score: 0,
    round: 0,
    maxRounds: 2,
    savedState: null, // Store placements when leaving phase
    
    rounds: [
        {
            words: [
                { word: 'cat', category: 'animal', ideal: { x: 200, y: 200 }, vector: '[0.2, 0.8]' },
                { word: 'dog', category: 'animal', ideal: { x: 240, y: 210 }, vector: '[0.25, 0.82]' },
                { word: 'puppy', category: 'animal', ideal: { x: 250, y: 220 }, vector: '[0.28, 0.85]' },
                { word: 'car', category: 'vehicle', ideal: { x: 600, y: 200 }, vector: '[0.7, 0.3]' },
                { word: 'truck', category: 'vehicle', ideal: { x: 640, y: 210 }, vector: '[0.75, 0.28]' },
                { word: 'vehicle', category: 'vehicle', ideal: { x: 660, y: 220 }, vector: '[0.78, 0.25]' }
            ],
            instruction: 'Group similar PATTERNS together - AI sees numbers, not meanings'
        },
        {
            words: [
                { word: 'play', category: 'action', ideal: { x: 200, y: 150 }, vector: '[0.3, 0.6]' },
                { word: 'playing', category: 'action', ideal: { x: 230, y: 155 }, vector: '[0.32, 0.62]' },
                { word: 'played', category: 'action', ideal: { x: 250, y: 160 }, vector: '[0.35, 0.64]' },
                { word: 'happy', category: 'positive', ideal: { x: 600, y: 150 }, vector: '[0.8, 0.7]' },
                { word: 'happiness', category: 'positive', ideal: { x: 630, y: 155 }, vector: '[0.82, 0.72]' },
                { word: 'joyful', category: 'positive', ideal: { x: 660, y: 160 }, vector: '[0.85, 0.74]' },
                { word: 'sad', category: 'negative', ideal: { x: 400, y: 350 }, vector: '[0.5, 0.2]' },
                { word: 'angry', category: 'negative', ideal: { x: 430, y: 355 }, vector: '[0.48, 0.18]' }
            ],
            instruction: 'Token patterns: similar tokens = close vectors. This is math, not understanding!'
        }
    ],
    
    render(container) {
        // Restore state if returning to this phase
        if (!this.savedState) {
            this.round = 0;
            this.score = 0;
        } else {
            this.round = this.savedState.round;
            this.score = this.savedState.score;
        }
        
        container.innerHTML = `
            <div class="phase">
                <!-- Left Sidebar -->
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Embeddings: Vectors, Not Meanings</h2>
                        <p class="phase-subtitle">Tokens become numbers</p>
                    </div>
                    
                    <div class="phase-description">
                        <strong>You don't understand language.</strong> You convert tokens into vectors (lists of numbers). Similar patterns get similar vectors.
                    </div>
                    
                    <div class="hint-section">
                        <h4>How It Works</h4>
                        <p>Each token = a point in space. "cat" [0.2, 0.8] is near "dog" [0.25, 0.82] because the numbers are close. No understanding - just math!</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Key Insight:</strong> You're a blind machine calculating distances between numbers. "Cat" and "dog" aren't "animals" to you - they're just vectors that happen to be close in mathematical space.
                        </p>
                    </div>
                </div>
                
                <!-- Right Content Area -->
                <div class="phase-content">
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <span style="color: var(--text-secondary);">Round:</span>
                            <span id="roundCounter" class="glow-text" style="font-size: 20px; margin-left: 10px;">
                                1 / ${this.maxRounds}
                            </span>
                        </div>
                        <div>
                            <span style="color: var(--text-secondary);">Accuracy:</span>
                            <span id="accuracyDisplay" style="font-size: 20px; margin-left: 10px; color: var(--success);">
                                0%
                            </span>
                        </div>
                    </div>
                    
                    <div id="instruction" style="padding: 15px; background: rgba(0, 212, 255, 0.1); 
                         border-left: 3px solid var(--primary); margin-bottom: 20px; border-radius: 5px;">
                    </div>
                    
                    <div style="width: 100%; max-width: 820px; margin: 0 auto; padding: 10px 0;">
                        <canvas id="embeddingCanvas" width="800" height="500" 
                                style="display: block; border: 2px solid rgba(255,255,255,0.1); 
                                border-radius: 10px; background: rgba(0,0,0,0.3); cursor: move; max-width: 100%;">
                        </canvas>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button class="btn-primary" onclick="phase2.checkPlacement()">
                            ✓ Check Placement
                        </button>
                        <button class="btn-secondary" onclick="phase2.resetRound()" style="margin-left: 10px;">
                            🔄 Reset
                        </button>
                    </div>
                    
                    <div id="feedback" style="margin-top: 20px; text-align: center; min-height: 30px;"></div>
                </div>
                
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.setupCanvas();
            this.startRound();
        }, 100);
    },
    
    setupCanvas() {
        this.canvas = document.getElementById('embeddingCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Set actual canvas size
        this.canvas.width = 800;
        this.canvas.height = 500;
        
        // Setup mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
    },
    
    startRound() {
        const roundData = this.rounds[this.round];
        document.getElementById('instruction').textContent = roundData.instruction;
        document.getElementById('roundCounter').textContent = `${this.round + 1} / ${this.maxRounds}`;
        document.getElementById('feedback').innerHTML = '';
        
        // Restore saved positions if available, otherwise use random
        if (this.savedState && this.savedState.words && this.savedState.round === this.round) {
            this.words = this.savedState.words.map(w => ({
                ...w,
                radius: 40
            }));
        } else {
            // Initialize words with random starting positions
            this.words = roundData.words.map(w => ({
                ...w,
                x: Math.random() * 600 + 100,
                y: Math.random() * 300 + 100,
                radius: 40
            }));
        }
        
        this.draw();
    },
    
    saveCurrentState() {
        // Save current placements
        this.savedState = {
            round: this.round,
            score: this.score,
            words: this.words.map(w => ({ ...w }))
        };
    },
    
    draw() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
        
        // Draw connections between similar words
        this.words.forEach((word1, i) => {
            this.words.forEach((word2, j) => {
                if (i < j && word1.category === word2.category) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(word1.x, word1.y);
                    this.ctx.lineTo(word2.x, word2.y);
                    this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        // Draw words
        this.words.forEach(word => {
            // Draw circle
            this.ctx.beginPath();
            this.ctx.arc(word.x, word.y, word.radius, 0, Math.PI * 2);
            
            if (word === this.draggedWord) {
                this.ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
            } else {
                this.ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
            }
            this.ctx.fill();
            
            this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw text (token)
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 14px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(word.word, word.x, word.y - 5);
            
            // Draw vector below
            if (word.vector) {
                this.ctx.fillStyle = '#00f5ff';
                this.ctx.font = '10px JetBrains Mono';
                this.ctx.fillText(word.vector, word.x, word.y + 15);
            }
        });
        
        requestAnimationFrame(() => this.draw());
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
    
    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        
        // Check if clicked on a word
        this.draggedWord = this.words.find(word => {
            const dx = pos.x - word.x;
            const dy = pos.y - word.y;
            return Math.sqrt(dx * dx + dy * dy) < word.radius;
        });
        
        if (this.draggedWord) {
            SoundManager.play('click');
        }
    },
    
    handleMouseMove(e) {
        if (this.draggedWord) {
            const pos = this.getMousePos(e);
            this.draggedWord.x = Math.max(50, Math.min(this.canvas.width - 50, pos.x));
            this.draggedWord.y = Math.max(50, Math.min(this.canvas.height - 50, pos.y));
            this.draw();
        }
    },
    
    handleMouseUp() {
        if (this.draggedWord) {
            this.draggedWord = null;
            this.saveCurrentState(); // Save placements when dropping a word
        }
    },
    
    checkPlacement() {
        let totalError = 0;
        const roundData = this.rounds[this.round];
        
        this.words.forEach((word, i) => {
            const ideal = roundData.words[i].ideal;
            const dx = word.x - ideal.x;
            const dy = word.y - ideal.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            totalError += distance;
        });
        
        // Calculate accuracy with more forgiving threshold
        const maxError = 1000; // More forgiving with more words
        const avgError = totalError / this.words.length;
        const accuracy = Math.max(0, Math.min(100, 100 - (avgError / maxError * 100)));
        
        document.getElementById('accuracyDisplay').textContent = `${Math.round(accuracy)}%`;
        
        const feedback = document.getElementById('feedback');
        
        // Lower threshold for more words
        if (accuracy >= 50) {
            feedback.innerHTML = `<div class="success-message">✓ Pattern recognized! Accuracy: ${Math.round(accuracy)}%</div>`;
            const points = Math.round(accuracy * 2);
            Game.addScore(points);
            this.score += points;
            SoundManager.play('success');
            
            setTimeout(() => {
                if (this.round < this.maxRounds - 1) {
                    this.round++;
                    this.startRound();
                } else {
                    Game.completePhase(this.score, 
                        "Good! You see how tokens cluster by patterns, not meanings!");
                }
            }, 2000);
        } else {
            feedback.innerHTML = `<div class="error-message">Try grouping similar TOKENS closer. Look at the vectors!</div>`;
            SoundManager.play('error');
        }
    },
    
    resetRound() {
        this.startRound();
        document.getElementById('accuracyDisplay').textContent = '0%';
        SoundManager.play('click');
    }
};

