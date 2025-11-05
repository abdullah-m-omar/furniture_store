import { Container, Row, Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function TestimonialsSection() {
  const { t } = useTranslation()
  const list = [
    { id: 1, name: t('home.testimonials.items.1.name'), text: t('home.testimonials.items.1.text') },
    { id: 2, name: t('home.testimonials.items.2.name'), text: t('home.testimonials.items.2.text') },
    { id: 3, name: t('home.testimonials.items.3.name'), text: t('home.testimonials.items.3.text') }
  ]

  return (
    <section className="py-5 bg-light">
      <Container>
        <h3 className="mb-4">{t('home.testimonials.title')}</h3>
        <Row xs={1} md={3} className="g-3">
          {list.map(item => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <p className="mb-3 text-muted">“{item.text}”</p>
                  <div className="fw-semibold">{item.name}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
