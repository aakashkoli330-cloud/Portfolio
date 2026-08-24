import { useEffect, useState } from 'react'
import {
  NavLink,
  Link,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { getFirebase } from '../../lib/firebase.js'
import { isFirebaseConfigured } from '../../lib/firebaseEnv.js'
import { cn } from '../../lib/cn.js'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import ProjectsEditor from './ProjectsEditor.jsx'
import SkillsEditor from './SkillsEditor.jsx'
import ExperienceEditor from './ExperienceEditor.jsx'
import SettingsEditor from './SettingsEditor.jsx'
import Messages from './Messages.jsx'

const TABS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/settings', label: 'Settings' },
]

function useAuthState() {
  const [state, setState] = useState({ loading: true, user: null })

  useEffect(() => {
    const { auth } = getFirebase()
    return onAuthStateChanged(auth, (user) =>
      setState({ loading: false, user }),
    )
  }, [])

  return state
}

function useUnreadCount(user) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user) return undefined
    const { db } = getFirebase()
    const unsub = onSnapshot(
      query(collection(db, 'messages'), where('read', '==', false)),
      (snap) => setCount(snap.size),
      () => setCount(0),
    )
    return unsub
  }, [user])

  return count
}

function Sidebar({ user }) {
  const unread = useUnreadCount(user)
  const { auth } = getFirebase()

  return (
    <aside className="flex shrink-0 flex-col gap-6 border-b border-ink/10 bg-surface/40 p-5 md:h-screen md:w-60 md:border-b-0 md:border-r">
      <Link to="/admin" className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-grape to-flare shadow-[0_0_16px_rgba(124,92,255,0.45)]">
          <svg viewBox="0 0 19 28.5" className="h-3 fill-white">
            <path d="M0 0 L19 0 L19 9.5 L9.5 9.5 Z M0 9.5 L9.5 9.5 L19 19 L0 19 Z M0 19 L9.5 19 L9.5 28.5 Z" />
          </svg>
        </span>
        <span className="font-display text-lg">Admin</span>
      </Link>

      <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-ink/[0.06] text-cream'
                  : 'text-muted hover:bg-ink/5 hover:text-cream',
              )
            }
          >
            {tab.label}
            {tab.label === 'Messages' && unread > 0 && (
              <span className="rounded-full bg-flare px-2 py-0.5 text-xs font-bold text-white">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-ink/10 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-ink/5 hover:text-cream"
        >
          View site ↗
        </a>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="truncate rounded-xl px-4 py-2.5 text-left text-sm font-medium text-muted transition-colors hover:bg-flare/10 hover:text-flare"
        >
          Sign out ({user?.email})
        </button>
      </div>
    </aside>
  )
}

export default function Admin() {
  const { loading, user } = useAuthState()

  if (!isFirebaseConfigured) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-6 text-center text-cream">
        <div>
          <h1 className="font-display text-3xl">Firebase not configured</h1>
          <p className="mt-3 text-muted">
            Add your .env keys, then restart the dev server.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-cream">
        <p className="font-display italic text-muted">Loading...</p>
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <div className="min-h-screen bg-paper text-cream md:flex">
      <Sidebar user={user} />
      <main className="mx-auto w-full max-w-4xl p-5 md:p-10">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsEditor />} />
          <Route path="skills" element={<SkillsEditor />} />
          <Route path="experience" element={<ExperienceEditor />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<SettingsEditor />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}
