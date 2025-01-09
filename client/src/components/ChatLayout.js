import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout, Badge, Tooltip, Button, Input, Modal, Table, message, Avatar } from 'antd';
// eslint-disable-next-line no-unused-vars
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  SearchOutlined,
  DesktopOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  WechatOutlined,
  ShareAltOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import Sidebar from './Sidebar';
import UserInfo from './UserInfo';
import ChatWindow from './ChatWindow/index';
import { useAuth } from '../contexts/AuthContext';
import { getUserPointsHistory } from '../services/userService';
import http from '../utils/http';
import { motion } from 'framer-motion';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;
  background: #f8fafc;
`;

const StyledHeader = styled(Header)`
  background: rgba(0, 4, 40, 0.85);
  backdrop-filter: blur(10px);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background-image: 
      radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.95), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 50px 160px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 80px 120px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 110px 50px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 150px 180px, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0));
    background-repeat: repeat;
    background-size: 250px 250px;
    transform-origin: 0 0;
    animation: animateStars 25s linear infinite;
    opacity: 0.6;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
    background-size: 250% 250%;
    animation: meteor 6s linear infinite;
    z-index: 2;
  }

  > * {
    position: relative;
    z-index: 10;
  }
`;

const StyledSider = styled(Sider)`
  background: rgba(0, 4, 40, 0.85);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    z-index: 1;
  }

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

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  position: relative;
  z-index: 10;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 12px;
  position: relative;
  z-index: 10;
`;

const SearchInput = styled(Input)`
  max-width: 400px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);

  .ant-input {
    background: transparent;
    color: rgba(255, 255, 255, 0.9);
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .ant-input-prefix {
    color: rgba(255, 255, 255, 0.6);
  }

  &:hover, &:focus {
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
`;

const MenuButton = styled(Button)`
  color: rgba(255, 255, 255, 0.8) !important;
  &:hover {
    color: rgba(255, 255, 255, 1) !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }
`;

const ActionButton = styled(Button)`
  height: 40px;
  padding: 0 20px;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #e9f5f1 0%, #f4faf8 100%);
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(233, 245, 241, 0.2),
              0 4px 8px rgba(244, 250, 248, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 15;

  &:hover {
    color: #2c3e50 !important;
    background: linear-gradient(135deg, #d7efe9 0%, #e2f2ee 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(233, 245, 241, 0.3),
                0 8px 24px rgba(244, 250, 248, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
                
    .anticon {
      color: #2c3e50;
      opacity: 1;
      transform: scale(1.1);
    }
  }

  .anticon {
    font-size: 20px;
    transition: all 0.3s ease;
    color: #2c3e50;
  }

  &:has(.ant-badge) {
    min-width: 140px;
    max-width: 140px;
    padding: 0 16px;
    justify-content: space-between;
    
    .anticon {
      margin-right: 0;
    }
  }
`;

const DownloadButton = styled(ActionButton)`
  background: linear-gradient(135deg, #dcefe9 0%, #e9f5f1 100%);
  color: #2c3e50;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(220, 239, 233, 0.2),
              0 4px 8px rgba(233, 245, 241, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #2c3e50;
    background: linear-gradient(135deg, #cae7df 0%, #d7efe9 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 239, 233, 0.3),
                0 8px 24px rgba(233, 245, 241, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #2c3e50;
    opacity: 0.95;
    font-size: 20px;
  }

  &:hover .anticon {
    color: #2c3e50;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const PointsBadge = styled(Badge)`
  .ant-badge-count {
    background: linear-gradient(135deg, #94c2bd 0%, #b5ddd1 100%);
    color: #2c3e50;
    font-weight: 600;
    font-size: 14px;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(148, 194, 189, 0.2);
    min-width: 60px;
    text-align: center;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    }
  }

  .ant-badge-count-overflow {
    min-width: 60px;
    text-align: center;
  }
`;

const StyledContent = styled(Content)`
  background: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px;
`;

const ServiceButton = styled(ActionButton)`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2),
              0 4px 8px rgba(22, 163, 74, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: white;
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3),
                0 8px 24px rgba(22, 163, 74, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .anticon {
    color: white;
    opacity: 0.95;
    font-size: 20px;
    
    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }

  &:hover .anticon {
    color: white;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const MindMapButton = styled(ActionButton)`
  background: linear-gradient(135deg, #c2e3d9 0%, #cfe9e1 100%);
  color: #2c3e50;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(194, 227, 217, 0.2),
              0 4px 8px rgba(207, 233, 225, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #2c3e50;
    background: linear-gradient(135deg, #b0dbcf 0%, #bde1d7 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(194, 227, 217, 0.3),
                0 8px 24px rgba(207, 233, 225, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #2c3e50;
    opacity: 0.95;
    font-size: 20px;
  }

  &:hover .anticon {
    color: #2c3e50;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const DocsButton = styled(ActionButton)`
  background: linear-gradient(135deg, #cfe9e1 0%, #dcefe9 100%);
  color: #2c3e50;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(207, 233, 225, 0.2),
              0 4px 8px rgba(220, 239, 233, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #2c3e50;
    background: linear-gradient(135deg, #bde1d7 0%, #cae7df 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(207, 233, 225, 0.3),
                0 8px 24px rgba(220, 239, 233, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #2c3e50;
    opacity: 0.95;
    font-size: 20px;
  }

  &:hover .anticon {
    color: #2c3e50;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const VisualizationButton = styled(ActionButton)`
  background: linear-gradient(135deg, #94c2bd 0%, #b5ddd1 100%);
  color: #2c3e50;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(148, 194, 189, 0.2),
              0 4px 8px rgba(181, 221, 209, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #2c3e50;
    background: linear-gradient(135deg, #7fb5b0 0%, #a3d4c5 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(148, 194, 189, 0.3),
                0 8px 24px rgba(181, 221, 209, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #2c3e50;
    opacity: 0.95;
    font-size: 20px;
  }

  &:hover .anticon {
    color: #2c3e50;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const ReviewAnalysisButton = styled(ActionButton)`
  background: linear-gradient(135deg, #b5ddd1 0%, #c2e3d9 100%);
  color: #2c3e50;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(181, 221, 209, 0.2),
              0 4px 8px rgba(194, 227, 217, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #2c3e50;
    background: linear-gradient(135deg, #a3d4c5 0%, #b0dbcf 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(181, 221, 209, 0.3),
                0 8px 24px rgba(194, 227, 217, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #2c3e50;
    opacity: 0.95;
    font-size: 20px;
  }

  &:hover .anticon {
    color: #2c3e50;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const UserContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #94c2bd 0%, #b5ddd1 100%);
  box-shadow: 0 2px 8px rgba(148, 194, 189, 0.25),
              0 4px 12px rgba(181, 221, 209, 0.15),
              inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    z-index: 1;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 16px rgba(148, 194, 189, 0.3),
                0 8px 24px rgba(181, 221, 209, 0.2),
                inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const UserAvatar = styled(Avatar)`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #ffffff 0%, #f4faf8 100%);
  color: #2c3e50;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(148, 194, 189, 0.2);
  font-size: 18px;
  font-weight: 600;
  z-index: 2;
  
  .anticon {
    font-size: 20px;
    color: #2c3e50;
  }
`;

const ChatLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const { user, updateUser } = useAuth();

  const showPointsHistory = React.useCallback(async () => {
    try {
        // 先获取最新的用户信息
        const userResponse = await http.get('/users/me');
        console.log('当前用户信息:', userResponse.data);
        
        if (userResponse.data.success) {
            updateUser(userResponse.data.data);
        }

        // 强制刷新积分历史
        const response = await getUserPointsHistory(userResponse.data.data._id || user._id);
        console.log('积分历史原始数据:', response);
        
        // 确保数据存在且是数组
        if (!response.success || !Array.isArray(response.data)) {
            console.error('积分历史数据格式错误:', response);
            message.error('获取积分历史失败');
            return;
        }

        const historyData = response.data;
        console.log('处理后的积分历史数据:', historyData);
        
        // 关闭之前的 Modal（如果存在）
        Modal.destroyAll();
        
        // 显示新的 Modal
        Modal.info({
            title: '积分变动历史',
            width: 800,
            content: (
                <Table
                    dataSource={historyData}
                    columns={[
                        {
                            title: '变动时间',
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            render: (date) => new Date(date).toLocaleString()
                        },
                        {
                            title: '变动积分',
                            dataIndex: 'points',
                            key: 'points',
                            render: (points, record) => {
                                // 根据类型确定是否显示正负号
                                const isPositive = ['add', 'register'].includes(record.type) || 
                                                  (record.type === 'admin_grant' && points > 0);
                                
                                // 对于消费类型，points已经是负数，不需要再加负号
                                const displayPoints = Math.abs(points);
                                
                                return (
                                    <span style={{ 
                                        color: isPositive ? '#52c41a' : '#ff4d4f' 
                                    }}>
                                        {isPositive ? `+${displayPoints}` : `-${displayPoints}`}
                                    </span>
                                );
                            }
                        },
                        {
                            title: '变动类型',
                            dataIndex: 'type',
                            key: 'type',
                            render: (type) => {
                                const typeMap = {
                                    'register': '注册奖励',
                                    'use_assistant': 'AI助手使用',
                                    'admin_grant': '管理员调整',
                                    'add': '充值'
                                };
                                return typeMap[type] || type;
                            }
                        },
                        {
                            title: '变动说明',
                            dataIndex: 'description',
                            key: 'description'
                        },
                        {
                            title: '剩余积分',
                            dataIndex: 'balance',
                            key: 'balance'
                        }
                    ]}
                    pagination={{
                        total: historyData.length,
                        pageSize: 50,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                        pageSizeOptions: ['10', '20', '50', '100', '200']
                    }}
                    rowKey="_id"
                    locale={{ emptyText: '暂无积分记录' }}
                    scroll={{ y: 500 }}
                />
            ),
            okText: '关闭'
        });
    } catch (error) {
        console.error('获取积分历史失败:', error);
        message.error('获取积分历史失败');
    }
  }, [user, updateUser]);

  useEffect(() => {
    const handlePointsUpdate = async (event) => {
        if (user && typeof updateUser === 'function') {
            try {
                // 获取最新的用户信息
                const response = await http.get('/users/me');
                if (response.data.success) {
                    updateUser(response.data.data);
                    
                    // 自动刷新积分历史
                    const historyResponse = await getUserPointsHistory(user._id);
                    if (historyResponse.success && Array.isArray(historyResponse.data)) {
                        // 如果当前积分历史弹窗是打开的，就更新它
                        const modalElement = document.querySelector('.ant-modal-wrap');
                        if (modalElement && !modalElement.classList.contains('ant-modal-hidden')) {
                            showPointsHistory();
                        }
                    }
                }
            } catch (error) {
                console.error('更新用户信息失败:', error);
                message.error('更新用户信息失败');
            }
        }
    };

    window.addEventListener('userPointsUpdate', handlePointsUpdate);

    return () => {
        window.removeEventListener('userPointsUpdate', handlePointsUpdate);
    };
  }, [user, updateUser, showPointsHistory]);

  const handleSelectAssistant = (assistant) => {
    setSelectedAssistant(assistant);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMindMapClick = () => {
    if (!user) {
      message.warning('请先登录后再使用思维导图功能');
      return;
    }
    window.open('/mindmap', '_blank');
  };

  const handleDocsClick = () => {
    window.open('https://ev42nm8mkac.feishu.cn/wiki/KJEhwhvWvilhe2k6COjc7KR4nxe?from=from_copylink', '_blank');
  };

  const handleVisualizationClick = () => {
    if (!user) {
      message.warning('请先登录后再使用数据可视化功能');
      return;
    }
    window.open('/visualization', '_blank');
  };

  return (
    <StyledLayout>
      <StyledSider
        width={260}
        collapsed={collapsed}
        trigger={null}
        collapsible
      >
        <Sidebar
          onSelectAssistant={handleSelectAssistant}
          collapsed={collapsed}
        />
      </StyledSider>
      <Layout>
        <StyledHeader>
          <HeaderLeft>
            <MenuButton
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
            />
            <SearchInput 
              placeholder="域锦科技AI - 搜索100+个AI工具"
              prefix={<SearchOutlined />}
              allowClear
            />
          </HeaderLeft>
          <HeaderRight>
            <VisualizationButton type="default" icon={<BarChartOutlined />} onClick={handleVisualizationClick}>
              数据可视化
            </VisualizationButton>
            <ReviewAnalysisButton type="default" icon={<PieChartOutlined />} onClick={() => window.open('/takeout-review-analysis', '_blank')}>
              外卖评价分析
            </ReviewAnalysisButton>
            <MindMapButton type="default" icon={<ShareAltOutlined />} onClick={handleMindMapClick}>
              思维导图
            </MindMapButton>
            <DocsButton type="default" icon={<FileTextOutlined />} onClick={handleDocsClick}>
              使用文档
            </DocsButton>
            <ServiceButton type="default" icon={<WechatOutlined />}>
              微信客服
            </ServiceButton>
            <DownloadButton type="default" icon={<DesktopOutlined />}>
              下载客户端
            </DownloadButton>
            <Tooltip title="积分记录">
              <ActionButton type="default" onClick={showPointsHistory}>
                <ClockCircleOutlined />
                积分记录
              </ActionButton>
            </Tooltip>
            <Tooltip title="当前积分">
              <ActionButton type="default">
                <TrophyOutlined />
                <PointsBadge 
                  count={user?.points || 0} 
                  overflowCount={99999}
                  title={user?.points || 0}
                />
              </ActionButton>
            </Tooltip>
            <UserInfo />
          </HeaderRight>
        </StyledHeader>
        <StyledContent>
          <ChatWindow
            selectedAssistant={selectedAssistant}
            collapsed={collapsed}
            updateUser={updateUser}
          />
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default ChatLayout; 