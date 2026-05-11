import { Form, Input, Button, Checkbox, Card, Select, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { register } from '@/api/auth';
import { useAuth } from '@/stores/auth';

const COUNTRIES = [
  { code: 'CN', label_zh: '中国', label_en: 'China' },
  { code: 'US', label_zh: '美国', label_en: 'United States' },
  { code: 'GB', label_zh: '英国', label_en: 'United Kingdom' },
  { code: 'DE', label_zh: '德国', label_en: 'Germany' },
  { code: 'FR', label_zh: '法国', label_en: 'France' },
  { code: 'JP', label_zh: '日本', label_en: 'Japan' },
  { code: 'KR', label_zh: '韩国', label_en: 'Korea' },
  { code: 'CA', label_zh: '加拿大', label_en: 'Canada' },
];

interface FormValues {
  email: string;
  password: string;
  confirm: string;
  country: string;
  agree: boolean;
}

export default function Register() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuth((s) => s.setAuth);

  const onFinish = async (values: FormValues) => {
    try {
      const { token, user } = await register(values.email, values.password, values.country);
      setAuth(token, user);
      message.success(t('auth.registerOk'));
      navigate('/');
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
        style={{ maxWidth: 460, margin: '40px auto', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        title={<div style={{ textAlign: 'center' }}>{t('auth.registerTitle')}</div>}
      >
        <Form layout="vertical" onFinish={onFinish} initialValues={{ country: 'CN' }}>
          <Form.Item
            name="email"
            label={t('auth.email')}
            rules={[
              { required: true, message: t('auth.emailRequired') },
              { type: 'email', message: t('auth.emailInvalid') },
            ]}
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('auth.password')}
            rules={[
              { required: true, message: t('auth.passwordRequired') },
              { min: 6, message: t('auth.passwordShort') },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label={t('auth.confirmPassword')}
            dependencies={['password']}
            rules={[
              { required: true, message: t('auth.passwordRequired') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error(t('auth.passwordMismatch')));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item name="country" label={t('auth.country')}>
            <Select size="large">
              {COUNTRIES.map((c) => (
                <Select.Option key={c.code} value={c.code}>
                  {i18n.language === 'en' ? c.label_en : c.label_zh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error(t('auth.mustAgree'))),
              },
            ]}
          >
            <Checkbox>{t('auth.agree')}</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              {t('auth.submitRegister')}
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Link to="/login">{t('auth.toLogin')}</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
