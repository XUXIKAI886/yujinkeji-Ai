import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../styles/theme';
import GlobalStyles from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';

// 页面组件
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ChatLayout from '../components/ChatLayout';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import AdminLayout from '../components/AdminLayout';
import UserManagement from '../pages/admin/UserManagement';
import AIAssistantManagement from '../pages/admin/AIAssistantManagement';
import Statistics from '../pages/admin/Statistics';
import SystemSettings from '../pages/admin/SystemSettings';
import DisclaimerPage from '../pages/DisclaimerPage';
import PrivacyPage from '../pages/PrivacyPage';

// 受保护的路由组件
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return null; // 或者返回加载指示器
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#00c6fb',
            borderRadius: 8,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
          components: {
            Button: {
              borderRadius: 8,
              controlHeight: 40,
              paddingContentHorizontal: 24,
            },
            Input: {
              borderRadius: 8,
              controlHeight: 40,
            },
            Card: {
              borderRadius: 16,
            },
            Modal: {
              borderRadius: 16,
            },
            Select: {
              borderRadius: 8,
              controlHeight: 40,
            },
          },
        }}
        locale={zhCN}
      >
        <GlobalStyles />
        <Routes>
          {/* 公开路由 */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/about" element={<iframe src="/about/index.html" title="关于域锦科技" style={{border: 'none', width: '100%', height: '100vh'}} />} />

          {/* 用户路由 */}
          <Route
            path="/chat/*"
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* 管理员路由 */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="assistants" element={<AIAssistantManagement />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>

          {/* 404 路由 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default AppRoutes; 