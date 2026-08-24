import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../lib/motion.js'
import { useSiteData } from '../context/SiteData.jsx'
import { sorted } from '../lib/content.js'

const SEPS = ['·', '✳']

function TickerRow({ group, index }) {
  const sep = SEPS[index % SEPS.length]
  const duration = 26 + index * 6

  const words = (group.items ?? []).map((item, wi) => (
    <span key={item} className="inline-flex items-baseline">
      <span className="text-outline px-5 font-display text-[clamp(24px,3.4vw,44px)] font-semibold italic transition-colors duration-300 group-hover:text-flare group-hover:[-webkit-text-stroke-color:transparent] md:px-7">
        {item}
      </span>
      <span aria-hidden="true" className="text-lg text-honey md:text-xl">
        {sep}
      </span>
    </span>
  ))

  return (
    <motion.div
      variants={fadeUp}
      className={`grid items-center gap-x-8 gap-y-3 py-7 md:py-9 lg:grid-cols-[minmax(90px,170px)_1fr] lg:gap-x-10 ${
        index > 0 ? 'border-t border-ink/15' : ''
      }`}
    >
      <div className="text-right">
        <p className="text-outline-thin font-display text-[clamp(34px,4.6vw,58px)] font-semibold italic leading-none">
          0{index + 1}
        </p>
        <p className="mt-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.28em] text-muted">
          {group.category}
        </p>
      </div>

      <div className="ticker-mask group overflow-hidden" aria-label={`${group.category} skills`}>
        <div
          className={`inline-flex w-max items-baseline whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused] ${
            index % 2 ? 'animate-ticker-r' : 'animate-ticker-l'
          }`}
          style={{ '--ticker-duration': `${duration}s` }}
        >
          {words}
          <span aria-hidden="true" className="inline-flex items-baseline">
            {words}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const groups = sorted(useSiteData().skillGroups)

  return (
    <section
      id="skills"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-20 md:py-28"
    >
      <p className="flex items-center gap-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-muted">
        <span aria-hidden="true" className="h-px w-9 bg-flare" />
        02 · Skills
      </p>
      <h2 className="mt-4 font-display text-[clamp(30px,4vw,48px)] font-semibold italic leading-tight tracking-tight">
        My <em className="text-gradient">stack.</em>
      </h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-10 flex flex-col border-b border-ink/15 lg:mt-14"
      >
        {groups.map((group, i) => (
          <TickerRow key={group.id ?? group.category} group={group} index={i} />
        ))}
      </motion.div>
    </section>
  )
}
