import { useEffect, useState } from 'react';
import { Tabs, Table, Button, Space, Tag, Modal, Form, Select, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { AuthGrant, User, Role, Permission } from '@/types';

export default function AuthMgr() {
  const [grants, setGrants] = useState<AuthGrant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [perms, setPerms] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => Promise.all([
    api.auth.list(), api.users.list(), api.roles.list(), api.permissions.list(),
  ]).then(([g, u, r, p]) => { setGrants(g); setUsers(u); setRoles(r); setPerms(p); });
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    const v = await form.validateFields();
    await api.auth.create({
      userId: v.userId, roleId: v.roleId,
      grantedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      grantedBy: 'admin',
    });
    message.success('授权成功');
    setOpen(false); form.resetFields();
    load();
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>授权管理</h2>
      <Tabs
        items={[
          {
            key: 'grants', label: '用户授权',
            children: (
              <div>
                <Space style={{ marginBottom: 12 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>新增授权</Button>
                </Space>
                <Table<AuthGrant>
                  rowKey="id"
                  dataSource={grants}
                  columns={[
                    { title: '授权 ID', dataIndex: 'id', width: 80 },
                    { title: '用户', dataIndex: 'userId', render: (id) => {
                      const u = users.find((x) => x.id === id);
                      return u ? <Tag color="blue">{u.username} · {u.name}</Tag> : id;
                    } },
                    { title: '角色', dataIndex: 'roleId', render: (id) => {
                      const r = roles.find((x) => x.id === id);
                      return r ? <Tag color="orange">{r.name.zh}</Tag> : id;
                    } },
                    { title: '授权人', dataIndex: 'grantedBy' },
                    { title: '授权时间', dataIndex: 'grantedAt' },
                    {
                      title: '操作', width: 100, render: (_, r) => (
                        <Popconfirm title="取消此授权?" onConfirm={async () => { await api.auth.remove(r.id); message.success('已取消'); load(); }}>
                          <a style={{ color: '#ff4d4f' }}>回收</a>
                        </Popconfirm>
                      ),
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            key: 'perms', label: '权限点',
            children: (
              <Table<Permission>
                rowKey="id"
                dataSource={perms}
                columns={[
                  { title: '权限码', dataIndex: 'code' },
                  { title: '模块', dataIndex: 'module' },
                  { title: '动作', dataIndex: 'action' },
                  { title: '中文', render: (_, r) => r.name.zh },
                  { title: 'English', render: (_, r) => r.name.en },
                ]}
              />
            ),
          },
        ]}
      />
      <Modal title="新增授权" open={open} onOk={onSave} onCancel={() => setOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item label="用户" name="userId" rules={[{ required: true }]}>
            <Select options={users.map((u) => ({ value: u.id, label: `${u.username} · ${u.name}` }))} />
          </Form.Item>
          <Form.Item label="角色" name="roleId" rules={[{ required: true }]}>
            <Select options={roles.map((r) => ({ value: r.id, label: r.name.zh }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
