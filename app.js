// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Feel Like an LLM - Game Starting...');
    
    // Check if all required scripts are loaded
    const requiredPhases = ['phase0', 'phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6'];
    const loadedPhases = requiredPhases.filter(p => typeof window[p] !== 'undefined');
    
    console.log(`✅ Loaded phases: ${loadedPhases.join(', ')}`);
    
    if (loadedPhases.length !== requiredPhases.length) {
        console.warn(`⚠️ Missing phases: ${requiredPhases.filter(p => !loadedPhases.includes(p)).join(', ')}`);
    }
    
    // Check required libraries
    console.log(`📚 GSAP loaded: ${typeof gsap !== 'undefined'}`);
    console.log(`🔊 Howler loaded: ${typeof Howl !== 'undefined'}`);
    
    // Initialize the game
    Game.init();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        }
        
        // Arrow keys for navigation (when not in input)
        if (!e.target.matches('input, textarea')) {
            if (e.key === 'ArrowRight' && !document.getElementById('nextBtn').disabled) {
                Game.nextPhase();
            }
            if (e.key === 'ArrowLeft' && !document.getElementById('prevBtn').disabled) {
                Game.prevPhase();
            }
        }
        
        // H for hint
        if (e.key === 'h' || e.key === 'H') {
            if (!e.target.matches('input, textarea')) {
                Game.toggleHint();
            }
        }
    });
    
    // Add visual feedback for interactions
    document.addEventListener('click', (e) => {
        if (e.target.matches('button')) {
            // Button click animation
            gsap.to(e.target, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        }
    });
    
    // Add particle burst effect on score increases
    const originalAddScore = Game.addScore.bind(Game);
    Game.addScore = function(points) {
        originalAddScore(points);
        createScoreParticles(points);
    };
    
    function createScoreParticles(points) {
        const scoreEl = document.getElementById('scoreValue');
        if (!scoreEl) return;
        
        const rect = scoreEl.getBoundingClientRect();
        const particle = document.createElement('div');
        
        // Check if points are positive or negative
        const isPositive = points > 0;
        const displayText = isPositive ? `+${points}` : `${points}`;
        const color = isPositive ? 'var(--success)' : '#ef4444'; // Green for positive, red for negative
        
        particle.textContent = displayText;
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            color: ${color};
            font-weight: 800;
            font-size: 24px;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(particle);
        
        gsap.to(particle, {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
    
    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            activateEasterEgg();
        }
    });
    
    function activateEasterEgg() {
        Game.addScore(1000);
        SoundManager.play('levelUp');
        
        const msg = document.createElement('div');
        msg.innerHTML = '🎮 KONAMI CODE! +1000 BONUS POINTS! 🎮';
        msg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 30px 50px;
            border-radius: 20px;
            font-size: 24px;
            font-weight: 800;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        document.body.appendChild(msg);
        
        gsap.from(msg, {
            scale: 0,
            duration: 0.5,
            ease: 'back.out(2)'
        });
        
        gsap.to(msg, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: 2,
            onComplete: () => msg.remove()
        });
    }
    
    // Auto-save on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            Game.saveState();
        }
    });
    
    // Save before unload
    window.addEventListener('beforeunload', () => {
        Game.saveState();
    });
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Performance monitoring (optional)
    if (window.performance && window.performance.memory) {
        setInterval(() => {
            const memory = window.performance.memory;
            if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
                console.warn('⚠️ High memory usage detected');
            }
        }, 30000); // Check every 30 seconds
    }
    
    console.log('✓ Game initialized successfully');
    console.log('💡 Tip: Press H for hints, Arrow keys to navigate');
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Game Error:', e.error);
    // Don't break the game on errors
    return true;
});

// Service Worker for offline capability (optional future enhancement)
if ('serviceWorker' in navigator) {
    // Uncomment when you have a service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed'));
}

