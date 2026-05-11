import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select,
  Popconfirm, message, Row, Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { ShippingLine } from '@/types';
import { CURRENCY_OPTIONS, formatMoney } from '@/utils/currency';

const COUNTRY_OPTIONS = ['US', 'CA', 'GB', 'IE', 'DE', 'FR', 'IT', 'ES', 'JP', 'KR', 'AU', 'NZ', 'CN'];

export default function ShippingMgr() {
  const [rows, setRows] = useState<ShippingLine[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingLine | null>(null);
  const [form] = Form.useForm();

  const load = () => api.shipping.list().then(setRows);
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    const v = await form.validateFields();
    const payload: Omit<ShippingLine, 'id'> = {
      code: v.code,
      name: { zh: v.nameZh, en: v.nameEn },
      countries: v.countries,
      firstKgFee: { amount: v.firstKgAmount, currency: v.feeCurrency },
      pricePerKg: { amount: v.perKgAmount, currency: v.feeCurrency },
      durationDays: v.durationDays,
      fuelPct: v.fuelPct,
      status: v.status,
    };
    if (editing) {
      await api.shipping.update(editing.id, payload);
      message.success('已更新');
    } else {
      await api.shipping.create(payload);
      message.success('已新增');
    }
    setOpen(false); setEditing(null); form.resetFields();
    load();
  };

  const onEdit = (r: ShippingLine) => {
    setEditing(r);
    form.setFieldsValue({
      code: r.code, nameZh: r.name.zh, nameEn: r.name.en,
      countries: r.countries,
      firstKgAmount: r.firstKgFee.amount,
      perKgAmount: r.pricePerKg.amount,
      feeCurrency: r.firstKgFee.currency,
      durationDays: r.durationDays, fuelPct: r.fuelPct, status: r.status,
    });
    setOpen(true);
  };

  return (
    <div>
      <Space style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
        <h2 style={{ margin: 0 }}>转运服务管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增线路</Button>
      </Space>
      <Table<ShippingLine>
        rowKey="id"
        dataSource={rows}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        columns={[
          { title: '线路编码', dataIndex: 'code', width: 140 },
          { title: '中文名', render: (_, r) => r.name.zh, width: 160 },
          { title: 'English', render: (_, r) => r.name.en, width: 180 },
          { title: '覆盖国家', dataIndex: 'countries', width: 220, render: (arr: string[]) => arr.map((c) => <Tag key={c}>{c}</Tag>) },
          { title: '首重费', width: 140, render: (_, r) => formatMoney(r.firstKgFee) },
          { title: '续重/KG', width: 140, render: (_, r) => formatMoney(r.pricePerKg) },
          { title: '时效(天)', dataIndex: 'durationDays', width: 90 },
          { title: '燃油附加', dataIndex: 'fuelPct', width: 90, render: (v: number) => `${v}%` },
          { title: '状态', dataIndex: 'status', width: 80, render: (v: string) => v === 'on' ? <Tag color="success">启用</Tag> : <Tag>停用</Tag> },
          {
            title: '操作', width: 140, fixed: 'right', render: (_, r) => (
              <Space>
                <a onClick={() => onEdit(r)}>编辑</a>
                <Popconfirm title="确认删除?" onConfirm={async () => { await api.shipping.remove(r.id); message.success('已删除'); load(); }}>
                  <a style={{ color: '#ff4d4f' }}>删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editing ? '编辑线路' : '新增线路'} open={open} width={720} onOk={onSave} onCancel={() => { setOpen(false); setEditing(null); }} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ feeCurrency: 'CNY', status: 'on', fuelPct: 10, durationDays: '7-12' }}>
          <Row gutter={12}>
            <Col span={8}><Form.Item label="线路编码" name="code" rules={[{ required: true }]}><Input placeholder="EU-TaxFree" /></Form.Item></Col>
            <Col span={8}><Form.Item label="中文名" name="nameZh" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={8}><Form.Item label="英文名 (English)" name="nameEn" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={24}>
              <Form.Item label="覆盖国家" name="countries" rules={[{ required: true }]}>
                <Select mode="multiple" options={COUNTRY_OPTIONS.map((c) => ({ label: c, value: c }))} />
              </Form.Item>
            </Col>
            <Col span={8}><Form.Item label="首重费" name="firstKgAmount" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
            <Col span={8}><Form.Item label="续重/KG" name="perKgAmount" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
            <Col span={8}><Form.Item label="运费币种" name="feeCurrency" rules={[{ required: true }]}><Select options={CURRENCY_OPTIONS} /></Form.Item></Col>
            <Col span={8}><Form.Item label="时效(天)" name="durationDays"><Input placeholder="7-12" /></Form.Item></Col>
            <Col span={8}><Form.Item label="燃油附加 (%)" name="fuelPct"><InputNumber style={{ width: '100%' }} min={0} max={100} /></Form.Item></Col>
            <Col span={8}>
              <Form.Item label="状态" name="status">
                <Select options={[{ label: '启用', value: 'on' }, { label: '停用', value: 'off' }]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
