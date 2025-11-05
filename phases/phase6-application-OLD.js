// Phase 6: Practical Applications - Put Your Skills to Work
window.phase6 = {
    currentChallenge: 0,
    score: 0,
    stars: 0,
    
    challenges: [
        {
            title: 'Text Summarization',
            description: 'Summarize this paragraph in one sentence',
            input: 'Artificial intelligence has transformed numerous industries over the past decade. From healthcare to finance, AI systems are helping professionals make better decisions, automate repetitive tasks, and discover new insights. Machine learning algorithms can now analyze vast amounts of data in seconds, identifying patterns that would take humans years to find.',
            options: [
                'AI has changed many industries by helping with decisions, automation, and data analysis.',
                'Computers are now very smart and can do many things quickly.',
                'Machine learning is the future of all business.',
                'Healthcare and finance use AI systems every day.'
            ],
            correctIndex: 0,
            explanation: 'A good summary captures the main points: AI transformation, multiple industries, and key benefits.'
        },
        {
            title: 'Sentiment Analysis',
            description: 'What is the overall sentiment of this review?',
            input: 'The product arrived quickly and the packaging was nice, but unfortunately it stopped working after just two days. Customer service was helpful though.',
            options: ['Positive', 'Negative', 'Mixed/Neutral'],
            correctIndex: 2,
            explanation: 'The review has both positive (delivery, packaging, service) and negative (product broke) elements - mixed sentiment.'
        },
        {
            title: 'Question Answering',
            description: 'Answer the question based on the context',
            input: 'Context: The Amazon Rainforest produces about 20% of the world\'s oxygen and is home to 10% of all species on Earth. It spans 9 countries in South America.\n\nQuestion: How many countries does the Amazon Rainforest span?',
            options: ['7 countries', '9 countries', '10 countries', '20 countries'],
            correctIndex: 1,
            explanation: 'The context explicitly states "It spans 9 countries in South America."'
        },
        {
            title: 'Text Completion',
            description: 'Complete this code comment logically',
            input: 'def calculate_average(numbers):\n    # This function takes a list of numbers and returns',
            options: [
                'the sum of all numbers',
                'the average (mean) of all numbers',
                'the largest number in the list',
                'a new list with doubled values'
            ],
            correctIndex: 1,
            explanation: 'The function name "calculate_average" clearly indicates it should return the average.'
        },
        {
            title: 'Translation Understanding',
            description: 'Which translation best preserves the meaning?',
            input: 'Original (English): "It\'s raining cats and dogs."\n\nWhich captures the meaning for a non-English speaker?',
            options: [
                'Animals are falling from the sky',
                'It is raining very heavily',
                'Cats and dogs are getting wet',
                'The weather involves pets'
            ],
            correctIndex: 1,
            explanation: '"Raining cats and dogs" is an idiom meaning heavy rain, not literal animals falling.'
        }
    ],
    
    render(container) {
        Game.setHint(`
            <strong>Real-World Applications:</strong><br><br>
            Time to put everything together! You'll tackle real AI tasks: summarization, sentiment 
            analysis, question answering, and more. Use all the skills you've learned. 
            Earn stars for each challenge! ⭐
        `);
        
        this.currentChallenge = 0;
        this.score = 0;
        this.stars = 0;
        
        container.innerHTML = `
            <div class="phase">
                <h1 class="phase-title">🚀 Deployment: Real-World Challenges</h1>
                <p class="phase-subtitle">Your training is complete - time to serve users!</p>
                
                <div class="phase-description">
                    Congratulations! You've learned tokenization, embeddings, attention, prediction, and training. 
                    Now it's time to <strong>deploy</strong> and handle real-world tasks. Show what you've learned!
                </div>
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <span style="color: var(--text-secondary);">Challenge:</span>
                            <span id="challengeCounter" class="glow-text" style="font-size: 20px; margin-left: 10px;">
                                1 / ${this.challenges.length}
                            </span>
                        </div>
                        <div>
                            <span style="color: var(--text-secondary);">Stars:</span>
                            <span id="starDisplay" style="font-size: 24px; margin-left: 10px;">
                                ${'⭐'.repeat(0)}
                            </span>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(255,0,255,0.1)); 
                         padding: 20px; border-radius: 15px; border: 2px solid rgba(0,212,255,0.3); margin-bottom: 30px;">
                        <h3 id="challengeTitle" style="color: var(--primary); margin-bottom: 10px;"></h3>
                        <p id="challengeDescription" style="color: var(--text-secondary); margin-bottom: 20px;"></p>
                        
                        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; 
                             border-left: 3px solid var(--accent); margin-bottom: 20px;">
                            <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 10px;">
                                INPUT:
                            </div>
                            <div id="challengeInput" style="color: white; font-size: 16px; line-height: 1.8; 
                                 white-space: pre-wrap; font-family: 'JetBrains Mono', monospace;">
                            </div>
                        </div>
                        
                        <div id="optionsContainer" style="display: flex; flex-direction: column; gap: 12px;">
                        </div>
                    </div>
                    
                    <div id="feedback" style="margin-top: 20px; text-align: center; min-height: 30px;"></div>
                </div>
                
                <div class="card mt-3">
                    <h4 style="color: var(--primary);">📚 Real-World AI Applications:</h4>
                    <ul style="color: var(--text-secondary); line-height: 2; margin-top: 15px;">
                        <li><strong>Text Summarization</strong>: Condensing long documents into key points</li>
                        <li><strong>Sentiment Analysis</strong>: Understanding emotions in text (reviews, social media)</li>
                        <li><strong>Question Answering</strong>: Finding answers in large documents</li>
                        <li><strong>Translation</strong>: Converting text between languages</li>
                        <li><strong>Code Completion</strong>: Helping developers write code faster</li>
                        <li><strong>Content Generation</strong>: Creating articles, emails, stories</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.displayChallenge();
    },
    
    displayChallenge() {
        const challenge = this.challenges[this.currentChallenge];
        
        document.getElementById('challengeCounter').textContent = 
            `${this.currentChallenge + 1} / ${this.challenges.length}`;
        document.getElementById('challengeTitle').textContent = challenge.title;
        document.getElementById('challengeDescription').textContent = challenge.description;
        document.getElementById('challengeInput').textContent = challenge.input;
        document.getElementById('feedback').innerHTML = '';
        
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        challenge.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn-secondary';
            btn.textContent = option;
            btn.style.cssText = `
                width: 100%;
                text-align: left;
                padding: 15px 20px;
                font-size: 16px;
                transition: all 0.3s ease;
            `;
            btn.onmouseenter = () => {
                btn.style.background = 'rgba(0, 212, 255, 0.2)';
                btn.style.borderColor = 'var(--primary)';
                btn.style.transform = 'translateX(5px)';
            };
            btn.onmouseleave = () => {
                btn.style.background = 'rgba(255, 255, 255, 0.05)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                btn.style.transform = 'translateX(0)';
            };
            btn.onclick = () => this.checkAnswer(index, challenge);
            container.appendChild(btn);
            
            // Animate entrance
            gsap.from(btn, {
                opacity: 0,
                x: -30,
                duration: 0.4,
                delay: index * 0.1,
                ease: 'back.out(1.2)'
            });
        });
    },
    
    checkAnswer(selectedIndex, challenge) {
        const correct = selectedIndex === challenge.correctIndex;
        const feedback = document.getElementById('feedback');
        
        // Disable all buttons
        const buttons = document.querySelectorAll('#optionsContainer button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
            btn.style.opacity = '0.6';
        });
        
        if (correct) {
            this.stars++;
            const points = 250;
            Game.addScore(points);
            this.score += points;
            
            // Update star display
            document.getElementById('starDisplay').textContent = '⭐'.repeat(this.stars);
            
            feedback.innerHTML = `
                <div class="success-message" style="font-size: 20px;">
                    ⭐ Excellent! +${points} points<br>
                    <small style="color: var(--text-secondary); font-size: 14px;">
                        ${challenge.explanation}
                    </small>
                </div>
            `;
            SoundManager.play('success');
            
            // Animate star
            gsap.from('#starDisplay', {
                scale: 1.5,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
            
        } else {
            feedback.innerHTML = `
                <div class="error-message" style="font-size: 18px;">
                    ✗ Not quite right.<br>
                    <small style="color: var(--text-secondary); font-size: 14px;">
                        Correct answer: ${challenge.options[challenge.correctIndex]}<br>
                        ${challenge.explanation}
                    </small>
                </div>
            `;
            SoundManager.play('error');
        }
        
        // Move to next challenge or complete phase
        setTimeout(() => {
            if (this.currentChallenge < this.challenges.length - 1) {
                this.currentChallenge++;
                this.displayChallenge();
            } else {
                this.completePhase();
            }
        }, 4000);
    },
    
    completePhase() {
        const successRate = (this.stars / this.challenges.length) * 100;
        let message = '';
        
        if (successRate === 100) {
            message = `🏆 Perfect score! You earned all ${this.stars} stars! You're a fully functional AI now!`;
        } else if (successRate >= 80) {
            message = `🌟 Excellent work! ${this.stars}/${this.challenges.length} stars. You're deployment-ready!`;
        } else if (successRate >= 60) {
            message = `✓ Good job! ${this.stars}/${this.challenges.length} stars. You completed your journey!`;
        } else {
            message = `You finished the journey with ${this.stars}/${this.challenges.length} stars. Every AI learns at its own pace!`;
        }
        
        Game.completePhase(this.score, message);
    }
};

