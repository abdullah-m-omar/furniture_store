import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../context/LocaleContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'

function fmtCurrency(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

/**
 * Props:
 *  - product: { id, title, price, image, category, description, currency? }
 *  - onAdd?(qty): optional override; if omitted, uses CartContext
 */
export default function ProductInfo({ product, onAdd }) {
  const { t } = useTranslation()
  const { locale, dir } = useLocale()
  const { addItem } = useCart()
  const { show } = useToast()

  const [qty, setQty] = useState(1)
  const currency = locale === 'ar-SA' ? 'SAR' : (product.currency || 'USD')

  const handleSubmit = (e) => {
    e.preventDefault()
    const quantity = Math.max(1, parseInt(qty, 10) || 1)

    if (onAdd) {
      onAdd(quantity)
    } else {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity
      })
      show(t('cart.added') || 'Product added to the cart', 'success')
    }
  }

  return (
    <div dir={dir}>
      <h1 className="h3 mb-1">{product.title}</h1>
      {product.category && (
        <div className="text-muted mb-2">{t(`categories.${product.category}`)}</div>
      )}
      <div className="h4 mb-3">{fmtCurrency(product.price, locale, currency)}</div>
      <p className="mb-4">{product.description}</p>

      <Form onSubmit={handleSubmit} className="d-flex gap-2 mb-3" style={{ maxWidth: 320 }}>
        <Form.Select
          aria-label={t('product.quantity')}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        >
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </Form.Select>
        <Button type="submit" variant="primary" className="flex-fill">
          {t('product.addToCart')}
        </Button>
      </Form>

      <div className="small text-muted">
        {t('product.shippingNote')}
      </div>
    </div>
  )
}
