import { useEffect, useState, useMemo } from 'react';
import {
  Table, Tag, Space, Select, Input, Card, Popconfirm, message,
  Statistic, Row, Col,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { Payment, PaymentStatus, Currency } from '@/types';
import { CURRENCY_OPTIONS, formatMoney, convertTo } from '@/utils/currency';

const STATUS_META: Record<PaymentStatus, { color: string; text: string }> = {
  unpaid:   { color: 'orange',  text: '未支付' },
  paid:     { color: 'success', text: '已支付' },
  refunded: { color: 'purple',  text: '已退款' },
  failed:   { color: 'error',   text: '失败' },
};
const STATUS_OPTIONS = (Object.keys(STATUS_META) as PaymentStatus[]).map((v) => ({
  label: STATUS_META[v].text, value: v,
}));

export default function PaymentMgr() {
  const [rows, setRows] = useState<Payment[]>([]);
  const [status, setStatus] = useState<PaymentStatus | 'all'>('all');
  const [keyword, setKeyword] = useState('');
  const [viewCurrency, setViewCurrency] = useState<Currency>('CNY');

  const load = () => api.payments.list().then(setRows);
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter((r) => {
    if (status !== 'all' && r.status !== status) return false;
    if (keyword && !(r.id.toLowerCase().includes(keyword.toLowerCase()) || r.orderId.toLowerCase().includes(keyword.toLowerCase()))) return false;
    return true;
  }), [rows, status, keyword]);

  // 按查看币种汇总
  const summary = useMemo(() => {
    let paid = 0, unpaid = 0, refunded = 0;
    for (const r of filtered) {
      const v = convertTo(r.amount, viewCurrency).amount;
      if (r.status === 'paid') paid += v;
      else if (r.status === 'unpaid') unpaid += v;
      else if (r.status === 'refunded') refunded += v;
    }
    return { paid: +paid.toFixed(2), unpaid: +unpaid.toFixed(2), refunded: +refunded.toFixed(2) };
  }, [filtered, viewCurrency]);

  const markPaid = async (r: Payment) => {
    await api.payments.update(r.id, { status: 'paid', paidAt: new Date().toISOString().slice(0, 19).replace('T', ' ') });
    message.success('已标记为已支付');
    load();
  };
  const refund = async (r: Payment) => {
    await api.payments.update(r.id, { status: 'refunded' });
    message.success('已退款');
    load();
  };

  return (
    <div>
      <h2>结算支付管理</h2>
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={8}><Card size="small"><Statistic title={`已收金额 (${viewCurrency})`} value={summary.paid} precision={viewCurrency === 'JPY' ? 0 : 2} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={8}><Card size="small"><Statistic title={`待收金额 (${viewCurrency})`} value={summary.unpaid} precision={viewCurrency === 'JPY' ? 0 : 2} valueStyle={{ color: '#fa8c16' }} /></Card></Col>
        <Col span={8}><Card size="small"><Statistic title={`已退金额 (${viewCurrency})`} value={summary.refunded} precision={viewCurrency === 'JPY' ? 0 : 2} valueStyle={{ color: '#722ed1' }} /></Card></Col>
      </Row>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Space wrap>
          <Input
            placeholder="搜索支付号 / 订单号"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Select value={status} onChange={setStatus} style={{ width: 160 }} options={[{ label: '全部状态', value: 'all' }, ...STATUS_OPTIONS]} />
          <span>按此币种查看：</span>
          <Select value={viewCurrency} onChange={setViewCurrency} style={{ width: 140 }} options={CURRENCY_OPTIONS} />
        </Space>
      </Card>

      <Table<Payment>
        rowKey="id"
        dataSource={filtered}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        columns={[
          { title: '支付号', dataIndex: 'id', width: 120 },
          { title: '关联订单', dataIndex: 'orderId', width: 180 },
          { title: '支付渠道', width: 160, render: (_, r) => <>
            <div>{r.channelName.zh}</div>
            <div style={{ color: '#999', fontSize: 12 }}>{r.channelName.en}</div>
          </> },
          { title: '原币金额', width: 160, render: (_, r) => <Tag color="orange">{formatMoney(r.amount)}</Tag> },
          { title: `折算(${viewCurrency})`, width: 140, render: (_, r) => formatMoney(convertTo(r.amount, viewCurrency)) },
          { title: '状态', dataIndex: 'status', width: 90, render: (v: PaymentStatus) => <Tag color={STATUS_META[v].color}>{STATUS_META[v].text}</Tag> },
          { title: '创建时间', dataIndex: 'createdAt', width: 160 },
          { title: '支付时间', dataIndex: 'paidAt', width: 160, render: (v?: string) => v || '-' },
          {
            title: '操作', width: 180, fixed: 'right', render: (_, r) => (
              <Space>
                {r.status === 'unpaid' && <a onClick={() => markPaid(r)}>标记已支付</a>}
                {r.status === 'paid' && (
                  <Popconfirm title="确认退款?" onConfirm={() => refund(r)}>
                    <a style={{ color: '#ff4d4f' }}>退款</a>
                  </Popconfirm>
                )}
                {(r.status === 'refunded' || r.status === 'failed') && <span style={{ color: '#999' }}>—</span>}
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}
