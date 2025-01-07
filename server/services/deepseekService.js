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
            // 处理API URL，确保正确的格式
            let apiUrl = config.apiUrl || config.url;
            if (!apiUrl.endsWith('/v1/chat/completions')) {
                apiUrl = apiUrl.replace(/\/+$/, '') + '/v1/chat/completions';
            }
            
            // 确保不会重复添加路径
            apiUrl = apiUrl.replace(/\/chat\/completions\/v1\/chat\/completions$/, '/v1/chat/completions');

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

            const requestData = {
                model: 'deepseek-chat',
                messages: messages,
                temperature: config.temperature || 0.7,
                max_tokens: config.maxTokens || 2000,
                stream: false
            };

            console.log('Deepseek API请求:', {
                url: apiUrl,
                messages: messages,
                temperature: requestData.temperature,
                max_tokens: requestData.max_tokens
            });

            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8'
                },
                timeout: 60000, // 60秒超时
                responseType: 'json',
                responseEncoding: 'utf8'
            });

            if (response.data && response.data.choices && response.data.choices[0]) {
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
        
        // 检查并规范化API URL
        let apiUrl = config.apiUrl;
        if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
            throw new Error('无效的 Deepseek API URL，必须以 http:// 或 https:// 开头');
        }
        
        // 移除末尾的斜杠
        config.apiUrl = apiUrl.replace(/\/+$/, '');
    }
}

module.exports = new DeepseekService(); 