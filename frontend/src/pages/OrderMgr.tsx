import { useEffect, useState, useMemo } from 'react';
import {
  Table, Space, Tag, Drawer, Descriptions, Select, Input, Card, Row, Col,
  message, Popconfirm,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { Order, OrderStatus, Currency } from '@/types';
import { CURRENCY_OPTIONS, formatMoney, convertTo } from '@/utils/currency';

const STATUS_META: Record<OrderStatus, { color: string; text: string }> = {
  pending:   { color: 'orange',  text: '待支付' },
  paid:      { color: 'blue',    text: '已支付' },
  buying:    { color: 'gold',    text: '代购中' },
  arrived:   { color: 'purple',  text: '已到仓' },
  shipped:   { color: 'cyan',    text: '已出库' },
  delivered: { color: 'success', text: '已签收' },
  cancelled: { color: 'default', text: '已取消' },
};
const STATUS_OPTIONS = (Object.keys(STATUS_META) as OrderStatus[]).map((v) => ({
  label: STATUS_META[v].text, value: v,
}));

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'paid', paid: 'buying', buying: 'arrived',
  arrived: 'shipped', shipped: 'delivered',
};

export default function OrderMgr() {
  const [rows, setRows] = useState<Order[]>([]);
  const [detail, setDetail] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [keyword, setKeyword] = useState('');
  const [viewCurrency, setViewCurrency] = useState<Currency>('CNY');

  const load = () => api.orders.list().then(setRows);
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (keyword && !(r.id.toLowerCase().includes(keyword.toLowerCase()) || r.userName.includes(keyword))) return false;
    return true;
  }), [rows, statusFilter, keyword]);

  const advance = async (r: Order) => {
    const next = NEXT_STATUS[r.status];
    if (!next) { message.info('该订单无可推进状态'); return; }
    await api.orders.update(r.id, { status: next });
    message.success(`订单已推进至「${STATUS_META[next].text}」`);
    load();
  };

  const cancel = async (r: Order) => {
    await api.orders.update(r.id, { status: 'cancelled' });
    message.success('订单已取消');
    load();
  };

  return (
    <div>
      <h2>订单管理</h2>
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space wrap>
          <Input
            placeholder="搜索订单号 / 用户名"
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[{ label: '全部状态', value: 'all' }, ...STATUS_OPTIONS]}
          />
          <span>按此币种汇总：</span>
          <Select value={viewCurrency} onChange={setViewCurrency} options={CURRENCY_OPTIONS} style={{ width: 140 }} />
        </Space>
      </Card>
      <Table<Order>
        rowKey="id"
        dataSource={filtered}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1300 }}
        columns={[
          { title: '订单号', dataIndex: 'id', width: 170, fixed: 'left' },
          { title: '下单用户', dataIndex: 'userName', width: 120 },
          {
            title: '商品',
            render: (_, r) => (
              <>
                {r.items.map((it) => (
                  <div key={it.productId} style={{ fontSize: 12 }}>
                    <span>{it.title.zh}</span>
                    <span style={{ color: '#999' }}> · {it.title.en}</span>
                    <span style={{ marginLeft: 6, color: '#ff6900' }}>x{it.qty}</span>
                  </div>
                ))}
              </>
            ),
          },
          { title: '商品小计', width: 130, render: (_, r) => formatMoney(r.itemsTotal) },
          { title: '运费',     width: 120, render: (_, r) => formatMoney(r.shippingFee) },
          { title: '增值费',   width: 120, render: (_, r) => formatMoney(r.valueServiceFee) },
          { title: '订单总额', width: 140, render: (_, r) => <Tag color="orange">{formatMoney(r.total)}</Tag> },
          { title: `折算(${viewCurrency})`, width: 140, render: (_, r) => formatMoney(convertTo(r.total, viewCurrency)) },
          { title: '状态', width: 100, render: (_, r) => <Tag color={STATUS_META[r.status].color}>{STATUS_META[r.status].text}</Tag> },
          { title: '下单时间', dataIndex: 'createdAt', width: 170 },
          {
            title: '操作', width: 220, fixed: 'right', render: (_, r) => (
              <Space>
                <a onClick={() => setDetail(r)}>详情</a>
                {NEXT_STATUS[r.status] && <a onClick={() => advance(r)}>推进状态</a>}
                {r.status !== 'cancelled' && r.status !== 'delivered' && (
                  <Popconfirm title="确认取消该订单?" onConfirm={() => cancel(r)}>
                    <a style={{ color: '#ff4d4f' }}>取消</a>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />

      <Drawer title={detail ? `订单详情 · ${detail.id}` : ''} width={560} open={!!detail} onClose={() => setDetail(null)}>
        {detail && (
          <>
            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="订单号" span={2}>{detail.id}</Descriptions.Item>
              <Descriptions.Item label="用户">{detail.userName}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color={STATUS_META[detail.status].color}>{STATUS_META[detail.status].text}</Tag></Descriptions.Item>
              <Descriptions.Item label="转运线路">{detail.shippingLineId}</Descriptions.Item>
              <Descriptions.Item label="增值服务">{detail.valueServiceIds.join(', ') || '-'}</Descriptions.Item>
              <Descriptions.Item label="下单时间" span={2}>{detail.createdAt}</Descriptions.Item>
            </Descriptions>
            <h4 style={{ marginTop: 16 }}>商品清单</h4>
            <Table
              rowKey={(it) => it.productId}
              dataSource={detail.items}
              pagination={false}
              size="small"
              columns={[
                { title: '中文名', render: (_, it) => it.title.zh },
                { title: 'English', render: (_, it) => it.title.en },
                { title: '单价', render: (_, it) => formatMoney(it.price) },
                { title: '数量', dataIndex: 'qty', width: 60 },
              ]}
            />
            <h4 style={{ marginTop: 16 }}>费用汇总</h4>
            <Row gutter={8}>
              <Col span={12}><Card size="small" title="商品小计">{formatMoney(detail.itemsTotal)}</Card></Col>
              <Col span={12}><Card size="small" title="运费">{formatMoney(detail.shippingFee)}</Card></Col>
              <Col span={12} style={{ marginTop: 8 }}><Card size="small" title="增值服务费">{formatMoney(detail.valueServiceFee)}</Card></Col>
              <Col span={12} style={{ marginTop: 8 }}><Card size="small" title={<span style={{ color: '#ff6900' }}>合计</span>}>{formatMoney(detail.total)}</Card></Col>
            </Row>
            <div style={{ marginTop: 12, color: '#999', fontSize: 12 }}>
              * 折算至 {viewCurrency}：{formatMoney(convertTo(detail.total, viewCurrency))}
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}
