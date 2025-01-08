import React, { useState, useEffect, useMemo } from 'react';
import { message, Upload } from 'antd';
import { 
    SendOutlined,
    LoadingOutlined,
    DeleteOutlined,
    UploadOutlined,
    FileTextOutlined,
    RobotOutlined,
    MessageOutlined,
    StarOutlined,
    MoneyCollectOutlined,
    PictureOutlined
} from '@ant-design/icons';
import aiAssistantService from '../../services/aiAssistantService';
import chatHistoryService from '../../services/chatHistoryService';
import http from '../../utils/http';
import Message from './components/Message';
import Welcome from './components/Welcome';
import {
    ChatContainer,
    ChatHeader,
    HeaderTitle,
    HeaderDescription,
    HeaderPoints,
    MessageList,
    InputArea,
    InputWrapper,
    StyledInput,
    UploadWrapper,
    AnalyzeButton,
    FileList,
    ClearChatButton
} from './styles';

const ChatWindow = ({ selectedAssistant, updateUser }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [assistantInfo, setAssistantInfo] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    // 添加调试日志
    useEffect(() => {
        console.log('selectedAssistant:', selectedAssistant);
    }, [selectedAssistant]);

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

    // 获取助手的唯一标识符
    const getAssistantId = React.useCallback((assistant) => {
        if (!assistant) return null;
        return assistant.key || assistant._id;
    }, []);

    // 加载聊天历史
    useEffect(() => {
        const assistantId = getAssistantId(selectedAssistant);
        console.log('Loading chat history for assistant:', assistantId);
        
        // 无论是否有历史记录，都先清空当前消息列表
        setMessages([]);
        
        if (assistantId) {
            // 加载新助手的历史记录
            const history = chatHistoryService.getHistory(assistantId);
            console.log('Loaded history:', history);
            if (history && history.length > 0) {
                setMessages(history);
            }
        }
    }, [selectedAssistant, getAssistantId]); // 依赖 selectedAssistant 和 getAssistantId

    // 保存聊天历史
    useEffect(() => {
        const assistantId = getAssistantId(selectedAssistant);
        console.log('Saving chat history for assistant:', assistantId);
        console.log('Messages to save:', messages);
        
        if (assistantId) {
            chatHistoryService.saveHistory(assistantId, messages);
        }
    }, [selectedAssistant, messages, getAssistantId]); // 依赖 selectedAssistant、messages 和 getAssistantId

    const handleSend = async () => {
        if (!inputValue.trim()) {
            return;
        }

        const assistantId = getAssistantId(selectedAssistant);
        if (!assistantId) {
            message.error('请先选择一个AI助手');
            return;
        }

        try {
            const userMessage = { 
                id: Date.now(),
                content: inputValue.replace(/\n/g, '\n'),
                isUser: true 
            };
            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setInputValue('');
            setLoading(true);

            const response = await aiAssistantService.callAssistant(assistantId, inputValue);
            
            if (response.success) {
                const assistantMessage = { 
                    id: Date.now(),
                    content: response.data.message || response.data.data?.message || '抱歉，我暂时无法回答这个问题', 
                    isUser: false 
                };
                setMessages([...newMessages, assistantMessage]);
                
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
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift + Enter 换行，不阻止默认行为
                return;
            }
            // 仅当按下Enter且没有按Shift时才发送消息
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e) => {
        setInputValue(e.target.value);
        // 自动调整输入框高度
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
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
        a.download = `${selectedAssistant?.name || 'AI助手'}_对话内容_${new Date().toLocaleString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        message.success('导出成功');
    };

    const handleClearChat = () => {
        setMessages([]);
        // 清除本地存储的聊天记录
        const assistantId = getAssistantId(selectedAssistant);
        if (assistantId) {
            chatHistoryService.clearHistory(assistantId);
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

    // 添加图片上传配置
    const uploadProps = {
        name: 'image',
        showUploadList: false,
        beforeUpload: (file) => {
            // 检查文件类型
            if (!file.type.startsWith('image/')) {
                message.error('请上传图片文件');
                return false;
            }

            // 检查文件大小（限制为5MB）
            if (file.size > 5 * 1024 * 1024) {
                message.error('图片大小不能超过5MB');
                return false;
            }

            // 自定义上传
            const formData = new FormData();
            formData.append('image', file);

            setImageUploading(true);
            // 修改请求配置
            http.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                },
                transformRequest: [(data) => data], // 防止axios转换FormData
                timeout: 30000 // 增加超时时间
            })
            .then(response => {
                if (response.data.success) {
                    const imageUrl = response.data.url;
                    setInputValue(prev => prev + `\n![image](${imageUrl})`);
                    message.success('图片上传成功');
                } else {
                    throw new Error(response.data.message || '上传失败');
                }
            })
            .catch(error => {
                console.error('图片上传失败:', error);
                console.error('错误详情:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                message.error(error.response?.data?.message || '图片上传失败，请重试');
            })
            .finally(() => {
                setImageUploading(false);
            });

            return false; // 阻止默认上传
        }
    };

    const renderHeader = () => {
        if (!assistantInfo) return null;
        const isDeepseekModel = assistantInfo.model?.includes('deepseek');
        
        return (
            <ChatHeader>
                <HeaderTitle>
                    <RobotOutlined />
                    {assistantInfo.name}
                </HeaderTitle>
                <HeaderDescription>
                    {assistantInfo.description || '专业的AI助手，为您提供智能对话服务'}
                </HeaderDescription>
                <HeaderPoints>
                    <div className="feature-points">
                        <span>
                            <MessageOutlined />
                            智能对话
                        </span>
                        <span>
                            <FileTextOutlined />
                            文件分析
                        </span>
                        <span>
                            <StarOutlined />
                            专业服务
                        </span>
                        <span className="cost-points">
                            <MoneyCollectOutlined />
                            每次对话{assistantInfo.pointsCost}积分
                            {isDeepseekModel && (
                                <span className="file-cost">
                                    (文件分析+5积分)
                                </span>
                            )}
                        </span>
                    </div>
                </HeaderPoints>
                <ClearChatButton onClick={handleClearChat}>
                    <DeleteOutlined />
                    清除记录
                </ClearChatButton>
            </ChatHeader>
        );
    };

    // 修改渲染逻辑
    const renderContent = () => {
        console.log('selectedAssistant in renderContent:', selectedAssistant);
        
        // 如果没有选择助手，显示欢迎界面
        if (!selectedAssistant) {
            console.log('Rendering Welcome component - no assistant selected');
            return <Welcome />;
        }

        // 如果选择了助手但缺少必要信息，也显示欢迎界面
        if (!selectedAssistant.key && !selectedAssistant._id) {
            console.log('Rendering Welcome component - missing key and _id');
            return <Welcome />;
        }

        return (
            <>
                {renderHeader()}
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
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <LoadingOutlined style={{ fontSize: 24, color: '#6b7280' }} />
                            <div style={{ marginTop: 8, color: '#6b7280' }}>域锦AI正在思考中...</div>
                        </div>
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
                                <button icon={<UploadOutlined />}>选择文件</button>
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
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                placeholder="输入您的问题... (Shift + Enter 换行，Enter 发送)"
                                disabled={loading}
                            />
                            <Upload {...uploadProps}>
                                <label className="upload-btn">
                                    {imageUploading ? <LoadingOutlined /> : <PictureOutlined />}
                                </label>
                            </Upload>
                            <button
                                type="primary"
                                onClick={handleSend}
                                disabled={loading || imageUploading}
                            >
                                <SendOutlined /> 发送
                            </button>
                        </InputWrapper>
                    )}
                </InputArea>
            </>
        );
    };

    // 添加调试日志
    useEffect(() => {
        console.log('ChatWindow mounted');
        console.log('Initial selectedAssistant:', selectedAssistant);
    }, [selectedAssistant]); // 依赖 selectedAssistant

    return (
        <ChatContainer>
            {renderContent()}
        </ChatContainer>
    );
};

export default ChatWindow; 