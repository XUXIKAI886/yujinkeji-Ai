import http from '../utils/http';

// 生成邀请码
export const generateInviteCode = async () => {
    try {
        const response = await http.post('/invite-codes/generate');
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || '生成邀请码失败'
        };
    }
};

// 验证邀请码
export const verifyInviteCode = async (code) => {
    try {
        const response = await http.post('/invite-codes/verify', { code });
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || '验证邀请码失败'
        };
    }
}; 