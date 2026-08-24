import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../lib/motion.js'
import { useSiteData } from '../context/SiteData.jsx'

function PortraitFrame({ site }) {
  const initials = `${(site.firstName ?? 'A')[0] ?? ''}${(site.lastName ?? '')[0] ?? ''}`.toUpperCase()
  return (
    <div className="overflow-hidden rounded border-2 border-ink bg-white shadow-[12px_12px_0_var(--color-grape)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[16px_16px_0_var(--color-grape)] lg:sticky lg:top-28">
      {site.portraitUrl ? (
        <img
          src={site.portraitUrl}
          alt={`${site.firstName} ${site.lastName}`}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover"
        />
      ) : (
        <div className="bg-grid grid aspect-[4/5] w-full place-items-center bg-surface">
          <span className="font-display text-[7rem] font-semibold italic text-ink/10">
            {initials}
          </span>
        </div>
      )}
      <div className="flex justify-between border-t-2 border-ink px-4 py-2.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-muted">
        <span>Fig. 01</span>
        <span>The developer</span>
      </div>
    </div>
  )
}

export default function About() {
  const { site } = useSiteData()
  const paragraphs = Array.isArray(site.bio)
    ? site.bio
    : site.bio
      ? [site.bio]
      : []
  const facts = Array.isArray(site.facts) ? site.facts : []
  const stats = Array.isArray(site.stats) ? site.stats : []

  return (
    <section
      id="about"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-20 md:py-28"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.p
          variants={fadeUp}
          className="flex items-center gap-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-muted"
        >
          <span aria-hidden="true" className="h-px w-9 bg-flare" />
          01 · About
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-4 font-display text-[clamp(30px,4vw,48px)] font-semibold italic leading-tight tracking-tight"
        >
          About <em className="text-gradient">me.</em>
        </motion.h2>

        <div className="mt-12 grid items-start gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <motion.div variants={fadeUp}>
            <PortraitFrame site={site} />
          </motion.div>

          <div>
            {paragraphs.length > 0 && (
              <div>
                <motion.p
                  variants={fadeUp}
                  className="drop-cap text-lg leading-relaxed text-cream"
                >
                  {paragraphs[0]}
                </motion.p>
                {paragraphs.slice(1).map((p) => (
                  <motion.p
                    key={p.slice(0, 24)}
                    variants={fadeUp}
                    className="mt-5 leading-loose text-muted"
                  >
                    {p}
                  </motion.p>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <motion.div variants={fadeUp} className="mt-10">
                {facts.map((fact, i) => (
                  <div
                    key={fact}
                    className="group flex items-baseline gap-4 border-b border-ink/15 py-4 pl-2.5 transition-all duration-300 first:border-t hover:bg-ink hover:pl-5"
                  >
                    <span className="font-mono text-[11px] text-glow transition-colors duration-300 group-hover:text-honey">
                      0{i + 1}
                    </span>
                    <span className="text-sm font-bold text-cream transition-colors duration-300 group-hover:text-white">
                      {fact}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {stats.length > 0 && (
              <motion.div
                variants={fadeUp}
                className="mt-10 grid grid-cols-3"
              >
                {stats.map((stat, i) => (
                  <div
                    key={stat.label ?? stat.value}
                    className={`${i > 0 ? 'border-l border-ink/15' : ''} px-4 first:pl-0 sm:px-6`}
                  >
                    <p className="font-display text-[clamp(26px,3.4vw,42px)] font-semibold italic text-cream">
                      {stat.value}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.26em] text-muted">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
