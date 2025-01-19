import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from 'antd';
import { 
    QuestionCircleOutlined, 
    WechatOutlined, 
    HistoryOutlined,
    MoneyCollectOutlined,
    UserOutlined 
} from '@ant-design/icons';
import { HeaderContainer, HeaderRight, LayoutContainer } from './styles';

const Layout = ({ children, user }) => {
    return (
        <LayoutContainer>
            <HeaderContainer>
                <div className="logo">
                    <Link to="/">域锦科技</Link>
                </div>
                <HeaderRight>
                    <Link to="/docs" className="header-item">
                        <QuestionCircleOutlined />
                        使用文档
                    </Link>
                    <Link to="/customer-service" className="header-item">
                        <WechatOutlined />
                        微信客服
                    </Link>
                    <Link to="/points-history" className="header-item">
                        <HistoryOutlined />
                        积分记录
                    </Link>
                    <div className="header-item">
                        <MoneyCollectOutlined />
                        当前积分: <span className="points">{user?.points || 0}</span>
                    </div>
                    <Avatar 
                        size="small" 
                        icon={<UserOutlined />} 
                        src={user?.avatar}
                    />
                </HeaderRight>
            </HeaderContainer>
            {children}
        </LayoutContainer>
    );
};

export default Layout; 