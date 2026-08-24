import { Link } from 'react-router-dom'
import { useCollection, useSiteSettings } from '../../hooks/useContent.js'
import { projects, skillGroups, experience } from '../../lib/mockData.js'
import { Panel } from './ui.jsx'

function StatCard({ label, value, to }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-ink/10 bg-ink/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-grape/50"
    >
      <p className="font-display text-4xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted">
        {label}
      </p>
    </Link>
  )
}

export default function Dashboard() {
  const { site } = useSiteSettings()
  const { data: projectItems } = useCollection('projects', [])
  const { data: skillItems } = useCollection('skills', [])
  const { data: experienceItems } = useCollection('experience', [])
  const { data: messages } = useCollection('messages', [])

  const unread = messages.filter((m) => !m.read).length

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted">
          Signed in as {site.email} — changes go live instantly.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Projects"
          value={projectItems.length || projects.length}
          to="/admin/projects"
        />
        <StatCard
          label="Skill groups"
          value={skillItems.length || skillGroups.length}
          to="/admin/skills"
        />
        <StatCard
          label="Timeline items"
          value={experienceItems.length || experience.length}
          to="/admin/experience"
        />
        <StatCard
          label="Unread messages"
          value={unread}
          to="/admin/messages"
        />
      </div>

      <Panel
        title="Quick reference"
        description="Everything on the public site is editable from this panel."
      >
        <ul className="space-y-2 text-sm text-muted">
          <li>• Projects / Skills / Experience — add, edit, reorder anytime</li>
          <li>• Settings — name, tagline, bio, socials, portrait URL</li>
          <li>• Messages — every contact-form submission lands here live</li>
        </ul>
      </Panel>
    </div>
  )
}
