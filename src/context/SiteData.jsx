import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { getFirebase } from '../lib/firebase.js'
import { isFirebaseConfigured } from '../lib/firebaseEnv.js'
import {
  siteDefaults,
  projects as projectDefaults,
  skillGroups as skillDefaults,
  experience as experienceDefaults,
} from '../lib/mockData.js'

const SiteDataContext = createContext(null)

const mergeSite = (remote) => ({
  ...siteDefaults,
  ...remote,
  socials: { ...siteDefaults.socials, ...(remote?.socials ?? {}) },
})

export function SiteDataProvider({ children }) {
  const [state, setState] = useState(() => ({
    site: siteDefaults,
    projects: projectDefaults,
    skillGroups: skillDefaults,
    experience: experienceDefaults,
    ready: !isFirebaseConfigured,
    source: isFirebaseConfigured ? 'loading' : 'local',
  }))

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined

    const { db } = getFirebase()
    const unsubs = []
    let pending = 4
    let hadError = false

    const settle = () => {
      pending -= 1
      if (pending <= 0) {
        setState((s) => ({
          ...s,
          ready: true,
          source: hadError ? 'error' : 'live',
        }))
      }
    }

    const fail = (label) => (err) => {
      console.error(`[site-data] ${label}:`, err.code ?? err.message)
      hadError = true
      settle()
    }

    unsubs.push(
      onSnapshot(
        doc(db, 'settings', 'site'),
        (snap) => {
          const remote = snap.exists() ? snap.data() : null
          setState((s) => ({
            ...s,
            site: remote ? mergeSite(remote) : s.site,
          }))
          settle()
        },
        fail('settings'),
      ),
    )

    const listenList = (name, key, fallback) => {
      unsubs.push(
        onSnapshot(
          collection(db, name),
          (snap) => {
            const items = snap.empty
              ? fallback
              : snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            setState((s) => ({ ...s, [key]: items }))
            settle()
          },
          fail(name),
        ),
      )
    }

    listenList('projects', 'projects', projectDefaults)
    listenList('skills', 'skillGroups', skillDefaults)
    listenList('experience', 'experience', experienceDefaults)

    return () => unsubs.forEach((u) => u())
  }, [])

  const value = useMemo(() => state, [state])

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  return useContext(SiteDataContext)
}
