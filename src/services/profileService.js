import { supabase } from './supabaseClient'

export async function uploadAvatar(userId, file) {
  if (!file) return null
  const ext = file.name.split('.').pop()
  const path = `u/${userId}/${crypto.randomUUID()}.${ext}`
  const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (upErr) throw upErr
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

export async function updateProfile({ name, username, avatarUrl }) {
  const { data: { user }, error: uErr } = await supabase.auth.getUser()
  if (uErr || !user) throw uErr || new Error('Not authenticated')

  const updates = {}
  if (name !== undefined) updates.name = name
  if (username !== undefined) updates.username = username
  if (avatarUrl !== undefined) updates.avatar_url = avatarUrl

  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
  if (error) throw error

  // keep auth metadata in sync (non-critical)
  await supabase.auth.updateUser({ data: { name, username, avatar_url: avatarUrl } })
}

export async function changeEmail(newEmail) {
  const { error } = await supabase.auth.updateUser({ email: newEmail })
  if (error) throw error
  return true // Supabase will email a confirmation link
}

export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return true
}
