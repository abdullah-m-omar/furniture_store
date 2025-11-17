// src/services/storageService.js
import { supabase } from './supabaseClient'

const FALLBACK = '/no-image.jpg'

export const PRODUCT_BUCKET  = 'product-images'
export const CATEGORY_BUCKET = 'category-images'
export const AVATAR_BUCKET   = 'avatars'

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

export function toAvatarUrl(pathOrUrl) {
  return toPublicUrlFrom(AVATAR_BUCKET, pathOrUrl)
}

export async function uploadAvatarFile(userId, file) {
  if (!file) throw new Error('No file')
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase()
  const name = `avatar_${Date.now()}.${ext}`
  const path = `u/${userId}/${name}`

  const { error: upErr } = await supabase
    .storage.from(AVATAR_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600' })
  if (upErr) throw upErr

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
  return { publicUrl: data?.publicUrl, path }
}

/** Delete an avatar path (if you track the path) */
export async function deleteAvatarPath(path) {
  if (!path) return
  await supabase.storage.from(AVATAR_BUCKET).remove([path]).catch(() => {})
}