import { useState } from 'react'
import { useCollection } from '../../hooks/useContent.js'
import { experience as fallbackItems } from '../../lib/mockData.js'
import { createItem, updateItem, deleteItem, reorderItem } from '../../lib/adminApi.js'
import { sorted } from '../../lib/content.js'
import { Panel, Btn, Field, TextInput, TextArea, Select, Modal, guard } from './ui.jsx'

const EMPTY = {
  type: 'work',
  role: '',
  company: '',
  period: '',
  points: '',
}

function ItemForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({
          ...form,
          points: form.points
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
        })
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <Select value={form.type} onChange={set('type')}>
            <option value="work">Work</option>
            <option value="education">Education</option>
          </Select>
        </Field>
        <Field label="Period">
          <TextInput
            required
            value={form.period}
            onChange={set('period')}
            placeholder="2023 — Present"
          />
        </Field>
      </div>
      <Field label="Role / Degree">
        <TextInput required value={form.role} onChange={set('role')} />
      </Field>
      <Field label="Company / School">
        <TextInput required value={form.company} onChange={set('company')} />
      </Field>
      <Field label="Highlights" hint="One per line">
        <TextArea
          rows={5}
          value={
            Array.isArray(form.points) ? form.points.join('\n') : form.points
          }
          onChange={set('points')}
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <Btn type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Btn>
        <Btn type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Btn>
      </div>
    </form>
  )
}

export default function ExperienceEditor() {
  const { data: itemsRaw } = useCollection('experience', fallbackItems)
  const items = sorted(itemsRaw)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  async function onSave(data) {
    setBusy(true)
    try {
      if (editing.id) {
        await updateItem('experience', editing.id, data)
      } else {
        const max = items.reduce((m, i) => Math.max(m, i.order ?? 0), -1)
        await createItem('experience', { ...data, order: max + 1 })
      }
      setEditing(null)
    } catch (err) {
      console.error('[admin]', err)
      window.alert(`Save failed: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  async function onRemove(item) {
    if (!item.id) return
    if (!window.confirm(`Delete "${item.role}"?`)) return
    await guard(() => deleteItem('experience', item.id))
  }

  async function move(index, dir) {
    const target = items[index + dir]
    if (!target?.id || !items[index]?.id) return
    await guard(() => reorderItem('experience', items, index, dir))
  }

  return (
    <>
      <Panel
        title="Experience"
        description="The Journey timeline — work and education, ordered top to bottom."
        actions={<Btn onClick={() => setEditing({ ...EMPTY })}>+ Add entry</Btn>}
      >
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={item.id ?? item.role}
              className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4"
            >
              <span className="shrink-0 rounded-full bg-ink/5 px-3 py-1 text-xs uppercase tracking-wider text-muted">
                {item.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.role}</p>
                <p className="truncate text-sm text-muted">
                  {item.company} · {item.period}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="rounded-lg px-2 py-1 text-muted hover:bg-ink/10 hover:text-cream disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded-lg px-2 py-1 text-muted hover:bg-ink/10 hover:text-cream disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...item,
                      points: Array.isArray(item.points)
                        ? item.points.join('\n')
                        : '',
                    })
                  }
                  className="rounded-lg px-3 py-1 text-sm text-muted hover:bg-ink/10 hover:text-cream"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  className="rounded-lg px-3 py-1 text-sm text-flare/80 hover:bg-flare/10 hover:text-flare"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-8 text-center text-sm text-muted">
              No timeline entries yet.
            </li>
          )}
        </ul>
      </Panel>

      <Modal
        open={Boolean(editing)}
        title={editing?.id ? 'Edit entry' : 'New entry'}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <ItemForm
            initial={editing}
            onSave={onSave}
            onClose={() => setEditing(null)}
            saving={busy}
          />
        )}
      </Modal>
    </>
  )
}
