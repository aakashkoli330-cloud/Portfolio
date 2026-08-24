import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { useSiteData } from '../context/SiteData.jsx'
import { navLinks, sectionIds } from '../lib/mockData.js'
import { cn } from '../lib/cn.js'

function LogoMark() {
  return (
    <a
      href="#home"
      aria-label="Back to top"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-grape to-flare shadow-[0_4px_14px_rgba(18,32,92,0.22)] transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 19 28.5" className="h-3.5 fill-white">
        <path d="M0 0 L19 0 L19 9.5 L9.5 9.5 Z M0 9.5 L9.5 9.5 L19 19 L0 19 Z M0 19 L9.5 19 L9.5 28.5 Z" />
      </svg>
    </a>
  )
}

function NavLinkItem({ link, active, onClick }) {
  return (
    <li className="relative">
      {active && (
        <motion.span
          layoutId="nav-highlight"
          transition={{ type: 'spring', bounce: 0.25, duration: 0.55 }}
          className="absolute inset-0 rounded-full bg-ink/10 ring-1 ring-ink/15"
        />
      )}
      <a
        href={`#${link.id}`}
        onClick={onClick}
        className={cn(
          'relative z-10 block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200',
          active ? 'text-cream' : 'text-muted hover:text-cream',
        )}
      >
        {link.label}
      </a>
    </li>
  )
}

function ResumeButton({ className }) {
  const { site } = useSiteData()
  return (
    <a
      href={site.resumeUrl}
      download
      className={cn(
        'group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-grape to-flare px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(18,32,92,0.18)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(18,32,92,0.28)]',
        className,
      )}
    >
      Resume
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v9M4 7l4 4 4-4M3 13h10" />
      </svg>
    </a>
  )
}

function MenuIcon({ open }) {
  return (
    <span className="relative flex h-4 w-5 flex-col justify-between">
      <motion.span
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        className="block h-0.5 w-full rounded-full bg-cream"
      />
      <motion.span
        animate={open ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
        className="block h-0.5 w-full rounded-full bg-cream"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        className="block h-0.5 w-full rounded-full bg-cream"
      />
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.8, delay: 0.15 }}
      className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center px-4 sm:top-5"
    >
      <div className="pointer-events-auto relative">
        <nav
          className={cn(
            'flex origin-top items-center gap-1 rounded-full border backdrop-blur-xl transition-all duration-300',
            scrolled
              ? 'scale-[0.88] border-ink/10 bg-white/85 px-2 py-1 shadow-[0_10px_36px_rgba(18,32,92,0.14)]'
              : 'scale-100 border-ink/10 bg-white/70 px-3 py-2 shadow-[0_8px_32px_rgba(18,32,92,0.09)]',
          )}
        >
          <LogoMark />
          <ul className="ml-1 hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <NavLinkItem key={link.id} link={link} active={active === link.id} />
            ))}
          </ul>
          <ResumeButton className="ml-1 hidden md:inline-flex" />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-cream transition-colors hover:bg-ink/10 md:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
              className="absolute inset-x-0 top-[calc(100%+10px)] mx-auto w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-ink/10 bg-white/95 p-2 shadow-[0_16px_48px_rgba(18,32,92,0.16)] backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                        active === link.id
                          ? 'bg-ink/[0.06] text-cream'
                          : 'text-muted hover:bg-ink/5 hover:text-cream',
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ResumeButton className="mt-2 w-full justify-center" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
