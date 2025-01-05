import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './MainLayout.css';

const { Content } = Layout;

const MainLayout = () => {
    return (
        <Layout className="app-layout">
            <Sidebar />
            <Layout>
                <Content className="app-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout; 