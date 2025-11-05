// Phase 2: Embeddings - Connected to Stored Tokens
window.phase2 = {
    canvas: null,
    ctx: null,
    embeddings: {},
    selectedTokens: [],
    draggedToken: null,
    
    render(container) {
        // Check if we have tokens
        if (!Game.state.tokens || Game.state.tokens.length === 0) {
            container.innerHTML = '<p>Error: No tokens found. Please complete Phase 1 first.</p>';
            return;
        }
        
        // Select interesting tokens (skip spaces, get unique ones)
        this.selectTokensForEmbedding();
        
        // Generate embeddings automatically (in real LLM, these are learned from context)
        this.generateEmbeddings();
        
        this.renderEmbeddingsView(container);
    },
    
    selectTokensForEmbedding() {
        // Get unique tokens, excluding spaces and punctuation for visualization
        const allTokens = Game.state.tokens;
        const uniqueTokens = [...new Set(allTokens)].filter(t => 
            t.trim().length > 0 && !['.', ',', '!', '?'].includes(t)
        );
        
        // Take up to 10 tokens for visualization
        this.selectedTokens = uniqueTokens.slice(0, Math.min(10, uniqueTokens.length));
    },
    
    generateEmbeddings() {
        // In a real LLM, embeddings are learned from billions of examples
        // Here, we'll generate simple 2D vectors that cluster similar tokens
        
        // Define semantic groups (in reality, AI learns these patterns)
        const groups = {
            animals: ['cat', 'dog'],
            actions: ['sat', 'played', 'likes'],
            objects: ['mat', 'ball', 'fish', 'bones'],
            articles: ['A', 'The', 'a', 'the'],
            prepositions: ['on', 'with']
        };
        
        // Assign base positions for each group
        const groupPositions = {
            animals: { x: 0.2, y: 0.8 },
            actions: { x: 0.5, y: 0.6 },
            objects: { x: 0.7, y: 0.3 },
            articles: { x: 0.3, y: 0.3 },
            prepositions: { x: 0.6, y: 0.8 }
        };
        
        this.selectedTokens.forEach((token, index) => {
            // Find which group this token belongs to
            let group = 'other';
            for (const [groupName, words] of Object.entries(groups)) {
                if (words.some(w => w.toLowerCase() === token.toLowerCase())) {
                    group = groupName;
                    break;
                }
            }
            
            // Generate vector with small random variation
            const basePos = groupPositions[group] || { x: 0.5, y: 0.5 };
            const variation = 0.05;
            const vector = {
                x: basePos.x + (Math.random() - 0.5) * variation,
                y: basePos.y + (Math.random() - 0.5) * variation
            };
            
            this.embeddings[token] = vector;
        });
        
        // Store ALL embeddings in game state (including full vocabulary)
        // In reality, every token gets an embedding
        const allUniqueTokens = [...new Set(Game.state.tokens)];
        allUniqueTokens.forEach(token => {
            if (!this.embeddings[token]) {
                // Generate random embedding for tokens not in visualization
                this.embeddings[token] = {
                    x: Math.random(),
                    y: Math.random()
                };
            }
        });
        
        Game.state.embeddings = this.embeddings;
        Game.saveState();
    },
    
    renderEmbeddingsView(container) {
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Embeddings: Tokens → Numbers</h2>
                        <p class="phase-subtitle">Converting to mathematical vectors</p>
                    </div>
                    
                    <div class="phase-description">
                        Every token becomes a vector (list of numbers). Similar tokens get similar numbers - not because you "understand" them, but because they appeared in similar contexts during training.
                    </div>
                    
                    <div class="hint-section">
                        <h4>What You're Seeing</h4>
                        <p>Each dot is a token from YOUR data. Position = its embedding vector. Nearby tokens = similar patterns learned from training.</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px;">
                        <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> These vectors come from training on billions of words. You don't "know" that cat and dog are animals - you just learned they appear in similar contexts.
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Visualization Canvas -->
                        <div style="margin-bottom: 24px;">
                            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                                📊 Embedding Space (2D Visualization)
                            </h4>
                            <div style="width: 100%; max-width: 700px; margin: 0 auto; padding: 10px 0;">
                                <canvas id="embeddingCanvas" width="700" height="400" 
                                        style="display: block; border: 2px solid rgba(255,255,255,0.1); 
                                        border-radius: 10px; background: rgba(0,0,0,0.3); max-width: 100%;">
                                </canvas>
                            </div>
                            <p style="text-align: center; font-size: 12px; color: var(--text-secondary); margin-top: 12px;">
                                Hover over points to see token and vector values
                            </p>
                        </div>
                        
                        <!-- Token List with Vectors -->
                        <div style="margin-bottom: 24px;">
                            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                                🔢 Token Vectors
                            </h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px;">
                                ${this.selectedTokens.map(token => {
                                    const vec = this.embeddings[token];
                                    return `
                                        <div style="padding: 10px; background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); 
                                                   border-radius: 8px; text-align: center;">
                                            <div style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--primary); margin-bottom: 4px;">
                                                ${token}
                                            </div>
                                            <div style="font-size: 11px; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">
                                                [${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}]
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        
                        <!-- Stats -->
                        <div style="margin-bottom: 32px; padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center;">
                                <div>
                                    <div style="font-size: 28px; font-weight: 800; color: var(--primary);">${Object.keys(this.embeddings).length}</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Embeddings Created</div>
                                </div>
                                <div>
                                    <div style="font-size: 28px; font-weight: 800; color: var(--secondary);">2D</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Vector Dimensions</div>
                                </div>
                            </div>
                            <p style="font-size: 11px; color: var(--text-secondary); margin-top: 12px; text-align: center;">
                                Real LLMs use 768-4096 dimensions!
                            </p>
                        </div>
                        
                        <!-- Complete Button -->
                        <div style="text-align: center;">
                            <button class="btn-primary" onclick="phase2.completeEmbeddings()" style="padding: 14px 40px; font-size: 17px;">
                                Continue to Attention →
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
        
        // Draw canvas
        setTimeout(() => this.drawEmbeddings(), 100);
    },
    
    drawEmbeddings() {
        this.canvas = document.getElementById('embeddingCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        const padding = 40;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw axes
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.lineTo(width - padding, padding);
        this.ctx.stroke();
        
        // Draw axes labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.font = '11px Inter';
        this.ctx.fillText('Dimension 1 →', width - 100, height - 15);
        this.ctx.save();
        this.ctx.translate(15, padding + 80);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Dimension 2 →', 0, 0);
        this.ctx.restore();
        
        // Draw tokens
        this.selectedTokens.forEach(token => {
            const vec = this.embeddings[token];
            const x = padding + vec.x * (width - 2 * padding);
            const y = height - padding - vec.y * (height - 2 * padding);
            
            // Draw point
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw label
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.font = 'bold 12px JetBrains Mono';
            this.ctx.fillText(token, x + 8, y - 8);
        });
        
        // Add interactivity
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
    },
    
    handleHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const padding = 40;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Check if hovering over any token
        for (const token of this.selectedTokens) {
            const vec = this.embeddings[token];
            const x = padding + vec.x * (width - 2 * padding);
            const y = height - padding - vec.y * (height - 2 * padding);
            
            const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
            if (dist < 10) {
                this.canvas.style.cursor = 'pointer';
                return;
            }
        }
        
        this.canvas.style.cursor = 'default';
    },
    
    completeEmbeddings() {
        SoundManager.play('success');
        Game.addScore(100);
        
        // Confirm embeddings are saved
        console.log('✅ Embeddings created:', Game.state.embeddings);
        
        Game.completePhase(100, `Created embeddings for ${Object.keys(this.embeddings).length} tokens!`);
    }
};

