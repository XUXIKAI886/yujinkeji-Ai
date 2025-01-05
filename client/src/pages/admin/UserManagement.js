import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Space, Tooltip, Spin } from 'antd';
import { PlusOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import * as userService from '../../services/userService';
import { getUserAssistantPermissions, updateUserAssistantPermission } from '../../services/userAssistantPermissionService';
import moment from 'moment';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  h2 {
    margin: 0;
    color: #1a1a1a;
    font-weight: 500;
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [assistantPermissions, setAssistantPermissions] = useState({});
  const [loadingPermissions, setLoadingPermissions] = useState({});

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 处理添加/编辑用户
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser._id, values);
        message.success('更新用户成功');
      } else {
        await userService.createUser(values);
        message.success('添加用户成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  // 处理积分变更
  const handlePointsChange = async (userId, currentPoints) => {
    let newPoints = currentPoints;
    Modal.confirm({
      title: '修改积分',
      content: (
        <div>
          <p>当前积分：{currentPoints}</p>
          <InputNumber
            defaultValue={currentPoints}
            onChange={value => { newPoints = value; }}
            min={0}
            style={{ width: '100%' }}
          />
        </div>
      ),
      onOk: async () => {
        try {
          if (typeof newPoints !== 'number' || newPoints < 0) {
            message.error('请输入有效的积分值');
            return;
          }
          console.log('Attempting to update points:', {
            userId,
            currentPoints,
            newPoints
          });
          const result = await userService.updateUserPoints(userId, newPoints);
          console.log('Update points result:', result);
          message.success('积分更新成功');
          fetchUsers();
        } catch (error) {
          console.error('积分更新失败:', {
            error,
            userId,
            currentPoints,
            newPoints
          });
          message.error(error.message || '积分更新失败');
        }
      }
    });
  };

  // 处理禁用/启用用户
  const handleToggleStatus = async (userId, enabled) => {
    try {
      await userService.updateUserStatus(userId, enabled);
      message.success(enabled ? '用户已启用' : '用户已禁用');
      fetchUsers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 查看积分历史
  const showPointsHistory = async (userId) => {
    try {
      const response = await userService.getUserPointsHistory(userId);
      console.log('获取到的积分历史数据:', response);

      if (!response.success) {
        message.error(response.message || '获取积分历史失败');
        return;
      }

      const historyData = response.data;
      console.log('处理后的积分历史数据:', historyData);

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
                  const displayPoints = record.type === 'use_assistant' ? -Math.abs(points) : points;
                  return (
                    <span style={{ 
                      color: displayPoints < 0 ? '#ff4d4f' : '#52c41a' 
                    }}>
                      {displayPoints}
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
                    'ai_usage': 'AI助手使用',
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
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            rowKey="_id"
            locale={{ emptyText: '暂无积分记录' }}
          />
        )
      });
    } catch (error) {
      console.error('获取积分历史失败:', error);
      message.error('获取积分历史失败');
    }
  };

  // 获取用户的AI助手权限
  const fetchUserAssistantPermissions = async (userId) => {
    try {
      setLoadingPermissions(prev => ({ ...prev, [userId]: true }));
      const response = await getUserAssistantPermissions(userId);
      if (response.success) {
        setAssistantPermissions(prev => ({
          ...prev,
          [userId]: response.data
        }));
      }
    } catch (error) {
      message.error('获取AI助手权限失败');
      console.error('获取AI助手权限失败:', error);
    } finally {
      setLoadingPermissions(prev => ({ ...prev, [userId]: false }));
    }
  };

  // 更新用户的AI助手权限
  const handleUpdateAssistantPermission = async (userId, assistantId, isEnabled) => {
    try {
      const response = await updateUserAssistantPermission(userId, assistantId, { isEnabled });
      if (response.success) {
        message.success('更新AI助手权限成功');
        // 刷新权限列表
        await fetchUserAssistantPermissions(userId);
      }
    } catch (error) {
      message.error('更新AI助手权限失败');
      console.error('更新AI助手权限失败:', error);
    }
  };

  // 显示AI助手权限管理弹窗
  const showAssistantPermissions = async (user) => {
    if (!assistantPermissions[user._id]) {
      await fetchUserAssistantPermissions(user._id);
    }

    Modal.info({
      title: `${user.username} 的AI助手权限管理`,
      width: 800,
      content: (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {loadingPermissions[user._id] ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          ) : (
            <Table
              dataSource={assistantPermissions[user._id] || []}
              rowKey={record => record.assistant.id}
              columns={[
                {
                  title: 'AI助手名称',
                  dataIndex: ['assistant', 'name'],
                  key: 'name'
                },
                {
                  title: '类型',
                  dataIndex: ['assistant', 'type'],
                  key: 'type'
                },
                {
                  title: '描述',
                  dataIndex: ['assistant', 'description'],
                  key: 'description',
                  ellipsis: true
                },
                {
                  title: '默认积分/次',
                  dataIndex: ['assistant', 'defaultPointsCost'],
                  key: 'defaultPointsCost'
                },
                {
                  title: '使用权限',
                  key: 'isEnabled',
                  render: (_, record) => (
                    <Switch
                      checked={record.permission.isEnabled}
                      onChange={(checked) => handleUpdateAssistantPermission(
                        user._id,
                        record.assistant.id,
                        checked
                      )}
                    />
                  )
                },
                {
                  title: '使用次数',
                  dataIndex: ['permission', 'usageCount'],
                  key: 'usageCount'
                },
                {
                  title: '最后使用时间',
                  dataIndex: ['permission', 'lastUsed'],
                  key: 'lastUsed',
                  render: (lastUsed) => lastUsed ? moment(lastUsed).format('YYYY-MM-DD HH:mm:ss') : '-'
                }
              ]}
              pagination={false}
            />
          )}
        </div>
      ),
      okText: '关闭'
    });
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '积分',
      dataIndex: 'points',
      key: 'points',
      render: (points, record) => (
        <Space>
          <span>{points}</span>
          <Button
            type="link"
            onClick={() => handlePointsChange(record._id, points)}
          >
            修改
          </Button>
          <Button
            type="link"
            onClick={() => showPointsHistory(record._id)}
          >
            历史
          </Button>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <span style={{ color: enabled ? '#52c41a' : '#ff4d4f' }}>
          {enabled ? '正常' : '已禁用'}
        </span>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'AI助手权限',
      key: 'assistantPermissions',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => showAssistantPermissions(record)}
        >
          管理权限
        </Button>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingUser(record);
                form.setFieldsValue(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.enabled ? '禁用' : '启用'}>
            <Button
              type="link"
              icon={<StopOutlined />}
              danger={record.enabled}
              onClick={() => handleToggleStatus(record._id, !record.enabled)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader>
        <h2>用户管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingUser(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          添加用户
        </Button>
      </PageHeader>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="points"
            label="积分"
            initialValue={0}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="enabled"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 