import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';
import {
    MessageOutlined,
    LoadingOutlined,
    ShopOutlined,
    CustomerServiceOutlined,
    PieChartOutlined,
    RiseOutlined,
    BulbOutlined,
    TeamOutlined,
    ToolOutlined,
    RobotOutlined,
    CommentOutlined,
    TagOutlined,
    GiftOutlined,
    HeartOutlined
} from '@ant-design/icons';
import aiAssistantService from '../../services/aiAssistantService';
import './style.css';

const { Sider } = Layout;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    // 根据助手名称选择图标
    const getAssistantIcon = useCallback((name) => {
        if (!name) return <MessageOutlined />;
        
        console.log('正在为助手选择图标:', name);
        
        // 客服相关
        if (name.includes('客服') || name.includes('服务')) {
            console.log('选择客服图标');
            return <CustomerServiceOutlined />;
        }
        
        // 品牌相关
        if (name.includes('品牌') || name.includes('定位')) {
            console.log('选择品牌图标');
            return <TagOutlined />;
        }
        
        // 商店/店铺相关
        if (name.includes('店') || name.includes('商') || name.includes('销售')) {
            console.log('选择商店图标');
            return <ShopOutlined />;
        }
        
        // 营销/推广相关
        if (name.includes('营销') || name.includes('推广') || name.includes('广告')) {
            console.log('选择营销图标');
            return <RiseOutlined />;
        }
        
        // 数据分析相关
        if (name.includes('分析') || name.includes('数据') || name.includes('统计')) {
            console.log('选择数据分析图标');
            return <PieChartOutlined />;
        }
        
        // 创意/设计相关
        if (name.includes('创意') || name.includes('设计') || name.includes('创作')) {
            console.log('选择创意图标');
            return <BulbOutlined />;
        }
        
        // 团队/人员相关
        if (name.includes('团队') || name.includes('人力') || name.includes('招聘')) {
            console.log('选择团队图标');
            return <TeamOutlined />;
        }
        
        // 工具类
        if (name.includes('工具') || name.includes('助手')) {
            console.log('选择工具图标');
            return <ToolOutlined />;
        }
        
        // 机器人/AI相关
        if (name.includes('机器人') || name.includes('AI') || name.includes('智能')) {
            console.log('选择机器人图标');
            return <RobotOutlined />;
        }
        
        // 评论/反馈相关
        if (name.includes('评论') || name.includes('反馈') || name.includes('评价')) {
            console.log('选择评论图标');
            return <CommentOutlined />;
        }
        
        // 促销/活动相关
        if (name.includes('促销') || name.includes('活动') || name.includes('优惠')) {
            console.log('选择促销图标');
            return <GiftOutlined />;
        }
        
        // 用户体验相关
        if (name.includes('体验')) {
            console.log('选择用户体验图标');
            return <HeartOutlined />;
        }
        
        console.log('使用默认图标');
        return <MessageOutlined />;
    }, []);

    // 获取助手列表
    const fetchAssistants = useCallback(async () => {
        try {
            setLoading(true);
            const response = await aiAssistantService.getActiveAssistants();
            console.log('获取到的助手列表原始数据:', response);
            
            if (response.success) {
                const activeAssistants = response.data.filter(assistant => assistant.isActive);
                console.log('处理后的活跃助手列表:', activeAssistants.map(a => ({
                    name: a.name,
                    key: a.key,
                    isActive: a.isActive,
                    description: a.description
                })));
                setAssistants(activeAssistants);
            } else {
                console.error('获取助手列表失败:', response.message);
            }
        } catch (error) {
            console.error('获取助手列表错误:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssistants();

        // 订阅助手列表更新事件
        const unsubscribe = aiAssistantService.onActiveAssistantsUpdated((updatedAssistants) => {
            console.log('收到助手列表更新:', updatedAssistants);
            const activeAssistants = updatedAssistants.filter(assistant => assistant.isActive);
            setAssistants(activeAssistants);
        });

        return () => unsubscribe();
    }, [fetchAssistants]);

    // 生成菜单项
    const menuItems = assistants.map(assistant => ({
        key: assistant.key || assistant._id,
        icon: getAssistantIcon(assistant.name),
        label: (
            <div className="assistant-menu-item">
                <span className="assistant-name">{assistant.name}</span>
                {assistant.isNew && <span className="assistant-tag new">NEW</span>}
                <div className="assistant-description">
                    {assistant.description || (assistant.pointsCost ? `${assistant.pointsCost}积分/次` : '免费')}
                </div>
            </div>
        ),
        onClick: () => {
            console.log('点击助手菜单项:', assistant);
            navigate(`/chat/${assistant.key || assistant._id}`);
        }
    }));

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            className="app-sidebar dark"
            theme="dark"
            width={280}
        >
            <div className="sidebar-logo">
                <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
                {!collapsed && <span className="sidebar-logo-text">AI助手</span>}
            </div>
            {loading ? (
                <div className="sidebar-loading">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            ) : (
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname.split('/').pop()]}
                    items={menuItems}
                    className="sidebar-menu"
                    theme="dark"
                />
            )}
            <div className="sidebar-background-animation" />
        </Sider>
    );
};

export default Sidebar; 