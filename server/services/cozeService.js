const axios = require('axios');

class CozeService {
    /**
     * 验证Coze配置
     */
    static validateConfig(config) {
        return config && config.apiKey && config.botId;
    }

    /**
     * 调用Coze API - 文本对话
     */
    static async chat(config, userId, question) {
        try {
            // 验证配置
            if (!this.validateConfig(config)) {
                throw new Error('无效的Coze配置');
            }

            const url = config.apiUrl || 'https://api.coze.cn/open_api/v2/chat';
            const response = await axios.post(url, {
                bot_id: config.botId,
                user: userId,
                query: question,
                stream: false
            }, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 180000
            });

            console.log('Coze API Response:', response.data);

            if (response.data && response.data.code === 0) {
                const messages = response.data.messages || [];
                for (const message of messages) {
                    if (message.role === 'assistant') {
                        if (message.type === 'answer') {
                            return {
                                success: true,
                                message: message.content
                            };
                        } else if (message.type === 'follow_up') {
                            return {
                                success: true,
                                message: '助手提问：' + message.content
                            };
                        }
                    }
                }
                throw new Error('未找到有效的回复消息');
            } else {
                throw new Error(response.data?.msg || '调用失败');
            }
        } catch (error) {
            console.error('Coze API Error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.msg || error.message
            };
        }
    }

    /**
     * 调用Coze API - 图片生成
     */
    static async generateImage(config, userId, prompt, options = {}) {
        try {
            if (!this.validateConfig(config)) {
                throw new Error('无效的Coze配置');
            }

            const url = 'https://api.coze.cn/open_api/v2/chat';
            const response = await axios.post(url, {
                bot_id: config.botId,
                user: userId,
                query: prompt,
                stream: false,
                tools: [{
                    type: 'image_generation',
                    parameters: {
                        prompt,
                        size: options.size || '1024x1024',
                        style: options.style || 'natural',
                        quality: options.quality || 'standard'
                    }
                }]
            }, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 120000 // 图片生成可能需要更长时间
            });

            console.log('Coze Image Generation Response:', response.data);

            if (response.data && response.data.code === 0) {
                const messages = response.data.messages || [];
                for (const message of messages) {
                    if (message.role === 'assistant' && message.type === 'image') {
                        return {
                            success: true,
                            imageUrl: message.content,
                            prompt: prompt
                        };
                    }
                }
                throw new Error('未找到生成的图片');
            } else {
                throw new Error(response.data?.msg || '图片生成失败');
            }
        } catch (error) {
            console.error('Coze Image Generation Error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.msg || error.message
            };
        }
    }

    /**
     * 调用Coze API - 图片分析
     */
    static async analyzeImage(config, userId, imageUrl, question) {
        try {
            if (!this.validateConfig(config)) {
                throw new Error('无效的Coze配置');
            }

            const url = 'https://api.coze.cn/open_api/v2/chat';
            const response = await axios.post(url, {
                bot_id: config.botId,
                user: userId,
                query: question,
                stream: false,
                tools: [{
                    type: 'image_analysis',
                    parameters: {
                        image_url: imageUrl
                    }
                }]
            }, {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            });

            console.log('Coze Image Analysis Response:', response.data);

            if (response.data && response.data.code === 0) {
                const messages = response.data.messages || [];
                for (const message of messages) {
                    if (message.role === 'assistant' && message.type === 'answer') {
                        return {
                            success: true,
                            analysis: message.content
                        };
                    }
                }
                throw new Error('未找到图片分析结果');
            } else {
                throw new Error(response.data?.msg || '图片分析失败');
            }
        } catch (error) {
            console.error('Coze Image Analysis Error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.msg || error.message
            };
        }
    }
}

module.exports = CozeService; 