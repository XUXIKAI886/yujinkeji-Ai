const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    // 用户相关接口
    AUTH: {
        REGISTER: `${API_BASE_URL}/users/register`,
        LOGIN: `${API_BASE_URL}/users/login`,
        ME: `${API_BASE_URL}/users/me`,
    },
    // AI助手相关接口
    ASSISTANT: {
        LIST: '/assistants',
        ACTIVE: '/assistants/active',
        CREATE: '/assistants',
        UPDATE: (id) => `/assistants/${id}`,
        DELETE: (id) => `/assistants/${id}`,
        CALL: (id) => `/assistants/${id}/call`,
        STATS: '/assistants/stats'
    },
    // 用户积分相关接口
    POINTS: {
        ADD: (userId) => `${API_BASE_URL}/users/${userId}/points`,
        DEDUCT: (userId) => `${API_BASE_URL}/users/${userId}/points/deduct`,
        HISTORY: (userId) => `${API_BASE_URL}/users/${userId}/points/history`,
    }
};

export default API_ENDPOINTS; 