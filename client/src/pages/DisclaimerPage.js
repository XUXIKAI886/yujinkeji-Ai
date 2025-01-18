import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageWrapper = styled.div`
  background-color: #fff;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: #23262E;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  color: #fff;
  font-size: 18px;
`;

const BackLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 6px 16px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.5);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  line-height: 1.8;
  color: #333;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const DisclaimerPage = () => {
  return (
    <PageWrapper>
      <Header>
        <Logo>域锦科技</Logo>
        <BackLink to="/">返回首页</BackLink>
      </Header>
      
      <Container>
        <Title>免责声明</Title>
        
        <Section>
          <SectionTitle>1. 服务说明</SectionTitle>
          <p>域锦科技AI助手平台（以下简称"本平台"）是一个提供AI辅助服务的在线平台。本平台提供的所有服务仅供参考，不构成任何形式的承诺或保证。用户在使用本平台服务时应保持独立判断，并对使用本平台服务的结果承担全部责任。</p>
        </Section>

        <Section>
          <SectionTitle>2. 内容免责</SectionTitle>
          <p>本平台提供的AI分析结果、数据可视化、思维导图等功能所产生的内容仅供参考。对于因使用这些内容而可能产生的任何直接或间接损失，本平台不承担任何责任。用户应自行验证相关内容的准确性和适用性。</p>
        </Section>

        <Section>
          <SectionTitle>3. 数据安全</SectionTitle>
          <p>虽然本平台采取了合理的技术措施保护用户数据安全，但不对因不可抗力、黑客攻击、系统故障等原因导致的数据丢失或泄露承担责任。用户应自行保管好账号密码，并对账号下的所有行为负责。</p>
        </Section>

        <Section>
          <SectionTitle>4. 服务变更</SectionTitle>
          <p>本平台保留随时修改或中断服务的权利，不需事先通知用户。对于服务的修改、中断或终止而造成的任何损失，本平台不承担任何责任。</p>
        </Section>

        <Section>
          <SectionTitle>5. 知识产权</SectionTitle>
          <p>用户在使用本平台服务时，应遵守知识产权相关法律法规。对于用户上传的内容所涉及的知识产权问题，由用户自行承担相应的法律责任。</p>
        </Section>

        <Section>
          <SectionTitle>6. 法律适用</SectionTitle>
          <p>本免责声明受中华人民共和国法律管辖并按其解释。如本声明中任何条款与法律相抵触，则这些条款将被视为自动废止，但不影响其他条款的效力。</p>
        </Section>

        <Section>
          <SectionTitle>7. 数据采集工具使用声明</SectionTitle>
          <p>本平台免费提供的外卖商家数据采集工具仅供个人学习、研究和测试使用。用户在使用该工具时应遵守相关法律法规，不得用于任何商业用途或违法行为。对于因违规使用工具而产生的任何法律责任和损失，均由使用者自行承担，本平台及开发者不承担任何责任。我们强烈建议用户在合法、合规的前提下使用该工具。</p>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default DisclaimerPage; 