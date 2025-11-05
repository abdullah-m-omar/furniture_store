import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLocale } from '../../context/LocaleContext'
import { useTranslation } from 'react-i18next'

function fmtCurrency(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export default function ProductCard({ p, categoryLabel }) {
  const { locale } = useLocale()
  const { t } = useTranslation()
  const currency = locale === 'ar-SA' ? 'SAR' : 'USD'

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={p.image} alt={p.title} style={{ height: 220, objectFit: 'cover' }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{p.title}</Card.Title>
        {categoryLabel && <div className="small text-muted mb-1">{categoryLabel}</div>}
        <div className="text-muted mb-2">{fmtCurrency(p.price, locale, currency)}</div>
        <div className="mt-auto d-flex gap-2">
          <Button as={Link} to={`/products/${p.id}`} variant="outline-primary" className="w-100">
            {t('product.view')}
          </Button>
          <Button variant="primary" className="w-100">{t('product.add')}</Button>
        </div>
      </Card.Body>
    </Card>
  )
}
