import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getFirebase } from '../../lib/firebase.js'
import { Field, TextInput, Btn } from './ui.jsx'

const ERRORS = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Try again in a minute.',
  'auth/network-request-failed': 'Network error — check your connection.',
}

function LogoMark() {
  return (
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-grape to-flare shadow-[0_0_24px_rgba(124,92,255,0.5)]">
      <svg viewBox="0 0 19 28.5" className="h-4 fill-white">
        <path d="M0 0 L19 0 L19 9.5 L9.5 9.5 Z M0 9.5 L9.5 9.5 L19 19 L0 19 Z M0 19 L9.5 19 L9.5 28.5 Z" />
      </svg>
    </span>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const { auth } = getFirebase()
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (err) {
      setError(ERRORS[err.code] ?? err.message)
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4 text-cream">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl border border-ink/10 bg-surface/70 p-8 shadow-[0_16px_48px_rgba(18,32,92,0.45)]"
      >
        <LogoMark />
        <h1 className="mt-6 text-center font-display text-3xl">Admin</h1>
        <p className="mt-2 text-center text-sm text-muted">
          Sign in to manage your content
        </p>

        <div className="mt-8 space-y-4">
          <Field label="Email">
            <TextInput
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-flare/40 bg-flare/10 px-4 py-2.5 text-sm text-flare">
            {error}
          </p>
        )}

        <Btn type="submit" disabled={busy} className="mt-6 w-full py-3">
          {busy ? 'Signing in...' : 'Sign in'}
        </Btn>
      </form>
    </div>
  )
}
