import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0a192f 0%, #2d1b4e 100%) !important;
  position: relative;
  overflow: hidden;
  z-index: 0;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    z-index: -1;
  }
`;

const StyledCard = styled(Card)`
  width: 400px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  
  .ant-card-body {
    padding: 40px;
  }

  h2 {
    color: #ffffff;
    text-align: center;
    margin-bottom: 40px;
    font-size: 32px;
    font-weight: 600;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    background: linear-gradient(to right, #fff, #6f42c1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 2s infinite linear;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% center;
    }
    100% {
      background-position: 200% center;
    }
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 16px;
    margin-bottom: 8px;
  }

  .ant-form-item {
    margin-bottom: 28px;
  }

  .ant-input-affix-wrapper {
    background: rgba(15, 23, 42, 0.6) !important;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    height: 50px;
    padding: 0 20px;
    transition: all 0.3s ease;
    
    input {
      background: transparent !important;
      color: #ffffff !important;
      font-size: 16px;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .anticon {
      color: rgba(255, 255, 255, 0.6);
      font-size: 20px;
      transition: all 0.3s ease;
    }

    &:hover {
      border-color: #6f42c1;
      background: rgba(15, 23, 42, 0.8) !important;
      transform: translateY(-2px);

      .anticon {
        color: #6f42c1;
      }
    }

    &:focus,
    &-focused {
      border-color: #6f42c1;
      box-shadow: 0 0 20px rgba(111, 66, 193, 0.2);
      background: rgba(15, 23, 42, 0.8) !important;
      transform: translateY(-2px);

      .anticon {
        color: #6f42c1;
      }
    }

    &-input-focused {
      background: rgba(15, 23, 42, 0.8) !important;
    }
  }

  .ant-input-password {
    background: rgba(15, 23, 42, 0.6) !important;
    
    input {
      background: transparent !important;
    }
  }

  .ant-input-password-icon {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    
    &:hover {
      color: #6f42c1;
    }
  }

  .ant-form-item-explain-error {
    color: #ff4d4f;
    margin-top: 8px;
    font-size: 14px;
  }

  .ant-input-disabled, 
  .ant-input-affix-wrapper-disabled {
    background: rgba(15, 23, 42, 0.4) !important;
    
    input {
      background: transparent !important;
    }
  }

  input::selection {
    background: rgba(111, 66, 193, 0.2);
    color: #ffffff;
  }

  // 覆盖浏览器自动填充样式
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: #ffffff !important;
    -webkit-box-shadow: 0 0 0 30px rgba(15, 23, 42, 0.6) inset !important;
    transition: background-color 5000s ease-in-out 0s;
    caret-color: white;
  }

  // 确保密码输入框的自动填充样式也被覆盖
  .ant-input-password input:-webkit-autofill,
  .ant-input-password input:-webkit-autofill:hover,
  .ant-input-password input:-webkit-autofill:focus,
  .ant-input-password input:-webkit-autofill:active {
    -webkit-text-fill-color: #ffffff !important;
    -webkit-box-shadow: 0 0 0 30px rgba(15, 23, 42, 0.6) inset !important;
  }

  // 确保输入框在所有状态下保持深色背景
  .ant-input-affix-wrapper {
    background: rgba(15, 23, 42, 0.6) !important;
    
    &:hover, &:focus, &-focused, &-input-focused {
      background: rgba(15, 23, 42, 0.8) !important;
    }

    input {
      background: transparent !important;
    }
  }

  // 确保密码框在所有状态下保持深色背景
  .ant-input-password {
    background: rgba(15, 23, 42, 0.6) !important;
    
    &:hover, &:focus, &-focused {
      background: rgba(15, 23, 42, 0.8) !important;
    }
  }
`;

const StyledButton = styled(Button)`
  height: 50px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #8a65d9 0%, #6f42c1 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  margin-top: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.6s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #9d7fea 0%, #8a65d9 100%);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(1px);
  }

  span {
    color: #ffffff !important;
    font-size: 18px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const StyledLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: #6f42c1;
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: #6f42c1;
    text-shadow: 0 0 10px rgba(111, 66, 193, 0.5);
    
    &::after {
      width: 100%;
    }
  }
`;

const TechLines = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  opacity: 0.3;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 200vw;
    height: 200vh;
    top: -50%;
    left: -50%;
    background-image: 
      linear-gradient(90deg, rgba(111, 66, 193, 0.1) 1px, transparent 1px),
      linear-gradient(0deg, rgba(111, 66, 193, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    animation: techMove 30s linear infinite;
    transform-origin: center center;
  }

  &::after {
    animation: techMove 40s linear infinite;
    opacity: 0.3;
    background-size: 50px 50px;
  }

  @keyframes techMove {
    0% {
      transform: rotate(0deg) scale(1);
    }
    100% {
      transform: rotate(360deg) scale(1.2);
    }
  }
`;

const FloatingParticles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;

  .particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #6f42c1;
    border-radius: 50%;
    filter: blur(1px);
    animation: float 30s infinite linear;
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-1000px) translateX(100px);
      opacity: 0;
    }
  }
`;

const BrandLogo = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(45deg, #8a65d9 0%, #6f42c1 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);
`;

const BrandName = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to right, #fff, #6f42c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BrandContainer = styled(Link)`
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1000;
  text-decoration: none;
  padding: 10px;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    
    ${BrandLogo} {
      box-shadow: 0 8px 25px rgba(111, 66, 193, 0.4);
    }
    
    ${BrandName} {
      text-shadow: 0 4px 15px rgba(111, 66, 193, 0.5);
    }
  }
`;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (loading) return;
    
    try {
      setLoading(true);
      await login(values.email, values.password);
      message.success('登录成功');
      // 确保在导航之前有短暂延迟，让消息显示完成
      setTimeout(() => {
        navigate('/chat', { replace: true });
      }, 500);
    } catch (error) {
      console.error('Login failed:', error);
      message.error(error.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时清除旧的认证信息
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return (
    <PageWrapper>
      <TechLines />
      <FloatingParticles className="particles-container" />
      <BrandContainer to="/">
        <BrandLogo>域</BrandLogo>
        <BrandName>域锦科技</BrandName>
      </BrandContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledCard>
          <h2>登录</h2>
          <StyledForm
            form={form}
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="请输入注册时使用的邮箱" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <StyledButton 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                登录
              </StyledButton>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <StyledLink to="/register">还没有账号？立即注册</StyledLink>
            </div>
          </StyledForm>
        </StyledCard>
      </motion.div>
    </PageWrapper>
  );
};

export default LoginPage; 