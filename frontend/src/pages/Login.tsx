import { useState } from 'react';
import { Form, Input, Button, Card, message, Checkbox, Divider } from 'antd';
import { UserOutlined, LockOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '@/utils/auth';

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (v: { username: string; password: string; remember?: boolean }) => {
    setLoading(true);
    // 模拟网络延时
    await new Promise((r) => setTimeout(r, 400));
    const u = login(v.username.trim(), v.password);
    setLoading(false);
    if (!u) {
      message.error('用户名或密码错误');
      return;
    }
    message.success(`欢迎回来，${u.name}`);
    nav('/dashboard', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #ff6900 0%, #ff9248 35%, #ffc68a 70%, #fff5ec 100%)',
        padding: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 装饰圆形背景 */}
      <div style={{ position: 'absolute', top: -120, left: -120, width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
      <div style={{ position: 'absolute', bottom: -160, right: -160, width: 480, height: 480, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

      <div
        style={{
          width: 960,
          maxWidth: '100%',
          display: 'flex',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* 左侧品牌区 */}
        <div
          style={{
            flex: 1,
            background: 'linear-gradient(160deg, #ff6900 0%, #ff8f3d 100%)',
            color: '#fff',
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
          }}
          className="login-brand"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShoppingOutlined style={{ fontSize: 32 }} />
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 1 }}>OneClick</span>
            </div>
            <div style={{ fontSize: 14, marginTop: 6, opacity: 0.85 }}>运营管理平台 · Admin Console</div>
          </div>

          <div>
            <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.3, marginBottom: 12 }}>
              一站式跨境<br />代购与转运管理
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.7 }}>
              产品 · 订单 · 支付 · 转运 · 增值服务<br />
              多币种 · 中英文 · 全流程可视化运营
            </div>
          </div>

          <div style={{ fontSize: 12, opacity: 0.7 }}>© {new Date().getFullYear()} OneClick. All rights reserved.</div>
        </div>

        {/* 右侧登录区 */}
        <div style={{ flex: 1, padding: '56px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#1f1f1f' }}>账号登录</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>请使用分配的管理员账号登录系统</div>

          <Form
            layout="vertical"
            size="large"
            style={{ marginTop: 32 }}
            initialValues={{ remember: true, username: 'admin', password: '123456' }}
            onFinish={onFinish}
          >
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder="用户名" autoComplete="username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder="密码" autoComplete="current-password" />
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <a style={{ color: '#ff6900' }}>忘记密码？</a>
              </div>
            </Form.Item>
            <Form.Item style={{ marginBottom: 8 }}>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44, fontSize: 15, fontWeight: 500 }}>
                登 录
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '16px 0', color: '#bbb', fontSize: 12 }} plain>演示账号</Divider>
          <Card size="small" style={{ background: '#fafafa', border: '1px dashed #eee' }}>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>
              用户名：<b>admin</b> / operator / finance / cs01<br />
              统一密码：<b>123456</b>
            </div>
          </Card>
        </div>
      </div>

      {/* 小屏自适应：左侧品牌区隐藏 */}
      <style>{`
        @media (max-width: 720px) {
          .login-brand { display: none !important; }
        }
      `}</style>
    </div>
  );
}
