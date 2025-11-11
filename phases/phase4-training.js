// Phase 4: Training - BUILD BIGRAM MODEL (CRYSTAL CLEAR)
window.phase4 = {
    currentStep: 'intro', // 'intro' -> 'examples' -> 'practice1' -> 'practice2' -> 'backprop' -> 'recap'
    bigramCounts: {},
    bigramProbs: {},
    practiceTarget: null,
    practiceTarget2: null,
    userCounts: {},
    currentExample: 0,
    practiceNumber: 1, // Track which practice (1 or 2)
    hasTwoPractices: true, // Track if dataset supports 2 different practices
    
    // Tutorial examples showing training process
    trainingExamples: [
        {
            title: "Simple Counting",
            trainingData: "The cat sat. The cat jumped. The cat ran.",
            targetWord: "cat",
            explanation: "Let's count what comes after 'cat' in this simple text.",
            correctCounts: { "sat": 1, "jumped": 1, "ran": 1 },
            insight: "Each word appeared once after 'cat', so each has 33.3% probability!"
        },
        {
            title: "Unequal Frequencies",
            trainingData: "The dog barked. The dog barked loudly. The dog slept. The dog barked again.",
            targetWord: "dog",
            explanation: "Now 'dog' is followed by different words at different frequencies.",
            correctCounts: { "barked": 3, "slept": 1 },
            insight: "'barked' appeared 3 times, 'slept' once → 75% barked, 25% slept. The model will favor 'barked'!"
        },
        {
            title: "Multiple Outcomes",
            trainingData: "She loves coffee. She loves tea. She loves music. She loves art. She loves coding.",
            targetWord: "loves",
            explanation: "This word has many different followers with equal frequency.",
            correctCounts: { "coffee": 1, "tea": 1, "music": 1, "art": 1, "coding": 1 },
            insight: "Five different words follow 'loves' once each → each has 20% probability. The model will randomly pick among them!"
        }
    ],
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'examples') {
            this.renderExamples(container);
        } else if (this.currentStep === 'practice1') {
            this.renderPractice(container, 1);
        } else if (this.currentStep === 'practice2') {
            this.renderPractice(container, 2);
        } else if (this.currentStep === 'backprop') {
            this.renderBackpropagation(container);
        } else if (this.currentStep === 'recap') {
            this.renderRecap(container);
        } else if (this.currentStep === 'journey_checkpoint') {
            this.renderJourneyCheckpoint(container);
        }
    },
    
    renderIntro(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        🏋️ Training
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 24px;">
                        Count patterns to build a statistical model
                    </p>
                    
                    <!-- Why do LLMs train? -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🤖</span>
                            <h2 style="font-size: 18px; color: var(--primary); margin: 0;">Why do LLMs train?</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">Training is just counting patterns.</strong> 
                                For each word, the model counts what words came next and how often.
                            </p>
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">These counts become probabilities.</strong> 
                                If "chef" was followed by "cooked" 3 times and "loves" 1 time, there's a 75% chance of "cooked" next.
                            </p>
                            <p style="margin-bottom: 10px;">
                                <strong style="color: var(--primary);">No understanding happens.</strong> 
                                The model doesn't "know" that chefs cook - it just learned that "chef" often appears before "cooked" in the training data.
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: var(--primary);">What about context?</strong> 
                                This bigram model only looks at one word. Real LLMs use <strong>attention</strong> to weigh the importance of all previous words, not just the last one!
                            </p>
                        </div>
                    </div>
                    
                    <!-- How we simplified it -->
                    <div style="background: linear-gradient(135deg, rgba(191, 0, 255, 0.1), rgba(139, 92, 246, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.3); border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🎮</span>
                            <h2 style="font-size: 18px; color: var(--secondary); margin: 0;">How we simplified it for this game</h2>
                        </div>
                        <div style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                Real LLMs use <strong style="color: var(--secondary);">neural networks with billions of parameters</strong> 
                                that learn complex patterns through backpropagation. They predict not just the next word, but across vast context windows.
                            </p>
                            <p style="margin: 0;">
                                For this game, we'll use a <strong style="color: var(--secondary);">simple bigram model</strong> 
                                (word pairs only) so you can see the core concept: training is counting and calculating probabilities.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="phase4.startTraining()" 
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
                        <p class="phase-subtitle">Watch how training works</p>
                    </div>
                    
                    <div class="phase-description">
                        ${example.explanation}
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 What to Notice</h4>
                        <p>Watch how we count what comes after "<strong style="color: var(--primary);">${targetWord}</strong>". 
                        The frequency determines the probability!</p>
                    </div>
                    
                    <div style="padding: 16px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 10px; margin-top: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 18px;">⚡</span>
                            <h4 style="font-size: 13px; color: #ef4444; margin: 0; font-weight: 700;">Reality Check</h4>
                        </div>
                        <p style="font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            This is <strong style="color: #ef4444;">All</strong> that training is—just counting co-occurrences! 
                            No intelligence, no understanding, no reasoning. Just math: 
                            <strong style="color: #ef4444;">Probability = Count ÷ Total</strong>. 
                            Scale this to billions of word pairs and you get GPT!
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Example Counter at Top -->
                        <div style="text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 13px; color: var(--text-secondary);">
                                Example ${this.currentExample + 1} of ${this.trainingExamples.length}
                            </span>
                        </div>
                        
                        <!-- Training Data with Highlighting -->
                        <div style="padding: 14px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 16px;">
                            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">📚 Training Data:</div>
                            <div style="font-size: 13px; font-family: 'JetBrains Mono', monospace; color: white; line-height: 1.8;">
                                ${this.highlightExampleText(tokens, targetWord)}
                            </div>
                        </div>
                        
                        <!-- Counting Breakdown -->
                        <div style="padding: 14px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; margin-bottom: 16px;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; text-align: center;">
                                📊 What follows "<strong style="color: var(--primary);">${targetWord}</strong>"?
                            </div>
                            
                            ${Object.entries(counts).map(([word, count]) => `
                                <div style="display: flex; align-items: center; justify-content: space-between; 
                                           padding: 8px 10px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; 
                                           margin-bottom: 6px; border-left: 3px solid var(--primary);">
                                    <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                                        <span style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: white; font-weight: 600;">
                                            "${word}"
                                        </span>
                                        <span style="font-size: 10px; color: var(--text-secondary);">
                                            appeared ${count} ${count === 1 ? 'time' : 'times'}
                                        </span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <div style="font-size: 16px; font-weight: 700; color: var(--primary); font-family: 'JetBrains Mono', monospace;">
                                            ${probs[word]}%
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            
                            <div style="margin-top: 12px; padding: 10px; background: rgba(251, 191, 36, 0.1); 
                                       border-left: 3px solid #fbbf24; border-radius: 6px;">
                                <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.5;">
                                    <strong style="color: #fbbf24;">💡 Insight:</strong> ${example.insight}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Navigation -->
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            ${this.currentExample < this.trainingExamples.length - 1 ? `
                                <button class="btn-primary" onclick="phase4.nextExample()" style="width: 100%;">
                                    Next Example →
                                </button>
                            ` : `
                                <button class="btn-primary" onclick="phase4.startPractice()" style="width: 100%;">
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
                html += `<span style="background: rgba(191, 0, 255, 0.4); padding: 2px 4px; border-radius: 6px; font-weight: 700;">${token}</span> `;
            } else if (i > 0 && tokens[i-1].replace(/[.,!?]/g, '').toLowerCase() === targetWord.toLowerCase()) {
                // Highlight the word AFTER target
                html += `<span style="background: rgba(0, 212, 255, 0.4); padding: 2px 4px; border-radius: 6px; font-weight: 700; color: #00d4ff;">${token}</span> `;
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
    
    startPractice() {
        this.currentStep = 'practice1';
        this.practiceNumber = 1;
        this.setupPractice();
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    setupPractice() {
        // Pick common words from tokens to practice counting
        const tokens = Game.state.tokens.filter(t => t.trim() && !/^[.,!?]$/.test(t));
        const wordCounts = {};
        tokens.forEach(t => {
            wordCounts[t] = (wordCounts[t] || 0) + 1;
        });
        
        // Helper: Find what words follow a given word
        const hasFollowers = (word) => {
            for (let i = 0; i < tokens.length - 1; i++) {
                if (tokens[i] === word) return true;
            }
            return false;
        };
        
        // Try progressively lower thresholds to find suitable practice words
        let candidates = [];
        for (let minCount = 3; minCount >= 2 && candidates.length < 2; minCount--) {
            candidates = Object.entries(wordCounts)
                .filter(([word, count]) => count >= minCount && word.length > 2 && hasFollowers(word))
                .sort((a, b) => b[1] - a[1]);
        }
        
        // If still not enough, try any word that has followers (no length/count requirement)
        if (candidates.length < 2) {
            candidates = Object.entries(wordCounts)
                .filter(([word]) => hasFollowers(word))
            .sort((a, b) => b[1] - a[1]);
        }
        
        // Set both practice targets (ensure they're different)
        if (candidates.length >= 2) {
            this.practiceTarget = candidates[0][0];
            this.practiceTarget2 = candidates[1][0];
            this.hasTwoPractices = true; // We have 2 different words
        } else if (candidates.length === 1) {
            // Only one suitable word - do only one practice
            this.practiceTarget = candidates[0][0];
            this.practiceTarget2 = null;
            this.hasTwoPractices = false; // Skip practice 2
        } else {
            // Fallback: find any word that appears before another word
            const fallbackWord = tokens.find((t, i) => i < tokens.length - 1);
            this.practiceTarget = fallbackWord || tokens[0];
            this.practiceTarget2 = null;
            this.hasTwoPractices = false; // Skip practice 2
        }
        
        this.userCounts = {};
    },
    
    renderPractice(container, practiceNum) {
        const tokens = Game.state.tokens.filter(t => t.trim() && !/^[.,!?]$/.test(t));
        const target = practiceNum === 1 ? this.practiceTarget : this.practiceTarget2;
        
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
                        <h2 class="phase-title">Practice ${practiceNum}: Counting</h2>
                        <p class="phase-subtitle">Build your training skills</p>
                    </div>
                    
                    <div class="phase-description">
                        Find the word "<strong>${target}</strong>" in the text. Count how many times each word follows it!
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How to Count</h4>
                        <p>Read through the training data. Every time you see "<strong style="color: #fbbf24;">${target}</strong>" (highlighted in <span style="color: #fbbf24;">yellow</span>), look at what word comes next (highlighted in <span style="color: #a855f7;">purple</span>). Tally up each purple word!</p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 700px;">
                        
                        <!-- Training Text with Highlighting -->
                        <div style="padding: 12px; background: rgba(0, 212, 255, 0.08); border-radius: 10px; margin-bottom: 14px; max-height: 180px; overflow-y: auto;">
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">📚 Your Training Data:</div>
                            <div style="font-size: 14px; font-family: 'JetBrains Mono', monospace; color: white; line-height: 1.7;">
                                ${this.highlightTrainingText(tokens, target)}
                            </div>
                        </div>
                        
                        <!-- Counting Interface -->
                        <div style="padding: 14px; background: rgba(255, 255, 255, 0.02); border-radius: 10px; margin-bottom: 14px;">
                            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 10px;">
                                Count how many times each <span style="color: #a855f7; font-weight: 600;">purple word</span> appears after "<strong style="color: #fbbf24;">${target}</strong>":
                            </div>
                            ${uniqueFollowing.map(word => `
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 6px;">
                                    <div style="flex: 1; font-size: 12px; font-family: 'JetBrains Mono', monospace; color: white;">"${word}"</div>
                                    <div style="display: flex; gap: 6px; align-items: center;">
                                        <button onclick="phase4.decrementCount('${word}')" 
                                                style="width: 28px; height: 28px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; 
                                                       border-radius: 6px; color: #ef4444; font-size: 16px; cursor: pointer; display: flex; 
                                                       align-items: center; justify-content: center;">
                                            −
                                        </button>
                                        <div id="count-${word}" style="min-width: 32px; text-align: center; font-size: 15px; font-weight: 700; color: var(--primary);">
                                            0
                                        </div>
                                        <button onclick="phase4.incrementCount('${word}')" 
                                                style="width: 28px; height: 28px; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; 
                                                       border-radius: 6px; color: #22c55e; font-size: 16px; cursor: pointer; display: flex; 
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
                        
                        <div id="feedback" style="display: none; margin-top: 12px; padding: 12px; border-radius: 8px;"></div>
                        
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
                // Highlight the target word (e.g., "The") in yellow/gold
                html += `<span style="background: rgba(251, 191, 36, 0.5); padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #fbbf24;">${token}</span> `;
            } else if (i > 0 && tokens[i-1] === target) {
                // Highlight the word AFTER target in purple/magenta
                html += `<span style="background: rgba(168, 85, 247, 0.5); padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #a855f7;">${token}</span> `;
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
        const target = this.currentStep === 'practice1' ? this.practiceTarget : this.practiceTarget2;
        
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
            const isPractice1 = this.currentStep === 'practice1';
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            
            let message = "Excellent! You've mastered counting patterns!";
            if (isPractice1 && this.hasTwoPractices) {
                message = "Great! Let's practice with one more word...";
            } else if (isPractice1 && !this.hasTwoPractices) {
                message = "Perfect! Moving on to see how this scales...";
            }
            
            feedback.innerHTML = `
                <div style="font-size: 13px; color: #22c55e; font-weight: 700; margin-bottom: 4px;">✓ Perfect Counting!</div>
                <div style="font-size: 11px; color: var(--text-secondary);">
                    ${message}
                </div>
            `;
            SoundManager.play('success');
            Game.addScore(100);
            
            setTimeout(() => {
                if (isPractice1 && this.hasTwoPractices) {
                    // Move to practice 2 (only if we have 2 different words)
                    this.currentStep = 'practice2';
                    this.userCounts = {};
                    this.render(document.getElementById('phaseContainer'));
                } else {
                    // Build model and go to backpropagation explanation
                this.buildBigramModel();
                    this.currentStep = 'backprop';
                this.render(document.getElementById('phaseContainer'));
                }
            }, 2000);
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 14px; color: #ef4444; font-weight: 600; text-align: center;">
                    ❌ Not quite right! Double-check your counts in the text above.
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
    
    renderBackpropagation(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;">
                <div style="max-width: 850px; width: 100%;">
                    
                    <h1 style="font-size: 22px; margin-bottom: 8px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        🔄 Backpropagation
                    </h1>
                    <p style="font-size: 12px; color: var(--text-secondary); text-align: center; margin-bottom: 20px;">
                        The engine that makes neural networks learn
                    </p>
                    
                    <!-- Why show this -->
                    <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.08)); 
                               border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 12px; padding: 14px; margin-bottom: 16px; text-align: center;">
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            <strong style="color: #fbbf24;">Why this matters:</strong> You just trained a simple counting model. 
                            Real LLMs use a completely different training approach called <strong style="color: #fbbf24;">backpropagation</strong>. 
                            Understanding this difference is key to demystifying AI!
                        </p>
                    </div>
                    
                    <!-- What is it? -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">🎯</span>
                            <h2 style="font-size: 15px; color: var(--primary); margin: 0;">Learning from Mistakes</h2>
                        </div>
                        <div style="font-size: 11px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                Real LLMs use <strong style="color: var(--primary);">neural networks with billions of parameters</strong> that start random. 
                                Backpropagation adjusts these parameters by learning from errors.
                            </p>
                            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px;">
                                <div style="margin-bottom: 4px;">Text: "The chef <span style="color: var(--primary);">cooked</span>"</div>
                                <div style="margin-bottom: 4px; color: #f59e0b;">Predicted: "loves" ❌</div>
                                <div style="color: #22c55e;">→ Adjust weights to prefer "cooked"</div>
                            </div>
                            <p style="margin: 10px 0 0 0;">
                                This happens <strong style="color: var(--primary);">billions of times</strong> during training—each adjustment nudges the model closer to correct predictions.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Your model vs Real LLMs -->
                    <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); 
                               border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">⚡</span>
                            <h2 style="font-size: 15px; color: #ef4444; margin: 0;">Your Model vs. Real LLMs</h2>
                        </div>
                        <div style="font-size: 11px; line-height: 1.6; color: var(--text-secondary);">
                            <p style="margin-bottom: 10px;">
                                <strong style="color: #ef4444;">Your bigram model:</strong> Just counts patterns. 
                                No backpropagation needed—probabilities come directly from counting!
                            </p>
                            <p style="margin: 0;">
                                <strong style="color: #ef4444;">Real LLMs:</strong> Neural networks learn through backpropagation over weeks of training. 
                                GPT-4 went through <strong>trillions</strong> of backpropagation steps using calculus (gradients) to adjust billions of parameters.
                            </p>
                            </div>
                        </div>
                        
                    <div style="text-align: center;">
                        <button onclick="phase4.continueFromBackprop()" 
                                style="padding: 10px 28px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 10px; color: white; font-size: 13px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Continue to Model Scale →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
    },
    
    continueFromBackprop() {
        SoundManager.play('click');
        this.currentStep = 'recap';
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderRecap(container) {
        // Award completion bonus for training phase
        Game.addScore(250); // Training completion bonus
        
        const totalPatterns = Object.keys(Game.state.model.bigrams).length;
        
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;">
                <div style="max-width: 950px; width: 100%;">
                    
                    <!-- ANIMATED SCALE COMPARISON -->
                    <div style="margin: 20px 0; padding: 24px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.05)); 
                               border: 3px solid rgba(245, 158, 11, 0.3); border-radius: 16px; overflow: visible;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="font-size: 20px; color: #f59e0b; margin-bottom: 8px; font-weight: 700;">
                                💫 Parameter Explosion: Your Model vs. Real LLMs
                            </h3>
                            <p style="font-size: 13px; color: var(--text-secondary);">
                                Witness the astronomical gap between your parameters and production models
                            </p>
                        </div>
                        <div id="parameterScaleAnimation" style="min-height: 380px; max-height: 380px; overflow: hidden;"></div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button id="continueToJourneyBtn"
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Continue: View Progress →
                    </button>
                    </div>
                    
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
        const totalPatterns = Object.keys(Game.state.model.bigrams).length;
        
        const phaseData = {
            title: 'Training',
            subtitle: `You trained a bigram model with ${totalPatterns} word patterns`,
            whereYouAre: 'Your model is <strong>trained</strong>! It now knows the probability of every word following every other word, based on your training data.',
            whatYouDid: `You built a bigram model by counting word pairs: "chef"→"cooked" (3 times), "chef"→"loves" (2 times), etc. Then calculated probabilities: 60% "cooked", 40% "loves". Pure statistics from ${totalPatterns} patterns!`,
            whatsNext: '<strong>Text Generation:</strong> Use your trained probabilities to generate new sentences! Start with a word, pick the next based on learned odds, repeat. Watch your AI write!',
            whyItMatters: 'This IS the "AI"! There\'s no magic - just counting and probabilities. The model doesn\'t "know" that chefs cook. It just learned that "chef" is often followed by "cooked" in the training data. Scale this to trillions of examples, and you get GPT-4!',
            buttonText: 'Continue to Generation',
            onContinue: 'phase4.completePhaseAndAdvance()'
        };
        
        Game.renderJourneyCheckpoint(4, phaseData);
    },
    
    // Complete Phase and Advance
    completePhaseAndAdvance() {
        // Mark phase 4 as complete
        if (!Game.state.phaseCompleted[4]) {
            Game.state.phaseCompleted[4] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase4_transition']) {
            Game.addScore(100); // Phase transition bonus
            Game.state.pointsAwarded['phase4_transition'] = true;
            Game.saveState();
        }
        
        // Advance to next phase
        SoundManager.play('success');
        Game.nextPhase();
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

