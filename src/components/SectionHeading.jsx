import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../lib/motion.js'
import { cn } from '../lib/cn.js'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={cn(align === 'center' && 'text-center')}
    >
      <motion.p
        variants={fadeUp}
        className={cn(
          'flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-flare',
          align === 'center' && 'justify-center',
        )}
      >
        <span className="h-px w-8 bg-gradient-to-r from-grape to-flare" />
        {eyebrow}
        {align === 'center' && (
          <span className="h-px w-8 bg-gradient-to-l from-grape to-flare" />
        )}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="mt-4 font-display text-4xl tracking-tight md:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={cn('mt-4 max-w-2xl text-muted', align === 'center' && 'mx-auto')}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
