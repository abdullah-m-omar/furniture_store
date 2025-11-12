import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'
import { supabase } from '../services/supabaseClient'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ ...form })
      if (err) throw err
      const from = location.state?.from || '/dashboard'
      navigate(from, { replace: true })
    } catch (e2) {
      const msg = e2.message?.includes('Invalid login')
        ? 'Invalid email or password'
        : e2.message
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5" dir={dir}>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="h4 mb-3">{t('auth.loginTitle')}</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('auth.email')}</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t('auth.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button disabled={loading} type="submit" className="w-100" variant="primary">
                  {t('auth.signIn')}
                </Button>
              </Form>
              <div className="d-flex justify-content-between mt-3">
                <Link to="/register">{t('auth.createAccountLink')}</Link>
                <Link to="/forgot-password">{t('auth.forgotPassword')}</Link>
              </div>

              <div className="text-center mt-3">
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                >
                  {t('auth.continueGoogle')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
