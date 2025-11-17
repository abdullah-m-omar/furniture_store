// checkoutService.js
import { supabase } from './supabaseClient'

function toCents(x){ return Math.round((x || 0) * 100) }
function genOrderNumber(){ return 'MD' + Date.now().toString().slice(-8) }

export async function createCODOrder({ user, cart, form, currency = 'SAR' }) {
  const subtotal = cart.items.reduce((s, it) => s + it.price * it.quantity, 0)
  const shipping = 0 // or compute rule-based
  const total = subtotal + shipping

  const order = {
    user_id: user?.id ?? null,
    order_number: genOrderNumber(),
    status: 'pending_cod',
    currency,
    subtotal_cents: toCents(subtotal),
    shipping_cents: toCents(shipping),
    total_cents: toCents(total),
    customer_name: form.name,
    phone: form.phone,
    whatsapp: form.whatsapp,
    address: form.address,
    notes: form.notes
  }

  const { data: inserted, error } = await supabase.from('orders').insert(order).select('id, order_number').single()
  if (error) throw error

  const items = cart.items.map(it => ({
    order_id: inserted.id,
    product_id: it.id,
    title: it.title,
    price_cents: toCents(it.price),
    quantity: it.quantity,
    image_url: it.image
  }))

  const { error: itemErr } = await supabase.from('order_items').insert(items)
  if (itemErr) throw itemErr

  return inserted // { id, order_number }
}
