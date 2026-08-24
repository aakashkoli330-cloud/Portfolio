import { useEffect, useState } from 'react'
import { useSiteSettings } from '../../hooks/useContent.js'
import { saveSettings } from '../../lib/adminApi.js'
import { Panel, Btn, Field, TextInput, TextArea, Spinner } from './ui.jsx'
function toText(arr) {
  return Array.isArray(arr) ? arr.join('\n') : ''
}

export default function SettingsEditor() {
  const { site, status } = useSiteSettings()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status !== 'loading' && form === null) {
      setForm({
        firstName: site.firstName ?? '',
        lastName: site.lastName ?? '',
        role: site.role ?? '',
        tagline: site.tagline ?? '',
        email: site.email ?? '',
        resumeUrl: site.resumeUrl ?? '/resume.pdf',
        portraitUrl: site.portraitUrl ?? '',
        github: site.socials?.github ?? '',
        linkedin: site.socials?.linkedin ?? '',
        contactEmail: site.socials?.email ?? `mailto:${site.email ?? ''}`,
        facts: toText(site.facts),
        bio: (site.bio ?? []).join('\n\n'),
        stats: [0, 1, 2].map(
          (i) => site.stats?.[i] ?? { value: '', label: '' },
        ),
      })
    }
  }, [site, form, status])

  const set = (key) => (e) => {
    setSaved(false)
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const setStat = (i, key) => (e) => {
    setSaved(false)
    const value = e.target.value
    setForm((f) => ({
      ...f,
      stats: f.stats.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSettings({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        role: form.role.trim(),
        tagline: form.tagline.trim(),
        email: form.email.trim(),
        resumeUrl: form.resumeUrl.trim() || '/resume.pdf',
        portraitUrl: form.portraitUrl.trim(),
        socials: {
          github: form.github.trim(),
          linkedin: form.linkedin.trim(),
          email: form.contactEmail.trim(),
        },
        facts: toText(form.facts).split('\n').map((s) => s.trim()).filter(Boolean),
        bio: form.bio
          .split(/\n\s*\n/)
          .map((s) => s.trim())
          .filter(Boolean),
        stats: form.stats.filter((s) => s.value || s.label),
      })
      setSaved(true)
    } catch (err) {
      console.error('[admin]', err)
      window.alert(`Save failed: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (!form || status === 'loading') {
    return (
      <div className="grid place-items-center py-24">
        <Spinner />
        <p className="mt-4 font-display italic text-muted">
          Loading your content...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Panel
        title="Settings"
        description="Identity and global content — applies across the whole site instantly."
        actions={
          <>
            {saved && (
              <span className="text-sm text-glow">Saved ✓</span>
            )}
            <Btn type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Btn>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name">
            <TextInput required value={form.firstName} onChange={set('firstName')} />
          </Field>
          <Field label="Last name">
            <TextInput required value={form.lastName} onChange={set('lastName')} />
          </Field>
        </div>
        <div className="mt-5 space-y-5">
          <Field label="Role">
            <TextInput
              required
              value={form.role}
              onChange={set('role')}
              placeholder="Full-Stack Developer"
            />
          </Field>
          <Field label="Tagline" hint="Used in hero + footer">
            <TextArea rows={2} value={form.tagline} onChange={set('tagline')} />
          </Field>
        </div>
      </Panel>

      <Panel title="Portrait & Resume">
        <div className="space-y-5">
          <Field
            label="Portrait image URL"
            hint="Leave empty to keep the monogram card. Square images look best."
          >
            <TextInput
              value={form.portraitUrl}
              onChange={set('portraitUrl')}
              placeholder="https://i.imgur.com/....jpg"
            />
          </Field>
          <Field label="Resume URL" hint="Link to a hosted PDF, or /resume.pdf in this repo">
            <TextInput value={form.resumeUrl} onChange={set('resumeUrl')} />
          </Field>
        </div>
      </Panel>

      <Panel title="Contact & Socials">
        <div className="space-y-5">
          <Field label="Display email">
            <TextInput type="email" value={form.email} onChange={set('email')} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="GitHub URL">
              <TextInput value={form.github} onChange={set('github')} />
            </Field>
            <Field label="LinkedIn URL">
              <TextInput value={form.linkedin} onChange={set('linkedin')} />
            </Field>
            <Field label="Email link" hint="Usually mailto:...">
              <TextInput value={form.contactEmail} onChange={set('contactEmail')} />
            </Field>
          </div>
        </div>
      </Panel>

      <Panel title="Bio paragraphs" hint="Separate paragraphs with a blank line">
        <TextArea rows={6} value={form.bio} onChange={set('bio')} />
      </Panel>

      <Panel title="Quick facts" hint="One per line">
        <TextArea rows={4} value={form.facts} onChange={set('facts')} />
      </Panel>

      <Panel title="Stats">
        <div className="grid gap-5 sm:grid-cols-3">
          {form.stats.map((stat, i) => (
            <div key={i} className="space-y-4 rounded-2xl border border-ink/10 p-4">
              <Field label={`Value ${i + 1}`}>
                <TextInput
                  value={stat.value}
                  onChange={setStat(i, 'value')}
                  placeholder="3+"
                />
              </Field>
              <Field label={`Label ${i + 1}`}>
                <TextInput
                  value={stat.label}
                  onChange={setStat(i, 'label')}
                  placeholder="Years experience"
                />
              </Field>
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex items-center justify-end gap-4 pb-10">
        {saved && <span className="text-sm text-glow">Saved ✓</span>}
        <Btn type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save all changes'}
        </Btn>
      </div>
    </form>
  )
}
