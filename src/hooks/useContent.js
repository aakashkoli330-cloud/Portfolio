import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { getFirebase } from '../lib/firebase.js'
import { isFirebaseConfigured } from '../lib/firebaseEnv.js'
import { siteDefaults } from '../lib/mockData.js'

export function useCollection(name, fallback) {
  const [state, setState] = useState({
    data: fallback,
    loading: isFirebaseConfigured,
    status: isFirebaseConfigured ? 'loading' : 'local',
  })

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setState({ data: fallback, loading: false, status: 'local' })
      return undefined
    }

    const { db } = getFirebase()
    const unsub = onSnapshot(
      collection(db, name),
      (snap) => {
        setState({
          data: snap.empty
            ? fallback
            : snap.docs.map((d) => ({ id: d.id, ...d.data() })),
          loading: false,
          status: snap.empty ? 'empty' : 'live',
        })
      },
      (err) => {
        console.error(`[useCollection] ${name}:`, err.code ?? err.message)
        setState({ data: fallback, loading: false, status: 'error' })
      },
    )

    return unsub
  }, [name])

  return state
}

export function useSiteSettings() {
  const [site, setSite] = useState(siteDefaults)
  const [status, setStatus] = useState(
    isFirebaseConfigured ? 'loading' : 'local',
  )

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setStatus('local')
      return undefined
    }

    const { db } = getFirebase()
    const unsub = onSnapshot(
      doc(db, 'settings', 'site'),
      (snap) => {
        if (snap.exists()) {
          const remote = snap.data()
          setSite((prev) => ({
            ...prev,
            ...remote,
            socials: { ...prev.socials, ...(remote.socials ?? {}) },
          }))
        }
        setStatus(snap.exists() ? 'live' : 'empty')
      },
      (err) => {
        console.error('[useSiteSettings]:', err.code ?? err.message)
        setStatus('error')
      },
    )

    return unsub
  }, [])

  return { site, status }
}
