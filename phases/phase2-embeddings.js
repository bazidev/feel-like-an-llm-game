// Phase 2: Embeddings - USER GROUPS TOKENS (DRAG & DROP)
window.phase2 = {
    currentStep: 'concept1', // 'concept1' -> 'concept2' -> 'examples' -> 'group' -> 'recap'
    currentExample: 0,
    tokenGroups: {},
    targetGroups: {},
    
    // Performance tracking
    groupingAttempts: 0,
    groupingCorrect: 0,
    
    // Tutorial examples - Show data context, then test without understanding!
    exampleSets: [
        {
            language: "English",
            title: "Learn from Context (with data)",
            trainingData: [
                "The <span class='highlight-token' data-token='cat'>cat</span> likes <span class='highlight-token' data-token='fish'>fish</span>.",
                "The <span class='highlight-token' data-token='dog'>dog</span> likes <span class='highlight-token' data-token='bones'>bones</span>.",
                "A <span class='highlight-token' data-token='cat'>cat</span> eats <span class='highlight-token' data-token='fish'>fish</span> daily.",
                "A <span class='highlight-token' data-token='dog'>dog</span> eats <span class='highlight-token' data-token='bones'>bones</span> daily.",
                "My <span class='highlight-token' data-token='cat'>cat</span> loves <span class='highlight-token' data-token='fish'>fish</span>.",
                "My <span class='highlight-token' data-token='dog'>dog</span> loves <span class='highlight-token' data-token='bones'>bones</span>."
            ],
            tokens: [
                { word: "cat", vector: [0.2, 0.8], color: "#22c55e", targetGroup: "group1" },
                { word: "dog", vector: [0.25, 0.75], color: "#3b82f6", targetGroup: "group1" },
                { word: "fish", vector: [0.7, 0.3], color: "#f59e0b", targetGroup: "group2" },
                { word: "bones", vector: [0.75, 0.35], color: "#ec4899", targetGroup: "group2" }
            ],
            hint: "Count the patterns! 'cat' and 'dog' BOTH appear 3 times at START (after The/A/My). 'fish' and 'bones' BOTH appear 3 times at END (after verbs).",
            correctPairs: [["cat", "dog"], ["fish", "bones"]],
            showData: true
        },
        {
            language: "العربية (Arabic)",
            title: "Pattern Recognition (no understanding needed)",
            trainingData: [
                "<span class='highlight-token' data-token='القط'>القط</span> <span class='highlight-token' data-token='يلعب'>يلعب</span> في البيت.",
                "<span class='highlight-token' data-token='الكلب'>الكلب</span> <span class='highlight-token' data-token='يجري'>يجري</span> في الحديقة.",
                "<span class='highlight-token' data-token='القط'>القط</span> <span class='highlight-token' data-token='يلعب'>يلعب</span> مع الأطفال.",
                "<span class='highlight-token' data-token='الكلب'>الكلب</span> <span class='highlight-token' data-token='يجري'>يجري</span> بسرعة.",
                "<span class='highlight-token' data-token='القط'>القط</span> <span class='highlight-token' data-token='يلعب'>يلعب</span> كل يوم.",
                "<span class='highlight-token' data-token='الكلب'>الكلب</span> <span class='highlight-token' data-token='يجري'>يجري</span> في الصباح."
            ],
            tokens: [
                { word: "القط", vector: [0.2, 0.75], color: "#22c55e", targetGroup: "group1" },
                { word: "الكلب", vector: [0.25, 0.7], color: "#3b82f6", targetGroup: "group1" },
                { word: "يلعب", vector: [0.7, 0.25], color: "#f59e0b", targetGroup: "group2" },
                { word: "يجري", vector: [0.75, 0.3], color: "#ec4899", targetGroup: "group2" }
            ],
            hint: "🌍 Can't read Arabic? Perfect! Count: القط and الكلب BOTH appear 3 times at START. يلعب and يجري BOTH appear 3 times AFTER القط/الكلب.",
            correctPairs: [["القط", "الكلب"], ["يلعب", "يجري"]],
            showData: true
        },
        {
            language: "中文 (Chinese)",
            title: "Pure Pattern Matching (hardest)",
            trainingData: [
                "我的<span class='highlight-token' data-token='猫'>猫</span>在<span class='highlight-token' data-token='睡觉'>睡觉</span>。",
                "我的<span class='highlight-token' data-token='狗'>狗</span>在<span class='highlight-token' data-token='跑步'>跑步</span>。",
                "这只<span class='highlight-token' data-token='猫'>猫</span>喜欢<span class='highlight-token' data-token='睡觉'>睡觉</span>。",
                "这只<span class='highlight-token' data-token='狗'>狗</span>喜欢<span class='highlight-token' data-token='跑步'>跑步</span>。",
                "小<span class='highlight-token' data-token='猫'>猫</span>正在<span class='highlight-token' data-token='睡觉'>睡觉</span>。",
                "小<span class='highlight-token' data-token='狗'>狗</span>正在<span class='highlight-token' data-token='跑步'>跑步</span>。"
            ],
            tokens: [
                { word: "猫", vector: [0.2, 0.75], color: "#22c55e", targetGroup: "group1" },
                { word: "狗", vector: [0.25, 0.7], color: "#3b82f6", targetGroup: "group1" },
                { word: "睡觉", vector: [0.7, 0.25], color: "#f59e0b", targetGroup: "group2" },
                { word: "跑步", vector: [0.75, 0.3], color: "#ec4899", targetGroup: "group2" }
            ],
            hint: "🎯 Can't read Chinese? Count symbols: 猫 and 狗 BOTH appear 3 times after (我的/这只/小). 睡觉 and 跑步 BOTH appear 3 times at END.",
            correctPairs: [["猫", "狗"], ["睡觉", "跑步"]],
            showData: true
        }
    ],
    
    // Canvas state for examples
    canvasState: {
        dragging: null,
        positions: {},
        exampleCompleted: {} // Track which examples have been completed
    },
    
    render(container) {
        if (this.currentStep === 'concept1') {
            this.renderConcept1(container);
        } else if (this.currentStep === 'concept2') {
            this.renderConcept2(container);
        } else if (this.currentStep === 'examples') {
            this.renderExamples(container);
        } else if (this.currentStep === 'group') {
            this.renderGrouping(container);
        } else if (this.currentStep === 'recap') {
            this.renderRecap(container);
        } else if (this.currentStep === 'journey_checkpoint') {
            this.renderJourneyCheckpoint(container);
        }
    },
    
    renderConcept1(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        📊 Embeddings
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        Convert tokens into mathematical vectors
                    </p>
                    
                    <!-- What are Embeddings -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🔢</span>
                            <h2 style="font-size: 18px; color: var(--primary); margin: 0;">What are Embeddings?</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                Each token becomes a <strong style="color: var(--primary);">vector</strong> - a list of numbers like [0.8, 0.3, 0.5].
                            </p>
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">Similar tokens get similar vectors</strong> - NOT because you "understand" meaning, but because they appeared in <strong>similar contexts</strong> during training.
                            </p>
                            <p style="margin: 0;">
                                Example: "cat" → [0.8, 0.3] and "dog" → [0.75, 0.35] are close because both appeared after "The" and before verbs like "sat" or "played".
                            </p>
                        </div>
                    </div>
                    
                    <!-- How LLMs Learn Embeddings -->
                    <div style="background: linear-gradient(135deg, rgba(191, 0, 255, 0.1), rgba(139, 92, 246, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🎓</span>
                            <h2 style="font-size: 18px; color: var(--secondary); margin: 0;">How LLMs Learn Embeddings</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                During training, the model adjusts vectors so that tokens appearing in <strong style="color: var(--secondary);">similar contexts</strong> have similar numbers.
                            </p>
                            <p style="margin: 0;">
                                You don't "know" that cat and dog are animals. You just learned they appear in similar sentence positions: "The ___ sat", "A ___ likes".
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phase2.nextStep()" 
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Next →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    renderConcept2(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 1000px; width: 100%;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        📊 Embeddings
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        Vectors capture patterns from training data
                    </p>
                    
                    <!-- Rules Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 14px; padding: 18px; margin-bottom: 16px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">📋</span>
                            <h3 style="font-size: 17px; color: var(--primary); margin: 0;">Embedding rules (for this game)</h3>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">1. Similar context = similar vectors</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Tokens appearing in similar positions get close vectors</div>
                            </div>
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">2. Group by usage patterns</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Not by meaning! "cat" + "dog" both appear after "The"</div>
                            </div>
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">3. Distance = similarity</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">Closer vectors in space = more similar usage</div>
                            </div>
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                <div style="font-size: 12px; color: var(--primary); font-weight: 600; margin-bottom: 3px;">4. Simple 2D vectors</div>
                                <div style="font-size: 11px; color: var(--text-secondary);">We use [x, y] format for visualization</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Reality Check -->
                    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 14px; padding: 18px; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">⚡</span>
                            <h3 style="font-size: 15px; color: #ef4444; margin: 0;">Reality check: How real LLMs actually create embeddings</h3>
                        </div>
                        <div style="font-size: 12px; line-height: 1.5; color: var(--text-secondary);">
                            <ul style="margin: 0; padding-left: 20px; list-style: none;">
                                <li style="margin-bottom: 5px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Learned through training:</strong> Real embeddings aren't manually assigned - they emerge from billions of training examples through backpropagation!
                                </li>
                                <li style="margin-bottom: 5px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">High-dimensional space:</strong> GPT-4 uses ~18,000 dimensions, not 2D. Each dimension captures different patterns.
                                </li>
                                <li style="margin-bottom: 5px; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">No semantic rules:</strong> The model never "knows" what words mean - it just learns "chef" and "cook" appear near similar words
                                </li>
                                <li style="margin: 0; padding-left: 16px; position: relative;">
                                    <span style="position: absolute; left: 0; color: #ef4444;">•</span>
                                    <strong style="color: #ef4444;">Vector arithmetic works:</strong> king - man + woman ≈ queen (because of training patterns, not understanding!)
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phase2.nextStep()" 
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                                Let's practice! →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
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
    
    nextStep() {
        const steps = ['concept1', 'concept2', 'examples'];
        const currentIndex = steps.indexOf(this.currentStep);
        if (currentIndex < steps.length - 1) {
            this.currentStep = steps[currentIndex + 1];
            if (this.currentStep === 'examples') {
                this.currentExample = 0;
            }
            const container = document.getElementById('phaseContainer');
            this.render(container);
        }
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
                    x: Math.random() * 400 + 100,
                    y: Math.random() * 250 + 75
                };
            });
        }
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">${example.language}: ${example.title}</h2>
                        <p class="phase-subtitle">Pattern recognition from data</p>
                    </div>
                    
                    <!-- Training Data -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(191, 0, 255, 0.03)); 
                               border: 2px solid rgba(0, 212, 255, 0.25); border-radius: 10px; padding: 14px; margin-bottom: 16px;">
                        <h4 style="font-size: 13px; color: var(--primary); margin-bottom: 10px;">📚 Training Data (${example.trainingData.length} examples):</h4>
                        <div style="font-size: 12px; line-height: 1.8; color: var(--text-secondary); max-height: 240px; overflow-y: auto; padding-right: 8px; ${example.language.includes('العربية') ? 'direction: rtl; text-align: right;' : ''}">
                            ${example.trainingData.map(sentence => `<div style="margin-bottom: 6px;">${sentence}</div>`).join('')}
                        </div>
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 Hint</h4>
                        <p style="font-size: 11px; line-height: 1.6;">${example.hint}</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 12px;">
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <strong>Reality Check:</strong> You're grouping by patterns, not meaning! You don't "understand" these words - you just learned which ones appear in similar contexts.
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 650px;">
                        
                        <div style="margin-bottom: 14px; text-align: center;">
                            <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
                                ${this.currentExample + 1} of ${this.exampleSets.length}
                            </p>
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">
                                🎯 Drag tokens close if they appear in similar contexts
                            </div>
                        </div>
                        
                        <!-- 2D Canvas -->
                        <div style="position: relative; margin-bottom: 18px;">
                            <canvas id="embeddingCanvas" width="650" height="380" 
                                    style="border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; 
                                           background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.05)); 
                                           cursor: default;">
                            </canvas>
                        </div>
                        
                        <button class="btn-primary" onclick="phase2.checkExampleCanvas()" style="width: 100%; padding: 12px;">
                            ✓ Check My Positioning
                        </button>
                        
                        <div id="feedback" style="display: none; margin-top: 14px; padding: 14px; border-radius: 10px;"></div>
                        
                    </div>
                </div>
            </div>
        `;
        
        // Add CSS for highlighted tokens
        if (!document.getElementById('highlight-token-style')) {
            const style = document.createElement('style');
            style.id = 'highlight-token-style';
            style.textContent = `
                .highlight-token {
                    background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2));
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 600;
                    border: 1px solid rgba(0, 212, 255, 0.4);
                    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
        
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
            
            // Function to find groups of close tokens
            const findGroups = () => {
                const mergeDistance = 80;
                const groups = [];
                const visited = new Set();
                
                example.tokens.forEach(token => {
                    if (visited.has(token.word)) return;
                    
                    const group = [token.word];
                    visited.add(token.word);
                    
                    // Find all tokens close to this one
                    example.tokens.forEach(otherToken => {
                        if (visited.has(otherToken.word)) return;
                        
                        const pos1 = positions[token.word];
                        const pos2 = positions[otherToken.word];
                        const dist = Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
                        
                        if (dist < mergeDistance) {
                            group.push(otherToken.word);
                            visited.add(otherToken.word);
                        }
                    });
                    
                    if (group.length > 1) {
                        groups.push(group);
                    }
                });
                
                return groups;
            };
            
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
                
                // Find groups for color merging
                const groups = findGroups();
                const groupColors = {};
                
                groups.forEach((group, index) => {
                    // Use first token's color as group color
                    const firstToken = example.tokens.find(t => t.word === group[0]);
                    const groupColor = firstToken.color;
                    group.forEach(word => {
                        groupColors[word] = groupColor;
                    });
                    
                    // Draw connection lines between grouped tokens
                    ctx.strokeStyle = groupColor + '25';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    for (let i = 0; i < group.length; i++) {
                        for (let j = i + 1; j < group.length; j++) {
                            const pos1 = positions[group[i]];
                            const pos2 = positions[group[j]];
                            ctx.beginPath();
                            ctx.moveTo(pos1.x, pos1.y);
                            ctx.lineTo(pos2.x, pos2.y);
                            ctx.stroke();
                        }
                    }
                    ctx.setLineDash([]);
                });
                
                // Draw tokens
                example.tokens.forEach(token => {
                    const pos = positions[token.word];
                    const displayColor = groupColors[token.word] || token.color;
                    
                    // Circle
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, tokenRadius, 0, Math.PI * 2);
                    ctx.fillStyle = displayColor + '40';
                    ctx.fill();
                    ctx.strokeStyle = displayColor;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // Word
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 14px "JetBrains Mono", monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(token.word, pos.x, pos.y - 8);
                    
                    // Vector
                    ctx.fillStyle = displayColor;
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
        // Prevent multiple submissions of the same example
        if (this.canvasState.exampleCompleted[this.currentExample]) {
            return; // Already validated this example
        }
        
        const example = this.exampleSets[this.currentExample];
        const positions = this.canvasState.positions[this.currentExample];
        const feedback = document.getElementById('feedback');
        const canvas = document.getElementById('embeddingCanvas');
        const ctx = canvas.getContext('2d');
        
        // Group tokens by their TARGET group (what they SHOULD be grouped as)
        const groups = {};
        example.tokens.forEach(token => {
            if (!groups[token.targetGroup]) groups[token.targetGroup] = [];
            groups[token.targetGroup].push(token);
        });
        
        let allGood = true;
        let message = '';
        
        // Check each group - tokens in same target group should be close together
        Object.entries(groups).forEach(([groupName, groupTokens]) => {
            if (groupTokens.length === 2) {
                const [token1, token2] = groupTokens;
                const pos1 = positions[token1.word];
                const pos2 = positions[token2.word];
                const distance = Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
                
                if (distance > 120) {
                    allGood = false;
                    message = `"${token1.word}" and "${token2.word}" appear in similar contexts! Try moving them closer together.`;
                }
            }
        });
        
        // Check that different groups are far apart
        const groupNames = Object.keys(groups);
        if (allGood && groupNames.length === 2) {
            const group1Tokens = groups[groupNames[0]];
            const group2Tokens = groups[groupNames[1]];
            
            // Calculate center of each group
            const center1 = {
                x: group1Tokens.reduce((sum, t) => sum + positions[t.word].x, 0) / group1Tokens.length,
                y: group1Tokens.reduce((sum, t) => sum + positions[t.word].y, 0) / group1Tokens.length
            };
            const center2 = {
                x: group2Tokens.reduce((sum, t) => sum + positions[t.word].x, 0) / group2Tokens.length,
                y: group2Tokens.reduce((sum, t) => sum + positions[t.word].y, 0) / group2Tokens.length
            };
            
            const groupDistance = Math.sqrt((center1.x - center2.x) ** 2 + (center1.y - center2.y) ** 2);
            
            if (groupDistance < 150) {
                allGood = false;
                message = 'The two groups appear in different contexts, so they should be farther apart from each other!';
            }
        }
        
        feedback.style.display = 'block';
        
        if (allGood) {
            // Mark this example as completed to prevent multiple submissions
            this.canvasState.exampleCompleted[this.currentExample] = true;
            
            // Draw connection lines for correct pairs
            Object.entries(groups).forEach(([groupName, groupTokens]) => {
                if (groupTokens.length === 2) {
                    const [token1, token2] = groupTokens;
                    const pos1 = positions[token1.word];
                    const pos2 = positions[token2.word];
                    
                    // Draw solid connection line (use first token's color for the line)
                    const lineColor = token1.color;
                    ctx.strokeStyle = lineColor + 'cc';
                    ctx.lineWidth = 4;
                    ctx.setLineDash([]);
                    ctx.beginPath();
                    ctx.moveTo(pos1.x, pos1.y);
                    ctx.lineTo(pos2.x, pos2.y);
                    ctx.stroke();
                    
                    // Draw glow effect
                    ctx.strokeStyle = lineColor + '40';
                    ctx.lineWidth = 8;
                    ctx.beginPath();
                    ctx.moveTo(pos1.x, pos1.y);
                    ctx.lineTo(pos2.x, pos2.y);
                    ctx.stroke();
                }
            });
            
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #22c55e; font-weight: 700; margin-bottom: 8px;">✓ Perfect positioning!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    You correctly clustered tokens that appear in similar contexts! Distance in 2D space = vector similarity.
                </div>
            `;
            SoundManager.play('success');
            Game.addScore(50); // Examples: +50 per correct
            
            // Disable the button to prevent further clicks
            const button = document.querySelector('button[onclick="phase2.checkExampleCanvas()"]');
            if (button) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
            }
            
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
            // NO PENALTY in examples - learning phase!
        }
    },
    
    initializeGroups() {
        const tokens = Game.state.tokens;
        
        // Filter out noise: suffixes, punctuation, common words (spaces are attached to words now)
        const noiseWords = ['ed', 'ing', 's', 'the', 'a', 'an', 'is', 'was', 'were', 'are', 
                           'very', 'much', 'indeed', 'today', 'tonight', 'daily', 'originally', 
                           'constantly', 'successfully', 'gracefully', 'brightly', 'beautifully', 
                           'perfectly', 'amazing', 'special', 'good', ' ', '␣', '.', ',', '!', '?', ';', ':'];
        
        const words = [];
        
        tokens.forEach(token => {
            // Strip leading space and convert to lowercase for comparison
            const t = token.toLowerCase().trim();
            // Only include meaningful content words (length > 1, not in noise list)
            if (t.length > 1 && !noiseWords.includes(t)) {
                // Store the TRIMMED version (without leading space)
                words.push(t);
            }
        });
        
        // Get unique meaningful words only (10-12 tokens max)
        const uniqueWords = [...new Set(words)].slice(0, 12);
        
        // Define target groups based on training data patterns - 4 CATEGORIES
        this.targetGroups = {
            'subjects': [],      // Who/what does actions (top-left)
            'actions': [],       // Verbs and activities (top-right)
            'objects': [],       // Things acted upon, places (bottom-left)
            'prepositions': []   // Connectors and relationships (bottom-right)
        };
        
        // Auto-categorize words based on actual training data
        uniqueWords.forEach(token => {
            const t = token.toLowerCase();
            
            // SUBJECTS - Nouns that perform actions (animate beings that DO things)
            if (['chef', 'player', 'programmer', 'cat', 'dog', 'bird', 'rocket', 'astronaut', 
                 'team', 'coach', 'satellite', 'moon', 'stars', 
                 'Earth', 'planet', 'computer', 'developer'].includes(t)) {
                this.targetGroups.subjects.push(token);
            }
            // ACTIONS - Verbs (complete words, not suffixes)
            else if (['cooked', 'cook', 'played', 'play', 'kicked', 'kick', 'scored', 'score',
                     'loves', 'love', 'tastes', 'taste', 'wrote', 'write', 'came', 'come',
                     'launched', 'launch', 'floated', 'float', 'orbits', 'orbit', 'shine',
                     'shines', 'carried', 'carry', 'wore', 'wear', 'trained', 'train', 'trains',
                     'reflects', 'reflect', 'serves', 'serve', 'baked', 'bake', 'sharing', 'share',
                     'looks', 'look', 'needs', 'need', 'form', 'sang', 'sing', 'watched', 'watch',
                     'processed', 'process', 'runs', 'run', 'builds', 'build', 'celebrates', 'celebrate',
                     'competing', 'compete', 'winning', 'win', 'sleep', 'sleeps', 'has', 'chased', 'chase',
                     'chirped', 'chirp', 'working', 'work', 'cooking', 'monitors', 'monitor', 'likes', 
                     'includes', 'sat'].includes(t)) {
                this.targetGroups.actions.push(token);
            }
            // PREPOSITIONS - Connectors between entities
            else if (['into', 'from', 'with', 'around', 'in', 'at', 'for', 'on', 'to',
                     'of', 'out', 'by', 'about', 'near', 'against'].includes(t)) {
                this.targetGroups.prepositions.push(token);
            }
            // OBJECTS/DESCRIPTORS - Things, places, qualities (things acted upon)
            else if (['ball', 'goal', 'fish', 'milk', 'bones', 'treats', 'window', 'garden', 
                     'sofa', 'toy', 'tree', 'seeds', 'water', 'friends',
                     'code', 'data', 'software', 'features', 'calculations', 'programs', 
                     'applications', 'documentation', 'users', 'task', 'problems',
                     'pizza', 'pasta', 'cuisine', 'meal', 'meals', 'cheese', 'tomatoes', 'ingredients',
                     'sauce', 'Italy', 'recipes', 'people', 'food', 'kitchen', 'customers', 'fresh', 'hot',
                     'restaurant', 'oven', 'mat',
                     'space', 'sky', 'night', 'suit', 'equipment', 'patterns',
                     'fuel', 'sunlight', 'years', 'today',
                     'football', 'games', 'victory', 'skill', 'training', 'rivals', 
                     'championship', 'minute', 'matches', 'dedication', 'project', 
                     'solutions', 'editor', 'feedback', 'branch', 'dawn'].includes(t)) {
                this.targetGroups.objects.push(token);
            }
        });
        
        // Initialize random positions in CENTER area - ALL START WITH NEUTRAL GRAY COLOR
        this.groupingState = {
            tokens: uniqueWords.map(token => ({
                word: token,
                x: Math.random() * 300 + 190, // Center area
                y: Math.random() * 200 + 95,  // Center area
                color: '#6b7280', // Neutral gray - no cheating!
                inZone: null
            })),
            // 4 CORNER ZONES - Better visual separation!
            zones: {
                subjects: { 
                    x: 20, y: 20, width: 150, height: 130, 
                    color: '#22c55e', label: '👥 Subjects' 
                },
                actions: { 
                    x: 510, y: 20, width: 150, height: 130, 
                    color: '#3b82f6', label: '⚡ Actions' 
                },
                objects: { 
                    x: 20, y: 240, width: 150, height: 130, 
                    color: '#f59e0b', label: '📦 Objects' 
                },
                prepositions: { 
                    x: 510, y: 240, width: 150, height: 130, 
                    color: '#8b5cf6', label: '🔗 Prepositions' 
                }
            }
        };
    },
    
    renderGrouping(container) {
        // Get training data to show
        const trainingText = Game.state.trainingText || "The chef cooked pasta. The player kicked the ball.";
        const sentences = trainingText.split(/[.!?]+/).filter(s => s.trim()).slice(0, 4);
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Group Similar Tokens</h2>
                        <p class="phase-subtitle">By context patterns, not meaning</p>
                    </div>
                    
                    <!-- Training Data -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(191, 0, 255, 0.03)); 
                               border: 2px solid rgba(0, 212, 255, 0.25); border-radius: 10px; padding: 12px; margin-bottom: 14px;">
                        <h4 style="font-size: 12px; color: var(--primary); margin-bottom: 8px;">📚 Your Training Data:</h4>
                        <div style="font-size: 11px; line-height: 1.7; color: var(--text-secondary); max-height: 120px; overflow-y: auto;">
                            ${sentences.map(s => `<div style="margin-bottom: 4px;">• ${s.trim()}.</div>`).join('')}
                        </div>
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 Look for patterns!</h4>
                        <p style="font-size: 11px; line-height: 1.5;">
                        <strong>👥 Subjects:</strong> Who/what does the action<br>
                        <strong>⚡ Actions:</strong> Verbs - what happens<br>
                        <strong>📦 Objects:</strong> What's acted upon<br>
                        <strong>🔗 Prepositions:</strong> Connectors (in, with, from)</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 12px; margin-top: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 18px;">⚡</span>
                            <h4 style="font-size: 13px; color: #ef4444; margin: 0; font-weight: 700;">Reality Check: How Real LLMs Learn Embeddings</h4>
                        </div>
                        <div style="font-size: 11px; line-height: 1.6; color: var(--text-secondary);">
                            <ul style="margin: 0; padding-left: 20px; list-style: none;">
                                <li style="margin-bottom: 6px; padding-left: 6px; position: relative;">
                                    <strong style="color: #ef4444;">No grammar categories:</strong> Real LLMs don't classify into "subjects" or "verbs" - they learn pure numerical patterns from billions of word co-occurrences!
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 6px; position: relative;">
                                    <strong style="color: #ef4444;">Context-based learning:</strong> If "rocket" and "satellite" appear near similar words (orbit, space, launch), their vectors naturally become similar.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 680px;">
                        
                        <div style="margin-bottom: 14px; text-align: center;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px;">
                                🎯 Drag tokens into corner zones - watch them change color when placed correctly!
                            </div>
                        </div>
                        
                        <!-- Canvas -->
                        <div style="position: relative; margin-bottom: 18px;">
                            <canvas id="groupingCanvas" width="680" height="390" 
                                    style="border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; 
                                           background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.05)); 
                                           cursor: default;">
                            </canvas>
                        </div>
                        
                        <button class="btn-primary" onclick="phase2.checkGrouping()" style="width: 100%; padding: 12px;">
                            ✓ Check My Grouping
                        </button>
                        
                        <div id="groupingFeedback" style="display: none; margin-top: 14px; padding: 14px; border-radius: 10px;"></div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.setupGroupingCanvas();
    },
    
    setupGroupingCanvas() {
        setTimeout(() => {
            const canvas = document.getElementById('groupingCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const zones = this.groupingState.zones;
            const tokens = this.groupingState.tokens;
            const tokenRadius = 30;
            
            // Draw function
            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw drop zones at bottom
                Object.entries(zones).forEach(([zoneName, zone]) => {
                    // Zone rectangle with gradient
                    const gradient = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.height);
                    gradient.addColorStop(0, zone.color + '20');
                    gradient.addColorStop(1, zone.color + '10');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
                    
                    // Zone border (dashed)
                    ctx.strokeStyle = zone.color + '80';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
                    ctx.setLineDash([]);
                    
                    // Zone label (use predefined label)
                    ctx.fillStyle = zone.color;
                    ctx.font = 'bold 12px "JetBrains Mono", monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillText(zone.label, zone.x + zone.width / 2, zone.y + 10);
                });
                
                // Update token zones (but DON'T override colors set by checkTokenPlacement)
                tokens.forEach(token => {
                    let currentZone = null;
                    Object.entries(zones).forEach(([zoneName, zone]) => {
                        if (token.x >= zone.x && token.x <= zone.x + zone.width &&
                            token.y >= zone.y && token.y <= zone.y + zone.height) {
                            currentZone = zoneName;
                            token.inZone = zoneName;
                            // Only update color if token hasn't been validated (no red/green color)
                            if (token.color !== '#22c55e' && token.color !== '#ef4444') {
                                token.color = zone.color; // Change to zone color!
                            }
                        }
                    });
                    
                    // If not in any zone, stay gray (unless it's been validated)
                    if (!currentZone) {
                        token.inZone = null;
                        if (token.color !== '#22c55e' && token.color !== '#ef4444') {
                            token.color = '#6b7280';
                        }
                    }
                });
                
                // Draw tokens as circles
                tokens.forEach(token => {
                    // Circle
                    ctx.beginPath();
                    ctx.arc(token.x, token.y, tokenRadius, 0, Math.PI * 2);
                    ctx.fillStyle = token.color + '40';
                    ctx.fill();
                    ctx.strokeStyle = token.color;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    
                    // Word (show space symbol)
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 13px "JetBrains Mono", monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const displayWord = token.word === ' ' ? '␣' : token.word;
                    ctx.fillText(displayWord, token.x, token.y);
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
                tokens.forEach(token => {
                    const dist = Math.sqrt((x - token.x) ** 2 + (y - token.y) ** 2);
                    if (dist < tokenRadius) {
                        isDragging = true;
                        dragToken = token;
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
                    dragToken.x = Math.max(tokenRadius, Math.min(canvas.width - tokenRadius, x));
                    dragToken.y = Math.max(tokenRadius, Math.min(canvas.height - tokenRadius, y));
                    draw();
                } else {
                    // Change cursor if hovering over a token
                    let hovering = false;
                    tokens.forEach(token => {
                        const dist = Math.sqrt((x - token.x) ** 2 + (y - token.y) ** 2);
                        if (dist < tokenRadius) {
                            hovering = true;
                        }
                    });
                    canvas.style.cursor = hovering ? 'grab' : 'default';
                }
            });
            
            canvas.addEventListener('mouseup', () => {
                if (isDragging && dragToken) {
                    // Check placement when token is dropped
                    this.checkTokenPlacement(dragToken, zones, tokens, draw, tokenRadius, ctx);
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
    
    // NEW: Real-time feedback when token is placed
    checkTokenPlacement(dragToken, zones, tokens, draw, tokenRadius, ctx) {
        let inZone = null;
        let correctPlacement = false;
        
        // Check which zone the token is in
        Object.entries(zones).forEach(([zoneName, zone]) => {
            if (dragToken.x >= zone.x && dragToken.x <= zone.x + zone.width &&
                dragToken.y >= zone.y && dragToken.y <= zone.y + zone.height) {
                inZone = zoneName;
                
                // Check if it's the CORRECT zone for this token
                // Use case-insensitive comparison to match how tokens were categorized
                if (this.targetGroups[zoneName]) {
                    const tokenInGroup = this.targetGroups[zoneName].find(t => 
                        t.toLowerCase() === dragToken.word.toLowerCase()
                    );
                    if (tokenInGroup) {
                        correctPlacement = true;
                    }
                }
            }
        });
        
        // Update token's zone tracking
        dragToken.inZone = inZone;
        
        if (inZone) {
            if (correctPlacement) {
                // ✅ CORRECT PLACEMENT!
                SoundManager.play('coin');
                Game.addScore(20); // Mini-game: +20 per correct placement
                
                // Change to GREEN permanently
                dragToken.color = '#22c55e'; // Green
                draw();
                
                // Show floating "+20"
                this.showFloatingPoints(dragToken.x, dragToken.y, '+20', '#22c55e');
                
                // Check if ALL tokens are correctly placed
                this.checkAllCorrect(tokens);
                
            } else {
                // ❌ WRONG PLACEMENT!
                SoundManager.play('wrong');
                Game.addScoreSafe(-10); // Mini-game penalty (only if score > 0)
                
                // Change to RED permanently (stay red until moved)
                dragToken.color = '#ef4444'; // Red
                draw();
                
                // Show floating "-10"
                this.showFloatingPoints(dragToken.x, dragToken.y, '-10', '#ef4444');
                
                // Show error message
                const feedback = document.getElementById('groupingFeedback');
                if (feedback) {
                    feedback.style.display = 'block';
                    feedback.style.background = 'rgba(239, 68, 68, 0.1)';
                    feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
                    feedback.innerHTML = `
                        <div style="font-size: 14px; color: #ef4444; font-weight: 700;">❌ "${dragToken.word}" doesn't belong in this zone!</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Try another zone based on how it appears in your training data.</div>
                    `;
                    
                    // Auto-hide after 2 seconds
                    setTimeout(() => {
                        feedback.style.display = 'none';
                    }, 2000);
                }
            }
        } else {
            // Token placed outside any zone - reset to gray
            dragToken.color = '#6b7280';
            draw();
            SoundManager.play('click');
        }
    },
    
    // Show floating point animation
    showFloatingPoints(x, y, text, color) {
        const canvas = document.getElementById('groupingCanvas');
        if (!canvas) return;
        
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.style.cssText = `
            position: absolute;
            left: ${canvas.offsetLeft + x}px;
            top: ${canvas.offsetTop + y - 40}px;
            color: ${color};
            font-size: 18px;
            font-weight: 700;
            font-family: 'JetBrains Mono', monospace;
            pointer-events: none;
            z-index: 1000;
            text-shadow: 0 2px 10px ${color};
            animation: floatUp 1s ease-out forwards;
        `;
        
        canvas.parentElement.appendChild(floatingText);
        
        setTimeout(() => {
            floatingText.remove();
        }, 1000);
    },
    
    // Check if all tokens are correctly placed
    checkAllCorrect(tokens) {
        const zones = this.groupingState.zones;
        let allCorrect = true;
        
        tokens.forEach(token => {
            let inCorrectZone = false;
            
            Object.entries(zones).forEach(([zoneName, zone]) => {
                if (token.x >= zone.x && token.x <= zone.x + zone.width &&
                    token.y >= zone.y && token.y <= zone.y + zone.height) {
                    // Use case-insensitive comparison
                    if (this.targetGroups[zoneName]) {
                        const tokenInGroup = this.targetGroups[zoneName].find(t => 
                            t.toLowerCase() === token.word.toLowerCase()
                        );
                        if (tokenInGroup) {
                            inCorrectZone = true;
                        }
                    }
                }
            });
            
            if (!inCorrectZone) {
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            // 🎉 ALL CORRECT - AUTO COMPLETE!
            setTimeout(() => {
                const feedback = document.getElementById('groupingFeedback');
                if (feedback) {
                    feedback.style.display = 'block';
                    feedback.style.background = 'rgba(34, 197, 94, 0.15)';
                    feedback.style.border = '2px solid rgba(34, 197, 94, 0.5)';
                    feedback.innerHTML = `
                        <div style="font-size: 18px; color: #22c55e; font-weight: 700; margin-bottom: 8px;">🎉 Perfect! All tokens correctly placed!</div>
                        <div style="font-size: 14px; color: var(--text-secondary);">
                            You successfully identified all pattern categories! +100 bonus points! 🚀
                        </div>
                    `;
                }
                
                SoundManager.play('powerup');
                Game.addScore(200); // Mini-game completion bonus (fixed)
                Game.state.embeddings = this.generateEmbeddings();
                
                // Auto-advance after showing completion message
                setTimeout(() => {
                    this.currentStep = 'recap';
                    this.render(document.getElementById('phaseContainer'));
                }, 2500);
            }, 300);
        }
    },
    
    checkGrouping() {
        const zones = this.groupingState.zones;
        const tokens = this.groupingState.tokens;
        const feedback = document.getElementById('groupingFeedback');
        
        this.groupingAttempts++; // Track every attempt
        
        let correct = 0;
        let total = tokens.length;
        let errors = [];
        let misplacedTokens = [];
        
        // Check which zone each token is in
        tokens.forEach(token => {
            let inZone = null;
            
            // Check if token center is inside any zone
            Object.entries(zones).forEach(([zoneName, zone]) => {
                if (token.x >= zone.x && token.x <= zone.x + zone.width &&
                    token.y >= zone.y && token.y <= zone.y + zone.height) {
                    inZone = zoneName;
                }
            });
            
            // Store the zone for this token
            token.inZone = inZone;
            
            // Check if it's in the correct zone - use case-insensitive comparison
            if (inZone && this.targetGroups[inZone]) {
                const tokenInGroup = this.targetGroups[inZone].find(t => 
                    t.toLowerCase() === token.word.toLowerCase()
                );
                if (tokenInGroup) {
                    correct++;
                } else {
                    misplacedTokens.push(`"${token.word}" in ${inZone}`);
                    errors.push(`"${token.word}" should not be in ${inZone}`);
                }
            } else if (!inZone) {
                errors.push(`"${token.word}" needs to be placed in a zone`);
            }
        });
        
        const accuracy = total > 0 ? correct / total : 0;
        feedback.style.display = 'block';
        
        if (accuracy >= 0.70) { // 70% correct threshold
            // Track best performance
            this.groupingCorrect = correct;
            
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #22c55e; font-weight: 700; margin-bottom: 8px;">✓ Excellent pattern recognition!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    ${correct} out of ${total} tokens correctly grouped (${Math.round(accuracy * 100)}%)! 
                    You successfully identified usage patterns from the training data. 
                    ${accuracy === 1 ? '🎉 Perfect score!' : ''}
                </div>
            `;
            SoundManager.play('powerup');
            
            // Fixed mini-game completion bonus
            Game.addScore(200); // Mini-game completion bonus (fixed)
            
            Game.state.embeddings = this.generateEmbeddings();
            
            setTimeout(() => {
                this.currentStep = 'recap';
                this.render(document.getElementById('phaseContainer'));
            }, 2000);
        } else {
            const zoneLabels = {
                'subjects': '👥 Subjects',
                'actions': '⚡ Actions', 
                'objects': '📦 Objects',
                'prepositions': '🔗 Prepositions'
            };
            
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #ef4444; font-weight: 700; margin-bottom: 8px;">Keep adjusting positions!</div>
                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                    ${correct} out of ${total} correct (${Math.round(accuracy * 100)}%). 
                    ${errors.slice(0, 3).join('. ')}. 
                    <br><br>💡 Tip: Check your training data to see where these tokens appear in sentences!
                </div>
            `;
            SoundManager.play('wrong');
            // NO PENALTY for wrong grouping check - learning phase!
        }
    },
    
    generateEmbeddings() {
        const embeddings = {};
        const tokens = Game.state.tokens;
        const uniqueTokens = [...new Set(tokens)];
        const zones = this.groupingState.zones;
        const groupedTokens = this.groupingState.tokens;
        
        uniqueTokens.forEach((token, idx) => {
            // Simple 2D embedding based on which zone the token ended up in
            let x = 50; // default
            let y = 50; // default
            
            // Find which zone this token is in
            const tokenObj = groupedTokens.find(t => t.word === token);
            if (tokenObj) {
                Object.entries(zones).forEach(([zoneName, zone]) => {
                    if (tokenObj.x >= zone.x && tokenObj.x <= zone.x + zone.width &&
                        tokenObj.y >= zone.y && tokenObj.y <= zone.y + zone.height) {
                        // Cluster tokens by their zone position (4 corners)
                        if (zoneName === 'subjects') {
                            // Top-left corner cluster
                            x = 15 + Math.random() * 15;
                            y = 15 + Math.random() * 15;
                        } else if (zoneName === 'actions') {
                            // Top-right corner cluster
                            x = 75 + Math.random() * 15;
                            y = 15 + Math.random() * 15;
                        } else if (zoneName === 'objects') {
                            // Bottom-left corner cluster
                            x = 15 + Math.random() * 15;
                            y = 75 + Math.random() * 15;
                        } else if (zoneName === 'prepositions') {
                            // Bottom-right corner cluster
                            x = 75 + Math.random() * 15;
                            y = 75 + Math.random() * 15;
                        }
                    }
                });
            }
            
            embeddings[token] = [x, y];
        });
        
        return embeddings;
    },
    
    renderRecap(container) {
        const embeddings = Game.state.embeddings;
        const embeddingCount = Object.keys(embeddings).length;
        
        container.innerHTML = `
            <div style="height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 1000px; width: 100%;">
                    
                    <h2 style="font-size: 28px; margin-bottom: 14px; text-align: center; color: var(--primary);">
                        ✅ Embeddings Complete!
                    </h2>
                    <p style="font-size: 14px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        You converted ${embeddingCount} tokens into 2D vectors
                    </p>
                    
                    <!-- ANIMATED SCALE COMPARISON -->
                    <div style="margin: 40px 0; padding: 32px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.05)); 
                               border: 3px solid rgba(139, 92, 246, 0.3); border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h3 style="font-size: 22px; color: #a855f7; margin-bottom: 10px; font-weight: 700;">
                                🔬 Scale Comparison: Your Model vs. Real LLMs
                            </h3>
                            <p style="font-size: 14px; color: var(--text-secondary);">
                                Watch your 2D vectors expand to thousands of dimensions
                            </p>
                        </div>
                        <div id="embeddingScaleAnimation" style="min-height: 500px;"></div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button id="continueToJourneyBtn"
                                style="padding: 14px 42px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Continue →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Trigger the animation after a short delay
        setTimeout(() => {
            if (window.ScaleAnimations && window.ScaleAnimations.animateEmbeddingComparison) {
                ScaleAnimations.animateEmbeddingComparison();
            }
        }, 500);
        
        // Add event listener after rendering
        setTimeout(() => {
            const btn = document.getElementById('continueToJourneyBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    // Go to Journey Checkpoint page
                    this.currentStep = 'journey_checkpoint';
                    this.render(document.getElementById('phaseContainer'));
                });
            }
        }, 0);
    },
    
    // Journey Checkpoint Page
    renderJourneyCheckpoint(container) {
        const phaseData = {
            title: 'Embeddings',
            subtitle: `You converted ${Object.keys(Game.state.embeddings).length} tokens into numerical vectors`,
            whereYouAre: 'Your data is now <strong>vectorized</strong>. Each token has become a point in mathematical space, positioned based on usage patterns from training data.',
            whatYouDid: `You converted ${Object.keys(Game.state.embeddings).length} tokens into 2D vectors by grouping tokens that appear in similar contexts. "cat" and "dog" got similar vectors not because you understand them, but because they appear near similar words.`,
            whatsNext: '<strong>Attention:</strong> Calculate which tokens should "attend to" each other based on vector similarity. This lets the model understand context - "chef" near "cooked" means they\'re related.',
            whyItMatters: 'Without embeddings, "cat" is just ID #42. With embeddings, "cat" is near "dog" and "pet" in vector space - the model can now recognize relationships! This is how LLMs capture "meaning" through pure mathematics.',
            buttonText: 'Continue to Attention',
            onContinue: 'phase2.completePhaseAndAdvance()'
        };
        
        Game.renderJourneyCheckpoint(2, phaseData);
    },
    
    // Complete Phase and Advance
    completePhaseAndAdvance() {
        // Mark phase 2 as complete
        if (!Game.state.phaseCompleted[2]) {
            Game.state.phaseCompleted[2] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase2_transition']) {
            Game.addScore(100); // Phase transition bonus
            Game.state.pointsAwarded['phase2_transition'] = true;
            Game.saveState();
        }
        
        // Advance to next phase
        SoundManager.play('success');
        Game.nextPhase();
    },
    
    completePhase() {
        // Mark phase complete with fixed transition bonus
        if (!Game.state.phaseCompleted[2]) {
            Game.state.phaseCompleted[2] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase2_transition']) {
            Game.addScore(100); // Phase transition bonus (fixed)
            Game.state.pointsAwarded['phase2_transition'] = true;
            Game.saveState();
        }
        
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

