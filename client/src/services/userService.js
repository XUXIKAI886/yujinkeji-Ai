import http from '../utils/http';

// 创建用户
export const createUser = async (userData) => {
    try {
        const response = await http.post('/users', userData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || '创建用户失败'
        };
    }
};

// 获取所有用户
export const getAllUsers = async () => {
    try {
        const response = await http.get('/users');
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || '获取用户列表失败'
        };
    }
};

// 更新用户信息
export const updateUser = async (userId, userData) => {
    try {
        const response = await http.put(`/users/${userId}`, userData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || '更新用户信息失败'
        };
    }
};

// 更新用户状态
export const updateUserStatus = async (userId, status) => {
    try {
        const response = await http.put(`/users/${userId}/status`, { status });
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || '更新用户状态失败'
        };
    }
};

// 更新用户积分
export const updateUserPoints = async (userId, points, type, description) => {
    try {
        const response = await http.put(`/users/${userId}/points`, { points, type, description });
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || '更新用户积分失败'
        };
    }
};

// 获取用户积分历史
export const getUserPointsHistory = async (userId) => {
    try {
        console.log('开始获取用户积分历史:', userId);
        const response = await http.get(`/users/${userId}/points/history`);
        console.log('积分历史API响应:', response);
        
        if (!response.data.success) {
            console.error('获取积分历史失败:', response.data);
            return {
                success: false,
                message: response.data.message || '获取积分历史失败'
            };
        }

        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        console.error('获取积分历史服务错误:', error);
        return {
            success: false,
            message: error.response?.data?.message || '获取用户积分历史失败'
        };
    }
};

// 获取用户统计信息
export const getUserStats = async () => {
    try {
        const response = await http.get('/users/stats');
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || '获取用户统计信息失败'
        };
    }
}; 