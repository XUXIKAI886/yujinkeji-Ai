const axios = require('axios');
const logger = require('../utils/logger');

class DeepseekService {
    /**
     * 调用 Deepseek API
     * @param {Object} config - Deepseek 配置
     * @param {string} config.apiKey - API密钥
     * @param {string} config.apiUrl - API地址
     * @param {string} input - 用户输入
     * @param {string} systemPrompt - 系统提示词
     * @returns {Promise<Object>} - API响应
     */
    async chat(config, input, systemPrompt = '') {
        try {
            logger.debug('Deepseek API请求:', {
                url: config.apiUrl,
                headers: {
                    'Authorization': '***',
                    'Content-Type': 'application/json'
                },
                input
            });

            const response = await axios({
                method: 'post',
                url: config.apiUrl,
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: input
                        }
                    ],
                    temperature: config.temperature || 0.7,
                    max_tokens: config.maxTokens || 2000
                },
                timeout: 30000
            });

            logger.debug('Deepseek API原始响应:', response.data);

            if (response.data.choices && response.data.choices[0]) {
                return {
                    success: true,
                    message: response.data.choices[0].message.content
                };
            } else {
                throw new Error('无效的API响应格式');
            }
        } catch (error) {
            logger.error('Deepseek API调用失败:', {
                error: error.message,
                config: {
                    ...config,
                    apiKey: '***'
                },
                stack: error.stack
            });

            if (error.response) {
                throw new Error(`API调用失败：${error.response.data.error?.message || '未知错误'}`);
            } else if (error.request) {
                throw new Error('API请求失败：无法连接到服务器');
            } else {
                throw new Error(`API调用失败：${error.message}`);
            }
        }
    }

    /**
     * 验证 Deepseek 配置
     * @param {Object} config - 配置对象
     * @throws {Error} 如果配置无效
     */
    validateConfig(config) {
        if (!config.apiKey) {
            throw new Error('缺少 Deepseek API Key');
        }
        if (!config.apiUrl) {
            throw new Error('缺少 Deepseek API URL');
        }
    }
}

module.exports = new DeepseekService(); 