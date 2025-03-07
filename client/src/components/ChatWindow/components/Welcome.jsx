import React from 'react';
import styled, { keyframes } from 'styled-components';
import { RobotOutlined, MessageOutlined, StarOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const WelcomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    background: linear-gradient(135deg, rgba(245, 247, 255, 0.9), rgba(255, 255, 255, 0.95));

    @media (max-width: 768px) {
        padding: 1.2rem;
    }
`;

const Title = styled.h1`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 2rem;
    color: #2d1b69;
    margin-bottom: 1.2rem;
    margin-top: -0.5rem;
    letter-spacing: -0.01em;
    font-weight: 800;
    position: relative;
    text-shadow: 0 2px 10px rgba(111, 66, 193, 0.15);
    animation: ${fadeIn} 1s ease-out;
    
    @media (max-width: 768px) {
        font-size: 1.6rem;
        margin-bottom: 1rem;
        margin-top: 0;
        gap: 0.5rem;
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 70px;
        height: 3px;
        background: linear-gradient(90deg, #8a65d9, #6f42c1);
        border-radius: 4px;
        animation: ${shimmer} 3s infinite linear;
        background-size: 200% 100%;
        background-image: linear-gradient(
            to right,
            #8a65d9, #6f42c1, #8a65d9, #6f42c1
        );
        
        @media (max-width: 768px) {
            bottom: -6px;
            width: 50px;
            height: 2px;
        }
    }
`;

const Description = styled.p`
    font-size: 0.95rem;
    color: #4b5563;
    text-align: center;
    margin-bottom: 1.6rem;
    line-height: 1.4;
    max-width: 850px;
    letter-spacing: 0.01em;
    animation: ${fadeIn} 1.2s ease-out;
    background: linear-gradient(120deg, #4b5563, #1f2937);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    font-weight: 300;
    
    @media (max-width: 768px) {
        font-size: 0.8rem;
        line-height: 1.25;
        margin-bottom: 1rem;
        padding: 0 0.5rem;
        font-weight: 300;
    }
`;

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    width: 100%;
    margin: 2rem 0;
    animation: ${fadeIn} 1.4s ease-out;
    position: relative;
    z-index: 10;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.2rem;
        margin: 1.5rem 0;
    }
`;

const FeatureCard = styled.div`
    background: rgba(255, 255, 255, 0.9);
    padding: 1.5rem;
    border-radius: 18px;
    box-shadow: 0 10px 25px rgba(111, 66, 193, 0.08), 0 6px 12px rgba(111, 66, 193, 0.03);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(229, 231, 235, 0.8);
    backdrop-filter: blur(10px);
    
    @media (max-width: 768px) {
        padding: 1.2rem;
        border-radius: 14px;
    }
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #8a65d9, #6f42c1);
        opacity: 0.8;
    }

    &:hover {
        transform: translateY(-8px) scale(1.01);
        box-shadow: 0 20px 35px rgba(111, 66, 193, 0.12), 0 10px 20px rgba(111, 66, 193, 0.06);
        border-color: rgba(111, 66, 193, 0.2);
        
        @media (max-width: 768px) {
            transform: translateY(-5px) scale(1.01);
        }
        
        &::before {
            height: 5px;
            animation: ${shimmer} 2s infinite linear;
            background-size: 200% 100%;
            background-image: linear-gradient(
                to right,
                #8a65d9, #6f42c1, #8a65d9, #6f42c1
            );
        }
    }
`;

const FeatureIcon = styled.div`
    font-size: 2rem;
    color: #6f42c1;
    margin-bottom: 1rem;
    transition: all 0.5s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, rgba(138, 101, 217, 0.1), rgba(111, 66, 193, 0.15));
    border-radius: 16px;
    box-shadow: 0 6px 15px rgba(111, 66, 193, 0.1);
    border: 2px solid rgba(111, 66, 193, 0.08);
    
    @media (max-width: 768px) {
        font-size: 1.8rem;
        width: 50px;
        height: 50px;
        margin-bottom: 0.8rem;
        border-radius: 14px;
    }
    
    ${FeatureCard}:hover & {
        transform: scale(1.12) rotate(8deg);
        box-shadow: 0 8px 20px rgba(111, 66, 193, 0.2);
        background: linear-gradient(135deg, rgba(138, 101, 217, 0.15), rgba(111, 66, 193, 0.2));
        animation: ${floatAnimation} 3s ease infinite;
    }
`;

const FeatureTitle = styled.h3`
    font-size: 1.25rem;
    color: #2d1b69;
    margin-bottom: 0.8rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    position: relative;
    display: inline-block;
    
    @media (max-width: 768px) {
        font-size: 1.15rem;
        margin-bottom: 0.6rem;
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 35px;
        height: 2px;
        background: linear-gradient(90deg, #8a65d9, #6f42c1);
        border-radius: 2px;
        transition: width 0.4s ease;
    }
    
    ${FeatureCard}:hover &::after {
        width: 100%;
    }
`;

const FeatureDescription = styled.p`
    font-size: 0.95rem;
    color: #6b7280;
    line-height: 1.5;
    margin-top: 0.5rem;
    
    @media (max-width: 768px) {
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    ${FeatureCard}:hover & {
        color: #4b5563;
    }
`;

const Footer = styled.footer`
    margin-top: 2rem;
    padding-top: 1.5rem;
    text-align: center;
    width: 100%;
    border-top: 1px solid rgba(229, 231, 235, 0.6);
    
    a {
        color: #6b7280;
        text-decoration: none;
        margin: 0 10px;
        transition: color 0.3s ease;
        position: relative;
        
        &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background: #6f42c1;
            transition: width 0.3s ease;
        }

        &:hover {
            color: #6f42c1;
            
            &:after {
                width: 100%;
            }
        }
    }
`;

const StyledVideo = styled.video`
    display: block;
    width: 100%;
    max-width: 900px;
    height: auto;
    max-height: 100%;
    margin: 1.8rem auto 2.5rem;
    padding: 0;
    line-height: 0;
    object-fit: contain;
    object-position: center;
    position: relative;
    z-index: 100;
    border-radius: 24px;
    background-color: #000;
    box-shadow: 0 20px 40px rgba(111, 66, 193, 0.15), 0 15px 25px rgba(0, 0, 0, 0.1);
    border: 3px solid rgba(138, 101, 217, 0.3);
    
    @media (max-width: 960px) {
        max-width: 95%;
        margin: 1.2rem auto 2rem;
    }
    
    @media (max-width: 480px) {
        max-width: 100%;
        margin: 0.8rem auto 1.5rem;
        border-radius: 16px;
        border-width: 2px;
    }
`;

const Welcome = () => {
    return (
        <WelcomeContainer>
            <Title>
                <RobotOutlined style={{ fontSize: '1.6rem', color: '#6f42c1' }} />
                智能引擎 · 域锦AI助手
            </Title>
            
            <Description>
                您的专属外卖运营智能顾问，集结多种专业AI能力，为您的业务赋能。从左侧选择合适的AI助手，轻松应对各类场景需求，让运营效率提升3-5倍，
让创意无限绽放。
            </Description>

            <StyledVideo
                controls
                autoPlay
                playsInline
                src="/shipin/HeyGen Explainer Video.mp4"
                type="video/mp4"
            />

            <FeaturesGrid>
                <FeatureCard>
                    <FeatureIcon>
                        <MessageOutlined />
                    </FeatureIcon>
                    <FeatureTitle>智能对话</FeatureTitle>
                    <FeatureDescription>
                        支持自然语言交互，为您提供准确、专业的回答和建议
                    </FeatureDescription>
                </FeatureCard>

                <FeatureCard>
                    <FeatureIcon>
                        <FileTextOutlined />
                    </FeatureIcon>
                    <FeatureTitle>文件分析</FeatureTitle>
                    <FeatureDescription>
                        支持多种文件格式的智能分析，包括PDF、Word、Excel等文档
                    </FeatureDescription>
                </FeatureCard>

                <FeatureCard>
                    <FeatureIcon>
                        <StarOutlined />
                    </FeatureIcon>
                    <FeatureTitle>专业助手</FeatureTitle>
                    <FeatureDescription>
                        提供多个领域的专业AI助手，包括外卖运营、文案创作、数据分析等
                    </FeatureDescription>
                </FeatureCard>
            </FeaturesGrid>

            <Footer>
                <Link to="/disclaimer">免责声明</Link>
                <Link to="/privacy">隐私声明</Link>
                <div style={{ marginTop: '1rem', color: '#9ca3af', fontSize: '0.9rem' }}>
                    © 2025 域锦科技 保留所有权利 | 
                    <a 
                        href="https://beian.miit.gov.cn" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#9ca3af', textDecoration: 'none', marginLeft: '8px' }}
                    >
                        鄂ICP备2025094131号-1
                    </a>
                </div>
            </Footer>
        </WelcomeContainer>
    );
};

export default Welcome;