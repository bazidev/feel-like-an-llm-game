// Phase 4: Training - BUILD BIGRAM MODEL (CRYSTAL CLEAR)
window.phase4 = {
    currentStep: 'intro', // 'intro' -> 'examples' -> 'practice' -> 'build' -> 'recap'
    bigramCounts: {},
    bigramProbs: {},
    practiceTarget: null,
    userCounts: {},
    currentExample: 0,
    
    // Tutorial examples showing training process
    trainingExamples: [
        {
            title: "Example 1: Simple Counting",
            trainingData: "The cat sat. The cat jumped. The cat ran.",
            targetWord: "cat",
            explanation: "Let's count what comes after 'cat' in this simple text.",
            correctCounts: { "sat": 1, "jumped": 1, "ran": 1 },
            insight: "Each word appeared once after 'cat', so each has 33.3% probability!"
        },
        {
            title: "Example 2: Unequal Frequencies",
            trainingData: "The dog barked. The dog barked loudly. The dog slept. The dog barked again.",
            targetWord: "dog",
            explanation: "Now 'dog' is followed by different words at different frequencies.",
            correctCounts: { "barked": 3, "slept": 1 },
            insight: "'barked' appeared 3 times, 'slept' once → 75% barked, 25% slept. The model will favor 'barked'!"
        }
    ],
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'examples') {
            this.renderExamples(container);
        } else if (this.currentStep === 'practice') {
            this.renderPractice(container);
        } else if (this.currentStep === 'build') {
            this.renderBuild(container);
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
                        🏋️ Training: Build Your Model
                    </h1>
                    <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 32px;">
                        Learn patterns - which words follow which
                    </p>
                    
                    <!-- Explanation Card -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">📊</span>
                            <h3 style="font-size: 18px; color: var(--primary); margin: 0;">What is Training?</h3>
                        </div>
                        <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px;">
                            Training means <strong>counting patterns</strong> in your data. You'll build a <strong>bigram model</strong> - for each word, which words came next? How often?
                        </p>
                        <div style="padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--primary);">
                            Example: "chef" → "cooked" (appeared 1 time)<br>
                            "chef" → "loves" (appeared 1 time)<br>
                            → "chef" has 50% chance to be followed by each
                        </div>
                    </div>
                    
                    <!-- Process -->
                    <div style="padding: 20px; background: rgba(191, 0, 255, 0.08); border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">⚙️ The Process</h3>
                        <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.8; text-align: left;">
                            1. Count all word pairs in your training data<br>
                            2. Calculate probabilities (frequency ÷ total)<br>
                            3. Store as model - now you can predict next words!
                        </div>
                    </div>
                    
                    <!-- Reality Check -->
                    <div style="padding: 16px; background: rgba(239, 68, 68, 0.08); border: 2px solid rgba(239, 68, 68, 0.25); 
                               border-radius: 12px; margin-bottom: 32px;">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                            <span style="font-size: 18px;">⚡</span>
                            <span style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                Reality Check: This is just counting! You're not "learning" meanings - just statistical patterns.
                            </span>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase4.startTraining()" 
                            style="font-size: 17px; padding: 14px 40px;">
                        🚀 Start Training
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    startTraining() {
        // Start with examples step
        this.currentStep = 'examples';
        this.currentExample = 0;
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderExamples(container) {
        const example = this.trainingExamples[this.currentExample];
        const tokens = example.trainingData.split(/\s+/);
        const targetWord = example.targetWord;
        
        // Find what comes after target word
        const followingWords = [];
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i].toLowerCase() === targetWord.toLowerCase()) {
                // Remove punctuation from next word
                const nextWord = tokens[i + 1].replace(/[.,!?]/g, '');
                if (nextWord) {
                    followingWords.push(nextWord);
                }
            }
        }
        
        // Count occurrences
        const counts = {};
        followingWords.forEach(word => {
            counts[word] = (counts[word] || 0) + 1;
        });
        
        // Calculate total and probabilities
        const total = followingWords.length;
        const probs = {};
        Object.keys(counts).forEach(word => {
            probs[word] = (counts[word] / total * 100).toFixed(1);
        });
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">${example.title}</h2>
                        <p class="phase-subtitle">Example ${this.currentExample + 1} of ${this.trainingExamples.length}</p>
                    </div>
                    
                    <div class="phase-description">
                        ${example.explanation}
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 What to Notice</h4>
                        <p>Watch how we count what comes AFTER "<strong style="color: var(--primary);">${targetWord}</strong>". 
                        The frequency determines the probability!</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 12px;">
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            <strong>Reality Check:</strong> This is ALL that training is - counting co-occurrences!
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Training Data with Highlighting -->
                        <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">📚 Training Data:</div>
                            <div style="font-size: 16px; font-family: 'JetBrains Mono', monospace; color: white; line-height: 2;">
                                ${this.highlightExampleText(tokens, targetWord)}
                            </div>
                        </div>
                        
                        <!-- Counting Breakdown -->
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                            <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; text-align: center;">
                                📊 What follows "<strong style="color: var(--primary);">${targetWord}</strong>"?
                            </div>
                            
                            ${Object.entries(counts).map(([word, count]) => `
                                <div style="display: flex; align-items: center; justify-content: space-between; 
                                           padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; 
                                           margin-bottom: 10px; border-left: 4px solid var(--primary);">
                                    <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                        <span style="font-family: 'JetBrains Mono', monospace; font-size: 16px; color: white; font-weight: 600;">
                                            "${word}"
                                        </span>
                                        <span style="font-size: 12px; color: var(--text-secondary);">
                                            appeared ${count} ${count === 1 ? 'time' : 'times'}
                                        </span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="font-size: 20px; font-weight: 700; color: var(--primary); font-family: 'JetBrains Mono', monospace;">
                                            ${probs[word]}%
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            
                            <div style="margin-top: 16px; padding: 12px; background: rgba(251, 191, 36, 0.1); 
                                       border-left: 3px solid #fbbf24; border-radius: 6px;">
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    <strong style="color: #fbbf24;">💡 Insight:</strong> ${example.insight}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Navigation -->
                        <div style="display: flex; gap: 12px;">
                            ${this.currentExample > 0 ? `
                                <button class="btn-secondary" onclick="phase4.previousExample()" style="flex: 1;">
                                    ← Previous Example
                                </button>
                            ` : '<div style="flex: 1;"></div>'}
                            
                            ${this.currentExample < this.trainingExamples.length - 1 ? `
                                <button class="btn-primary" onclick="phase4.nextExample()" style="flex: 1;">
                                    Next Example →
                                </button>
                            ` : `
                                <button class="btn-primary" onclick="phase4.startPractice()" style="flex: 1;">
                                    Try It Yourself →
                                </button>
                            `}
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
    },
    
    highlightExampleText(tokens, targetWord) {
        let html = '';
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const cleanToken = token.replace(/[.,!?]/g, '');
            
            if (cleanToken.toLowerCase() === targetWord.toLowerCase()) {
                html += `<span style="background: rgba(191, 0, 255, 0.4); padding: 4px 8px; border-radius: 6px; font-weight: 700;">${token}</span> `;
            } else if (i > 0 && tokens[i-1].replace(/[.,!?]/g, '').toLowerCase() === targetWord.toLowerCase()) {
                // Highlight the word AFTER target
                html += `<span style="background: rgba(0, 212, 255, 0.4); padding: 4px 8px; border-radius: 6px; font-weight: 700; color: #00d4ff;">${token}</span> `;
            } else {
                html += `${token} `;
            }
        }
        return html;
    },
    
    nextExample() {
        if (this.currentExample < this.trainingExamples.length - 1) {
            this.currentExample++;
            Game.addScore(30); // Examples: +30 per completed
            SoundManager.play('click');
            this.render(document.getElementById('phaseContainer'));
        }
    },
    
    previousExample() {
        if (this.currentExample > 0) {
            this.currentExample--;
            SoundManager.play('click');
            this.render(document.getElementById('phaseContainer'));
        }
    },
    
    startPractice() {
        this.currentStep = 'practice';
        this.setupPractice();
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    setupPractice() {
        // Pick a common word from tokens to practice counting
        const tokens = Game.state.tokens.filter(t => t.trim() && !/^[.,!?]$/.test(t));
        const wordCounts = {};
        tokens.forEach(t => {
            wordCounts[t] = (wordCounts[t] || 0) + 1;
        });
        
        // Find a word that appears at least 3 times
        const candidates = Object.entries(wordCounts)
            .filter(([word, count]) => count >= 3 && word.length > 2)
            .sort((a, b) => b[1] - a[1]);
        
        this.practiceTarget = candidates[0] ? candidates[0][0] : tokens[0];
        this.userCounts = {};
    },
    
    renderPractice(container) {
        const tokens = Game.state.tokens.filter(t => t.trim() && !/^[.,!?]$/.test(t));
        const target = this.practiceTarget;
        
        // Find where target appears and what comes after
        const followingWords = [];
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i] === target) {
                followingWords.push(tokens[i + 1]);
            }
        }
        
        const uniqueFollowing = [...new Set(followingWords)];
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Practice Counting</h2>
                        <p class="phase-subtitle">Learn the pattern</p>
                    </div>
                    
                    <div class="phase-description">
                        Find the word "<strong>${target}</strong>" in the text. Count how many times each word follows it!
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How to Count</h4>
                        <p>Read through the training data. Every time you see "<strong>${target}</strong>", look at what word comes next. Tally it up!</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Training Text with Highlighting -->
                        <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px; max-height: 200px; overflow-y: auto;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">📚 Your Training Data:</div>
                            <div style="font-size: 14px; font-family: 'JetBrains Mono', monospace; color: white; line-height: 1.8;">
                                ${this.highlightTrainingText(tokens, target)}
                            </div>
                        </div>
                        
                        <!-- Counting Interface -->
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
                                After "<strong style="color: var(--primary);">${target}</strong>", count occurrences:
                            </div>
                            ${uniqueFollowing.map(word => `
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 8px;">
                                    <div style="flex: 1; font-size: 14px; font-family: 'JetBrains Mono', monospace; color: white;">"${word}"</div>
                                    <div style="display: flex; gap: 8px; align-items: center;">
                                        <button onclick="phase4.decrementCount('${word}')" 
                                                style="width: 32px; height: 32px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; 
                                                       border-radius: 6px; color: #ef4444; font-size: 18px; cursor: pointer; display: flex; 
                                                       align-items: center; justify-content: center;">
                                            −
                                        </button>
                                        <div id="count-${word}" style="min-width: 40px; text-align: center; font-size: 18px; font-weight: 700; color: var(--primary);">
                                            0
                                        </div>
                                        <button onclick="phase4.incrementCount('${word}')" 
                                                style="width: 32px; height: 32px; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; 
                                                       border-radius: 6px; color: #22c55e; font-size: 18px; cursor: pointer; display: flex; 
                                                       align-items: center; justify-content: center;">
                                            +
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <button class="btn-primary" onclick="phase4.checkCounts()" style="width: 100%;">
                            ✓ Check My Counts
                        </button>
                        
                        <div id="feedback" style="display: none; margin-top: 16px; padding: 16px; border-radius: 10px;"></div>
                        
                    </div>
                </div>
            </div>
        `;
        
        // Initialize counts display
        uniqueFollowing.forEach(word => {
            this.userCounts[word] = 0;
        });
    },
    
    highlightTrainingText(tokens, target) {
        let html = '';
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token === target) {
                html += `<span style="background: rgba(191, 0, 255, 0.4); padding: 2px 6px; border-radius: 4px; font-weight: 700;">${token}</span> `;
            } else {
                html += `${token} `;
            }
        }
        return html;
    },
    
    incrementCount(word) {
        this.userCounts[word] = (this.userCounts[word] || 0) + 1;
        const el = document.getElementById(`count-${word}`);
        if (el) {
            el.textContent = this.userCounts[word];
        }
        SoundManager.play('click');
    },
    
    decrementCount(word) {
        if (this.userCounts[word] > 0) {
            this.userCounts[word]--;
            const el = document.getElementById(`count-${word}`);
            if (el) {
                el.textContent = this.userCounts[word];
            }
            SoundManager.play('click');
        }
    },
    
    checkCounts() {
        const tokens = Game.state.tokens.filter(t => t.trim() && !/^[.,!?]$/.test(t));
        const target = this.practiceTarget;
        
        // Calculate actual counts
        const actualCounts = {};
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i] === target) {
                const next = tokens[i + 1];
                actualCounts[next] = (actualCounts[next] || 0) + 1;
            }
        }
        
        // Check user counts
        let allCorrect = true;
        let errors = [];
        
        Object.keys(this.userCounts).forEach(word => {
            const userCount = this.userCounts[word];
            const actualCount = actualCounts[word] || 0;
            if (userCount !== actualCount) {
                allCorrect = false;
                errors.push(`"${word}": you counted ${userCount}, actual is ${actualCount}`);
            }
        });
        
        const feedback = document.getElementById('feedback');
        feedback.style.display = 'block';
        
        if (allCorrect) {
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #22c55e; font-weight: 700; margin-bottom: 8px;">✓ Perfect Counting!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    You correctly counted all the patterns. Now let's build the full model!
                </div>
            `;
            SoundManager.play('success');
            Game.addScore(100);
            
            setTimeout(() => {
                this.currentStep = 'build';
                this.buildBigramModel();
                this.render(document.getElementById('phaseContainer'));
            }, 2000);
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #ef4444; font-weight: 700; margin-bottom: 8px;">Not quite right!</div>
                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                    ${errors.slice(0, 2).map(e => `• ${e}`).join('<br>')}
                    <br><br>💡 Tip: Read carefully through the training text above
                </div>
            `;
            SoundManager.play('error');
        }
    },
    
    buildBigramModel() {
        const tokens = Game.state.tokens.filter(t => t.trim() && !/^[.,!?]$/.test(t));
        
        this.bigramCounts = {};
        this.bigramProbs = {};
        
        // Count bigrams
        for (let i = 0; i < tokens.length - 1; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            
            if (!this.bigramCounts[current]) {
                this.bigramCounts[current] = {};
            }
            
            this.bigramCounts[current][next] = (this.bigramCounts[current][next] || 0) + 1;
        }
        
        // Calculate probabilities
        Object.keys(this.bigramCounts).forEach(word => {
            const total = Object.values(this.bigramCounts[word]).reduce((sum, count) => sum + count, 0);
            this.bigramProbs[word] = {};
            
            Object.entries(this.bigramCounts[word]).forEach(([nextWord, count]) => {
                this.bigramProbs[word][nextWord] = count / total;
            });
        });
        
        // Store in game state
        Game.state.model = {
            bigrams: this.bigramProbs,
            counts: this.bigramCounts
        };
    },
    
    renderBuild(container) {
        const totalBigrams = Object.keys(this.bigramCounts).length;
        const sampleWord = Object.keys(this.bigramProbs)[0];
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Training Complete!</h2>
                        <p class="phase-subtitle">Your model is ready</p>
                    </div>
                    
                    <div class="phase-description">
                        Your bigram model learned ${totalBigrams} word patterns from your training data.
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 What You Built</h4>
                        <p>A statistical model that knows: given word X, what's likely to come next based on your training data.</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Model Stats -->
                        <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 24px; text-align: center;">
                            <div style="font-size: 48px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">${totalBigrams}</div>
                            <div style="font-size: 14px; color: var(--text-secondary);">Word patterns learned</div>
                        </div>
                        
                        <!-- Sample Pattern -->
                        ${sampleWord ? `
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">📊 Sample Pattern:</div>
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
                                <div style="color: var(--primary); margin-bottom: 12px;">After "<strong>${sampleWord}</strong>", you learned:</div>
                                ${Object.entries(this.bigramProbs[sampleWord]).map(([next, prob]) => `
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: var(--text-secondary);">
                                        <span>"${next}"</span>
                                        <span style="color: ${prob > 0.5 ? '#22c55e' : '#f59e0b'};">${(prob * 100).toFixed(0)}% chance</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <!-- The Math -->
                        <div style="padding: 20px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.08), rgba(0, 212, 255, 0.05)); 
                                   border: 2px solid rgba(191, 0, 255, 0.25); border-radius: 12px; margin-bottom: 24px;">
                            <h3 style="font-size: 16px; color: var(--secondary); margin-bottom: 12px;">🧮 The Math Behind It</h3>
                            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.8;">
                                For each word pair count:<br>
                                <code style="color: var(--primary);">Probability = Count ÷ Total Occurrences</code><br><br>
                                Example: "chef" appeared before 2 different words, each 1 time<br>
                                → Each has 1÷2 = 50% probability
                            </div>
                        </div>
                        
                        <button class="btn-primary" onclick="phase4.completeTraining()" style="width: 100%;">
                            View Training Summary
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
    },
    
    completeTraining() {
        Game.addScore(250); // Mini-game completion bonus (fixed)
        SoundManager.play('levelUp');
        this.currentStep = 'recap';
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderRecap(container) {
        const totalPatterns = Object.keys(Game.state.model.bigrams).length;
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 32px; text-align: center; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        ✓ Phase 4 Complete: Training
                    </h1>
                    
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 32px;">
                        You trained a bigram model with ${totalPatterns} word patterns
                    </p>
                    
                    <!-- Model Summary -->
                    <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 12px; margin-bottom: 24px;">
                        <div style="text-align: center; margin-bottom: 16px;">
                            <span style="font-size: 12px; color: var(--text-secondary);">🎯 YOUR TRAINED MODEL</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
                                <div style="font-size: 28px; color: var(--primary); font-weight: 700;">${totalPatterns}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Word Patterns</div>
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; text-align: center;">
                                <div style="font-size: 28px; color: var(--secondary); font-weight: 700;">${Game.state.tokens.length}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Training Tokens</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- What Happened -->
                    <div style="padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 16px; color: var(--primary); margin-bottom: 12px;">📊 What Just Happened:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: var(--text-secondary); font-size: 14px; line-height: 1.8;">
                            <li>You counted every word pair in your training data</li>
                            <li>Calculated <strong>probabilities</strong> for what comes next</li>
                            <li>Built a <strong>statistical model</strong> - no understanding, just patterns</li>
                            <li>Your model is now ready to <strong>generate text</strong>!</li>
                        </ul>
                    </div>
                    
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
                                    Your model is <strong>trained</strong>! It now knows the probability of every word following every other word, based on your training data.
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid var(--primary); border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: var(--primary); margin-bottom: 6px;">✅ What You Did</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    You built a bigram model by counting word pairs: "chef"→"cooked" (3 times), "chef"→"loves" (2 times), etc. 
                                    Then calculated probabilities: 60% "cooked", 40% "loves". Pure statistics from ${totalPatterns} patterns!
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid var(--secondary); border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: var(--secondary); margin-bottom: 6px;">🎯 What's Next</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    <strong>Text Generation:</strong> Use your trained probabilities to generate NEW sentences! 
                                    Start with a word, pick the next based on learned odds, repeat. Watch your AI write!
                                </div>
                            </div>
                            
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.3); border-left: 3px solid #fbbf24; border-radius: 6px;">
                                <div style="font-size: 13px; font-weight: 600; color: #fbbf24; margin-bottom: 6px;">💡 Why It Matters</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    This IS the "AI"! There's no magic - just counting and probabilities. 
                                    The model doesn't "know" that chefs cook. It just learned that "chef" is often followed by "cooked" in the training data. 
                                    Scale this to trillions of examples, and you get GPT-4!
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ANIMATED SCALE COMPARISON -->
                    <div style="margin: 40px 0; padding: 32px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.05)); 
                               border: 3px solid rgba(245, 158, 11, 0.3); border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h3 style="font-size: 22px; color: #f59e0b; margin-bottom: 10px; font-weight: 700;">
                                💫 Parameter Explosion: Your Model vs. Real LLMs
                            </h3>
                            <p style="font-size: 14px; color: var(--text-secondary);">
                                Witness the astronomical gap between your parameters and production models
                            </p>
                        </div>
                        <div id="parameterScaleAnimation" style="min-height: 600px;"></div>
                    </div>
                    
                    <button class="btn-primary" onclick="phase4.completePhase()" style="width: 100%; font-size: 17px; padding: 14px;">
                        Continue to Generation →
                    </button>
                    
                </div>
            </div>
        `;
        
        // Trigger the animation after a short delay
        setTimeout(() => {
            if (window.ScaleAnimations && window.ScaleAnimations.animateParameterComparison) {
                const modelPatterns = Object.keys(Game.state.model.bigrams).length;
                ScaleAnimations.animateParameterComparison(modelPatterns);
            }
        }, 500);
    },
    
    completePhase() {
        // Mark phase complete with fixed transition bonus
        if (!Game.state.phaseCompleted[4]) {
            Game.state.phaseCompleted[4] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase4_transition']) {
            Game.addScore(100); // Phase transition bonus (fixed)
            Game.state.pointsAwarded['phase4_transition'] = true;
            Game.saveState();
        }
        
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};

