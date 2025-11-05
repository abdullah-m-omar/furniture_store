import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../context/LocaleContext'

function fmtCurrency(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export default function ProductInfo({ product }) {
  const { t } = useTranslation()
  const { locale, dir } = useLocale()
  const currency = locale === 'ar-SA' ? 'SAR' : 'USD'

  return (
    <div dir={dir}>
      <h1 className="h3 mb-1">{product.title}</h1>
      <div className="text-muted mb-2">{t(`categories.${product.category}`)}</div>
      <div className="h4 mb-3">{fmtCurrency(product.price, locale, currency)}</div>
      <p className="mb-4">{product.description}</p>

      <Form className="d-flex gap-2 mb-3" style={{ maxWidth: 320 }}>
        <Form.Select defaultValue="1" aria-label={t('product.quantity')}>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </Form.Select>
        <Button variant="primary" className="flex-fill">{t('product.addToCart')}</Button>
      </Form>

      <div className="small text-muted">
        {t('product.shippingNote')}
      </div>
    </div>
  )
}
