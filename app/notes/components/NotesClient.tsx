'use client'
import { useState } from 'react'
import { addNoteAction, updateNoteAction, deleteNoteAction } from '@/server/actions/notes'
import { signOutAction } from '@/server/actions/auth'

type Note = {
  id: string
  content: string
  created_at: string
}

export default function NotesClient({
  initialNotes,
  userEmail,
}: {
  initialNotes: Note[]
  userId: string
  userEmail?: string
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setError(null)
    setLoading(true)

    try {
      const newNote = await addNoteAction(content)
      setNotes([newNote as Note, ...notes])
      setContent('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to add note.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStartEdit = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
    setError(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const handleSaveEdit = async (id: string) => {
    if (!editContent.trim()) return
    setError(null)

    try {
      const updatedNote = await updateNoteAction(id, editContent)
      setNotes(
        notes.map((n) => (n.id === id ? (updatedNote as Note) : n))
      )
      setEditingId(null)
      setEditContent('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to update note.')
      }
    }
  }

  const handleDeleteNote = async (id: string) => {
    setError(null)
    try {
      await deleteNoteAction(id)
      setNotes(notes.filter((n) => n.id !== id))
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to delete note.')
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">
      <div className="flex flex-col justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome to Notes</h1>
        </div>
        <div className='flex gap-2 items-center'>


          {userEmail && (
            <p className="text-sm text-gray-500 mt-1">You&apos;re signed in as <span className="font-medium text-gray-800">{userEmail}</span></p>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-black"
            >
              Sign out
            </button>
          </form>
        </div>

      </div>

      <div className='flex flex-col gap-2'>

        <h3 className='text-lg font-semibold'> Your Notes</h3>

        <form onSubmit={handleAddNote} className="flex gap-2 mb-6">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Adding...' : 'Add'}
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
                {editingId === n.id ? (
                  <div className="flex flex-1 gap-2 items-center">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(n.id)}
                      className="text-sm font-medium text-green-600 hover:text-green-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-sm text-gray-500 hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 mr-4">{n.content}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStartEdit(n)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
