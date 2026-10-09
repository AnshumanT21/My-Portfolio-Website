import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export const SECRETS = {
  lamp: 'Lights out',
  scatter: 'Name tag shuffle',
  fall: 'Gravity is real',
  bloom: 'Sprout bloomed',
  konami: 'Pit lane open',
  summon: 'You called Sprout',
  blossom: 'Full bloom',
}
const TOTAL = Object.keys(SECRETS).length

const SecretsCtx = createContext(null)
export const useSecrets = () => useContext(SecretsCtx)

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem('secrets') || '[]'))
  } catch {
    return new Set()
  }
}


export function SecretsProvider({ children }) {
  const [found, setFound] = useState(load)
  const [toast, setToast] = useState(null)
  const [konamiRun, setKonamiRun] = useState(0)
  const [summonRun, setSummonRun] = useState(0)
  const toastTimer = useRef()

  const unlock = useCallback((key) => {
    setFound((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev).add(key)
      try {
        localStorage.setItem('secrets', JSON.stringify([...next]))
      } catch {
        /* storage blocked, the tracker still works for this visit */
      }
      clearTimeout(toastTimer.current)
      setToast({ key, label: SECRETS[key], count: next.size })
      toastTimer.current = setTimeout(() => setToast(null), 3200)
      return next
    })
  }, [])

  // One keyboard listener for the typed easter eggs.
  useEffect(() => {
    let typed = ''
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (k.length === 1) {
        typed = (typed + k).slice(-6)
        if (typed === 'sprout') {
          typed = ''
          setSummonRun((n) => n + 1)
          unlock('summon')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [unlock])

  const pitLane = useCallback(() => {
    setKonamiRun((n) => n + 1)
    unlock('konami')
  }, [unlock])

  return (
    <SecretsCtx.Provider value={{ found, unlock, konamiRun, summonRun, pitLane }}>
      {children}
      <SecretTracker count={found.size} />
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            role="status"
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-paper shadow-[0_12px_40px_-12px_rgb(0_0_0/0.4)]"
          >
            <span className="font-mono text-accent">Secret found</span>
            <span className="mx-2 opacity-40">/</span>
            {toast.label}
            <span className="ml-3 font-mono opacity-60">
              {toast.count}/{TOTAL}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </SecretsCtx.Provider>
  )
}

function SecretTracker({ count }) {
  if (count === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-5 left-5 z-30 hidden rounded-full border border-line bg-paper/80 px-4 py-2 font-mono text-xs text-ink-soft backdrop-blur md:block"
      title="There is a hint in the browser console"
    >
      secrets {count}/{TOTAL}
    </motion.div>
  )
}
