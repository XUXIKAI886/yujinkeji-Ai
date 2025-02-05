import React from 'react';
import styled from 'styled-components';
import { RobotOutlined, MessageOutlined, StarOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

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

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const Title = styled.h1`
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    margin-top: -2rem;
`;

const Description = styled.p`
    font-size: 1.1rem;
    color: #666;
    text-align: center;
    margin-bottom: 2rem;
    line-height: 1.6;
`;

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    width: 100%;
    margin: 3rem 0;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
`;

const FeatureCard = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-5px);
    }
`;

const FeatureIcon = styled.div`
    font-size: 2rem;
    color: #3b82f6;
    margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
    font-size: 1.25rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
    color: #6b7280;
    line-height: 1.5;
`;

const CompanyIntro = styled.div`
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 16px;
    padding: 2.5rem;
    margin: 2rem auto;
    width: min(80%, 1200px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    @media (max-width: 1200px) {
        width: 90%;
        padding: 2rem;
    }

    @media (max-width: 768px) {
        width: 95%;
        padding: 1.5rem;
    }

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 16px; 
        padding: 4px;
        background: linear-gradient(
            300deg,
            #2563eb,
            #3b82f6,
            #60a5fa,
            #93c5fd,
            #2563eb
        );
        background-size: 200% 200%;
        animation: borderRotate 4s linear infinite;
        -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0.8;
    }

    @keyframes borderRotate {
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

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        transform: translateX(-100%);
        transition: 0.5s;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    &:hover::after {
        transform: translateX(100%);
    }

    p {
        color: #333;
        line-height: 1.8;
        font-size: clamp(1rem, 1.1vw, 1.1rem);
        text-align: justify;
        margin: 0;
        padding: 0;
        position: relative;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        
        @media (max-width: 768px) {
            line-height: 1.6;
            text-align: left;
        }
    }
`;

const Footer = styled.footer`
    margin-top: 2rem;
    text-align: center;
    color: #666;
    font-size: 0.9rem;

    a {
        color: #666;
        text-decoration: none;
        margin: 0 1rem;
        transition: color 0.3s;

        &:hover {
            color: #1890ff;
        }
    }
`;

const Welcome = () => {
    return (
        <WelcomeContainer>
            <Title>
                <RobotOutlined style={{ fontSize: '2rem' }} />
                欢迎使用域锦AI助手
            </Title>
            <Description>
                从左侧选择一个AI助手开始对话，我们提供多种专业AI助手，满足您不同场景的外卖运营需求，提升3-5倍整体运营效率
            </Description>

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

            <Description style={{ marginTop: '3rem', fontSize: '1rem', color: '#6b7280' }}>
                点击左侧的AI助手列表，选择一个助手开始对话吧！
            </Description>

            <CompanyIntro>
                <p>
                    域锦科技以创新为魂，以智能为翼。我们深谙每位用户的独特需求，精心打造个性化解决方案。通过尖端AI技术，我们致力于全方位提升用户工作效率，释放更大商业价值。从个人创业者到大型企业，从传统行业到新兴领域，我们的产品设计始终秉持着简约直观的理念，让每个用户都能轻松驾驭科技的力量，开启智能化运营新篇章。你有任何需求，可以随时联系我们！
                </p>
            </CompanyIntro>

            <Footer>
                <Link to="/disclaimer">免责声明</Link>
                <Link to="/privacy">隐私声明</Link>
                <div style={{ marginTop: '0.5rem' }}>© 2025 域锦科技 保留所有权利</div>
            </Footer>
        </WelcomeContainer>
    );
};

export default Welcome;