// src/services/storageService.js
import { supabase } from './supabaseClient'

const FALLBACK = '/no-image.jpg'

export const PRODUCT_BUCKET  = 'product-images'
export const CATEGORY_BUCKET = 'category-images'

export function toPublicUrlFrom(bucket, pathOrUrl) {
  if (!pathOrUrl) return FALLBACK
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const { data } = supabase.storage.from(bucket).getPublicUrl(pathOrUrl)
  return data?.publicUrl || FALLBACK
}

// Backwards-compatible helpers:
export function toPublicUrl(pathOrUrl) {
  return toPublicUrlFrom(PRODUCT_BUCKET, pathOrUrl)
}

export function toCategoryUrl(pathOrUrl) {
  return toPublicUrlFrom(CATEGORY_BUCKET, pathOrUrl)
}
