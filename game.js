// Core game state management
const Game = {
    state: {
        currentPhase: 0,
        totalPhases: 8, // Updated to 8 to include sampling phase
        score: 0,
        tokensProcessed: 0,
        modelName: null, // Will be set to creative default if null
        avatar: null,
        uniqueUserId: null, // Unique username for API scoring (generated on first play)
        phaseScores: {},
        phaseCompleted: {},
        pointsAwarded: {}, // Track which points have been awarded (setup, transition, etc.)
        startTime: null,
        finaleStep: null, // Track which step of finale phase user is on (for page refresh)
        
        // Frozen final values (set when game completes)
        finalScore: null,
        finalTime: null,
        finalRating: null,
        gameCompleted: false,
        
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
    
    // Creative default names for models
    getCreativeDefaultName() {
        const creativeNames = [
            'ThinkBot',
            'BrainWave',
            'NeuralNinja',
            'MindMeld',
            'CodeWhisperer',
            'DataDreamer',
            'LogicLlama',
            'SmartSpark',
            'ByteBrain',
            'QuantumQuill',
            'SynapseBot',
            'TokenThinker',
            'PatternPal',
            'WordWizard',
            'IdeaEngine'
        ];
        return creativeNames[Math.floor(Math.random() * creativeNames.length)];
    },
    
    // Get phase name for display
    getPhaseName(phaseNum) {
        const phaseNames = {
            0: 'Ready',
            1: 'Tokenization',
            2: 'Embeddings',
            3: 'Attention',
            4: 'Training',
            5: 'Generation',
            6: 'Sampling',
            7: 'Complete'
        };
        return phaseNames[phaseNum] || 'In Training';
    },
    
    init() {
        this.loadState();
        // Set creative default name if none exists
        if (!this.state.modelName) {
            this.state.modelName = this.getCreativeDefaultName();
            this.saveState();
        }
        
        // If game already started (phase > 0), make stats visible immediately
        if (this.state.currentPhase > 0) {
            const statsContainer = document.getElementById('statsContainer');
            if (statsContainer) {
                statsContainer.style.opacity = '1';
                statsContainer.style.pointerEvents = 'auto';
            }
        }
        
        this.updateUI();
        this.setupEventListeners();
        this.renderCurrentPhase();
        
        // Setup visibility listener for pause/resume
        this.setupVisibilityListener();
        
        // Restart timer if game has already started (but not if completed)
        if (this.state.currentPhase > 0 && !this.state.gameCompleted && (this.state.startTime || this.state.elapsedTimeBeforePause)) {
            console.log('🔄 Page refreshed - resuming timer');
            
            // If we had a startTime from before refresh, we need to account for time that passed
            if (this.state.startTime) {
                const now = Date.now();
                const timeSinceLastStart = now - this.state.startTime;
                
                // Add the elapsed time to our accumulated time
                this.state.elapsedTimeBeforePause = (this.state.elapsedTimeBeforePause || 0) + timeSinceLastStart;
                
                console.log('⏱️ Added', Math.floor(timeSinceLastStart / 1000), 'seconds to accumulated time');
                console.log('⏱️ Total accumulated:', Math.floor(this.state.elapsedTimeBeforePause / 1000), 'seconds');
            }
            
            // Now set new startTime and resume
            this.state.startTime = Date.now();
            this.saveState();
            this.actuallyStartTimer();
        }
    },
    
    setupEventListeners() {
        // Old navigation buttons removed - phases now flow organically
        
        // End Game button
        document.getElementById('endGameBtn').addEventListener('click', () => this.confirmEndGame());
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => this.confirmReset());
        
        // Scoreboard button
        document.getElementById('scoreboardBtn').addEventListener('click', () => this.showScoreboard());
        
        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        
        // Hint toggle
        document.getElementById('hintToggle').addEventListener('click', () => this.toggleHint());
        
        // Modal buttons
        document.getElementById('continueBtn').addEventListener('click', () => this.closeModal('congratsModal'));
        document.getElementById('playAgainBtn').addEventListener('click', () => this.reset());
        document.getElementById('cancelResetBtn').addEventListener('click', () => this.closeModal('resetConfirmModal'));
        document.getElementById('confirmResetBtn').addEventListener('click', () => this.performReset());
        document.getElementById('cancelEndGameBtn').addEventListener('click', () => this.closeModal('endGameModal'));
        document.getElementById('confirmEndGameBtn').addEventListener('click', () => this.performEndGame());
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
    
    confirmEndGame() {
        // Only allow ending game if user has started (phase > 0)
        if (this.state.currentPhase === 0) {
            // If on phase 0, just show a message
            SoundManager.play('error');
            return;
        }
        
        // Calculate rating for display
        let totalElapsed = 0;
        if (this.state.startTime) {
            const currentSessionElapsed = Date.now() - this.state.startTime;
            totalElapsed = (this.state.elapsedTimeBeforePause || 0) + currentSessionElapsed;
        } else if (this.state.elapsedTimeBeforePause) {
            totalElapsed = this.state.elapsedTimeBeforePause;
        }
        const elapsedSeconds = Math.floor(totalElapsed / 1000);
        const rating = this.calculateRating(this.state.score, elapsedSeconds, this.state.tokensProcessed);
        
        // Update the score display in the modal to show rating
        document.getElementById('endGameScoreDisplay').textContent = Math.round(rating);
        document.getElementById('endGameScoreRaw').textContent = this.state.score;
        document.getElementById('endGameTimeDisplay').textContent = this.getElapsedTime();
        
        // Show confirmation modal
        document.getElementById('endGameModal').classList.add('active');
        SoundManager.play('click');
    },
    
    performEndGame() {
        // Close modal first
        this.closeModal('endGameModal');
        
        // Stop the timer
        this.stopTimer();
        
        // Play success sound
        SoundManager.play('success');
        
        // Save score to scoreboard BEFORE jumping to end game page
        const scoreboardResult = this.saveToScoreboard();
        
        // 🎯 LOG TOTAL SCORE (RATING) FOR END GAME
        console.log('🏁 END GAME - TOTAL SCORE (RATING):', scoreboardResult.record.rating);
        console.log('   Raw Score:', scoreboardResult.record.score);
        console.log('   Time:', scoreboardResult.record.timeFormatted);
        console.log('   Tokens:', scoreboardResult.record.tokens);
        
        // Save to API asynchronously (non-blocking)
        if (window.ScoreboardAPI) {
            ScoreboardAPI.saveScore().then(result => {
                if (result.success) {
                    if (result.isHighScore) {
                        // Calculate rating for display
                        const rating = scoreboardResult.record.rating;
                        ScoreboardAPI.showSuccess(`🎉 Score saved! Rating: ${rating} (${this.state.score} pts, ${this.getElapsedTime()})`);
                        SoundManager.play('powerup');
                    } else {
                        console.log('ℹ️ Score submitted from End Game');
                    }
                } else {
                    console.warn('⚠️ Score not saved to API:', result.error);
                }
            });
        }
        
        // Jump to end game score page (new intermediate page)
        setTimeout(() => {
            this.state.currentPhase = 7; // Set to finale phase
            this.state.finaleStep = 'endgame'; // NEW: Show end game score page
            
            // Mark all phases as completed to allow full finale access
            for (let i = 0; i <= 7; i++) {
                if (!this.state.phaseCompleted[i]) {
                    this.state.phaseCompleted[i] = true;
                }
            }
            
            this.saveState();
            this.updateUI();
            
            // Set phase6 to show endgame step
            if (window.phase6) {
                phase6.currentStep = 'endgame';
            }
            
            this.renderCurrentPhase();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
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
                modelName: null, // Will be regenerated in init
                avatar: null,
                uniqueUserId: null, // Will be regenerated on next play
                phaseScores: {},
                phaseCompleted: {},
                pointsAwarded: {}, // Reset points tracking
                startTime: null,
                elapsedTimeBeforePause: 0, // Reset pause tracking
                
                // Reset frozen final values
                finalScore: null,
                finalTime: null,
                finalRating: null,
                gameCompleted: false,
                
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
                window.phase5.currentStep = 'concept1';
                window.phase5.generatedSequence = [];
                window.phase5.currentChallenge = 0;
                window.phase5.challengeCorrect = 0;
                window.phase5.challengeWrong = 0;
            }
            
            // Reset phaseSampling (sampling parameters)
            if (window.phaseSampling) {
                window.phaseSampling.currentStep = 'concept1';
                window.phaseSampling.temperatureValue = 0.7;
                window.phaseSampling.topPValue = 0.9;
                window.phaseSampling.repetitionValue = 1.2;
                window.phaseSampling.presenceValue = 0.5;
                window.phaseSampling.currentScenario = 0;
            }
            
            // Reset phase6 (finale) - no persistent state
            
            // Clear avatar display
            document.getElementById('modelAvatar').textContent = '';
            
            // Generate new creative name
            this.state.modelName = this.getCreativeDefaultName();
            document.getElementById('modelName').textContent = this.state.modelName;
            
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
            
            const fromPhase = this.state.currentPhase;
            const toPhase = this.state.currentPhase + 1;
            
            // Advance to next phase directly (no transition overlay)
            this.state.currentPhase = toPhase;
            console.log('✅ Advanced to phase:', this.state.currentPhase);
            this.saveState();
            this.renderCurrentPhase();
            this.updateUI();
            SoundManager.play('levelup');
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
        
        // Don't show modal for final phase (phase 7) - it has its own recap display
        if (this.state.currentPhase === this.state.totalPhases - 1) {
            // Final phase - timer already stopped in phase6-finale.js
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
    
    // Add score with penalty protection (only subtract if score > 0)
    addScoreSafe(points) {
        if (points < 0 && this.state.score === 0) {
            // Don't go negative - just play error sound
            return;
        }
        this.state.score = Math.max(0, this.state.score + points);
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
    
    // Show/hide buttons based on phase (centralized logic)
    updateButtonVisibility() {
        const resetBtn = document.getElementById('resetBtn');
        const endGameBtn = document.getElementById('endGameBtn');
        
        // Simple rule: Both buttons visible ONLY when game is in progress (Phase 1-6)
        const showButtons = this.state.currentPhase >= 1 && this.state.currentPhase <= 6;
        
        if (resetBtn) {
            resetBtn.style.display = showButtons ? 'inline-flex' : 'none';
        }
        
        if (endGameBtn) {
            endGameBtn.style.display = showButtons ? 'inline-flex' : 'none';
        }
    },
    
    // Legacy functions - redirect to centralized function
    updateResetButtonVisibility() {
        this.updateButtonVisibility();
    },
    
    updateEndGameButtonVisibility() {
        this.updateButtonVisibility();
    },
    
    // UI updates
    updateUI() {
        // Update button visibility first
        this.updateButtonVisibility();
        
        // Update header stats (no journey tracker anymore)
        // Use frozen score if game is completed
        const displayScore = this.state.gameCompleted ? this.state.finalScore : this.state.score;
        document.getElementById('scoreValue').textContent = displayScore;
        document.getElementById('tokensValue').textContent = this.state.tokensProcessed.toLocaleString();
        
        // Update model name with unique ID if exists
        const modelNameEl = document.getElementById('modelName');
        const displayName = this.state.modelName || this.getCreativeDefaultName();
        
        if (this.state.uniqueUserId) {
            modelNameEl.innerHTML = `${displayName} <span style="font-size: 11px; color: var(--text-secondary); font-weight: 400; opacity: 0.7;">(${this.state.uniqueUserId})</span>`;
        } else {
            modelNameEl.textContent = displayName;
        }
        
        // Update version with current phase
        const versionEl = document.getElementById('modelVersion');
        if (versionEl) {
            const phaseName = this.getPhaseName(this.state.currentPhase);
            versionEl.textContent = `v1.0.0 - ${phaseName}`;
        }
        
        this.updateTimerDisplay();
        
        // Update avatar if exists
        if (this.state.avatar && window.phase0 && window.phase0.avatars) {
            const avatarData = window.phase0.avatars.find(a => a.id === this.state.avatar);
            if (avatarData) {
                document.getElementById('modelAvatar').textContent = avatarData.icon;
            }
        }
        
        // Update score/time displays (no progress bar needed)
        document.getElementById('scoreValue').textContent = this.state.score;
        
        // Update model name and version
        const modelName = this.state.modelName || this.getCreativeDefaultName();
        const phaseName = this.getPhaseName(this.state.currentPhase);
        
        document.getElementById('modelName').innerHTML = this.state.avatar 
            ? `${modelName} <span style="font-size: 11px; color: var(--text-secondary); font-weight: 400; opacity: 0.7;">(${this.state.uniqueUserId})</span>`
            : modelName;
        document.getElementById('modelVersion').textContent = `v1.0.0 - ${phaseName}`;
    },
    
    showPhaseTransition(fromPhase, toPhase, callback) {
        // Show beautiful transition overlay explaining the journey
        const phases = [
            { icon: '🎯', name: 'Start', subtitle: 'Choose dataset' },
            { icon: '✂️', name: 'Tokenize', subtitle: 'Break into pieces' },
            { icon: '🔢', name: 'Embed', subtitle: 'Add meaning' },
            { icon: '🎯', name: 'Attention', subtitle: 'Find connections' },
            { icon: '🧠', name: 'Train', subtitle: 'Learn patterns' },
            { icon: '✨', name: 'Generate', subtitle: 'Create text' },
            { icon: '🎛️', name: 'Sampling', subtitle: 'Control generation' },
            { icon: '🎉', name: 'Complete', subtitle: 'Journey done!' }
        ];
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'phase-transition-overlay';
        
        let pipelineHTML = '';
        phases.forEach((phase, idx) => {
            let phaseClass = '';
            if (idx < fromPhase) phaseClass = 'completed';
            else if (idx === fromPhase) phaseClass = 'current';
            else if (idx === toPhase) phaseClass = 'next';
            
            pipelineHTML += `
                <div class="pipeline-phase ${phaseClass}">
                    <div class="pipeline-icon">${phase.icon}</div>
                    <div class="pipeline-name">${phase.name}</div>
                    <div class="pipeline-subtitle">${phase.subtitle}</div>
                </div>
            `;
            
            if (idx < phases.length - 1) {
                pipelineHTML += '<div class="pipeline-arrow">→</div>';
            }
        });
        
        const message = toPhase === 6 
            ? `🎉 <strong>Congratulations!</strong> You've completed your AI journey!`
            : `Moving from <strong>${phases[fromPhase].name}</strong> to <strong>${phases[toPhase].name}</strong>`;
        
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-title">🚀 Your AI Learning Journey</div>
                <div class="pipeline-flow">
                    ${pipelineHTML}
                </div>
                <div class="transition-message">${message}</div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animate in
        setTimeout(() => overlay.classList.add('active'), 50);
        
        // Auto-close after 3.5 seconds
        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(overlay);
                if (callback) callback();
            }, 300);
        }, 3500);
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
    
    // Render Journey Checkpoint Page (reusable for all phases)
    renderJourneyCheckpoint(phaseNum, phaseData) {
        const container = document.getElementById('phaseContainer');
        if (!container) return;
        
        // All phases definition
        const allPhases = [
            { num: 1, icon: '✂️', name: 'Tokenization' },
            { num: 2, icon: '🔢', name: 'Embeddings' },
            { num: 3, icon: '🎯', name: 'Attention' },
            { num: 4, icon: '🧠', name: 'Training' },
            { num: 5, icon: '✨', name: 'Generation' },
            { num: 6, icon: '🎛️', name: 'Sampling' },
            { num: 7, icon: '🎉', name: 'Complete' }
        ];
        
        // Generate sidebar steps
        let stepsHtml = allPhases.map(phase => {
            const isCompleted = this.state.phaseCompleted[phase.num];
            const isCurrent = phaseNum === phase.num;
            const isNext = phaseNum === phase.num - 1;
            
            let statusClass = '';
            let statusIcon = '';
            let statusLabel = '';
            
            if (isCompleted) {
                statusClass = 'completed';
                statusIcon = '✓';
                statusLabel = 'Complete';
            } else if (isCurrent) {
                statusClass = 'current';
                statusIcon = '📍';
                statusLabel = 'Current';
            } else if (isNext) {
                statusClass = 'next';
                statusIcon = '→';
                statusLabel = 'Next';
            } else {
                statusClass = 'locked';
                statusIcon = '🔒';
                statusLabel = 'Locked';
            }
            
            return `
                <div class="journey-step ${statusClass}">
                    <div class="step-icon">${phase.icon}</div>
                    <div class="step-info">
                        <div class="step-name">${phase.num}. ${phase.name}</div>
                        <div class="step-status">${statusIcon} ${statusLabel}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = `
            <div class="journey-checkpoint-page" style="display: flex; gap: 50px; padding: 40px 60px; height: 100%; overflow-y: auto;">
                
                <!-- LEFT SIDEBAR: Journey Progress -->
                <div class="journey-checkpoint-sidebar">
                    <div class="journey-header">
                        <div class="journey-icon">🗺️</div>
                        <h3>Your Journey</h3>
                    </div>
                    <div class="journey-steps">
                        ${stepsHtml}
                    </div>
                    <div class="journey-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(phaseNum / 7) * 100}%"></div>
                        </div>
                        <div class="progress-text">${phaseNum}/7</div>
                    </div>
                </div>
                
                <!-- CENTER CONTENT: Phase-specific information -->
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 850px;">
                    <div style="width: 100%;">
                        
                        <h1 style="font-size: 24px; text-align: center; margin-bottom: 4px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            ✓ Phase ${phaseNum} Complete: ${phaseData.title}
                        </h1>
                        
                        <p style="font-size: 14px; color: var(--text-secondary); text-align: center; margin-bottom: 25px;">
                            ${phaseData.subtitle}
                        </p>
                        
                        <!-- Journey Checkpoint Sections -->
                        <div style="display: grid; gap: 14px; margin-bottom: 32px;">
                            
                            <div style="padding: 18px 20px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid #22c55e; border-radius: 10px;">
                                <div style="font-size: 14px; font-weight: 600; color: #22c55e; margin-bottom: 8px;">📍 Where You Are</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    ${phaseData.whereYouAre}
                                </div>
                            </div>
                            
                            <div style="padding: 18px 20px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid var(--primary); border-radius: 10px;">
                                <div style="font-size: 14px; font-weight: 600; color: var(--primary); margin-bottom: 8px;">✅ What You Did</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    ${phaseData.whatYouDid}
                                </div>
                            </div>
                            
                            <div style="padding: 18px 20px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid var(--secondary); border-radius: 10px;">
                                <div style="font-size: 14px; font-weight: 600; color: var(--secondary); margin-bottom: 8px;">🎯 What's Next</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    ${phaseData.whatsNext}
                                </div>
                            </div>
                            
                            <div style="padding: 18px 20px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid #fbbf24; border-radius: 10px;">
                                <div style="font-size: 14px; font-weight: 600; color: #fbbf24; margin-bottom: 8px;">💡 Why It Matters</div>
                                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                    ${phaseData.whyItMatters}
                                </div>
                            </div>
                            
                        </div>
                        
                        <button class="btn-primary" onclick="${phaseData.onContinue}" style="width: 100%; font-size: 15px; padding: 12px;">
                            ${phaseData.buttonText} →
                        </button>
                        
                    </div>
                </div>
                
            </div>
        `;
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
        
        // Check if this is first time starting
        if (!this.state.startTime) {
            // DON'T set startTime yet - wait for animation to finish
            // The animation will call actuallyStartTimer() when ready
            this.animateStatsIntro();
        } else {
            // If resuming (startTime already exists), start counting immediately
            this.actuallyStartTimer();
        }
    },
    
    // Actually start the timer interval
    actuallyStartTimer() {
        // Clear any existing timer first
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Set start time NOW (at the moment timer actually begins)
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
    
    // Timer pause/resume on tab visibility change
    setupVisibilityListener() {
        let isFirstVisibilityChange = true;
        
        document.addEventListener('visibilitychange', () => {
            // Skip the first visibility change on page load to prevent pausing on refresh
            if (isFirstVisibilityChange) {
                isFirstVisibilityChange = false;
                return;
            }
            
            if (document.hidden) {
                // Tab is hidden - pause timer
                this.pauseTimer();
            } else {
                // Tab is visible - resume timer
                this.resumeTimer();
            }
        });
    },
    
    pauseTimer() {
        // Don't pause if game is complete (phase 7 = finale)
        if (this.state.currentPhase >= 7) {
            console.log('⏸️ Timer not paused - game is complete');
            return;
        }
        
        if (this.timerInterval && this.state.startTime) {
            // Save elapsed time before pausing
            const now = Date.now();
            const elapsed = now - this.state.startTime;
            this.state.elapsedTimeBeforePause = (this.state.elapsedTimeBeforePause || 0) + elapsed;
            
            // Stop the interval
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            
            // Clear startTime so we know we're paused
            this.state.startTime = null;
            this.saveState();
            
            console.log('⏸️ Timer paused - total elapsed:', Math.floor(this.state.elapsedTimeBeforePause / 1000), 'seconds');
        }
    },
    
    resumeTimer() {
        // Only resume if we have a game in progress (phase > 0 and < 7) and timer isn't already running
        // Don't resume if game is complete (phase 7 = finale)
        if (!this.timerInterval && this.state.currentPhase > 0 && this.state.currentPhase < 7) {
            // Resume timer from where we left off
            this.state.startTime = Date.now();
            this.saveState();
            
            // Start interval again
            this.timerInterval = setInterval(() => {
                this.updateTimerDisplay();
            }, 1000);
            
            console.log('▶️ Timer resumed');
        } else if (this.state.currentPhase >= 7) {
            console.log('▶️ Timer not resumed - game is complete');
        }
    },
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('gameTimer');
        if (timerElement) {
            // If game is completed, show frozen time
            if (this.state.gameCompleted && this.state.finalTime) {
                timerElement.textContent = this.state.finalTime;
                return;
            }
            
            let totalElapsed = 0;
            
            if (this.state.startTime) {
                // Currently running - add current session to previous pauses
                const currentSessionElapsed = Date.now() - this.state.startTime;
                totalElapsed = (this.state.elapsedTimeBeforePause || 0) + currentSessionElapsed;
            } else if (this.state.elapsedTimeBeforePause) {
                // Paused - show only accumulated time
                totalElapsed = this.state.elapsedTimeBeforePause;
            }
            
            const elapsedSeconds = Math.floor(totalElapsed / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = timeString;
        }
    },
    
    getElapsedTime() {
        // If game is completed, return frozen time
        if (this.state.gameCompleted && this.state.finalTime) {
            return this.state.finalTime;
        }
        
        if (!this.state.startTime && !this.state.elapsedTimeBeforePause) return '00:00';
        
        let totalElapsed = 0;
        if (this.state.startTime) {
            const currentSessionElapsed = Date.now() - this.state.startTime;
            totalElapsed = (this.state.elapsedTimeBeforePause || 0) + currentSessionElapsed;
        } else if (this.state.elapsedTimeBeforePause) {
            totalElapsed = this.state.elapsedTimeBeforePause;
        }
        
        const elapsedSeconds = Math.floor(totalElapsed / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // Stop timer and freeze final values
    freezeGameComplete() {
        console.log('🏁 Freezing game completion state...');
        
        // Stop the timer interval
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Calculate final values
        let totalElapsed = 0;
        if (this.state.startTime) {
            const currentSessionElapsed = Date.now() - this.state.startTime;
            totalElapsed = (this.state.elapsedTimeBeforePause || 0) + currentSessionElapsed;
        } else if (this.state.elapsedTimeBeforePause) {
            totalElapsed = this.state.elapsedTimeBeforePause;
        }
        
        const elapsedSeconds = Math.floor(totalElapsed / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Calculate final rating
        const rating = this.calculateRating(this.state.score, elapsedSeconds);
        
        // Freeze the values
        this.state.finalScore = this.state.score;
        this.state.finalTime = timeFormatted;
        this.state.finalRating = rating;
        this.state.gameCompleted = true;
        
        // Clear timing values to stop any further calculations
        this.state.startTime = null;
        
        this.saveState();
        
        console.log('✅ Game frozen - Score:', this.state.finalScore, 'Time:', this.state.finalTime, 'Rating:', Math.round(this.state.finalRating));
    },
    
    // Animate stats intro on first game start
    animateStatsIntro() {
        // Get the model name for the welcome message
        const modelName = this.state.modelName || 'AI Model';
        
        // First show the identity creation message
        this.showIdentityMessage(modelName, () => {
            // After identity message, show the stats
            this.showStatsAnimation();
        });
    },
    
    // Show identity creation message
    showIdentityMessage(modelName, callback) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.95), rgba(191, 0, 255, 0.95));
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            text-align: center;
            opacity: 0;
            animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        `;
        messageDiv.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">
                ${this.state.avatar && window.phase0 && window.phase0.avatars ? 
                    window.phase0.avatars.find(a => a.id === this.state.avatar)?.icon || '🤖' : '🤖'}
            </div>
            <div style="font-size: 28px; font-weight: 700; color: white; margin-bottom: 16px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);">
                Identity Created!
            </div>
            <div style="font-size: 22px; color: rgba(255, 255, 255, 0.95); font-weight: 500;">
                Welcome, <span style="color: #fff; font-weight: 700;">${modelName}</span>!
            </div>
            <div style="font-size: 18px; color: rgba(255, 255, 255, 0.85); margin-top: 16px;">
                ✨ Start your AI journey! ✨
            </div>
        `;
        
        overlay.appendChild(messageDiv);
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes popIn {
                0% { transform: scale(0.5); opacity: 0; }
                70% { transform: scale(1.1); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes popOut {
                to { transform: scale(0.8); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // After 2 seconds, fade out and show stats
        setTimeout(() => {
            messageDiv.style.animation = 'popOut 0.4s ease-out forwards';
            overlay.style.transition = 'opacity 0.4s ease-out';
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                overlay.remove();
                style.remove();
                callback(); // Show stats animation
            }, 400);
        }, 2000);
    },
    
    // Show stats animation
    showStatsAnimation() {
        console.log('🎬 [0.0s] Stats animation started');
        
        // Create overlay with stats in center
        const overlay = document.createElement('div');
        overlay.id = 'statsIntroOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Create centered stats display
        const statsDisplay = document.createElement('div');
        statsDisplay.style.cssText = `
            display: flex;
            gap: 80px;
            align-items: center;
        `;
        
        // Create each stat element (Score and Time only - no Tokens in header)
        const stats = [
            { label: 'Score', value: '0', icon: '🎯' },
            { label: 'Time', value: '00:00', icon: '⏱️' }
        ];
        
        stats.forEach((stat, index) => {
            const statEl = document.createElement('div');
            statEl.className = 'intro-stat';
            statEl.setAttribute('data-stat-type', stat.label.toLowerCase());
            statEl.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
                opacity: 0;
                transform: scale(0.5) translateY(-30px);
                animation: statIntroCenter 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                animation-delay: ${0.2 + index * 0.5}s;
            `;
            
            statEl.innerHTML = `
                <div style="font-size: 56px;">${stat.icon}</div>
                <div style="font-size: 16px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                    ${stat.label}
                </div>
                <div style="font-size: 48px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: var(--primary);">
                    ${stat.value}
                </div>
            `;
            
            statsDisplay.appendChild(statEl);
        });
        
        overlay.appendChild(statsDisplay);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes statIntroCenter {
                0% {
                    opacity: 0;
                    transform: scale(0.5) translateY(-30px);
                }
                60% {
                    transform: scale(1.15) translateY(0);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes glowPulse {
                0%, 100% {
                    filter: drop-shadow(0 0 10px rgba(0, 212, 255, 0.3));
                }
                50% {
                    filter: drop-shadow(0 0 40px rgba(0, 212, 255, 0.9)) 
                            drop-shadow(0 0 60px rgba(168, 85, 247, 0.7))
                            drop-shadow(0 0 80px rgba(191, 0, 255, 0.5));
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(overlay);
        console.log('📺 [0.0s] Overlay and stats added to DOM');
        
        // Play counter start sound
        SoundManager.play('counterStart');
        
        // NO GLOW EFFECT IN CENTER - removed to prevent animation conflicts
        
        // After 2 seconds, fade out and show header stats (NO FLYING!)
        setTimeout(() => {
            console.log('🌑 [2.0s] Starting overlay fade out');
            // Fade out overlay
            overlay.style.transition = 'opacity 0.5s ease-out';
            overlay.style.opacity = '0';
            
            // Remove overlay after fade
            setTimeout(() => {
                console.log('🗑️ [2.5s] Removing overlay from DOM');
                overlay.remove();
                style.remove();
                
                // Show header stats with glow animation
                console.log('🎯 [2.5s] Showing header stats');
                this.showHeaderStatsWithGlow();
            }, 500);
        }, 2000);
        
        console.log('✨ Stats intro animation triggered');
    },
    
    // Show header stats with glow effect (no flying/shrinking)
    showHeaderStatsWithGlow() {
        console.log('🔆 Header stats glow function called');
        
        // Make stats container visible
        const statsContainer = document.getElementById('statsContainer');
        if (statsContainer) {
            statsContainer.style.opacity = '1';
            statsContainer.style.pointerEvents = 'auto';
        }
        
        // DON'T show buttons here - they'll be shown after phase advances to 1
        
        const headerStatsElements = document.querySelectorAll('.stat');
        console.log(`📊 Found ${headerStatsElements.length} header stat elements`);
        
        headerStatsElements.forEach((stat, index) => {
            // Only animate score and time (skip tokens)
            const statType = stat.getAttribute('data-stat');
            console.log(`   - Stat ${index}: type="${statType}"`);
            if (statType === 'tokens') return;
            
            // Start with stats hidden
            stat.style.opacity = '0';
            stat.style.transform = 'scale(0.8)';
            stat.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            
            // Force browser to process the initial state
            stat.offsetHeight;
            
            // IMMEDIATELY make visible (no setTimeout!)
            console.log(`💫 [IMMEDIATE] Animating ${statType} stat in header`);
            stat.style.opacity = '1';
            stat.style.transform = 'scale(1)';
            
            // Add glow effect after animation
            setTimeout(() => {
                stat.classList.add('pulse-intro');
                setTimeout(() => {
                    stat.classList.remove('pulse-intro');
                    stat.style.transition = '';
                }, 2500);
            }, 500);
        });
        
        // Play success sound
        SoundManager.play('success');
        console.log('🔊 Success sound played');
        
        // NOW move to Phase 1 IN BACKGROUND (preload it) and start timer
        setTimeout(() => {
            console.log('➡️ Moving to Phase 1 in background');
            // Advance phase first
            Game.state.currentPhase++;
            Game.saveState();
            
            // NOW show the buttons (after phase is advanced)
            Game.updateButtonVisibility();
            
            // Preload phase 1 in background (without animation)
            const container = document.getElementById('phaseContainer');
            if (container && window.phase1 && typeof window.phase1.render === 'function') {
                // Set opacity to 0 first
                container.style.opacity = '0';
                container.style.transition = 'none';
                
                // Render phase 1
                window.phase1.render(container);
                
                // After rendering, fade in
                setTimeout(() => {
                    container.style.transition = 'opacity 0.5s ease';
                    container.style.opacity = '1';
                }, 50);
            }
            
            // Start timer after phase is loaded
            setTimeout(() => {
                console.log('⏱️ [0.2s] Starting game timer');
                Game.actuallyStartTimer();
            }, 200);
        }, 500);
    },
    
    // Scoreboard System
    saveToScoreboard() {
        const records = this.getScoreboardRecords();
        
        // Use frozen values if game is completed, otherwise calculate
        let score, timeFormatted, rating, elapsedSeconds;
        
        if (this.state.gameCompleted) {
            // Use frozen values
            score = this.state.finalScore;
            timeFormatted = this.state.finalTime;
            rating = this.state.finalRating;
            
            // Parse time back to seconds for storage
            const timeParts = timeFormatted.split(':');
            elapsedSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
        } else {
            // Calculate dynamically
            let totalElapsed = 0;
            if (this.state.startTime) {
                const currentSessionElapsed = Date.now() - this.state.startTime;
                totalElapsed = (this.state.elapsedTimeBeforePause || 0) + currentSessionElapsed;
            } else if (this.state.elapsedTimeBeforePause) {
                totalElapsed = this.state.elapsedTimeBeforePause;
            }
            
            elapsedSeconds = Math.floor(totalElapsed / 1000);
            score = this.state.score;
            timeFormatted = this.getElapsedTime();
            rating = this.calculateRating(score, elapsedSeconds, this.state.tokensProcessed);
        }
        
        const record = {
            id: Date.now(),
            modelName: this.state.modelName || this.getCreativeDefaultName(),
            avatar: this.state.avatar,
            score: score,
            time: elapsedSeconds,
            timeFormatted: timeFormatted,
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
        // NEW PERMISSIVE FORMULA: Base score with time multiplier
        // Start with raw score, then apply time bonus/penalty
        
        const targetTime = 180; // 3 minutes (180 seconds) = 1.0x multiplier
        const fastTime = 90;    // 1.5 minutes (90 seconds) = 2.0x multiplier (very fast!)
        const slowTime = 600;   // 10 minutes (600 seconds) = 0.8x multiplier
        
        // Calculate time multiplier based on completion speed
        let timeMultiplier;
        
        if (timeSeconds <= fastTime) {
            // Super fast: 2.0x multiplier
            timeMultiplier = 2.0;
        } else if (timeSeconds <= targetTime) {
            // Fast to target: Linear scale from 2.0x to 1.0x
            // (fastTime to targetTime) → (2.0 to 1.0)
            timeMultiplier = 2.0 - ((timeSeconds - fastTime) / (targetTime - fastTime));
        } else if (timeSeconds <= slowTime) {
            // Slow: Linear scale from 1.0x to 0.8x
            // (targetTime to slowTime) → (1.0 to 0.8)
            timeMultiplier = 1.0 - (0.2 * (timeSeconds - targetTime) / (slowTime - targetTime));
        } else {
            // Very slow: 0.8x multiplier (still generous!)
            timeMultiplier = 0.8;
        }
        
        // Token Bonus (small addition, not multiplier)
        const tokenBonus = tokens * 0.1; // Each token adds 0.1 points
        
        // Final Rating: Base score × time multiplier + token bonus
        const rating = (score * timeMultiplier) + tokenBonus;
        
        return Math.round(rating * 10) / 10; // Round to 1 decimal
    },
    
    getRatingGrade(rating) {
        // Updated grades for new permissive formula
        if (rating >= 3000) return {grade: 'S', color: '#fbbf24', label: 'Legendary'};
        if (rating >= 2000) return {grade: 'A+', color: '#22c55e', label: 'Excellent'};
        if (rating >= 1200) return {grade: 'A', color: '#3b82f6', label: 'Great'};
        if (rating >= 800) return {grade: 'B', color: '#8b5cf6', label: 'Good'};
        if (rating >= 400) return {grade: 'C', color: '#ec4899', label: 'Fair'};
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
    
    showSettings() {
        const modal = document.getElementById('settingsModal');
        
        // Get current volume state
        const currentVolume = SoundManager.getVolume ? SoundManager.getVolume() : 0.5;
        const isMuted = SoundManager.muted;
        
        // Get particles state
        const particlesEnabled = localStorage.getItem('particlesEnabled') !== 'false';
        
        // Update slider and display
        const slider = document.getElementById('settingsVolumeSlider');
        const percentDisplay = document.getElementById('settingsVolumePercent');
        const muteBtn = document.getElementById('settingsMuteBtn');
        const muteIcon = document.getElementById('settingsMuteIcon');
        const particlesToggle = document.getElementById('particlesToggle');
        
        if (slider) {
            slider.value = isMuted ? 0 : currentVolume * 100;
            slider.style.background = `linear-gradient(90deg, 
                rgba(168, 85, 247, 0.3) 0%, 
                rgba(168, 85, 247, 0.6) ${isMuted ? 0 : currentVolume * 100}%, 
                rgba(255, 255, 255, 0.1) ${isMuted ? 0 : currentVolume * 100}%)`;
        }
        
        if (percentDisplay) {
            percentDisplay.textContent = isMuted ? '0%' : Math.round(currentVolume * 100) + '%';
        }
        
        if (muteBtn && muteIcon) {
            if (isMuted) {
                muteBtn.style.background = 'rgba(239, 68, 68, 0.15)';
                muteBtn.style.borderColor = 'var(--error)';
                muteBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                muteIcon.textContent = '🔇';
            } else {
                muteBtn.style.background = 'rgba(168, 85, 247, 0.15)';
                muteBtn.style.borderColor = 'var(--secondary)';
                muteBtn.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.2)';
                muteIcon.textContent = '🔊';
            }
        }
        
        if (particlesToggle) {
            particlesToggle.checked = particlesEnabled;
        }
        
        modal.classList.add('active');
        SoundManager.play('click');
    },
    
    updateVolume(value) {
        const volume = value / 100;
        
        // Update SoundManager volume
        if (SoundManager.setVolume) {
            SoundManager.setVolume(volume);
        }
        
        const muteBtn = document.getElementById('settingsMuteBtn');
        const muteIcon = document.getElementById('settingsMuteIcon');
        
        // If volume is 0, show mute icon and style
        if (volume === 0) {
            if (muteIcon) muteIcon.textContent = '🔇';
            if (muteBtn) {
                muteBtn.style.background = 'rgba(239, 68, 68, 0.15)';
                muteBtn.style.borderColor = 'var(--error)';
                muteBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
            }
        }
        // If volume > 0 and was muted, unmute
        else if (volume > 0) {
            if (SoundManager.muted) {
                SoundManager.muted = false;
                localStorage.setItem('soundMuted', 'false');
            }
            
            // Update mute button to unmuted state
            if (muteBtn && muteIcon) {
                muteBtn.style.background = 'rgba(168, 85, 247, 0.15)';
                muteBtn.style.borderColor = 'var(--secondary)';
                muteBtn.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.2)';
                muteIcon.textContent = '🔊';
            }
        }
        
        // Update slider background gradient
        const slider = document.getElementById('settingsVolumeSlider');
        if (slider) {
            slider.style.background = `linear-gradient(90deg, 
                rgba(168, 85, 247, 0.3) 0%, 
                rgba(168, 85, 247, 0.6) ${value}%, 
                rgba(255, 255, 255, 0.1) ${value}%)`;
        }
        
        // Update percentage display
        const percentDisplay = document.getElementById('settingsVolumePercent');
        if (percentDisplay) {
            percentDisplay.textContent = Math.round(value) + '%';
        }
        
        // Play a sound to preview volume
        if (!SoundManager.muted && volume > 0) {
            SoundManager.play('click');
        }
    },
    
    toggleMute() {
        const wasMuted = SoundManager.muted;
        SoundManager.toggle();
        
        const muteBtn = document.getElementById('settingsMuteBtn');
        const muteIcon = document.getElementById('settingsMuteIcon');
        const slider = document.getElementById('settingsVolumeSlider');
        const percentDisplay = document.getElementById('settingsVolumePercent');
        
        if (SoundManager.muted) {
            // Muted
            if (muteIcon) muteIcon.textContent = '🔇';
            if (muteBtn) {
                muteBtn.style.background = 'rgba(239, 68, 68, 0.15)';
                muteBtn.style.borderColor = 'var(--error)';
                muteBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
            }
            if (slider) {
                slider.value = 0;
                slider.style.background = `linear-gradient(90deg, 
                    rgba(168, 85, 247, 0.3) 0%, 
                    rgba(168, 85, 247, 0.6) 0%, 
                    rgba(255, 255, 255, 0.1) 0%)`;
            }
            if (percentDisplay) percentDisplay.textContent = '0%';
            
            // Animate mute button
            if (typeof gsap !== 'undefined' && muteBtn) {
                gsap.fromTo(muteBtn, 
                    { scale: 1, rotate: 0 },
                    { scale: 1.15, rotate: -10, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
                );
            }
        } else {
            // Unmuted - restore previous volume
            const currentVolume = SoundManager.getVolume ? SoundManager.getVolume() : 0.5;
            if (muteIcon) muteIcon.textContent = '🔊';
            if (muteBtn) {
                muteBtn.style.background = 'rgba(168, 85, 247, 0.15)';
                muteBtn.style.borderColor = 'var(--secondary)';
                muteBtn.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.2)';
            }
            if (slider) {
                slider.value = currentVolume * 100;
                slider.style.background = `linear-gradient(90deg, 
                    rgba(168, 85, 247, 0.3) 0%, 
                    rgba(168, 85, 247, 0.6) ${currentVolume * 100}%, 
                    rgba(255, 255, 255, 0.1) ${currentVolume * 100}%)`;
            }
            if (percentDisplay) percentDisplay.textContent = Math.round(currentVolume * 100) + '%';
            
            // Animate unmute button and play sound
            if (typeof gsap !== 'undefined' && muteBtn) {
                gsap.fromTo(muteBtn, 
                    { scale: 1, rotate: 0 },
                    { scale: 1.15, rotate: 10, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
                );
            }
            
            // Play sound to confirm unmute
            SoundManager.play('success');
        }
    },
    
    toggleParticles() {
        const particleSystem = window.ParticleSystem?.instance;
        if (!particleSystem) {
            console.warn('Particle system not available');
            return;
        }
        
        const isEnabled = particleSystem.toggle();
        
        // Save preference to localStorage
        localStorage.setItem('particlesEnabled', isEnabled.toString());
        
        // Play feedback sound
        SoundManager.play('click');
        
        // Animate toggle with GSAP
        const toggle = document.getElementById('particlesToggle');
        if (toggle && typeof gsap !== 'undefined') {
            gsap.fromTo(toggle.parentElement, 
                { scale: 1 },
                { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
            );
        }
    },
};

