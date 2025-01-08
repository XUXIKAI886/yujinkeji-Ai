import React from 'react';
import styled from 'styled-components';
import { RobotOutlined, MessageOutlined, StarOutlined, FileTextOutlined } from '@ant-design/icons';

const WelcomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;
    min-height: 100%;
    background: #f9fafb;
    flex: 1;
    overflow-y: auto;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Description = styled.p`
    font-size: 1.25rem;
    color: #4b5563;
    margin-bottom: 2rem;
    max-width: 800px;
`;

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    margin-top: 2rem;
    padding: 0 20px;
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
        </WelcomeContainer>
    );
};

export default Welcome; 