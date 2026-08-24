import { useSiteData } from '../context/SiteData.jsx'
import SocialLinks from './SocialLinks.jsx'

export default function Footer() {
  const { site } = useSiteData()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink/15">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <p className="order-2 text-center font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted sm:order-1 sm:text-left">
          © {year} {site.firstName} {site.lastName} · Built with React &amp;
          Tailwind CSS
        </p>

        <div className="order-1 sm:order-2">
          <SocialLinks socials={site.socials} />
        </div>

        <div className="order-3 flex items-center gap-4 text-sm text-muted">
          <a
            href="#home"
            aria-label="Back to top"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 transition-all duration-300 hover:-translate-y-0.5 hover:border-grape hover:text-grape"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M8 14V5M4.5 8.5 8 5l3.5 3.5M3 2h10" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
