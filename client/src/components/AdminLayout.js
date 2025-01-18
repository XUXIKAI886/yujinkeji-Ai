import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  UserOutlined,
  RobotOutlined,
  BarChartOutlined,
  SettingOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const SidebarContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 4, 40, 0.85);
  color: #e2e8f0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.95), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 50px 160px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 80px 120px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 110px 50px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 150px 180px, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0));
    background-size: 200px 200px;
    animation: animateSiderStars 20s linear infinite;
    opacity: 0.5;
  }

  @keyframes animateSiderStars {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-200px);
    }
  }
`;

const Logo = styled.div`
  padding: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
  position: relative;
  z-index: 1;

  .anticon {
    font-size: 24px;
    color: #3b82f6;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #3b82f6;
    background: rgba(255, 255, 255, 0.05);

    .anticon {
      transform: scale(1.1) rotate(-10deg);
    }
  }
`;

const MenuSection = styled.div`
  padding: 16px 12px;
  flex: 1;
  overflow-y: auto;
  position: relative;
  z-index: 1;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .ant-menu {
    background: transparent !important;
    border-right: none;
  }

  .ant-menu-item {
    padding: 12px 16px;
    margin: 4px 8px;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 15px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    height: auto;
    line-height: 1.5;
    background: transparent;

    .anticon {
      font-size: 18px;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.8);
    }

    &:hover {
      background: rgba(59, 130, 246, 0.25);
      color: #ffffff;
      transform: translateX(4px);

      .anticon {
        transform: scale(1.1);
        color: #ffffff;
      }
    }

    &.ant-menu-item-selected {
      background: rgba(59, 130, 246, 0.3);
      color: #ffffff;
      font-weight: 500;
      transform: translateX(4px);

      .anticon {
        color: #ffffff;
      }

      &:hover {
        background: rgba(59, 130, 246, 0.35);
      }
    }
  }
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  
  .ant-layout-content {
    background: #fff;
    padding: 24px;
    margin: 0;
    min-height: 280px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
`;

const AdminLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
      onClick: () => navigate('/admin/users'),
    },
    {
      key: 'assistants',
      icon: <RobotOutlined />,
      label: 'AI助手管理',
      onClick: () => navigate('/admin/assistants'),
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
      onClick: () => navigate('/admin/statistics'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: () => navigate('/admin/settings'),
    },
  ];

  return (
    <StyledLayout>
      <Sider width={220} theme="dark">
        <SidebarContainer>
          <Logo onClick={() => navigate('/chat')}>
            <RocketOutlined />
            域锦后台
          </Logo>
          <MenuSection>
            <Menu
              mode="inline"
              defaultSelectedKeys={['users']}
              items={menuItems}
              theme="dark"
            />
          </MenuSection>
        </SidebarContainer>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </StyledLayout>
  );
};

export default AdminLayout; 