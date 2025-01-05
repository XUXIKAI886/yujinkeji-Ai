import React from 'react';
import { Button, Typography, Row, Col, Space } from 'antd';
import { 
  RightOutlined, 
  CustomerServiceOutlined, 
  ShopOutlined, 
  BarChartOutlined,
  RobotOutlined,
  ApiOutlined,
  CloudSyncOutlined,
  WechatOutlined,
  MessageOutlined,
  LikeOutlined,
  SearchOutlined,
  PieChartOutlined,
  RadarChartOutlined,
  LineChartOutlined,
  RocketOutlined,
  AreaChartOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '../components/Header';

const { Title, Paragraph } = Typography;

const HeroSection = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);
  padding: 60px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  .hero-content {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding-top: 60px;
  }

  .left-content {
    text-align: center;
    padding: 0 40px;
    margin-bottom: 60px;

    @media (min-width: 768px) {
      text-align: left;
      margin-bottom: 0;
    }
  }

  .right-content {
    position: relative;
    padding: 0 40px;

    &::before {
      content: '';
      position: absolute;
      top: -20px;
      right: -20px;
      bottom: -20px;
      left: -20px;
      background: linear-gradient(135deg, rgba(0, 198, 251, 0.1) 0%, rgba(0, 91, 234, 0.1) 100%);
      border-radius: 30px;
      backdrop-filter: blur(10px);
      transform: rotate(-2deg);
      z-index: 0;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, rgba(147, 197, 253, 0.1), transparent, rgba(147, 197, 253, 0.1));
      border-radius: 25px;
      animation: borderGlow 6s linear infinite;
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
  opacity: 0.5;
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
    animation: techMove 15s linear infinite;
    transform-origin: center center;
    pointer-events: none;
  }

  &::after {
    animation: techMove 20s linear infinite;
    opacity: 0.3;
    background-size: 50px 50px;
  }

  @keyframes techMove {
    0% {
      transform: rotate(0deg) scale(1);
    }
    100% {
      transform: rotate(360deg) scale(1.5);
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
    animation: float 20s infinite linear;
    pointer-events: none;
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(-1000px) translateX(100px);
      opacity: 0;
    }
  }
`;

const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  border: 1px solid rgba(147, 197, 253, 0.2);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  transform-origin: center center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

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
      rgba(147, 197, 253, 0.1),
      transparent
    );
    transition: 0.5s;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(147, 197, 253, 0.2), transparent, rgba(147, 197, 253, 0.2));
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .service-icon {
    font-size: 36px;
    margin-bottom: 20px;
    color: rgba(147, 197, 253, 0.9);
    text-shadow: 0 0 20px rgba(147, 197, 253, 0.4);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;

    svg {
      filter: drop-shadow(0 0 8px rgba(147, 197, 253, 0.4));
    }
  }

  .service-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 15px;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  .service-description {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(147, 197, 253, 0.4);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(147, 197, 253, 0.2),
      inset 0 0 20px rgba(147, 197, 253, 0.1);

    &::before {
      left: 100%;
    }

    &::after {
      opacity: 1;
    }

    .service-icon {
      transform: scale(1.2);
      color: #00F5FF;
      filter: drop-shadow(0 0 10px rgba(0, 245, 255, 0.5));
    }

    .service-title {
      color: #00F5FF;
      transform: translateY(-2px);
      text-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
    }

    .service-description {
      color: rgba(255, 255, 255, 0.95);
      transform: translateY(-2px);
    }
  }
`;

const GradientText = styled(motion.span)`
  background: linear-gradient(45deg, #ffffff 30%, #00c6fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
  display: inline-block;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
  border: none;
  color: white;
  height: 48px;
  padding: 0 35px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 24px;
  box-shadow: 
    0 10px 20px rgba(0, 198, 251, 0.3),
    0 6px 6px rgba(0, 91, 234, 0.2),
    0 0 0 1px rgba(0, 198, 251, 0.1) inset;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

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
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: 0.5s;
  }

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(90deg, #00c6fb, #005bea);
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite;
    border-radius: 24px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
    box-shadow: 
      0 15px 30px rgba(0, 198, 251, 0.4),
      0 8px 12px rgba(0, 91, 234, 0.3),
      0 0 0 1px rgba(0, 198, 251, 0.2) inset;
    
    &::before {
      left: 100%;
    }
    
    &::after {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(1px) scale(0.98);
  }

  .anticon {
    margin-left: 8px;
    font-size: 16px;
    transition: transform 0.3s ease;
  }

  &:hover .anticon {
    transform: translateX(4px);
  }

  @keyframes borderGlow {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.02);
    }
  }
`;

const AnimatedTitle = styled(motion.div)`
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    
    .gradient-text {
      background-size: 200% auto;
      background-position: right center;
      filter: brightness(1.2);
    }
    
    .normal-text {
      color: #00c6fb;
      transform: translateY(-2px);
      text-shadow: 0 0 20px rgba(0, 198, 251, 0.5);
    }
  }
`;

const AnimatedText = styled(motion.span)`
  display: inline-block;
  transition: all 0.3s ease;

  &.normal-text {
    color: white;
  }

  &:hover {
    transform: translateY(-2px);
    color: #00c6fb;
    text-shadow: 0 0 20px rgba(0, 198, 251, 0.5);
  }
`;

const AnimatedParagraph = styled(Paragraph)`
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #00c6fb !important;
    transform: translateY(-2px);
    text-shadow: 0 0 20px rgba(0, 198, 251, 0.3);
  }
`;

const CallToAction = styled.div`
  text-align: center;
  padding: 120px 0;
  position: relative;
  z-index: 10;
  background: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(2px 2px at 40px 60px, #fff 100%, transparent),
      radial-gradient(2px 2px at 20px 50px, #fff 100%, transparent),
      radial-gradient(2px 2px at 30px 100px, #fff 100%, transparent),
      radial-gradient(2px 2px at 40px 60px, #fff 100%, transparent),
      radial-gradient(2px 2px at 110px 90px, #fff 100%, transparent),
      radial-gradient(2px 2px at 190px 150px, #fff 100%, transparent);
    background-repeat: repeat;
    background-size: 200px 200px;
    animation: stars 8s linear infinite;
    opacity: 0.3;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(125deg, rgba(147, 197, 253, 0.05), rgba(96, 165, 250, 0.05));
    animation: gradient 15s ease infinite;
    z-index: 2;
  }

  @keyframes stars {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-200px);
    }
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 3;
  }

  h2 {
    color: rgba(255, 255, 255, 0.9);
    font-size: 48px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    &:hover {
      transform: translateY(-3px);
      color: rgba(147, 197, 253, 0.9);
      text-shadow: 0 0 20px rgba(147, 197, 253, 0.3);
    }
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 20px;
    margin-bottom: 40px;
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      color: rgba(147, 197, 253, 0.8) !important;
    }
  }
`;

const CTAButton = styled(StyledButton)`
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%);
  border: 1px solid rgba(147, 197, 253, 0.4);
  color: white;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(147, 197, 253, 0.2),
    inset 0 0 20px rgba(147, 197, 253, 0.1);
  backdrop-filter: blur(10px);
  padding: 0 50px;
  height: 56px;
  font-size: 18px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, rgba(147, 197, 253, 0.3), transparent, rgba(147, 197, 253, 0.3));
    z-index: -1;
    animation: borderGlow 3s linear infinite;
  }

  &::after {
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
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0.4) 100%);
    border-color: rgba(147, 197, 253, 0.6);
    color: white;
    box-shadow: 
      0 8px 25px rgba(147, 197, 253, 0.3),
      0 0 0 1px rgba(147, 197, 253, 0.4),
      inset 0 0 30px rgba(147, 197, 253, 0.2);
    text-shadow: 0 0 20px rgba(147, 197, 253, 0.6);
    transform: translateY(-3px) scale(1.02);

    &::after {
      left: 100%;
    }
  }

  span {
    color: white;
    text-shadow: 0 0 20px rgba(147, 197, 253, 0.4);
    font-weight: 500;
  }

  @keyframes borderGlow {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const SocialIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;

  &:hover {
    transform: translateY(-5px);
    background: rgba(147, 197, 253, 0.2);
    box-shadow: 0 5px 15px rgba(147, 197, 253, 0.2);
  }

  svg {
    width: 28px;
    height: 28px;
    color: rgba(255, 255, 255, 0.9);
  }

  &:hover svg {
    color: #fff;
  }

  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const SocialMediaSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
  padding: 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(147, 197, 253, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, rgba(147, 197, 253, 0.2), transparent, rgba(147, 197, 253, 0.2));
    z-index: 0;
    animation: borderGlow 6s linear infinite;
  }
  
  .social-title {
    color: white;
    font-size: 20px;
    margin-right: 30px;
    position: relative;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, rgba(147, 197, 253, 0.5), transparent);
    }
  }

  .social-icons {
    display: flex;
    gap: 20px;
    z-index: 1;
  }
`;

const FooterSection = styled.div`
  position: relative;
  background: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);
  padding: 80px 0 40px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(90deg, rgba(147, 197, 253, 0.05) 1px, transparent 1px),
      linear-gradient(0deg, rgba(147, 197, 253, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    animation: techMove 15s linear infinite;
    transform-origin: center center;
    opacity: 0.3;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(147, 197, 253, 0.1) 0%, transparent 50%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes techMove {
    0% {
      transform: rotate(0deg) scale(1);
    }
    100% {
      transform: rotate(360deg) scale(1.5);
    }
  }

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.5;
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 10;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    color: rgba(255, 255, 255, 0.8);
  }

  .footer-section {
    h3 {
      color: white;
      font-size: 20px;
      margin-bottom: 20px;
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 2px;
        background: rgba(147, 197, 253, 0.5);
        transition: width 0.3s ease;
      }

      &:hover::after {
        width: 100%;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 12px;
        transition: all 0.3s ease;

        a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;

          &:hover {
            color: rgba(147, 197, 253, 0.9);
            transform: translateX(5px);
          }
        }
      }
    }
  }

  .footer-bottom {
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }
`;

const ServiceSection = styled.div`
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  padding: 120px 20px;
  position: relative;
  overflow: hidden;

  h2 {
    text-align: center;
    font-size: 48px;
    margin-bottom: 80px;
    color: white;
    position: relative;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 2;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const PreviewImage = styled(motion.div)`
  position: relative;
  z-index: 1;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(147, 197, 253, 0.2);
  
  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 20px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 198, 251, 0.1) 0%, rgba(0, 91, 234, 0.1) 100%);
    pointer-events: none;
  }

  .glow-effect {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(147, 197, 253, 0.1) 0%, transparent 70%);
    animation: rotate 10s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const services = [
  {
    icon: <CustomerServiceOutlined />,
    title: '美团全能客服',
    description: '智能客服系统，24小时自动回复，提高客户满意度'
  },
  {
    icon: <ShopOutlined />,
    title: '美团品牌定位设计',
    description: '专业的品牌形象设计，打造独特的品牌识别度'
  },
  {
    icon: <ApiOutlined />,
    title: '美团分类栏描述',
    description: '优化分类展示，提升用户浏览体验'
  },
  {
    icon: <RobotOutlined />,
    title: '外卖套餐搭配助手',
    description: '智能推荐最优套餐组合，提升客单价'
  },
  {
    icon: <MessageOutlined />,
    title: '美团评价解释助手',
    description: '智能分析评价内容，及时处理客户反馈'
  },
  {
    icon: <LikeOutlined />,
    title: '补单专用外卖好评',
    description: '智能生成真实好评，提升店铺评分'
  },
  {
    icon: <BarChartOutlined />,
    title: '美团店铺分析',
    description: '深度分析店铺数据，发现增长机会'
  },
  {
    icon: <SearchOutlined />,
    title: '美团关键词优化助手',
    description: '智能优化搜索关键词，提升曝光率'
  },
  {
    icon: <PieChartOutlined />,
    title: '外卖数据周报分析',
    description: '自动生成数据分析报告，掌握经营动态'
  },
  {
    icon: <RadarChartOutlined />,
    title: '外卖竞品数据分析',
    description: '全面分析竞争对手，制定竞争策略'
  },
  {
    icon: <LineChartOutlined />,
    title: '外卖店铺数据分析',
    description: '多维度分析店铺表现，优化经营策略'
  },
  {
    icon: <CloudSyncOutlined />,
    title: '一键采集同行数据',
    description: '快速获取市场数据，了解行业动态'
  },
  {
    icon: <RocketOutlined />,
    title: '自动上线关键词',
    description: '智能优化关键词，提升搜索排名'
  },
  {
    icon: <AreaChartOutlined />,
    title: '外卖数据可视化',
    description: '直观展示经营数据，辅助决策分析'
  },
  {
    icon: <AppstoreOutlined />,
    title: '店铺运营诊断',
    description: '全方位诊断店铺问题，提供优化方案'
  }
];

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  React.useEffect(() => {
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      <Header />
      <HeroSection>
        <TechLines />
        <FloatingParticles className="particles-container" />
        <motion.div style={{ opacity, scale }} className="hero-content">
          <Row justify="center" align="middle" style={{ width: '100%' }}>
            <Col xs={24} md={12} className="left-content">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <AnimatedTitle>
                  <Title style={{ 
                    color: 'white', 
                    fontSize: '64px', 
                    marginBottom: '20px',
                    fontWeight: 800,
                    lineHeight: 1.2,
                  }}>
                    <GradientText className="gradient-text">域锦科技</GradientText>
                    <br />
                    <AnimatedText
                      className="normal-text"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      AI赋能运营新时代
                    </AnimatedText>
                  </Title>
                </AnimatedTitle>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <AnimatedParagraph style={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: '20px', 
                    marginBottom: '40px',
                    lineHeight: 1.6
                  }}>
                    为代运营公司提供全方位智能化运营解决方案
                    <br />
                    提升效率，降低成本，助力业务增长
                  </AnimatedParagraph>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <Space size="large">
                    <Link to="/register">
                      <StyledButton>
                        免费试用 <RightOutlined />
                      </StyledButton>
                    </Link>
                  </Space>
                </motion.div>
              </motion.div>
            </Col>
            <Col xs={24} md={12} className="right-content">
              <PreviewImage
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="glow-effect" />
                <img
                  src="/assets/dashboard-preview.svg"
                  alt="AI助手界面预览"
                />
              </PreviewImage>
            </Col>
          </Row>
        </motion.div>
      </HeroSection>

      <ServiceSection>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2>我们的服务</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="service-icon">{service.icon}</div>
                <div className="service-title">{service.title}</div>
                <div className="service-description">{service.description}</div>
              </ServiceCard>
            ))}
          </div>
        </motion.div>
      </ServiceSection>

      <div style={{ 
        background: '#ffffff',
        padding: '120px 20px',
        position: 'relative',
        zIndex: 10
      }}>
        <CallToAction>
          <div className="content-wrapper">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Title level={2}>准备好开始了吗？</Title>
              <Paragraph>
                立即注册，获得30积分免费体验全部功能
              </Paragraph>
              <Link to="/register">
                <CTAButton type="primary" size="large">
                  开始使用 <RightOutlined />
                </CTAButton>
              </Link>
            </motion.div>
          </div>
        </CallToAction>
      </div>
      <FooterSection>
        <div className="content-wrapper">
          <SocialMediaSection>
            <div className="social-title">关注我们</div>
            <div className="social-icons">
              <SocialIcon data-tooltip="微信公众号">
                <WechatOutlined />
              </SocialIcon>
              <SocialIcon data-tooltip="抖音号">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M36.5 12.5C36.5 12.5 33.5 9.5 28 9.5V30.5C28 35.5 24 39.5 19 39.5C14 39.5 10 35.5 10 30.5C10 25.5 14 21.5 19 21.5V27.5C17 27.5 16 29 16 30.5C16 32 17 33.5 19 33.5C21 33.5 22 32 22 30.5V3.5H28C28 8.5 33 12.5 36.5 12.5V18.5C31.5 18.5 29 16.5 28 15.5V30.5C28 35.5 24 39.5 19 39.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </SocialIcon>
              <SocialIcon data-tooltip="小红书">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7C5 5.89543 5.89543 5 7 5H41C42.1046 5 43 5.89543 43 7V41C43 42.1046 42.1046 43 41 43H7C5.89543 43 5 42.1046 5 41V7Z" stroke="currentColor" strokeWidth="3"/>
                  <path d="M15 19L24 28L33 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M24 12V28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M17 32H31" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </SocialIcon>
            </div>
          </SocialMediaSection>
          <div className="footer-content">
            <div className="footer-section">
              <h3>产品服务</h3>
              <ul>
                <li><Link to="/features">功能特性</Link></li>
                <li><Link to="/pricing">价格方案</Link></li>
                <li><Link to="/cases">成功案例</Link></li>
                <li><Link to="/api">API文档</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>帮助支持</h3>
              <ul>
                <li><Link to="/help">帮助中心</Link></li>
                <li><Link to="/contact">联系我们</Link></li>
                <li><Link to="/feedback">意见反馈</Link></li>
                <li><Link to="/status">系统状态</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>关于我们</h3>
              <ul>
                <li><Link to="/about">公司介绍</Link></li>
                <li><Link to="/join">加入我们</Link></li>
                <li><Link to="/partners">合作伙伴</Link></li>
                <li><Link to="/blog">技术博客</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>法律条款</h3>
              <ul>
                <li><Link to="/terms">服务条款</Link></li>
                <li><Link to="/privacy">隐私政策</Link></li>
                <li><Link to="/security">安全说明</Link></li>
                <li><Link to="/compliance">合规认证</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 域锦科技. All rights reserved.</p>
          </div>
        </div>
      </FooterSection>
    </div>
  );
};

export default LandingPage; 