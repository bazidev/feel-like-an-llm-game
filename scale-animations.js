// Scale Comparison Animations - Visual demonstrations of LLM scale differences
// This file creates stunning animated visualizations showing the massive gap between
// the user's mini-LLM and real production models like GPT-2, GPT-3, and GPT-4

window.ScaleAnimations = {
    
    // TOKENIZATION: Animate tokens shrinking and comparing to real LLMs
    animateTokenComparison(userTokens) {
        const container = document.getElementById('tokenScaleAnimation');
        if (!container) return;
        
        console.log('🔍 Debug: Received tokens:', userTokens);
        console.log('🔍 Token types:', userTokens.map(t => typeof t));
        console.log('🔍 Token charCodes:', userTokens.slice(0, 5).map(t => 
            t.split('').map(c => c.charCodeAt(0))
        ));
        
        const uniqueTokens = [...new Set(userTokens)].map(token => {
            // Ensure token is a proper string
            if (typeof token !== 'string') {
                console.warn('⚠️ Non-string token detected:', token);
                return String(token);
            }
            return token;
        });
        const tokenCount = uniqueTokens.length;
        
        // Helper function to display token properly
        const displayToken = (token) => {
            // Ensure it's a string
            const str = String(token);
            
            // Handle special whitespace
            if (str === ' ') return '␣';
            if (str === '\n') return '↵';
            if (str === '\t') return '⇥';
            if (str === '') return '∅'; // Empty token
            
            // Escape HTML entities
            return str.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/"/g, '&quot;')
                     .replace(/'/g, '&#39;');
        };
        
        console.log('✅ Display tokens:', uniqueTokens.slice(0, 10).map(displayToken));
        
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div id="yourVocabulary" style="font-size: 20px; color: var(--primary); font-weight: 700; margin-bottom: 12px; text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);">
                    YOUR VOCABULARY
                </div>
                <div id="userTokenCloud" style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; min-height: 80px; align-items: center; perspective: 1000px;">
                    ${uniqueTokens.slice(0, 20).map((token, i) => {
                        const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];
                        const color = colors[i % colors.length];
                        const displayText = displayToken(token);
                        return `<div class="token-bubble" data-index="${i}" style="
                            padding: 8px 12px; 
                            background: ${color}40; 
                            border: 2px solid ${color}; 
                            border-radius: 8px; 
                            font-size: 12px; 
                            font-weight: 700; 
                            color: white;
                            font-family: 'JetBrains Mono', monospace;
                            box-shadow: 0 4px 12px ${color}60, 0 0 20px ${color}40;
                            opacity: 0;
                            transform: scale(0);
                        ">${displayText}</div>`;
                    }).join('')}
                </div>
            </div>
            
            <div id="scaleComparison" style="display: flex; justify-content: space-around; align-items: flex-end; min-height: 200px; opacity: 0; padding: 15px 10px 10px 10px;">
                <!-- Your Model -->
                <div style="text-align: center; transition: all 0.3s;">
                    <div id="yourModelViz" style="
                        width: 35px; 
                        height: 35px; 
                        background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                        border-radius: 50%; 
                        margin: 0 auto 10px auto;
                        box-shadow: 0 4px 15px rgba(0, 212, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.4);
                        position: relative;
                        animation: gentlePulse 2s ease-in-out infinite;
                    ">
                        <div style="position: absolute; top: -8px; right: -8px; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; 
                                   border-radius: 16px; padding: 4px 8px; font-size: 10px; font-weight: 700; box-shadow: 0 3px 12px rgba(34, 197, 94, 0.6);">
                            ${tokenCount}
                        </div>
                    </div>
                    <div style="font-size: 11px; color: var(--primary); font-weight: 700;">Your Model</div>
                    <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">${tokenCount} tokens</div>
                </div>
                
                <!-- GPT-2 -->
                <div style="text-align: center; transition: all 0.3s;">
                    <div style="
                        width: 70px; 
                        height: 70px; 
                        background: linear-gradient(135deg, #8b5cf6, #6b46c1); 
                        border-radius: 50%; 
                        margin: 0 auto 10px auto;
                        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.7), 0 0 35px rgba(139, 92, 246, 0.4);
                        position: relative;
                        opacity: 0;
                    " class="model-circle" data-model="gpt2">
                        <div style="position: absolute; top: -10px; right: -10px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; 
                                   border-radius: 18px; padding: 5px 10px; font-size: 11px; font-weight: 700; box-shadow: 0 3px 12px rgba(139, 92, 246, 0.8);">
                            50K
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #8b5cf6; font-weight: 700;">GPT-2</div>
                    <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">50,257 tokens</div>
                </div>
                
                <!-- GPT-3 -->
                <div style="text-align: center; transition: all 0.3s;">
                    <div style="
                        width: 110px; 
                        height: 110px; 
                        background: linear-gradient(135deg, #ec4899, #db2777); 
                        border-radius: 50%; 
                        margin: 0 auto 10px auto;
                        box-shadow: 0 8px 30px rgba(236, 72, 153, 0.8), 0 0 45px rgba(236, 72, 153, 0.5);
                        position: relative;
                        opacity: 0;
                    " class="model-circle" data-model="gpt3">
                        <div style="position: absolute; top: -12px; right: -12px; background: linear-gradient(135deg, #ec4899, #db2777); color: white; 
                                   border-radius: 22px; padding: 7px 12px; font-size: 12px; font-weight: 700; box-shadow: 0 3px 15px rgba(236, 72, 153, 0.9);">
                            50K
                        </div>
                    </div>
                    <div style="font-size: 13px; color: #ec4899; font-weight: 700;">GPT-3</div>
                    <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">50,257 tokens</div>
                </div>
                
                <!-- GPT-4 -->
                <div style="text-align: center; transition: all 0.3s;">
                    <div style="
                        width: 150px; 
                        height: 150px; 
                        background: linear-gradient(135deg, #f59e0b, #ef4444); 
                        border-radius: 50%; 
                        margin: 0 auto 10px auto;
                        box-shadow: 0 10px 35px rgba(245, 158, 11, 0.9), 0 0 55px rgba(245, 158, 11, 0.6);
                        position: relative;
                        opacity: 0;
                    " class="model-circle" data-model="gpt4">
                        <div style="position: absolute; top: -14px; right: -14px; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; 
                                   border-radius: 26px; padding: 8px 14px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 18px rgba(245, 158, 11, 1);">
                            100K
                        </div>
                    </div>
                    <div style="font-size: 14px; color: #f59e0b; font-weight: 700;">GPT-4</div>
                    <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">~100,000 tokens</div>
                </div>
            </div>
            
            <style>
                @keyframes gentlePulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 6px 25px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 8px 35px rgba(0, 212, 255, 1), 0 0 60px rgba(0, 212, 255, 0.6); }
                }
            </style>
        `;
        
        // Animate user tokens appearing
        const bubbles = document.querySelectorAll('.token-bubble');
        gsap.to(bubbles, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: 'back.out(1.7)',
            onComplete: () => {
                // Pulse animation on tokens
                gsap.to(bubbles, {
                    scale: 1.1,
                    duration: 0.5,
                    stagger: { amount: 0.5, repeat: 1, yoyo: true }
                });
                
                // After 2.5 seconds, shrink tokens and show comparison
                setTimeout(() => {
                    gsap.to('#userTokenCloud', {
                        scale: 0.25,
                        y: -60,
                        opacity: 0,
                        duration: 1.2,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            // Completely remove from layout
                            document.getElementById('yourVocabulary').style.visibility = 'hidden';
                        }
                    });
                    
                    gsap.to('#scaleComparison', {
                        opacity: 1,
                        duration: 0.6,
                        delay: 0.4
                    });
                    
                    // Animate model circles exploding into view
                    const circles = document.querySelectorAll('.model-circle');
                    circles.forEach((circle, i) => {
                        setTimeout(() => {
                            gsap.fromTo(circle,
                                { scale: 0, opacity: 0, rotation: -180 },
                                { 
                                    scale: 1, 
                                    opacity: 1,
                                    rotation: 0,
                                    duration: 1,
                                    ease: 'elastic.out(1, 0.6)'
                                }
                            );
                            
                            // Continuous pulse effect
                            gsap.to(circle, {
                                scale: 1.05,
                                duration: 2,
                                repeat: -1,
                                yoyo: true,
                                ease: 'sine.inOut',
                                delay: 1
                            });
                        }, i * 350 + 800);
                    });
                }, 2500);
            }
        });
    },
    
    // EMBEDDINGS: Dimension explosion from 2D to thousands
    animateEmbeddingComparison() {
        const container = document.getElementById('embeddingScaleAnimation');
        if (!container) return;
        
        container.innerHTML = `
            <div id="userSection" style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 20px; color: var(--primary); font-weight: 700; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);">
                    YOUR 2D EMBEDDING SPACE
                </div>
                <div id="userEmbedding" style="position: relative; height: 160px; display: flex; align-items: center; justify-content: center;">
                    <div style="position: relative; width: 280px; height: 160px;">
                        <!-- X axis -->
                        <div style="position: absolute; bottom: 20px; left: 10px; right: 10px; height: 2px; background: linear-gradient(90deg, var(--primary), rgba(0, 212, 255, 0.3));"></div>
                        <div style="position: absolute; bottom: 3px; right: 10px; color: var(--primary); font-size: 14px; font-weight: 700;">X</div>
                        
                        <!-- Y axis -->
                        <div style="position: absolute; top: 10px; bottom: 20px; left: 20px; width: 2px; background: linear-gradient(180deg, var(--secondary), rgba(168, 85, 247, 0.3));"></div>
                        <div style="position: absolute; top: 3px; left: 3px; color: var(--secondary); font-size: 14px; font-weight: 700;">Y</div>
                        
                        <!-- Sample embedding points -->
                        <div class="embed-point" style="position: absolute; left: 60px; top: 35px; width: 12px; height: 12px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 15px #22c55e;"></div>
                        <div class="embed-point" style="position: absolute; left: 120px; top: 60px; width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 15px #3b82f6;"></div>
                        <div class="embed-point" style="position: absolute; left: 190px; top: 85px; width: 12px; height: 12px; background: #f59e0b; border-radius: 50%; box-shadow: 0 0 15px #f59e0b;"></div>
                        <div class="embed-point" style="position: absolute; left: 90px; top: 105px; width: 12px; height: 12px; background: #ec4899; border-radius: 50%; box-shadow: 0 0 15px #ec4899;"></div>
                        <div class="embed-point" style="position: absolute; left: 160px; top: 45px; width: 12px; height: 12px; background: #8b5cf6; border-radius: 50%; box-shadow: 0 0 15px #8b5cf6;"></div>
                        
                        <div style="position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 14px; color: var(--primary); font-weight: 700; font-family: 'JetBrains Mono', monospace;">
                            2 Dimensions
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="dimensionExplosion" style="position: relative; opacity: 0; padding: 0 15px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 20px; color: var(--secondary); font-weight: 700; text-shadow: 0 0 15px rgba(168, 85, 247, 0.5);">
                        REAL LLM DIMENSIONS
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 350px;">
                    <!-- Your Model (tiny) -->
                    <div style="text-align: center;">
                        <div id="yourDims" style="width: 28px; height: 28px; background: linear-gradient(135deg, var(--primary), var(--secondary)); margin: 0 auto 10px auto; border-radius: 4px; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.6); position: relative;">
                            <div style="position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: 700; color: var(--primary); white-space: nowrap;">2D</div>
                        </div>
                        <div style="font-size: 11px; color: var(--text-secondary);">Your Model</div>
                    </div>
                    
                    <!-- GPT-2 -->
                    <div style="text-align: center;" class="dimension-bar" data-model="gpt2">
                        <div style="width: 60px; height: 0; background: linear-gradient(180deg, #8b5cf6, #6b46c1); margin: 0 auto 10px auto; position: relative; transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 6px 6px 0 0; box-shadow: 0 4px 30px rgba(139, 92, 246, 0.6);">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: 700; color: #8b5cf6; white-space: nowrap; opacity: 0;" class="dim-label">768D</div>
                        </div>
                        <div style="font-size: 11px; color: #8b5cf6; font-weight: 600;">GPT-2</div>
                    </div>
                    
                    <!-- GPT-3 -->
                    <div style="text-align: center;" class="dimension-bar" data-model="gpt3">
                        <div style="width: 75px; height: 0; background: linear-gradient(180deg, #ec4899, #db2777); margin: 0 auto 10px auto; position: relative; transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 6px 6px 0 0; box-shadow: 0 6px 35px rgba(236, 72, 153, 0.7);">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: 700; color: #ec4899; white-space: nowrap; opacity: 0;" class="dim-label">12,288D</div>
                        </div>
                        <div style="font-size: 12px; color: #ec4899; font-weight: 600;">GPT-3</div>
                    </div>
                    
                    <!-- GPT-4 -->
                    <div style="text-align: center;" class="dimension-bar" data-model="gpt4">
                        <div style="width: 90px; height: 0; background: linear-gradient(180deg, #f59e0b, #ef4444); margin: 0 auto 10px auto; position: relative; transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 6px 6px 0 0; box-shadow: 0 8px 40px rgba(245, 158, 11, 0.8);">
                            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 15px; font-weight: 700; color: #f59e0b; white-space: nowrap; opacity: 0;" class="dim-label">~18,000D</div>
                        </div>
                        <div style="font-size: 13px; color: #f59e0b; font-weight: 700;">GPT-4</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; text-align: center; font-size: 12px; color: var(--text-secondary); opacity: 0; padding: 12px; background: rgba(251, 191, 36, 0.1); border: 2px solid rgba(251, 191, 36, 0.3); border-radius: 10px;" id="dimensionNote">
                    💡 <strong style="color: #fbbf24;">Each dimension</strong> captures different patterns: grammar, meaning, context, style, sentiment, and thousands more!
                </div>
            </div>
        `;
        
        // Animate embedding points pulsing
        gsap.to('.embed-point', {
            scale: 1.6,
            duration: 0.7,
            repeat: 2,
            yoyo: true,
            stagger: 0.12,
            ease: 'sine.inOut',
            onComplete: () => {
                // Shrink and COMPLETELY HIDE entire user section
                setTimeout(() => {
                    gsap.to('#userSection', {
                        scale: 0.1,
                        y: -100,
                        opacity: 0,
                        height: 0,
                        marginBottom: 0,
                        duration: 0.4,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            // Completely remove from layout
                            document.getElementById('userSection').style.display = 'none';
                        }
                    });
                    
                    // Show dimension explosion and move it UP to fill the space
                    gsap.to('#dimensionExplosion', {
                        opacity: 1,
                        y: -100,
                        duration: 0.6,
                        delay: 0.4,
                        onComplete: () => {
                            // Animate bars growing - now with more room!
                            const bars = document.querySelectorAll('.dimension-bar');
                            const heightValues = [80, 140, 180]; // Taller bars since 2D is gone!
                            
                            bars.forEach((bar, i) => {
                                const barElement = bar.querySelector('div');
                                const label = bar.querySelector('.dim-label');
                                
                                setTimeout(() => {
                                    barElement.style.height = heightValues[i] + 'px';
                                    
                                    // Pulse effect during growth
                                    gsap.to(barElement, {
                                        boxShadow: `0 ${8 + i * 4}px ${40 + i * 20}px rgba(245, 158, 11, ${0.8 + i * 0.1})`,
                                        duration: 0.5,
                                        repeat: -1,
                                        yoyo: true,
                                        delay: 0.5
                                    });
                                    
                                    gsap.to(label, {
                                        opacity: 1,
                                        y: -8,
                                        duration: 0.6,
                                        delay: 0.6,
                                        ease: 'back.out(2)'
                                    });
                                }, i * 350);
                            });
                            
                            gsap.to('#dimensionNote', {
                                opacity: 1,
                                y: -8,
                                duration: 0.7,
                                delay: 1.8,
                                ease: 'power2.out'
                            });
                        }
                    });
                }, 533);
            }
        });
    },
    
    // ATTENTION: Multi-head attention visualization showing massive scale
    animateAttentionComparison() {
        const container = document.getElementById('attentionScaleAnimation');
        if (!container) return;
        
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 24px; color: var(--primary); font-weight: 700; margin-bottom: 25px; text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);">
                    YOUR SINGLE-HEAD ATTENTION
                </div>
                <canvas id="yourAttentionCanvas" width="400" height="200" style="border: 3px solid rgba(0, 212, 255, 0.4); border-radius: 12px; background: rgba(0, 0, 0, 0.3); box-shadow: 0 8px 30px rgba(0, 212, 255, 0.3);"></canvas>
                <div style="margin-top: 15px; font-size: 14px; color: var(--text-secondary);">
                    Simple single-head attention across ~5 tokens
                </div>
            </div>
            
            <div id="multiHeadViz" style="opacity: 0; margin-top: 50px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 22px; color: var(--secondary); font-weight: 700; text-shadow: 0 0 15px rgba(168, 85, 247, 0.5);">
                        GPT-3: MULTI-HEAD ATTENTION
                    </div>
                    <div style="font-size: 14px; color: var(--text-secondary); margin-top: 10px;">
                        <strong style="color: #ec4899;">96 attention heads</strong> × <strong style="color: #f59e0b;">96 layers</strong> = 
                        <strong style="color: #22c55e; font-size: 16px;">9,216 parallel attention mechanisms!</strong>
                    </div>
                </div>
                
                <div id="attentionHeadGrid" style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 8px; max-width: 650px; margin: 0 auto 30px auto;">
                    ${Array(96).fill(0).map((_, i) => `
                        <div class="attention-head" data-index="${i}" style="
                            width: 45px; 
                            height: 45px; 
                            background: linear-gradient(135deg, #ec4899, #8b5cf6); 
                            border-radius: 10px;
                            opacity: 0;
                            transform: scale(0) rotate(-180deg);
                            box-shadow: 0 3px 12px rgba(236, 72, 153, 0.5);
                            position: relative;
                            overflow: hidden;
                        ">
                            <div class="shimmer" style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%); 
                                       transform: translateX(-100%);"></div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 30px; padding: 24px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.08)); border: 3px solid rgba(239, 68, 68, 0.4); border-radius: 12px; opacity: 0;" id="attentionNote">
                    <div style="font-size: 15px; color: var(--text-secondary); line-height: 1.8; text-align: center;">
                        <div style="font-size: 18px; color: #ef4444; font-weight: 700; margin-bottom: 12px;">Each Head Learns Different Patterns</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 16px;">
                            ${['Grammar', 'Syntax', 'Semantics', 'Context', 'Coreference', 'Dependencies', 'Style', 'Tone'].map(pattern => `
                                <span style="background: rgba(239, 68, 68, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 13px; color: white; border: 2px solid rgba(239, 68, 68, 0.4);">${pattern}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Draw simple attention connections on canvas
        const canvas = document.getElementById('yourAttentionCanvas');
        const ctx = canvas.getContext('2d');
        const tokens = ['The', 'cat', 'sat', 'on', 'mat'];
        const tokenRadius = 20;
        const startX = 80;
        const spacing = 60;
        const y = 100;
        
        // Draw tokens as circles
        tokens.forEach((token, i) => {
            const x = startX + i * spacing;
            
            ctx.beginPath();
            ctx.arc(x, y, tokenRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
            ctx.fill();
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(token, x, y);
        });
        
        // Animate attention connections appearing
        let connectionIndex = 0;
        const totalConnections = tokens.length * (tokens.length - 1);
        
        const drawNextConnection = () => {
            if (connectionIndex >= totalConnections) {
                // All connections drawn, show multi-head viz
                setTimeout(showMultiHead, 1000);
                return;
            }
            
            const i = Math.floor(connectionIndex / (tokens.length - 1));
            const rawJ = connectionIndex % (tokens.length - 1);
            const j = rawJ >= i ? rawJ + 1 : rawJ;
            
            const x1 = startX + i * spacing;
            const x2 = startX + j * spacing;
            
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            
            const gradient = ctx.createLinearGradient(x1, y, x2, y);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(168, 85, 247, 0.4)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            connectionIndex++;
            setTimeout(drawNextConnection, 50);
        };
        
        setTimeout(drawNextConnection, 800);
        
        const showMultiHead = () => {
            gsap.to('#multiHeadViz', {
                opacity: 1,
                duration: 0.6
            });
            
            // Animate attention heads appearing in waves
            const heads = document.querySelectorAll('.attention-head');
            gsap.to(heads, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.5,
                stagger: {
                    amount: 2.5,
                    from: 'center',
                    grid: [8, 12]
                },
                ease: 'back.out(1.7)',
                onComplete: () => {
                    // Random shimmer effects
                    const shimmerInterval = setInterval(() => {
                        const randomHeads = Array.from(heads)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 5);
                        
                        randomHeads.forEach(head => {
                            const shimmer = head.querySelector('.shimmer');
                            gsap.fromTo(shimmer, 
                                { x: '-100%' },
                                { x: '100%', duration: 0.6, ease: 'power2.inOut' }
                            );
                        });
                    }, 300);
                    
                    gsap.to('#attentionNote', {
                        opacity: 1,
                        y: -10,
                        duration: 0.7,
                        delay: 1,
                        ease: 'power2.out'
                    });
                }
            });
        };
    },
    
    // TRAINING: Parameter count explosion showing scale
    animateParameterComparison(userPatterns) {
        const container = document.getElementById('parameterScaleAnimation');
        if (!container) return;
        
        const paramCount = Math.max(10, userPatterns || 50);
        
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 50px;">
                <div style="font-size: 24px; color: var(--primary); font-weight: 700; margin-bottom: 25px; text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);">
                    YOUR MODEL PARAMETERS
                </div>
                <div id="userParams" style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; max-width: 500px; margin: 0 auto 20px auto;">
                    ${Array(Math.min(paramCount, 120)).fill(0).map((_, i) => `
                        <div class="param-dot" style="width: 10px; height: 10px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 50%; opacity: 0; transform: scale(0); box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);"></div>
                    `).join('')}
                </div>
                <div style="margin-top: 20px; font-size: 22px; color: var(--primary); font-weight: 700; font-family: 'JetBrains Mono', monospace; text-shadow: 0 0 15px rgba(0, 212, 255, 0.6);">
                    ${paramCount.toLocaleString()} parameters
                </div>
            </div>
            
            <div id="modelComparison" style="opacity: 0; margin-top: 50px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="font-size: 22px; color: var(--secondary); font-weight: 700; text-shadow: 0 0 15px rgba(168, 85, 247, 0.5);">
                        REAL LLM PARAMETERS
                    </div>
                    <div style="font-size: 14px; color: var(--text-secondary); margin-top: 8px;">
                        The gulf between your mini-model and production systems
                    </div>
                </div>
                
                <div style="position: relative; height: 340px; background: rgba(0, 0, 0, 0.2); border-radius: 16px; padding: 20px; border: 2px solid rgba(255, 255, 255, 0.1);">
                    <!-- Your Model (microscopic dot) -->
                    <div style="position: absolute; left: 8%; bottom: 30px; text-align: center;">
                        <div style="width: 4px; height: 4px; background: var(--primary); margin: 0 auto 12px auto; border-radius: 50%; box-shadow: 0 0 10px var(--primary);"></div>
                        <div style="font-size: 11px; color: var(--primary); font-weight: 700; white-space: nowrap;">You</div>
                        <div style="font-size: 10px; color: var(--text-secondary); white-space: nowrap;">${paramCount}</div>
                    </div>
                    
                    <!-- GPT-2: Small -->
                    <div class="param-explosion" data-model="gpt2" style="position: absolute; left: 22%; bottom: 30px; text-align: center; opacity: 0;">
                        <div style="width: 50px; height: 50px; background: radial-gradient(circle, #8b5cf6, #6b46c1); margin: 0 auto 12px auto; border-radius: 50%; box-shadow: 0 0 25px rgba(139, 92, 246, 0.8);"></div>
                        <div style="font-size: 13px; color: #8b5cf6; font-weight: 700; white-space: nowrap;">GPT-2</div>
                        <div style="font-size: 12px; color: var(--text-secondary); white-space: nowrap;">1.5 Billion</div>
                    </div>
                    
                    <!-- GPT-3: Medium -->
                    <div class="param-explosion" data-model="gpt3" style="position: absolute; left: 45%; transform: translateX(-50%); bottom: 30px; text-align: center; opacity: 0;">
                        <div style="width: 140px; height: 140px; background: radial-gradient(circle, #ec4899, #db2777); margin: 0 auto 12px auto; border-radius: 50%; box-shadow: 0 0 40px rgba(236, 72, 153, 1), 0 0 80px rgba(236, 72, 153, 0.5);"></div>
                        <div style="font-size: 16px; color: #ec4899; font-weight: 700; white-space: nowrap;">GPT-3</div>
                        <div style="font-size: 13px; color: var(--text-secondary); white-space: nowrap;">175 Billion</div>
                    </div>
                    
                    <!-- GPT-4: MASSIVE -->
                    <div class="param-explosion" data-model="gpt4" style="position: absolute; right: 5%; bottom: 30px; text-align: center; opacity: 0;">
                        <div style="width: 220px; height: 220px; background: radial-gradient(circle at center, #f59e0b, #ef4444, #dc2626); margin: 0 auto 12px auto; border-radius: 50%; box-shadow: 0 0 60px rgba(245, 158, 11, 1), 0 0 120px rgba(245, 158, 11, 0.7), 0 0 180px rgba(245, 158, 11, 0.4);"></div>
                        <div style="font-size: 18px; color: #f59e0b; font-weight: 700; white-space: nowrap;">GPT-4</div>
                        <div style="font-size: 14px; color: var(--text-secondary); white-space: nowrap;">~1.76 Trillion</div>
                    </div>
                </div>
                
                <div style="margin-top: 35px; padding: 24px; background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(34, 197, 94, 0.08)); border: 3px solid rgba(251, 191, 36, 0.4); border-radius: 12px; opacity: 0;" id="paramNote">
                    <div style="font-size: 15px; color: var(--text-secondary); text-align: center; line-height: 1.9;">
                        💡 <strong style="color: #fbbf24; font-size: 17px;">1.76 TRILLION parameters</strong> means GPT-4 stores 
                        <strong style="color: #22c55e;">${(1760000000000 / paramCount).toLocaleString(undefined, {maximumFractionDigits: 0})}&times;</strong> 
                        more relationships than your model!<br>
                        <span style="font-size: 13px; opacity: 0.8;">Every pattern, correlation, and statistical relationship learned from the entire internet.</span>
                    </div>
                </div>
            </div>
        `;
        
        // Animate user parameters appearing in a burst
        const dots = document.querySelectorAll('.param-dot');
        gsap.to(dots, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: {
                amount: 1.2,
                from: 'center',
                grid: 'auto'
            },
            ease: 'back.out(2)',
            onComplete: () => {
                // Pulse all dots together
                gsap.to(dots, {
                    scale: 1.2,
                    duration: 0.3,
                    repeat: 2,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
                
                // Shrink user params after display
                setTimeout(() => {
                    gsap.to('#userParams', {
                        scale: 0.15,
                        y: -60,
                        opacity: 0.3,
                        duration: 1.3,
                        ease: 'power2.inOut'
                    });
                    
                    // Show model comparison
                    gsap.to('#modelComparison', {
                        opacity: 1,
                        duration: 0.6,
                        delay: 0.4
                    });
                    
                    // Explode models into view with dramatic effect
                    const explosions = document.querySelectorAll('.param-explosion');
                    explosions.forEach((exp, i) => {
                        setTimeout(() => {
                            gsap.fromTo(exp,
                                { scale: 0, opacity: 0, rotation: -90 },
                                { 
                                    scale: 1, 
                                    opacity: 1,
                                    rotation: 0,
                                    duration: 1,
                                    ease: 'elastic.out(1, 0.5)'
                                }
                            );
                            
                            // Continuous pulsing glow
                            const circle = exp.querySelector('div');
                            gsap.to(circle, {
                                scale: 1.08,
                                duration: 1.5,
                                repeat: -1,
                                yoyo: true,
                                ease: 'sine.inOut',
                                delay: 0.5
                            });
                        }, i * 500 + 800);
                    });
                    
                    gsap.to('#paramNote', {
                        opacity: 1,
                        y: -10,
                        duration: 0.8,
                        delay: 2.5,
                        ease: 'power2.out'
                    });
                }, 2500);
            }
        });
    },
    
    // GENERATION: Context window size comparison
    animateContextComparison(userSequenceLength) {
        const container = document.getElementById('contextScaleAnimation');
        if (!container) return;
        
        const seqLength = Math.max(5, userSequenceLength || 10);
        
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 50px;">
                <div style="font-size: 24px; color: var(--primary); font-weight: 700; margin-bottom: 25px; text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);">
                    YOUR CONTEXT WINDOW
                </div>
                <div id="userContext" style="display: flex; gap: 8px; justify-content: center; align-items: center; flex-wrap: wrap; max-width: 600px; margin: 0 auto;">
                    ${Array(Math.min(seqLength, 15)).fill(0).map((_, i) => `
                        <div class="context-token" style="
                            width: 50px; 
                            height: 50px; 
                            background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            font-weight: 700;
                            color: white;
                            opacity: 0;
                            transform: scale(0);
                            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.5);
                        ">${i + 1}</div>
                    `).join('')}
                </div>
                <div style="margin-top: 20px; font-size: 18px; color: var(--primary); font-weight: 700; font-family: 'JetBrains Mono', monospace;">
                    ${seqLength} tokens context
                </div>
            </div>
            
            <div id="contextComparison" style="opacity: 0; margin-top: 50px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="font-size: 22px; color: var(--secondary); font-weight: 700; text-shadow: 0 0 15px rgba(168, 85, 247, 0.5);">
                        REAL LLM CONTEXT WINDOWS
                    </div>
                    <div style="font-size: 14px; color: var(--text-secondary); margin-top: 8px;">
                        How much text can they "remember" at once
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 300px;">
                    <!-- Your Model -->
                    <div style="text-align: center;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary), var(--secondary)); margin: 0 auto 15px auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.6);"></div>
                        <div style="font-size: 12px; color: var(--primary); font-weight: 700;">You</div>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${seqLength}</div>
                    </div>
                    
                    <!-- GPT-3 -->
                    <div class="context-bar" data-model="gpt3" style="text-align: center; opacity: 0;">
                        <div style="width: 80px; height: 0; background: linear-gradient(180deg, #8b5cf6, #6b46c1); margin: 0 auto 15px auto; border-radius: 8px 8px 0 0; transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 4px 30px rgba(139, 92, 246, 0.7);"></div>
                        <div style="font-size: 13px; color: #8b5cf6; font-weight: 700;">GPT-3</div>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">2,048 tokens</div>
                    </div>
                    
                    <!-- GPT-3.5 -->
                    <div class="context-bar" data-model="gpt35" style="text-align: center; opacity: 0;">
                        <div style="width: 100px; height: 0; background: linear-gradient(180deg, #ec4899, #db2777); margin: 0 auto 15px auto; border-radius: 8px 8px 0 0; transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 6px 35px rgba(236, 72, 153, 0.8);"></div>
                        <div style="font-size: 14px; color: #ec4899; font-weight: 700;">GPT-3.5</div>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">16,385 tokens</div>
                    </div>
                    
                    <!-- GPT-4 -->
                    <div class="context-bar" data-model="gpt4" style="text-align: center; opacity: 0;">
                        <div style="width: 120px; height: 0; background: linear-gradient(180deg, #f59e0b, #ef4444); margin: 0 auto 15px auto; border-radius: 8px 8px 0 0; transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 8px 40px rgba(245, 158, 11, 0.9);"></div>
                        <div style="font-size: 15px; color: #f59e0b; font-weight: 700;">GPT-4</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">128,000 tokens</div>
                    </div>
                    
                    <!-- Claude 3 -->
                    <div class="context-bar" data-model="claude" style="text-align: center; opacity: 0;">
                        <div style="width: 140px; height: 0; background: linear-gradient(180deg, #22c55e, #16a34a); margin: 0 auto 15px auto; border-radius: 8px 8px 0 0; transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 10px 50px rgba(34, 197, 94, 1);"></div>
                        <div style="font-size: 16px; color: #22c55e; font-weight: 700;">Claude 3</div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">200,000 tokens</div>
                    </div>
                </div>
                
                <div style="margin-top: 40px; padding: 24px; background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(20, 184, 166, 0.08)); border: 3px solid rgba(34, 197, 94, 0.4); border-radius: 12px; opacity: 0;" id="contextNote">
                    <div style="font-size: 15px; color: var(--text-secondary); text-align: center; line-height: 1.9;">
                        💡 <strong style="color: #22c55e; font-size: 17px;">200,000 tokens</strong> is roughly 
                        <strong style="color: #14b8a6;">${(200000 / seqLength).toLocaleString(undefined, {maximumFractionDigits: 0})}&times;</strong> 
                        your context window!<br>
                        <span style="font-size: 13px; opacity: 0.8;">That's about 150,000 words - an entire novel that the model can "see" and reason about simultaneously!</span>
                    </div>
                </div>
            </div>
        `;
        
        // Animate user context tokens appearing
        const tokens = document.querySelectorAll('.context-token');
        gsap.to(tokens, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: 'back.out(2)',
            onComplete: () => {
                // Pulse effect
                gsap.to(tokens, {
                    scale: 1.1,
                    duration: 0.4,
                    repeat: 2,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
                
                // Shrink and show comparison
                setTimeout(() => {
                    gsap.to('#userContext', {
                        scale: 0.3,
                        y: -50,
                        opacity: 0.4,
                        duration: 1.2,
                        ease: 'power2.inOut'
                    });
                    
                    gsap.to('#contextComparison', {
                        opacity: 1,
                        duration: 0.6,
                        delay: 0.5,
                        onComplete: () => {
                            // Animate bars growing
                            const bars = document.querySelectorAll('.context-bar');
                            const heights = [80, 140, 200, 250]; // Heights for each model
                            
                            bars.forEach((bar, i) => {
                                const barElement = bar.querySelector('div');
                                
                                setTimeout(() => {
                                    gsap.to(bar, {
                                        opacity: 1,
                                        duration: 0.5
                                    });
                                    
                                    barElement.style.height = heights[i] + 'px';
                                    
                                    // Pulsing glow
                                    gsap.to(barElement, {
                                        boxShadow: `0 ${8 + i * 2}px ${40 + i * 10}px rgba(34, 197, 94, ${0.7 + i * 0.1})`,
                                        duration: 1,
                                        repeat: -1,
                                        yoyo: true,
                                        delay: 0.5
                                    });
                                }, i * 350 + 500);
                            });
                            
                            gsap.to('#contextNote', {
                                opacity: 1,
                                y: -10,
                                duration: 0.8,
                                delay: 2.5,
                                ease: 'power2.out'
                            });
                        }
                    });
                }, 2200);
            }
        });
    }
};

