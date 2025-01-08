import React, { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          await authService.checkAuth();
          setUser(currentUser);
        }
      } catch (error) {
        // 保留错误处理，但不打印日志
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response?.token && response?.user) {
        const user = {
          ...response.user,
          _id: response.user.id || response.user._id
        };
        setUser(user);
        return { success: true, data: { ...response, user } };
      } else {
        throw new Error('登录响应格式错误');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      authService.removeAuthHeader();
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data);
      message.success('注册成功，已赠送30积分');
      return data;
    } catch (error) {
      message.error(error.response?.data?.message || '注册失败');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    message.success('已安全退出');
  };

  const updateUserInfo = async (userData) => {
    try {
      const data = await authService.updateUserInfo(userData);
      setUser(prev => ({ ...prev, ...data }));
      message.success('个人信息更新成功');
      return data;
    } catch (error) {
      message.error(error.response?.data?.message || '更新失败');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserInfo,
    isAuthenticated: !!user,
    updateUser: (userData) => {
      setUser(userData);
    }
  };

  if (loading) {
    return null; // 或者返回一个加载指示器
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 