import React, { useState } from 'react'
import { Navbar, Nav, Container, Form, Button, NavDropdown, Badge } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../context/LocaleContext' // lang/dir switcher

const Header = () => {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()
  const { lang, setLang, dir } = useLocale()

  // Navigation items based on your App.jsx routes
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/faq', label: t('nav.faq') }
  ]

  const isActive = (path) => location.pathname === path

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
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <span className="fs-4">🪑 {t('brand')}</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Navigation Items */}
        <Navbar.Collapse id="basic-navbar-nav">
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
          <Form className={dir === 'rtl' ? 'd-flex ms-3' : 'd-flex me-3'} style={{ minWidth: '300px' }}>
            <Form.Control
              type="search"
              placeholder={t('search.placeholder')}
              className={dir === 'rtl' ? 'ms-2' : 'me-2'}
              aria-label={t('search.aria')}
            />
            <Button variant="outline-primary" type="submit" aria-label={t('search.button')}>
              <FaSearch />
            </Button>
          </Form>

          {/* Right Side Actions */}
          <Nav className={dir === 'rtl' ? 'me-auto' : 'ms-auto'}>
            {/* Language Switcher */}
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
            <Nav.Link as={Link} to="/cart" className="position-relative me-3">
              <FaShoppingCart className="fs-5" title={t('nav.cart')} />
              <Badge
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle rounded-pill"
                style={{ fontSize: '0.7rem' }}
              >
                3
              </Badge>
            </Nav.Link>


            {/* User Account Dropdown */}
            <NavDropdown
              title={<FaUser className="fs-5" />}
              id="user-dropdown"
              align={dir === 'rtl' ? 'start' : 'end'}
              className="me-2"
            >
              <NavDropdown.Item as={Link} to="/login">{t('account.login')}</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/register">{t('account.register')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/dashboard">{t('account.dashboard')}</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/account/profile">{t('account.profile')}</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/account/orders">{t('account.orders')}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
