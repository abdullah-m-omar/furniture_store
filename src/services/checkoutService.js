// src/services/checkoutService.js
import { supabase } from './supabaseClient'

const STORE_WHATSAPP = import.meta.env.VITE_STORE_WHATSAPP || '' // e.g. 9665XXXXXXXX

function toCents(x) { return Math.round((x || 0) * 100) }
function genOrderNumber() { return 'MD' + Date.now().toString().slice(-8) }

export function buildWhatsAppLink({ storePhone = STORE_WHATSAPP, orderNumber, items, total, currency = 'SAR', customer }) {
  const lines = [
    `طلب جديد (COD) #${orderNumber}`,
    `الاسم: ${customer.name || ''}`,
    `الهاتف: ${customer.phone || ''}`,
    `العنوان: ${customer.address || ''}`,      // we still show the simple address the user typed
    customer.notes ? `ملاحظات: ${customer.notes}` : '',
    '',
    'المنتجات:'
  ].filter(Boolean)

  for (const it of items) {
    lines.push(`- ${it.title} × ${it.quantity} = ${(it.price).toFixed(2)} ${currency}`)
  }
  lines.push('', `الإجمالي: ${total.toFixed(2)} ${currency}`)

  const text = encodeURIComponent(lines.join('\n'))
  const phone = (storePhone || '').replace(/\D/g, '')
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`
}

export async function createCODOrder({ user, cart, form, currency = 'SAR' }) {
  const subtotal = cart.items.reduce((s, it) => s + it.price * it.quantity, 0)
  const shipping = 0 // adjust if needed
  const total = subtotal + shipping

  // ✅ Map UI fields to structured DB columns
  const order = {
    user_id: user?.id ?? null,
    order_number: genOrderNumber(),
    status: 'pending_cod',
    currency,
    subtotal_cents: toCents(subtotal),
    shipping_cents: toCents(shipping),
    discount_cents: 0,
    total_cents: toCents(total),

    customer_name: form.name,
    phone: form.phone,
    whatsapp: form.whatsapp || null,
    email: form.email || null,

    address_line1: form.address,          // <— the single textarea goes here
    address_line2: form.address2 || null, // optional if you add it later
    city: form.city || null,
    region: form.region || null,
    postal_code: form.postal || null,
    country_code: form.country || 'SA',

    notes: form.notes || null
  }

  const { data: inserted, error } = await supabase
    .from('orders')
    .insert(order)
    .select('id, order_number, total_cents, currency')
    .single()
  if (error) throw error

  const items = cart.items.map(it => ({
    order_id: inserted.id,
    product_id: it.id,
    title: it.title,
    price_cents: toCents(it.price),
    quantity: it.quantity,
    image_url: it.image
  }))

  const { error: itemsErr } = await supabase.from('order_items').insert(items)
  if (itemsErr) throw itemsErr

  return {
    id: inserted.id,
    orderNumber: inserted.order_number,
    total: inserted.total_cents / 100,
    currency: inserted.currency,
    items
  }
}
