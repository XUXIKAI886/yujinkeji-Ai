import React from 'react';
import { Row, Col, Typography, Space, Divider } from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  GithubOutlined, 
  WechatOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const FooterWrapper = styled.footer`
  background: #001529;
  padding: 80px 0 40px;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 10;
`;

const FooterSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 10;
`;

const FooterTitle = styled(Title)`
  color: white !important;
  margin-bottom: 24px !important;
  position: relative;
  display: inline-block;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 30px;
    height: 2px;
    background: #00F5FF;
    transition: all 0.3s ease;
  }

  &:hover::after {
    width: 100%;
    box-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
  }
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 0;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: #00F5FF;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #00F5FF;
    transform: translateX(5px);
    padding-left: 5px;

    &::before {
      width: 100%;
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  position: relative;
  z-index: 10;
  
  .anticon {
    font-size: 18px;
    color: #00F5FF;
    transition: all 0.3s ease;
  }

  &:hover {
    background: rgba(0, 245, 255, 0.1);
    transform: translateX(5px);

    .anticon {
      transform: scale(1.2);
      filter: drop-shadow(0 0 8px rgba(0, 245, 255, 0.5));
    }
  }
`;

const SocialIcon = styled.a`
  color: rgba(255, 255, 255, 0.8);
  font-size: 24px;
  margin-right: 20px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;

  &:hover {
    color: #00F5FF;
    transform: translateY(-5px);
    background: rgba(0, 245, 255, 0.1);
    box-shadow: 0 5px 15px rgba(0, 245, 255, 0.2);

    .anticon {
      transform: scale(1.2);
      filter: drop-shadow(0 0 8px rgba(0, 245, 255, 0.5));
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterSection>
        <Row gutter={[48, 32]}>
          <Col xs={24} sm={12} md={8}>
            <FooterTitle level={4}>关于我们</FooterTitle>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              域锦科技致力于为代运营公司提供智能化运营解决方案，
              通过AI技术提升运营效率，降低运营成本。
            </Paragraph>
            <Space>
              <SocialIcon href="#" target="_blank">
                <WechatOutlined />
              </SocialIcon>
              <SocialIcon href="https://github.com" target="_blank">
                <GithubOutlined />
              </SocialIcon>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <FooterTitle level={4}>快速链接</FooterTitle>
            <FooterLink to="/about">关于我们</FooterLink>
            <FooterLink to="/pricing">产品定价</FooterLink>
            <FooterLink to="/docs">使用文档</FooterLink>
            <FooterLink to="/terms">服务条款</FooterLink>
            <FooterLink to="/privacy">隐私政策</FooterLink>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <FooterTitle level={4}>联系我们</FooterTitle>
            <ContactItem>
              <PhoneOutlined />
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>400-888-8888</Text>
            </ContactItem>
            <ContactItem>
              <MailOutlined />
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>contact@yujin.com</Text>
            </ContactItem>
            <ContactItem>
              <EnvironmentOutlined />
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                浙江省杭州市西湖区xxx大厦
              </Text>
            </ContactItem>
          </Col>
        </Row>

        <Copyright>
          <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            © {new Date().getFullYear()} 域锦科技. All rights reserved.
          </Text>
          <br />
          <Text style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}>
            浙ICP备xxxxxxxx号-1
          </Text>
        </Copyright>
      </FooterSection>
    </FooterWrapper>
  );
};

export default Footer; 