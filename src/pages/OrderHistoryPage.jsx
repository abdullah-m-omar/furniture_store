import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Table, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'
import { supabase } from '../services/supabaseClient'
import { listMyOrders, getGuestOrderByNumberAndPhone } from '../services/orderService'

function fmt(amount, currency = 'SAR', locale = 'ar-SA') {
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount) }
  catch { return (amount/1).toFixed(2) }
}

export default function OrderHistoryPage() {
  const { t } = useTranslation()
  const { dir, locale } = useLocale()
  const [isAuthed, setIsAuthed] = useState(false)

  // authed list
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])

  // guest form
  const [g, setG] = useState({ orderNumber: '', phone: '' })
  const [gLoading, setGLoading] = useState(false)
  const [gError, setGError] = useState('')
  const [gResult, setGResult] = useState(null)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthed(!!user)
      if (user) {
        try {
          setLoading(true); setError('')
          const res = await listMyOrders({})
          setOrders(res.rows)
        } catch (e) {
          setError(e.message || 'Failed to load orders')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    })()
  }, [])

  const onGuestLookup = async (e) => {
    e.preventDefault()
    setGError(''); setGResult(null); setGLoading(true)
    try {
      const data = await getGuestOrderByNumberAndPhone(g.orderNumber.trim(), g.phone.trim())
      if (!data) {
        setGError(t('orders.notFound') || 'Order not found. Check number and phone.')
      } else {
        setGResult(data) // { order:{...}, items:[...] }
      }
    } catch (e2) {
      setGError(e2.message || 'Lookup failed')
    } finally {
      setGLoading(false)
    }
  }

  const currency = locale === 'ar-SA' ? 'SAR' : 'USD'

  return (
    <Container className="py-4" dir={dir}>
      <Row className="gy-4">
        <Col md={isAuthed ? 12 : 6}>
          <h2 className="h5 mb-3">{t('orders.title') || 'Order History'}</h2>

          {isAuthed ? (
            <Card className="shadow-sm">
              <Card.Body>
                {loading ? (
                  <div className="d-flex justify-content-center"><Spinner animation="border" /></div>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : orders.length === 0 ? (
                  <div className="text-muted">{t('orders.empty') || 'You have no orders yet.'}</div>
                ) : (
                  <Table responsive hover className="align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('orders.status') || 'Status'}</th>
                        <th>{t('orders.total') || 'Total'}</th>
                        <th>{t('orders.date') || 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td>{o.order_number}</td>
                          <td>{o.status}</td>
                          <td>{fmt(o.total_cents / 100, o.currency || currency, locale)}</td>
                          <td>{new Date(o.created_at).toLocaleString(locale)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="h6 mb-3">{t('orders.guestLookup') || 'Find your order (guest)'}</h3>
                {gError && <Alert variant="danger">{gError}</Alert>}
                <Form onSubmit={onGuestLookup} className="mb-3">
                  <Row className="g-2">
                    <Col md={6}>
                      <Form.Control
                        placeholder={t('orders.orderNumber') || 'Order Number (e.g., MD251117-00001)'}
                        value={g.orderNumber}
                        onChange={(e)=>setG({ ...g, orderNumber: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        placeholder={t('orders.phone') || 'Phone used on order'}
                        value={g.phone}
                        onChange={(e)=>setG({ ...g, phone: e.target.value })}
                        required
                      />
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end mt-3">
                    <Button type="submit" disabled={gLoading}>
                      {gLoading ? (t('common.pleaseWait') || 'Please wait...') : (t('orders.lookup') || 'Lookup')}
                    </Button>
                  </div>
                </Form>

                {gResult && (
                  <div>
                    <div className="mb-2">
                      <strong>{t('orders.order') || 'Order'}:</strong> {gResult.order.order_number} — {gResult.order.status}
                    </div>
                    <Table size="sm" responsive>
                      <thead>
                        <tr>
                          <th>{t('orders.product') || 'Product'}</th>
                          <th>{t('orders.qty') || 'Qty'}</th>
                          <th>{t('orders.price') || 'Price'}</th>
                          <th>{t('orders.subtotal') || 'Subtotal'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gResult.items.map(it => (
                          <tr key={it.id}>
                            <td>{it.title}</td>
                            <td>{it.quantity}</td>
                            <td>{fmt(it.price_cents / 100, gResult.order.currency || currency, locale)}</td>
                            <td>{fmt((it.price_cents * it.quantity) / 100, gResult.order.currency || currency, locale)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-end">
                      <div className="fw-semibold">
                        {t('orders.total') || 'Total'}: {fmt(gResult.order.total_cents / 100, gResult.order.currency || currency, locale)}
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}
