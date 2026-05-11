import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select,
  Switch, Popconfirm, message, Row, Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { PayChannel } from '@/types';
import { CURRENCY_OPTIONS } from '@/utils/currency';

const TYPE_OPTIONS: { label: string; value: PayChannel['type']; color: string }[] = [
  { label: '支付宝',  value: 'alipay', color: 'blue' },
  { label: '微信',    value: 'wechat', color: 'green' },
  { label: 'PayPal',  value: 'paypal', color: 'geekblue' },
  { label: '银行卡',  value: 'card',   color: 'purple' },
  { label: 'Stripe',  value: 'stripe', color: 'cyan' },
];
const typeMeta = (t: PayChannel['type']) => TYPE_OPTIONS.find((x) => x.value === t)!;

export default function PayChannelMgr() {
  const [rows, setRows] = useState<PayChannel[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PayChannel | null>(null);
  const [form] = Form.useForm();

  const load = () => api.channels.list().then(setRows);
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    const v = await form.validateFields();
    const payload: Omit<PayChannel, 'id'> = {
      code: v.code,
      name: { zh: v.nameZh, en: v.nameEn },
      type: v.type,
      supportedCurrencies: v.supportedCurrencies,
      feeRate: v.feeRate,
      enabled: v.enabled,
    };
    if (editing) {
      await api.channels.update(editing.id, payload);
      message.success('已更新');
    } else {
      await api.channels.create(payload);
      message.success('已新增');
    }
    setOpen(false); setEditing(null); form.resetFields();
    load();
  };

  const onEdit = (r: PayChannel) => {
    setEditing(r);
    form.setFieldsValue({
      code: r.code, nameZh: r.name.zh, nameEn: r.name.en,
      type: r.type, supportedCurrencies: r.supportedCurrencies,
      feeRate: r.feeRate, enabled: r.enabled,
    });
    setOpen(true);
  };

  const toggleEnable = async (r: PayChannel, enabled: boolean) => {
    await api.channels.update(r.id, { enabled });
    message.success(enabled ? '已启用' : '已停用');
    load();
  };

  return (
    <div>
      <Space style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
        <h2 style={{ margin: 0 }}>支付渠道管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增渠道</Button>
      </Space>
      <Table<PayChannel>
        rowKey="id"
        dataSource={rows}
        pagination={{ pageSize: 10 }}
        columns={[
          { title: '编码', dataIndex: 'code', width: 120 },
          { title: '中文名', render: (_, r) => r.name.zh, width: 160 },
          { title: 'English', render: (_, r) => r.name.en, width: 180 },
          { title: '类型', dataIndex: 'type', width: 120, render: (v: PayChannel['type']) => <Tag color={typeMeta(v).color}>{typeMeta(v).label}</Tag> },
          {
            title: '支持币种', dataIndex: 'supportedCurrencies', width: 260,
            render: (arr: string[]) => arr.map((c) => <Tag key={c} color="orange">{c}</Tag>),
          },
          { title: '手续费率', dataIndex: 'feeRate', width: 100, render: (v: number) => `${v}%` },
          {
            title: '启用', dataIndex: 'enabled', width: 80,
            render: (v: boolean, r) => <Switch checked={v} onChange={(val) => toggleEnable(r, val)} />,
          },
          {
            title: '操作', width: 140, render: (_, r) => (
              <Space>
                <a onClick={() => onEdit(r)}>编辑</a>
                <Popconfirm title="确认删除?" onConfirm={async () => { await api.channels.remove(r.id); message.success('已删除'); load(); }}>
                  <a style={{ color: '#ff4d4f' }}>删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editing ? '编辑支付渠道' : '新增支付渠道'} open={open} width={640} onOk={onSave} onCancel={() => { setOpen(false); setEditing(null); }} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ type: 'alipay', supportedCurrencies: ['CNY'], feeRate: 0.6, enabled: true }}>
          <Row gutter={12}>
            <Col span={12}><Form.Item label="编码" name="code" rules={[{ required: true }]}><Input placeholder="alipay / paypal" /></Form.Item></Col>
            <Col span={12}>
              <Form.Item label="类型" name="type" rules={[{ required: true }]}>
                <Select options={TYPE_OPTIONS.map(({ label, value }) => ({ label, value }))} />
              </Form.Item>
            </Col>
            <Col span={12}><Form.Item label="中文名" name="nameZh" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="英文名 (English)" name="nameEn" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={24}>
              <Form.Item label="支持币种" name="supportedCurrencies" rules={[{ required: true }]}>
                <Select mode="multiple" options={CURRENCY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}><Form.Item label="手续费率 (%)" name="feeRate"><InputNumber style={{ width: '100%' }} min={0} max={100} step={0.1} /></Form.Item></Col>
            <Col span={12}><Form.Item label="启用" name="enabled" valuePropName="checked"><Switch /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
