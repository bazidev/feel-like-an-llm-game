// Scoreboard API Integration
// Clean, maintainable API client for Feel like an LLM scoreboard

const ScoreboardAPI = {
    // Configuration - Easy to update
    config: {
        baseURL: 'https://parseapi.back4app.com',
        applicationId: 'tscxsVeupXP2PlDkQ3RhALZqXXLaYdi79H0JUVFa',
        restApiKey: '5qBlKBWDVKyQIWTG10sLURtvOB1yPVsDaBhPupcJ',
        apiKey: 'f4d9a6c3e1b8a5d2c7f0e9b6a3d1c8f5e2b7a4c1',
        gameName: 'Feel like an LLM',
        gameVersion: '1.0.0',
        timeout: 10000 // 10 seconds
    },
    
    // Common headers for all requests
    getHeaders(includeApiKey = false) {
        const headers = {
            'X-Parse-Application-Id': this.config.applicationId,
            'X-Parse-REST-API-Key': this.config.restApiKey,
            'Content-Type': 'application/json'
        };
        
        // Add write API key for saveScore
        // Note: This requires running from a web server (not file://) to avoid CORS issues
        if (includeApiKey) {
            headers['x-api-key'] = this.config.apiKey;
        }
        
        return headers;
    },
    
    // Calculate elapsed time from game start
    getElapsedTime() {
        // Calculate total elapsed time correctly (including pauses)
        let totalElapsed = 0;
        if (Game.state.startTime) {
            const currentSessionElapsed = Date.now() - Game.state.startTime;
            totalElapsed = (Game.state.elapsedTimeBeforePause || 0) + currentSessionElapsed;
        } else if (Game.state.elapsedTimeBeforePause) {
            totalElapsed = Game.state.elapsedTimeBeforePause;
        }
        return Math.floor(totalElapsed / 1000); // Convert to seconds
    },
    
    // Save score to API
    async saveScore() {
        console.log('🔍 Checking Game.state before saving:');
        console.log('   Game.state.uniqueUserId:', Game.state.uniqueUserId);
        console.log('   Game.state.modelName:', Game.state.modelName);
        console.log('   Game.state.score:', Game.state.score);
        console.log('   Game.state.startTime:', Game.state.startTime);
        
        // Validate required data
        if (!Game.state.uniqueUserId) {
            console.warn('⚠️ Cannot save score: No unique user ID generated yet');
            return { success: false, error: 'No user ID' };
        }
        
        if (!Game.state.score || Game.state.score === 0) {
            console.warn('⚠️ Cannot save score: Score is 0');
            return { success: false, error: 'Score is 0' };
        }
        
        // Prepare score data
        const scoreData = {
            // Required fields
            user_name: Game.state.uniqueUserId, // Unique username
            game_name: this.config.gameName,
            game_version: this.config.gameVersion,
            totale_score: Game.state.score,
            
            // Optional fields
            name: Game.state.modelName || 'Anonymous', // Display name
            avatar_code: Game.state.avatar || 'robot', // Avatar ID
            score: Game.state.score,
            counter_time: this.getElapsedTime(),
            playedAt: new Date().toISOString(),
            
            // API key in body (camelCase) to avoid CORS preflight issues with custom headers
            apiKey: this.config.apiKey
        };
        
        console.log('📤 Saving score to API:');
        console.log('   user_name:', scoreData.user_name);
        console.log('   name:', scoreData.name);
        console.log('   avatar_code:', scoreData.avatar_code);
        console.log('   game_name:', scoreData.game_name);
        console.log('   game_version:', scoreData.game_version);
        console.log('   totale_score:', scoreData.totale_score);
        console.log('   score:', scoreData.score);
        console.log('   counter_time:', scoreData.counter_time);
        console.log('   playedAt:', scoreData.playedAt);
        console.log('   Full payload:', JSON.stringify(scoreData, null, 2));
        
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            
            console.log('🌐 Making POST request to:', `${this.config.baseURL}/functions/saveScore`);
            console.log('📋 Request headers:', JSON.stringify(this.getHeaders(true), null, 2));
            console.log('📦 Request body:', JSON.stringify(scoreData, null, 2));
            
            const response = await fetch(`${this.config.baseURL}/functions/saveScore`, {
                method: 'POST',
                headers: this.getHeaders(false), // Don't use custom header - API key is in body
                body: JSON.stringify(scoreData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Check response status
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Score save failed:', response.status, errorData);
                console.error('❌ Full error details:', JSON.stringify(errorData, null, 2));
                
                // Show user-friendly error
                if (response.status === 119) {
                    return { success: false, error: 'Unauthorized - Invalid API key', details: errorData };
                } else if (response.status === 142) {
                    return { success: false, error: 'Invalid data format', details: errorData };
                } else if (response.status === 400) {
                    return { success: false, error: `Bad Request: ${errorData.error || JSON.stringify(errorData)}`, details: errorData };
                } else {
                    return { success: false, error: `Server error: ${response.status}`, details: errorData };
                }
            }
            
            const result = await response.json();
            
            console.log('📥 API Response received:');
            console.log('   Raw response:', JSON.stringify(result, null, 2));
            
            // Check if score was updated
            if (result.result && result.result.updated) {
                console.log('✅ Score saved successfully!');
                console.log('   Object ID:', result.result.objectId);
                console.log('   New high score:', result.result.totale_score);
                if (result.result.previousTotaleScore) {
                    console.log('   Previous score:', result.result.previousTotaleScore);
                }
                return { 
                    success: true, 
                    data: result.result,
                    isHighScore: true
                };
            } else if (result.result && result.result.updated === false) {
                console.log('ℹ️ Score submitted but not high enough');
                console.log('   Current high score:', result.result.totale_score);
                return { 
                    success: true, 
                    data: result.result,
                    isHighScore: false
                };
            } else {
                console.log('✅ Score saved!', result);
                return { success: true, data: result };
            }
            
        } catch (error) {
            // Handle network errors, timeouts, etc.
            if (error.name === 'AbortError') {
                console.error('❌ Score save timeout - Server took too long to respond');
                return { success: false, error: 'Request timeout' };
            } else if (error.message.includes('Failed to fetch')) {
                console.error('❌ Score save failed - Network error (offline or CORS issue)');
                return { success: false, error: 'Network error' };
            } else {
                console.error('❌ Score save failed:', error);
                return { success: false, error: error.message };
            }
        }
    },
    
    // Get leaderboard
    async getLeaderboard(limit = 100, skip = 0) {
        const requestData = {
            game_name: this.config.gameName,
            game_version: this.config.gameVersion,
            limit: Math.min(limit, 100), // Max 100
            skip: skip
        };
        
        console.log('📥 Fetching leaderboard:', requestData);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            
            const response = await fetch(`${this.config.baseURL}/functions/getLeaderboard`, {
                method: 'POST',
                headers: this.getHeaders(false), // No API key needed
                body: JSON.stringify(requestData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Leaderboard fetch failed:', response.status, errorData);
                return { success: false, error: `Server error: ${response.status}` };
            }
            
            const result = await response.json();
            
            console.log('✅ Leaderboard fetched successfully!');
            console.log('   Raw API response:', JSON.stringify(result, null, 2));
            console.log('   Number of entries:', result.result?.results?.length || 0);
            
            if (result.result?.results?.length > 0) {
                console.log('   First entry sample:', result.result.results[0]);
            }
            
            return { 
                success: true, 
                data: result.result?.results || []
            };
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('❌ Leaderboard fetch timeout');
                return { success: false, error: 'Request timeout' };
            } else if (error.message.includes('Failed to fetch')) {
                console.error('❌ Leaderboard fetch failed - Network error');
                return { success: false, error: 'Network error' };
            } else {
                console.error('❌ Leaderboard fetch failed:', error);
                return { success: false, error: error.message };
            }
        }
    },
    
    // Get specific score by ID
    async getScore(objectId) {
        if (!objectId) {
            console.warn('⚠️ Cannot fetch score: No object ID provided');
            return { success: false, error: 'No object ID' };
        }
        
        console.log('📥 Fetching score:', objectId);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            
            const response = await fetch(`${this.config.baseURL}/functions/getScore`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: JSON.stringify({ id: objectId }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                if (response.status === 101) {
                    console.error('❌ Score not found:', objectId);
                    return { success: false, error: 'Score not found' };
                }
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Score fetch failed:', response.status, errorData);
                return { success: false, error: `Server error: ${response.status}` };
            }
            
            const result = await response.json();
            
            console.log('✅ Score fetched:', result.result);
            
            return { 
                success: true, 
                data: result.result
            };
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('❌ Score fetch timeout');
                return { success: false, error: 'Request timeout' };
            } else if (error.message.includes('Failed to fetch')) {
                console.error('❌ Score fetch failed - Network error');
                return { success: false, error: 'Network error' };
            } else {
                console.error('❌ Score fetch failed:', error);
                return { success: false, error: error.message };
            }
        }
    },
    
    // Show user-friendly error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            max-width: 400px;
            text-align: center;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        // Animate and remove
        if (typeof gsap !== 'undefined') {
            gsap.from(errorDiv, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: 'back.out(2)'
            });
            
            gsap.to(errorDiv, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                delay: 3,
                onComplete: () => errorDiv.remove()
            });
        } else {
            setTimeout(() => errorDiv.remove(), 3000);
        }
    },
    
    // Show success message
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95));
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            max-width: 400px;
            text-align: center;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        // Animate and remove
        if (typeof gsap !== 'undefined') {
            gsap.from(successDiv, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: 'back.out(2)'
            });
            
            gsap.to(successDiv, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                delay: 2.5,
                onComplete: () => successDiv.remove()
            });
        } else {
            setTimeout(() => successDiv.remove(), 2500);
        }
    }
};

// Make available globally
window.ScoreboardAPI = ScoreboardAPI;

