import { Table, Image, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

function fmt(amount, currency = 'USD', locale = 'en-US') {
  try { return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount) }
  catch { return amount.toFixed(2) }
}

export default function CartTable({ locale = 'en-US', currency = 'USD' }) {
  const { items, inc, dec, remove, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted mb-3">Your cart is empty.</p>
        <Button as={Link} to="/products" variant="primary">Browse products</Button>
      </div>
    )
  }

  return (
    <>
      <Table responsive hover className="align-middle">
        <thead>
          <tr>
            <th>Product</th>
            <th style={{ width: 110 }}>Price</th>
            <th style={{ width: 140 }}>Quantity</th>
            <th style={{ width: 120 }}>Subtotal</th>
            <th style={{ width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <Image src={it.image} width={64} height={64} rounded style={{ objectFit: 'cover' }} />
                  <div className="fw-semibold">{it.title}</div>
                </div>
              </td>
              <td>{fmt(it.price, currency, locale)}</td>
              <td>
                <div className="d-inline-flex align-items-center gap-2">
                  <Button size="sm" variant="outline-secondary" onClick={() => dec(it.id)}>-</Button>
                  <span className="px-2">{it.quantity}</span>
                  <Button size="sm" variant="outline-secondary" onClick={() => inc(it.id)}>+</Button>
                </div>
              </td>
              <td>{fmt(it.price * it.quantity, currency, locale)}</td>
              <td>
                <Button size="sm" variant="outline-danger" onClick={() => remove(it.id)}>×</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div className="fs-5">Total: <strong>{fmt(subtotal, currency, locale)}</strong></div>
        {/* <Button as={Link} to="/checkout" variant="primary">Checkout (COD)</Button> */}
        <CheckoutButton />
      </div>
    </>
  )
}

function CheckoutButton() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    })()
  }, [])
  const to = user ? '/checkout' : '/login?next=/checkout'
  return <Button as={Link} to={to} variant="primary">Checkout (COD)</Button>
}