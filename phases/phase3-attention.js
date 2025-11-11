// Phase 3: Attention - USER CALCULATES WEIGHTS
window.phase3 = {
    currentStep: 'intro', // 'intro' -> 'examples' -> 'calculate' -> 'recap'
    currentExample: 0,
    sentences: [],
    currentSentence: 0,
    attentionWeights: {},
    
    // Tutorial examples - SIMPLE 3-4 words for learning
    exampleSentences: [
        {
            words: ["chef", "cooked", "pasta"],
            explanation: "Focus: 'cooked'. Set attention to show contextual relationships",
            hints: {
                "chef": "High (0.8-1.0) - WHO performs the action",
                "pasta": "High (0.8-1.0) - WHAT is being acted upon"
            }
        },
        {
            words: ["set", "morning", "alarm"],
            explanation: "Focus: 'alarm'. Notice how some words relate MORE to each other than to the focus",
            hints: {
                "morning": "High (0.8-1.0) - Directly modifies which alarm (strong relationship)",
                "set": "Low (0.2-0.4) - The action is less important than WHAT KIND of alarm"
            }
        },
        {
            words: ["very", "bright", "star"],
            explanation: "Focus: 'bright'. Notice how modifiers create DIFFERENT attention patterns",
            hints: {
                "very": "High (0.8-1.0) - Directly modifies brightness (strong relationship)",
                "star": "Low (0.2-0.4) - 'bright' describes the star, but weak direct attention"
            }
        }
    ],
    
    render(container) {
        if (this.currentStep === 'intro') {
            this.renderIntro(container);
        } else if (this.currentStep === 'examples') {
            this.renderExamples(container);
        } else if (this.currentStep === 'calculate') {
            this.renderCalculate(container);
        } else if (this.currentStep === 'recap') {
            this.renderRecap(container);
        } else if (this.currentStep === 'journey_checkpoint') {
            this.renderJourneyCheckpoint(container);
        }
    },
    
    renderIntro(container) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; overflow-y: auto;">
                <div style="max-width: 750px; width: 100%; text-align: center;">
                    
                    <h1 style="font-size: 28px; margin-bottom: 12px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        🎯 Attention
                    </h1>
                    <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px;">
                        Calculate which tokens matter to each other
                    </p>
                    
                    <!-- What is Attention -->
                    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(191, 0, 255, 0.05)); 
                               border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 16px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">🧮</span>
                            <h3 style="font-size: 16px; color: var(--primary); margin: 0;">What is Attention?</h3>
                        </div>
                        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 8px;">
                            For each token, calculate how much it should "attend to" every other token through <strong>pure math</strong>.
                        </p>
                        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 8px;">
                            Compare embedding vectors: high similarity = high attention weight. "Chef" and "cooked" get high attention because their vectors are similar.
                        </p>
                        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                            You're not "thinking" - you're multiplying matrices! Attention is just <strong>vector similarity</strong> calculations.
                        </p>
                    </div>
                    
                    <!-- How Real LLMs Do It -->
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05)); 
                               border: 2px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: left;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 20px;">🧠</span>
                            <h3 style="font-size: 16px; color: #a855f7; margin: 0;">How Real LLMs Do It</h3>
                        </div>
                        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 8px;">
                            Real LLMs use <strong style="color: #a855f7;">Multi-Head Attention</strong> - running many attention calculations in parallel.
                        </p>
                        <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                            GPT-3 has 96 attention heads working simultaneously! Each captures different relationships (grammar, syntax, meaning), then combines results. This breakthrough from "Attention Is All You Need" (2017) powers all modern LLMs.
                        </p>
                    </div>
                    
                    <button class="btn-primary" onclick="phase3.startCalculating()" 
                            style="font-size: 15px; padding: 12px 36px;">
                        Next →
                    </button>
                    
                </div>
            </div>
        `;
    },
    
    startCalculating() {
        this.currentStep = 'examples';
        this.currentExample = 0;
        SoundManager.play('click');
        this.render(document.getElementById('phaseContainer'));
    },
    
    renderExamples(container) {
        const example = this.exampleSentences[this.currentExample];
        const selectedWord = example.words[1]; // Middle word by default
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Learn attention</h2>
                    </div>
                    
                    <div class="phase-description">
                        ${example.explanation}. High attention = strong relationship!
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 Hints</h4>
                        ${Object.entries(example.hints).map(([word, hint]) => `
                            <p style="font-size: 12px; margin-bottom: 8px;"><strong>"${word}":</strong> ${hint}</p>
                        `).join('')}
                    </div>
                    
                    <div style="padding: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; margin-top: 16px;">
                        <p style="font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.6;">
                            <span style="font-size: 14px;">⚡</span> <strong>Reality check:</strong> This is matrix math - not understanding!
                        </p>
                    </div>
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 600px;">
                        
                        <div style="margin-bottom: 16px; text-align: center;">
                            <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
                                ${this.currentExample + 1} of ${this.exampleSentences.length}
                            </p>
                        </div>
                        
                        <div style="padding: 24px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 20px; text-align: center;">
                            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 16px;">
                                Focus word: <span style="color: var(--secondary); font-weight: 700;">${selectedWord}</span>
                            </div>
                            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                                ${example.words.map((word, idx) => `
                                    <div style="padding: 14px 20px; background: ${word === selectedWord ? 'rgba(191, 0, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'}; 
                                               border: 2px solid ${word === selectedWord ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.1)'}; 
                                               border-radius: 10px; font-size: 20px; font-weight: 600; font-family: 'JetBrains Mono', monospace;">
                                        ${word}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div id="attentionControls" style="margin-bottom: 20px;">
                            ${this.renderExampleControls(example, selectedWord)}
                        </div>
                        
                        <button class="btn-primary" id="checkBtn" onclick="phase3.checkExample()" style="width: 100%;">
                            Check my attention weights
                        </button>
                        
                        <div id="feedback" style="display: none; margin-top: 16px; padding: 16px; border-radius: 10px;"></div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.exampleWeights = {};
        example.words.forEach((word, idx) => {
            if (word !== selectedWord) {
                this.exampleWeights[word] = 0.5;
            }
        });
    },
    
    renderExampleControls(example, selectedWord) {
        return `
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                    How much should "<strong style="color: var(--secondary);">${selectedWord}</strong>" pay attention to:
                </div>
                ${example.words.map((word, idx) => {
                    if (word === selectedWord) return '';
                    return `
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
                            <div style="min-width: 80px; font-size: 14px; font-family: 'JetBrains Mono', monospace; color: var(--primary);">${word}</div>
                            <input type="range" min="0" max="1" step="0.1" value="0.5" 
                                   oninput="phase3.updateExampleWeight('${word}', this.value)"
                                   style="flex: 1;">
                            <div style="min-width: 40px; text-align: right; font-size: 14px; font-weight: 600;" id="weight-${word}">
                                0.5
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    updateExampleWeight(word, value) {
        this.exampleWeights[word] = parseFloat(value);
        const display = document.getElementById(`weight-${word}`);
        if (display) {
            const val = parseFloat(value);
            display.textContent = val.toFixed(1);
            display.style.color = val > 0.7 ? '#22c55e' : val > 0.4 ? '#f59e0b' : '#6b7280';
        }
    },
    
    checkExample() {
        const example = this.exampleSentences[this.currentExample];
        const feedback = document.getElementById('feedback');
        const selectedWord = example.words[1];
        
        // Check if weights are reasonable based on hints
        let correct = true;
        let message = '';
        
        Object.entries(example.hints).forEach(([word, hint]) => {
            const weight = this.exampleWeights[word];
            if (hint.startsWith('High') && weight < 0.7) {
                correct = false;
                message = `"${word}" should have higher attention (you set ${weight.toFixed(1)}, try 0.8+)`;
            } else if (hint.startsWith('Low') && weight > 0.4) {
                correct = false;
                message = `"${word}" should have lower attention (you set ${weight.toFixed(1)}, try 0.3 or less)`;
            }
        });
        
        feedback.style.display = 'block';
        
        if (correct) {
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.border = '2px solid rgba(34, 197, 94, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #22c55e; font-weight: 700; margin-bottom: 8px;">✓ Perfect!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    You correctly identified the important relationships. Moving on!
                </div>
            `;
            SoundManager.play('correct'); // Use 'correct' for quick success
            Game.addScore(50); // Examples: +50 per correct
            
            setTimeout(() => {
                if (this.currentExample < this.exampleSentences.length - 1) {
                    this.currentExample++;
                    this.render(document.getElementById('phaseContainer'));
                } else {
                    this.currentStep = 'calculate';
                    this.initializeSentences();
                    this.render(document.getElementById('phaseContainer'));
                }
            }, 2000);
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.border = '2px solid rgba(239, 68, 68, 0.3)';
            feedback.innerHTML = `
                <div style="font-size: 16px; color: #ef4444; font-weight: 700; margin-bottom: 8px;">Try adjusting!</div>
                <div style="font-size: 13px; color: var(--text-secondary);">
                    ${message}
                </div>
            `;
            SoundManager.play('wrong'); // Use 'wrong' for incorrect weights
        }
    },
    
    // Expected attention ranges for validation [min, max] - MORE PERMISSIVE
    attentionRanges: {
        'The cat sat on the mat': {
            'The': { 'cat': [0.6, 1.0], 'sat': [0.1, 0.5], 'on': [0.0, 0.4], 'the': [0.1, 0.5], 'mat': [0.1, 0.5] },
            'cat': { 'The': [0.6, 1.0], 'sat': [0.6, 1.0], 'on': [0.1, 0.5], 'the': [0.1, 0.5], 'mat': [0.3, 0.8] },
            'sat': { 'The': [0.1, 0.5], 'cat': [0.6, 1.0], 'on': [0.4, 0.9], 'the': [0.1, 0.5], 'mat': [0.5, 1.0] },
            'on': { 'The': [0.0, 0.4], 'cat': [0.1, 0.5], 'sat': [0.4, 0.9], 'the': [0.2, 0.7], 'mat': [0.6, 1.0] },
            'the': { 'The': [0.1, 0.5], 'cat': [0.1, 0.5], 'sat': [0.1, 0.5], 'on': [0.2, 0.7], 'mat': [0.6, 1.0] },
            'mat': { 'The': [0.1, 0.5], 'cat': [0.3, 0.8], 'sat': [0.5, 1.0], 'on': [0.6, 1.0], 'the': [0.6, 1.0] }
        },
        'The rocket launched into orbit': {
            'The': { 'rocket': [0.6, 1.0], 'launched': [0.1, 0.5], 'into': [0.0, 0.4], 'orbit': [0.1, 0.5] },
            'rocket': { 'The': [0.6, 1.0], 'launched': [0.6, 1.0], 'into': [0.1, 0.5], 'orbit': [0.3, 0.8] },
            'launched': { 'The': [0.1, 0.5], 'rocket': [0.6, 1.0], 'into': [0.4, 0.9], 'orbit': [0.5, 1.0] },
            'into': { 'The': [0.0, 0.4], 'rocket': [0.1, 0.5], 'launched': [0.4, 0.9], 'orbit': [0.6, 1.0] },
            'orbit': { 'The': [0.1, 0.5], 'rocket': [0.3, 0.8], 'launched': [0.5, 1.0], 'into': [0.6, 1.0] }
        },
        'The chef cooked fresh pasta': {
            'The': { 'chef': [0.6, 1.0], 'cooked': [0.1, 0.5], 'fresh': [0.0, 0.4], 'pasta': [0.1, 0.5] },
            'chef': { 'The': [0.6, 1.0], 'cooked': [0.6, 1.0], 'fresh': [0.1, 0.5], 'pasta': [0.2, 0.7] },
            'cooked': { 'The': [0.1, 0.5], 'chef': [0.6, 1.0], 'fresh': [0.3, 0.8], 'pasta': [0.6, 1.0] },
            'fresh': { 'The': [0.0, 0.4], 'chef': [0.1, 0.5], 'cooked': [0.3, 0.8], 'pasta': [0.6, 1.0] },
            'pasta': { 'The': [0.1, 0.5], 'chef': [0.2, 0.7], 'cooked': [0.6, 1.0], 'fresh': [0.6, 1.0] }
        },
        'The programmer wrote clean code': {
            'The': { 'programmer': [0.6, 1.0], 'wrote': [0.1, 0.5], 'clean': [0.0, 0.4], 'code': [0.1, 0.5] },
            'programmer': { 'The': [0.6, 1.0], 'wrote': [0.6, 1.0], 'clean': [0.1, 0.5], 'code': [0.2, 0.7] },
            'wrote': { 'The': [0.1, 0.5], 'programmer': [0.6, 1.0], 'clean': [0.3, 0.8], 'code': [0.6, 1.0] },
            'clean': { 'The': [0.0, 0.4], 'programmer': [0.1, 0.5], 'wrote': [0.3, 0.8], 'code': [0.6, 1.0] },
            'code': { 'The': [0.1, 0.5], 'programmer': [0.2, 0.7], 'wrote': [0.6, 1.0], 'clean': [0.6, 1.0] }
        },
        'The player kicked the ball': {
            'The': { 'player': [0.6, 1.0], 'kicked': [0.1, 0.5], 'the': [0.1, 0.5], 'ball': [0.1, 0.5] },
            'player': { 'The': [0.6, 1.0], 'kicked': [0.6, 1.0], 'the': [0.1, 0.5], 'ball': [0.2, 0.7] },
            'kicked': { 'The': [0.1, 0.5], 'player': [0.6, 1.0], 'the': [0.2, 0.7], 'ball': [0.6, 1.0] },
            'the': { 'The': [0.1, 0.5], 'player': [0.1, 0.5], 'kicked': [0.2, 0.7], 'ball': [0.6, 1.0] },
            'ball': { 'The': [0.1, 0.5], 'player': [0.2, 0.7], 'kicked': [0.6, 1.0], 'the': [0.6, 1.0] }
        }
    },
    
    initializeSentences() {
        // Pick ONE representative sentence based on the dataset
        const datasetKey = Game.state.selectedDataset;
        const sentenceMap = {
            'animals': 'The cat sat on the mat',
            'space': 'The rocket launched into orbit',
            'food': 'The chef cooked fresh pasta',
            'tech': 'The programmer wrote clean code',
            'sports': 'The player kicked the ball'
        };
        
        const sentence = sentenceMap[datasetKey] || 'The cat sat on the mat';
        this.sentences = [sentence];
        this.currentSentence = 0;
        this.currentWordIndex = 0; // Track which word we're building attention for
        this.attentionWeights = {};
        this.completedAttentions = []; // Store completed attention patterns
        this.sliderValidation = {}; // Track which sliders are correct
        this.sliderTouched = {}; // Track which sliders have been moved by user
        this.currentErrorSlider = null; // Track which slider is currently showing error
        this.isInitializing = false; // Track if we're currently initializing to prevent early validation
    },
    
    renderCalculate(container) {
        const sentence = this.sentences[0]; // Always use the same sentence
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        const focusedWord = words[this.currentWordIndex];
        
        container.innerHTML = `
            <div class="phase">
                <div class="phase-sidebar">
                    <div>
                        <h2 class="phase-title">Calculate Attention</h2>
                        <p class="phase-subtitle">Building attention for word ${this.currentWordIndex + 1} of ${words.length}</p>
                    </div>
                    
                    <div class="phase-description">
                        For "<strong style="color: var(--secondary);">${focusedWord}</strong>", set how much attention it pays to each other word.
                    </div>
                    
                    <div class="hint-section">
                        <h4>💡 How to Set Attention</h4>
                        <p style="font-size: 11px; line-height: 1.6;">
                        Think about which words relate to "<strong style="color: var(--secondary);">${focusedWord}</strong>". Words that work together (like subjects and actions) need higher attention!<br><br>
                        <strong style="color: #22c55e;">High (0.8-1.0):</strong> Strong relationship<br>
                        <strong style="color: #fbbf24;">Medium (0.4-0.7):</strong> Moderate<br>
                        <strong style="color: #9ca3af;">Low (0.1-0.3):</strong> Weak</p>
                    </div>
                    
                    <!-- Completed Attentions Matrix -->
                    ${this.completedAttentions.length > 0 ? `
                        <div id="attentionMatrixContainer" style="margin-top: 16px; padding: 12px; background: rgba(34, 197, 94, 0.08); 
                                   border: 2px solid rgba(34, 197, 94, 0.3); border-radius: 10px; max-height: 280px; overflow-y: auto; transition: all 0.3s;">
                            <div id="attentionMatrixTitle" style="font-size: 11px; color: #22c55e; font-weight: 600; margin-bottom: 10px; text-align: center;">
                                ✅ Attention Matrix
                            </div>
                            ${this.renderCompactAttentionMatrix()}
                        </div>
                    ` : ''}
                </div>
                
                <div class="phase-content">
                    <div style="width: 100%; max-width: 780px;">
                        
                        
                        <!-- Linear Visualization with Curves -->
                        <div style="padding: 12px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 12px;">
                            <canvas id="attentionCanvas" width="700" height="180" 
                                    style="border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 10px; 
                                           background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.05)); 
                                           display: block; margin: 0 auto; max-width: 100%; padding:10px;">
                            </canvas>
                        </div>
                        
                        <!-- Attention Controls -->
                        <div id="attentionControls" style="margin-bottom: 12px;">
                            ${this.renderLinearControls(words, this.currentWordIndex)}
                        </div>
                        
                        <div style="text-align: center; padding: 12px; background: rgba(0, 212, 255, 0.05); border-radius: 8px; margin-top: 12px;">
                            <p style="font-size: 11px; color: var(--text-secondary); margin: 0;">
                                💡 Adjust sliders to correct ranges - will auto-advance when all are correct
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
        
        this.initializeWeightsForWord(words, this.currentWordIndex);
        
        // Draw initial canvas
        setTimeout(() => this.drawLinearAttention(words, this.currentWordIndex), 50);
    },
    
    initializeWeightsForWord(words, wordIdx) {
        // Set initialization flag to prevent validation during setup
        this.isInitializing = true;
        
        if (!this.attentionWeights[wordIdx]) {
            this.attentionWeights[wordIdx] = {};
            // Initialize all weights to 0.5
            words.forEach((word, idx) => {
                if (idx !== wordIdx) {
                    this.attentionWeights[wordIdx][idx] = 0.5;
                }
            });
        }
        
        // Initialize validation tracking (but don't show errors yet)
        if (!this.sliderValidation[wordIdx]) {
            this.sliderValidation[wordIdx] = {};
        }
        if (!this.sliderTouched[wordIdx]) {
            this.sliderTouched[wordIdx] = {};
        }
        
        // Clear initialization flag after page has fully rendered
        setTimeout(() => {
            this.isInitializing = false;
        }, 100);
    },
    
    renderCompactAttentionMatrix() {
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        
        // Build matrix: rows = from words, columns = to words
        let html = '<div style="font-family: monospace; font-size: 9px; line-height: 1.4;">';
        
        // Header row with target words
        html += '<div style="display: flex; margin-bottom: 4px;">';
        html += '<div style="min-width: 42px; font-weight: 600; color: var(--text-secondary);"></div>'; // Empty corner
        words.forEach(word => {
            html += `<div style="min-width: 38px; text-align: center; font-weight: 600; color: #00d4ff;">${word}</div>`;
        });
        html += '</div>';
        
        // Data rows
        this.completedAttentions.forEach((att, rowIdx) => {
            html += '<div style="display: flex; margin-bottom: 2px;">';
            
            // Row header (from word)
            html += `<div style="min-width: 42px; font-weight: 600; color: #bf00ff; text-align: right; padding-right: 6px;">${att.word}</div>`;
            
            // Weight cells
            words.forEach(targetWord => {
                const weight = att.weights[targetWord];
                if (weight !== undefined) {
                    const color = weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#fbbf24' : '#9ca3af';
                    html += `<div style="min-width: 38px; text-align: center; color: ${color}; font-weight: 600;">${weight.toFixed(1)}</div>`;
                } else {
                    html += `<div style="min-width: 38px; text-align: center; color: #4b5563;">-</div>`;
                }
            });
            
            html += '</div>';
        });
        
        // If not all words completed yet, show pending rows
        for (let i = this.completedAttentions.length; i < words.length; i++) {
            html += '<div style="display: flex; margin-bottom: 2px;">';
            html += `<div style="min-width: 42px; font-weight: 600; color: #6b7280; text-align: right; padding-right: 6px;">${words[i]}</div>`;
            words.forEach(() => {
                html += `<div style="min-width: 38px; text-align: center; color: #374151;">...</div>`;
            });
            html += '</div>';
        }
        
        html += '</div>';
        
        html += '<div style="margin-top: 8px; font-size: 9px; text-align: center; color: var(--text-secondary);">Each row shows attention from that word to all others</div>';
        
        return html;
    },
    
    renderLinearControls(words, fromIdx) {
        const fromWord = words[fromIdx];
        return `
            <div style="padding: 12px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; text-align: center;">
                    Set attention from "<strong style="color: var(--secondary);">${fromWord}</strong>" to each word:
                </div>
                ${words.map((word, toIdx) => {
                    if (toIdx === fromIdx) return '';
                    const weight = this.attentionWeights[fromIdx]?.[toIdx] || 0.5;
                    return `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 10px; padding: 8px; 
                                       background: rgba(0, 0, 0, 0.2); border-radius: 8px;" id="slider-container-${fromIdx}-${toIdx}">
                                <div style="min-width: 90px; font-size: 13px; font-family: 'JetBrains Mono', monospace; color: var(--primary);" id="word-label-${fromIdx}-${toIdx}">
                                ${word}
                            </div>
                            <input type="range" min="0" max="1" step="0.1" value="${weight}" 
                                   oninput="phase3.updateWeightDisplay(${fromIdx}, ${toIdx}, this.value)"
                                   onchange="phase3.validateAttentionWeight(${fromIdx}, ${toIdx}, this.value)"
                                   style="flex: 1;">
                            <div id="weight-${fromIdx}-${toIdx}" style="min-width: 35px; text-align: right; font-size: 13px; font-weight: 600; 
                                        color: #9ca3af;">
                                ${weight.toFixed(1)}
                                </div>
                            </div>
                            <div id="error-${fromIdx}-${toIdx}" style="display: none; margin-top: 4px; padding: 6px 8px; background: rgba(239, 68, 68, 0.1); 
                                       border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; font-size: 11px; color: #ef4444;">
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    // Update display while dragging (no validation)
    updateWeightDisplay(fromIdx, toIdx, value) {
        const val = parseFloat(value);
        if (!this.attentionWeights[fromIdx]) {
            this.attentionWeights[fromIdx] = {};
        }
        this.attentionWeights[fromIdx][toIdx] = val;
        
        // Update display value only
        const display = document.getElementById(`weight-${fromIdx}-${toIdx}`);
        if (display) {
            display.textContent = val.toFixed(1);
        }
        
        // Redraw canvas with updated weights
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        this.drawLinearAttention(words, this.currentWordIndex, toIdx);
    },
    
    // Validate on slider release
    validateAttentionWeight(fromIdx, toIdx, value) {
        const val = parseFloat(value);
        
        // Mark this slider as touched by user
        if (!this.sliderTouched[fromIdx]) {
            this.sliderTouched[fromIdx] = {};
        }
        this.sliderTouched[fromIdx][toIdx] = true;
        
        // Get sentence and words
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        const fromWord = words[fromIdx];
        const toWord = words[toIdx];
        
        // Validate against expected range
        const expectedRange = this.attentionRanges[sentence]?.[fromWord]?.[toWord];
        const isValid = expectedRange && val >= expectedRange[0] && val <= expectedRange[1];
        
        // Check if validation state changed
        if (!this.sliderValidation[fromIdx]) {
            this.sliderValidation[fromIdx] = {};
        }
        const previousValidState = this.sliderValidation[fromIdx][toIdx];
        const validStateChanged = previousValidState !== isValid;
        this.sliderValidation[fromIdx][toIdx] = isValid;
        
        // Clear previous error slider if different
        if (this.currentErrorSlider && this.currentErrorSlider !== `${fromIdx}-${toIdx}`) {
            const prevErrorDiv = document.getElementById(`error-${this.currentErrorSlider}`);
            if (prevErrorDiv) prevErrorDiv.style.display = 'none';
        }
        
        // Update display with validation feedback
        const display = document.getElementById(`weight-${fromIdx}-${toIdx}`);
        const wordLabel = document.getElementById(`word-label-${fromIdx}-${toIdx}`);
        const errorDiv = document.getElementById(`error-${fromIdx}-${toIdx}`);
        const sliderContainer = document.getElementById(`slider-container-${fromIdx}-${toIdx}`);
        
        if (display) {
            if (isValid) {
                display.style.color = '#22c55e';
                wordLabel.style.color = '#22c55e';
                sliderContainer.style.border = '2px solid rgba(34, 197, 94, 0.5)';
                errorDiv.style.display = 'none';
                
                // Only play sound if state changed
                if (validStateChanged) {
                    SoundManager.play('correct');
                }
                
                // If this was the error slider, clear it
                if (this.currentErrorSlider === `${fromIdx}-${toIdx}`) {
                    this.currentErrorSlider = null;
                }
            } else {
                display.style.color = '#ef4444';
                wordLabel.style.color = 'var(--primary)';
                sliderContainer.style.border = '2px solid rgba(239, 68, 68, 0.3)';
                
                // Only show error for THIS slider (one at a time)
                if (expectedRange) {
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = `Attention of "${fromWord}" to "${toWord}" should be within ${expectedRange[0].toFixed(1)}-${expectedRange[1].toFixed(1)}`;
                    this.currentErrorSlider = `${fromIdx}-${toIdx}`;
                }
                
                // Only play sound if state changed
                if (validStateChanged) {
                    SoundManager.play('wrong');
                }
            }
        }
        
        // Check if all sliders have been touched by user
        const totalSliders = words.length - 1; // Exclude the focused word itself
        const touchedCount = Object.keys(this.sliderTouched[fromIdx] || {}).length;
        
        // Check if all touched sliders are valid
        const allValid = touchedCount > 0 && Object.keys(this.sliderTouched[fromIdx] || {}).every(idx => 
            this.sliderValidation[fromIdx]?.[idx] === true
        );
        
        // Auto-advance if all sliders touched and all valid
        if (touchedCount >= totalSliders && allValid) {
            setTimeout(() => {
                this.autoAdvanceToNextWord();
            }, 1800); // Longer delay to let user see all green and matrix update
        }
    },
    
    autoAdvanceToNextWord() {
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        const currentWord = words[this.currentWordIndex];
        
        // Save completed attention pattern
        const weightsObj = {};
        Object.entries(this.attentionWeights[this.currentWordIndex] || {}).forEach(([idx, weight]) => {
            weightsObj[words[parseInt(idx)]] = weight;
        });
        
        this.completedAttentions.push({
            word: currentWord,
            weights: weightsObj
        });
        
        SoundManager.play('coin');
        Game.addScore(20); // Mini-game: +20 per word processed
        
        // Animate the attention matrix to draw attention
        this.animateAttentionMatrixUpdate();
        
        // Move to next word or show final visualization
        setTimeout(() => {
            if (this.currentWordIndex < words.length - 1) {
                this.currentWordIndex++;
                // Reset tracking for next word
                this.sliderValidation = {};
                this.sliderTouched = {};
                this.currentErrorSlider = null;
                this.isInitializing = false; // Ensure flag is reset
                this.render(document.getElementById('phaseContainer'));
            } else {
                // Show complete attention map
                this.showCompleteAttentionMap();
            }
        }, 1200); // Delay to let animation play
    },
    
    animateAttentionMatrixUpdate() {
        // Find the attention matrix container in the sidebar
        const matrixContainer = document.getElementById('attentionMatrixContainer');
        const matrixTitle = document.getElementById('attentionMatrixTitle');
        
        if (!matrixContainer) return;
        
        // Pulse animation with green glow
        if (window.gsap) {
            // Pulse the entire container with a glowing effect
            gsap.fromTo(matrixContainer,
                { 
                    scale: 1,
                    boxShadow: '0 0 0 rgba(34, 197, 94, 0)',
                    borderColor: 'rgba(34, 197, 94, 0.3)'
                },
                {
                    scale: 1.05,
                    boxShadow: '0 0 40px rgba(34, 197, 94, 1), 0 0 20px rgba(34, 197, 94, 0.6)',
                    borderColor: 'rgba(34, 197, 94, 0.9)',
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                }
            );
            
            // Flash and bounce the title
            if (matrixTitle) {
                gsap.fromTo(matrixTitle,
                    { scale: 1, y: 0 },
                    { 
                        scale: 1.2,
                        y: -3,
                        duration: 0.4,
                        yoyo: true,
                        repeat: 1,
                        ease: 'back.out(2)'
                    }
                );
                
                // Color flash on title
                gsap.to(matrixTitle, {
                    color: '#4ade80',
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }
            
            // Scroll the matrix to the bottom to show the new row
            setTimeout(() => {
                if (matrixContainer.scrollHeight > matrixContainer.clientHeight) {
                    gsap.to(matrixContainer, {
                        scrollTop: matrixContainer.scrollHeight,
                        duration: 0.6,
                        ease: 'power2.inOut'
                    });
                }
            }, 200);
        }
    },
    
    completeCurrentWord() {
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        const currentWord = words[this.currentWordIndex];
        
        // Validate that user actually set meaningful weights
        const weights = this.attentionWeights[this.currentWordIndex] || {};
        const weightValues = Object.values(weights);
        
        if (weightValues.length === 0) return;
        
        // Calculate variance to ensure weights are actually different
        const mean = weightValues.reduce((a, b) => a + b, 0) / weightValues.length;
        const variance = weightValues.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / weightValues.length;
        
        // Count unique weight values (rounded to 1 decimal)
        const uniqueWeights = new Set(weightValues.map(w => Math.round(w * 10) / 10));
        
        // Validation checks
        const allDefault = weightValues.every(w => w === 0.5);
        const lowVariance = variance < 0.04; // Very little variation in weights
        const tooFewUnique = uniqueWeights.size < 2; // All weights are the same
        const allVeryLow = weightValues.every(w => w <= 0.2); // All weights near zero
        const noHighWeights = !weightValues.some(w => w >= 0.6); // No meaningful high attention
        
        if (allDefault || lowVariance || tooFewUnique || allVeryLow || noHighWeights) {
            // Show error - user didn't adjust weights meaningfully
            SoundManager.play('wrong');
            
            // Show error message in the proper feedback div
            const errorDiv = document.getElementById('errorFeedback');
            if (errorDiv) {
                errorDiv.style.display = 'block';
                errorDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                errorDiv.style.border = '2px solid rgba(239, 68, 68, 0.3)';
                
                let errorMsg = 'Set different attention values to show meaningful relationships!';
                if (allVeryLow) {
                    errorMsg = 'Not all words should have near-zero attention! Some words ARE contextually related.';
                } else if (noHighWeights) {
                    errorMsg = 'You need at least some HIGH attention weights (0.6+) for words that relate strongly to "' + currentWord + '".';
                } else if (tooFewUnique || lowVariance) {
                    errorMsg = 'All your weights are too similar! Different words should have different attention levels.';
                }
                
                errorDiv.innerHTML = `
                    <div style="font-size: 16px; color: #ef4444; font-weight: 700; margin-bottom: 8px;">
                        ⚠️ Make meaningful attention choices!
                    </div>
                    <div style="font-size: 13px; color: var(--text-secondary);">
                        ${errorMsg}
                    </div>
                `;
                
                // Auto-hide after 3 seconds
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 3000);
            }
            
            return;
        }
        
        // Save completed attention pattern
        const weightsObj = {};
        Object.entries(this.attentionWeights[this.currentWordIndex] || {}).forEach(([idx, weight]) => {
            weightsObj[words[parseInt(idx)]] = weight;
        });
        
        this.completedAttentions.push({
            word: currentWord,
            weights: weightsObj
        });
        
        SoundManager.play('coin');
        Game.addScore(20); // Mini-game: +20 per word processed
        
        // Move to next word or show final visualization
        if (this.currentWordIndex < words.length - 1) {
            this.currentWordIndex++;
            this.render(document.getElementById('phaseContainer'));
        } else {
            // Show complete attention map
            this.showCompleteAttentionMap();
        }
    },
    
    showCompleteAttentionMap() {
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
        
        const container = document.getElementById('phaseContainer');
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; overflow-y: auto;">
                <div style="max-width: 900px; width: 100%;">
                    
                    <h1 style="font-size: 26px; text-align: center; margin-bottom: 6px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                               -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        🎯 Your Attention Map
                    </h1>
                    
                    <p style="font-size: 13px; color: var(--text-secondary); text-align: center; margin-bottom: 15px;">
                        You built attention patterns for all ${words.length} words!
                    </p>
                    
                    <!-- Yellow Encouragement Box -->
                    <div style="padding: 16px; background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1)); 
                               border: 2px solid rgba(251, 191, 36, 0.4); border-radius: 12px; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            <span style="font-size: 20px;">💡</span>
                            <h3 style="font-size: 13px; color: #fbbf24; margin: 0; font-weight: 700;">Don't worry if this seems complex!</h3>
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.7;">
                            <p style="margin: 0;">
                                Attention is one of the hardest concepts in LLMs - it's even harder in real models with 96+ attention heads running simultaneously! 
                                What matters is understanding the <strong style="color: #fbbf24;">core idea</strong>: attention gives each word <strong>context awareness</strong> 
                                by calculating which other words are relevant to it. 
                                That's the breakthrough that made modern AI possible!
                            </p>
                        </div>
                    </div>
                    
                    <!-- Complete Visualization -->
                    <div style="padding: 16px; background: rgba(0, 212, 255, 0.08); border-radius: 12px; margin-bottom: 20px;">
                        <canvas id="completeAttentionCanvas" width="750" height="280" 
                                style="border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 10px; 
                                       background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 212, 255, 0.05)); 
                                       display: block; margin: 0 auto; max-width: 100%; padding: 10px;">
                        </canvas>
                    </div>
                    
                    <button class="btn-primary" onclick="phase3.nextSentence()" style="width: 100%; font-size: 16px; padding: 14px;">
                        Continue →
                    </button>
                    
                </div>
            </div>
        `;
        
        setTimeout(() => this.drawCompleteAttentionMap(words), 50);
    },
    
    renderAttentionControls(words, fromIdx) {
        return `
            <div style="padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                    Set attention from "<strong style="color: var(--secondary);">${words[fromIdx]}</strong>" to:
                </div>
                ${words.map((word, toIdx) => {
                    if (toIdx === fromIdx) return '';
                    const weight = this.attentionWeights[this.currentSentence]?.[fromIdx]?.[toIdx] || 0.5;
                    return `
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 10px; background: rgba(0, 0, 0, 0.2); border-radius: 8px;">
                            <div style="min-width: 80px; font-size: 14px; font-family: 'JetBrains Mono', monospace; color: var(--primary);">${word}</div>
                            <input type="range" min="0" max="1" step="0.1" value="${weight}" 
                                   onchange="phase3.setAttention(${fromIdx}, ${toIdx}, this.value)"
                                   style="flex: 1;">
                            <div style="min-width: 40px; text-align: right; font-size: 14px; font-weight: 600; color: ${weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#f59e0b' : '#6b7280'};">
                                ${parseFloat(weight).toFixed(1)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    selectWord(idx) {
        this.selectedWord = idx;
        const sentence = this.sentences[this.currentSentence];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 6);
        
        // Update controls
        document.getElementById('attentionControls').innerHTML = this.renderAttentionControls(words, idx);
        
        // Redraw canvas
        this.drawAttentionCanvas(words, idx);
        
        SoundManager.play('click');
    },
    
    setAttention(fromIdx, toIdx, value) {
        if (!this.attentionWeights[this.currentSentence][fromIdx]) {
            this.attentionWeights[this.currentSentence][fromIdx] = {};
        }
        this.attentionWeights[this.currentSentence][fromIdx][toIdx] = parseFloat(value);
        
        // Redraw canvas to show updated weights with animation
        const sentence = this.sentences[this.currentSentence];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 6);
        this.drawAttentionCanvas(words, this.selectedWord, toIdx); // Pass changed word index for animation
        
        SoundManager.play('click');
    },
    
    drawLinearAttention(words, focusedIdx, changedIdx = null) {
        const canvas = document.getElementById('attentionCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Linear layout - words in a horizontal line
        const padding = 50;
        const wordSpacing = (width - padding * 2) / (words.length - 1);
        const yPosition = height * 0.65; // Move circles lower to give space for curves above
        
        const positions = words.map((word, idx) => ({
            x: padding + idx * wordSpacing,
            y: yPosition,
            word: word,
            idx: idx
        }));
        
        // Get weights for focused word
        const weights = this.attentionWeights[focusedIdx] || {};
        
        // Draw curved connections FIRST (so they appear behind circles)
        positions.forEach((toPos) => {
            if (toPos.idx === focusedIdx) return;
            
            const weight = weights[toPos.idx] || 0.5;
            const fromPos = positions[focusedIdx];
            const isChanged = changedIdx === toPos.idx;
            
            // Calculate control point for bezier curve (arc upward or downward)
            const midX = (fromPos.x + toPos.x) / 2;
            const distance = Math.abs(toPos.x - fromPos.x);
            const curveHeight = distance * 0.3; // Arc height based on distance
            const controlY = yPosition - curveHeight; // Arc upward
            
            // Draw curved line
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.quadraticCurveTo(midX, controlY, toPos.x, toPos.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${weight * 0.9})`;
            ctx.lineWidth = (1 + weight * 5) * (isChanged ? 1.4 : 1);
            ctx.stroke();
            
            // Draw weight label at the curve's peak
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            const labelWidth = 28;
            const labelHeight = 16;
            ctx.fillRect(midX - labelWidth/2, controlY - labelHeight/2, labelWidth, labelHeight);
            
            ctx.fillStyle = weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#fbbf24' : '#9ca3af';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(weight.toFixed(1), midX, controlY);
        });
        
            // Draw word circles ON TOP
        positions.forEach((pos) => {
            const isFocused = pos.idx === focusedIdx;
            const isChanged = changedIdx === pos.idx;
            const radius = isFocused ? 28 : (isChanged ? 24 : 22);
            
            // Outer glow for focused word
            if (isFocused) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius + 6, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(191, 0, 255, 0.3)';
                ctx.fill();
            }
            
            // Pulse for changed word
            if (isChanged) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius + 2, 0, 2 * Math.PI);
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            
            // Main circle
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = isFocused ? 'rgba(191, 0, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
            ctx.fill();
            ctx.strokeStyle = isFocused ? '#bf00ff' : 'rgba(0, 212, 255, 0.8)';
            ctx.lineWidth = isFocused ? 4 : 2;
            ctx.stroke();
            
            // Word text
            ctx.fillStyle = 'white';
            ctx.font = isFocused ? 'bold 12px monospace' : 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Split long words
            const text = pos.word.length > 8 ? pos.word.substring(0, 7) + '..' : pos.word;
            ctx.fillText(text, pos.x, pos.y);
        });
    },
    
    drawCompleteAttentionMap(words) {
        const canvas = document.getElementById('completeAttentionCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Linear layout
        const padding = 50;
        const wordSpacing = (width - padding * 2) / (words.length - 1);
        const yPosition = height / 2;
        
        const positions = words.map((word, idx) => ({
            x: padding + idx * wordSpacing,
            y: yPosition,
            word: word,
            idx: idx
        }));
        
        // Draw ALL attention connections WITH WEIGHT LABELS
        words.forEach((fromWord, fromIdx) => {
            const weights = this.attentionWeights[fromIdx] || {};
            const fromPos = positions[fromIdx];
            
            Object.entries(weights).forEach(([toIdxStr, weight]) => {
                const toIdx = parseInt(toIdxStr);
                const toPos = positions[toIdx];
                
                // Calculate curve - alternate above/below to reduce overlap
            const midX = (fromPos.x + toPos.x) / 2;
                const distance = Math.abs(toPos.x - fromPos.x);
                const curveHeight = distance * 0.25;
                // Alternate curves: if fromIdx < toIdx go up, else go down
                const controlY = fromIdx < toIdx ? yPosition - curveHeight : yPosition + curveHeight;
                
                // Draw curved line
                ctx.beginPath();
                ctx.moveTo(fromPos.x, fromPos.y);
                ctx.quadraticCurveTo(midX, controlY, toPos.x, toPos.y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${weight * 0.6})`;
                ctx.lineWidth = 0.5 + weight * 2.5;
                ctx.stroke();
                
                // Draw weight label at the curve's peak
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                const labelWidth = 28;
                const labelHeight = 16;
                ctx.fillRect(midX - labelWidth/2, controlY - labelHeight/2, labelWidth, labelHeight);
                
                ctx.fillStyle = weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#fbbf24' : '#9ca3af';
                ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(weight.toFixed(1), midX, controlY);
            });
        });
        
        // Draw word circles on top
        positions.forEach((pos) => {
            const radius = 22;
            
            // Circle
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 212, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Word text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const text = pos.word.length > 8 ? pos.word.substring(0, 7) + '..' : pos.word;
            ctx.fillText(text, pos.x, pos.y);
        });
        
        // Add legend
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
    },
    
    nextSentence() {
        // Since we only have one sentence, this moves to recap
            Game.state.attentionWeights = this.attentionWeights;
            Game.addScore(250); // Mini-game completion bonus (fixed)
        SoundManager.play('powerup');
            this.currentStep = 'recap';
            this.render(document.getElementById('phaseContainer'));
    },
    
    renderRecap(container) {
        const totalWeights = Object.values(this.attentionWeights).reduce((sum, wordWeights) => {
            return sum + Object.keys(wordWeights).length;
        }, 0);
        
        container.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;">
                <div style="max-width: 950px; width: 100%;">
                    
                    <!-- ANIMATED SCALE COMPARISON -->
                    <div style="margin: 20px 0; padding: 24px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.05)); 
                               border: 3px solid rgba(139, 92, 246, 0.3); border-radius: 16px; overflow: hidden;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="font-size: 20px; color: #a855f7; margin-bottom: 8px; font-weight: 700;">
                                🔬 Scale Comparison: Your Model vs. Real LLMs
                            </h3>
                            <p style="font-size: 13px; color: var(--text-secondary);">
                                Watch your single attention head explode into thousands
                            </p>
                        </div>
                        <div id="attentionScaleAnimation" style="min-height: 380px; max-height: 380px; overflow: hidden;"></div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button id="continueToJourneyBtn"
                                style="padding: 12px 36px; background: linear-gradient(135deg, var(--primary), var(--secondary)); 
                                       border: none; border-radius: 12px; color: white; font-size: 15px; font-weight: 600; 
                                       cursor: pointer; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4); transition: all 0.3s;">
                            Continue: View Progress →
                        </button>
                    </div>
                    
                </div>
            </div>
        `;
        
        // Trigger the animation after a short delay
        setTimeout(() => {
            if (window.ScaleAnimations && window.ScaleAnimations.animateAttentionComparison) {
                ScaleAnimations.animateAttentionComparison();
            }
        }, 500);
        
        // Add event listener after rendering
        setTimeout(() => {
            const btn = document.getElementById('continueToJourneyBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    // Go to Journey Checkpoint page
                    this.currentStep = 'journey_checkpoint';
                    this.render(document.getElementById('phaseContainer'));
                });
            }
        }, 0);
    },
    
    // Journey Checkpoint Page
    renderJourneyCheckpoint(container) {
        const totalWeights = Object.values(this.attentionWeights).reduce((sum, wordWeights) => {
            return sum + Object.keys(wordWeights).length;
        }, 0);
        
        const phaseData = {
            title: 'Attention',
            subtitle: `You calculated ${totalWeights} attention weights`,
            whereYouAre: 'Your tokens now have <strong>relationships</strong>. The attention mechanism calculated how much each token should "focus on" others based on their vector similarity.',
            whatYouDid: `You computed ${totalWeights} attention scores through pure math (dot products, softmax). "Chef" pays high attention to "cooked" because their vectors are similar - discovered from training data, not programmed!`,
            whatsNext: '<strong>Training:</strong> Build a language model that learns "which words follow which" from your training data. This creates the statistical patterns needed for text generation!',
            whyItMatters: 'Attention is the BREAKTHROUGH that made modern LLMs possible! It allows the model to dynamically focus on relevant context. "The chef who trained in Paris cooked" - attention helps "cooked" focus on "chef", not just the nearest word "Paris".',
            buttonText: 'Continue to Training',
            onContinue: 'phase3.completePhaseAndAdvance()'
        };
        
        Game.renderJourneyCheckpoint(3, phaseData);
    },
    
    // Complete Phase and Advance
    completePhaseAndAdvance() {
        // Mark phase 3 as complete
        if (!Game.state.phaseCompleted[3]) {
            Game.state.phaseCompleted[3] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase3_transition']) {
            Game.addScore(100); // Phase transition bonus
            Game.state.pointsAwarded['phase3_transition'] = true;
            Game.saveState();
        }
        
        // Advance to next phase
        SoundManager.play('success');
        Game.nextPhase();
    },
    
    formatSampleWeights() {
        const firstSent = this.attentionWeights[0];
        if (!firstSent) return '<div style="color: var(--text-secondary);">No weights calculated</div>';
        
        const sentence = this.sentences[0];
        const words = sentence.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 6);
        
        let html = '';
        Object.entries(firstSent).slice(0, 2).forEach(([fromIdx, weights]) => {
            const from = words[parseInt(fromIdx)];
            html += `<div style="margin-bottom: 8px; color: var(--secondary);">"${from}" → </div>`;
            Object.entries(weights).forEach(([toIdx, weight]) => {
                const to = words[parseInt(toIdx)];
                const color = weight > 0.7 ? '#22c55e' : weight > 0.4 ? '#f59e0b' : '#6b7280';
                html += `<div style="margin-left: 20px; color: ${color};">  "${to}": ${weight.toFixed(2)}</div>`;
            });
        });
        
        return html;
    },
    
    completePhase() {
        // Mark phase complete with fixed transition bonus
        if (!Game.state.phaseCompleted[3]) {
            Game.state.phaseCompleted[3] = true;
            Game.saveState();
        }
        
        // Award transition bonus only once
        if (!Game.state.pointsAwarded['phase3_transition']) {
            Game.addScore(100); // Phase transition bonus (fixed)
            Game.state.pointsAwarded['phase3_transition'] = true;
            Game.saveState();
        }
        
        SoundManager.play('success');
        setTimeout(() => Game.nextPhase(), 500);
    }
};



