import http from '../utils/http';
import logService, { ErrorType } from './logService';

const authService = {
  // 用户登录
  login: async (email, password) => {
    try {
      const response = await http.post(`/auth/login`, {
        email,
        password
      });

      console.log('Login response:', response.data);

      // 检查响应状态
      if (!response.data.success) {
        throw new Error(response.data.message || '登录失败');
      }

      // 从response.data.data中获取token和user
      const { token, user } = response.data.data;
      if (!token || !user) {
        throw new Error('登录失败：无效的响应数据');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    } catch (error) {
      console.error('Login error details:', error);
      authService.removeAuthHeader();
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  // 用户注册
  register: async (userData) => {
    try {
      const response = await http.post(`/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // 用户登出
  logout: () => {
    const user = authService.getCurrentUser();
    if (user) {
      logService.info('用户登出', { username: user.username });
    }
    authService.removeAuthHeader();
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // 确保用户对象中包含正确的ID字段
        return {
          ...user,
          _id: user.id || user._id // 兼容两种ID格式
        };
      }
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  },

  // 更新用户信息
  updateUserInfo: async (userData) => {
    try {
      logService.info('尝试更新用户信息', { userId: userData.id });
      const response = await http.put(`/users/profile`, userData);
      const currentUser = authService.getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      logService.info('用户信息更新成功', { userId: userData.id });
      return response.data;
    } catch (error) {
      logService.error('更新用户信息失败', error, ErrorType.API_ERROR);
      throw error;
    }
  },

  // 检查token是否有效
  checkAuth: async () => {
    try {
      logService.debug('检查认证状态');
      const response = await http.get(`/users/me`);
      return response.data;
    } catch (error) {
      logService.error('认证检查失败', error, ErrorType.AUTH_ERROR);
      authService.logout();
      throw error;
    }
  },

  // 移除认证头
  removeAuthHeader: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService; 