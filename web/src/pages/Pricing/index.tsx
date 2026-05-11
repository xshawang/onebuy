import {
  Card,
  Row,
  Col,
  Tag,
  Steps,
  Alert,
  Collapse,
  Table,
  Anchor,
} from 'antd';
import {
  ShoppingCartOutlined,
  GlobalOutlined,
  StarOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function Pricing() {
  const { t } = useTranslation();

  // 代购服务费率
  const purchaseFeeCols = [
    { title: t('pricing.col.platform'), dataIndex: 'platform', key: 'platform' },
    { title: t('pricing.col.rate'), dataIndex: 'rate', key: 'rate' },
    { title: t('pricing.col.note'), dataIndex: 'note', key: 'note' },
  ];
  const purchaseFeeRows = [
    {
      key: '1',
      platform: t('pricing.fee.common'),
      rate: t('pricing.fee.free'),
      note: t('pricing.fee.commonNote'),
    },
    {
      key: '2',
      platform: t('pricing.fee.secondhand'),
      rate: '5% ~ 10%',
      note: t('pricing.fee.secondhandNote'),
    },
    {
      key: '3',
      platform: t('pricing.fee.other'),
      rate: '10%',
      note: t('pricing.fee.otherNote'),
    },
    {
      key: '4',
      platform: t('pricing.fee.expert'),
      rate: '10%',
      note: t('pricing.fee.expertNote'),
    },
  ];

  // 增值服务
  const valueServices: Array<{ name: string; desc: string; price: string }> = [
    { name: t('pricing.vs.photo'), desc: t('pricing.vs.photoDesc'), price: '¥3/张' },
    { name: t('pricing.vs.split'), desc: t('pricing.vs.splitDesc'), price: '¥5' },
    { name: t('pricing.vs.repack'), desc: t('pricing.vs.repackDesc'), price: '¥3' },
    { name: t('pricing.vs.trim'), desc: t('pricing.vs.trimDesc'), price: '¥2/件' },
    { name: t('pricing.vs.recheck'), desc: t('pricing.vs.recheckDesc'), price: '¥5' },
    { name: t('pricing.vs.removeTag'), desc: t('pricing.vs.removeTagDesc'), price: '¥2/件' },
    { name: t('pricing.vs.powerOn'), desc: t('pricing.vs.powerOnDesc'), price: '¥10' },
    { name: t('pricing.vs.custom'), desc: t('pricing.vs.customDesc'), price: '¥10+' },
    { name: t('pricing.vs.seal'), desc: t('pricing.vs.sealDesc'), price: '¥3' },
    { name: t('pricing.vs.priority'), desc: t('pricing.vs.priorityDesc'), price: '¥8' },
    { name: t('pricing.vs.tryon'), desc: t('pricing.vs.tryonDesc'), price: '¥20' },
    { name: t('pricing.vs.video'), desc: t('pricing.vs.videoDesc'), price: '¥15' },
    { name: t('pricing.vs.bubble'), desc: t('pricing.vs.bubbleDesc'), price: '¥5' },
    { name: t('pricing.vs.kraft'), desc: t('pricing.vs.kraftDesc'), price: '¥6' },
    { name: t('pricing.vs.epe'), desc: t('pricing.vs.epeDesc'), price: '¥5' },
    { name: t('pricing.vs.epeCustom'), desc: t('pricing.vs.epeCustomDesc'), price: '¥15+' },
    { name: t('pricing.vs.dust'), desc: t('pricing.vs.dustDesc'), price: '¥3' },
    { name: t('pricing.vs.fineCheck'), desc: t('pricing.vs.fineCheckDesc'), price: '¥8' },
    { name: t('pricing.vs.iron'), desc: t('pricing.vs.ironDesc'), price: '¥5' },
    { name: t('pricing.vs.foam'), desc: t('pricing.vs.foamDesc'), price: '¥5' },
    { name: t('pricing.vs.guard'), desc: t('pricing.vs.guardDesc'), price: '¥8' },
    { name: t('pricing.vs.stretch'), desc: t('pricing.vs.stretchDesc'), price: '¥5' },
    { name: t('pricing.vs.wood'), desc: t('pricing.vs.woodDesc'), price: '¥60+' },
    { name: t('pricing.vs.damp'), desc: t('pricing.vs.dampDesc'), price: '¥5' },
    { name: t('pricing.vs.packVideo'), desc: t('pricing.vs.packVideoDesc'), price: '¥8' },
    { name: t('pricing.vs.vacuum'), desc: t('pricing.vs.vacuumDesc'), price: '¥8' },
    { name: t('pricing.vs.foldShoeBox'), desc: t('pricing.vs.foldShoeBoxDesc'), price: '¥3' },
  ];

  // FAQ
  const faqs = [
    { key: 'q1', label: t('pricing.faq.q1'), children: <div>{t('pricing.faq.a1')}</div> },
    { key: 'q2', label: t('pricing.faq.q2'), children: <div>{t('pricing.faq.a2')}</div> },
    { key: 'q3', label: t('pricing.faq.q3'), children: <div>{t('pricing.faq.a3')}</div> },
    { key: 'q4', label: t('pricing.faq.q4'), children: <div>{t('pricing.faq.a4')}</div> },
    { key: 'q5', label: t('pricing.faq.q5'), children: <div>{t('pricing.faq.a5')}</div> },
  ];

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg,#ff6900 0%,#ff9149 100%)',
          color: '#fff',
          padding: '48px 16px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700 }}>{t('pricing.title')}</div>
        <div style={{ marginTop: 12, maxWidth: 780, margin: '12px auto 0' }}>
          {t('pricing.subtitle')}
        </div>
        <div style={{ marginTop: 16 }}>
          <Tag color="#fff" style={{ color: '#ff6900' }}>
            {t('pricing.tag1')}
          </Tag>
          <Tag color="#fff" style={{ color: '#ff6900' }}>
            {t('pricing.tag2')}
          </Tag>
          <Tag color="#fff" style={{ color: '#ff6900' }}>
            {t('pricing.tag3')}
          </Tag>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 16px' }}>
        <Row gutter={24}>
          <Col xs={0} lg={5}>
            <Anchor
              style={{ position: 'sticky', top: 16 }}
              items={[
                { key: 'stage1', href: '#stage1', title: t('pricing.stage1') },
                { key: 'stage2', href: '#stage2', title: t('pricing.stage2') },
                { key: 'stage3', href: '#stage3', title: t('pricing.stage3') },
                { key: 'faq', href: '#faq', title: t('pricing.faqTitle') },
              ]}
            />
          </Col>
          <Col xs={24} lg={19}>
            {/* 三大构成 */}
            <Card style={{ marginBottom: 16 }}>
              <Steps
                responsive
                current={-1}
                items={[
                  {
                    title: t('pricing.stage1'),
                    description: t('pricing.stage1Desc'),
                    icon: <ShoppingCartOutlined />,
                  },
                  {
                    title: t('pricing.stage2'),
                    description: t('pricing.stage2Desc'),
                    icon: <GlobalOutlined />,
                  },
                  {
                    title: t('pricing.stage3'),
                    description: t('pricing.stage3Desc'),
                    icon: <StarOutlined />,
                  },
                ]}
              />
            </Card>

            {/* 第一阶段 */}
            <Card id="stage1" title={t('pricing.stage1')} style={{ marginBottom: 16 }}>
              <p>{t('pricing.s1.intro')}</p>
              <ul style={{ paddingLeft: 18 }}>
                <li>
                  <b>{t('pricing.s1.item1')}</b>：{t('pricing.s1.item1Desc')}
                </li>
                <li>
                  <b>{t('pricing.s1.item2')}</b>：{t('pricing.s1.item2Desc')}
                </li>
                <li>
                  <b>{t('pricing.s1.item3')}</b>：{t('pricing.s1.item3Desc')}
                </li>
              </ul>
              <Table
                columns={purchaseFeeCols}
                dataSource={purchaseFeeRows}
                pagination={false}
                size="middle"
                bordered
              />
              <Alert
                type="info"
                showIcon
                style={{ marginTop: 16 }}
                message={t('pricing.s1.exampleTitle')}
                description={t('pricing.s1.exampleDesc')}
              />
              <Alert
                type="warning"
                showIcon
                style={{ marginTop: 12 }}
                message={t('pricing.s1.storageTitle')}
                description={t('pricing.s1.storageDesc')}
              />
            </Card>

            {/* 第二阶段 */}
            <Card id="stage2" title={t('pricing.stage2')} style={{ marginBottom: 16 }}>
              <p>{t('pricing.s2.intro')}</p>
              <Row gutter={[12, 12]}>
                {[
                  { name: t('pricing.s2.first'), desc: t('pricing.s2.firstDesc') },
                  { name: t('pricing.s2.extra'), desc: t('pricing.s2.extraDesc') },
                  { name: t('pricing.s2.clearance'), desc: t('pricing.s2.clearanceDesc') },
                  { name: t('pricing.s2.fuel'), desc: t('pricing.s2.fuelDesc') },
                  { name: t('pricing.s2.op'), desc: t('pricing.s2.opDesc') },
                ].map((x) => (
                  <Col xs={24} md={12} key={x.name}>
                    <Card size="small" style={{ height: '100%' }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        <CheckCircleFilled style={{ color: 'var(--color-primary)', marginRight: 6 }} />
                        {x.name}
                      </div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                        {x.desc}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Alert
                type="info"
                showIcon
                style={{ marginTop: 16 }}
                message={t('pricing.s2.exampleTitle')}
                description={t('pricing.s2.exampleDesc')}
              />
            </Card>

            {/* 第三阶段 增值服务 */}
            <Card id="stage3" title={t('pricing.stage3')} style={{ marginBottom: 16 }}>
              <p>{t('pricing.s3.intro')}</p>
              <Row gutter={[12, 12]}>
                {valueServices.map((v) => (
                  <Col xs={24} md={12} lg={8} key={v.name}>
                    <Card size="small" style={{ height: '100%' }}>
                      <Row justify="space-between" align="top">
                        <Col>
                          <div style={{ fontWeight: 600 }}>{v.name}</div>
                        </Col>
                        <Col>
                          <Tag color="orange">{v.price}</Tag>
                        </Col>
                      </Row>
                      <div
                        style={{
                          marginTop: 6,
                          color: 'var(--color-text-secondary)',
                          fontSize: 12,
                        }}
                      >
                        {v.desc}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Alert
                type="success"
                showIcon
                style={{ marginTop: 16 }}
                message={t('pricing.s3.tip')}
              />
            </Card>

            {/* FAQ */}
            <Card id="faq" title={t('pricing.faqTitle')}>
              <Collapse items={faqs} defaultActiveKey={['q1']} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
