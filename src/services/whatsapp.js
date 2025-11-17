// whatsapp.ts/js
export function buildWhatsAppLink({ storePhone, orderNumber, items, total, currency='SAR', customer }) {
  const lines = [
    `طلب جديد (COD) #${orderNumber}`,
    `الاسم: ${customer.name}`,
    `الهاتف: ${customer.phone}`,
    `العنوان: ${customer.address}`,
    '',
    'المنتجات:'
  ]
  for (const it of items) {
    lines.push(`- ${it.title} × ${it.quantity} = ${it.price.toFixed(2)} ${currency}`)
  }
  lines.push('', `الإجمالي: ${total.toFixed(2)} ${currency}`)
  const text = encodeURIComponent(lines.join('\n'))
  const phone = storePhone.replace(/\D/g, '') // e.g. '9665XXXXXXXX'
  return `https://wa.me/${phone}?text=${text}`
}
