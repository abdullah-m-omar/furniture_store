import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'

function fmtCurrency(amount, locale = 'en-US', currency = 'USD') {
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount) }
  catch { return amount?.toFixed?.(2) ?? amount }
}

/**
 * Props:
 *  - p: { id, title, price, currency, image }
 *  - categoryLabel? (string)
 *  - locale? (e.g., 'ar-SA' or 'en-US')
 *  - onAdd?(p): optional override; if omitted, uses CartContext
 */
export default function ProductCard({ p, categoryLabel, locale = 'en-US', onAdd }) {
  const { addItem } = useCart()
  const { show } = useToast()

  const handleAdd = () => {
    if (onAdd) {
      onAdd(p)
    } else {
      addItem({ id: p.id, title: p.title, price: p.price, image: p.image })
      show('Product added to the cart', 'success')
    }
  }

  const currency = locale === 'ar-SA' ? 'SAR' : (p.currency || 'USD')

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={p.image} alt={p.title} style={{ objectFit: 'cover', height: 220 }} />
      <Card.Body className="d-flex flex-column">
        {categoryLabel && <div className="text-muted small mb-1">{categoryLabel}</div>}
        <Card.Title className="fs-6">{p.title}</Card.Title>
        <div className="text-muted mb-2">{fmtCurrency(p.price, locale, currency)}</div>
        <div className="mt-auto d-flex gap-2">
          <Button as={Link} to={`/products/${p.id}`} variant="outline-primary" className="w-100">
            View
          </Button>
          <Button variant="primary" className="w-100" onClick={handleAdd}>Add</Button>
        </div>
      </Card.Body>
    </Card>
  )
}
