import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '@/mock/api';
import type { Role, Permission } from '@/types';

export default function RoleMgr() {
  const [rows, setRows] = useState<Role[]>([]);
  const [perms, setPerms] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form] = Form.useForm();

  const load = () => Promise.all([api.roles.list(), api.permissions.list()]).then(([r, p]) => { setRows(r); setPerms(p); });
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    const v = await form.validateFields();
    const payload: Omit<Role, 'id'> = {
      code: v.code, name: { zh: v.nameZh, en: v.nameEn }, remark: v.remark, permissions: v.permissions || [],
    };
    if (editing) {
      await api.roles.update(editing.id, payload);
      message.success('已更新');
    } else {
      await api.roles.create(payload);
      message.success('已新增');
    }
    setOpen(false); setEditing(null); form.resetFields();
    load();
  };

  return (
    <div>
      <Space style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
        <h2 style={{ margin: 0 }}>角色管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>新增角色</Button>
      </Space>
      <Table<Role>
        rowKey="id"
        dataSource={rows}
        columns={[
          { title: '角色码', dataIndex: 'code' },
          { title: '中文名', render: (_, r) => r.name.zh },
          { title: 'English', render: (_, r) => r.name.en },
          { title: '备注', dataIndex: 'remark' },
          {
            title: '权限', dataIndex: 'permissions',
            render: (ps: string[]) => (
              <Space size={4} wrap>
                {ps.map((p) => <Tag key={p} color={p === '*' ? 'red' : 'geekblue'}>{p}</Tag>)}
              </Space>
            ),
          },
          {
            title: '操作', width: 150, render: (_, r) => (
              <Space>
                <a onClick={() => { setEditing(r); form.setFieldsValue({ code: r.code, nameZh: r.name.zh, nameEn: r.name.en, remark: r.remark, permissions: r.permissions }); setOpen(true); }}>编辑</a>
                <Popconfirm title="确认删除?" onConfirm={async () => { await api.roles.remove(r.id); message.success('已删除'); load(); }}>
                  <a style={{ color: '#ff4d4f' }}>删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal title={editing ? '编辑角色' : '新增角色'} open={open} onOk={onSave} onCancel={() => setOpen(false)} destroyOnClose width={640}>
        <Form form={form} layout="vertical">
          <Form.Item label="角色码" name="code" rules={[{ required: true }]}><Input placeholder="operator" /></Form.Item>
          <Form.Item label="中文名" name="nameZh" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="英文名" name="nameEn" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="备注" name="remark"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item label="权限" name="permissions">
            <Select mode="multiple" options={perms.map((p) => ({ value: p.code, label: `${p.name.zh} (${p.code})` }))} placeholder="选择权限，* 代表全部" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
