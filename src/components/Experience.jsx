import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../lib/motion.js'
import { useSiteData } from '../context/SiteData.jsx'
import { sorted } from '../lib/content.js'

function LedgerRow({ item }) {
  const [start = '', end = ''] = String(item.period ?? '').split('—')
  const isEdu = item.type === 'education'

  return (
    <motion.li
      variants={fadeUp}
      className="group grid items-start gap-x-6 gap-y-4 border-t border-ink/15 py-10 first:border-t-0 md:grid-cols-[minmax(190px,300px)_1fr] md:gap-x-14 md:py-14 lg:gap-x-16"
    >
      <div>
        <span
          className={`block font-display text-[clamp(38px,5vw,64px)] font-semibold italic leading-none tracking-tight ${
            isEdu
              ? 'text-transparent [-webkit-text-stroke:1.5px_rgb(65_105_225_/_0.85)]'
              : 'text-flare'
          }`}
        >
          {start.trim()}
        </span>
        {end?.trim() && (
          <span className="mt-3 block font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
            {end.trim()}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-display text-[clamp(21px,2.4vw,30px)] font-semibold italic text-cream transition-transform duration-300 group-hover:translate-x-2.5">
          {item.role}
          <span className="ml-3 align-middle font-body text-xs font-bold uppercase tracking-[0.2em] text-muted">
            {item.company}
          </span>
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={
              isEdu
                ? 'rounded-full border border-grape px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-flare'
                : 'rounded-full bg-ink px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-white'
            }
          >
            {isEdu ? 'Education' : 'Work'}
          </span>
        </div>

        <ul className="mt-4 space-y-2.5">
          {(item.points ?? []).map((point) => (
            <li
              key={point.slice(0, 24)}
              className="flex gap-3 text-sm leading-relaxed text-muted"
            >
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-grape transition-transform duration-300 group-hover:rotate-[135deg]" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  )
}

export default function Experience() {
  const { experience: itemsRaw } = useSiteData()
  const items = sorted(itemsRaw)

  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-20 md:py-28"
    >
      <p className="flex items-center gap-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-muted">
        <span aria-hidden="true" className="h-px w-9 bg-flare" />
        04 · Journey
      </p>
      <h2 className="mt-4 font-display text-[clamp(30px,4vw,48px)] font-semibold italic leading-tight tracking-tight">
        Experience{' '}
        <em className="text-gradient">&amp; education.</em>
      </h2>

      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-12 border-b border-ink/15 lg:mt-14"
      >
        {items.map((item) => (
          <LedgerRow key={item.id ?? item.role} item={item} />
        ))}
      </motion.ol>
    </section>
  )
}
