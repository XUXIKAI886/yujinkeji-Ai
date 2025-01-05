import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import { UserOutlined, RobotOutlined, MessageOutlined, CrownOutlined } from '@ant-design/icons';
import aiAssistantService from '../../services/aiAssistantService';
import { getUserStats } from '../../services/userService';
import './Dashboard.css';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalAssistants: 0,
        activeAssistants: 0,
        totalChats: 0,
        averageResponseTime: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [assistantStats, userStats] = await Promise.all([
                    aiAssistantService.getAssistantStats(),
                    getUserStats()
                ]);

                if (assistantStats.success && userStats.success) {
                    setStats({
                        ...assistantStats.data,
                        ...userStats.data
                    });
                }
            } catch (error) {
                console.error('获取统计数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            title: '总用户数',
            value: stats.totalUsers,
            icon: <UserOutlined />,
            color: '#1890ff'
        },
        {
            title: '活跃用户',
            value: stats.activeUsers,
            icon: <CrownOutlined />,
            color: '#52c41a'
        },
        {
            title: 'AI助手数量',
            value: stats.totalAssistants,
            icon: <RobotOutlined />,
            color: '#722ed1'
        },
        {
            title: '对话总数',
            value: stats.totalChats,
            icon: <MessageOutlined />,
            color: '#faad14'
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h2>仪表盘</h2>
            <Row gutter={[16, 16]}>
                {cards.map((card, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Card className="stat-card" bordered={false}>
                            <Statistic
                                title={card.title}
                                value={card.value}
                                prefix={React.cloneElement(card.icon, { style: { color: card.color } })}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Dashboard; 