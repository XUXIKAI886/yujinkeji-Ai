import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 25px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background: ${props => props.isScrolled ? 'rgba(0, 4, 40, 0.9)' : 'transparent'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'};

  .right-section {
    display: flex;
    gap: 30px;
    align-items: center;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: white;
  font-size: 28px;
  font-weight: 700;

  &:hover {
    color: #6f42c1;
  }
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8a65d9 0%, #6f42c1 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 15px rgba(111, 66, 193, 0.3);
`;

const LoginButton = styled(Button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  height: 48px;
  padding: 0 35px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(111, 66, 193, 0.1);
    border-color: rgba(111, 66, 193, 0.3);
    color: white;
    transform: translateY(-2px);
    box-shadow: 
      0 5px 15px rgba(111, 66, 193, 0.2),
      0 0 0 1px rgba(111, 66, 193, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const RegisterButton = styled(Button)`
  background: linear-gradient(135deg, #8a65d9 0%, #6f42c1 100%);
  border: none;
  color: white;
  height: 48px;
  padding: 0 35px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 24px;
  box-shadow: 
    0 5px 15px rgba(111, 66, 193, 0.3),
    0 3px 6px rgba(111, 66, 193, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(135deg, #8a65d9 0%, #6f42c1 100%);
    box-shadow: 
      0 8px 20px rgba(111, 66, 193, 0.4),
      0 4px 8px rgba(111, 66, 193, 0.3);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(1px);
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.05);

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #8a65d9, #6f42c1);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover {
    color: white;
    background: rgba(111, 66, 193, 0.1);
    border-color: rgba(111, 66, 193, 0.3);
    
    &::before {
      width: 80%;
    }
  }

  &.active {
    background: rgba(111, 66, 193, 0.15);
    border-color: rgba(111, 66, 193, 0.4);
    color: white;
    
    &::before {
      width: 90%;
    }
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 如果在登录或注册页面，不显示header
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <HeaderWrapper isScrolled={isScrolled}>
      <Logo to="/">
        <LogoIcon>域</LogoIcon>
        域锦科技
      </Logo>
      <div className="right-section">
        <NavLink as="a" href="/about" target="_blank" rel="noopener noreferrer">关于域锦科技</NavLink>
        <NavLink as="a" href="https://subsidiary.example.com" target="_blank" rel="noopener noreferrer">子公司官网</NavLink>
        <Link to="/login">
          <LoginButton>
            登录
          </LoginButton>
        </Link>
        <Link to="/register">
          <RegisterButton>
            免费注册
          </RegisterButton>
        </Link>
      </div>
    </HeaderWrapper>
  );
};

export default Header; 