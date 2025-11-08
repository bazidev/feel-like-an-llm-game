// Core game state management
const Game = {
    state: {
        currentPhase: 0,
        totalPhases: 8, // Updated to 8 to include sampling phase
        score: 0,
        tokensProcessed: 0,
        modelName: 'Unnamed Model',
        avatar: null,
        uniqueUserId: null, // Unique username for API scoring (generated on first play)
        phaseScores: {},
        phaseCompleted: {},
        startTime: null,
        
        // Training Data - Connected Journey (expanded for richer patterns)
        trainingText: "A cat sat on the mat. The dog played with the ball. The cat likes fish. The dog likes bones.",
        tokens: [],           // Filled in Phase 1 (Tokenization)
        embeddings: {},       // Filled in Phase 2 (Embeddings)
        attentionWeights: {}, // Filled in Phase 3 (Attention)
        model: null,          // Filled in Phase 4 (Training)
        generatedText: '',    // Filled in Phase 5 (Generation)
        
        // Training data from user input (optional future feature)
        userTrainingText: null
    },
    
    init() {
        this.loadState();
        this.updateUI();
        this.setupEventListeners();
        this.renderCurrentPhase();
        // Restart timer if game has already started (has startTime)
        if (this.state.startTime && this.state.currentPhase > 0) {
            this.startTimer();
        }
    },
    
    setupEventListeners() {
        // Navigation buttons (hidden, but keep listeners for compatibility)
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextPhase());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevPhase());
        
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
        
        // Stop the timer
        this.stopTimer();
        
        // Wait for modal to close, then reset
        setTimeout(() => {
            localStorage.removeItem('gameState');
            this.state = {
                currentPhase: 0,
                totalPhases: 8, // Updated to 8
                score: 0,
                tokensProcessed: 0,
                modelName: 'Unnamed Model',
                avatar: null,
                uniqueUserId: null, // Will be regenerated on next play
                phaseScores: {},
                phaseCompleted: {},
                startTime: null,
                
                // Reset training data
                trainingText: "A cat sat on the mat. The dog played with the ball. The cat likes fish. The dog likes bones.",
                tokens: [],
                embeddings: {},
                attentionWeights: {},
                model: null,
                generatedText: '',
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
                window.phase1.correctAnswers = 0;
                window.phase1.wrongAnswers = 0;
            }
            
            // Reset phase2 (embeddings)
            if (window.phase2) {
                window.phase2.currentStep = 'concept1';
                window.phase2.currentExample = 0;
                window.phase2.tokenGroups = {};
                window.phase2.targetGroups = {};
                window.phase2.groupingAttempts = 0;
                window.phase2.groupingCorrect = 0;
            }
            
            // Reset phase3 (attention)
            if (window.phase3) {
                window.phase3.currentStep = 'intro';
                window.phase3.currentExample = 0;
                window.phase3.sentences = [];
                window.phase3.currentSentence = 0;
                window.phase3.attentionWeights = {};
            }
            
            // Reset phase4 (training)
            if (window.phase4) {
                window.phase4.currentStep = 'intro';
                window.phase4.bigramCounts = {};
                window.phase4.bigramProbs = {};
                window.phase4.practiceTarget = null;
                window.phase4.userCounts = {};
            }
            
            // Reset phase5 (generation)
            if (window.phase5) {
                window.phase5.currentStep = 'intro';
                window.phase5.generatedSequence = [];
            }
            
            // Reset phase6 (finale) - no persistent state
            
            // Reset phase-sampling - will be added when implemented
            
            // Clear avatar display
            document.getElementById('modelAvatar').textContent = '';
            document.getElementById('modelName').textContent = 'Unnamed Model';
            
            // Reset timer display to 00:00
            const timerElement = document.getElementById('gameTimer');
            if (timerElement) {
                timerElement.textContent = '00:00';
            }
            
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
        
        // Don't show modal for final phase (phase 6) - it has its own recap display
        if (this.state.currentPhase === this.state.totalPhases - 1) {
            // Final phase - stop timer and just show sound
            this.stopTimer();
            SoundManager.play('levelUp');
            console.log('🎉 Game Complete! Showing final recap on screen.');
        } else {
            // Regular phase completion - show modal
            this.showCongratsModal(pointsEarned, message);
            SoundManager.play('levelUp');
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
        
        // Update model name with unique ID if exists
        const modelNameEl = document.getElementById('modelName');
        if (this.state.uniqueUserId) {
            modelNameEl.innerHTML = `${this.state.modelName} <span style="font-size: 11px; color: var(--text-secondary); font-weight: 400; opacity: 0.7;">(${this.state.uniqueUserId})</span>`;
        } else {
            modelNameEl.textContent = this.state.modelName;
        }
        
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
        
        // Navigation section - Hide completely (each phase has its own internal navigation)
        const phaseNav = document.querySelector('.phase-nav');
        if (phaseNav) {
            phaseNav.style.display = 'none';
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
        
        // Map phase numbers to phase names (Sampling phase is between 5 and 6)
        let phaseName;
        if (this.state.currentPhase <= 5) {
            phaseName = `phase${this.state.currentPhase}`;
        } else if (this.state.currentPhase === 6) {
            phaseName = 'phaseSampling';
        } else if (this.state.currentPhase === 7) {
            phaseName = 'phase6'; // Finale
        }
        
        console.log(`🎮 Rendering phase: ${phaseName} (currentPhase: ${this.state.currentPhase})`);
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
        // Clear any existing timer first
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Set start time if not already set
        if (!this.state.startTime) {
            this.state.startTime = Date.now();
            this.saveState();
        }
        
        // Update immediately
        this.updateTimerDisplay();
        
        // Then update every second
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
        
        console.log('✅ Timer started at:', new Date(this.state.startTime).toLocaleTimeString());
    },
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('gameTimer');
        if (timerElement && this.state.startTime) {
            const elapsedTime = Math.floor((Date.now() - this.state.startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = timeString;
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
    
    async showScoreboard() {
        const modal = document.getElementById('scoreboardModal');
        const content = document.getElementById('scoreboardContent');
        
        // Show loading state
        content.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.7;">🏆</div>
                <h3 style="font-size: 20px; color: var(--primary); margin-bottom: 12px;">Loading leaderboard...</h3>
                <p style="font-size: 14px; color: var(--text-secondary); opacity: 0.7;">
                    Fetching top scores from the server
                </p>
            </div>
        `;
        
        modal.classList.add('active');
        SoundManager.play('click');
        
        // Fetch leaderboard from API
        const result = await ScoreboardAPI.getLeaderboard(200);
        
        if (!result.success) {
            // Show error with fallback to local records
            console.error('Failed to load leaderboard from API, showing local records');
            const localRecords = this.getScoreboardRecords();
            
            if (localRecords.length === 0) {
                content.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;">⚠️</div>
                        <h3 style="font-size: 18px; color: var(--error); margin-bottom: 12px;">Issue connecting to scoreboard</h3>
                        <p style="font-size: 13px; color: var(--text-secondary); opacity: 0.8; margin-bottom: 16px;">
                            ${result.error || 'Unable to reach the server'}
                        </p>
                        <p style="font-size: 13px; color: var(--text-secondary); opacity: 0.6;">
                            Complete the game to save your score locally.
                        </p>
                    </div>
                `;
            } else {
                // Show local records with warning
                content.innerHTML = `
                    <div style="margin-bottom: 16px; padding: 12px; background: rgba(245, 158, 11, 0.1); 
                               border: 2px solid rgba(245, 158, 11, 0.3); border-radius: 12px;">
                        <div style="font-size: 12px; color: #f59e0b; line-height: 1.6;">
                            ⚠️ <strong>Offline Mode</strong> - Showing your local scores only
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${localRecords.map((record, index) => {
                            const ratingData = this.getRatingGrade(record.rating);
                            const avatarData = window.phase0 && window.phase0.avatars 
                                ? window.phase0.avatars.find(a => a.id === record.avatar)
                                : null;
                            
                            return `
                                <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(191, 0, 255, 0.02)); 
                                           border: 2px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 16px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div style="display: flex; gap: 12px; align-items: center;">
                                            <div style="font-size: 32px;">${avatarData ? avatarData.icon : '🤖'}</div>
                                            <div>
                                                <div style="font-size: 14px; font-weight: 600; color: white;">${record.name}</div>
                                                <div style="font-size: 11px; color: var(--text-secondary);">${new Date(record.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="font-size: 20px; font-weight: 700; color: var(--primary);">${record.score}</div>
                                            <div style="font-size: 11px; color: ${ratingData.color};">${ratingData.label}</div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }
            return;
        }
        
        // Show API leaderboard
        const leaderboard = result.data;
        
        // Find current user in leaderboard
        const currentUserId = this.state.uniqueUserId;
        const currentUserIndex = leaderboard.findIndex(entry => entry.user_name === currentUserId);
        const currentUserInTop200 = currentUserIndex !== -1;
        
        if (leaderboard.length === 0) {
            content.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;">🏆</div>
                    <h3 style="font-size: 20px; color: var(--text-secondary); margin-bottom: 12px;">No scores yet!</h3>
                    <p style="font-size: 14px; color: var(--text-secondary); opacity: 0.7;">
                        Be the first to complete the game and claim the top spot!
                    </p>
                </div>
            `;
        } else {
            content.innerHTML = `
                ${!currentUserInTop200 && currentUserId ? `
                    <div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, rgba(0, 245, 255, 0.15), rgba(0, 212, 255, 0.08)); 
                               border: 2px solid rgba(0, 245, 255, 0.5); border-radius: 12px; 
                               box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);">
                        <div style="text-align: center;">
                            <div style="font-size: 14px; color: #00f5ff; font-weight: 600; margin-bottom: 8px;">📍 Your Ranking</div>
                            <div style="font-size: 12px; color: rgba(148, 163, 184, 0.9);">
                                ${this.state.phaseCompleted[6] 
                                    ? "You're not in the top 200 yet. Keep playing to improve your score!" 
                                    : "Complete the game to get your score on the leaderboard! 🎮"
                                }
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div id="leaderboardList" style="display: flex; flex-direction: column; gap: 14px; max-height: 500px; overflow-y: auto; padding-right: 8px; scroll-behavior: smooth;">
                    ${leaderboard.map((entry, index) => {
                        const isTopThree = index < 3;
                        const medals = ['🥇', '🥈', '🥉'];
                        const medal = isTopThree ? medals[index] : `#${index + 1}`;
                        const isCurrentUser = entry.user_name === currentUserId;
                        
                        // Handle null values with fallbacks
                        const displayName = entry.name || 'Anonymous';
                        const displayScore = entry.totale_score || entry.score || 0;
                        const displayTime = entry.counter_time || 0;
                        const displayUserId = entry.user_name || 'unknown';
                        
                        // Get avatar icon - use 🎮 for users without avatar
                        let avatarIcon = '🎮'; // Gaming controller for anonymous
                        if (entry.avatar_code && window.phase0 && window.phase0.avatars) {
                            const avatarData = window.phase0.avatars.find(a => a.id === entry.avatar_code);
                            if (avatarData) {
                                avatarIcon = avatarData.icon;
                            }
                        }
                        
                        // Format date nicely
                        const dateStr = entry.playedAt ? new Date(entry.playedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                        const timeStr = entry.playedAt ? new Date(entry.playedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
                        
                        // Adjust name font size based on length
                        const nameFontSize = displayName.length > 15 ? '11px' : (displayName.length > 10 ? '13px' : '14px');
                        
                        // Determine background and border for current user
                        let background, borderColor, boxShadow, animation;
                        if (isCurrentUser) {
                            background = 'linear-gradient(135deg, rgba(0, 245, 255, 0.25), rgba(0, 212, 255, 0.15))';
                            borderColor = 'rgba(0, 245, 255, 0.8)';
                            boxShadow = '0 0 20px rgba(0, 245, 255, 0.6)';
                            animation = 'currentUserGlow 2s ease-in-out infinite';
                        } else if (isTopThree) {
                            background = 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.08))';
                            borderColor = 'rgba(251, 191, 36, 0.5)';
                            boxShadow = '0 4px 20px rgba(251, 191, 36, 0.3)';
                            animation = 'none';
                        } else {
                            background = 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))';
                            borderColor = 'rgba(100, 116, 139, 0.4)';
                            boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
                            animation = 'none';
                        }
                        
                        return `
                            <div id="${isCurrentUser ? 'currentUserEntry' : ''}" style="background: ${background}; 
                                       border: 2px solid ${borderColor}; 
                                       border-radius: 12px; padding: 18px; 
                                       box-shadow: ${boxShadow};
                                       animation: ${animation};
                                       transition: all 0.3s;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; gap: 20px;">
                                    
                                    <!-- Left: Avatar + Name (Left-aligned) -->
                                    <div style="display: flex; align-items: center; gap: 10px; justify-content: flex-start;">
                                        <div style="font-size: 32px; flex-shrink: 0;">${avatarIcon}</div>
                                        <div style="overflow: hidden;">
                                            <div style="font-size: ${nameFontSize}; font-weight: 700; color: ${isCurrentUser ? '#00f5ff' : (isTopThree ? '#fbbf24' : '#e2e8f0')}; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left;">${displayName}</div>
                                            <div style="font-size: 10px; color: ${isCurrentUser ? 'rgba(0, 245, 255, 0.8)' : (isTopThree ? 'rgba(251, 191, 36, 0.7)' : 'rgba(148, 163, 184, 0.8)')}; font-family: monospace; text-align: left;">${displayUserId}</div>
                                        </div>
                                    </div>
                                    
                                    <!-- Center: Time + Score (100% Centered) -->
                                    <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                        <div style="font-size: 16px; font-weight: 600; color: #a78bfa; margin-bottom: 4px;">⏱️ ${Math.floor(displayTime / 60)}:${(displayTime % 60).toString().padStart(2, '0')}</div>
                                        <div style="font-size: 11px; color: rgba(148, 163, 184, 0.8);">score: ${(entry.score || 0).toLocaleString()}</div>
                                    </div>
                                    
                                    <!-- Right: Total Score + Date (Right-aligned) -->
                                    <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; justify-content: center;">
                                        <div style="font-size: 24px; font-weight: 700; color: ${isCurrentUser ? '#00f5ff' : (isTopThree ? '#fbbf24' : '#00f5ff')}; text-shadow: 0 2px 10px ${isCurrentUser ? 'rgba(0, 245, 255, 0.6)' : (isTopThree ? 'rgba(251, 191, 36, 0.4)' : 'rgba(0, 212, 255, 0.3)')}; margin-bottom: 4px;">
                                            ${isTopThree ? medals[index] + ' ' : ''}${displayScore.toLocaleString()}
                                        </div>
                                        ${dateStr ? `<div style="font-size: 10px; color: rgba(148, 163, 184, 0.6);">${dateStr} ${timeStr}</div>` : ''}
                                    </div>
                                    
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            
            // Auto-scroll to current user's entry after rendering completes
            if (currentUserInTop200) {
                setTimeout(() => {
                    const currentUserElement = document.getElementById('currentUserEntry');
                    const leaderboardList = document.getElementById('leaderboardList');
                    
                    if (currentUserElement && leaderboardList) {
                        // Get the positions
                        const listRect = leaderboardList.getBoundingClientRect();
                        const elementRect = currentUserElement.getBoundingClientRect();
                        
                        // Calculate scroll position to center the element
                        const currentScroll = leaderboardList.scrollTop;
                        const elementRelativeTop = elementRect.top - listRect.top;
                        const scrollTo = currentScroll + elementRelativeTop - (listRect.height / 2) + (elementRect.height / 2);
                        
                        // Scroll smoothly
                        leaderboardList.scrollTo({
                            top: scrollTo,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        }
    },
};

