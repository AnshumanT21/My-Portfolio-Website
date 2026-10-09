import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Sprout from './Sprout'
import { useSecrets } from '../secrets'

// Konami code: a car tears across the bottom of the screen.
export function PitLane() {
  const { konamiRun } = useSecrets()
  const [lap, setLap] = useState(null)

  useEffect(() => {
    if (!konamiRun) return
    const secs = (18 + Math.random() * 4).toFixed(3)
    setLap({ id: konamiRun, time: `1:${secs}` })
    const t = setTimeout(() => setLap(null), 2600)
    return () => clearTimeout(t)
  }, [konamiRun])

  return (
    <AnimatePresence>
      {lap && (
        <div key={lap.id} className="pointer-events-none fixed inset-x-0 bottom-16 z-20 h-28 overflow-hidden">
          <motion.div
            initial={{ x: '-30vw' }}
            animate={{ x: '120vw' }}
            transition={{ duration: 1.1, ease: [0.5, 0, 0.9, 0.6] }}
            className="absolute bottom-4"
          >
            <svg width="320" height="60" viewBox="0 0 320 60" aria-hidden="true">
              <g stroke="var(--ink)" strokeWidth="2" opacity="0.35">
                <path d="M20 24 H104 M0 36 H96 M40 46 H110" />
              </g>
              <g transform="translate(100 0)">
              <path d="M22 40 L40 26 L96 24 L118 12 L140 12 L146 24 L196 28 L206 18 L214 18 L212 40 Z" fill="var(--accent)" />
              <path d="M112 24 L122 14 L134 14 L138 24 Z" fill="var(--ink)" />
              <rect x="14" y="20" width="10" height="20" rx="2" fill="var(--ink)" />
              <circle cx="56" cy="42" r="12" fill="var(--ink)" />
              <circle cx="56" cy="42" r="4" fill="var(--paper)" />
              <circle cx="178" cy="42" r="12" fill="var(--ink)" />
              <circle cx="178" cy="42" r="4" fill="var(--paper)" />
              </g>
            </svg>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.9 }}
            className="absolute right-6 top-0 rounded-full bg-ink px-4 py-2 font-mono text-sm text-paper"
          >
            Fastest lap {lap.time}
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  )
}

// Typing "sprout" anywhere makes Sprout pop up from the bottom corner.
export function SproutCameo() {
  const { summonRun } = useSecrets()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!summonRun) return
    setShown(summonRun)
    const t = setTimeout(() => setShown(0), 3800)
    return () => clearTimeout(t)
  }, [summonRun])

  return (
    <AnimatePresence>
      {shown > 0 && (
        <motion.div
          key={shown}
          initial={{ y: 160 }}
          animate={{ y: 18 }}
          exit={{ y: 180 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="pointer-events-none fixed bottom-0 right-8 z-30"
        >
          <div className="relative">
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="absolute -top-10 right-14 w-max rounded-2xl bg-ink px-3.5 py-2 text-sm font-medium text-paper"
            >
              You called?
            </motion.p>
            <Sprout mood="wave" facing={-1} size={110} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Night only: a few fireflies drift behind the content.
export function Fireflies({ on }) {
  const flies = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        dur: 7 + Math.random() * 8,
        delay: Math.random() * -12,
        dx: (Math.random() - 0.5) * 160,
        dy: (Math.random() - 0.5) * 120,
      })),
    [],
  )
  if (!on) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {flies.map((f) => (
        <span
          key={f.id}
          className="firefly absolute h-1.5 w-1.5 rounded-full bg-[#e9f5a0]"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            animationDuration: `${f.dur}s, ${2 + (f.id % 3)}s`,
            animationDelay: `${f.delay}s, ${f.delay}s`,
            '--dx': `${f.dx}px`,
            '--dy': `${f.dy}px`,
          }}
        />
      ))}
    </div>
  )
}
