import { useState } from 'react'
import { useCollection } from '../../hooks/useContent.js'
import { projects as fallbackProjects } from '../../lib/mockData.js'
import { createItem, updateItem, deleteItem, reorderItem } from '../../lib/adminApi.js'
import { sorted } from '../../lib/content.js'
import { Panel, Btn, Field, TextInput, TextArea, Select, Modal, guard, ImageField } from './ui.jsx'

const GRADIENTS = [
  { label: 'Grape → Glow', value: 'from-grape/70 via-grape/30 to-glow/50' },
  { label: 'Flare → Honey', value: 'from-flare/60 via-flare/25 to-honey/50' },
  { label: 'Glow → Grape', value: 'from-glow/50 via-glow/20 to-grape/50' },
  { label: 'Honey → Flare', value: 'from-honey/50 via-honey/20 to-flare/45' },
]

const EMPTY = {
  title: '',
  description: '',
  tech: '',
  github: '',
  live: '',
  imageUrl: '',
  letter: '',
  coverGradient: GRADIENTS[0].value,
  featured: false,
}

function ProjectForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState(initial)
  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({
          ...form,
          tech: form.tech.split(',').map((t) => t.trim()).filter(Boolean),
        })
      }}
      className="space-y-4"
    >
      <Field label="Title">
        <TextInput required value={form.title} onChange={set('title')} />
      </Field>
      <Field label="Description">
        <TextArea
          required
          rows={3}
          value={form.description}
          onChange={set('description')}
        />
      </Field>
      <Field label="Tech stack" hint="Comma-separated">
        <TextInput
          value={Array.isArray(form.tech) ? form.tech.join(', ') : form.tech}
          onChange={set('tech')}
          placeholder="React, Firebase, Tailwind"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="GitHub URL">
          <TextInput value={form.github} onChange={set('github')} />
        </Field>
        <Field label="Live demo URL">
          <TextInput value={form.live} onChange={set('live')} />
        </Field>
      </div>
      <ImageField
        label="Cover image"
        value={form.imageUrl ?? ''}
        folder="project-covers"
        hint="Uploaded images are stored in Firebase Storage and override the gradient cover."
        onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
      />
      {!form.imageUrl && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cover gradient">
            <Select value={form.coverGradient} onChange={set('coverGradient')}>
              {GRADIENTS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Watermark letter">
            <TextInput
              maxLength={2}
              value={form.letter}
              onChange={set('letter')}
            />
          </Field>
        </div>
      )}
      <label className="flex items-center gap-3 text-sm text-cream">
        <input
          type="checkbox"
          checked={Boolean(form.featured)}
          onChange={set('featured')}
          className="h-4 w-4 accent-[#7c5cff]"
        />
        Featured project
      </label>

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

export default function ProjectsEditor() {
  const { data: itemsRaw } = useCollection('projects', fallbackProjects)
  const items = sorted(itemsRaw)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  async function nextOrder() {
    const max = items.reduce((m, i) => Math.max(m, i.order ?? 0), -1)
    return max + 1
  }

  async function onSave(data) {
    setBusy(true)
    try {
      if (editing.id) {
        await updateItem('projects', editing.id, data)
      } else {
        await createItem('projects', { ...data, order: await nextOrder() })
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
    if (!window.confirm(`Delete "${item.title}"?`)) return
    await guard(() => deleteItem('projects', item.id))
  }

  async function move(index, dir) {
    const target = items[index + dir]
    if (!target?.id || !items[index]?.id) return
    await guard(() => reorderItem('projects', items, index, dir))
  }

  return (
    <>
      <Panel
        title="Projects"
        description="Shown in the Work section, ordered top to bottom."
        actions={
          <Btn onClick={() => setEditing({ ...EMPTY })}>+ Add project</Btn>
        }
      >
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={item.id ?? item.title}
              className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-4"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-display italic ${item.coverGradient ?? 'from-grape to-flare'}`}
              >
                {item.imageUrl ? '🖼️' : item.letter}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate font-medium">
                  {item.title}
                  {item.featured && (
                    <span className="rounded-full bg-honey/15 px-2 py-0.5 text-xs text-honey">
                      ★
                    </span>
                  )}
                </p>
                <p className="truncate text-sm text-muted">{item.description}</p>
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
                      tech: Array.isArray(item.tech) ? item.tech.join(', ') : '',
                      imageUrl: item.imageUrl ?? '',
                      letter: item.letter ?? '',
                      coverGradient:
                        item.coverGradient ?? GRADIENTS[0].value,
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
              No projects yet — add one or seed from the Dashboard.
            </li>
          )}
        </ul>
      </Panel>

      <Modal
        open={Boolean(editing)}
        title={editing?.id ? 'Edit project' : 'New project'}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <ProjectForm
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
