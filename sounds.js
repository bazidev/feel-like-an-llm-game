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
            // More musical and distinctive!
            const soundPatterns = {
                success: { 
                    freq: 523.25, 
                    duration: 0.18, 
                    type: 'sine', 
                    pattern: [659.25, 783.99, 1046.50], // E-G-C ascending (uplifting!)
                    volume: 0.12
                },
                error: { 
                    freq: 415.30, 
                    duration: 0.25, 
                    type: 'triangle', 
                    pattern: [415.30, 311.13], // Ab-Eb descending (sad/wrong)
                    volume: 0.10
                },
                click: { 
                    freq: 1318.51, 
                    duration: 0.04, 
                    type: 'square', 
                    pattern: [1318.51], // High E (crisp click)
                    volume: 0.08
                },
                levelUp: { 
                    freq: 523.25, 
                    duration: 0.14, 
                    type: 'sine', 
                    pattern: [523.25, 659.25, 783.99, 1046.50, 1318.51], // C-E-G-C-E full celebration!
                    volume: 0.15
                }
            };
            
            const pattern = soundPatterns[type] || soundPatterns.click;
            
            oscillator.type = pattern.type;
            
            // Play pattern of notes for richer sounds
            if (pattern.pattern.length > 1) {
                // Multi-note pattern (chord/arpeggio)
                pattern.pattern.forEach((freq, i) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    const filter = audioContext.createBiquadFilter();
                    
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.frequency.value = freq;
                    osc.type = pattern.type;
                    
                    // Add gentle low-pass filter for warmth
                    filter.type = 'lowpass';
                    filter.frequency.value = 2000;
                    filter.Q.value = 1;
                    
                    // Timing for arpeggio effect
                    const startTime = audioContext.currentTime + (i * pattern.duration * 0.35);
                    const endTime = startTime + pattern.duration * 1.2;
                    
                    // Volume envelope with smooth fade
                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(pattern.volume, startTime + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, endTime);
                    
                    osc.start(startTime);
                    osc.stop(endTime);
                });
            } else {
                // Single note - crisp and short
                oscillator.frequency.value = pattern.freq;
                gainNode.gain.setValueAtTime(pattern.volume, audioContext.currentTime);
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

