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
            
            this.saveState();
            this.updateUI();
            this.closeModal('gameCompleteModal');
            this.renderCurrentPhase();
            this.startTimer(); // Restart timer
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
    }
};

