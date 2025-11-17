import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'
import { useCart } from '../context/CartContext'
import { supabase } from '../services/supabaseClient'
import { createCODOrder, buildWhatsAppLink } from '../services/checkoutService'
import { useToast } from '../context/ToastContext'

function fmt(amount, currency = 'SAR', locale = 'ar-SA') {
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount) }
  catch { return amount.toFixed(2) }
}

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { dir, locale } = useLocale()
  const navigate = useNavigate()
  const { items, subtotal, clear } = useCart()
  const { show } = useToast()

  const currency = locale === 'ar-SA' ? 'SAR' : 'USD'
  // Keep the simple form; we map address -> address_line1 in the service
  const [form, setForm] = useState({ name: '', phone: '', whatsapp: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!items.length) {
      navigate('/order-success', { replace: true })
    }
  }, [items.length, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const order = await createCODOrder({ user, cart: { items }, form, currency })

      // Clear local cart AFTER a successful order
      clear()
      show(t('checkout.placed') || 'Order placed successfully', 'success')

      // Pre-build WhatsApp link for the success page
      const wa = buildWhatsAppLink({
        orderNumber: order.orderNumber,
        items: items.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })),
        total: order.total,
        currency,
        customer: form
      })
      navigate(`/order-success?ord=${order.orderNumber}`, { state: { wa } })
    } catch (e2) {
      setError(e2.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-4" dir={dir}>
      <Row className="gy-4">
        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="h5 mb-3">{t('checkout.title') || 'Checkout (Cash on Delivery)'}</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={submit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{t('auth.name') || 'Name'}</Form.Label>
                      <Form.Control
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{t('checkout.phone') || 'Phone'}</Form.Label>
                      <Form.Control
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>WhatsApp</Form.Label>
                      <Form.Control
                        value={form.whatsapp}
                        onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>{t('checkout.address') || 'Address'}</Form.Label>
                      <Form.Control
                        as="textarea" rows={3}
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>{t('checkout.notes') || 'Notes'}</Form.Label>
                      <Form.Control
                        as="textarea" rows={2}
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-3">
                  <Button type="submit" disabled={loading} variant="primary">
                    {loading ? (t('common.pleaseWait') || 'Please wait...') : (t('checkout.placeOrder') || 'Place Order')}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="h6 mb-3">{t('checkout.summary') || 'Order Summary'}</h3>
              <ul className="list-unstyled mb-3">
                {items.map(it => (
                  <li key={it.id} className="d-flex justify-content-between">
                    <span>{it.title} × {it.quantity}</span>
                    <span>{fmt(it.price * it.quantity, currency, locale)}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between">
                <span className="text-muted">{t('checkout.subtotal') || 'Subtotal'}</span>
                <span>{fmt(subtotal, currency, locale)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">{t('checkout.shipping') || 'Shipping'}</span>
                <span>{fmt(0, currency, locale)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-semibold">
                <span>{t('checkout.total') || 'Total'}</span>
                <span>{fmt(subtotal, currency, locale)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
