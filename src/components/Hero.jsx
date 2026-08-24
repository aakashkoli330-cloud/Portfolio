import { motion } from 'framer-motion'
import SplitFlap from './SplitFlap.jsx'
import { fadeUp, stagger } from '../lib/motion.js'
import { useSiteData } from '../context/SiteData.jsx'
import SocialLinks from './SocialLinks.jsx'

const blobs = [
  { class: 'left-[-10%] top-[-12%] h-[34rem] w-[34rem] bg-honey/30', dur: 13 },
  { class: 'right-[-12%] top-[22%] h-[30rem] w-[30rem] bg-grape/15', dur: 16 },
]

function ScrollHint() {
  return (
    <motion.a
      href="#about"
      aria-label="Scroll to about section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.8 }}
      className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
    >
      <span className="flex h-10 w-6 justify-center rounded-full border-2 border-ink/15 pt-2">
        <motion.span
          animate={{ y: [0, 12, 0], opacity: [1, 0.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-2 w-1 rounded-full bg-grape"
        />
      </span>
    </motion.a>
  )
}

export default function Hero() {
  const { site } = useSiteData()

  const name = `${site.firstName ?? ''} ${site.lastName ?? ''}`.trim()

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="bg-grid mask-fade absolute inset-0" aria-hidden="true" />
      {blobs.map((b) => (
        <motion.div
          key={b.class}
          aria-hidden="true"
          animate={{ y: [0, -24, 0], x: [0, 14, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute rounded-full blur-[130px] ${b.class}`}
        />
      ))}

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-24 pt-32 text-center"
      >
        <motion.p
          variants={fadeUp}
          className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.32em] text-muted"
        >
          Personal portfolio
        </motion.p>

        <motion.div variants={fadeUp} className="mt-7">
          <SplitFlap name={name || 'Developer'} />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-9 max-w-xl leading-relaxed text-muted"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-grape to-flare px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_26px_rgb(65_105_225_/_0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgb(65_105_225_/_0.45)]"
          >
            View work
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
            >
              <path d="M8 2v9M4 7l4 4 4-4M3 13h10" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cream transition-all duration-300 hover:-translate-y-0.5 hover:border-grape hover:bg-surface hover:text-flare"
          >
            Get in touch
          </a>
          <SocialLinks socials={site.socials} className="ml-1" />
        </motion.div>
      </motion.div>

      <ScrollHint />
    </section>
  )
}
