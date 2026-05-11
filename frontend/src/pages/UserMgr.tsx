import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { User, Role } from '@/types';

export default function UserMgr() {
  const [rows, setRows] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form] = Form.useForm();

  const load = () => Promise.all([api.users.list(), api.roles.list()]).then(([u, r]) => { setRows(u); setRoles(r); });
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    const v = await form.validateFields();
    const payload = { ...v, createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ') };
    if (editing) {
      await api.users.update(editing.id, payload);
      message.success('已更新');
    } else {
      await api.users.create(payload);
      message.success('已新增');
    }
    setOpen(false); setEditing(null); form.resetFields();
    load();
  };

  return (
    <div>
      <Space style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
        <h2 style={{ margin: 0 }}>用户管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增用户</Button>
      </Space>
      <Table<User>
        rowKey="id"
        dataSource={rows}
        columns={[
          { title: '账号', dataIndex: 'username' },
          { title: '姓名', dataIndex: 'name' },
          { title: '邮箱', dataIndex: 'email' },
          {
            title: '角色', dataIndex: 'roleIds',
            render: (ids: string[]) => (
              <Space size={4} wrap>
                {ids.map((id) => {
                  const r = roles.find((x) => x.id === id);
                  return r ? <Tag key={id} color="blue">{r.name.zh}</Tag> : null;
                })}
              </Space>
            ),
          },
          { title: '状态', dataIndex: 'status', render: (s: string) => s === 'active' ? <Tag color="success">启用</Tag> : <Tag color="error">禁用</Tag> },
          { title: '创建时间', dataIndex: 'createdAt' },
          {
            title: '操作', width: 180, render: (_, r) => (
              <Space>
                <a onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true); }}>编辑</a>
                <a onClick={async () => { await api.users.update(r.id, { status: r.status === 'active' ? 'disabled' : 'active' }); load(); }}>
                  {r.status === 'active' ? '禁用' : '启用'}
                </a>
                <Popconfirm title="确认删除?" onConfirm={async () => { await api.users.remove(r.id); message.success('已删除'); load(); }}>
                  <a style={{ color: '#ff4d4f' }}>删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editing ? '编辑用户' : '新增用户'} open={open} onOk={onSave} onCancel={() => setOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ status: 'active', roleIds: [] }}>
          <Form.Item label="账号" name="username" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          <Form.Item label="角色" name="roleIds"><Select mode="multiple" options={roles.map((r) => ({ value: r.id, label: r.name.zh }))} /></Form.Item>
          <Form.Item label="状态" name="status"><Select options={[{ value: 'active', label: '启用' }, { value: 'disabled', label: '禁用' }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
