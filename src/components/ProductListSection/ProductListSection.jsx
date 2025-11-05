import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../context/LocaleContext'
import { products } from '../../data/products'

function fmtCurrency(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

function ProductCard({ p, locale }) {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={p.image} alt={p.title} style={{ objectFit: 'cover', height: 220 }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{p.title}</Card.Title>
        <div className="text-muted mb-2">{fmtCurrency(p.price, locale, locale === 'ar-SA' ? 'SAR' : 'USD')}</div>
        <div className="mt-auto d-flex gap-2">
          <Button as={Link} to={`/products/${p.id}`} variant="outline-primary" className="w-100">
            View
          </Button>
          <Button variant="primary" className="w-100">+</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default function ProductListSection() {
  const { t } = useTranslation()
  const { locale } = useLocale()

  return (
    <section className="py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">{t('home.products.title')}</h3>
          <Link to="/products" className="btn btn-outline-secondary btn-sm">{t('home.products.viewAll')}</Link>
        </div>
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {products.slice(0, 8).map(p => (
            <Col key={p.id}>
              <ProductCard p={p} locale={locale} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
