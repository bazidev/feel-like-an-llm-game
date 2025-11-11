// Phase 0: Overview + Name + Avatar Selection
// Complete introduction to the game with character creation

window.phase0 = {
    currentStep: 'intro', // 'intro' -> 'data' -> 'name' -> 'avatar'
    selectedName: null,
    selectedAvatar: null,
    selectedDataset: null,
    
    // Dataset options - EXPANDED for better generation paths
    datasets: {
        animals: {
            name: "🐾 Animals",
            text: "A cat sat on the mat near the window. The dog played with the ball in the garden. The bird sang from the tree branch. The cat likes fish and milk treats. The dog likes bones and toys. The bird likes seeds and water bowls. The cat watched the bird carefully. The dog chased after the ball eagerly. The bird chirped at dawn beautifully. The cat sleeps on the mat. They're running. Aren't they?",
            description: "Learn about pets and their behaviors",
            color: "#22c55e"
        },
        space: {
            name: "🚀 Space",
            text: "The rocket launched into orbit successfully. The astronaut floated in space gracefully. The stars shine very brightly at night. The moon orbits around Earth constantly. The satellite orbits the planet continuously. The rocket carried equipment into space today. The astronaut wore a special protective suit. The stars form beautiful patterns in the sky. The satellite monitors weather patterns from orbit. The moon reflects sunlight beautifully. It's amazing. Won't you agree?",
            description: "Explore the cosmos and universe",
            color: "#3b82f6"
        },
        food: {
            name: "🍕 Food",
            text: "The chef cooked fresh pasta in the kitchen today. The pizza came from the oven hot. The restaurant serves delicious meals to customers. The chef loves cooking Italian cuisine for people. The pasta tastes very delicious with tomato sauce. The pizza has cheese and fresh ingredients on top. The meal includes special recipes from Italy. I'm eating. Isn't it delicious?",
            description: "Culinary adventures and cooking",
            color: "#f59e0b"
        },
        tech: {
            name: "💻 Technology",
            text: "The programmer wrote clean code for the project today. The computer processed the data quickly with software. The developer builds useful applications for modern users. The programmer loves working on new features daily. The computer runs programs very efficiently now. The developer wrote solutions in the code editor. The programmer processed user feedback carefully about features. The computer builds calculations at high speed. We're coding. Can't we rest?",
            description: "Coding and innovation world",
            color: "#8b5cf6"
        },
        sports: {
            name: "⚽ Sports",
            text: "The player kicked the ball with great skill. The team scored a goal in the final minute. The coach trains the team for victory regularly. The player loves football games very much. The team celebrates their victory together loudly. The coach kicked strategies into action daily. The player trains for matches with dedication. The team scored three goals against rivals today. The coach celebrates winning at championships proudly. They've won. Didn't they celebrate?",
            description: "Athletics and competition",
            color: "#ef4444"
        }
    },
    
    // Avatar options
    avatars: [
        { id: 'robot', icon: '🤖', name: 'Classic bot' },
        { id: 'brain', icon: '🧠', name: 'Neural mind' },
        { id: 'chip', icon: '💠', name: 'Quantum chip' },
        { id: 'alien', icon: '👽', name: 'Alien tech' },
        { id: 'wizard', icon: '🧙', name: 'Code wizard' },
        { id: 'ninja', icon: '🥷', name: 'Data ninja' },
        { id: 'ghost', icon: '👻', name: 'Ghost in shell' },
        { id: 'unicorn', icon: '🦄', name: 'Magic unicorn' },
        { id: 'dragon', icon: '🐉', name: 'Dragon model' },
        { id: 'octopus', icon: '🐙', name: 'Octo-mind' },
        { id: 'rocket', icon: '🚀', name: 'Rocket AI' },
        { id: 'lightning', icon: '⚡', name: 'Fast bolt' }
    ],
    
    // Name generation with versions
    prefixes: ['Neural', 'Agent', 'Quantum', 'Cogni', 'Think', 'Brain', 'Synapse', 'Deep', 'Smart', 'Intel', 'Neuro', 'Cyber', 'Digi', 'Meta', 'Ultra', 'Apex', 'Nexus', 'Prime', 'Vertex', 'Omni'],
    suffixes: ['GPT', 'LM', 'Mind', 'AI', 'Net', 'Tron', 'Core', 'Forge', 'Max', 'Bot', 'QM', 'XM', 'VM'],
    versions: ['o1', 'o3', 'x1', 'x7', 'v2', 'v5', 'pro', 'ultra', '4o', '3.5', 'turbo', 'mini', 'max'],
    
    // Generate cryptographically unique username for API scoring
    generateUniqueUsername() {
        // Use crypto.randomUUID() if available (modern browsers)
        if (crypto && crypto.randomUUID) {
            // Convert UUID to custom format: xxx-xxxxxx-xxxx-xxx
            const uuid = crypto.randomUUID().replace(/-/g, '');
            return `${uuid.substring(0, 3)}-${uuid.substring(3, 9)}-${uuid.substring(9, 13)}-${uuid.substring(13, 16)}`;
        }
        
        // Fallback: generate high-entropy random string with timestamp
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const timestamp = Date.now().toString(36);
        const random1 = Array(3).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
        const random2 = Array(6).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
        const random3 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
        const random4 = Array(3).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
        
        return `${random1}-${random2}-${timestamp.substring(0, 4)}-${random3}${random4}`;
    },
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'data') {
            this.renderDataSelection(container);
        } else if (this.currentStep === 'name') {
            this.renderNameSelection(container);
        } else if (this.currentStep === 'avatar') {
            this.renderAvatarSelection(container);
        }
    },
    
    renderIntro(container) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                
                <div style="width: 100%; max-width: 1100px;">
                    
                    <!-- Title -->
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="font-size: 36px; margin-bottom: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            Feel like an LLM
                        </h1>
                        <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.6;">
                            Experience how AI learns patterns, builds connections, and generates text.<br>
                            You'll go through a simplified journey to see how real AI models are built!
                        </p>
                    </div>

                    <!-- Journey Steps - ALL 6 VISIBLE -->
                    <div style="margin-bottom: 20px;">
                        <h3 style="text-align: center; font-size: 17px; margin-bottom: 16px; color: var(--primary);">
                            🗺️ Your AI journey
                        </h3>
                        
                        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; max-width: 1000px; margin: 0 auto;">
                            
                            <div class="journey-step">
                                <div class="step-number">1</div>
                                <div class="step-icon">✂️</div>
                                <div class="step-title">Tokenization</div>
                                <div class="step-desc">Split text</div>
                            </div>
                            
                            <div class="journey-step">
                                <div class="step-number">2</div>
                                <div class="step-icon">📊</div>
                                <div class="step-title">Embeddings</div>
                                <div class="step-desc">To numbers</div>
                            </div>
                            
                            <div class="journey-step">
                                <div class="step-number">3</div>
                                <div class="step-icon">🎯</div>
                                <div class="step-title">Attention</div>
                                <div class="step-desc">Context</div>
                            </div>
                            
                            <div class="journey-step">
                                <div class="step-number">4</div>
                                <div class="step-icon">🏋️</div>
                                <div class="step-title">Training</div>
                                <div class="step-desc">Build model</div>
                            </div>
                            
                            <div class="journey-step">
                                <div class="step-number">5</div>
                                <div class="step-icon">✨</div>
                                <div class="step-title">Generation</div>
                                <div class="step-desc">Make text!</div>
                            </div>
                            
                            <div class="journey-step">
                                <div class="step-number">6</div>
                                <div class="step-icon">🎛️</div>
                                <div class="step-title">Sampling</div>
                                <div class="step-desc">Control output</div>
                            </div>
                            
                        </div>
                    </div>

                    <!-- Key Points -->
                    <div style="margin-bottom: 24px; padding: 16px 20px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(191, 0, 255, 0.05)); 
                               border-radius: 12px; border: 1px solid rgba(0, 212, 255, 0.2);">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 20px;">💡</span>
                            <h4 style="color: var(--primary); margin: 0; font-size: 14px; font-weight: 700;">What makes this special</h4>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                            <div style="padding: 10px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; text-align: center;">
                                <div style="font-size: 12px; color: var(--text-secondary);">Same concepts as GPT models</div>
                            </div>
                            <div style="padding: 10px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; text-align: center;">
                                <div style="font-size: 12px; color: var(--text-secondary);">Visual Learning</div>
                            </div>
                            <div style="padding: 10px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; text-align: center;">
                                <div style="font-size: 12px; color: var(--text-secondary);">Become AI-Literate</div>
                            </div>
                        </div>
                    </div>

                    <!-- Start Button -->
                    <div style="text-align: center;">
                        <button class="btn-primary" onclick="phase0.proceedToData()" 
                                style="font-size: 18px; padding: 15px 44px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       box-shadow: 0 8px 30px var(--glow);">
                            🚀 Begin your journey
                        </button>
                    </div>

                </div>
                
            </div>
        `;
        
        this.addJourneyStepStyles();
    },
    
    proceedToData() {
        SoundManager.play('click');
        this.currentStep = 'data';
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderDataSelection(container) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px;">
                
                <div style="text-align: center; width: 100%; max-width: 1200px;">
                    
                    <h1 style="font-size: 34px; margin-bottom: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        Choose your training data
                    </h1>
                    <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 32px;">
                        Pick a topic - all phases will use this data
                    </p>
                    
                    <!-- Horizontal layout -->
                    <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap;">
                        ${Object.entries(this.datasets).map(([key, dataset]) => `
                            <div class="dataset-option" onclick="phase0.selectDataset('${key}')" data-dataset="${key}"
                                 style="flex: 1; min-width: 200px; max-width: 250px; padding: 20px; background: rgba(255, 255, 255, 0.02); 
                                 border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; 
                                 transition: all 0.3s; text-align: center;">
                                <div style="font-size: 40px; margin-bottom: 10px;">${dataset.name.split(' ')[0]}</div>
                                <div style="font-size: 16px; font-weight: 700; color: white; margin-bottom: 6px;">
                                    ${dataset.name.split(' ').slice(1).join(' ')}
                                </div>
                                <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 10px;">
                                    ${dataset.description}
                                </div>
                                <div style="font-size: 10px; color: ${dataset.color}; padding: 6px; background: rgba(255,255,255,0.03); 
                                           border-radius: 6px; font-family: 'JetBrains Mono', monospace; line-height: 1.4;">
                                    "${dataset.text.substring(0, 35)}..."
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                </div>

            </div>
        `;
        
        this.addDatasetStyles();
    },
    
    selectDataset(datasetKey) {
        this.selectedDataset = datasetKey;
        const dataset = this.datasets[datasetKey];
        
        // Store in game state
        Game.state.selectedDataset = datasetKey;
        Game.state.trainingText = dataset.text;
        Game.saveState();
        
        SoundManager.play('success');
        
        // Visual feedback
        document.querySelectorAll('.dataset-option').forEach(el => {
            el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            el.style.background = 'rgba(255, 255, 255, 0.02)';
        });
        const selected = document.querySelector(`[data-dataset="${datasetKey}"]`);
        if (selected) {
            selected.style.borderColor = dataset.color;
            selected.style.background = `rgba(${this.hexToRgb(dataset.color)}, 0.1)`;
        }
        
        // Proceed to name selection
        setTimeout(() => {
            this.currentStep = 'name';
            this.render(document.getElementById('phaseContainer'));
        }, 800);
    },
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
    },
    
    renderNameSelection(container) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; overflow-y: auto;">
                
                <div style="width: 100%; max-width: 1100px;">
                    
                    <!-- Title -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="font-size: 32px; margin-bottom: 10px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            Feel Like an LLM
                        </h1>
                        <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                            Experience how AI learns patterns, builds connections, and generates text.<br>
                            You'll go through a simplified journey to see how real AI models are built!
                        </p>
                    </div>

                    <!-- Training Text -->
                    <div style="margin-bottom: 20px; padding: 12px 16px; background: rgba(0, 212, 255, 0.08); 
                               border: 2px solid var(--primary); border-radius: 10px; text-align: center;">
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">📖 YOUR TRAINING DATA</div>
                        <div style="font-size: 13px; font-weight: 600; color: white; 
                                   font-family: 'JetBrains Mono', monospace; line-height: 1.5;">
                        "${Game.state.trainingText}"
                    </div>
                </div>

                    <!-- Journey Steps - ALL 6 VISIBLE -->
                    <div style="margin-bottom: 18px;">
                        <h3 style="text-align: center; font-size: 16px; margin-bottom: 14px; color: var(--primary);">
                        🗺️ Your AI Journey
                    </h3>
                        
                        <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; max-width: 950px; margin: 0 auto;">
                            
                        <div class="journey-step">
                            <div class="step-number">1</div>
                            <div class="step-icon">✂️</div>
                            <div class="step-title">Tokenization</div>
                                <div class="step-desc">Split text</div>
                        </div>
                        
                        <div class="journey-step">
                            <div class="step-number">2</div>
                            <div class="step-icon">📊</div>
                            <div class="step-title">Embeddings</div>
                                <div class="step-desc">To numbers</div>
                        </div>
                        
                        <div class="journey-step">
                            <div class="step-number">3</div>
                            <div class="step-icon">🎯</div>
                            <div class="step-title">Attention</div>
                                <div class="step-desc">Context</div>
                        </div>
                        
                        <div class="journey-step">
                            <div class="step-number">4</div>
                            <div class="step-icon">🏋️</div>
                            <div class="step-title">Training</div>
                                <div class="step-desc">Build model</div>
                        </div>
                        
                        <div class="journey-step">
                            <div class="step-number">5</div>
                            <div class="step-icon">✨</div>
                            <div class="step-title">Generation</div>
                                <div class="step-desc">Make text!</div>
                        </div>
                        
                        <div class="journey-step">
                            <div class="step-number">6</div>
                            <div class="step-icon">🎛️</div>
                            <div class="step-title">Sampling</div>
                                <div class="step-desc">Control output</div>
                        </div>
                        
                    </div>
                </div>

                <!-- Key Points -->
                    <div style="margin-bottom: 20px; padding: 14px 18px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(191, 0, 255, 0.05)); 
                               border-radius: 10px; border: 1px solid rgba(0, 212, 255, 0.2);">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 18px;">💡</span>
                            <h4 style="color: var(--primary); margin: 0; font-size: 13px; font-weight: 700;">What Makes This Special</h4>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                            <div style="padding: 8px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; text-align: center;">
                                <div style="font-size: 11px; color: var(--text-secondary);">Connected pipeline</div>
                            </div>
                            <div style="padding: 8px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; text-align: center;">
                                <div style="font-size: 11px; color: var(--text-secondary);">See the math</div>
                            </div>
                            <div style="padding: 8px; background: rgba(255, 255, 255, 0.03); border-radius: 6px; text-align: center;">
                                <div style="font-size: 11px; color: var(--text-secondary);">Generate REAL text</div>
                            </div>
                        </div>
                </div>

                <!-- Start Button -->
                    <div style="text-align: center;">
                        <button class="btn-primary" onclick="phase0.proceedToName()" 
                                style="font-size: 17px; padding: 14px 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       box-shadow: 0 8px 30px var(--glow);">
                            🚀 Begin Your Journey
                        </button>
                    </div>

                </div>
                
            </div>
        `;

        // Add journey step styles
        this.addJourneyStepStyles();

        // Animate entrance
        if (typeof gsap !== 'undefined') {
            gsap.from('.journey-step', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.05,
                ease: 'back.out(1.2)'
            });
        }
    },
    
    renderNameSelection(container) {
        // Generate initial name if none selected
        if (!this.selectedName) {
            this.selectedName = this.generateRandomName();
        }
        
        container.innerHTML = `
            <div class="phase" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
                
                <div style="text-align: center; max-width: 600px;">
                    <h2 style="font-size: 32px; margin-bottom: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        Pick your LLM name
                    </h2>
                    <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 32px;">
                        Every great AI needs an identity
                    </p>
                    
                    <div style="margin-bottom: 32px;">
                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">Your LLM name</p>
                        <div id="nameDisplay" style="font-size: 40px; font-weight: 700; color: var(--primary); min-height: 56px; display: flex; align-items: center; justify-content: center;">
                            ${this.selectedName || '???'}
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 28px; flex-wrap: wrap;">
                        <button class="btn-secondary" onclick="phase0.animateRandomNames()">
                            🎲 Generate random
                        </button>
                        <button class="btn-secondary" onclick="phase0.showCustomInput()">
                            ✏️ Enter Custom
                        </button>
                    </div>
                    
                    <div id="customInputArea" style="display: none; margin-bottom: 32px;">
                        <input type="text" id="customNameInput" placeholder="Enter your AI name..." 
                               style="width: 100%; max-width: 400px; padding: 14px; background: rgba(255,255,255,0.05); 
                               border: 2px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; 
                               font-size: 16px; text-align: center; margin-bottom: 12px;"
                               onkeypress="if(event.key === 'Enter') phase0.setCustomName()">
                        <div>
                            <button class="btn-primary" onclick="phase0.setCustomName()" style="padding: 12px 32px;">
                                Confirm Name
                            </button>
                        </div>
                    </div>
                    
                    <button class="btn-primary" id="nameConfirmBtn" onclick="phase0.proceedToAvatar()" 
                            style="font-size: 18px; padding: 14px 40px;" ${!this.selectedName ? 'disabled' : ''}>
                        Next: Choose Avatar →
                </button>
                </div>

            </div>
        `;

        // Auto-generate if no name
        if (!this.selectedName) {
            setTimeout(() => this.generateRandomName(), 300);
        }
    },
    
    renderAvatarSelection(container) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px;">
                
                <div style="text-align: center; max-width: 600px;">
                    <h2 style="font-size: 28px; margin-bottom: 10px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        Choose your avatar
                    </h2>
                    <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px;">
                        Pick an icon for <strong style="color: var(--primary);">${this.selectedName}</strong>
                    </p>
                    
                    <!-- 3 rows of 4 avatars -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; max-width: 520px; margin-left: auto; margin-right: auto;">
                        ${this.avatars.map(avatar => `
                            <div class="avatar-option ${this.selectedAvatar === avatar.id ? 'selected' : ''}" 
                                 onclick="phase0.selectAvatar('${avatar.id}')" 
                                 data-avatar="${avatar.id}"
                                 style="padding: 14px; background: ${this.selectedAvatar === avatar.id ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)'}; 
                                        border: 2px solid ${this.selectedAvatar === avatar.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}; 
                                        border-radius: 12px; cursor: pointer; transition: all 0.3s; text-align: center;
                                        box-shadow: ${this.selectedAvatar === avatar.id ? '0 0 20px rgba(0, 212, 255, 0.3)' : 'none'};">
                                <div style="font-size: 36px; margin-bottom: 6px;">${avatar.icon}</div>
                                <div style="font-size: 10px; color: ${this.selectedAvatar === avatar.id ? 'var(--primary)' : 'var(--text-secondary)'}; font-weight: ${this.selectedAvatar === avatar.id ? '600' : '400'};">${avatar.name}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button class="btn-primary" id="avatarConfirmBtn" onclick="phase0.confirmIdentity()" 
                            style="font-size: 16px; padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   box-shadow: 0 8px 30px var(--glow);" ${!this.selectedAvatar ? 'disabled' : ''}>
                        🎯 Start training!
                    </button>
                </div>

            </div>
        `;

        this.addAvatarStyles();
        
        // Auto-select random if none selected
        if (!this.selectedAvatar) {
            setTimeout(() => {
                const randomAvatar = this.avatars[Math.floor(Math.random() * this.avatars.length)];
                this.selectAvatar(randomAvatar.id);
            }, 300);
        }
    },
    
    // Actions
    proceedToName() {
        SoundManager.play('click');
        this.currentStep = 'name';
        this.render(document.getElementById('phaseContainer'));
    },
    
    proceedToAvatar() {
        if (!this.selectedName) return;
        SoundManager.play('click');
        this.currentStep = 'avatar';
        this.render(document.getElementById('phaseContainer'));
    },
    
    animateRandomNames() {
        // Animate through 7-10 random names quickly
        const count = 7 + Math.floor(Math.random() * 4); // 7-10 names
        let current = 0;
        
        const animate = () => {
            if (current < count) {
                const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
                const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
                const version = this.versions[Math.floor(Math.random() * this.versions.length)];
                const name = `${prefix}${suffix}-${version}`;
                
                const display = document.getElementById('nameDisplay');
                if (display) {
                    display.textContent = name;
                }
                
                current++;
                setTimeout(animate, current < count - 1 ? 80 : 120);
            } else {
                // Final name
                this.generateRandomName();
            }
        };
        
        SoundManager.play('click');
        animate();
    },
    
    generateRandomName() {
        const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
        const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        const version = this.versions[Math.floor(Math.random() * this.versions.length)];
        
        // Format: PrefixSuffix-version
        this.selectedName = `${prefix}${suffix}-${version}`;
        
        const nameDisplay = document.getElementById('nameDisplay');
        if (nameDisplay) {
            nameDisplay.textContent = this.selectedName;
            
            // Enable confirm button
            const confirmBtn = document.getElementById('nameConfirmBtn');
            if (confirmBtn) confirmBtn.disabled = false;
            
            // Animate
            if (typeof gsap !== 'undefined') {
                gsap.from(nameDisplay, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'back.out(2)'
                });
            }
        }
        
        SoundManager.play('click');
        return this.selectedName;
    },
    
    showCustomInput() {
        const inputArea = document.getElementById('customInputArea');
        if (inputArea) {
            inputArea.style.display = 'block';
            document.getElementById('customNameInput').focus();
        }
        SoundManager.play('click');
    },
    
    setCustomName() {
        const input = document.getElementById('customNameInput');
        if (input && input.value.trim()) {
            this.selectedName = input.value.trim();
            const nameDisplay = document.getElementById('nameDisplay');
            if (nameDisplay) {
                nameDisplay.textContent = this.selectedName;
            }
            
            // Enable confirm button
            const confirmBtn = document.getElementById('nameConfirmBtn');
            if (confirmBtn) confirmBtn.disabled = false;
            
            // Hide input
            document.getElementById('customInputArea').style.display = 'none';
            SoundManager.play('success');
        }
    },
    
    selectAvatar(avatarId) {
        this.selectedAvatar = avatarId;
        
        // Update UI with animation
        document.querySelectorAll('.avatar-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        const selected = document.querySelector(`[data-avatar="${avatarId}"]`);
        if (selected) {
            selected.classList.add('selected');
            
            // Animate selection with bounce effect
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(selected, 
                    { scale: 0.85, rotate: -10 },
                    { 
                        scale: 1.1, 
                        rotate: 0, 
                        duration: 0.5, 
                        ease: 'back.out(2)',
                        onComplete: () => {
                            // Small bounce after selection
                            gsap.to(selected, {
                                scale: 1.1,
                                duration: 0.3,
                                yoyo: true,
                                repeat: 1
                            });
                        }
                    }
                );
            }
        }
        
        // Enable confirm button with animation
        const confirmBtn = document.getElementById('avatarConfirmBtn');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(confirmBtn,
                    { scale: 0.9, opacity: 0.7 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
                );
            }
        }
        
        SoundManager.play('success');
    },
    
    confirmIdentity() {
        if (!this.selectedName || !this.selectedAvatar) return;
        
        // Generate unique username for API scoring (only if not already generated)
        if (!Game.state.uniqueUserId) {
            Game.state.uniqueUserId = this.generateUniqueUsername();
        }
        
        // Save to game state
        Game.state.modelName = this.selectedName;
        Game.state.avatar = this.selectedAvatar;
        
        // Get avatar icon
        const avatarObj = this.avatars.find(a => a.id === this.selectedAvatar);
        const avatarIcon = avatarObj ? avatarObj.icon : '🤖';
        
        // Update header with avatar, name, and unique ID
        document.getElementById('modelAvatar').textContent = avatarIcon;
        document.getElementById('modelName').innerHTML = `${this.selectedName} <span style="font-size: 11px; color: var(--text-secondary); font-weight: 400; opacity: 0.7;">(${Game.state.uniqueUserId})</span>`;
        
        // Complete phase and move to next
        SoundManager.play('levelUp');
        
        // Mark phase 0 as complete (NO POINTS YET - points awarded when Phase 1 is shown)
        Game.state.phaseCompleted[0] = true;
        Game.saveState();
        
        // DON'T move to next phase yet - show identity + stats animation FIRST
        // Phase will advance after animation completes
        Game.startTimer();
    },
    
    addDatasetStyles() {
        if (!document.getElementById('dataset-css')) {
            const style = document.createElement('style');
            style.id = 'dataset-css';
            style.textContent = `
                .dataset-option:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.2);
                }
            `;
            document.head.appendChild(style);
            
            // Add hover sound listeners to datasets
            setTimeout(() => {
                document.querySelectorAll('.dataset-option').forEach(el => {
                    // Click sound is handled in selectDataset() - hover sounds removed per user request
                });
            }, 100);
        }
    },
    
    addJourneyStepStyles() {
        if (!document.getElementById('journey-step-css')) {
            const style = document.createElement('style');
            style.id = 'journey-step-css';
            style.textContent = `
                .journey-step {
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .journey-step:hover {
                    background: rgba(0, 212, 255, 0.08);
                    border-color: var(--primary);
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(0, 212, 255, 0.2);
                }
                
                .step-number {
                    position: absolute;
                    top: -10px;
                    left: 10px;
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 12px;
                    color: white;
                    box-shadow: 0 3px 10px rgba(0, 212, 255, 0.3);
                }
                
                .step-icon {
                    font-size: 28px;
                    margin-bottom: 6px;
                }
                
                .step-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 3px;
                }
                
                .step-desc {
                    font-size: 10px;
                    color: var(--text-secondary);
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    addAvatarStyles() {
        if (!document.getElementById('avatar-css')) {
            const style = document.createElement('style');
            style.id = 'avatar-css';
            style.textContent = `
                .avatar-option {
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                
                .avatar-option::after {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    right: -4px;
                    bottom: -4px;
                    border-radius: 18px;
                    border: 3px solid var(--primary);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }
                
                .avatar-option:hover {
                    background: rgba(0, 212, 255, 0.1);
                    border-color: var(--primary);
                    transform: translateY(-4px) scale(1.05);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.25);
                }
                
                .avatar-option.selected {
                    background: rgba(0, 212, 255, 0.2);
                    border-color: var(--primary);
                    transform: scale(1.1);
                    box-shadow: 
                        0 0 30px rgba(0, 212, 255, 0.6),
                        0 0 60px rgba(0, 212, 255, 0.4),
                        inset 0 0 20px rgba(0, 212, 255, 0.2);
                    animation: avatarPulse 2s ease-in-out infinite;
                }
                
                .avatar-option.selected::after {
                    opacity: 1;
                    animation: borderPulse 2s ease-in-out infinite;
                }
                
                @keyframes avatarPulse {
                    0%, 100% {
                        box-shadow: 
                            0 0 30px rgba(0, 212, 255, 0.6),
                            0 0 60px rgba(0, 212, 255, 0.4),
                            inset 0 0 20px rgba(0, 212, 255, 0.2);
                    }
                    50% {
                        box-shadow: 
                            0 0 40px rgba(0, 212, 255, 0.8),
                            0 0 80px rgba(0, 212, 255, 0.6),
                            inset 0 0 30px rgba(0, 212, 255, 0.3);
                    }
                }
                
                @keyframes borderPulse {
                    0%, 100% {
                        opacity: 0.6;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                }
                
                .avatar-icon {
                    font-size: 48px;
                    margin-bottom: 8px;
                }
                
                .avatar-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-secondary);
                }
                
                .avatar-option.selected .avatar-name {
                    color: var(--primary);
                }
            `;
            document.head.appendChild(style);
            
            // Add hover sound listeners to all avatars after styles are added
            setTimeout(() => {
                document.querySelectorAll('.avatar-option').forEach(el => {
                    // Click sound is handled in selectAvatar() - hover sounds removed per user request
                });
            }, 100);
        }
    }
};
