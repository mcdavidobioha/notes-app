'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInAction, signUpAction } from '@/server/actions/auth'
import { AuthMode } from '../types/auth.type'

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('SIGN_IN')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'SIGN_IN') {
        const res = await signInAction({ email, password })
        if (res?.error) {
          setError(res.error)
        } else if (res?.success) {
          router.push('/notes')
          router.refresh()
        }
      } else {
        const res = await signUpAction({ email, password })
        if (res?.error) {
          setError(res.error)
        } else if (res?.success) {
          router.push('/notes')
          router.refresh()
        } else if (res?.message) {
          setMessage(res.message)
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto mt-20 p-6 border rounded-lg shadow-sm bg-white">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        {mode === 'SIGN_IN' ? 'Sign In to Notes' : 'Create Account'}
      </h1>

      {/* Mode Selectors */}
      <div className="flex border-b mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('SIGN_IN')
            setError(null)
            setMessage(null)
          }}
          className={`flex-1 py-2 text-center font-medium border-b-2 text-sm transition-colors ${
            mode === 'SIGN_IN'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('SIGN_UP')
            setError(null)
            setMessage(null)
          }}
          className={`flex-1 py-2 text-center font-medium border-b-2 text-sm transition-colors ${
            mode === 'SIGN_UP'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors mt-2"
        >
          {loading ? 'Processing...' : mode === 'SIGN_IN' ? 'Sign In' : 'Sign Up'}
        </button>

        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {message && <p className="text-green-600 text-sm mt-1">{message}</p>}
      </form>
    </div>
  )
}
