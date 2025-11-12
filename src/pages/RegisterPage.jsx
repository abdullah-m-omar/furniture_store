import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'
import { supabase } from '../services/supabaseClient'
import { uploadAvatar, updateProfile } from '../services/profileService'
import { Link } from 'react-router-dom'

export default function RegisterPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')

    // sanitize
    const name = (form.name || '').trim()
    const username = (form.username || '').trim().toLowerCase()
    const email = (form.email || '').trim().toLowerCase()
    const password = (form.password || '').trim()

    // basic validations
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailOk) { setError('Please enter a valid email address.'); return }
    if (!/^[a-z0-9_]{3,}$/.test(username)) {
      setError('Username must be at least 3 chars, lowercase letters/numbers/underscore only.')
      return
    }

    setLoading(true)
    try {
      const { data: sign, error: signErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, username } }
      })
      if (signErr) {
        const msg = signErr.message || ''
        if (/email address.*invalid/i.test(msg)) setError('Please enter a valid email address.')
        else if (/signups.*not allowed|signup.*disabled/i.test(msg)) setError('Email signups are disabled in project settings.')
        else if (/already registered|exists/i.test(msg)) setError('An account with this email already exists.')
        else setError(msg)
        return
      }

      // If email confirmation is ON, session may be null here.
      const session = sign.session
      if (session && avatarFile) {
        const avatarUrl = await uploadAvatar(session.user.id, avatarFile)
        await updateProfile({ name, username, avatarUrl })
      } else {
        // Save name/username into profiles via trigger already done by signUp (metadata),
        // but avatar waits until after first login if confirmations are enabled.
        await updateProfile({ name, username })
          .catch(() => {/* ignore if not yet allowed due to no session */})
      }

      setNotice(t('auth.verifyEmailNotice'))
      setForm({ name: '', username: '', email: '', password: '' })
      setAvatarFile(null)
    } catch (e2) {
      setError(e2.message || 'Registration failed.')
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
              <h1 className="h4 mb-3">{t('auth.registerTitle')}</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              {notice && <Alert variant="info">{notice}</Alert>}
              <Form onSubmit={onSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>{t('auth.name')}</Form.Label>
                  <Form.Control
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    pattern="^[a-z0-9_]{3,}$"
                    placeholder="e.g. abdullah_om"
                    required
                  />
                  <Form.Text className="text-muted">lowercase letters, numbers, _ (min 3)</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('auth.email')}</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('auth.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    minLength={6}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                  />
                </Form.Group>

                <Button disabled={loading} type="submit" className="w-100" variant="primary">
                  {loading ? t('common.loading') || 'Loading…' : t('auth.createAccount')}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                  disabled={loading}
                >
                  {t('auth.continueGoogle')}
                </Button>
              </div>

              <div className="text-center mt-3">
                <Link to="/login">{t('auth.signIn')}</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
