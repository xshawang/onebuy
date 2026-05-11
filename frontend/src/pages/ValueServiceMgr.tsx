import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select,
  Switch, Popconfirm, message, Row, Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { ValueService } from '@/types';
import { CURRENCY_OPTIONS, formatMoney } from '@/utils/currency';

const GROUP_OPTIONS: { label: string; value: ValueService['group']; color: string }[] = [
  { label: '验货 QC',   value: 'qc',      color: 'blue' },
  { label: '打包 Pack', value: 'pack',    color: 'green' },
  { label: '其他服务',  value: 'service', color: 'orange' },
];
const groupMeta = (g: ValueService['group']) => GROUP_OPTIONS.find((x) => x.value === g)!;

export default function ValueServiceMgr() {
  const [rows, setRows] = useState<ValueService[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ValueService | null>(null);
  const [form] = Form.useForm();

  const load = () => api.valueServices.list().then(setRows);
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    const v = await form.validateFields();
    const payload: Omit<ValueService, 'id'> = {
      code: v.code,
      name: { zh: v.nameZh, en: v.nameEn },
      fee: { amount: v.feeAmount, currency: v.feeCurrency },
      group: v.group,
      enabled: v.enabled,
      sort: v.sort,
    };
    if (editing) {
      await api.valueServices.update(editing.id, payload);
      message.success('已更新');
    } else {
      await api.valueServices.create(payload);
      message.success('已新增');
    }
    setOpen(false); setEditing(null); form.resetFields();
    load();
  };

  const onEdit = (r: ValueService) => {
    setEditing(r);
    form.setFieldsValue({
      code: r.code, nameZh: r.name.zh, nameEn: r.name.en,
      feeAmount: r.fee.amount, feeCurrency: r.fee.currency,
      group: r.group, enabled: r.enabled, sort: r.sort,
    });
    setOpen(true);
  };

  return (
    <div>
      <Space style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
        <h2 style={{ margin: 0 }}>增值服务管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增服务</Button>
      </Space>
      <Table<ValueService>
        rowKey="id"
        dataSource={rows}
        pagination={{ pageSize: 10 }}
        columns={[
          { title: '编码', dataIndex: 'code', width: 120 },
          { title: '中文名', render: (_, r) => r.name.zh, width: 160 },
          { title: 'English', render: (_, r) => r.name.en, width: 200 },
          { title: '分组', dataIndex: 'group', width: 120, render: (v: ValueService['group']) => <Tag color={groupMeta(v).color}>{groupMeta(v).label}</Tag> },
          { title: '费用', width: 160, render: (_, r) => formatMoney(r.fee) },
          { title: '排序', dataIndex: 'sort', width: 80 },
          { title: '启用', dataIndex: 'enabled', width: 80, render: (v: boolean) => v ? <Tag color="success">是</Tag> : <Tag>否</Tag> },
          {
            title: '操作', width: 140, render: (_, r) => (
              <Space>
                <a onClick={() => onEdit(r)}>编辑</a>
                <Popconfirm title="确认删除?" onConfirm={async () => { await api.valueServices.remove(r.id); message.success('已删除'); load(); }}>
                  <a style={{ color: '#ff4d4f' }}>删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editing ? '编辑增值服务' : '新增增值服务'} open={open} width={640} onOk={onSave} onCancel={() => { setOpen(false); setEditing(null); }} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ feeCurrency: 'CNY', enabled: true, sort: 1, group: 'qc' }}>
          <Row gutter={12}>
            <Col span={12}><Form.Item label="编码" name="code" rules={[{ required: true }]}><Input placeholder="photo / recheck / seal" /></Form.Item></Col>
            <Col span={12}><Form.Item label="分组" name="group" rules={[{ required: true }]}><Select options={GROUP_OPTIONS.map(({ label, value }) => ({ label, value }))} /></Form.Item></Col>
            <Col span={12}><Form.Item label="中文名" name="nameZh" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="英文名 (English)" name="nameEn" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item label="费用" name="feeAmount" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
            <Col span={12}><Form.Item label="币种" name="feeCurrency" rules={[{ required: true }]}><Select options={CURRENCY_OPTIONS} /></Form.Item></Col>
            <Col span={12}><Form.Item label="排序" name="sort"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
            <Col span={12}><Form.Item label="启用" name="enabled" valuePropName="checked"><Switch /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
