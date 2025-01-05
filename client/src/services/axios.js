import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 从localStorage获取token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request:', {
            url: config.url,
            method: config.method,
            data: config.data,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response) {
            // 处理401错误（未授权）
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                message.error('登录已过期，请重新登录');
                window.location.href = '/login';
                return Promise.reject(error);
            }
            // 处理403错误（禁止访问）
            if (error.response.status === 403) {
                message.error('没有权限执行此操作');
                return Promise.reject(error);
            }
            // 处理404错误（资源不存在）
            if (error.response.status === 404) {
                message.error('请求的资源不存在');
                return Promise.reject(error);
            }
            // 处理500错误（服务器错误）
            if (error.response.status === 500) {
                message.error('服务器错误，请稍后重试');
                return Promise.reject(error);
            }
            // 返回错误响应中的数据
            return Promise.reject(error.response.data);
        }
        message.error('网络错误，请检查网络连接');
        return Promise.reject(error);
    }
);

export default instance; 