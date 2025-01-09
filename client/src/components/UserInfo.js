import React from 'react';
import styled from 'styled-components';
import { Avatar, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  UserOutlined, 
  SettingOutlined, 
  CrownOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const UserContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 100;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledDropdown = styled(Dropdown)`
  .ant-dropdown {
    z-index: 1001 !important;
  }

  .ant-dropdown-menu {
    padding: 8px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
  }

  .ant-dropdown-menu-item {
    border-radius: 8px;
    padding: 8px 16px;
    
    &:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    .anticon {
      font-size: 16px;
    }
  }
`;

const UserInfoComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menu = {
    items: [
      ...(user?.role === 'admin' ? [{
        key: 'admin',
        icon: <DashboardOutlined />,
        label: '管理界面',
        onClick: () => navigate('/admin')
      }] : []),
      {
        key: 'help',
        icon: <QuestionCircleOutlined />,
        label: '帮助中心',
        onClick: () => window.open('https://ev42nm8mkac.feishu.cn/wiki/KJEhwhvWvilhe2k6COjc7KR4nxe', '_blank')
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: logout,
        danger: true
      }
    ]
  };

  return (
    <StyledDropdown
      menu={menu}
      placement="bottomRight"
      trigger={['hover']}
      arrow={{ pointAtCenter: true }}
      overlayStyle={{ 
        minWidth: '200px',
        zIndex: 1001 
      }}
    >
      <UserContainer
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <UserAvatar 
          size={32} 
          icon={<UserOutlined />} 
          src={user?.avatar}
        />
      </UserContainer>
    </StyledDropdown>
  );
};

export default UserInfoComponent; 