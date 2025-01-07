import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  PieChartOutlined,
  MessageOutlined,
  RiseOutlined,
  ShoppingOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  TeamOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import aiAssistantService from '../services/aiAssistantService';

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

const Logo = styled(Link)`
  padding: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.03);
  position: relative;
  z-index: 1;

  &:hover {
    color: #3b82f6;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
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
`;

const MenuItem = styled.div`
  padding: 12px 16px;
  margin: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: ${props => props.className === 'selected' ? 'rgba(59, 130, 246, 0.3)' : 'transparent'};

  &:hover {
    background: rgba(59, 130, 246, 0.25);
    color: #ffffff;
    transform: translateX(4px);
  }

  .menu-header {
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${props => props.className === 'selected' ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'};
    font-weight: ${props => props.className === 'selected' ? '600' : '500'};
  }

  .menu-description {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    padding-left: 30px;
    line-height: 1.4;
    display: ${props => props.collapsed ? 'none' : 'block'};
  }

  .anticon {
    font-size: 18px;
    transition: all 0.3s ease;
    color: rgba(255, 255, 255, 0.8);
  }

  &:hover .anticon {
    transform: scale(1.1);
    color: #ffffff;
  }

  &.selected {
    background: rgba(59, 130, 246, 0.3);
    color: #ffffff;
    font-weight: 500;
    transform: translateX(4px);

    .menu-description {
      color: rgba(255, 255, 255, 0.9);
    }

    .anticon {
      color: #ffffff;
    }
  }

  ${props => props.collapsed && `
    padding: 12px;
    margin: 4px;
    display: flex;
    justify-content: center;
    
    .anticon {
      margin: 0;
    }
  `}
`;

const CategoryTitle = styled.div`
  padding: 16px 16px 8px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const NewBadge = styled.span`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  margin-left: auto;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
`;

const HotBadge = styled(NewBadge)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);
`;

const Sidebar = ({ onSelectAssistant, collapsed }) => {
  const [selectedMenu, setSelectedMenu] = useState('ai-tools');
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [assistants, setAssistants] = useState([]);

  const fetchAssistants = async () => {
    try {
      const response = await aiAssistantService.getActiveAssistants();
      console.log('获取到的助手列表原始数据:', response);
      
      if (response.success) {
        const activeAssistants = response.data.filter(assistant => assistant.isActive);
        console.log('处理后的活跃助手列表:', activeAssistants.map(a => ({
          id: a._id,
          key: a.key,
          name: a.name,
          type: a.type,
          description: a.description,
          isActive: a.isActive
        })));

        // 确保每个助手都有正确的type字段
        const processedAssistants = activeAssistants.map(assistant => {
          const name = assistant.name?.toLowerCase() || '';
          const description = assistant.description?.toLowerCase() || '';
          let type = 'general';
          
          // 根据名称和描述确定类型
          if (name.includes('客服') || description.includes('客服')) {
            type = 'customer-service';
          } else if (name.includes('数据') || name.includes('分析') || description.includes('数据') || description.includes('分析')) {
            type = 'analysis';
          } else if (name.includes('营销') || name.includes('品牌') || description.includes('营销') || description.includes('品牌')) {
            type = 'business';
          } else if (name.includes('聊天') || name.includes('对话') || description.includes('聊天') || description.includes('对话')) {
            type = 'chat';
          } else if (name.includes('优化') || name.includes('增长') || description.includes('优化') || description.includes('增长')) {
            type = 'growth';
          } else if (name.includes('文档') || name.includes('markdown') || description.includes('文档') || description.includes('markdown')) {
            type = 'document';
          } else if (name.includes('店铺') || name.includes('外卖') || description.includes('店铺') || description.includes('外卖')) {
            type = 'shop';
          } else if (name.includes('评价') || name.includes('好评') || description.includes('评价') || description.includes('好评')) {
            type = 'message';
          } else if (name.includes('搭配') || name.includes('菜品') || description.includes('搭配') || description.includes('菜品')) {
            type = 'shopping';
          } else if (name.includes('竞店') || name.includes('竞争') || description.includes('竞店') || description.includes('竞争')) {
            type = 'team';
          }
          
          return {
            ...assistant,
            type
          };
        });

        console.log('添加类型后的助手列表:', processedAssistants.map(a => ({
          name: a.name,
          type: a.type
        })));
        
        setAssistants(processedAssistants);
      } else {
        console.error('获取助手列表失败:', response.message);
      }
    } catch (error) {
      console.error('获取助手列表错误:', error);
    }
  };

  useEffect(() => {
    fetchAssistants();

    // 订阅助手列表更新事件
    const unsubscribe = aiAssistantService.onActiveAssistantsUpdated((updatedAssistants) => {
      console.log('收到助手列表更新:', updatedAssistants);
      const activeAssistants = updatedAssistants.filter(assistant => assistant.isActive);
      
      // 处理助手类型
      const processedAssistants = activeAssistants.map(assistant => {
        const name = assistant.name?.toLowerCase() || '';
        const description = assistant.description?.toLowerCase() || '';
        let type = 'general';
        
        // 根据名称和描述确定类型
        if (name.includes('客服') || description.includes('客服')) {
          type = 'customer-service';
        } else if (name.includes('数据') || name.includes('分析') || description.includes('数据') || description.includes('分析')) {
          type = 'analysis';
        } else if (name.includes('营销') || name.includes('品牌') || description.includes('营销') || description.includes('品牌')) {
          type = 'business';
        } else if (name.includes('聊天') || name.includes('对话') || description.includes('聊天') || description.includes('对话')) {
          type = 'chat';
        } else if (name.includes('优化') || name.includes('增长') || description.includes('优化') || description.includes('增长')) {
          type = 'growth';
        } else if (name.includes('文档') || name.includes('markdown') || description.includes('文档') || description.includes('markdown')) {
          type = 'document';
        } else if (name.includes('店铺') || name.includes('外卖') || description.includes('店铺') || description.includes('外卖')) {
          type = 'shop';
        } else if (name.includes('评价') || name.includes('好评') || description.includes('评价') || description.includes('好评')) {
          type = 'message';
        } else if (name.includes('搭配') || name.includes('菜品') || description.includes('搭配') || description.includes('菜品')) {
          type = 'shopping';
        } else if (name.includes('竞店') || name.includes('竞争') || description.includes('竞店') || description.includes('竞争')) {
          type = 'team';
        }
        
        return {
          ...assistant,
          type
        };
      });
      
      setAssistants(processedAssistants);
    });

    return () => unsubscribe();
  }, []);

  const getAssistantIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'customer':
      case 'customer-service':
        return <CustomerServiceOutlined />;
      case 'business':
      case 'shop':
        return <ShopOutlined />;
      case 'analysis':
      case 'analytics':
      case 'chart':
        return <PieChartOutlined />;
      case 'chat':
      case 'message':
      case 'conversation':
        return <MessageOutlined />;
      case 'growth':
      case 'rise':
      case 'trend':
        return <RiseOutlined />;
      case 'shopping':
      case 'store':
      case 'mall':
        return <ShoppingOutlined />;
      case 'research':
      case 'search':
      case 'find':
        return <FileSearchOutlined />;
      case 'report':
      case 'stats':
      case 'statistics':
        return <BarChartOutlined />;
      case 'team':
      case 'group':
      case 'users':
        return <TeamOutlined />;
      case 'document':
      case 'file':
      case 'text':
        return <FileTextOutlined />;
      case 'profile':
      case 'user':
      case 'person':
        return <ProfileOutlined />;
      default:
        return <AppstoreOutlined />;
    }
  };

  const menuItems = [
    {
      key: 'ai-tools',
      icon: <AppstoreOutlined />,
      label: '所有助手',
      description: '点击查看详细介绍'
    },
    ...assistants.map(assistant => ({
      key: `assistant-${assistant.key || assistant._id}`,
      icon: getAssistantIcon(assistant.type),
      label: assistant.name || assistant.label,
      description: assistant.description,
      badge: assistant.isNew ? 'NEW' : undefined,
      pointsCost: assistant.pointsCost,
      onClick: () => {
        onSelectAssistant({
          ...assistant,
          _id: assistant.key || assistant._id,
          name: assistant.name || assistant.label,
          type: assistant.type || 'assistant',
          pointsCost: assistant.pointsCost
        });
        setSelectedAssistant(assistant.key || assistant._id);
      }
    })),
    {
      type: 'category',
      title: '系统'
    },
    {
      key: 'docs',
      icon: <FileTextOutlined />,
      label: '使用文档'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置'
    }
  ];

  const handleMenuClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    setSelectedMenu(item.key);
    
    // 如果是选择AI助手
    const assistant = assistants.find(a => `assistant-${a.key}` === item.key);
    if (assistant) {
      setSelectedAssistant(assistant.key);
      onSelectAssistant({
        ...assistant,
        _id: assistant.key,
        name: assistant.label,
        type: 'assistant',
        pointsCost: assistant.pointsCost
      });
    }
  };

  return (
    <SidebarContainer>
      <Logo to="/">
        <LogoIcon>域</LogoIcon>
        {!collapsed && '域锦AI平台'}
      </Logo>
      <MenuSection>
        {menuItems.map(item => {
          if (item.type === 'category') {
            return !collapsed && <CategoryTitle key={item.title}>{item.title}</CategoryTitle>;
          }
          
          const isSelected = item.key === selectedMenu || 
            (item.key.startsWith('assistant-') && selectedAssistant === item.key.replace('assistant-', ''));

          return (
            <MenuItem
              key={item.key}
              className={isSelected ? 'selected' : ''}
              onClick={() => handleMenuClick(item)}
              collapsed={collapsed}
            >
              <div className="menu-header">
                {item.icon}
                {!collapsed && (
                  <>
                    {item.label}
                    {item.badge === 'NEW' && <NewBadge>NEW</NewBadge>}
                    {item.badge === 'HOT' && <HotBadge>HOT</HotBadge>}
                  </>
                )}
              </div>
              {!collapsed && item.description && (
                <div className="menu-description">
                  {item.description}
                </div>
              )}
            </MenuItem>
          );
        })}
      </MenuSection>
    </SidebarContainer>
  );
};

export default Sidebar; 