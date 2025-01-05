import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import aiAssistantService from '../../services/aiAssistantService';
import './AIAssistantManagement.css';

const { TextArea } = Input;
const { Option } = Select;

const AIAssistantManagement = () => {
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAssistant, setEditingAssistant] = useState(null);
    const [modelType, setModelType] = useState('coze');
    const [form] = Form.useForm();

    // 获取助手列表
    const fetchAssistants = async () => {
        try {
            setLoading(true);
            const response = await aiAssistantService.getAllAssistants();
            if (response.success) {
                setAssistants(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error('获取AI助手列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssistants();
    }, []);

    // 处理表单提交
    const handleSubmit = async (values) => {
        try {
            // 根据模型类型设置默认值
            const submitData = {
                ...values,
                config: {
                    ...values.config,
                    model: values.config.modelType === 'coze' ? 'coze-bot' : 'deepseek-chat',
                    botId: values.config.bot_id,
                    apiUrl: values.config.url || (
                        values.config.modelType === 'coze' 
                            ? 'https://api.coze.cn/open_api/v2/chat'
                            : 'https://api.deepseek.com/v1/chat/completions'
                    )
                }
            };

            // 删除多余的字段
            delete submitData.config.bot_id;
            delete submitData.config.url;

            let response;
            if (editingAssistant) {
                response = await aiAssistantService.updateAssistant(editingAssistant._id, submitData);
            } else {
                response = await aiAssistantService.createAssistant(submitData);
            }

            if (response.success) {
                message.success(response.message || (editingAssistant ? '更新成功' : '创建成功'));
                setModalVisible(false);
                form.resetFields();
                fetchAssistants();
            } else {
                message.error(response.message || (editingAssistant ? '更新失败' : '创建失败'));
            }
        } catch (error) {
            console.error('操作失败:', error);
            message.error(error.message || '操作失败');
        }
    };

    // 处理删除
    const handleDelete = async (id) => {
        try {
            const response = await aiAssistantService.deleteAssistant(id);
            if (response.success) {
                message.success(response.message);
                fetchAssistants();
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error('删除失败');
        }
    };

    // 处理模型类型变化
    const handleModelTypeChange = (value) => {
        setModelType(value);
        // 设置默认的 URL
        const defaultUrl = value === 'coze' 
            ? 'https://api.coze.cn/open_api/v2/chat'
            : 'https://api.deepseek.com/v1/chat/completions';
        form.setFieldsValue({
            config: {
                ...form.getFieldValue('config'),
                url: defaultUrl
            }
        });
    };

    // 表格列定义
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text || '-'
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => text || '-'
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const typeMap = {
                    'general': '通用助手',
                    'professional': '专业助手',
                    'customer-service': '客服助手'
                };
                return typeMap[type] || type || '-';
            }
        },
        {
            title: '积分消耗',
            dataIndex: 'pointsCost',
            key: 'pointsCost',
            render: (points) => points || 0
        },
        {
            title: '模型类型',
            dataIndex: ['config', 'modelType'],
            key: 'modelType',
            render: (type) => type || '-'
        },
        {
            title: '状态',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <span className={`status ${isActive ? 'active' : 'inactive'}`}>
                    {isActive ? '活跃' : '禁用'}
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div className="action-buttons">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingAssistant(record);
                            setModelType(record.config?.modelType || 'coze');
                            form.setFieldsValue({
                                name: record.name,
                                description: record.description,
                                type: record.type,
                                pointsCost: record.pointsCost,
                                isActive: record.isActive,
                                config: {
                                    modelType: record.config?.modelType || 'coze',
                                    apiKey: record.config?.apiKey || '',
                                    url: record.config?.url || record.config?.apiUrl || '',
                                    temperature: record.config?.temperature || 0.7,
                                    maxTokens: record.config?.maxTokens || 2000,
                                    bot_id: record.config?.bot_id || record.config?.botId || '',
                                    systemPrompt: record.config?.systemPrompt || ''
                                }
                            });
                            setModalVisible(true);
                        }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除这个AI助手吗？"
                        onConfirm={() => handleDelete(record._id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="ai-assistant-management">
            <div className="page-header">
                <h2>AI助手管理</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingAssistant(null);
                        setModelType('coze');
                        form.resetFields();
                        form.setFieldsValue({
                            config: {
                                modelType: 'coze',
                                url: 'https://api.coze.cn/open_api/v2/chat',
                                temperature: 0.7,
                                maxTokens: 2000
                            }
                        });
                        setModalVisible(true);
                    }}
                >
                    添加助手
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={assistants}
                rowKey="_id"
                loading={loading}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                }}
            />

            <Modal
                title={editingAssistant ? '编辑AI助手' : '添加AI助手'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        isActive: true,
                        type: 'general',
                        pointsCost: 1,
                        config: {
                            modelType: 'coze',
                            url: 'https://api.coze.cn/open_api/v2/chat',
                            temperature: 0.7,
                            maxTokens: 2000
                        }
                    }}
                >
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{ required: true, message: '请输入助手名称' }]}
                    >
                        <Input placeholder="请输入助手名称" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="描述"
                        rules={[{ required: true, message: '请输入助手描述' }]}
                    >
                        <TextArea rows={4} placeholder="请输入助手描述" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="类型"
                        rules={[{ required: true, message: '请选择助手类型' }]}
                    >
                        <Select placeholder="请选择助手类型">
                            <Option value="general">通用助手</Option>
                            <Option value="professional">专业助手</Option>
                            <Option value="customer-service">客服助手</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="pointsCost"
                        label="积分消耗"
                        rules={[{ required: true, message: '请输入积分消耗' }]}
                    >
                        <InputNumber min={1} placeholder="请输入每次对话消耗的积分" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="isActive"
                        label="状态"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="活跃" unCheckedChildren="禁用" />
                    </Form.Item>

                    <Form.Item
                        name={['config', 'modelType']}
                        label="模型类型"
                        rules={[{ required: true, message: '请选择模型类型' }]}
                    >
                        <Select 
                            placeholder="请选择模型类型"
                            onChange={handleModelTypeChange}
                        >
                            <Option value="coze">Coze</Option>
                            <Option value="deepseek">DeepSeek</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name={['config', 'apiKey']}
                        label="API密钥"
                        rules={[{ required: true, message: '请输入API密钥' }]}
                    >
                        <Input.Password placeholder="请输入API密钥" />
                    </Form.Item>

                    <Form.Item
                        name={['config', 'url']}
                        label="URL地址"
                        rules={[{ required: true, message: '请输入URL地址' }]}
                    >
                        <Input placeholder="请输入URL地址" />
                    </Form.Item>

                    {modelType === 'coze' && (
                        <Form.Item
                            name={['config', 'bot_id']}
                            label="bot_id"
                            rules={[{ required: true, message: '请输入bot_id' }]}
                        >
                            <Input placeholder="请输入bot_id" />
                        </Form.Item>
                    )}

                    {modelType === 'deepseek' && (
                        <Form.Item
                            name={['config', 'systemPrompt']}
                            label="系统提示词"
                            rules={[{ required: true, message: '请输入系统提示词' }]}
                        >
                            <TextArea 
                                rows={4} 
                                placeholder="请输入系统提示词，用于指导AI助手的行为和角色定位" 
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name={['config', 'temperature']}
                        label="温度"
                        rules={[{ required: true, message: '请输入温度值' }]}
                    >
                        <InputNumber
                            min={0}
                            max={1}
                            step={0.1}
                            placeholder="请输入温度值(0-1)"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name={['config', 'maxTokens']}
                        label="最大Token数"
                        rules={[{ required: true, message: '请输入最大Token数' }]}
                    >
                        <InputNumber
                            min={100}
                            max={4000}
                            step={100}
                            placeholder="请输入最大Token数"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AIAssistantManagement; 