const axios = require('axios');

class CozeService {
    /**
     * 验证Coze配置
     */
    static validateConfig(config) {
        return config && config.apiKey && config.botId;
    }

    /**
     * 调用Coze API
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
                timeout: 30000
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
}

module.exports = CozeService; 