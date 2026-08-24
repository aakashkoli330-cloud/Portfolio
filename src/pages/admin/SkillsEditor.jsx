import { useState } from 'react'
import { useCollection } from '../../hooks/useContent.js'
import { skillGroups as fallbackGroups } from '../../lib/mockData.js'
import { createItem, updateItem, deleteItem, reorderItem } from '../../lib/adminApi.js'
import { sorted } from '../../lib/content.js'
import { Panel, Btn, Field, TextInput, TextArea, Select, Modal, guard } from './ui.jsx'

const ACCENTS = [
  { label: 'Grape', value: '#7c5cff' },
  { label: 'Flare', value: '#ff5da2' },
  { label: 'Glow', value: '#38d6f0' },
  { label: 'Honey', value: '#ffb347' },
]

const EMPTY = {
  category: '',
  accent: ACCENTS[0].value,
  items: '',
}

function GroupForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({
          ...form,
          items: form.items
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
        })
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category name">
          <TextInput
            required
            value={form.category}
            onChange={set('category')}
            placeholder="Frontend"
          />
        </Field>
        <Field label="Accent color">
          <Select value={form.accent} onChange={set('accent')}>
            {ACCENTS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Skills" hint="One per line">
        <TextArea
          required
          rows={6}
          value={Array.isArray(form.items) ? form.items.join('\n') : form.items}
          onChange={set('items')}
          placeholder={'React\nTypeScript\nTailwind CSS'}
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

export default function SkillsEditor() {
  const { data: groupsRaw } = useCollection('skills', fallbackGroups)
  const groups = sorted(groupsRaw)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  async function onSave(data) {
    setBusy(true)
    try {
      if (editing.id) {
        await updateItem('skills', editing.id, data)
      } else {
        const max = groups.reduce((m, g) => Math.max(m, g.order ?? 0), -1)
        await createItem('skills', { ...data, order: max + 1 })
      }
      setEditing(null)
    } catch (err) {
      console.error('[admin]', err)
      window.alert(`Save failed: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  async function onRemove(group) {
    if (!group.id) return
    if (!window.confirm(`Delete "${group.category}"?`)) return
    await guard(() => deleteItem('skills', group.id))
  }

  async function move(index, dir) {
    const target = groups[index + dir]
    if (!target?.id || !groups[index]?.id) return
    await guard(() => reorderItem('skills', groups, index, dir))
  }

  return (
    <>
      <Panel
        title="Skills"
        description="Category cards shown in the Skills section."
        actions={<Btn onClick={() => setEditing({ ...EMPTY })}>+ Add group</Btn>}
      >
        <ul className="space-y-3">
          {groups.map((group, i) => (
            <li
              key={group.id ?? group.category}
              className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4"
            >
              <span
                className="mt-1.5 h-3 w-3 shrink-0 rounded-full shadow-[0_0_10px_currentColor]"
                style={{ backgroundColor: group.accent, color: group.accent }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{group.category}</p>
                <p className="mt-1 text-sm text-muted">
                  {(group.items ?? []).join(' · ')}
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
                  disabled={i === groups.length - 1}
                  onClick={() => move(i, 1)}
                  className="rounded-lg px-2 py-1 text-muted hover:bg-ink/10 hover:text-cream disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...group,
                      items: Array.isArray(group.items)
                        ? group.items.join('\n')
                        : '',
                    })
                  }
                  className="rounded-lg px-3 py-1 text-sm text-muted hover:bg-ink/10 hover:text-cream"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(group)}
                  className="rounded-lg px-3 py-1 text-sm text-flare/80 hover:bg-flare/10 hover:text-flare"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {groups.length === 0 && (
            <li className="py-8 text-center text-sm text-muted">
              No skill groups yet.
            </li>
          )}
        </ul>
      </Panel>

      <Modal
        open={Boolean(editing)}
        title={editing?.id ? 'Edit group' : 'New skill group'}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <GroupForm
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
