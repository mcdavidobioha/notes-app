import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NotesClient from './NotesClient'

export default async function NotesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    // RLS or query error — surface it instead of failing silently
    console.error('Error fetching notes:', error.message)
  }

  return <NotesClient initialNotes={notes ?? []} userId={user.id} />
}
