// src/services/productService.js
import { supabase } from './supabaseClient'
import { toPublicUrl, toCategoryUrl } from './storageService'

// ----- helpers -----
function pickLang(en, ar, lang) {
  return lang === 'ar' ? (ar || en || '') : (en || ar || '')
}

function normalizeProduct(row, lang) {
  const title = pickLang(row.title_en, row.title_ar, lang)
  const description = pickLang(row.description_en, row.description_ar, lang)
  const images = (row.product_images || [])
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(img => toPublicUrl(img.url))

  const categoryLabel = row.categories
    ? pickLang(row.categories.name_en, row.categories.name_ar, lang)
    : ''

  return {
    id: row.id,
    slug: row.slug,
    title,
    description,
    price: (row.price_cents ?? 0) / 100,
    currency: row.currency || (lang === 'ar' ? 'SAR' : 'USD'),
    image: images[0] || '/no-image.jpg',
    images: images.length ? images : ['/no-image.jpg'],
    category: row.categories?.key,
    categoryLabel,
    stock: row.stock ?? 0,
    createdAt: row.created_at
  }
}

// ----- named exports -----
export async function getProducts({ lang, limit, categoryKey, search, sort = 'newest' } = {}) {
  let query = supabase
    .from('products')
    .select(`
      id, slug, category_id,
      title_en, title_ar, description_en, description_ar,
      price_cents, currency, stock, is_active, created_at,
      product_images ( url, position ),
      categories:category_id ( key, name_en, name_ar )
    `)
    .eq('is_active', true)

  if (categoryKey) {
    query = query.eq('categories.key', categoryKey)
  }
  if (search && search.trim()) {
    const q = `%${search.trim()}%`
    query = query.or(
      `title_en.ilike.${q},title_ar.ilike.${q},description_en.ilike.${q},description_ar.ilike.${q}`
    )
  }

  if (sort === 'price-asc') query = query.order('price_cents', { ascending: true })
  else if (sort === 'price-desc') query = query.order('price_cents', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error
  return (data || []).map(row => normalizeProduct(row, lang))
}

export async function getCategories({ lang } = {}) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, key, name_en, name_ar, position, is_active, image_path')
    .eq('is_active', true)
    .order('position', { ascending: true })
  if (error) throw error
  return (data || []).map(c => ({
    id: c.id,
    key: c.key,
    label: lang === 'ar' ? (c.name_ar || c.name_en) : (c.name_en || c.name_ar),
    image: toCategoryUrl(c.image_path) // ✅ build full public URL
  }))
}

export async function getProductById({ id, lang }) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, slug, category_id,
      title_en, title_ar, description_en, description_ar,
      price_cents, currency, stock, is_active, created_at,
      product_images ( url, position ),
      categories:category_id ( key, name_en, name_ar )
    `)
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data ? normalizeProduct(data, lang) : null
}
