import { supabase } from './supabaseClient'

export async function listMyOrders({ limit = 20, offset = 0 } = {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { rows: [], count: 0 }

  // owner can select due to RLS
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, total_cents, currency, created_at', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { rows: data || [], count: data?.length ?? 0 }
}

export async function getMyOrderWithItems(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, total_cents, currency, created_at,
      customer_name, phone, address_line1, city, region, postal_code,
      order_items ( id, product_id, title, price_cents, quantity, image_url )
    `)
    .eq('id', orderId)
    .maybeSingle()
  if (error) throw error
  return data
}

// Guest lookup via RPC
export async function getGuestOrderByNumberAndPhone(orderNumber, phone) {
  const { data, error } = await supabase.rpc('get_order_for_guest', {
    p_order_number: orderNumber,
    p_phone: phone
  })
  if (error) throw error
  // data is { order: {...}, items: [...] } or null
  return data
}
