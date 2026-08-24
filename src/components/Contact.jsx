import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../lib/motion.js'
import { useSiteData } from '../context/SiteData.jsx'
import { sendMessage } from '../lib/contact.js'
import { isFirebaseConfigured } from '../lib/firebaseEnv.js'
import SocialLinks from './SocialLinks.jsx'

const STATUS = {
  idle: 'idle',
  sending: 'sending',
  sent: 'sent',
  error: 'error',
}

function Tape({ status }) {
  if (status === STATUS.sent) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="animate-tape mt-4 bg-ink px-4 py-3 text-center font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white"
      >
        ✓ Message sent — I&rsquo;ll reply within 24h
      </motion.p>
    )
  }
  if (status === STATUS.error) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="animate-tape mt-4 border border-dashed border-flare px-4 py-3 text-center font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] text-flare"
      >
        Something went wrong — try again or email me directly
      </motion.p>
    )
  }
  return null
}

const fieldRow =
  'grid grid-cols-[104px_1fr] items-baseline gap-3.5 sm:gap-4'
const fieldLabel =
  'font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted'
const fieldInput =
  'w-full rounded-none border-0 border-b border-ink/15 bg-transparent px-0.5 py-2 text-sm font-bold text-cream outline-none transition-colors duration-200 placeholder:font-medium placeholder:text-muted/60 focus:border-grape'

export default function Contact() {
  const { site } = useSiteData()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(STATUS.idle)

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (status === STATUS.sending) return
    setStatus(STATUS.sending)
    try {
      await sendMessage(form)
      setStatus(STATUS.sent)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus(STATUS.error)
    }
  }

  const ownerName = `${site.firstName ?? ''} ${site.lastName ?? ''}`
    .trim()
    .toUpperCase()

  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-20 md:py-28"
    >
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
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
            05 · Contact
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(30px,4vw,48px)] font-semibold italic leading-tight tracking-tight"
          >
            Ping me <em className="text-gradient">anytime.</em>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md leading-loose text-muted"
          >
            Have a project in mind, a role to fill, or just want to say hi? My
            inbox is always open.
          </motion.p>

          <motion.a
            variants={fadeUp}
            href={`mailto:${site.email}`}
            className="mt-7 inline-block border-b-2 border-grape pb-1.5 font-display text-xl italic text-cream transition-opacity duration-200 hover:opacity-60 md:text-2xl"
          >
            {site.email}
          </motion.a>

          <motion.div variants={fadeUp} className="mt-8">
            <SocialLinks socials={site.socials} />
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="overflow-hidden rounded-md border-2 border-ink bg-white shadow-[12px_12px_0_var(--color-grape)]"
        >
          <form onSubmit={onSubmit}>
            <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cream sm:text-[10.5px]">
                ◈ New message · To: {ownerName || 'Me'}
              </span>
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-glow shadow-[0_0_0_3px_rgb(113_134_239_/_0.25)]" />
            </div>

            <div className="p-6 sm:p-8">
              <div className={fieldRow}>
                <label htmlFor="cf-name" className={fieldLabel}>
                  Name
                </label>
                <input
                  id="cf-name"
                  required
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Ada Lovelace"
                  className={fieldInput}
                />
              </div>

              <div className={`${fieldRow} mt-6`}>
                <label htmlFor="cf-email" className={fieldLabel}>
                  Email
                </label>
                <input
                  id="cf-email"
                  required
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="ada@example.com"
                  className={fieldInput}
                />
              </div>

              <label
                htmlFor="cf-message"
                className={`mt-7 block ${fieldLabel}`}
              >
                Message
              </label>
              <textarea
                id="cf-message"
                required
                rows={5}
                value={form.message}
                onChange={update('message')}
                placeholder="TELL ME ABOUT YOUR PROJECT..."
                className="mt-3 min-h-[140px] w-full resize-y rounded-none border border-ink/15 bg-paper px-4 py-3.5 font-mono text-xs leading-6 text-cream outline-none transition-colors duration-200 [background-image:linear-gradient(to_right,rgb(65_105_225_/_0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgb(65_105_225_/_0.09)_1px,transparent_1px)] [background-size:24px_24px] placeholder:text-muted/60 focus:border-grape"
              />

              <button
                type="submit"
                disabled={status === STATUS.sending}
                className="mt-6 w-full rounded-[4px] bg-gradient-to-r from-grape to-flare py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_10px_24px_rgb(65_105_225_/_0.32)] transition-all duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === STATUS.sending ? 'Sending···' : 'Send message ▸'}
              </button>

              <AnimatePresence mode="wait">
                {status !== STATUS.idle && status !== STATUS.sending && (
                  <Tape key={status} status={status} />
                )}
              </AnimatePresence>

              {!isFirebaseConfigured && (
                <p className="mt-3 text-center text-xs text-muted/70">
                  Demo mode — connect Firebase to receive messages in your
                  admin inbox.
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
