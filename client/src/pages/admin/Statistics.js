import React from 'react';
import { Card, Row, Col, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const Statistics = () => {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <RangePicker />
      </div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="使用趋势">
            {/* 这里将添加趋势图表 */}
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              图表区域
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="用户活跃度">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              图表区域
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="积分消耗统计">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              图表区域
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics; 