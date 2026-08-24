import { useCollection } from '../../hooks/useContent.js'
import { markMessage, deleteMessage } from '../../lib/adminApi.js'
import { Panel, guard } from './ui.jsx'

function formatDate(ts) {
  try {
    return ts?.toDate?.().toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return ''
  }
}

export default function Messages() {
  const { data: itemsRaw, loading } = useCollection('messages', [])
  const items = [...itemsRaw].sort(
    (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0),
  )

  async function toggleRead(item) {
    await guard(() => markMessage(item.id, !item.read))
  }

  async function onRemove(item) {
    if (!window.confirm(`Delete message from "${item.name}"?`)) return
    await guard(() => deleteMessage(item.id))
  }

  return (
    <Panel
      title="Messages"
      description="Submissions from the contact form arrive here in real time."
    >
      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading...</p>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          No messages yet — the contact form is wired to this inbox.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`rounded-2xl border p-5 transition-colors ${
                item.read
                  ? 'border-ink/10 bg-ink/[0.03]'
                  : 'border-grape/40 bg-grape/[0.06]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-medium">
                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-flare shadow-[0_0_8px_rgba(255,93,162,0.8)]" />
                  )}
                  {item.name}
                  <span className="font-normal text-muted">·</span>
                  <a
                    href={`mailto:${item.email}`}
                    className="font-normal text-muted hover:text-glow"
                  >
                    {item.email}
                  </a>
                </p>
                <span className="text-xs text-muted/70">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-muted">
                {item.message}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleRead(item)}
                  className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-glow/60 hover:text-glow"
                >
                  Mark as {item.read ? 'unread' : 'read'}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  className="rounded-lg border border-flare/30 px-3 py-1.5 text-xs font-medium text-flare/80 transition-colors hover:bg-flare/10 hover:text-flare"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
