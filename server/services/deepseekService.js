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
            // 处理API URL
            let apiUrl = config.apiUrl;
            if (!apiUrl.includes('/chat/completions')) {
                apiUrl = `${apiUrl.replace(/\/+$/, '')}/chat/completions`;
            }

            logger.debug('Deepseek API请求:', {
                url: apiUrl,
                input,
                systemPrompt: systemPrompt ? '已设置' : '未设置'
            });

            const messages = [];
            if (systemPrompt) {
                messages.push({
                    role: 'system',
                    content: systemPrompt
                });
            }
            messages.push({
                role: 'user',
                content: input
            });

            const response = await axios({
                method: 'post',
                url: apiUrl,
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    model: 'deepseek-chat',  // 使用最新的DeepSeek-V3模型
                    messages,
                    temperature: parseFloat(config.temperature) || 0.7,
                    max_tokens: parseInt(config.maxTokens) || 2000,
                    stream: false
                },
                timeout: 60000 // 60秒超时
            });

            logger.debug('Deepseek API响应:', {
                status: response.status,
                statusText: response.statusText,
                hasChoices: !!response.data?.choices
            });

            if (response.data?.choices?.[0]?.message?.content) {
                return {
                    success: true,
                    message: response.data.choices[0].message.content
                };
            } else {
                throw new Error('API响应格式不正确');
            }
        } catch (error) {
            logger.error('Deepseek API调用失败:', {
                error: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            let errorMessage = '调用AI助手失败';
            if (error.response?.data?.error?.message) {
                errorMessage = `API错误: ${error.response.data.error.message}`;
            } else if (error.response?.data?.message) {
                errorMessage = `API错误: ${error.response.data.message}`;
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = '请求超时，请稍后重试';
            } else if (!error.response) {
                errorMessage = '无法连接到服务器，请检查网络连接';
            }

            return {
                success: false,
                message: errorMessage
            };
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
        // 检查并修正API URL
        if (!config.apiUrl.startsWith('https://api.deepseek.com')) {
            throw new Error('无效的 Deepseek API URL，应以 https://api.deepseek.com 开头');
        }
    }
}

module.exports = new DeepseekService(); 