// Sound effects manager using Howler.js
const SoundManager = {
    sounds: {},
    muted: false,
    volume: 0.1, // Default volume (10%)
    
    init() {
        // Check if user has sound preference saved
        this.muted = localStorage.getItem('soundMuted') === 'true';
        
        // Load saved volume or use default
        const savedVolume = localStorage.getItem('soundVolume');
        this.volume = savedVolume ? parseFloat(savedVolume) : 0.1;
        
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
        
        this.sounds.correct = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.25,
            rate: 1.8
        });
        
        this.sounds.wrong = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.2,
            rate: 0.5
        });
        
        this.sounds.timeout = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.25,
            rate: 2.0
        });
        
        this.sounds.powerup = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.3,
            rate: 1.4
        });
        
        this.sounds.coin = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.2,
            rate: 2.2
        });
        
        // Whoosh sound for super fast tokenization
        this.sounds.whoosh = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.35,
            rate: 2.5 // Very fast pitch for whoosh effect
        });
        
        this.sounds.notification = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.18,
            rate: 1.6
        });
        
        this.sounds.warning = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.22,
            rate: 0.9
        });
        
        this.sounds.hover = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.12,
            rate: 2.5
        });
        
        this.sounds.victory = new Howl({
            src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGGS75+ajUBELTqXh8LRjHQU2jtfyz3ksBS15yPDckD8IEl+06+qoVRUK'],
            volume: 0.35,
            rate: 1.1
        });
    },
    
    play(soundName) {
        if (this.muted) return;
        
        // Special handling for counterStart with sequential beeps
        if (soundName === 'counterStart') {
            this.playCountdownSequence();
            return;
        }
        
        if (this.useWebAudioFallback) {
            this.playWebAudioTone(soundName);
            return;
        }
        
        if (this.sounds[soundName]) {
            // Apply current volume to the sound
            this.sounds[soundName].volume(this.volume);
            this.sounds[soundName].play();
        }
    },
    
    // TikTok-style countdown with beeps
    playCountdownSequence() {
        if (this.muted) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create 3 countdown beeps + final "GO!" sound
            const beeps = [
                { freq: 800, time: 0, duration: 0.12, volume: 0.15 },      // Beep 1
                { freq: 900, time: 0.4, duration: 0.12, volume: 0.18 },    // Beep 2
                { freq: 1000, time: 0.8, duration: 0.12, volume: 0.20 },   // Beep 3
                // Final "GO!" - multi-layered rising chord
                { freq: 523.25, time: 1.3, duration: 0.35, volume: 0.22 }, // C
                { freq: 659.25, time: 1.32, duration: 0.35, volume: 0.20 }, // E
                { freq: 783.99, time: 1.35, duration: 0.35, volume: 0.18 }, // G
                { freq: 1046.50, time: 1.38, duration: 0.4, volume: 0.25 }  // High C
            ];
            
            beeps.forEach(beep => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.frequency.value = beep.freq;
                osc.type = 'sine';
                
                // Smooth filter for warm sound
                filter.type = 'lowpass';
                filter.frequency.value = 3000;
                filter.Q.value = 1;
                
                const startTime = audioContext.currentTime + beep.time;
                const endTime = startTime + beep.duration;
                
                // Volume envelope with sharp attack and smooth decay
                const adjustedVolume = beep.volume * this.volume;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(adjustedVolume, startTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, endTime);
                
                osc.start(startTime);
                osc.stop(endTime);
            });
        } catch (e) {
            console.log('Web Audio not supported');
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
                },
                correct: {
                    freq: 880.00,
                    duration: 0.12,
                    type: 'sine',
                    pattern: [880.00, 1046.50], // A-C quick chirp
                    volume: 0.14
                },
                wrong: {
                    freq: 220.00,
                    duration: 0.30,
                    type: 'sawtooth',
                    pattern: [220.00, 185.00], // Buzzer descend
                    volume: 0.10
                },
                timeout: {
                    freq: 1760.00,
                    duration: 0.08,
                    type: 'square',
                    pattern: [1760.00, 1760.00, 1760.00], // Urgent triple beep
                    volume: 0.12
                },
                powerup: {
                    freq: 440.00,
                    duration: 0.10,
                    type: 'sine',
                    pattern: [440.00, 554.37, 659.25, 880.00], // A-C#-E-A rising whoosh
                    volume: 0.14
                },
                coin: {
                    freq: 987.77,
                    duration: 0.08,
                    type: 'square',
                    pattern: [987.77, 1318.51], // B-E pickup
                    volume: 0.12
                },
                notification: {
                    freq: 783.99,
                    duration: 0.15,
                    type: 'sine',
                    pattern: [783.99, 1046.50], // G-C gentle bell
                    volume: 0.10
                },
                warning: {
                    freq: 493.88,
                    duration: 0.20,
                    type: 'triangle',
                    pattern: [493.88, 523.25], // B-C alert
                    volume: 0.12
                },
                hover: {
                    freq: 1046.50,
                    duration: 0.03,
                    type: 'sine',
                    pattern: [1046.50], // Quick high C
                    volume: 0.08
                },
                victory: {
                    freq: 523.25,
                    duration: 0.16,
                    type: 'sine',
                    pattern: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1046.50], // C-E-G-C-E-C triumph
                    volume: 0.16
                },
                counterStart: {
                    freq: 880.00,
                    duration: 0.18,
                    type: 'sine',
                    pattern: [440.00, 554.37, 659.25, 880.00, 1046.50], // A-C#-E-A-C epic start!
                    volume: 0.18
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
                    
                    // Volume envelope with smooth fade - APPLY GLOBAL VOLUME
                    const adjustedVolume = pattern.volume * this.volume;
                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(adjustedVolume, startTime + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, endTime);
                    
                    osc.start(startTime);
                    osc.stop(endTime);
                });
            } else {
                // Single note - crisp and short - APPLY GLOBAL VOLUME
                const adjustedVolume = pattern.volume * this.volume;
                oscillator.frequency.value = pattern.freq;
                gainNode.gain.setValueAtTime(adjustedVolume, audioContext.currentTime);
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
    },
    
    getVolume() {
        return this.volume;
    },
    
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol)); // Clamp between 0 and 1
        localStorage.setItem('soundVolume', this.volume);
        
        // Update all Howler sounds if they exist
        if (typeof Howl !== 'undefined') {
            Object.values(this.sounds).forEach(sound => {
                if (sound && sound.volume) {
                    sound.volume(this.volume);
                }
            });
        }
    }
};

// Initialize sounds when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SoundManager.init();
});

