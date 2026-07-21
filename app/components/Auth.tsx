'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setError(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-sm mx-auto mt-24 text-center">
        <p className="text-gray-700">Check your email for the login link.</p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto mt-24">
      <h1 className="text-2xl font-semibold mb-6 text-center">Sign in to Notes</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-3 py-2 hover:bg-gray-800"
        >
          Send magic link
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  )
}
