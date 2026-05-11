import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Switch, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { MenuItem } from '@/types';

export default function MenuMgr() {
  const [rows, setRows] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();

  const load = () => api.menus.list().then(setRows);
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    const v = await form.validateFields();
    const payload: Omit<MenuItem, 'id'> = {
      parentId: v.parentId || null,
      name: { zh: v.nameZh, en: v.nameEn },
      path: v.path, icon: v.icon, sort: v.sort, visible: v.visible,
    };
    if (editing) {
      await api.menus.update(editing.id, payload);
      message.success('已更新');
    } else {
      await api.menus.create(payload);
      message.success('已新增');
    }
    setOpen(false); setEditing(null); form.resetFields();
    load();
  };

  const onEdit = (r: MenuItem) => {
    setEditing(r);
    form.setFieldsValue({
      parentId: r.parentId, nameZh: r.name.zh, nameEn: r.name.en,
      path: r.path, icon: r.icon, sort: r.sort, visible: r.visible,
    });
    setOpen(true);
  };

  return (
    <div>
      <Space style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
        <h2 style={{ margin: 0 }}>菜单管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增菜单</Button>
      </Space>
      <Table<MenuItem>
        rowKey="id"
        dataSource={rows}
        pagination={{ pageSize: 20 }}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 80 },
          { title: '父级', dataIndex: 'parentId', width: 100, render: (v) => v || <Tag>根</Tag> },
          { title: '中文', render: (_, r) => r.name.zh },
          { title: 'English', render: (_, r) => r.name.en },
          { title: '路径', dataIndex: 'path' },
          { title: '图标', dataIndex: 'icon' },
          { title: '排序', dataIndex: 'sort', width: 60 },
          { title: '可见', dataIndex: 'visible', width: 80, render: (v: boolean) => v ? <Tag color="success">显示</Tag> : <Tag>隐藏</Tag> },
          {
            title: '操作', width: 150, render: (_, r) => (
              <Space>
                <a onClick={() => onEdit(r)}>编辑</a>
                <Popconfirm title="确认删除?" onConfirm={async () => { await api.menus.remove(r.id); message.success('已删除'); load(); }}>
                  <a style={{ color: '#ff4d4f' }}>删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editing ? '编辑菜单' : '新增菜单'} open={open} onOk={onSave} onCancel={() => { setOpen(false); setEditing(null); }} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ sort: 1, visible: true }}>
          <Form.Item label="父级 ID" name="parentId"><Input placeholder="根菜单留空" /></Form.Item>
          <Form.Item label="中文名" name="nameZh" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="英文名" name="nameEn" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="路径" name="path" rules={[{ required: true }]}><Input placeholder="/biz/product" /></Form.Item>
          <Form.Item label="图标" name="icon"><Input placeholder="ShopOutlined" /></Form.Item>
          <Form.Item label="排序" name="sort"><InputNumber min={0} /></Form.Item>
          <Form.Item label="是否可见" name="visible" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
