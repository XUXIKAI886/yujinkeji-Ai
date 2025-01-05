import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const http = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 60000, // 增加超时时间到60秒
    headers: {
        'Content-Type': 'application/json',
    }
});

// 重试配置
const retryConfig = {
    retries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
        return axios.isAxiosError(error) && !error.response;
    }
};

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // 添加重试配置
        config.retryConfig = retryConfig;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { config } = error;
        if (!config || !config.retryConfig) {
            return Promise.reject(error);
        }

        const { retries, retryDelay, retryCondition } = config.retryConfig;
        config.retryCount = config.retryCount || 0;

        if (retryCondition(error) && config.retryCount < retries) {
            config.retryCount += 1;
            console.log(`重试请求 (${config.retryCount}/${retries}): ${config.url}`);
            
            // 等待延迟时间
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            
            // 重试请求
            return http(config);
        }

        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    message.error(data.message || '请先登录');
                    window.location.href = '/login';
                    break;
                case 403:
                    message.error(data.message || '权限不足');
                    break;
                case 404:
                    message.error(data.message || '请求的资源不存在');
                    break;
                case 400:
                    message.error(data.message || '请求参数错误');
                    break;
                default:
                    message.error(data.message || '服务器错误');
            }
        } else if (error.request) {
            message.error('网络错误，请检查您的网络连接');
        } else {
            message.error('请求配置错误');
        }
        return Promise.reject(error);
    }
);

export default http; 