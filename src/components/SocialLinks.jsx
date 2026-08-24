import { profile } from '../lib/mockData.js'
import { cn } from '../lib/cn.js'

const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  ),
  mail: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  ),
}

export default function SocialLinks({
  socials = profile.socials,
  className,
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <a
        href={socials.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="rounded-full border border-ink/10 p-2.5 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-flare/60 hover:text-flare hover:shadow-[0_0_18px_rgb(65_105_225_/_0.35)]"
      >
        <span className="block h-4 w-4">{ICONS.github}</span>
      </a>
      <a
        href={socials.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="rounded-full border border-ink/10 p-2.5 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-glow/60 hover:text-glow hover:shadow-[0_0_18px_rgb(113_134_239_/_0.3)]"
      >
        <span className="block h-4 w-4">{ICONS.linkedin}</span>
      </a>
      <a
        href={socials.email}
        aria-label="Email"
        className="rounded-full border border-ink/10 p-2.5 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-honey/60 hover:text-honey hover:shadow-[0_0_18px_rgb(150_170_246_/_0.28)]"
      >
        <span className="block h-4 w-4">{ICONS.mail}</span>
      </a>
    </div>
  )
}
