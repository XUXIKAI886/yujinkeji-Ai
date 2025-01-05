import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { 
  UserOutlined, 
  MessageOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  DashboardOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import authService from '../services/auth.service';
import ThemeToggle from '../components/ThemeToggle';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledSider = styled(Sider)`
  .logo {
    height: 64px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.surface};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    img {
      height: 32px;
      transition: ${({ theme }) => theme.transitions.default};
    }
  }

  .ant-menu {
    border-right: none;
  }
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
  backdrop-filter: blur(10px);
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledContent = styled(Content)`
  padding: 24px;
  background: ${({ theme }) => theme.colors.background};
`;

const ContentWrapper = styled.div`
  padding: 24px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  min-height: 360px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">仪表盘</Link>,
    },
    {
      key: 'chat',
      icon: <MessageOutlined />,
      label: <Link to="/chat">AI助手</Link>,
    },
    {
      key: 'points',
      icon: <CreditCardOutlined />,
      label: <Link to="/points">积分管理</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">设置</Link>,
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">个人资料</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined />}
        onClick={() => authService.logout()}
      >
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledLayout>
      <StyledSider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
      >
        <div className="logo">
          <img src="/logo.svg" alt="Logo" />
        </div>
        <Menu 
          theme="dark" 
          mode="inline"
          selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
          items={menuItems}
        />
      </StyledSider>
      <Layout>
        <StyledHeader>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <UserAvatar icon={<UserOutlined />} />
          </Dropdown>
        </StyledHeader>
        <StyledContent>
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </StyledContent>
      </Layout>
      <ThemeToggle />
    </StyledLayout>
  );
};

export default MainLayout; 