import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Input, Button, Avatar, message, Popconfirm, Upload } from 'antd';
import { 
    SendOutlined, 
    RobotOutlined,
    UserOutlined,
    LoadingOutlined,
    CopyOutlined,
    DownloadOutlined,
    CrownOutlined,
    DeleteOutlined,
    UploadOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import aiAssistantService from '../services/aiAssistantService';
import chatHistoryService from '../services/chatHistoryService';
import http from '../utils/http';

const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  position: relative;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 20px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const HeaderDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto;
`;

const HeaderPoints = styled.div`
  font-size: 13px;
  color: #ef4444;
  margin-top: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  .anticon {
    font-size: 14px;
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background: #fafafa;
  position: relative;
  height: calc(100vh - 200px);
  margin: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 3px;
    
    &:hover {
      background: #d1d5db;
    }
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 16px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }
`;

const MessageAvatar = styled(Avatar)`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: ${props => props.$isUser ? '#3b82f6' : '#10b981'} !important;
  box-shadow: ${props => props.$isUser ? 
    '0 2px 8px rgba(59, 130, 246, 0.2)' : 
    '0 2px 8px rgba(16, 185, 129, 0.2)'};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.$isUser ? 
      '0 4px 12px rgba(59, 130, 246, 0.25)' : 
      '0 4px 12px rgba(16, 185, 129, 0.25)'};
  }

  .anticon {
    font-size: 20px;
    color: white;
    opacity: 0.95;
  }
`;

const MessageContentWrapper = styled.div`
  flex: 1;
  max-width: 80%;
  position: relative;
`;

const MessageContent = styled.div`
  background: ${props => props.$isUser ? '#60a5fa' : '#ffffff'};
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.6;
  color: ${props => props.$isUser ? '#ffffff' : '#1e293b'};
  white-space: pre-wrap;
  word-wrap: break-word;
  box-shadow: ${props => props.$isUser ? '0 2px 8px rgba(96, 165, 250, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.06)'};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.$isUser ? '0 4px 12px rgba(96, 165, 250, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)'};
    transform: translateY(-1px);
  }

  &::selection {
    background: ${props => props.$isUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(96, 165, 250, 0.1)'};
    color: ${props => props.$isUser ? '#ffffff' : '#1e293b'};
  }
`;

const MessageActions = styled.div`
  position: absolute;
  right: -120px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  
  ${MessageWrapper}:hover & {
    opacity: 1;
    right: -110px;
  }
`;

const MessageActionButton = styled(Button)`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 2px solid #60a5fa;
  color: #60a5fa;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(96, 165, 250, 0.15);

  &:hover {
    background: #60a5fa;
    color: white;
    border-color: #60a5fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.25);
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 8px rgba(96, 165, 250, 0.15);
  }

  .anticon {
    font-size: 18px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  &:hover .anticon {
    transform: scale(1.1);
  }
`;

const InputContainer = styled.div`
  padding: 24px 32px;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
  background: #ffffff;
  position: relative;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.03);
`;

const SendButton = styled(Button)`
  position: absolute;
  right: 48px;
  bottom: 40px;
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  height: 40px;
  border-radius: 12px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);

  &:hover {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    background: #e5e7eb;
    border-color: #e5e7eb;
    color: #9ca3af;
    box-shadow: none;
  }

  .anticon {
    font-size: 18px;
  }
`;

const ClearButton = styled(Button)`
  position: absolute;
  right: 48px;
  bottom: 90px;
  height: 40px;
  border-radius: 12px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef4444;
  border-color: #ef4444;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: #fff;
    background: #ef4444;
    border-color: #ef4444;
  }

  .anticon {
    font-size: 18px;
  }
`;

const StyledInput = styled(Input.TextArea)`
  border-radius: 24px !important;
  border: 2px solid #60a5fa !important;
  background: #ffffff !important;
  padding: 8px !important;
  min-height: 120px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 8px rgba(96, 165, 250, 0.2) !important;
  color: #1e293b !important;

  &:hover {
    border-color: #3b82f6 !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15) !important;
    transform: translateY(-1px);
  }

  &:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2) !important;
    outline: none !important;
    transform: translateY(-2px);
  }

  .ant-input {
    font-size: 15px !important;
    line-height: 1.6 !important;
    padding: 16px 24px !important;
    padding-right: 120px !important;
    border: none !important;
    background: #ffffff !important;
    color: #1e293b !important;
    resize: none !important;

    &::selection {
      background-color: #3b82f6 !important;
      color: #ffffff !important;
    }
  }

  .ant-input::placeholder {
    color: #3b82f6 !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    opacity: 0.8 !important;
  }

  textarea.ant-input::selection {
    background-color: #3b82f6 !important;
    color: #ffffff !important;
  }

  &::selection {
    background-color: #3b82f6 !important;
    color: #ffffff !important;
  }
`;

const UploadWrapper = styled.div`
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
`;

const AnalyzeButton = styled(Button)`
  margin-top: 16px;
  width: 200px;
`;

const FileList = styled.div`
  margin-top: 16px;
  text-align: left;
  
  .file-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    background: #fff;
    margin-bottom: 8px;
    
    .anticon {
      margin-right: 8px;
      color: #666;
    }
    
    .file-name {
      flex: 1;
      color: #333;
    }
    
    .file-size {
      color: #999;
      font-size: 12px;
      margin-left: 16px;
    }
  }
`;

const Message = ({ message, handleCopy, handleExport }) => (
    <MessageWrapper>
        <MessageAvatar $isUser={message.isUser}>
            {message.isUser ? <UserOutlined /> : <RobotOutlined />}
        </MessageAvatar>
        <MessageContentWrapper>
            <MessageContent $isUser={message.isUser}>
                {message.content}
            </MessageContent>
            <MessageActions>
                <MessageActionButton onClick={() => handleCopy(message.content)} title="复制">
                    <CopyOutlined />
                </MessageActionButton>
                <MessageActionButton onClick={() => handleExport(message.content)} title="导出">
                    <DownloadOutlined />
                </MessageActionButton>
            </MessageActions>
        </MessageContentWrapper>
    </MessageWrapper>
);

const InputArea = styled.div`
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  .ant-input {
    flex: 1;
    border-radius: 8px;
    resize: none;
    padding: 8px 12px;
    min-height: 40px;
    
    &:focus {
      box-shadow: none;
      border-color: #1890ff;
    }
  }
`;

const ClearChatButton = styled(Button)`
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ef4444;
  border-color: #ef4444;
  
  &:hover {
    color: #fff;
    background: #ef4444;
    border-color: #ef4444;
  }
`;

const ChatWindow = ({ selectedAssistant, updateUser }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [assistantInfo, setAssistantInfo] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);

    // 加载AI助手信息
    useEffect(() => {
        const fetchAssistantInfo = async () => {
            if (selectedAssistant?.key) {
                try {
                    const response = await aiAssistantService.getActiveAssistants();
                    if (response.success) {
                        const assistant = response.data.find(a => a.key === selectedAssistant.key);
                        if (assistant) {
                            setAssistantInfo(assistant);
                            console.log('当前助手配置:', assistant.config); // 添加日志
                        }
                    }
                } catch (error) {
                    console.error('获取AI助手信息失败:', error);
                }
            }
        };

        fetchAssistantInfo();
    }, [selectedAssistant?.key]);

    // 判断是否为DeepSeek模型
    const isDeepseekModel = useMemo(() => {
        return selectedAssistant?.config?.modelType === 'deepseek' || assistantInfo?.config?.modelType === 'deepseek';
    }, [selectedAssistant?.config?.modelType, assistantInfo?.config?.modelType]);

    console.log('模型类型:', {  // 添加日志
        selectedType: selectedAssistant?.config?.modelType,
        assistantInfoType: assistantInfo?.config?.modelType,
        isDeepseek: isDeepseekModel
    });

    // 加载聊天历史
    useEffect(() => {
        if (selectedAssistant?.key) {
            const history = chatHistoryService.getHistory(selectedAssistant.key);
            setMessages(history);
        }
    }, [selectedAssistant?.key]);

    const handleSend = async () => {
        if (!inputValue.trim()) {
            return;
        }

        if (!selectedAssistant?.key) {
            message.error('请先选择一个AI助手');
            return;
        }

        try {
            const userMessage = { 
                id: Date.now(),
                content: inputValue, 
                isUser: true 
            };
            setMessages(prev => [...prev, userMessage]);
            setInputValue('');
            setLoading(true);

            const response = await aiAssistantService.callAssistant(selectedAssistant.key, inputValue);
            
            if (response.success) {
                const assistantMessage = { 
                    id: Date.now(),
                    content: response.data.message || response.data.data?.message || '抱歉，我暂时无法回答这个问题', 
                    isUser: false 
                };
                setMessages(prev => [...prev, assistantMessage]);

                // 直接获取最新用户信息并更新
                const userResponse = await http.get('/users/me');
                if (userResponse.data.success) {
                    updateUser(userResponse.data.data);
                }
            } else {
                message.error(response.message || '调用AI助手失败');
            }
        } catch (error) {
            console.error('调用AI助手失败:', error);
            message.error(error.response?.data?.message || '调用AI助手失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCopy = (content) => {
        navigator.clipboard.writeText(content).then(() => {
            message.success('已复制到剪贴板');
        }).catch(() => {
            message.error('复制失败');
        });
    };

    const handleExport = (content) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedAssistant.name}_对话内容_${new Date().toLocaleString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        message.success('导出成功');
    };

    const handleClearChat = () => {
        setMessages([]);
        // 清除本地存储的聊天记录
        if (selectedAssistant?.key) {
            chatHistoryService.clearHistory(selectedAssistant.key);
        }
        message.success('聊天记录已清除');
    };

    const handleUpload = ({ file, fileList }) => {
        setFileList(fileList);
    };

    const handleAnalyze = async () => {
        if (fileList.length === 0) {
            message.warning('请先上传文件');
            return;
        }

        setAnalyzing(true);
        try {
            // 创建FormData对象
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('files', file.originFileObj);
            });

            // 调用分析接口
            const response = await aiAssistantService.analyzeFiles(selectedAssistant.key, formData);
            
            if (response.success) {
                const assistantMessage = { 
                    id: Date.now(),
                    content: response.message || '分析完成，但未返回结果', 
                    isUser: false 
                };
                setMessages(prev => [...prev, assistantMessage]);

                // 更新用户积分
                const userResponse = await http.get('/users/me');
                if (userResponse.data.success) {
                    updateUser(userResponse.data.data);
                }
            } else {
                message.error(response.message || '文件分析失败');
            }
        } catch (error) {
            console.error('文件分析失败:', error);
            message.error('文件分析失败，请稍后重试');
        } finally {
            setAnalyzing(false);
            setFileList([]); // 清空文件列表
        }
    };

    if (!selectedAssistant) {
        return (
            <ChatContainer>
                <ChatHeader>
                    <HeaderTitle>选择一个AI助手开始对话</HeaderTitle>
                </ChatHeader>
            </ChatContainer>
        );
    }

    return (
        <ChatContainer>
            <ChatHeader>
                <HeaderTitle>{selectedAssistant ? selectedAssistant.name : '选择一个AI助手开始对话'}</HeaderTitle>
                {selectedAssistant && (
                    <>
                        <HeaderDescription>{selectedAssistant.description}</HeaderDescription>
                        <HeaderPoints>
                            <CrownOutlined />
                            每次对话消费{assistantInfo?.pointsCost || selectedAssistant.pointsCost}积分
                            {isDeepseekModel && <span style={{ marginLeft: 8 }}>（文件分析每个文件额外+5积分）</span>}
                        </HeaderPoints>
                        <Popconfirm
                            title="确定要清除所有聊天记录吗？"
                            onConfirm={handleClearChat}
                            okText="确定"
                            cancelText="取消"
                        >
                            <ClearChatButton icon={<DeleteOutlined />}>
                                清除记录
                            </ClearChatButton>
                        </Popconfirm>
                    </>
                )}
            </ChatHeader>
            <MessageList>
                {messages.map(message => (
                    <Message
                        key={message.id}
                        message={message}
                        handleCopy={handleCopy}
                        handleExport={handleExport}
                    />
                ))}
                {loading && (
                    <MessageWrapper>
                        <MessageAvatar 
                            $isUser={false}
                            icon={<RobotOutlined />}
                        />
                        <MessageContentWrapper>
                            <MessageContent $isUser={false}>
                                <LoadingOutlined style={{ fontSize: 16, color: '#6b7280', marginRight: 8 }} />
                                <span style={{ color: '#6b7280', fontSize: 14 }}>域锦AI正在思考中</span>
                            </MessageContent>
                        </MessageContentWrapper>
                    </MessageWrapper>
                )}
            </MessageList>
            <InputArea>
                {isDeepseekModel ? (
                    <UploadWrapper>
                        <Upload
                            multiple
                            fileList={fileList}
                            onChange={handleUpload}
                            beforeUpload={() => false}
                            accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt"
                        >
                            <Button icon={<UploadOutlined />}>选择文件</Button>
                            <div style={{ marginTop: 8, color: '#666' }}>
                                支持PDF、Word、Excel、PPT、图片、文本文件
                            </div>
                        </Upload>
                        {fileList.length > 0 && (
                            <FileList>
                                {fileList.map(file => (
                                    <div key={file.uid} className="file-item">
                                        <FileTextOutlined />
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                ))}
                            </FileList>
                        )}
                        <AnalyzeButton
                            type="primary"
                            onClick={handleAnalyze}
                            loading={analyzing}
                            disabled={fileList.length === 0}
                        >
                            {analyzing ? '正在分析...' : '开始分析'}
                        </AnalyzeButton>
                    </UploadWrapper>
                ) : (
                    <InputWrapper>
                        <StyledInput
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={handleSend}
                            placeholder="输入您的问题..."
                            disabled={loading}
                        />
                        <SendButton
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSend}
                            loading={loading}
                        >
                            发送
                        </SendButton>
                    </InputWrapper>
                )}
            </InputArea>
        </ChatContainer>
    );
};

export default ChatWindow; 