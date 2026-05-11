import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '@/api/auth';
import { useAuth } from '@/stores/auth';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const setAuth = useAuth((s) => s.setAuth);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const { token, user } = await login(values.username, values.password);
      setAuth(token, user);
      message.success(t('auth.loginOk'));
      navigate(redirect);
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  return (
    <div
      style={{
        background: '#f7f7f7',
        minHeight: 'calc(100vh - 160px)',
        padding: '40px 16px',
      }}
    >
      <Card
        style={{ maxWidth: 420, margin: '40px auto', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        title={<div style={{ textAlign: 'center' }}>{t('auth.loginTitle')}</div>}
      >
        <Form layout="vertical" onFinish={onFinish} initialValues={{ remember: true }}>
          <Form.Item
            name="username"
            label={t('auth.username')}
            rules={[{ required: true, message: t('auth.emailRequired') }]}
          >
            <Input size="large" placeholder="demo" />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('auth.password')}
            rules={[
              { required: true, message: t('auth.passwordRequired') },
              { min: 6, message: t('auth.passwordShort') },
            ]}
          >
            <Input.Password size="large" placeholder="demo123" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>{t('auth.remember')}</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              {t('auth.submitLogin')}
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Link to="/register">{t('auth.toRegister')}</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
