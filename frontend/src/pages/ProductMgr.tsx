import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select,
  Popconfirm, message, Image, Row, Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { Product, Currency } from '@/types';
import { CURRENCY_OPTIONS, formatMoney, convertTo } from '@/utils/currency';

const CATEGORY_OPTIONS = ['饰品', '服饰', '鞋履', '手表', '食品', '数码', '箱包', '美妆'];
const FROM_OPTIONS: { label: string; value: Product['from'] }[] = [
  { label: '淘宝', value: 'taobao' },
  { label: '天猫', value: 'tmall' },
  { label: '京东', value: 'jd' },
  { label: '1688', value: '1688' },
];

export default function ProductMgr() {
  const [rows, setRows] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewCurrency, setViewCurrency] = useState<Currency>('CNY');
  const [form] = Form.useForm();

  const load = () => api.products.list().then(setRows);
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    const v = await form.validateFields();
    const payload: Omit<Product, 'id'> = {
      title: { zh: v.titleZh, en: v.titleEn },
      sku: v.sku,
      price: { amount: v.priceAmount, currency: v.priceCurrency },
      stock: v.stock,
      category: v.category,
      from: v.from,
      image: v.image || '/images/products/default.png',
      status: v.status,
      createdAt: editing?.createdAt || new Date().toISOString().slice(0, 10),
    };
    if (editing) {
      await api.products.update(editing.id, payload);
      message.success('产品已更新');
    } else {
      await api.products.create(payload);
      message.success('产品已新增');
    }
    setOpen(false); setEditing(null); form.resetFields();
    load();
  };

  const onEdit = (r: Product) => {
    setEditing(r);
    form.setFieldsValue({
      titleZh: r.title.zh, titleEn: r.title.en,
      sku: r.sku, priceAmount: r.price.amount, priceCurrency: r.price.currency,
      stock: r.stock, category: r.category, from: r.from,
      image: r.image, status: r.status,
    });
    setOpen(true);
  };

  return (
    <div>
      <Space style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
        <h2 style={{ margin: 0 }}>产品管理</h2>
        <Space>
          <span>按此币种查看：</span>
          <Select
            value={viewCurrency}
            onChange={setViewCurrency}
            options={CURRENCY_OPTIONS}
            style={{ width: 140 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增产品</Button>
        </Space>
      </Space>
      <Table<Product>
        rowKey="id"
        dataSource={rows}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        columns={[
          { title: '图片', dataIndex: 'image', width: 80, render: (v: string) => <Image src={v} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} fallback="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='48' height='48' fill='%23f0f0f0'/></svg>" /> },
          { title: 'SKU', dataIndex: 'sku', width: 100 },
          { title: '中文名', render: (_, r) => r.title.zh, width: 220 },
          { title: 'English', render: (_, r) => r.title.en, width: 220 },
          { title: '原价', width: 140, render: (_, r) => <Tag color="orange">{formatMoney(r.price)}</Tag> },
          { title: `折算(${viewCurrency})`, width: 140, render: (_, r) => formatMoney(convertTo(r.price, viewCurrency)) },
          { title: '库存', dataIndex: 'stock', width: 80 },
          { title: '分类', dataIndex: 'category', width: 80 },
          { title: '来源', dataIndex: 'from', width: 80, render: (v) => <Tag>{v}</Tag> },
          { title: '状态', dataIndex: 'status', width: 80, render: (v: string) => v === 'on' ? <Tag color="success">在售</Tag> : <Tag>下架</Tag> },
          {
            title: '操作', width: 140, fixed: 'right', render: (_, r) => (
              <Space>
                <a onClick={() => onEdit(r)}>编辑</a>
                <Popconfirm title="确认删除?" onConfirm={async () => { await api.products.remove(r.id); message.success('已删除'); load(); }}>
                  <a style={{ color: '#ff4d4f' }}>删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title={editing ? '编辑产品' : '新增产品'}
        open={open} width={720}
        onOk={onSave}
        onCancel={() => { setOpen(false); setEditing(null); }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ priceCurrency: 'CNY', stock: 1, status: 'on', from: 'tmall' }}>
          <Row gutter={12}>
            <Col span={12}><Form.Item label="中文名" name="titleZh" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="英文名 (English)" name="titleEn" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="SKU" name="sku" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="价格" name="priceAmount" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
            <Col span={8}><Form.Item label="币种" name="priceCurrency" rules={[{ required: true }]}><Select options={CURRENCY_OPTIONS} /></Form.Item></Col>
            <Col span={8}><Form.Item label="库存" name="stock"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
            <Col span={8}>
              <Form.Item label="分类" name="category" rules={[{ required: true }]}>
                <Select options={CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))} />
              </Form.Item>
            </Col>
            <Col span={8}><Form.Item label="来源" name="from"><Select options={FROM_OPTIONS} /></Form.Item></Col>
            <Col span={16}><Form.Item label="图片地址" name="image"><Input placeholder="/images/products/xxx.jpg" /></Form.Item></Col>
            <Col span={8}>
              <Form.Item label="状态" name="status">
                <Select options={[{ label: '在售', value: 'on' }, { label: '下架', value: 'off' }]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
