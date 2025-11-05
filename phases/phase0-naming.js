// Phase 0: Character Creation - Choose Your Model Name
window.phase0 = {
    prefixes: ['Neural', 'AgentForce', 'SF', 'Magneto', 'Xmen', 'Optimus', 'Quantum', 'Cogni', 'Think', 'Brain', 'Neuro', 'Synapse', 'Deep', 'Smart', 'Intel'],
    suffixes: ['Bot', 'Mind', 'AI', 'GPT', 'Net', 'Tron', 'Core', 'Forge', 'Max', 'Prime'],
    versions: ['1.0', '2.5', '3.0', '4.5', 'X', 'Ultra', 'Pro', 'Plus'],
    
    render(container) {
        container.innerHTML = `
            <div class="phase">
                <!-- Left Sidebar -->
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Welcome to Feel Like an LLM</h2>
                        <p class="phase-subtitle">Choose your AI identity</p>
                    </div>
                    
                    <div class="phase-description">
                        You're about to experience the journey of becoming an AI model. From processing raw text to generating intelligent responses, you'll live through every step.
                    </div>
                    
                    <div class="hint-section">
                        <h4>Quick Start</h4>
                        <p>Generate a random name or create your own. Your name represents you throughout the game!</p>
                    </div>
                    
                    <div style="padding: 12px; background: rgba(0, 245, 255, 0.05); border: 1px solid rgba(0, 245, 255, 0.15); border-radius: 8px;">
                        <p style="font-size: 11px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            Real AI models like GPT, Claude, and BERT all have unique identities. Choose yours wisely!
                        </p>
                    </div>
                </div>
                
                <!-- Right Content Area -->
                <div class="phase-content">
                    <div style="text-align: center; max-width: 500px;">
                        <div style="margin-bottom: 40px;">
                            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">Your AI Name</p>
                            <div id="nameDisplay" style="font-size: 42px; font-weight: 700; color: var(--primary); min-height: 60px; display: flex; align-items: center; justify-content: center;">
                                ???
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 24px;">
                            <button class="btn-secondary" onclick="phase0.generateRandomName()">
                                Generate Random
                            </button>
                            <button class="btn-secondary" onclick="phase0.showCustomInput()">
                                Enter Custom
                            </button>
                        </div>
                        
                        <div id="customNameInput" style="display: none; margin-bottom: 24px;">
                            <input 
                                type="text" 
                                id="customName" 
                                placeholder="Enter your name..."
                                maxlength="30"
                                style="padding: 12px 16px; font-size: 16px; width: 100%; max-width: 350px;
                                       background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15);
                                       border-radius: 8px; color: white; text-align: center; outline: none;"
                            />
                        </div>
                        
                        <button 
                            class="btn-primary" 
                            id="confirmNameBtn"
                            onclick="phase0.confirmName()"
                            disabled
                            style="opacity: 0.4; cursor: not-allowed; padding: 14px 48px; font-size: 15px;"
                        >
                            Start Journey
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Setup custom input listener
        setTimeout(() => {
            const customInput = document.getElementById('customName');
            if (customInput) {
                customInput.addEventListener('input', () => {
                    const name = customInput.value.trim();
                    if (name.length >= 3) {
                        document.getElementById('nameDisplay').textContent = name;
                        this.enableConfirmButton();
                    }
                });
                
                customInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && customInput.value.trim().length >= 3) {
                        this.confirmName();
                    }
                });
                
                // Add focus styles
                customInput.addEventListener('focus', () => {
                    customInput.style.borderColor = 'var(--primary)';
                });
                customInput.addEventListener('blur', () => {
                    customInput.style.borderColor = 'rgba(255,255,255,0.15)';
                });
            }
        }, 100);
    },
    
    generateRandomName() {
        const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
        const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        const version = this.versions[Math.floor(Math.random() * this.versions.length)];
        
        const name = `${prefix}${suffix}-${version}`;
        
        // Animate name change
        const nameDisplay = document.getElementById('nameDisplay');
        gsap.to(nameDisplay, {
            scale: 1.2,
            duration: 0.2,
            onComplete: () => {
                nameDisplay.textContent = name;
                gsap.to(nameDisplay, {
                    scale: 1,
                    duration: 0.2
                });
            }
        });
        
        this.enableConfirmButton();
        SoundManager.play('click');
    },
    
    showCustomInput() {
        const inputDiv = document.getElementById('customNameInput');
        inputDiv.style.display = 'block';
        
        gsap.from(inputDiv, {
            opacity: 0,
            y: -20,
            duration: 0.3
        });
        
        setTimeout(() => {
            document.getElementById('customName').focus();
        }, 300);
        
        SoundManager.play('click');
    },
    
    enableConfirmButton() {
        const btn = document.getElementById('confirmNameBtn');
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        
        gsap.from(btn, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out'
        });
    },
    
    confirmName() {
        const nameDisplay = document.getElementById('nameDisplay');
        const name = nameDisplay.textContent;
        
        if (name && name !== '???') {
            // Only set name and complete phase, scoring handled by completePhase
            Game.setModelName(name);
            Game.completePhase(100, `Welcome, ${name}! Your journey begins now.`);
            SoundManager.play('success');
        }
    }
};

