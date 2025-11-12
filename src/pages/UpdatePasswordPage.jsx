import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'
import { supabase } from '../services/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function UpdatePasswordPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMsg('')
    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      setMsg(t('auth.passwordUpdated'))
      setTimeout(() => navigate('/login'), 1200)
    } catch (e2) {
      setError(e2.message)
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
              <h1 className="h4 mb-3">{t('auth.updatePasswordTitle')}</h1>
              {msg && <Alert variant="success">{msg}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('auth.newPassword')}</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </Form.Group>
                <Button disabled={loading} type="submit" className="w-100" variant="primary">
                  {t('auth.setNewPassword')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
