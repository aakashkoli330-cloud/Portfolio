import { useCallback, useEffect, useRef, useState } from 'react'

const BLANK = '\u00A0'
const NAME_STEP = 85
const NAME_BASE = 350
const ROLE_INTERVAL = 3400
const ROLE_STEP = 45

function buildRow(len) {
  return Array.from({ length: len }, () => BLANK)
}

function TileRow({ chars }) {
  return (
    <div
      className="flex justify-center gap-1"
      style={{ '--len': chars.length }}
    >
      {chars.map((ch, i) => (
        <span key={`${i}:${ch}`} className={`sf-tile ${ch !== BLANK ? 'sf-tick' : ''}`}>
          <span className="sf-half sf-top">
            <span className="sf-glyph">{ch}</span>
          </span>
          <span className="sf-half sf-bot">
            <span className="sf-glyph">{ch}</span>
          </span>
          <span className="sf-seam" />
        </span>
      ))}
    </div>
  )
}

function RowLabel({ children }) {
  return (
    <p className="mb-2 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">
      {children}
    </p>
  )
}

/**
 * Split-flap departure board showing the owner's name and a cycling role row.
 * Click the board to replay the name typing animation.
 */
export default function SplitFlap({
  name = '',
  roles = [],
  topLabel = 'Developer',
  bottomLabel = 'Working as',
  className = '',
}) {
  const clean = name.replace(/\s+/g, ' ').trim().toUpperCase()
  const nameLen = Math.max(clean.length, 8)
  const roleLen = Math.min(
    Math.max(...roles.map((r) => r.length), 12),
    26,
  )

  const [nameChars, setNameChars] = useState(() => buildRow(nameLen))
  const [roleChars, setRoleChars] = useState(() => buildRow(roleLen))
  const timers = useRef([])
  const intervalRef = useRef(null)
  const roleIndex = useRef(0)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  const typeInto = useCallback((setter, word, len, base, step) => {
    const padded = word.toUpperCase().padEnd(len).slice(0, len)
    ;[...padded].forEach((ch, i) => {
      const t = setTimeout(() => {
        setter((prev) => {
          const next = [...prev]
          next[i] = ch === ' ' ? BLANK : ch
          return next
        })
      }, base + i * step)
      timers.current.push(t)
    })
  }, [])

  const startRoles = useCallback(() => {
    if (!roles.length) return
    typeInto(setRoleChars, roles[0], roleLen, 0, ROLE_STEP)
    intervalRef.current = setInterval(() => {
      roleIndex.current = (roleIndex.current + 1) % roles.length
      typeInto(setRoleChars, roles[roleIndex.current], roleLen, 0, ROLE_STEP)
    }, ROLE_INTERVAL)
  }, [roles, roleLen, typeInto])

  const playName = useCallback(
    (withRoles) => {
      typeInto(setNameChars, clean || 'DEVELOPER', nameLen, NAME_BASE, NAME_STEP)
      if (withRoles) {
        const t = setTimeout(() => startRoles(), NAME_BASE + nameLen * NAME_STEP + 500)
        timers.current.push(t)
      }
    },
    [clean, nameLen, startRoles, typeInto],
  )

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      const staticWord = (clean || 'DEVELOPER').padEnd(nameLen).slice(0, nameLen)
      setNameChars([...staticWord].map((ch) => (ch === ' ' ? BLANK : ch)))
      if (roles.length) {
        const r = roles[0].toUpperCase().padEnd(roleLen).slice(0, roleLen)
        setRoleChars([...r].map((ch) => (ch === ' ' ? BLANK : ch)))
      }
      return clearTimers
    }

    playName(true)
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clean])

  const replay = () => {
    clearTimers()
    setNameChars(buildRow(nameLen))
    setRoleChars(buildRow(roleLen))
    playName(true)
  }

  return (
    <div
      onClick={replay}
      title="Click to replay"
      className={`inline-block cursor-pointer select-none rounded-2xl border border-white/10 bg-ink p-5 shadow-[14px_14px_0_#dbe4ff] sm:p-7 ${className}`}
    >
      <RowLabel>{topLabel}</RowLabel>
      <TileRow chars={nameChars} />
      {roles.length > 0 && (
        <>
          <RowLabel>{bottomLabel}</RowLabel>
          <TileRow chars={roleChars} />
        </>
      )}
    </div>
  )
}
