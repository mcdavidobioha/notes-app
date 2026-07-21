import { createClient } from '@/server/server'
import NotesClient from './components/NotesClient'

export default async function NotesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error.message)
  }

  return (
    <NotesClient
      initialNotes={notes ?? []}
      userId={user?.id ?? ''}
      userEmail={user?.email ?? ''}
    />
  )
}
