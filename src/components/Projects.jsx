import { useEffect, useMemo, useRef } from 'react'
import { useSiteData } from '../context/SiteData.jsx'
import { sorted } from '../lib/content.js'

function ProjectCard({ project: p, index }) {
  const hasLive = Boolean(p.live && p.live !== '#')
  const hasGithub = Boolean(p.github && p.github !== '#')
  const Tag = hasLive ? 'a' : 'div'

  const openGithub = (e) => {
    e.stopPropagation()
    if (hasGithub) window.open(p.github, '_blank', 'noopener')
  }

  return (
    <Tag
      {...(hasLive ? { href: p.live, target: '_blank', rel: 'noreferrer' } : {})}
      draggable={false}
      className="group relative block w-[min(78vw,400px)] flex-none overflow-hidden rounded-md border-2 border-ink bg-white text-left shadow-[10px_10px_0_var(--color-grape)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[14px_14px_0_var(--color-grape)]"
    >
      <div className="bg-grid relative h-52 overflow-hidden bg-surface">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.title}
            draggable={false}
            loading="lazy"
            className="h-full w-full object-cover grayscale-[0.25]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 grid select-none place-items-center font-display text-[6.5rem] font-semibold italic text-ink/10"
          >
            {p.letter ?? p.title?.[0] ?? '?'}
          </span>
        )}

        {p.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-white">
            ★ Featured
          </span>
        )}

        {hasGithub && (
          <span
            role="link"
            tabIndex={0}
            aria-label={`${p.title} on GitHub`}
            onClick={openGithub}
            onKeyDown={(e) => e.key === 'Enter' && openGithub(e)}
            className="absolute right-3 top-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-ink text-[11px] font-extrabold text-white transition-transform duration-200 hover:rotate-6 hover:scale-110"
          >
            GH
          </span>
        )}

        {hasLive && (
          <span className="pointer-events-none absolute bottom-3 right-3 translate-y-2 rounded-full bg-gradient-to-r from-grape to-flare px-4 py-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Open live ↗
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-ink/10 px-5 pt-4 font-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-muted">
        <span>0{index + 1}</span>
        <span>{p.featured ? 'Featured' : 'Project'}</span>
      </div>
      <h3 className="px-5 pt-1.5 font-display text-2xl font-semibold italic text-cream">
        {p.title}
      </h3>
      <p className="line-clamp-2 px-5 pt-1.5 text-sm leading-relaxed text-muted">
        {p.description}
      </p>
      <p className="px-5 pb-5 pt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-glow">
        {(p.tech ?? []).join(' · ')}
      </p>
    </Tag>
  )
}

export default function Projects() {
  const { projects: rawProjects } = useSiteData()
  const projects = useMemo(() => sorted(rawProjects), [rawProjects])

  const galRef = useRef(null)
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const countRef = useRef(null)
  const st = useRef({
    x: 0,
    v: 0,
    maxX: 0,
    dragging: false,
    moved: 0,
    lastX: 0,
    lastT: 0,
    raf: null,
  })

  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const gal = galRef.current
    const track = trackRef.current
    if (!gal || !track || !projects.length) return undefined

    const s = st.current
    const count = track.children.length

    const paint = () => {
      if (!reduced) {
        track.style.transform = `translate3d(${-s.x}px,0,0)`
      }
      if (barRef.current) {
        barRef.current.style.width = `${s.maxX ? 20 + (s.x / s.maxX) * 80 : 100}%`
      }
      if (countRef.current) {
        const cw = (track.children[0]?.offsetWidth ?? 1) + 24
        const idx = Math.min(count, Math.round(s.x / cw) + 1)
        countRef.current.textContent = `${String(idx).padStart(2, '0')} / ${String(count).padStart(2, '0')}`
      }
    }

    const measure = () => {
      s.maxX = Math.max(0, track.scrollWidth - gal.clientWidth)
      s.x = Math.max(0, Math.min(s.x, s.maxX))
      paint()
    }

    if (reduced) {
      measure()
      const onResizeOnly = () => measure()
      window.addEventListener('resize', onResizeOnly)
      return () => window.removeEventListener('resize', onResizeOnly)
    }

    const loop = () => {
      if (s.dragging) {
        s.raf = null
        return
      }
      s.x += s.v
      s.v *= 0.94
      if (s.x < 0) {
        s.x += (0 - s.x) * 0.2
        s.v = 0
      }
      if (s.x > s.maxX) {
        s.x += (s.maxX - s.x) * 0.2
        s.v = 0
      }
      paint()
      if (Math.abs(s.v) > 0.2 || s.x < -0.5 || s.x > s.maxX + 0.5) {
        s.raf = requestAnimationFrame(loop)
      } else {
        s.x = Math.max(0, Math.min(s.x, s.maxX))
        s.v = 0
        paint()
        s.raf = null
      }
    }
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(loop)
    }

    const down = (e) => {
      s.dragging = true
      s.moved = 0
      s.lastX = e.clientX
      s.lastT = performance.now()
      s.v = 0
      gal.setPointerCapture(e.pointerId)
      gal.classList.add('cursor-grabbing')
    }
    const move = (e) => {
      if (!s.dragging) return
      const dx = e.clientX - s.lastX
      s.lastX = e.clientX
      const dt = Math.max(1, performance.now() - s.lastT)
      s.lastT = performance.now()
      s.v = (-dx / dt) * 16
      s.moved += Math.abs(dx)
      s.x = Math.max(-60, Math.min(s.maxX + 60, s.x - dx))
      paint()
    }
    const up = () => {
      if (!s.dragging) return
      s.dragging = false
      gal.classList.remove('cursor-grabbing')
      kick()
    }
    const wheel = (e) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (!d) return
      e.preventDefault()
      s.x = Math.max(0, Math.min(s.maxX, s.x + d))
      s.v = 0
      paint()
    }
    const clickGuard = (e) => {
      if (s.moved > 6) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    gal.addEventListener('pointerdown', down)
    gal.addEventListener('pointermove', move)
    gal.addEventListener('pointerup', up)
    gal.addEventListener('pointercancel', up)
    gal.addEventListener('wheel', wheel, { passive: false })
    track.addEventListener('click', clickGuard, true)
    window.addEventListener('resize', measure)
    measure()

    return () => {
      gal.removeEventListener('pointerdown', down)
      gal.removeEventListener('pointermove', move)
      gal.removeEventListener('pointerup', up)
      gal.removeEventListener('pointercancel', up)
      gal.removeEventListener('wheel', wheel)
      track.removeEventListener('click', clickGuard, true)
      window.removeEventListener('resize', measure)
      if (s.raf) cancelAnimationFrame(s.raf)
    }
  }, [projects, reduced])

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-20 md:py-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="flex items-center gap-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-muted">
            <span aria-hidden="true" className="h-px w-9 bg-flare" />
            03 · Selected work
          </p>
          <h2 className="mt-4 font-display text-[clamp(30px,4vw,48px)] font-semibold italic leading-tight tracking-tight">
            Things I&rsquo;ve <em className="text-gradient">built.</em>
          </h2>
        </div>
        {!reduced && projects.length > 0 && (
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted">
            ← Drag to explore →
          </p>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="mt-12 font-mono text-sm uppercase tracking-[0.2em] text-muted">
          No projects yet.
        </p>
      ) : (
        <>
          <div
            ref={galRef}
            className={`mt-10 select-none ${reduced ? 'overflow-x-auto pb-5' : 'cursor-grab touch-pan-y overflow-hidden pb-5'}`}
          >
            <div
              ref={trackRef}
              className={`flex w-max gap-6 pr-6 ${reduced ? '' : 'will-change-transform'}`}
              style={!reduced ? { transform: 'translate3d(0px,0,0)' } : undefined}
            >
              {projects.map((p, i) => (
                <ProjectCard key={p.id ?? p.title} project={p} index={i} />
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center gap-5">
            <div className="h-0.5 flex-1 overflow-hidden rounded bg-surface">
              <i
                ref={barRef}
                className="block h-full w-1/5 bg-gradient-to-r from-grape to-flare transition-[width] duration-100 ease-linear"
              />
            </div>
            <span
              ref={countRef}
              className="font-mono text-[11px] tracking-[0.2em] text-muted"
            >
              01 / {String(projects.length).padStart(2, '0')}
            </span>
          </div>
        </>
      )}
    </section>
  )
}
