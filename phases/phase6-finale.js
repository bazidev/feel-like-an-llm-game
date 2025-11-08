// Phase 6: Finale - CLEAR SUMMARY & CELEBRATION
window.phase6 = {
    currentStep: 'celebration',
    
    nextStep() {
        const steps = ['celebration', 'journey', 'comparison', 'resources'];
        const currentIndex = steps.indexOf(this.currentStep);
        if (currentIndex < steps.length - 1) {
            this.currentStep = steps[currentIndex + 1];
            const container = document.getElementById('phaseContainer');
            if (container) {
                console.log(`✅ Moving to step: ${this.currentStep}`);
                this.render(container);
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Play click sound
                if (window.SoundManager) {
                    SoundManager.play('click');
                }
            } else {
                console.error('❌ Container not found!');
            }
        } else {
            console.log('✅ Already at final step');
        }
    },
    
    render(container) {
        const step = this.currentStep;
        
        if (step === 'celebration') {
            this.renderCelebration(container);
        } else if (step === 'journey') {
            this.renderJourney(container);
        } else if (step === 'comparison') {
            this.renderComparison(container);
        } else if (step === 'resources') {
            this.renderResources(container);
        }
    },
    
    renderCelebration(container) {
        // Reset to first step
        this.currentStep = 'celebration';
        
        // Save to scoreboard on first step
        const scoreboardResult = Game.saveToScoreboard();
        const ratingData = Game.getRatingGrade(scoreboardResult.record.rating);
        const generatedText = Game.state.generatedText;
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100%; padding: 30px 20px;">
                <div style="max-width: 850px; width: 100%;">
                    
                    <!-- Celebration Header -->
                    <div style="text-align: center; margin-bottom: 28px;">
                        <div style="font-size: 64px; margin-bottom: 14px;">🎉</div>
                        <h1 style="font-size: 42px; margin-bottom: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            Congratulations!
                        </h1>
                        <p style="font-size: 18px; color: var(--text-secondary); line-height: 1.5;">
                            You built a working mini-LLM from scratch
                        </p>
                    </div>
                    
                    <!-- Your Creation -->
                    <div style="padding: 22px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.15), rgba(0, 212, 255, 0.08)); 
                               border: 2px solid rgba(191, 0, 255, 0.4); border-radius: 14px; margin-bottom: 24px;">
                        <h2 style="font-size: 19px; color: var(--secondary); margin-bottom: 14px; text-align: center;">✨ Your AI's Creation</h2>
                        <div style="padding: 20px; background: rgba(0, 0, 0, 0.4); border-radius: 10px; text-align: center;">
                            <div style="font-size: 20px; font-family: 'JetBrains Mono', monospace; color: white; line-height: 1.7;">
                                "${generatedText}"
                            </div>
                        </div>
                        <div style="margin-top: 12px; text-align: center; font-size: 13px; color: var(--text-secondary);">
                            Generated purely from statistical patterns - no "understanding" required!
                        </div>
                    </div>
                    
                    <!-- Stats -->
                    <div style="padding: 20px; background: rgba(0, 212, 255, 0.08); border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: 18px; color: var(--primary); margin-bottom: 16px; text-align: center;">📈 Your Stats</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; text-align: center;">
                            <div>
                                <div style="font-size: 32px; color: var(--primary); font-weight: 700; margin-bottom: 6px;">${Game.state.score}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Total Score</div>
                            </div>
                            <div>
                                <div style="font-size: 32px; color: var(--primary); font-weight: 700; margin-bottom: 6px;">${Game.getElapsedTime()}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Time Spent</div>
                            </div>
                            <div>
                                <div style="font-size: 32px; color: var(--secondary); font-weight: 700; margin-bottom: 6px;">${Game.state.tokensProcessed}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Tokens Processed</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Rating & Rank -->
                    <div style="padding: 24px; background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1)); 
                               border: 3px solid ${ratingData.color}; border-radius: 14px; margin-bottom: 32px; text-align: center;">
                        <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 14px;">Your Performance Rating</div>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 28px; margin-bottom: 14px;">
                            <div>
                                <div style="font-size: 48px; font-weight: 700; color: ${ratingData.color};">
                                    ${ratingData.grade}
                                </div>
                                <div style="font-size: 14px; color: ${ratingData.color}; font-weight: 600; margin-top: 4px;">
                                    ${ratingData.label}
                                </div>
                            </div>
                            <div style="width: 2px; height: 60px; background: ${ratingData.color}; opacity: 0.3;"></div>
                            <div>
                                <div style="font-size: 42px; font-weight: 700; color: white;">
                                    #${scoreboardResult.rank}
                                </div>
                                <div style="font-size: 13px; color: var(--text-secondary); margin-top: 2px;">
                                    Scoreboard Rank
                                </div>
                            </div>
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
                            <strong style="color: ${ratingData.color};">Final Rating: ${scoreboardResult.record.rating}</strong>
                        </div>
                    </div>
                    
                    <!-- Next Button -->
                    <div style="text-align: center;">
                        <button id="celebrationNextBtn"
                                class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
                            Next: Your Journey →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Attach event listener to button
        setTimeout(() => {
            const btn = document.getElementById('celebrationNextBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    console.log('Celebration Next button clicked!');
                    window.phase6.nextStep();
                });
            }
        }, 0);
        
        // Mark as complete on first step
        Game.completePhase(300);
        Game.saveState();
    },
    
    renderJourney(container) {
        const tokens = Game.state.tokens;
        const uniqueTokenCount = new Set(tokens).size;
        const embeddingsCount = Object.keys(Game.state.embeddings).length;
        const modelPatterns = Object.keys(Game.state.model.bigrams).length;
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100%; padding: 40px 30px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <!-- Journey Recap -->
                    <div style="padding: 28px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 16px; margin-bottom: 36px;">
                        <h2 style="font-size: 28px; color: var(--primary); margin-bottom: 24px; text-align: center;">🗺️ Your Complete Journey</h2>
                        
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px;">
                            <div style="padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 12px; border: 2px solid rgba(0, 212, 255, 0.2);">
                                <div style="font-size: 18px; margin-bottom: 10px; font-weight: 600;">✂️ Phase 1: Tokenization</div>
                                <div style="font-size: 32px; color: var(--primary); font-weight: 700; margin-bottom: 6px;">${tokens.length}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">tokens created</div>
                            </div>
                            
                            <div style="padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 12px; border: 2px solid rgba(191, 0, 255, 0.2);">
                                <div style="font-size: 18px; margin-bottom: 10px; font-weight: 600;">📊 Phase 2: Embeddings</div>
                                <div style="font-size: 32px; color: var(--secondary); font-weight: 700; margin-bottom: 6px;">${embeddingsCount}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">vectors generated</div>
                            </div>
                            
                            <div style="padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 12px; border: 2px solid rgba(251, 191, 36, 0.2);">
                                <div style="font-size: 18px; margin-bottom: 10px; font-weight: 600;">🎯 Phase 3: Attention</div>
                                <div style="font-size: 32px; color: #fbbf24; font-weight: 700; margin-bottom: 6px;">✓</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">weights calculated</div>
                            </div>
                            
                            <div style="padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 12px; border: 2px solid rgba(34, 197, 94, 0.2);">
                                <div style="font-size: 18px; margin-bottom: 10px; font-weight: 600;">🏋️ Phase 4: Training</div>
                                <div style="font-size: 32px; color: #22c55e; font-weight: 700; margin-bottom: 6px;">${modelPatterns}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">patterns learned</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Key Insights -->
                    <div style="padding: 28px; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 16px; margin-bottom: 40px;">
                        <h2 style="font-size: 24px; color: var(--primary); margin-bottom: 20px; text-align: center;">💡 What You Learned</h2>
                        <div style="display: grid; gap: 14px;">
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid var(--primary); border-radius: 8px;">
                                <div style="font-size: 15px; font-weight: 600; color: white; margin-bottom: 6px;">No Understanding Needed</div>
                                <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">LLMs don't "know" meanings - they recognize patterns from massive training data</div>
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid var(--secondary); border-radius: 8px;">
                                <div style="font-size: 15px; font-weight: 600; color: white; margin-bottom: 6px;">It's All Math</div>
                                <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">Embeddings, attention, probabilities - pure mathematical operations on numbers</div>
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid #fbbf24; border-radius: 8px;">
                                <div style="font-size: 15px; font-weight: 600; color: white; margin-bottom: 6px;">Data is Everything</div>
                                <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">The model's "knowledge" comes entirely from training examples - garbage in, garbage out</div>
                            </div>
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-left: 4px solid #22c55e; border-radius: 8px;">
                                <div style="font-size: 15px; font-weight: 600; color: white; margin-bottom: 6px;">Pattern Recognition</div>
                                <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">Your LLM learned to predict what comes next based on what it saw during training</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation -->
                    <div style="text-align: center;">
                        <button id="journeyNextBtn"
                                class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
                            Next: Size Comparison →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Attach event listener to button
        setTimeout(() => {
            const btn = document.getElementById('journeyNextBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    console.log('Journey Next button clicked!');
                    window.phase6.nextStep();
                });
            }
        }, 0);
    },
    
    renderComparison(container) {
        const tokens = Game.state.tokens;
        const uniqueTokenCount = new Set(tokens).size;
        const modelPatterns = Object.keys(Game.state.model.bigrams).length;
        const trainingText = Game.state.trainingText || '';
        const sentenceCount = trainingText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100%; padding: 40px 30px;">
                <div style="max-width: 950px; width: 100%;">
                    
                    <!-- LLM Size Comparison -->
                    <div style="padding: 28px; background: rgba(139, 92, 246, 0.1); border: 2px solid rgba(139, 92, 246, 0.4); 
                               border-radius: 16px; margin-bottom: 36px;">
                        <h2 style="font-size: 28px; color: #a855f7; margin-bottom: 26px; text-align: center;">🔬 Your LLM vs Real LLMs</h2>
                        
                        <!-- Visual Size Comparison -->
                        <div style="position: relative; height: 220px; display: flex; align-items: flex-end; justify-content: center; gap: 26px; margin-bottom: 32px; padding: 20px; background: rgba(0, 0, 0, 0.2); border-radius: 12px;">
                            <!-- Your LLM - TINY -->
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="width: 4px; height: 4px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                           border-radius: 50%; box-shadow: 0 1px 8px rgba(0, 212, 255, 0.6);"></div>
                                <div style="font-size: 11px; margin-top: 8px; color: var(--primary); font-weight: 600;">Your LLM</div>
                            </div>
                            
                            <!-- GPT-1 -->
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="width: 22px; height: 22px; background: #6b7280; border-radius: 50%; box-shadow: 0 2px 10px rgba(107, 114, 128, 0.3);"></div>
                                <div style="font-size: 12px; margin-top: 8px; color: #9ca3af;">GPT-1</div>
                            </div>
                            
                            <!-- GPT-2 -->
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="width: 48px; height: 48px; background: #8b5cf6; border-radius: 50%; box-shadow: 0 2px 10px rgba(139, 92, 246, 0.4);"></div>
                                <div style="font-size: 12px; margin-top: 8px; color: #a855f7;">GPT-2</div>
                            </div>
                            
                            <!-- GPT-3 -->
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="width: 90px; height: 90px; background: #ec4899; border-radius: 50%; box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4);"></div>
                                <div style="font-size: 12px; margin-top: 8px; color: #ec4899;">GPT-3</div>
                            </div>
                            
                            <!-- GPT-4 -->
                            <div style="display: flex; flex-direction: column; align-items: center;">
                                <div style="width: 150px; height: 150px; background: linear-gradient(135deg, #f59e0b, #ef4444); border-radius: 50%; 
                                           box-shadow: 0 6px 30px rgba(245, 158, 11, 0.5);"></div>
                                <div style="font-size: 13px; margin-top: 8px; color: #f59e0b; font-weight: 700;">GPT-4</div>
                            </div>
                        </div>
                        
                        <!-- Stats Table -->
                        <div style="background: rgba(0, 0, 0, 0.4); border-radius: 12px; padding: 18px; overflow-x: auto; margin-bottom: 20px;">
                            <table style="width: 100%; font-size: 13px; color: var(--text-secondary); border-collapse: collapse;">
                                <thead>
                                    <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.15);">
                                        <th style="text-align: left; padding: 10px; font-weight: 700; color: white;">Model</th>
                                        <th style="text-align: right; padding: 10px; font-weight: 700; color: white;">Parameters</th>
                                        <th style="text-align: right; padding: 10px; font-weight: 700; color: white;">Vocab Size</th>
                                        <th style="text-align: right; padding: 10px; font-weight: 700; color: white;">Training Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                                        <td style="padding: 12px; color: var(--primary); font-weight: 600;">Your Mini-LLM</td>
                                        <td style="padding: 12px; text-align: right;">${modelPatterns} patterns</td>
                                        <td style="padding: 12px; text-align: right;">${uniqueTokenCount} tokens</td>
                                        <td style="padding: 12px; text-align: right;">${sentenceCount} sentences</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                                        <td style="padding: 12px;">GPT-1</td>
                                        <td style="padding: 12px; text-align: right;">117 Million</td>
                                        <td style="padding: 12px; text-align: right;">40,478</td>
                                        <td style="padding: 12px; text-align: right;">~5 GB text</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                                        <td style="padding: 12px;">GPT-2</td>
                                        <td style="padding: 12px; text-align: right;">1.5 Billion</td>
                                        <td style="padding: 12px; text-align: right;">50,257</td>
                                        <td style="padding: 12px; text-align: right;">40 GB text</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                                        <td style="padding: 12px;">GPT-3</td>
                                        <td style="padding: 12px; text-align: right;">175 Billion</td>
                                        <td style="padding: 12px; text-align: right;">50,257</td>
                                        <td style="padding: 12px; text-align: right;">570 GB text</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px; font-weight: 600; color: #f59e0b;">GPT-4</td>
                                        <td style="padding: 12px; text-align: right; font-weight: 600; color: #f59e0b;">~1.76 Trillion</td>
                                        <td style="padding: 12px; text-align: right; font-weight: 600; color: #f59e0b;">100,000</td>
                                        <td style="padding: 12px; text-align: right; font-weight: 600; color: #f59e0b;">~13 Trillion tokens</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <!-- Reality Check -->
                        <div style="padding: 16px; background: rgba(251, 191, 36, 0.12); border-left: 4px solid #fbbf24; border-radius: 8px;">
                            <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.7;">
                                💡 <strong style="color: #fbbf24;">Reality Check:</strong> You learned the <strong>foundational concepts</strong> (tokenization, embeddings, attention, generation), 
                                but real LLMs are <strong>vastly more complex</strong>!
                                <div style="margin-top: 12px; padding-left: 12px; border-left: 2px solid rgba(251, 191, 36, 0.3);">
                                    <div style="font-size: 13px; line-height: 1.8;">
                                        Real transformers add: <strong>Multi-head attention</strong>, <strong>feedforward networks</strong>, <strong>layer normalization</strong>, 
                                        <strong>residual connections</strong>, <strong>96+ stacked layers</strong>, <strong>backpropagation</strong>, sophisticated <strong>optimizers</strong>, 
                                        <strong>gradient descent</strong>, <strong>temperature sampling</strong>, encoder/decoder architectures, and hundreds more mathematical components.
                                    </div>
                                </div>
                                <div style="margin-top: 12px; font-size: 13px; font-style: italic; color: rgba(251, 191, 36, 0.95);">
                                    Your bigram model is like understanding basic arithmetic before learning calculus. 
                                    You've grasped the <strong>fundamental ideas</strong>, but building GPT-4 requires years of research and billions in compute!
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation -->
                    <div style="text-align: center;">
                        <button id="comparisonNextBtn"
                                class="btn-primary" style="padding: 16px 48px; font-size: 16px;">
                            Next: Learning Resources →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Attach event listener to button
        setTimeout(() => {
            const btn = document.getElementById('comparisonNextBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    console.log('Comparison Next button clicked!');
                    window.phase6.nextStep();
                });
            }
        }, 0);
    },
    
    renderResources(container) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100%; padding: 40px 30px;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <!-- Learning Resources -->
                    <div style="padding: 32px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.06)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 16px; margin-bottom: 36px;">
                        <div style="text-align: center; margin-bottom: 28px;">
                            <h2 style="font-size: 32px; color: var(--primary); margin: 0 0 12px 0;">
                                🎓 Ready to Go Deeper?
                            </h2>
                            <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
                                Continue your LLM learning journey with these world-class resources
                            </p>
                        </div>
                        
                        <div style="display: grid; gap: 18px;">
                            <!-- Andrej Karpathy - Intro to LLMs -->
                            <a href="https://www.youtube.com/watch?v=zjkBMFhNj_g" target="_blank" 
                               style="display: block; padding: 20px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(0, 212, 255, 0.3); 
                                      border-radius: 12px; text-decoration: none; transition: all 0.3s; cursor: pointer;"
                               onmouseover="this.style.background='rgba(0, 212, 255, 0.15)'; this.style.borderColor='rgba(0, 212, 255, 0.6)';"
                               onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.borderColor='rgba(0, 212, 255, 0.3)';">
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    <div style="font-size: 36px; flex-shrink: 0;">🎥</div>
                                    <div style="flex: 1;">
                                        <div style="font-size: 17px; font-weight: 600; color: var(--primary); margin-bottom: 6px;">
                                            Intro to Large Language Models
                                        </div>
                                        <div style="font-size: 14px; color: var(--text-secondary);">
                                            By Andrej Karpathy • 1 hour comprehensive overview of modern LLMs
                                        </div>
                                    </div>
                                    <div style="font-size: 24px; color: var(--primary); flex-shrink: 0;">→</div>
                                </div>
                            </a>
                            
                            <!-- Andrej Karpathy - Let's build GPT -->
                            <a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank" 
                               style="display: block; padding: 20px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(191, 0, 255, 0.3); 
                                      border-radius: 12px; text-decoration: none; transition: all 0.3s; cursor: pointer;"
                               onmouseover="this.style.background='rgba(191, 0, 255, 0.15)'; this.style.borderColor='rgba(191, 0, 255, 0.6)';"
                               onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.borderColor='rgba(191, 0, 255, 0.3)';">
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    <div style="font-size: 36px; flex-shrink: 0;">🔨</div>
                                    <div style="flex: 1;">
                                        <div style="font-size: 17px; font-weight: 600; color: var(--secondary); margin-bottom: 6px;">
                                            Let's build GPT: from scratch, in code, spelled out
                                        </div>
                                        <div style="font-size: 14px; color: var(--text-secondary);">
                                            By Andrej Karpathy • 2 hours of hands-on GPT implementation
                                        </div>
                                    </div>
                                    <div style="font-size: 24px; color: var(--secondary); flex-shrink: 0;">→</div>
                                </div>
                            </a>
                            
                            <!-- Attention Is All You Need Paper -->
                            <a href="https://arxiv.org/abs/1706.03762" target="_blank" 
                               style="display: block; padding: 20px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(251, 191, 36, 0.3); 
                                      border-radius: 12px; text-decoration: none; transition: all 0.3s; cursor: pointer;"
                               onmouseover="this.style.background='rgba(251, 191, 36, 0.15)'; this.style.borderColor='rgba(251, 191, 36, 0.6)';"
                               onmouseout="this.style.background='rgba(0, 0, 0, 0.3)'; this.style.borderColor='rgba(251, 191, 36, 0.3)';">
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    <div style="font-size: 36px; flex-shrink: 0;">📄</div>
                                    <div style="flex: 1;">
                                        <div style="font-size: 17px; font-weight: 600; color: #fbbf24; margin-bottom: 6px;">
                                            "Attention Is All You Need" (2017)
                                        </div>
                                        <div style="font-size: 14px; color: var(--text-secondary);">
                                            The foundational paper that introduced the Transformer architecture
                                        </div>
                                    </div>
                                    <div style="font-size: 24px; color: #fbbf24; flex-shrink: 0;">→</div>
                                </div>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Final Actions -->
                    <div style="text-align: center;">
                        <div style="display: flex; gap: 16px; justify-content: center;">
                            <button class="btn-secondary" onclick="Game.confirmReset()" style="padding: 16px 40px; font-size: 16px;">
                                🔄 Play Again
                            </button>
                            <button class="btn-primary" onclick="Game.showScoreboard()" style="padding: 16px 40px; font-size: 16px;">
                                🏆 View Scoreboard
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        `;
    }
};
