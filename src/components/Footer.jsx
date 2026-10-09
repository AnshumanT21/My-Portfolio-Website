import { useRef, useState } from 'react'
import { motion, useAnimate, useReducedMotion } from 'motion/react'
import { SoccerBall } from '@phosphor-icons/react'

const readBest = () => {
  try {
    return Number(localStorage.getItem('keepie-best')) || 0
  } catch {
    return 0
  }
}

// Keepie-uppies: tap the ball before it lands to keep the streak going.
function Ball() {
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate()
  const [count, setCount] = useState(0)
  const [best, setBest] = useState(readBest)
  const flight = useRef(0)
  const streak = useRef(0)

  const kick = () => {
    if (reduce) return
    const id = ++flight.current
    streak.current += 1
    const n = streak.current
    setCount(n)
    if (n > best) {
      setBest(n)
      try {
        localStorage.setItem('keepie-best', String(n))
      } catch {
        /* best score just won't persist */
      }
    }

    const height = 130 + Math.random() * 60
    const drift = (Math.random() - 0.5) * 80
    animate(
      scope.current,
      { y: [null, -height, 0], x: [null, drift, drift * 1.6], rotate: [null, drift * 4, drift * 8] },
      { duration: 1.3, times: [0, 0.45, 1], ease: ['easeOut', 'easeIn'] },
    ).then(() => {
      // Landed without another touch: the streak is over and the ball rolls home.
      if (flight.current !== id) return
      streak.current = 0
      setCount(0)
      animate(scope.current, { x: 0, rotate: 0 }, { type: 'spring', stiffness: 60, damping: 12 })
    })
  }

  return (
    <div className="flex items-end gap-4">
      <motion.button
        ref={scope}
        type="button"
        onClick={kick}
        whileHover={{ scale: 1.1 }}
        aria-label="Kick the ball"
        className="relative z-[1] text-ink"
      >
        <SoccerBall size={44} weight="duotone" />
      </motion.button>
      <p className="pb-2 font-mono text-xs text-ink-soft">
        keepie-uppies {count}
        <span className="mx-2 opacity-40">/</span>best {best}
      </p>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1400px] px-4 pb-10 pt-40 md:px-8">
      <div className="flex flex-col justify-between gap-8 border-t-2 border-ink pt-4 md:flex-row md:items-end">
        <Ball />
        <p className="text-sm text-ink-soft">
          © {new Date().getFullYear()} Anshuman Tyagi. Built with React, Motion and matter-js.
        </p>
      </div>
    </footer>
  )
}
