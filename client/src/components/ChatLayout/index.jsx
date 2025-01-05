import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from '../Sidebar';
import ChatWindow from '../ChatWindow';
import './style.css';

const { Content } = Layout;

const ChatLayout = () => {
    const [selectedAssistant, setSelectedAssistant] = useState(null);

    return (
        <Layout className="chat-layout">
            <Sidebar />
            <Layout>
                <Content className="chat-content">
                    {selectedAssistant ? (
                        <ChatWindow assistant={selectedAssistant} />
                    ) : (
                        <div className="chat-placeholder">
                            <h2>请从左侧选择一个AI助手开始对话</h2>
                            <p>每个助手都有其特定的专业领域和功能</p>
                        </div>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ChatLayout; 