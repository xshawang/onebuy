import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  const { t } = useTranslation();
  return (
    <AntFooter
      style={{
        background: '#222',
        color: '#aaa',
        textAlign: 'center',
        padding: '28px 16px',
        marginTop: 48,
      }}
    >
      <div className="container">
        <div style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>
          {t('common.appName')}
        </div>
        <div style={{ fontSize: 12 }}>{t('common.slogan')}</div>
        <div style={{ fontSize: 12, marginTop: 12, opacity: 0.6 }}>
          © {new Date().getFullYear()} OneClick Clone · Demo only, no real service.
        </div>
      </div>
    </AntFooter>
  );
}
