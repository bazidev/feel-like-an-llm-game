// Phase 6: Journey Complete - Celebration & Insights
window.phase6 = {
    render(container) {
        const model = Game.state.model;
        const tokensCount = Game.state.tokens ? Game.state.tokens.length : 0;
        const embeddingsCount = Game.state.embeddings ? Object.keys(Game.state.embeddings).length : 0;
        const attentionCount = Game.state.attentionWeights ? Object.keys(Game.state.attentionWeights).length : 0;
        
        container.innerHTML = `
            <div class="phase" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
                
                <div style="text-align: center; max-width: 900px;">
                    
                    <!-- Title -->
                    <div style="margin-bottom: 40px;">
                        <h1 style="font-size: 48px; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            🎉 Journey Complete!
                        </h1>
                        <p style="font-size: 22px; color: var(--text-secondary); margin-bottom: 8px;">
                            You've experienced the complete AI journey
                        </p>
                        <p style="font-size: 16px; color: var(--text-secondary);">
                            From raw text to intelligent generation
                        </p>
                    </div>
                    
                    <!-- What You Built -->
                    <div style="margin-bottom: 40px; padding: 32px; background: rgba(0, 212, 255, 0.08); 
                               border: 2px solid var(--primary); border-radius: 16px;">
                        <h3 style="font-size: 24px; color: var(--primary); margin-bottom: 24px;">
                            🏆 What You Built
                        </h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 24px;">
                            <div>
                                <div style="font-size: 36px; font-weight: 800; color: var(--primary);">${tokensCount}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">Tokens Processed</div>
                            </div>
                            <div>
                                <div style="font-size: 36px; font-weight: 800; color: var(--secondary);">${embeddingsCount}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">Embeddings Created</div>
                            </div>
                            <div>
                                <div style="font-size: 36px; font-weight: 800; color: var(--success);">${attentionCount}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">Attention Weights</div>
                            </div>
                            <div>
                                <div style="font-size: 36px; font-weight: 800; color: #f59e0b;">${model ? model.vocabulary.length : 0}</div>
                                <div style="font-size: 13px; color: var(--text-secondary);">Vocabulary Size</div>
                            </div>
                        </div>
                        <div style="padding: 16px; background: rgba(34, 197, 94, 0.1); border-radius: 10px;">
                            <p style="font-size: 15px; color: #22c55e; font-weight: 600; margin: 0;">
                                ✅ A working AI model built from YOUR data!
                            </p>
                        </div>
                    </div>
                    
                    <!-- Journey Recap -->
                    <div style="margin-bottom: 40px; padding: 24px; background: rgba(255, 255, 255, 0.02); border-radius: 12px;">
                        <h3 style="font-size: 20px; color: var(--secondary); margin-bottom: 20px;">
                            📚 Your Journey
                        </h3>
                        <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
                            <div style="padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border-left: 3px solid var(--primary);">
                                <strong style="color: var(--primary);">Phase 1 - Tokenization:</strong> 
                                <span style="color: var(--text-secondary);">Split "${Game.state.trainingText.substring(0, 30)}..." into ${tokensCount} tokens</span>
                            </div>
                            <div style="padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border-left: 3px solid var(--primary);">
                                <strong style="color: var(--primary);">Phase 2 - Embeddings:</strong> 
                                <span style="color: var(--text-secondary);">Converted tokens to ${embeddingsCount} numerical vectors</span>
                            </div>
                            <div style="padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border-left: 3px solid var(--secondary);">
                                <strong style="color: var(--secondary);">Phase 3 - Attention:</strong> 
                                <span style="color: var(--text-secondary);">Calculated context importance for ${attentionCount} words</span>
                            </div>
                            <div style="padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border-left: 3px solid var(--success);">
                                <strong style="color: var(--success);">Phase 4 - Training:</strong> 
                                <span style="color: var(--text-secondary);">Built bigram model with ${model ? Object.keys(model.bigrams).length : 0} patterns</span>
                            </div>
                            <div style="padding: 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border-left: 3px solid #f59e0b;">
                                <strong style="color: #f59e0b;">Phase 5 - Generation:</strong> 
                                <span style="color: var(--text-secondary);">Generated new text using learned patterns!</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Key Insights -->
                    <div style="margin-bottom: 40px; padding: 24px; background: rgba(255, 0, 255, 0.05); 
                               border: 2px solid var(--secondary); border-radius: 12px; text-align: left;">
                        <h3 style="font-size: 20px; color: var(--secondary); margin-bottom: 16px; text-align: center;">
                            💡 Key Insights
                        </h3>
                        <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 2; color: var(--text-secondary);">
                            <li>✓ <strong>No Understanding:</strong> AI doesn't "know" what words mean - it recognizes statistical patterns</li>
                            <li>✓ <strong>Pure Math:</strong> Every step is matrix multiplication and probability calculations</li>
                            <li>✓ <strong>Data is Everything:</strong> The model's behavior comes entirely from training data</li>
                            <li>✓ <strong>Scale Matters:</strong> Real LLMs use billions of parameters and trillions of tokens</li>
                            <li>✓ <strong>Connected Pipeline:</strong> Each phase builds on the previous - it's one system</li>
                        </ul>
                    </div>
                    
                    <!-- Final Score -->
                    <div style="margin-bottom: 32px; padding: 24px; background: rgba(34, 197, 94, 0.1); 
                               border: 2px solid #22c55e; border-radius: 12px;">
                        <h3 style="font-size: 28px; color: #22c55e; margin-bottom: 12px;">
                            Final Score
                        </h3>
                        <div style="font-size: 56px; font-weight: 800; color: #22c55e; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px;">
                            ${Game.state.score}
                        </div>
                        <div style="font-size: 14px; color: var(--text-secondary);">
                            Level ${Game.state.level} • ${tokensCount} Tokens Processed
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="Game.performReset()" 
                                style="padding: 16px 40px; font-size: 18px;">
                            🔄 Play Again
                        </button>
                        <button class="btn-secondary" onclick="phase6.viewInConsole()" 
                                style="padding: 16px 40px; font-size: 18px;">
                            👀 View Model Data
                        </button>
                    </div>
                    
                    <!-- Thank You -->
                    <div style="margin-top: 48px; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                        <p style="font-size: 16px; color: var(--text-secondary); margin: 0;">
                            Thank you for experiencing the journey of an LLM! 🎉
                        </p>
                        <p style="font-size: 13px; color: var(--text-secondary); margin-top: 8px;">
                            Now you understand what happens behind the scenes when you chat with AI.
                        </p>
                    </div>
                    
                </div>
                
            </div>
        `;
        
        // Animate entrance
        if (typeof gsap !== 'undefined') {
            gsap.from('h1, h3, .btn-primary, .btn-secondary', {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.2)'
            });
        }
        
        // Mark as complete
        Game.state.phaseCompleted[6] = true;
        Game.saveState();
    },
    
    viewInConsole() {
        console.log('='.repeat(50));
        console.log('🤖 YOUR TRAINED MODEL DATA:');
        console.log('='.repeat(50));
        console.log('Training Text:', Game.state.trainingText);
        console.log('Tokens:', Game.state.tokens);
        console.log('Embeddings:', Game.state.embeddings);
        console.log('Attention Weights:', Game.state.attentionWeights);
        console.log('Model:', Game.state.model);
        console.log('='.repeat(50));
        
        Game.showMessage('Model data logged to console! (Press F12)', 'success');
        SoundManager.play('click');
    }
};

