import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'
import { supabase } from '../services/supabaseClient'
import { uploadAvatar, updateProfile, changeEmail, changePassword } from '../services/profileService'

export default function AccountProfilePage() {
  const { t } = useTranslation()
  const { dir } = useLocale()
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  const [profile, setProfile] = useState({ name: '', username: '', email: '', role: 'customer', avatar_url: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [pw, setPw] = useState({ new1: '', new2: '' })

  useEffect(() => {
    (async () => {
      setErr(''); setOk('')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setErr('Not authenticated'); setLoading(false); return }
      const { data, error } = await supabase
        .from('profiles').select('name, username, role, avatar_url').eq('id', user.id).single()
      if (error) { setErr(error.message); setLoading(false); return }
      setProfile({ name: data.name||'', username: data.username||'', role: data.role, avatar_url: data.avatar_url||'', email: user.email||'' })
      setLoading(false)
    })()
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    setErr(''); setOk('')
    try {
      let avatarUrl = profile.avatar_url
      if (avatarFile) {
        const { data: { user } } = await supabase.auth.getUser()
        avatarUrl = await uploadAvatar(user.id, avatarFile)
      }
      await updateProfile({ name: profile.name, username: profile.username, avatarUrl })

      // Email change (triggers verification email)
      // Only send if changed
      const { data: { user } } = await supabase.auth.getUser()
      if (profile.email && profile.email !== user.email) {
        await changeEmail(profile.email)
        setOk(t('profile.emailChangeSent') || 'Verification email sent to confirm new address.')
      } else {
        setOk(t('profile.saved') || 'Profile updated.')
      }
    } catch (e2) {
      setErr(e2.message)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setErr(''); setOk('')
    try {
      if (pw.new1 !== pw.new2) throw new Error(t('profile.pwMismatch') || 'Passwords do not match')
      await changePassword(pw.new1)
      setPw({ new1: '', new2: '' })
      setOk(t('profile.pwUpdated') || 'Password updated.')
    } catch (e2) {
      setErr(e2.message)
    }
  }

  if (loading) return null

  return (
    <Container className="py-5" dir={dir}>
      <Row className="gy-4">
        <Col md={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="h5 mb-3">{t('profile.title') || 'Profile'}</h2>
              {err && <Alert variant="danger">{err}</Alert>}
              {ok && <Alert variant="success">{ok}</Alert>}
              <Form onSubmit={saveProfile}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{t('auth.name')}</Form.Label>
                      <Form.Control value={profile.name} onChange={e=>setProfile({...profile, name:e.target.value})} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        value={profile.username}
                        onChange={e=>setProfile({...profile, username:e.target.value.toLowerCase()})}
                        pattern="^[a-z0-9_]{3,}$"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>{t('auth.email')}</Form.Label>
                      <Form.Control type="email" value={profile.email} onChange={e=>setProfile({...profile, email:e.target.value})} />
                      <Form.Text className="text-muted">{t('profile.emailNote') || 'Changing email sends a verification link.'}</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Role</Form.Label>
                      <Form.Control value={profile.role} disabled />
                      <Form.Text className="text-muted">{t('profile.roleNote') || 'Only admins can change roles.'}</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Avatar</Form.Label>
                      <div className="d-flex align-items-center gap-3">
                        <Image src={profile.avatar_url || '/no-image.jpg'} rounded width={64} height={64} />
                        <Form.Control type="file" accept="image/*" onChange={e=>setAvatarFile(e.target.files?.[0]||null)} />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" className="mt-3" variant="primary">{t('profile.save') || 'Save changes'}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="h6 mb-3">{t('profile.changePw') || 'Change password'}</h2>
              <Form onSubmit={savePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('auth.newPassword') || 'New password'}</Form.Label>
                  <Form.Control type="password" value={pw.new1} onChange={e=>setPw({...pw, new1:e.target.value})} minLength={6} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t('profile.confirmPw') || 'Confirm password'}</Form.Label>
                  <Form.Control type="password" value={pw.new2} onChange={e=>setPw({...pw, new2:e.target.value})} minLength={6} required />
                </Form.Group>
                <Button type="submit" variant="outline-primary">{t('profile.updatePw') || 'Update password'}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
