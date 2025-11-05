// Phase 5: Training - Learning from Feedback
window.phase5 = {
    accuracy: 50, // Start at 50%
    epoch: 0,
    maxEpochs: 10,
    score: 0,
    trainingData: [],
    
    examples: [
        {
            type: 'sentiment',
            text: 'This movie was absolutely amazing!',
            options: ['Positive', 'Negative', 'Neutral'],
            correct: 'Positive',
            explanation: 'Words like "amazing" indicate positive sentiment'
        },
        {
            type: 'sentiment',
            text: 'I had a terrible experience with this product.',
            options: ['Positive', 'Negative', 'Neutral'],
            correct: 'Negative',
            explanation: '"Terrible" is a strong negative word'
        },
        {
            type: 'grammar',
            text: 'She ____ to the store yesterday.',
            options: ['go', 'went', 'going'],
            correct: 'went',
            explanation: '"Yesterday" requires past tense'
        },
        {
            type: 'logic',
            text: 'If it rains, the ground gets ____.',
            options: ['dry', 'wet', 'warm'],
            correct: 'wet',
            explanation: 'Rain causes wetness - basic logical relationship'
        },
        {
            type: 'completion',
            text: 'The capital of France is ____.',
            options: ['London', 'Berlin', 'Paris'],
            correct: 'Paris',
            explanation: 'Factual knowledge: Paris is the capital of France'
        },
        {
            type: 'sentiment',
            text: 'The weather is okay, I guess.',
            options: ['Positive', 'Negative', 'Neutral'],
            correct: 'Neutral',
            explanation: '"Okay" and "I guess" show mild, neutral sentiment'
        },
        {
            type: 'logic',
            text: 'The sun rises in the ____.',
            options: ['west', 'east', 'south'],
            correct: 'east',
            explanation: 'The sun rises in the east - common knowledge'
        },
        {
            type: 'grammar',
            text: 'They ____ playing soccer right now.',
            options: ['is', 'are', 'was'],
            correct: 'are',
            explanation: '"They" + present continuous requires "are"'
        },
        {
            type: 'completion',
            text: '2 + 2 equals ____.',
            options: ['3', '4', '5'],
            correct: '4',
            explanation: 'Basic arithmetic: 2 + 2 = 4'
        },
        {
            type: 'sentiment',
            text: 'This is the worst day of my life!',
            options: ['Positive', 'Negative', 'Neutral'],
            correct: 'Negative',
            explanation: '"Worst" is a superlative negative'
        }
    ],
    
    render(container) {
        Game.setHint(`
            <strong>Training Process:</strong><br><br>
            Every AI learns through training! You'll see examples and try to get them right. 
            Each correct answer improves your "accuracy". Watch your loss function decrease as 
            you get better. Make mistakes? That's okay - they help you learn! 🎓
        `);
        
        this.accuracy = 50;
        this.epoch = 0;
        this.score = 0;
        this.trainingData = [];
        
        container.innerHTML = `
            <div class="phase">
                <h1 class="phase-title">🎓 Training: Learning from Experience</h1>
                <p class="phase-subtitle">Every AI needs training - time to learn from examples!</p>
                
                <div class="phase-description">
                    You've learned the mechanics, but now you need <strong>training</strong>! 
                    Real AI models train on millions of examples, adjusting their internal weights 
                    to minimize errors. You'll train on a small dataset and watch your accuracy improve!
                </div>
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 30px;">
                        <div class="stat">
                            <div class="stat-label">Epoch</div>
                            <div class="stat-value" id="epochValue" style="color: var(--primary);">0 / ${this.maxEpochs}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Accuracy</div>
                            <div class="stat-value" id="accuracyValue" style="color: var(--success);">50%</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Loss</div>
                            <div class="stat-value" id="lossValue" style="color: var(--error);">1.00</div>
                        </div>
                    </div>
                    
                    <!-- Loss Curve Graph -->
                    <div style="margin-bottom: 30px;">
                        <h4 style="color: var(--text-secondary); margin-bottom: 10px;">📉 Loss Curve</h4>
                        <canvas id="lossCanvas" width="700" height="150" 
                                style="width: 100%; height: auto; border: 1px solid rgba(255,255,255,0.1); 
                                border-radius: 10px; background: rgba(0,0,0,0.3);">
                        </canvas>
                    </div>
                    
                    <!-- Training Example -->
                    <div id="trainingExample" style="padding: 25px; background: rgba(255,255,255,0.05); 
                         border-radius: 15px; border: 2px solid rgba(255,255,255,0.1);">
                        <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 10px;">
                            Training Example:
                        </div>
                        <div id="exampleText" style="font-size: 20px; font-weight: 600; margin-bottom: 25px; 
                             padding: 15px; background: rgba(0,212,255,0.1); border-radius: 10px;">
                        </div>
                        <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 12px;">
                        </div>
                    </div>
                    
                    <div id="feedback" style="margin-top: 20px; text-align: center; min-height: 30px;"></div>
                    
                    <div id="progressMessage" style="margin-top: 20px; padding: 15px; background: rgba(0,255,136,0.1); 
                         border-left: 3px solid var(--success); border-radius: 5px; display: none;">
                    </div>
                </div>
                
                <div class="card mt-3">
                    <h4 style="color: var(--primary);">📚 Training Concepts:</h4>
                    <ul style="color: var(--text-secondary); line-height: 2; margin-top: 15px;">
                        <li><strong>Epoch</strong>: One complete pass through the training dataset</li>
                        <li><strong>Loss</strong>: How "wrong" your predictions are (lower is better)</li>
                        <li><strong>Accuracy</strong>: Percentage of correct predictions (higher is better)</li>
                        <li><strong>Training</strong> adjusts internal weights to reduce loss over time</li>
                        <li>Real models train for days/weeks on powerful GPUs!</li>
                        <li><strong>Overfitting</strong> happens when you memorize instead of learning patterns</li>
                    </ul>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.setupLossCanvas();
            this.showNextExample();
        }, 100);
    },
    
    setupLossCanvas() {
        this.lossCanvas = document.getElementById('lossCanvas');
        if (!this.lossCanvas) return;
        
        this.lossCtx = this.lossCanvas.getContext('2d');
        this.lossHistory = [1.0]; // Start with high loss
        this.drawLossGraph();
    },
    
    drawLossGraph() {
        if (!this.lossCtx) return;
        
        const canvas = this.lossCanvas;
        const ctx = this.lossCtx;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw axes
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(40, 10);
        ctx.lineTo(40, canvas.height - 20);
        ctx.stroke();
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(40, canvas.height - 20);
        ctx.lineTo(canvas.width - 10, canvas.height - 20);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px Inter';
        ctx.fillText('Loss', 5, 15);
        ctx.fillText('Epoch', canvas.width - 35, canvas.height - 5);
        
        // Draw loss curve
        if (this.lossHistory.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 2;
            
            const xScale = (canvas.width - 50) / Math.max(this.maxEpochs, this.lossHistory.length);
            const yScale = (canvas.height - 30);
            
            this.lossHistory.forEach((loss, i) => {
                const x = 40 + i * xScale;
                const y = canvas.height - 20 - (loss * yScale);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Draw points
            this.lossHistory.forEach((loss, i) => {
                const x = 40 + i * xScale;
                const y = canvas.height - 20 - (loss * yScale);
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ff4757';
                ctx.fill();
            });
        }
    },
    
    showNextExample() {
        if (this.epoch >= this.maxEpochs) {
            this.completeTraining();
            return;
        }
        
        const example = this.examples[this.epoch];
        document.getElementById('exampleText').textContent = example.text;
        document.getElementById('epochValue').textContent = `${this.epoch + 1} / ${this.maxEpochs}`;
        document.getElementById('feedback').innerHTML = '';
        
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        example.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'btn-secondary';
            btn.textContent = option;
            btn.style.cssText = `
                width: 100%;
                text-align: left;
                padding: 15px 20px;
                font-size: 16px;
            `;
            btn.onclick = () => this.checkAnswer(option, example);
            container.appendChild(btn);
            
            // Animate entrance
            gsap.from(btn, {
                opacity: 0,
                x: -20,
                duration: 0.3,
                delay: example.options.indexOf(option) * 0.1
            });
        });
    },
    
    checkAnswer(selected, example) {
        const correct = selected === example.correct;
        const feedback = document.getElementById('feedback');
        
        if (correct) {
            // Improve accuracy
            this.accuracy = Math.min(100, this.accuracy + 5);
            const points = 100;
            Game.addScore(points);
            this.score += points;
            
            feedback.innerHTML = `
                <div class="success-message">
                    ✓ Correct! ${example.explanation}<br>
                    <small>Your accuracy increased to ${this.accuracy}%</small>
                </div>
            `;
            SoundManager.play('success');
        } else {
            // Slight decrease in accuracy
            this.accuracy = Math.max(0, this.accuracy - 2);
            
            feedback.innerHTML = `
                <div class="error-message">
                    ✗ Incorrect. The right answer was "${example.correct}".<br>
                    <small>${example.explanation}</small>
                </div>
            `;
            SoundManager.play('error');
        }
        
        // Update stats
        document.getElementById('accuracyValue').textContent = `${this.accuracy}%`;
        
        // Calculate and update loss (inverse of accuracy, roughly)
        const loss = 1 - (this.accuracy / 100);
        this.lossHistory.push(loss);
        document.getElementById('lossValue').textContent = loss.toFixed(2);
        
        this.drawLossGraph();
        
        // Show progress milestone
        if (this.accuracy >= 80 && this.epoch === Math.floor(this.maxEpochs / 2)) {
            document.getElementById('progressMessage').style.display = 'block';
            document.getElementById('progressMessage').innerHTML = 
                '🎉 Great progress! You\'re learning fast. Loss is decreasing!';
        }
        
        // Next epoch
        this.epoch++;
        this.trainingData.push({ example, selected, correct });
        
        setTimeout(() => {
            this.showNextExample();
        }, 2500);
    },
    
    completeTraining() {
        const progressMsg = document.getElementById('progressMessage');
        progressMsg.style.display = 'block';
        
        if (this.accuracy >= 85) {
            progressMsg.innerHTML = `
                <strong>🏆 Excellent Training!</strong><br>
                Final Accuracy: ${this.accuracy}% | Final Loss: ${this.lossHistory[this.lossHistory.length - 1].toFixed(2)}<br>
                You've successfully trained and are ready for deployment!
            `;
            
            setTimeout(() => {
                Game.completePhase(this.score, 
                    `Training complete! Final accuracy: ${this.accuracy}%. You're now a trained AI!`);
            }, 2000);
        } else if (this.accuracy >= 70) {
            progressMsg.innerHTML = `
                <strong>✓ Training Complete</strong><br>
                Final Accuracy: ${this.accuracy}% | Final Loss: ${this.lossHistory[this.lossHistory.length - 1].toFixed(2)}<br>
                Good job! You learned from the examples.
            `;
            
            setTimeout(() => {
                Game.completePhase(this.score, 
                    `Training complete! You've learned the basics. Time for real-world challenges!`);
            }, 2000);
        } else {
            progressMsg.innerHTML = `
                <strong>Training Finished</strong><br>
                Final Accuracy: ${this.accuracy}% | Final Loss: ${this.lossHistory[this.lossHistory.length - 1].toFixed(2)}<br>
                You completed training, but there's room for improvement!
            `;
            
            setTimeout(() => {
                Game.completePhase(Math.max(this.score, 500), 
                    `Training phase complete! Let's see how you perform in the real world.`);
            }, 2000);
        }
    }
};

