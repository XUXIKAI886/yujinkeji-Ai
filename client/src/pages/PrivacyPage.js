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

const PrivacyPage = () => {
  return (
    <PageWrapper>
      <Header>
        <Logo>域锦科技</Logo>
        <BackLink to="/">返回首页</BackLink>
      </Header>
      
      <Container>
        <Title>隐私声明</Title>
        
        <Section>
          <SectionTitle>1. 信息收集与处理</SectionTitle>
          <p>我们的服务采用完全本地化的数据处理方式。在使用我们的服务时，您上传的所有文档、表格和分析数据都将在您的本地设备上进行处理，不会上传至云端服务器。这意味着您的数据始终保持在您的控制之下，确保了最高级别的隐私保护。</p>
        </Section>

        <Section>
          <SectionTitle>2. 数据安全与清理</SectionTitle>
          <p>为了进一步保护您的隐私，我们采用了严格的数据处理机制：所有分析过程均在本地完成后，系统会自动清理所有上传的文件、生成的临时数据和分析缓存。这确保了您的敏感信息不会在系统中留存，为您的数据安全提供了最大程度的保障。</p>
        </Section>

        <Section>
          <SectionTitle>3. 信息使用</SectionTitle>
          <p>您的数据仅用于提供您请求的具体服务和分析功能。由于采用本地处理方式，您的数据不会被用于其他目的，也不会被分享或传输给任何第三方。这种处理方式确保了您对数据的完全控制权。</p>
        </Section>

        <Section>
          <SectionTitle>4. 信息保护</SectionTitle>
          <p>我们采用业界标准的安全技术和程序来保护用户信息，防止未经授权的访问、使用或泄露。这些措施包括但不限于：加密传输、访问控制、安全审计等。但请注意，互联网环境并非百分之百安全，我们建议用户也要采取必要的措施保护个人信息。</p>
        </Section>

        <Section>
          <SectionTitle>5. 信息共享</SectionTitle>
          <p>除非法律要求或经用户明确同意，我们不会与任何第三方分享用户的个人信息。在必要情况下（如系统维护、技术支持等），我们可能会委托可信赖的合作伙伴处理部分信息，但我们会要求这些合作伙伴遵守严格的保密义务。</p>
        </Section>

        <Section>
          <SectionTitle>6. Cookie使用</SectionTitle>
          <p>我们使用Cookie和类似技术来提供更好的用户体验，包括记住用户的登录状态、个性化设置等。用户可以通过浏览器设置管理Cookie，但这可能会影响部分功能的使用。</p>
        </Section>

        <Section>
          <SectionTitle>7. 用户权利</SectionTitle>
          <p>用户有权查询、更正、删除其个人信息，也有权撤回同意。如需行使这些权利，可以通过平台提供的功能或联系客服进行操作。在法律允许的范围内，我们会响应这些请求。</p>
        </Section>

        <Section>
          <SectionTitle>8. 未成年人保护</SectionTitle>
          <p>我们的服务主要面向成年人。如发现未成年人在未经监护人同意的情况下使用我们的服务，我们会采取措施删除相关信息。</p>
        </Section>

        <Section>
          <SectionTitle>9. 隐私政策更新</SectionTitle>
          <p>我们可能会不时更新本隐私声明。更新后的声明将在平台上公布，重大变更会通过适当方式通知用户。继续使用我们的服务即表示您同意更新后的隐私声明。</p>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default PrivacyPage; 