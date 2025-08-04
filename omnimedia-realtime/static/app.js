/**
 * OmniMedia AI - Real-Time Generation Frontend
 * WebSocket-powered streaming interface
 */

class OmniMediaAI {
    constructor() {
        this.ws = null;
        this.currentTask = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.taskHistory = [];
        
        this.init();
    }

    init() {
        this.setupDOM();
        this.connectWebSocket();
        this.bindEvents();
        this.loadTaskHistory();
    }

    setupDOM() {
        document.addEventListener('DOMContentLoaded', () => {
            this.hideLoading();
            this.renderInterface();
        });
    }

    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 300);
        }
    }

    renderInterface() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="connection-status disconnected" id="connectionStatus">
                🔴 Disconnected
            </div>
            
            <div class="container fade-in-up">
                <div class="header">
                    <h1>🎬 OmniMedia AI</h1>
                    <p>Real-Time AI Media Generation Platform</p>
                    <div class="status-bar">
                        <div class="status-item">
                            <div class="status-dot"></div>
                            <span>Real-Time Streaming</span>
                        </div>
                        <div class="status-item">
                            <div class="status-dot"></div>
                            <span>WebSocket Connected</span>
                        </div>
                        <div class="status-item">
                            <div class="status-dot"></div>
                            <span>AI Agents Ready</span>
                        </div>
                    </div>
                </div>

                <div class="generation-interface">
                    <div class="input-panel">
                        <h2>🎯 Generation Control</h2>
                        
                        <div class="form-group">
                            <label for="promptInput">Prompt</label>
                            <textarea 
                                id="promptInput" 
                                class="form-control" 
                                placeholder="Describe what you want to generate... (e.g., 'A futuristic cityscape at sunset with flying cars')"
                                rows="4"
                            ></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="mediaType">Media Type</label>
                                <select id="mediaType" class="form-control">
                                    <option value="image">🖼️ Image</option>
                                    <option value="video">🎥 Video</option>
                                    <option value="text">📝 Text</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="styleSelect">Style</label>
                                <select id="styleSelect" class="form-control">
                                    <option value="photorealistic">📸 Photorealistic</option>
                                    <option value="artistic">🎨 Artistic</option>
                                    <option value="cinematic">🎬 Cinematic</option>
                                    <option value="anime">🌸 Anime</option>
                                    <option value="abstract">🌀 Abstract</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="qualitySelect">Quality</label>
                                <select id="qualitySelect" class="form-control">
                                    <option value="hd">HD (1080p)</option>
                                    <option value="4k">4K Ultra</option>
                                    <option value="8k">8K Premium</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="realTimeToggle">Real-Time Mode</label>
                                <select id="realTimeToggle" class="form-control">
                                    <option value="true">✅ Enabled</option>
                                    <option value="false">❌ Disabled</option>
                                </select>
                            </div>
                        </div>

                        <div class="progress-container" id="progressContainer">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progressFill"></div>
                            </div>
                            <div class="progress-text" id="progressText">Ready to generate...</div>
                        </div>

                        <button id="generateBtn" class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                            🚀 Generate Media
                        </button>
                        
                        <button id="clearBtn" class="btn btn-secondary" style="width: 100%; margin-top: 10px;">
                            🗑️ Clear Output
                        </button>
                    </div>

                    <div class="output-panel">
                        <h2>📺 Live Output</h2>
                        
                        <div class="output-area" id="outputArea">
                            <div class="streaming-indicator" id="streamingIndicator">
                                <div class="streaming-dot"></div>
                                <span>LIVE</span>
                            </div>
                            
                            <div class="output-placeholder" id="outputPlaceholder">
                                <div>
                                    <div style="font-size: 3rem; margin-bottom: 20px;">🎭</div>
                                    <div>Ready for real-time generation</div>
                                    <div style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                                        Enter a prompt and click generate to see live streaming
                                    </div>
                                </div>
                            </div>
                            
                            <div class="output-content" id="outputContent">
                                <!-- Generated content will appear here -->
                            </div>
                        </div>

                        <div style="margin-top: 20px; display: flex; gap: 10px;">
                            <button id="downloadBtn" class="btn btn-secondary" style="flex: 1;" disabled>
                                💾 Download
                            </button>
                            <button id="shareBtn" class="btn btn-secondary" style="flex: 1;" disabled>
                                🔗 Share
                            </button>
                        </div>
                    </div>
                </div>

                <div class="task-history">
                    <h3>📋 Generation History</h3>
                    <div class="task-list" id="taskList">
                        <!-- Task history will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('🟢 WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.updateConnectionStatus(true);
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };

            this.ws.onclose = () => {
                console.log('🔴 WebSocket disconnected');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.updateConnectionStatus(false);
            };

        } catch (error) {
            console.error('❌ Failed to connect WebSocket:', error);
            this.updateConnectionStatus(false);
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connectWebSocket(), 2000 * this.reconnectAttempts);
        }
    }

    updateConnectionStatus(connected) {
        const statusEl = document.getElementById('connectionStatus');
        if (statusEl) {
            statusEl.className = `connection-status ${connected ? 'connected' : 'disconnected'}`;
            statusEl.textContent = connected ? '🟢 Connected' : '🔴 Disconnected';
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'generateBtn') {
                this.startGeneration();
            } else if (e.target.id === 'clearBtn') {
                this.clearOutput();
            } else if (e.target.id === 'downloadBtn') {
                this.downloadResult();
            } else if (e.target.id === 'shareBtn') {
                this.shareResult();
            }
        });

        // Auto-resize textarea
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'TEXTAREA') {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }
        });

        // Enter key to generate (Ctrl+Enter)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.startGeneration();
            }
        });
    }

    async startGeneration() {
        const promptInput = document.getElementById('promptInput');
        const mediaType = document.getElementById('mediaType').value;
        const style = document.getElementById('styleSelect').value;
        const quality = document.getElementById('qualitySelect').value;
        const realTime = document.getElementById('realTimeToggle').value === 'true';

        const prompt = promptInput.value.trim();
        if (!prompt) {
            this.showError('Please enter a prompt');
            return;
        }

        if (!this.isConnected) {
            this.showError('WebSocket not connected. Please wait...');
            return;
        }

        // Disable generate button
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = true;
        generateBtn.textContent = '⏳ Generating...';

        // Show progress
        this.showProgress(0, 'Initializing generation...');

        // Clear previous output
        this.clearOutput();

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    media_type: mediaType,
                    style,
                    quality,
                    real_time: realTime
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.currentTask = result.task_id;
                
                // Subscribe to task updates via WebSocket
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({
                        action: 'subscribe',
                        task_id: this.currentTask
                    }));
                }

                // Show streaming indicator
                this.showStreamingIndicator(true);
                
                console.log('🚀 Generation started:', result);
            } else {
                throw new Error(result.detail || 'Generation failed');
            }

        } catch (error) {
            console.error('❌ Generation error:', error);
            this.showError(error.message);
            this.resetGenerateButton();
        }
    }

    handleWebSocketMessage(data) {
        console.log('📨 WebSocket message:', data);

        switch (data.type) {
            case 'subscription_confirmed':
                console.log('✅ Subscribed to task:', data.task_id);
                break;

            case 'progress_update':
                this.handleProgressUpdate(data);
                break;

            case 'text_stream':
                this.handleTextStream(data);
                break;

            default:
                console.log('📝 Unknown message type:', data.type);
        }
    }

    handleProgressUpdate(data) {
        const { task_id, data: progressData } = data;
        
        if (task_id !== this.currentTask) return;

        const { stage, progress, message, result_data } = progressData;

        // Update progress bar
        this.showProgress(progress, message);

        // If generation is complete
        if (progress === 100 && result_data) {
            this.showResult(result_data, stage);
            this.resetGenerateButton();
            this.showStreamingIndicator(false);
            
            // Add to history
            this.addToHistory({
                task_id,
                prompt: document.getElementById('promptInput').value,
                media_type: document.getElementById('mediaType').value,
                status: 'completed',
                timestamp: new Date().toISOString(),
                result_data
            });
        }
    }

    handleTextStream(data) {
        const { task_id, data: streamData } = data;
        
        if (task_id !== this.currentTask) return;

        const { text, progress, word_count, total_words } = streamData;

        // Update progress
        this.showProgress(progress, `Generated ${word_count}/${total_words} words...`);

        // Stream text in real-time
        this.showTextStream(text);

        // If complete
        if (progress === 100) {
            this.resetGenerateButton();
            this.showStreamingIndicator(false);
            
            // Add to history
            this.addToHistory({
                task_id,
                prompt: document.getElementById('promptInput').value,
                media_type: 'text',
                status: 'completed',
                timestamp: new Date().toISOString(),
                result_data: text
            });
        }
    }

    showProgress(progress, message) {
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        progressContainer.classList.add('active');
        progressFill.style.width = `${progress}%`;
        progressText.textContent = message;
    }

    showResult(resultData, stage) {
        const outputPlaceholder = document.getElementById('outputPlaceholder');
        const outputContent = document.getElementById('outputContent');

        outputPlaceholder.style.display = 'none';
        outputContent.classList.add('active');

        const mediaType = document.getElementById('mediaType').value;

        if (mediaType === 'image') {
            outputContent.innerHTML = `
                <div class="media-container">
                    <img src="${resultData}" alt="Generated image" />
                </div>
            `;
        } else if (mediaType === 'video') {
            outputContent.innerHTML = `
                <div class="media-container">
                    <video controls autoplay muted>
                        <source src="${resultData}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        }

        // Enable action buttons
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('shareBtn').disabled = false;
    }

    showTextStream(text) {
        const outputPlaceholder = document.getElementById('outputPlaceholder');
        const outputContent = document.getElementById('outputContent');

        outputPlaceholder.style.display = 'none';
        outputContent.classList.add('active');

        outputContent.innerHTML = `
            <div class="text-output">${text}</div>
        `;

        // Auto-scroll to bottom
        outputContent.scrollTop = outputContent.scrollHeight;
    }

    showStreamingIndicator(show) {
        const indicator = document.getElementById('streamingIndicator');
        indicator.classList.toggle('active', show);
    }

    clearOutput() {
        const outputPlaceholder = document.getElementById('outputPlaceholder');
        const outputContent = document.getElementById('outputContent');
        const progressContainer = document.getElementById('progressContainer');

        outputPlaceholder.style.display = 'flex';
        outputContent.classList.remove('active');
        outputContent.innerHTML = '';
        progressContainer.classList.remove('active');

        // Disable action buttons
        document.getElementById('downloadBtn').disabled = true;
        document.getElementById('shareBtn').disabled = true;

        this.showStreamingIndicator(false);
    }

    resetGenerateButton() {
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = false;
        generateBtn.textContent = '🚀 Generate Media';
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 71, 87, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            font-weight: 600;
            backdrop-filter: blur(10px);
        `;
        errorDiv.textContent = `❌ ${message}`;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    addToHistory(task) {
        this.taskHistory.unshift(task);
        this.saveTaskHistory();
        this.renderTaskHistory();
    }

    renderTaskHistory() {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;

        if (this.taskHistory.length === 0) {
            taskList.innerHTML = `
                <div style="text-align: center; color: #666; padding: 40px;">
                    No generation history yet. Start creating!
                </div>
            `;
            return;
        }

        taskList.innerHTML = this.taskHistory.slice(0, 10).map(task => `
            <div class="task-item">
                <div class="task-header">
                    <div>
                        <strong>${task.prompt.substring(0, 50)}${task.prompt.length > 50 ? '...' : ''}</strong>
                        <div class="task-id">${task.task_id}</div>
                    </div>
                    <div class="task-status ${task.status}">${task.status}</div>
                </div>
                <div style="font-size: 0.9rem; color: #888;">
                    ${task.media_type} • ${new Date(task.timestamp).toLocaleString()}
                </div>
            </div>
        `).join('');
    }

    loadTaskHistory() {
        try {
            const saved = localStorage.getItem('omnimedia_task_history');
            this.taskHistory = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load task history:', error);
            this.taskHistory = [];
        }
    }

    saveTaskHistory() {
        try {
            localStorage.setItem('omnimedia_task_history', JSON.stringify(this.taskHistory));
        } catch (error) {
            console.error('Failed to save task history:', error);
        }
    }

    downloadResult() {
        // Implementation for downloading generated content
        console.log('📥 Download requested');
        this.showError('Download feature coming soon!');
    }

    shareResult() {
        // Implementation for sharing generated content
        console.log('🔗 Share requested');
        this.showError('Share feature coming soon!');
    }
}

// Initialize the application
const omniMediaAI = new OmniMediaAI();

// Export for global access
window.OmniMediaAI = omniMediaAI;