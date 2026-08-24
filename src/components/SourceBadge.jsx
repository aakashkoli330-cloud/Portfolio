import { useSiteData } from '../context/SiteData.jsx'

const STYLES = {
  live: 'bg-glow/10 text-glow border-glow/40',
  error: 'bg-flare/10 text-flare border-flare/40',
  local: 'bg-honey/10 text-honey border-honey/40',
}

const LABELS = {
  live: 'Live — reading Firestore',
  error: 'Firestore blocked — showing starter content (check rules)',
  local: 'Local demo — no Firebase keys loaded',
}

export default function SourceBadge() {
  if (!import.meta.env.DEV) return null

  const { source } = useSiteData()
  const key = source === 'loading' ? 'local' : source

  return (
    <div
      className={`fixed bottom-3 left-3 z-50 rounded-full border px-3 py-1.5 font-mono text-[11px] backdrop-blur-md ${STYLES[key]}`}
    >
      {LABELS[key]}
    </div>
  )
}
