import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/cn.js'
import { uploadImage } from '../../lib/storageApi.js'

export const inputCls =
  'w-full rounded-xl border border-ink/10 bg-ink/[0.04] px-3.5 py-2.5 text-sm text-cream placeholder:text-muted/50 outline-none transition focus:border-grape/70 focus:ring-2 focus:ring-grape/25'

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted/70">{hint}</span>}
    </label>
  )
}

export function TextInput({ className, ...props }) {
  return <input {...props} className={cn(inputCls, className)} />
}

export function TextArea({ className, ...props }) {
  return (
    <textarea {...props} className={cn(inputCls, 'resize-none', className)} />
  )
}

export function Select({ className, children, ...props }) {
  return (
    <select
      {...props}
      className={cn(inputCls, 'appearance-none [&>option]:bg-surface', className)}
    >
      {children}
    </select>
  )
}

const btnVariants = {
  primary:
    'bg-gradient-to-r from-grape to-flare text-white font-semibold shadow-[0_4px_14px_rgba(18,32,92,0.2)] hover:brightness-110',
  ghost:
    'border border-ink/15 text-cream hover:border-grape/60 hover:text-grape',
  danger:
    'border border-flare/40 text-flare hover:bg-flare/10',
}

export function Btn({ variant = 'primary', className, ...props }) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
        btnVariants[variant],
        className,
      )}
    />
  )
}

export function Modal({ open, title, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
            className="my-8 w-full max-w-lg rounded-3xl border border-ink/10 bg-paper p-6 shadow-[0_24px_64px_rgba(18,32,92,0.22)] md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/10 hover:text-cream"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="h-4 w-4"
                >
                  <path d="m3 3 10 10M13 3 3 13" />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ImageField({
  label,
  value,
  onChange,
  folder = 'uploads',
  hint,
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch (err) {
      console.error('[upload]', err)
      setError(err?.message ?? 'Upload failed. Try again with a different image.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
        {label}
      </span>
      <div
        onDragOver={(e) => {
          e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files?.[0])
        }}
        className={cn(
          'relative rounded-2xl border-2 border-dashed border-ink/15 bg-ink/[0.03] p-4 transition-colors hover:border-grape/60 hover:bg-grape/5',
          uploading && 'pointer-events-none opacity-60',
        )}
      >
        {value ? (
          <div className="flex items-center gap-4">
            <img
              src={value}
              alt="Preview"
              className="h-24 w-24 flex-none rounded-xl border border-ink/10 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted">{value}</p>
              <div className="mt-2.5 flex gap-2">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault()
                    inputRef.current?.click()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      inputRef.current?.click()
                    }
                  }}
                  className="cursor-pointer rounded-full border border-grape/50 px-3 py-1 text-xs font-semibold text-grape transition-colors hover:bg-grape/10"
                >
                  Replace
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault()
                    onChange('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      onChange('')
                    }
                  }}
                  className="cursor-pointer rounded-full border border-flare/40 px-3 py-1 text-xs font-semibold text-flare transition-colors hover:bg-flare/10"
                >
                  Remove
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-24 place-items-center text-center">
            {uploading ? (
              <div className="flex items-center gap-3">
                <Spinner />
                <span className="text-sm text-muted">Uploading...</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  inputRef.current?.click()
                }}
                className="text-sm text-muted transition-colors hover:text-grape"
              >
                <span className="mb-1 block text-2xl">+</span>
                Upload image or drop it here
              </button>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && (
        <span className="mt-1.5 block text-xs text-flare">{error}</span>
      )}
      {hint && !error && (
        <span className="mt-1 block text-xs text-muted/70">{hint}</span>
      )}
    </label>
  )
}

export function Panel({ title, description, actions, children }) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-surface/60 p-6 md:p-8">
      {(title || actions) && (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-display text-2xl tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="mt-1 max-w-xl text-sm text-muted">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

export function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      className="block h-5 w-5 rounded-full border-2 border-flare border-t-transparent"
    />
  )
}

export async function guard(fn) {
  try {
    await fn()
  } catch (err) {
    console.error('[admin]', err)
    const hint =
      err?.code === 'permission-denied'
        ? '\n\npermission-denied → publish the security rules in Firebase console (Firestore → Rules), and make sure you are signed in as aakashkoli330@gmail.com.'
        : ''
    window.alert(`Something went wrong: ${err?.message ?? err}${hint}`)
  }
}
