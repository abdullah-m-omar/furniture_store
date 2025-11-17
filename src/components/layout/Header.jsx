import React, { useEffect, useState } from 'react'
import { Navbar, Nav, Container, Form, Button, NavDropdown, Badge, Image } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../context/LocaleContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabaseClient'
import { useCart } from '../../context/CartContext'

/**
 * Optional: pass cartCount from CartContext
 * <Header cartCount={cart.items.length} />
 */
const Header = ({ cartCount = 0 }) => {
  const { count } = useCart()
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [profile, setProfile] = useState({ name: '', avatar_url: '', role: 'customer' })

  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { lang, setLang, dir } = useLocale()
  const { user } = useAuth()

  // Fetch profile (name/avatar/role) when user changes
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!user) { setProfile({ name: '', avatar_url: '', role: 'customer' }); return }
      // Prefer user metadata first for snappy UI
      const metaName = user.user_metadata?.name || ''
      const metaAvatar = user.user_metadata?.avatar_url || ''
      setProfile(p => ({ ...p, name: metaName, avatar_url: metaAvatar }))

      // Then sync with profiles table (source of truth)
      const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar_url, role')
        .eq('id', user.id)
        .single()
      if (!cancelled && !error && data) {
        setProfile({
          name: data.name || metaName,
          avatar_url: data.avatar_url || metaAvatar,
          role: data.role || 'customer'
        })
      }
    }
    load()
    return () => { cancelled = true }
  }, [user])

  // Navigation items based on your App.jsx routes
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/faq', label: t('nav.faq') }
  ]

  const isActive = (path) => location.pathname === path

  const onSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`)
    setExpanded(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setExpanded(false)
    navigate('/', { replace: true })
  }

  const displayName = profile.name || user?.email || ''
  const avatar = profile.avatar_url

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="shadow-sm border-bottom"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      dir={dir}
    >
      <Container>
        {/* Logo/Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary" onClick={() => setExpanded(false)}>
          <span className="fs-4">🪑 {t('brand')}</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="primary-navbar" />

        {/* Navigation */}
        <Navbar.Collapse id="primary-navbar">
          <Nav className={dir === 'rtl' ? 'ms-auto' : 'me-auto'}>
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`px-3 ${isActive(item.path) ? 'active fw-bold' : ''}`}
                onClick={() => setExpanded(false)}
              >
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Search Bar */}
          <Form onSubmit={onSearch} className={dir === 'rtl' ? 'd-flex ms-3' : 'd-flex me-3'} style={{ minWidth: 300 }}>
            <Form.Control
              type="search"
              placeholder={t('search.placeholder')}
              className={dir === 'rtl' ? 'ms-2' : 'me-2'}
              aria-label={t('search.aria')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-primary" type="submit" aria-label={t('search.button')}>
              <FaSearch />
            </Button>
          </Form>

          {/* Right Side */}
          <Nav className={dir === 'rtl' ? 'me-auto align-items-center' : 'ms-auto align-items-center'}>
            {/* Language */}
            <NavDropdown
              title={lang === 'ar' ? t('common.ar') : t('common.en')}
              id="lang-dropdown"
              align={dir === 'rtl' ? 'start' : 'end'}
              className="me-2"
            >
              <NavDropdown.Item onClick={() => setLang('en')}>{t('common.en')}</NavDropdown.Item>
              <NavDropdown.Item onClick={() => setLang('ar')}>{t('common.ar')}</NavDropdown.Item>
            </NavDropdown>

            {/* Cart */}
            <Nav.Link as={Link} to="/cart" className="position-relative me-3" onClick={() => setExpanded(false)}>
              <FaShoppingCart className="fs-5" title={t('nav.cart')} />
              {count > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: '0.7rem' }}
                >
                  {count}
                </Badge>
              )}
            </Nav.Link>

            {/* User */}
            {user ? (
              <NavDropdown
                align={dir === 'rtl' ? 'start' : 'end'}
                title={
                  avatar ? (
                    <Image src={avatar} alt={displayName} roundedCircle width={28} height={28} />
                  ) : (
                    <FaUser className="fs-5" />
                  )
                }
                id="user-dropdown"
                className="me-2"
              >
                <NavDropdown.Header className="text-truncate" style={{ maxWidth: 220 }}>
                  {displayName}
                </NavDropdown.Header>
                {/* Admin link (optional) */}
                {profile.role === 'admin' && (
                  <NavDropdown.Item as={Link} to="/dashboard" onClick={() => setExpanded(false)}>
                    {t('account.dashboard')}
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item as={Link} to="/account/profile" onClick={() => setExpanded(false)}>
                  {t('account.profile')}
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/account/orders" onClick={() => setExpanded(false)}>
                  {t('account.orders')}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={signOut}>{t('auth.signOut') || 'Sign out'}</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                title={<FaUser className="fs-5" />}
                id="guest-dropdown"
                align={dir === 'rtl' ? 'start' : 'end'}
                className="me-2"
              >
                <NavDropdown.Item as={Link} to="/login" onClick={() => setExpanded(false)}>
                  {t('account.login')}
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/register" onClick={() => setExpanded(false)}>
                  {t('account.register')}
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
