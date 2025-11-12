// src/components/Home/ProductListSection.jsx
import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../context/LocaleContext'
import { getProducts } from '../../services/productService'

function fmtCurrency(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

function ProductCardMini({ p, locale, viewLabel }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={p.image} alt={p.title} style={{ objectFit: 'cover', height: 220 }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{p.title}</Card.Title>
        <div className="text-muted mb-2">
          {fmtCurrency(p.price, locale, locale === 'ar-SA' ? 'SAR' : (p.currency || 'USD'))}
        </div>
        <div className="mt-auto d-flex gap-2">
          <Button as={Link} to={`/products/${p.id}`} variant="outline-primary" className="w-100">
            {viewLabel}
          </Button>
          <Button variant="primary" className="w-100">Add</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default function ProductListSection() {
  const { t } = useTranslation()
  const { locale, lang } = useLocale()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true); setError('')
      try {
        const data = await getProducts({ lang, limit: 6, sort: 'newest' })
        if (alive) setItems(data)
      } catch (e) {
        if (alive) setError(e.message || 'Failed to load products.')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [lang])

  return (
    <section className="py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">{t('home.products.title')}</h3>
          <Link to="/products" className="btn btn-outline-secondary btn-sm">
            {t('home.products.viewAll')}
          </Link>
        </div>

        {loading && <div className="d-flex justify-content-center py-4"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Row xs={1} sm={2} md={3} lg={4} className="g-3">
            {items.map(p => (
              <Col key={p.id}>
                <ProductCardMini p={p} locale={locale} viewLabel={t('product.view')} />
              </Col>
            ))}
            {items.length === 0 && (
              <Col><div className="text-muted">{t('products.noResults')}</div></Col>
            )}
          </Row>
        )}
      </Container>
    </section>
  )
}
