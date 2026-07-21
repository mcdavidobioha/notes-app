'use server'

import { createClient } from '@/server/server'
import { revalidatePath } from 'next/cache'

export async function addNoteAction(content: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('notes')
    .insert({ content, user_id: user?.id })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/notes')
  return data
}

export async function updateNoteAction(id: string, content: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notes')
    .update({ content })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/notes')
  return data
}

export async function deleteNoteAction(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/notes')
}
