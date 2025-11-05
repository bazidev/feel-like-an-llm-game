// Sound effects manager using Howler.js
const SoundManager = {
    sounds: {},
    muted: false,
    
    init() {
        // Check if user has sound preference saved
        this.muted = localStorage.getItem('soundMuted') === 'true';
        
        // Create simple synthesized sounds using Web Audio API fallback
        // These will work even without external audio files
        this.initWebAudio();
    },
    
    initWebAudio() {
        // Check if Howler is available
        if (typeof Howl === 'undefined') {
            console.log('Howler.js not loaded, using fallback audio');
            this.useWebAudioFallback = true;
            return;
        }
        
        // You can add actual sound files here later
        // For now, we'll use simple tones
        this.sounds.success = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.3
        });
        
        this.sounds.error = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.2,
            rate: 0.7
        });
        
        this.sounds.click = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.15,
            rate: 1.5
        });
        
        this.sounds.levelUp = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.4,
            rate: 1.2
        });
    },
    
    play(soundName) {
        if (this.muted) return;
        
        if (this.useWebAudioFallback) {
            this.playWebAudioTone(soundName);
            return;
        }
        
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    },
    
    playWebAudioTone(type) {
        if (this.muted) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies and patterns for different sounds
            const soundPatterns = {
                success: { freq: 523.25, duration: 0.15, type: 'sine', pattern: [523.25, 659.25, 783.99] }, // C-E-G chord
                error: { freq: 233.08, duration: 0.2, type: 'sawtooth', pattern: [233.08] }, // Bb (dissonant)
                click: { freq: 1046.50, duration: 0.05, type: 'sine', pattern: [1046.50] }, // High C (short click)
                levelUp: { freq: 523.25, duration: 0.12, type: 'sine', pattern: [523.25, 659.25, 783.99, 1046.50] } // C major arpeggio
            };
            
            const pattern = soundPatterns[type] || soundPatterns.click;
            
            oscillator.type = pattern.type;
            
            // Play pattern of notes for richer sounds
            if (pattern.pattern.length > 1) {
                // Multi-note pattern (chord/arpeggio)
                pattern.pattern.forEach((freq, i) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.frequency.value = freq;
                    osc.type = pattern.type;
                    
                    const startTime = audioContext.currentTime + (i * pattern.duration * 0.3);
                    const endTime = startTime + pattern.duration;
                    
                    gain.gain.setValueAtTime(0.08, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, endTime);
                    
                    osc.start(startTime);
                    osc.stop(endTime);
                });
            } else {
                // Single note
                oscillator.frequency.value = pattern.freq;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + pattern.duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + pattern.duration);
            }
        } catch (e) {
            console.log('Web Audio not supported');
        }
    },
    
    toggle() {
        this.muted = !this.muted;
        localStorage.setItem('soundMuted', this.muted);
        return this.muted;
    }
};

// Initialize sounds when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SoundManager.init();
});

