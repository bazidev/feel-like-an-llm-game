// Phase 2: Embeddings - USER GROUPS TOKENS (DRAG & DROP)
window.phase2 = {
    currentStep: 'intro', // 'intro' -> 'group' -> 'recap'
    tokenGroups: {},
    targetGroups: {},
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
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
        this.currentStep = 'group';
        SoundManager.play('click');
        this.initializeGroups();
        this.render(document.getElementById('phaseContainer'));
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

