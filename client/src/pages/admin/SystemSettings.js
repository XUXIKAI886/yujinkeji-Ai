import React from 'react';
import { Form, InputNumber, Button, Card, Space, Switch } from 'antd';

const SystemSettings = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  return (
    <div>
      <Card title="系统配置">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            registerPoints: 30,
            minPoints: 0,
            maxPoints: 1000,
            systemStatus: true,
            maintenance: false,
          }}
        >
          <Form.Item
            label="注册赠送积分"
            name="registerPoints"
            rules={[{ required: true, message: '请输入注册赠送积分' }]}
          >
            <InputNumber min={0} max={100} />
          </Form.Item>

          <Form.Item
            label="最低积分限制"
            name="minPoints"
            rules={[{ required: true, message: '请输入最低积分限制' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="最高积分限制"
            name="maxPoints"
            rules={[{ required: true, message: '请输入最高积分限制' }]}
          >
            <InputNumber min={100} />
          </Form.Item>

          <Form.Item
            label="系统状态"
            name="systemStatus"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>

          <Form.Item
            label="维护模式"
            name="maintenance"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SystemSettings; 