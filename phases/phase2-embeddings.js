// Phase 2: Embeddings - USER GROUPS TOKENS (DRAG & DROP)
window.phase2 = {
    currentStep: 'intro', // 'intro' -> 'examples' -> 'group' -> 'recap'
    currentExample: 0,
    tokenGroups: {},
    targetGroups: {},
    
    // Tutorial examples - 2D canvas with vectors!
    exampleSets: [
        {
            title: "Position tokens by vector similarity",
            description: "Drag tokens with similar vectors close together in 2D space",
            tokens: [
                { word: "dog", vector: [0.8, 0.7], color: "#22c55e" },
                { word: "cat", vector: [0.75, 0.65], color: "#22c55e" },
                { word: "happy", vector: [0.3, 0.9], color: "#3b82f6" },
                { word: "sad", vector: [0.25, 0.85], color: "#3b82f6" }
            ],
            hint: "dog & cat have similar vectors [0.8, 0.7] ≈ [0.75, 0.65]. happy & sad have similar vectors [0.3, 0.9] ≈ [0.25, 0.85]"
        },
        {
            title: "Cluster similar contexts",
            description: "Tokens from similar contexts have close vector values",
            tokens: [
                { word: "chef", vector: [0.2, 0.8], color: "#f59e0b" },
                { word: "cooked", vector: [0.25, 0.75], color: "#f59e0b" },
                { word: "player", vector: [0.85, 0.3], color: "#8b5cf6" },
                { word: "kicked", vector: [0.8, 0.35], color: "#8b5cf6" }
            ],
            hint: "chef & cooked have similar vectors (food context). player & kicked have similar vectors (sports context)"
        }
    ],
    
    // Canvas state for examples
    canvasState: {
        dragging: null,
        positions: {}
    },
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'examples') {
            this.renderExamples(container);
        } else if (this.currentStep === 'group') {
            this.renderGrouping(container);
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
                        📊 Embeddings: Tokens → Numbers
                    </h1>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 32px;">
                        Convert tokens to mathematical vectors
                    </p>
                    
                    <!-- Explanation Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">🔢</span>
                            <h3 style="font-size: 18px; color: var(--primary); margin: 0;">How Embeddings Work</h3>
                        </div>
                        <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin: 0;">
                            Every token becomes a <strong>vector</strong> (list of numbers). Similar tokens get similar vectors - NOT because you "understand" them, but because they appeared in <strong>similar contexts</strong> during training. You don't know "cat" and "dog" are animals - you just learned they appear near similar words.
                        </p>
                    </div>
                    
                    <!-- Your Task -->
                    <div style="padding: 20px; background: rgba(191, 0, 255, 0.08); border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">🎯 Your Task</h3>
                        <p style="font-size: 14px; color: var(--text-secondary); margin: 0;">
                            Group tokens that appeared in <strong>similar positions</strong> or <strong>contexts</strong> in your training data. Not by meaning - by pattern!
                        </p>
                    </div>
                    
                    <!-- Reality Check -->
                    <div style="padding: 16px; background: rgba(239, 68, 68, 0.08); border: 2px solid rgba(239, 68, 68, 0.25); 
                               border-radius: 12px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <span style="font-size: 18px;">⚡</span>
                            <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                Reality Check: You're matching patterns, not meanings. "Chef" and "pasta" appear together - that's all you know.
                            </span>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase2.startGrouping()" 
                            style="font-size: 17px; padding: 14px 40px;">
                        🚀 Start Grouping Tokens
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    startGrouping() {
        this.currentStep = 'examples';
        this.currentExample = 0;
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderExamples(container) {
        const example = this.exampleSets[this.currentExample];
        
        // Initialize random positions if not set
        if (!this.canvasState.positions[this.currentExample]) {
            this.canvasState.positions[this.currentExample] = {};
            example.tokens.forEach(token => {
                this.canvasState.positions[this.currentExample][token.word] = {
                    x: Math.random() * 400 + 50,
                    y: Math.random() * 250 + 50
                };
            });
        }
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">${example.title}</h2>
                        <p class="phase-subtitle">Example ${this.currentExample + 1} of ${this.exampleSets.length}</p>
                    </div>
                    
                    <div class="phase-description">
                        ${example.description}. Similar vectors should be close in 2D space!
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 Vector hint</h4>
                        <p style="font-size: 12px; line-height: 1.6;">${example.hint}</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 16px;">
                        <p style="font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality check:</strong> Distance in 2D space = vector similarity = appeared in similar contexts!
                        </p>
                    </div>
                    
                    <div style="margin-top: 16px; padding: 12px; background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 8px;">
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">📐 Vector format:</div>
                        <div style="font-size: 12px; font-family: 'JetBrains Mono', monospace; color: var(--primary);">
                            [x, y] = [dimension1, dimension2]
                        </div>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 600px;">
                        
                        <div style="margin-bottom: 16px; text-align: center;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
                                🎯 Drag tokens close together if their vectors are similar
                            </div>
                        </div>
                        
                        <!-- 2D Canvas -->
                        <div style="position: relative; margin-bottom: 20px;">
                            <canvas id="embeddingCanvas" width="600" height="400" 
                                    style="border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; 
                                           background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.05)); 
                                           cursor: move;">
                            </canvas>
                        </div>
                        
                        <button class="btn-primary" onclick="phase2.checkExampleCanvas()" style="width: 100%;">
                            Check my positioning
                        </button>
                        
                        <div id="feedback" style="display: none; margin-top: 16px; padding: 16px; border-radius: 10px;"></div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.setupCanvasDragDrop();
    },
    
    setupCanvasDragDrop() {
        setTimeout(() => {
            const canvas = document.getElementById('embeddingCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const example = this.exampleSets[this.currentExample];
            const positions = this.canvasState.positions[this.currentExample];
            const tokenRadius = 35;
            
            // Draw function
            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw grid
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 1;
                for (let i = 0; i < canvas.width; i += 50) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, canvas.height);
                    ctx.stroke();
                }
                for (let i = 0; i < canvas.height; i += 50) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(canvas.width, i);
                    ctx.stroke();
                }
                
                // Draw tokens
                example.tokens.forEach(token => {
                    const pos = positions[token.word];
                    
                    // Circle
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, tokenRadius, 0, Math.PI * 2);
                    ctx.fillStyle = token.color + '40';
                    ctx.fill();
                    ctx.strokeStyle = token.color;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // Word
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 14px "JetBrains Mono", monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(token.word, pos.x, pos.y - 8);
                    
                    // Vector
                    ctx.fillStyle = token.color;
                    ctx.font = '11px "JetBrains Mono", monospace';
                    ctx.fillText(`[${token.vector[0]}, ${token.vector[1]}]`, pos.x, pos.y + 10);
                });
            };
            
            // Mouse interaction
            let isDragging = false;
            let dragToken = null;
            
            canvas.addEventListener('mousedown', (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Check if clicked on a token
                example.tokens.forEach(token => {
                    const pos = positions[token.word];
                    const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                    if (dist < tokenRadius) {
                        isDragging = true;
                        dragToken = token.word;
                        canvas.style.cursor = 'grabbing';
                    }
                });
            });
            
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (isDragging && dragToken) {
                    // Update position
                    positions[dragToken].x = Math.max(tokenRadius, Math.min(canvas.width - tokenRadius, x));
                    positions[dragToken].y = Math.max(tokenRadius, Math.min(canvas.height - tokenRadius, y));
                    draw();
                } else {
                    // Check hover
                    let hovering = false;
                    example.tokens.forEach(token => {
                        const pos = positions[token.word];
                        const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                        if (dist < tokenRadius) {
                            hovering = true;
                        }
                    });
                    canvas.style.cursor = hovering ? 'grab' : 'default';
                }
            });
            
            canvas.addEventListener('mouseup', () => {
                if (isDragging) {
                    SoundManager.play('click');
                }
                isDragging = false;
                dragToken = null;
                canvas.style.cursor = 'default';
            });
            
            canvas.addEventListener('mouseleave', () => {
                isDragging = false;
                dragToken = null;
                canvas.style.cursor = 'default';
            });
            
            // Initial draw
            draw();
        }, 100);
    },
    
    checkExampleCanvas() {
        const example = this.exampleSets[this.currentExample];
        const positions = this.canvasState.positions[this.currentExample];
        const feedback = document.getElementById('feedback');
        
        // Calculate distances between tokens with same color (similar vectors)
        const groups = {};
        example.tokens.forEach(token => {
            if (!groups[token.color]) groups[token.color] = [];
            groups[token.color].push(token.word);
        });
        
        let allGood = true;
        let message = '';
        
        // Check each group - tokens in same group should be close
        Object.values(groups).forEach(group => {
            if (group.length === 2) {
                const [token1, token2] = group;
                const pos1 = positions[token1];
                const pos2 = positions[token2];
                const distance = Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
                
                if (distance > 150) {
                    allGood = false;
                    message = `"${token1}" and "${token2}" have similar vectors but are too far apart! Try moving them closer.`;
                }
            }
        });
        
        // Check different groups should be far apart
        const groupColors = Object.keys(groups);
        if (groupColors.length === 2) {
            const group1Tokens = groups[groupColors[0]];
            const group2Tokens = groups[groupColors[1]];
            
            // Calculate center of each group
            const center1 = {
                x: group1Tokens.reduce((sum, t) => sum + positions[t].x, 0) / group1Tokens.length,
                y: group1Tokens.reduce((sum, t) => sum + positions[t].y, 0) / group1Tokens.length
            };
            const center2 = {
                x: group2Tokens.reduce((sum, t) => sum + positions[t].x, 0) / group2Tokens.length,
                y: group2Tokens.reduce((sum, t) => sum + positions[t].y, 0) / group2Tokens.length
            };
            
            const groupDistance = Math.sqrt((center1.x - center2.x) ** 2 + (center1.y - center2.y) ** 2);
            
            if (allGood && groupDistance < 120) {
                allGood = false;
                message = 'The two groups have different vectors, so they should be farther apart!';
            }
        }
        
        feedback.style.display = 'block';
        
        if (allGood) {
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #22c55e; font-weight: 700; margin-bottom: 8px;">✓ Perfect positioning!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    You correctly clustered similar vectors close together! Distance in 2D space = vector similarity.
                </div>
            `;
            SoundManager.play('success');
            Game.addScore(40);
            
            setTimeout(() => {
                if (this.currentExample < this.exampleSets.length - 1) {
                    this.currentExample++;
                    this.render(document.getElementById('phaseContainer'));
                } else {
                    this.currentStep = 'group';
                    this.initializeGroups();
                    this.render(document.getElementById('phaseContainer'));
                }
            }, 2500);
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #ef4444; font-weight: 700; margin-bottom: 8px;">Keep adjusting!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    ${message}
                </div>
            `;
            SoundManager.play('error');
        }
    },
    
    initializeGroups() {
        const tokens = Game.state.tokens;
        const uniqueTokens = [...new Set(tokens)].filter(t => t.trim() && !/^[.,!?]$/.test(t)).slice(0, 12);
        
        // Define target groups based on training data patterns
        this.targetGroups = {
            'subjects': [],  // Who does actions
            'actions': [],   // Verbs
            'objects': [],   // What's acted upon
            'other': []
        };
        
        // Auto-categorize based on common patterns
        uniqueTokens.forEach(token => {
            const t = token.toLowerCase();
            if (['the', 'chef', 'pasta', 'pizza', 'player', 'team', 'ball', 'programmer', 'computer', 'cat', 'dog', 'rocket', 'astronaut'].includes(t)) {
                if (['chef', 'player', 'programmer', 'cat', 'dog', 'rocket', 'astronaut', 'team'].includes(t)) {
                    this.targetGroups.subjects.push(token);
                } else if (['pasta', 'pizza', 'ball', 'computer'].includes(t)) {
                    this.targetGroups.objects.push(token);
                }
            } else if (['cooked', 'played', 'kicked', 'scored', 'loves', 'tastes', 'wrote', 'processed', 'launched', 'floated'].includes(t)) {
                this.targetGroups.actions.push(token);
            } else if (['fresh', 'Italian', 'delicious', 'clean', 'new'].includes(t)) {
                this.targetGroups.other.push(token);
            } else {
                this.targetGroups.other.push(token);
            }
        });
        
        this.tokenGroups = {
            'subjects': [],
            'actions': [],
            'objects': [],
            'ungrouped': [...uniqueTokens]
        };
    },
    
    renderGrouping(container) {
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Group Similar Tokens</h2>
                        <p class="phase-subtitle">By context patterns, not meaning</p>
                    </div>
                    
                    <div class="phase-description">
                        Drag tokens into groups based on how they were used in your training data.
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 Hint</h4>
                        <p><strong>Subjects:</strong> Who/what does actions<br>
                        <strong>Actions:</strong> What they do (verbs)<br>
                        <strong>Objects:</strong> What's acted upon</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Available Tokens -->
                        <div style="margin-bottom: 24px;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">Drag tokens to groups below:</div>
                            <div id="tokenPool" style="min-height: 80px; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 2px dashed rgba(255, 255, 255, 0.2); 
                                       border-radius: 10px; display: flex; flex-wrap: wrap; gap: 8px;">
                                ${this.tokenGroups.ungrouped.map(token => this.renderToken(token)).join('')}
                            </div>
                        </div>
                        
                        <!-- Groups -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
                            ${this.renderGroup('subjects', '👥 Subjects', '#22c55e')}
                            ${this.renderGroup('actions', '⚡ Actions', '#3b82f6')}
                            ${this.renderGroup('objects', '📦 Objects', '#f59e0b')}
                        </div>
                        
                        <button class="btn-primary" onclick="phase2.checkGrouping()" style="width: 100%;">
                            Check My Grouping
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.setupDragAndDrop();
    },
    
    renderToken(token) {
        return `
            <div class="draggable-token" draggable="true" data-token="${token}"
                 style="padding: 8px 14px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(191, 0, 255, 0.1)); 
                        border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; cursor: move; 
                        font-size: 13px; color: white; font-family: 'JetBrains Mono', monospace;">
                ${token}
            </div>
        `;
    },
    
    renderGroup(groupId, title, color) {
        return `
            <div class="drop-zone" data-group="${groupId}"
                 style="min-height: 120px; padding: 12px; background: rgba(0, 0, 0, 0.2); 
                        border: 2px dashed ${color}40; border-radius: 10px;">
                <div style="font-size: 12px; font-weight: 600; color: ${color}; margin-bottom: 8px;">${title}</div>
                <div class="group-tokens" style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${this.tokenGroups[groupId].map(token => this.renderToken(token)).join('')}
                </div>
            </div>
        `;
    },
    
    setupDragAndDrop() {
        setTimeout(() => {
            const tokens = document.querySelectorAll('.draggable-token');
            const zones = document.querySelectorAll('.drop-zone, #tokenPool');
            
            tokens.forEach(token => {
                token.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.dataset.token);
                    e.target.style.opacity = '0.5';
                });
                
                token.addEventListener('dragend', (e) => {
                    e.target.style.opacity = '1';
                });
            });
            
            zones.forEach(zone => {
                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    zone.style.borderColor = 'var(--primary)';
                });
                
                zone.addEventListener('dragleave', (e) => {
                    zone.style.borderColor = '';
                });
                
                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.style.borderColor = '';
                    
                    const token = e.dataTransfer.getData('text/plain');
                    const groupId = zone.dataset.group || 'ungrouped';
                    
                    this.moveToken(token, groupId);
                    SoundManager.play('click');
                    
                    // Re-render
                    this.render(document.getElementById('phaseContainer'));
                });
            });
        }, 100);
    },
    
    moveToken(token, toGroup) {
        // Remove from all groups
        Object.keys(this.tokenGroups).forEach(group => {
            this.tokenGroups[group] = this.tokenGroups[group].filter(t => t !== token);
        });
        
        // Add to new group
        this.tokenGroups[toGroup].push(token);
    },
    
    checkGrouping() {
        let correct = 0;
        let total = 0;
        
        // Check each group
        ['subjects', 'actions', 'objects'].forEach(group => {
            this.tokenGroups[group].forEach(token => {
                total++;
                if (this.targetGroups[group].includes(token) || this.targetGroups.other.includes(token)) {
                    correct++;
                }
            });
        });
        
        const accuracy = total > 0 ? correct / total : 0;
        
        if (accuracy >= 0.7) { // 70% correct
            Game.addScore(150);
            Game.state.embeddings = this.generateEmbeddings();
            SoundManager.play('levelUp');
            
            this.currentStep = 'recap';
            this.render(document.getElementById('phaseContainer'));
        } else {
            Game.showMessage(`Not quite! ${Math.round(accuracy * 100)}% accurate. Try again!`, 'error');
            SoundManager.play('error');
        }
    },
    
    generateEmbeddings() {
        const embeddings = {};
        const tokens = Game.state.tokens;
        const uniqueTokens = [...new Set(tokens)];
        
        uniqueTokens.forEach((token, idx) => {
            // Simple 2D embedding based on groups
            let x = Math.random() * 100;
            let y = Math.random() * 100;
            
            // Cluster by group
            if (this.tokenGroups.subjects.includes(token)) {
                x = 20 + Math.random() * 20;
                y = 50 + Math.random() * 20;
            } else if (this.tokenGroups.actions.includes(token)) {
                x = 50 + Math.random() * 20;
                y = 30 + Math.random() * 20;
            } else if (this.tokenGroups.objects.includes(token)) {
                x = 75 + Math.random() * 20;
                y = 60 + Math.random() * 20;
            }
            
            embeddings[token] = [x, y];
        });
        
        return embeddings;
    },
    
    renderRecap(container) {
        const embeddings = Game.state.embeddings;
        const embeddingCount = Object.keys(embeddings).length;
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 32px; text-align: center; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✓ Phase 2 Complete: Embeddings
                    </h1>
                    
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 32px;">
                        You converted ${embeddingCount} unique tokens into numerical vectors
                    </p>
                    
                    <!-- Vectors Display -->
                    <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 12px; margin-bottom: 24px;">
                        <div style="text-align: center; margin-bottom: 12px;">
                            <span style="font-size: 12px; color: var(--text-secondary);">🔢 SAMPLE EMBEDDINGS (2D vectors)</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                            ${Object.entries(embeddings).slice(0, 6).map(([token, vec]) => `
                                <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 6px; font-size: 12px; font-family: 'JetBrains Mono', monospace;">
                                    <div style="color: var(--primary); margin-bottom: 4px;">"${token}"</div>
                                    <div style="color: var(--text-secondary);">[${vec[0].toFixed(1)}, ${vec[1].toFixed(1)}]</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- What Happened -->
                    <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">📊 What Just Happened:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 1.8;">
                            <li>Each token now has a <strong>numerical vector</strong> (2 numbers in this simplified version)</li>
                            <li>Tokens you grouped together have <strong>similar vectors</strong></li>
                            <li>You didn't "understand" meanings - you recognized <strong>context patterns</strong></li>
                            <li>These vectors are now <strong>stored</strong> - next phases use them</li>
                        </ul>
                    </div>
                    
                    <!-- What's Next -->
                    <div style="padding: 20px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.08), rgba(0, 212, 255, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 32px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">🔜 Next: Attention</h3>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 14px;">
                            Now you'll calculate <strong>attention weights</strong> - deciding how much each token should "pay attention" to other tokens based on their vector similarity. Pure math!
                        </p>
                    </div>
                    
                    <button class="btn-primary" onclick="phase2.completePhase()" style="width: 100%; font-size: 17px; padding: 14px;">
                        Continue to Attention →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    completePhase() {
        Game.completePhase(150);
        Game.saveState();
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

