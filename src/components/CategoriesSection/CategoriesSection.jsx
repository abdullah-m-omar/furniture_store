import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLocale } from '../../context/LocaleContext'
import { getCategories } from '../../services/productService'

export default function CategoriesSection() {
  const { t } = useTranslation()
  const { lang } = useLocale()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cats, setCats] = useState([]) // {key,label,image}

  useEffect(() => {
    let on = true
    ;(async () => {
      setLoading(true); setError('')
      try {
        const data = await getCategories({ lang })
        if (on) setCats(data)
      } catch (e) {
        if (on) setError(e.message || 'Failed to load categories.')
      } finally {
        if (on) setLoading(false)
      }
    })()
    return () => { on = false }
  }, [lang])

  return (
    <section className="py-5 bg-light">
      <Container>
        <h3 className="mb-4">{t('home.categories.title')}</h3>

        {loading && <div className="d-flex justify-content-center py-4"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Row xs={2} md={4} className="g-3">
            {cats.map(c => (
              <Col key={c.key}>
                <Card as={Link} to={`/products?category=${encodeURIComponent(c.key)}`} className="h-100 text-decoration-none shadow-sm">
                  <Card.Img src={c.image} alt={c.label} style={{ height: 150, objectFit: 'cover' }} />
                  <Card.Body>
                    <Card.Title className="fs-6 mb-0">{c.label}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  )
}
