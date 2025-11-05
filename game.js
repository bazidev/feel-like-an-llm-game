// Core game state management
const Game = {
    state: {
        currentPhase: 0,
        totalPhases: 7,
        score: 0,
        tokensProcessed: 0,
        modelName: 'Unnamed Model',
        avatar: null,
        phaseScores: {},
        phaseCompleted: {},
        startTime: Date.now(),
        timerInterval: null,
        
        // Training Data - Connected Journey (expanded for richer patterns)
        trainingText: "A cat sat on the mat. The dog played with the ball. The cat likes fish. The dog likes bones.",
        tokens: [],           // Filled in Phase 1 (Tokenization)
        embeddings: {},       // Filled in Phase 2 (Embeddings)
        attentionWeights: {}, // Filled in Phase 3 (Attention)
        model: null,          // Filled in Phase 4 (Training)
        
        // Training data from user input (optional future feature)
        userTrainingText: null
    },
    
    init() {
        this.loadState();
        this.updateUI();
        this.setupEventListeners();
        this.renderCurrentPhase();
        // Timer will start after avatar setup, not here
    },
    
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextPhase());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevPhase());
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => this.confirmReset());
        
        // Scoreboard button
        document.getElementById('scoreboardBtn').addEventListener('click', () => this.showScoreboard());
        
        // Hint toggle
        document.getElementById('hintToggle').addEventListener('click', () => this.toggleHint());
        
        // Modal buttons
        document.getElementById('continueBtn').addEventListener('click', () => this.closeModal('congratsModal'));
        document.getElementById('playAgainBtn').addEventListener('click', () => this.reset());
        document.getElementById('cancelResetBtn').addEventListener('click', () => this.closeModal('resetConfirmModal'));
        document.getElementById('confirmResetBtn').addEventListener('click', () => this.performReset());
    },
    
    // LocalStorage management
    saveState() {
        localStorage.setItem('gameState', JSON.stringify(this.state));
    },
    
    loadState() {
        const saved = localStorage.getItem('gameState');
        if (saved) {
            try {
                const loadedState = JSON.parse(saved);
                this.state = { ...this.state, ...loadedState };
            } catch (e) {
                console.error('Failed to load game state:', e);
            }
        }
    },
    
    confirmReset() {
        // Show confirmation modal
        document.getElementById('resetConfirmModal').classList.add('active');
        SoundManager.play('click');
    },
    
    performReset() {
        // Close modal first
        this.closeModal('resetConfirmModal');
        
        // Wait for modal to close, then reset
        setTimeout(() => {
            localStorage.removeItem('gameState');
            this.state = {
                currentPhase: 0,
                totalPhases: 7,
                score: 0,
                tokensProcessed: 0,
                modelName: 'Unnamed Model',
                avatar: null,
                phaseScores: {},
                phaseCompleted: {},
                startTime: Date.now(),
                timerInterval: null,
                
                // Reset training data
                trainingText: "A cat sat on the mat. The dog played with the ball. The cat likes fish. The dog likes bones.",
                tokens: [],
                embeddings: {},
                attentionWeights: {},
                model: null,
                userTrainingText: null
            };
            
            // Reset phase0 to 'intro' step so user starts from beginning
            if (window.phase0) {
                window.phase0.currentStep = 'intro';
                window.phase0.selectedDataset = null;
                window.phase0.selectedName = null;
                window.phase0.selectedAvatar = null;
            }
            
            // Reset phase1 to 'concept1' step so it starts from beginning
            if (window.phase1) {
                window.phase1.currentStep = 'concept1';
                window.phase1.currentExample = 0;
                window.phase1.userSplits = [];
                window.phase1.validatedTokens = [];
                window.phase1.colorIndex = 0;
                window.phase1.currentText = '';
                window.phase1.correctTokens = [];
            }
            
            // Clear avatar display
            document.getElementById('modelAvatar').textContent = '';
            document.getElementById('modelName').textContent = 'Unnamed Model';
            
            this.saveState();
            this.updateUI();
            this.closeModal('gameCompleteModal');
            this.renderCurrentPhase();
            // Don't start timer here - it starts after avatar selection
            SoundManager.play('success');
        }, 200);
    },
    
    reset() {
        // For backwards compatibility (called from playAgain button)
        this.performReset();
    },
    
    // Phase navigation
    nextPhase() {
        console.log('⏭️ nextPhase called');
        console.log('   Current phase:', this.state.currentPhase);
        console.log('   Total phases:', this.state.totalPhases);
        console.log('   Phase completed:', this.state.phaseCompleted[this.state.currentPhase]);
        
        // Only allow moving forward if current phase is completed
        if (this.state.currentPhase < this.state.totalPhases - 1 && 
            this.state.phaseCompleted[this.state.currentPhase]) {
            this.state.currentPhase++;
            console.log('✅ Advanced to phase:', this.state.currentPhase);
            this.saveState();
            this.renderCurrentPhase();
            this.updateUI();
            SoundManager.play('click');
        } else {
            console.warn('⚠️ Cannot advance phase!');
            console.warn('   Reason: Phase not completed or at end');
            // Force render current phase anyway
            this.renderCurrentPhase();
        }
    },
    
    prevPhase() {
        // Allow going back to review, but can't re-earn points
        // NEVER allow going back to Phase 0 (name selection)
        if (this.state.currentPhase > 1) {
            this.state.currentPhase--;
            this.saveState();
            this.renderCurrentPhase();
            this.updateUI();
            SoundManager.play('click');
        } else if (this.state.currentPhase === 1) {
            // At phase 1, show a message that you can't go back to name selection
            this.showMessage('You cannot return to name selection once the journey has started!', 'info');
        }
    },
    
    showMessage(text, type = 'info') {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'error' ? 'linear-gradient(135deg, var(--error), #dc2626)' : 
                        type === 'success' ? 'linear-gradient(135deg, var(--success), #10b981)' : 
                        'linear-gradient(135deg, var(--primary), var(--secondary))'};
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        `;
        document.body.appendChild(msg);
        
        // Animate in and out
        if (typeof gsap !== 'undefined') {
            gsap.from(msg, {
                scale: 0,
                duration: 0.3,
                ease: 'back.out(2)'
            });
            
            gsap.to(msg, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                delay: 2,
                onComplete: () => msg.remove()
            });
        } else {
            setTimeout(() => msg.remove(), 2300);
        }
    },
    
    completePhase(pointsEarned, message) {
        // Only award points if phase not already completed
        if (!this.state.phaseCompleted[this.state.currentPhase]) {
            this.addScore(pointsEarned);
        }
        
        this.state.phaseCompleted[this.state.currentPhase] = true;
        this.saveState();
        this.showCongratsModal(pointsEarned, message);
        SoundManager.play('levelUp');
        
        // Check if game is complete
        if (this.state.currentPhase === this.state.totalPhases - 1) {
            setTimeout(() => {
                this.showGameCompleteModal();
            }, 2000);
        }
    },
    
    // Scoring
    addScore(points) {
        this.state.score += points;
        this.animateStatChange('scoreValue', this.state.score);
        this.saveState();
    },
    
    addTokens(count) {
        this.state.tokensProcessed += count;
        this.animateStatChange('tokensValue', this.state.tokensProcessed);
        this.saveState();
    },
    
    setModelName(name) {
        this.state.modelName = name;
        document.getElementById('modelName').textContent = name;
        this.saveState();
    },
    
    // UI updates
    updateUI() {
        // Update header stats
        document.getElementById('scoreValue').textContent = this.state.score;
        document.getElementById('tokensValue').textContent = this.state.tokensProcessed.toLocaleString();
        document.getElementById('modelName').textContent = this.state.modelName;
        this.updateTimerDisplay();
        
        // Update avatar if exists
        if (this.state.avatar && window.phase0 && window.phase0.avatars) {
            const avatarData = window.phase0.avatars.find(a => a.id === this.state.avatar);
            if (avatarData) {
                document.getElementById('modelAvatar').textContent = avatarData.icon;
            }
        }
        
        // Update progress bar
        const progress = (this.state.currentPhase / (this.state.totalPhases - 1)) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
        
        // Update phase indicator
        document.getElementById('phaseIndicator').textContent = 
            `Phase ${this.state.currentPhase} of ${this.state.totalPhases - 1}`;
        
        // Navigation section
        const phaseNav = document.querySelector('.phase-nav');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Hide navigation during Phase 0 (has its own internal flow)
        if (this.state.currentPhase === 0) {
            if (phaseNav) phaseNav.style.display = 'none';
        } else {
            if (phaseNav) phaseNav.style.display = 'flex';
            
            // Update navigation buttons
            prevBtn.disabled = this.state.currentPhase <= 1; // Can't go back past phase 1
            
            if (this.state.currentPhase === this.state.totalPhases - 1) {
                nextBtn.textContent = 'Finish';
                nextBtn.disabled = true;
            } else {
                nextBtn.textContent = 'Next →';
                nextBtn.disabled = !this.state.phaseCompleted[this.state.currentPhase];
            }
        }
    },
    
    animateStatChange(elementId, newValue) {
        const element = document.getElementById(elementId);
        gsap.to(element, {
            innerHTML: newValue,
            duration: 0.5,
            snap: { innerHTML: 1 },
            ease: 'power2.out',
            onUpdate: function() {
                element.textContent = Math.round(element.innerHTML).toLocaleString();
            }
        });
    },
    
    // Phase rendering
    renderCurrentPhase() {
        const container = document.getElementById('phaseContainer');
        container.innerHTML = '';
        
        // Call the appropriate phase render function
        const phaseName = `phase${this.state.currentPhase}`;
        console.log(`🎮 Rendering phase: ${phaseName}`);
        console.log(`🔍 Phase object exists:`, typeof window[phaseName] !== 'undefined');
        console.log(`🔍 Render function exists:`, window[phaseName] && typeof window[phaseName].render === 'function');
        
        if (window[phaseName] && typeof window[phaseName].render === 'function') {
            try {
                window[phaseName].render(container);
                console.log(`✅ ${phaseName} rendered successfully`);
            } catch (error) {
                console.error(`❌ Error rendering ${phaseName}:`, error);
                container.innerHTML = `<p>Error loading phase: ${error.message}</p>`;
            }
        } else {
            console.warn(`⚠️ ${phaseName} not found or missing render function`);
            container.innerHTML = `
                <div class="phase">
                    <h1 class="phase-title">⚠️ Phase Not Available</h1>
                    <p class="phase-subtitle">Looking for: ${phaseName}</p>
                    <div class="phase-description">
                        <p>Available phases: ${Object.keys(window).filter(k => k.startsWith('phase')).join(', ')}</p>
                    </div>
                </div>
            `;
        }
        
        // Animate phase entrance
        if (typeof gsap !== 'undefined') {
            gsap.from(container, {
                opacity: 0,
                y: 30,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    },
    
    // Hint system
    setHint(hintText) {
        document.getElementById('hintContent').innerHTML = hintText;
    },
    
    toggleHint() {
        const hintContent = document.getElementById('hintContent');
        hintContent.classList.toggle('active');
        SoundManager.play('click');
    },
    
    // Modals
    showCongratsModal(points, message) {
        document.getElementById('phaseCompleteMessage').textContent = message;
        document.getElementById('pointsEarned').textContent = `+${points} points!`;
        document.getElementById('congratsModal').classList.add('active');
    },
    
    showGameCompleteModal() {
        const timeTaken = Math.floor((Date.now() - this.state.startTime) / 1000 / 60);
        document.getElementById('finalStats').innerHTML = `
            <div class="stat">
                <div class="stat-label">Final Score</div>
                <div class="stat-value glow-text">${this.state.score}</div>
            </div>
            <div class="stat">
                <div class="stat-label">Final Level</div>
                <div class="stat-value">${this.state.level}</div>
            </div>
            <div class="stat">
                <div class="stat-label">Tokens Processed</div>
                <div class="stat-value">${this.state.tokensProcessed.toLocaleString()}</div>
            </div>
            <div class="stat">
                <div class="stat-label">Time Taken</div>
                <div class="stat-value">${timeTaken} minutes</div>
            </div>
        `;
        document.getElementById('gameCompleteModal').classList.add('active');
    },
    
    closeModal(modalId) {
        console.log('🚪 Closing modal:', modalId);
        
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            // Force reflow
            modal.offsetHeight;
        }
        
        if (modalId === 'congratsModal') {
            console.log('📍 Current phase:', this.state.currentPhase);
            console.log('✅ Phase completed:', this.state.phaseCompleted[this.state.currentPhase]);
            // Small delay to ensure modal is closed before advancing
            setTimeout(() => {
                if (this.state.currentPhase < this.state.totalPhases - 1) {
                    console.log('➡️ Advancing to next phase...');
                    this.nextPhase();
                } else {
                    console.log('🏁 Already at last phase, just rendering current');
                    this.renderCurrentPhase();
                }
            }, 100);
        }
    },
    
    // Timer functions
    startTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }
        this.state.startTime = this.state.startTime || Date.now();
        this.state.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    },
    
    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    },
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('gameTimer');
        if (timerElement && this.state.startTime) {
            const elapsedTime = Math.floor((Date.now() - this.state.startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    },
    
    getElapsedTime() {
        if (!this.state.startTime) return '00:00';
        const elapsedTime = Math.floor((Date.now() - this.state.startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // Scoreboard System
    saveToScoreboard() {
        const records = this.getScoreboardRecords();
        
        const elapsedSeconds = Math.floor((Date.now() - this.state.startTime) / 1000);
        const rating = this.calculateRating(this.state.score, elapsedSeconds, this.state.tokensProcessed);
        
        const record = {
            id: Date.now(),
            modelName: this.state.modelName || 'Unnamed Model',
            avatar: this.state.avatar,
            score: this.state.score,
            time: elapsedSeconds,
            timeFormatted: this.getElapsedTime(),
            tokens: this.state.tokensProcessed,
            rating: rating,
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };
        
        records.push(record);
        
        // Keep only top 10 records (sorted by rating)
        records.sort((a, b) => b.rating - a.rating);
        const topRecords = records.slice(0, 10);
        
        localStorage.setItem('llmScoreboard', JSON.stringify(topRecords));
        
        return {record, rank: topRecords.findIndex(r => r.id === record.id) + 1};
    },
    
    getScoreboardRecords() {
        try {
            const data = localStorage.getItem('llmScoreboard');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading scoreboard:', e);
            return [];
        }
    },
    
    calculateRating(score, timeSeconds, tokens) {
        // Formula: Higher score = better, Lower time = better, More tokens = better
        // Rating = Score * (1 + tokens/100) / (timeSeconds/60)
        // This rewards high scores, processing more tokens, and doing it quickly
        
        const timeMinutes = Math.max(timeSeconds / 60, 0.1); // Avoid division by zero
        const tokenBonus = 1 + (tokens / 100); // Each 100 tokens adds 100% bonus
        const rating = (score * tokenBonus) / timeMinutes;
        
        return Math.round(rating * 10) / 10; // Round to 1 decimal
    },
    
    getRatingGrade(rating) {
        if (rating >= 200) return {grade: 'S', color: '#fbbf24', label: 'Legendary'};
        if (rating >= 150) return {grade: 'A+', color: '#22c55e', label: 'Excellent'};
        if (rating >= 100) return {grade: 'A', color: '#3b82f6', label: 'Great'};
        if (rating >= 70) return {grade: 'B', color: '#8b5cf6', label: 'Good'};
        if (rating >= 50) return {grade: 'C', color: '#ec4899', label: 'Fair'};
        return {grade: 'D', color: '#ef4444', label: 'Needs Practice'};
    },
    
    showScoreboard() {
        const records = this.getScoreboardRecords();
        const modal = document.getElementById('scoreboardModal');
        const content = document.getElementById('scoreboardContent');
        
        if (records.length === 0) {
            content.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;">🏆</div>
                    <h3 style="font-size: 20px; color: var(--text-secondary); margin-bottom: 12px;">No records yet!</h3>
                    <p style="font-size: 14px; color: var(--text-secondary); opacity: 0.7;">
                        Complete the game to see your scores here.
                    </p>
                </div>
            `;
        } else {
            content.innerHTML = `
                <div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                           border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px;">
                    <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">
                        <strong style="color: var(--primary);">Rating Formula:</strong> 
                        Score × (1 + Tokens/100) ÷ Time (minutes)
                        <br>
                        <span style="opacity: 0.8;">Higher is better! Maximize score and tokens while minimizing time.</span>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${records.map((record, index) => {
                        const ratingData = this.getRatingGrade(record.rating);
                        const avatarData = window.phase0 && window.phase0.avatars 
                            ? window.phase0.avatars.find(a => a.id === record.avatar) 
                            : null;
                        const avatarIcon = avatarData ? avatarData.icon : '🤖';
                        
                        return `
                            <div style="padding: 20px; background: ${index === 0 ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))' : 'rgba(15, 23, 42, 0.6)'};
                                       border: 2px solid ${index === 0 ? 'rgba(251, 191, 36, 0.5)' : 'rgba(0, 245, 255, 0.2)'}; 
                                       border-radius: 12px; position: relative;">
                                
                                ${index === 0 ? '<div style="position: absolute; top: -10px; right: 20px; background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #000;">👑 TOP</div>' : ''}
                                
                                <div style="display: grid; grid-template-columns: 50px 1fr auto; gap: 16px; align-items: center;">
                                    
                                    <!-- Rank -->
                                    <div style="text-align: center;">
                                        <div style="font-size: 28px; font-weight: 700; color: ${index === 0 ? '#fbbf24' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'var(--primary)'};">
                                            #${index + 1}
                                        </div>
                                    </div>
                                    
                                    <!-- Info -->
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                            <span style="font-size: 24px;">${avatarIcon}</span>
                                            <span style="font-size: 18px; font-weight: 700; color: white;">${record.modelName}</span>
                                        </div>
                                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12px; color: var(--text-secondary);">
                                            <div>
                                                <span style="color: var(--primary);">Score:</span> 
                                                <strong style="color: white;">${record.score}</strong>
                                            </div>
                                            <div>
                                                <span style="color: var(--secondary);">Time:</span> 
                                                <strong style="color: white;">${record.timeFormatted}</strong>
                                            </div>
                                            <div>
                                                <span style="color: #f59e0b;">Tokens:</span> 
                                                <strong style="color: white;">${record.tokens}</strong>
                                            </div>
                                        </div>
                                        <div style="font-size: 11px; color: var(--text-secondary); opacity: 0.7; margin-top: 6px;">
                                            ${record.date}
                                        </div>
                                    </div>
                                    
                                    <!-- Rating -->
                                    <div style="text-align: center; padding: 12px 20px; background: rgba(0, 0, 0, 0.4); border-radius: 10px; 
                                               border: 2px solid ${ratingData.color};">
                                        <div style="font-size: 28px; font-weight: 700; color: ${ratingData.color};">
                                            ${ratingData.grade}
                                        </div>
                                        <div style="font-size: 11px; color: ${ratingData.color}; font-weight: 600; margin-top: 4px;">
                                            ${ratingData.label}
                                        </div>
                                        <div style="font-size: 16px; color: white; font-weight: 600; margin-top: 6px;">
                                            ${record.rating}
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
        
        modal.classList.add('active');
        SoundManager.play('click');
    }
};

