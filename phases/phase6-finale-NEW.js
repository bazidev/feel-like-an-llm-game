// Phase 6: Finale - CLEAR SUMMARY & CELEBRATION
window.phase6 = {
    render(container) {
        const tokens = Game.state.tokens;
        const embeddings = Object.keys(Game.state.embeddings);
        const modelPatterns = Object.keys(Game.state.model.bigrams);
        const generatedText = Game.state.generatedText;
        
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px; overflow-y: auto;">
                <div style="max-width: 1000px; width: 100%;">
                    
                    <!-- Celebration Header -->
                    <div style="text-align: center; margin-bottom: 40px;">
                        <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
                        <h1 style="font-size: 40px; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            Congratulations!
                        </h1>
                        <p style="font-size: 18px; color: var(--text-secondary);">
                            You built a working mini-LLM from scratch
                        </p>
                    </div>
                    
                    <!-- Journey Recap -->
                    <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border: 2px solid var(--primary); border-radius: 16px; margin-bottom: 32px;">
                        <h2 style="font-size: 22px; color: var(--primary); margin-bottom: 20px; text-align: center;">🗺️ Your Complete Journey</h2>
                        
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 10px;">
                                <div style="font-size: 16px; margin-bottom: 8px;">✂️ Phase 1: Tokenization</div>
                                <div style="font-size: 24px; color: var(--primary); font-weight: 700; margin-bottom: 4px;">${tokens.length}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">tokens created</div>
                            </div>
                            
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 10px;">
                                <div style="font-size: 16px; margin-bottom: 8px;">📊 Phase 2: Embeddings</div>
                                <div style="font-size: 24px; color: var(--primary); font-weight: 700; margin-bottom: 4px;">${embeddings.length}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">vectors generated</div>
                            </div>
                            
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 10px;">
                                <div style="font-size: 16px; margin-bottom: 8px;">🎯 Phase 3: Attention</div>
                                <div style="font-size: 24px; color: var(--primary); font-weight: 700; margin-bottom: 4px;">✓</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">weights calculated</div>
                            </div>
                            
                            <div style="padding: 16px; background: rgba(0, 0, 0, 0.3); border-radius: 10px;">
                                <div style="font-size: 16px; margin-bottom: 8px;">🏋️ Phase 4: Training</div>
                                <div style="font-size: 24px; color: var(--primary); font-weight: 700; margin-bottom: 4px;">${modelPatterns}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">patterns learned</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Your Creation -->
                    <div style="padding: 24px; background: linear-gradient(135deg, rgba(191, 0, 255, 0.1), rgba(0, 212, 255, 0.05)); 
                               border: 2px solid rgba(191, 0, 255, 0.3); border-radius: 16px; margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: var(--secondary); margin-bottom: 16px; text-align: center;">✨ Your AI's Creation</h2>
                        <div style="padding: 20px; background: rgba(0, 0, 0, 0.3); border-radius: 10px; text-align: center;">
                            <div style="font-size: 22px; font-family: 'JetBrains Mono', monospace; color: white; line-height: 1.8;">
                                "${generatedText}"
                            </div>
                        </div>
                        <div style="margin-top: 12px; text-align: center; font-size: 13px; color: var(--text-secondary);">
                            Generated purely from statistical patterns - no "understanding" required!
                        </div>
                    </div>
                    
                    <!-- Key Insights -->
                    <div style="padding: 24px; background: rgba(255, 255, 255, 0.02); border-radius: 16px; margin-bottom: 32px;">
                        <h2 style="font-size: 20px; color: var(--primary); margin-bottom: 16px;">💡 What You Learned</h2>
                        <div style="display: grid; gap: 12px;">
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.2); border-left: 3px solid var(--primary); border-radius: 6px;">
                                <div style="font-size: 14px; font-weight: 600; color: white; margin-bottom: 4px;">No Understanding Needed</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">LLMs don't "know" meanings - they recognize patterns from massive training data</div>
                            </div>
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.2); border-left: 3px solid var(--primary); border-radius: 6px;">
                                <div style="font-size: 14px; font-weight: 600; color: white; margin-bottom: 4px;">It's All Math</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">Embeddings, attention, probabilities - pure mathematical operations on numbers</div>
                            </div>
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.2); border-left: 3px solid var(--primary); border-radius: 6px;">
                                <div style="font-size: 14px; font-weight: 600; color: white; margin-bottom: 4px;">Data is Everything</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">The model's "knowledge" comes entirely from training examples - garbage in, garbage out</div>
                            </div>
                            <div style="padding: 14px; background: rgba(0, 0, 0, 0.2); border-left: 3px solid var(--primary); border-radius: 6px;">
                                <div style="font-size: 14px; font-weight: 600; color: white; margin-bottom: 4px;">Scale Matters</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">Real LLMs use billions of parameters and trillions of tokens - but the principles are the same!</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Stats -->
                    <div style="padding: 20px; background: rgba(0, 212, 255, 0.05); border-radius: 12px; margin-bottom: 32px;">
                        <h3 style="font-size: 18px; color: var(--primary); margin-bottom: 16px; text-align: center;">📈 Your Stats</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
                            <div>
                                <div style="font-size: 28px; color: var(--primary); font-weight: 700;">${Game.state.score}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Total Score</div>
                            </div>
                            <div>
                                <div style="font-size: 28px; color: var(--secondary); font-weight: 700;">${Game.state.level}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Level</div>
                            </div>
                            <div>
                                <div style="font-size: 28px; color: var(--success); font-weight: 700;">${Game.state.tokensProcessed}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Tokens Processed</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div style="display: flex; gap: 12px;">
                        <button class="btn-secondary" onclick="window.location.reload()" style="flex: 1; padding: 14px;">
                            🔄 Try Different Data
                        </button>
                        <button class="btn-primary" onclick="Game.showMessage('Thanks for playing! 🎉', 'success')" style="flex: 1; padding: 14px;">
                            🎊 Celebrate!
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Mark as complete
        Game.completePhase(300);
        Game.saveState();
    }
};

