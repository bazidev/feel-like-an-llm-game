// Phase -1: Game Overview & Introduction
// This is shown BEFORE name selection - explains the entire journey

window['phase-1'] = {
    render(container) {
        container.innerHTML = `
            <div class="phase" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
                
                <!-- Main Title -->
                <div style="text-align: center; margin-bottom: 48px;">
                    <h1 style="font-size: 48px; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        Feel Like an LLM
                    </h1>
                    <p style="font-size: 20px; color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
                        Experience the complete journey of building an AI from scratch
                    </p>
                </div>

                <!-- Training Text Preview -->
                <div style="margin-bottom: 48px; padding: 24px; background: rgba(0, 212, 255, 0.08); 
                           border: 2px solid var(--primary); border-radius: 16px; max-width: 700px; width: 100%;">
                    <div style="text-align: center; margin-bottom: 16px;">
                        <span style="font-size: 14px; color: var(--text-secondary); font-weight: 600;">📖 YOUR TRAINING DATA</span>
                    </div>
                    <div style="font-size: 24px; font-weight: 600; text-align: center; color: white; 
                               font-family: 'JetBrains Mono', monospace; line-height: 1.6;">
                        "${Game.state.trainingText}"
                    </div>
                    <div style="margin-top: 16px; text-align: center; font-size: 13px; color: var(--text-secondary);">
                        You'll break this down, learn patterns, and generate NEW text from it!
                    </div>
                </div>

                <!-- Journey Map -->
                <div style="max-width: 900px; width: 100%; margin-bottom: 48px;">
                    <h3 style="text-align: center; font-size: 22px; margin-bottom: 32px; color: var(--primary);">
                        🗺️ Your AI Journey
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                        
                        <!-- Step 1 -->
                        <div class="journey-step">
                            <div class="step-number">1</div>
                            <div class="step-icon">✂️</div>
                            <div class="step-title">Tokenization</div>
                            <div class="step-desc">Break text into tokens</div>
                        </div>
                        
                        <!-- Step 2 -->
                        <div class="journey-step">
                            <div class="step-number">2</div>
                            <div class="step-icon">📊</div>
                            <div class="step-title">Embeddings</div>
                            <div class="step-desc">Convert to numbers</div>
                        </div>
                        
                        <!-- Step 3 -->
                        <div class="journey-step">
                            <div class="step-number">3</div>
                            <div class="step-icon">🎯</div>
                            <div class="step-title">Attention</div>
                            <div class="step-desc">Learn relationships</div>
                        </div>
                        
                        <!-- Step 4 -->
                        <div class="journey-step">
                            <div class="step-number">4</div>
                            <div class="step-icon">🏋️</div>
                            <div class="step-title">Training</div>
                            <div class="step-desc">Adjust weights</div>
                        </div>
                        
                        <!-- Step 5 -->
                        <div class="journey-step">
                            <div class="step-number">5</div>
                            <div class="step-icon">✨</div>
                            <div class="step-title">Generation</div>
                            <div class="step-desc">Create new text!</div>
                        </div>
                        
                    </div>
                </div>

                <!-- Key Points -->
                <div style="max-width: 800px; width: 100%; margin-bottom: 40px; padding: 20px; background: rgba(255, 255, 255, 0.02); 
                           border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <h4 style="color: var(--secondary); margin-bottom: 16px; font-size: 18px;">💡 What You'll Learn:</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; color: var(--text-secondary); font-size: 15px; line-height: 2;">
                        <li>✓ How LLMs process language without "understanding" it</li>
                        <li>✓ How patterns emerge from mathematical operations</li>
                        <li>✓ How training data directly shapes AI behavior</li>
                        <li>✓ How to build a REAL working text generator</li>
                    </ul>
                </div>

                <!-- Start Button -->
                <button class="btn-primary" onclick="phase[-1].startJourney()" 
                        style="font-size: 20px; padding: 18px 48px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               box-shadow: 0 8px 30px var(--glow); position: relative; overflow: hidden;">
                    <span style="position: relative; z-index: 1;">🚀 Begin Your Journey</span>
                </button>

            </div>
        `;

        // Add CSS for journey steps
        if (!document.getElementById('journey-step-css')) {
            const style = document.createElement('style');
            style.id = 'journey-step-css';
            style.textContent = `
                .journey-step {
                    padding: 24px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    text-align: center;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .journey-step:hover {
                    background: rgba(0, 212, 255, 0.08);
                    border-color: var(--primary);
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 212, 255, 0.2);
                }
                
                .step-number {
                    position: absolute;
                    top: -12px;
                    left: 12px;
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 16px;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
                }
                
                .step-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
                }
                
                .step-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                }
                
                .step-desc {
                    font-size: 13px;
                    color: var(--text-secondary);
                }
                
                @media (max-width: 768px) {
                    .journey-step {
                        padding: 20px;
                    }
                    .step-icon {
                        font-size: 36px;
                    }
                    .step-title {
                        font-size: 16px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Animate entrance
        if (typeof gsap !== 'undefined') {
            gsap.from('.journey-step', {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.2)'
            });
        }
    },

    startJourney() {
        SoundManager.play('success');
        
        // Show a nice transition message
        const msg = document.createElement('div');
        msg.innerHTML = '✨ Starting your AI journey...';
        msg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 30px 60px;
            border-radius: 20px;
            font-size: 24px;
            font-weight: 800;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(0, 212, 255, 0.4);
        `;
        document.body.appendChild(msg);
        
        if (typeof gsap !== 'undefined') {
            gsap.from(msg, {
                scale: 0,
                duration: 0.5,
                ease: 'back.out(2)'
            });
            
            gsap.to(msg, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: 1,
                onComplete: () => {
                    msg.remove();
                    // Move to Phase 0 (Name Selection)
                    Game.nextPhase();
                }
            });
        } else {
            setTimeout(() => {
                msg.remove();
                Game.nextPhase();
            }, 1500);
        }
    }
};

