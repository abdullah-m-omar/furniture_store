import { Container, Row, Col, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import aboutImg from '../../assets/images/about-thumb.jpg'
export default function AboutSection() {
  const { t } = useTranslation()
  return (
    <section className="py-5">
      <Container>
        <Row className="align-items-center gy-4">
          <Col md={{ span: 3, offset: 2 }}>
            <img src={aboutImg} alt="" className="img-fluid rounded shadow-sm" width={300} />
          </Col>
          <Col md={6}>
            <h3 className="mb-3">{t('home.about.title')}</h3>
            <p className="text-muted">{t('home.about.text')}</p>
            <Button as={Link} to="/about" variant="primary">{t('home.about.cta')}</Button>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
