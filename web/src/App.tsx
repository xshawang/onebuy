import { Layout } from 'antd';
import AppRouter from './router';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const { Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header />
      <Content>
        <AppRouter />
      </Content>
      <Footer />
    </Layout>
  );
}
