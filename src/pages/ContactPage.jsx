import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'

export default function ContactPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(t('contact.alert')) // placeholder; you’ll wire real handling later
  }

  return (
    <Container className="py-5" dir={dir}>
      <Row className="gy-4">
        <Col md={6}>
          <h1 className="mb-3">{t('contact.title')}</h1>
          <p className="text-muted">{t('contact.sub')}</p>

          <Card className="shadow-sm">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('contact.name')}</Form.Label>
                  <Form.Control required placeholder={t('contact.namePh')} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t('contact.email')}</Form.Label>
                  <Form.Control type="email" required placeholder="you@example.com" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t('contact.message')}</Form.Label>
                  <Form.Control as="textarea" rows={5} required placeholder={t('contact.messagePh')} />
                </Form.Group>
                <Button type="submit" variant="primary">{t('contact.send')}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-2">{t('contact.infoTitle')}</h5>
              <p className="mb-1">{t('contact.address')}</p>
              <p className="mb-1">{t('contact.phone')}</p>
              <p className="mb-0">{t('contact.hours')}</p>
            </Card.Body>
          </Card>
          <div className="ratio ratio-16x9 mt-3 rounded overflow-hidden shadow-sm">
            <iframe
              title="map"
              src="https://maps.google.com/maps?q=Riyadh&t=&z=12&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}
