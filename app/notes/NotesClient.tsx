'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type Note = {
  id: string
  content: string
  created_at: string
}

export default function NotesClient({
  initialNotes,
  userId,
}: {
  initialNotes: Note[]
  userId: string
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setError(null)

    const { data, error } = await supabase
      .from('notes')
      .insert({ content, user_id: userId })
      .select()
      .single()

    if (error) {
      setError(error.message)
      return
    }
    setNotes([data as Note, ...notes])
    setContent('')
  }

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    setNotes(notes.filter((n) => n.id !== id))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Notes</h1>
        <button
          onClick={signOut}
          className="text-sm text-gray-500 hover:text-black"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={addNote} className="flex gap-2 mb-6">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a note..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((n) => (
            <li
              key={n.id}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <span>{n.content}</span>
              <button
                onClick={() => deleteNote(n.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
