import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import authService from '../services/auth.service';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1f35 0%, #0f172a 100%);
  position: relative;
  overflow: hidden;
`;

const StyledCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;

  h2 {
    color: #ffffff;
    text-align: center;
    font-size: 28px;
    margin-bottom: 30px;
    font-weight: 600;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
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
      border-color: #00F5FF;
      background: rgba(15, 23, 42, 0.8) !important;
      transform: translateY(-2px);

      .anticon {
        color: #00F5FF;
      }
    }

    &:focus,
    &-focused {
      border-color: #00F5FF;
      box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
      background: rgba(15, 23, 42, 0.8) !important;
      transform: translateY(-2px);

      .anticon {
        color: #00F5FF;
      }
    }
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
      color: #00F5FF;
    }
  }

  .ant-form-item-extra {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const StyledButton = styled(Button)`
  height: 50px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(147, 197, 253, 0.8) 0%, rgba(96, 165, 250, 0.8) 100%);
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
    background: linear-gradient(135deg, rgba(147, 197, 253, 0.9) 0%, rgba(96, 165, 250, 0.9) 100%);
    
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
    background: #00F5FF;
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: #00F5FF;
    text-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
    
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
      linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px),
      linear-gradient(0deg, rgba(0,245,255,0.1) 1px, transparent 1px);
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
    background: #00F5FF;
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
  background: linear-gradient(45deg, #00c6fb 0%, #005bea 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 198, 251, 0.3);
`;

const BrandName = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to right, #fff, #00F5FF);
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
      box-shadow: 0 8px 25px rgba(0, 198, 251, 0.4);
    }
    
    ${BrandName} {
      text-shadow: 0 4px 15px rgba(0, 198, 251, 0.5);
    }
  }
`;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log('注册参数:', values);
      const response = await authService.register({
        email: values.email,
        password: values.password,
        username: values.username,
        inviteCode: values.inviteCode
      });
      
      if (response?.success) {
        message.success('注册成功');
        // 确保在导航之前有短暂延迟，让消息显示完成
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error('注册失败:', error.response?.data);
      message.error(error.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

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
          <h2>注册</h2>
          <StyledForm
            form={form}
            name="register"
            onFinish={onFinish}
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
                prefix={<MailOutlined />} 
                placeholder="邮箱" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码至少8个字符' },
                {
                  validator: async (_, value) => {
                    if (!value) return Promise.reject();
                    
                    if (!/[A-Z]/.test(value)) {
                      return Promise.reject('密码必须包含大写字母');
                    }
                    if (!/[a-z]/.test(value)) {
                      return Promise.reject('密码必须包含小写字母');
                    }
                    if (!/\d/.test(value)) {
                      return Promise.reject('密码必须包含数字');
                    }
                    if (!/[!@#$%^&*(),.?:{}|<>]/.test(value)) {
                      return Promise.reject('密码必须包含特殊字符');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
              extra={'密码必须包含：大写字母、小写字母、数字和特殊字符(!@#$%^&*(),.?:{}|<>)'}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="inviteCode"
              rules={[
                { required: true, message: '请输入邀请码' },
                { len: 8, message: '邀请码长度必须为8位' }
              ]}
            >
              <Input
                prefix={<KeyOutlined />}
                placeholder="邀请码"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <StyledButton 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                注册
              </StyledButton>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <StyledLink to="/login">已有账号？立即登录</StyledLink>
            </div>
          </StyledForm>
        </StyledCard>
      </motion.div>
    </PageWrapper>
  );
};

export default RegisterPage; 