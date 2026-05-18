import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Space } from 'antd';
import {
  ShopOutlined, FileTextOutlined, UserOutlined,
  DollarOutlined, CreditCardOutlined, RiseOutlined,
} from '@ant-design/icons';
import { api } from '@/mock/api';
import type { Order } from '@/types';
import { formatMoney } from '@/utils/currency';

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'default', paid: 'processing', buying: 'cyan',
  arrived: 'blue', shipped: 'geekblue', delivered: 'success', cancelled: 'error',
};
const STATUS_TEXT: Record<Order['status'], string> = {
  pending: '待支付', paid: '已支付', buying: '代购中',
  arrived: '到仓', shipped: '已出库', delivered: '已签收', cancelled: '已取消',
};

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.stats().then(setStats);
    api.orders.list().then(setOrders);
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>工作台</h2>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="订单总数" value={stats?.orderTotal ?? 0} prefix={<FileTextOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="已支付订单" value={stats?.orderPaid ?? 0} valueStyle={{ color: '#52c41a' }} prefix={<RiseOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="产品 / 上架" value={`${stats?.productOn ?? 0} / ${stats?.productTotal ?? 0}`} prefix={<ShopOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="启用渠道" value={stats?.channelEnabled ?? 0} prefix={<CreditCardOutlined />} /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}><Card><Statistic title="用户总数" value={stats?.userTotal ?? 0} prefix={<UserOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="CNY 收入" value={stats?.revenueCNY ?? 0} precision={2} prefix={<DollarOutlined />} suffix="CNY" valueStyle={{ color: '#ff6900' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="待支付订单" value={stats?.orderPending ?? 0} valueStyle={{ color: '#faad14' }} /></Card></Col>
      </Row>
      <Card title="最近订单" style={{ marginTop: 16 }}>
        <Table<Order>
          rowKey="id"
          dataSource={orders}
          pagination={false}
          size="small"
          columns={[
            { title: '订单号', dataIndex: 'id' },
            { title: '下单人', dataIndex: 'userName' },
            { title: '金额', render: (_, r) => <b style={{ color: '#ff6900' }}>{formatMoney(r.total)}</b> },
            {
              title: '状态', dataIndex: 'status',
              render: (s: Order['status']) => (
                <Tag color={STATUS_COLORS[s]}>{STATUS_TEXT[s]}</Tag>
              ),
            },
            { title: '下单时间', dataIndex: 'createdAt' },
          ]}
        />
      </Card>
      <Space style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
        
      </Space>
    </div>
  );
}
