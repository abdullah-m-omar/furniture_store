import { Container, Row, Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'

export default function AboutPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()

  return (
    <Container className="py-5" dir={dir}>
      <Row className="gy-4">
        <Col md={6}>
          <h1 className="mb-3">{t('about.title')}</h1>
          <p className="text-muted">{t('about.intro')}</p>
          <Card className="mt-3 shadow-sm">
            <Card.Body>
              <h5 className="mb-2">{t('about.missionTitle')}</h5>
              <p className="mb-0">{t('about.mission')}</p>
            </Card.Body>
          </Card>
          <Card className="mt-3 shadow-sm">
            <Card.Body>
              <h5 className="mb-2">{t('about.valuesTitle')}</h5>
              <ul className="mb-0">
                <li>{t('about.values.quality')}</li>
                <li>{t('about.values.sustainability')}</li>
                <li>{t('about.values.service')}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <img src="/about-hero.jpg" alt="" className="img-fluid rounded shadow-sm" />
        </Col>
      </Row>
    </Container>
  )
}
