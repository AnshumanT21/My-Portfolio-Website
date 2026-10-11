import { useState } from 'react'
import Penalty from './Penalty'

export default function Footer() {
  const [tally, setTally] = useState({ goal: 0, saved: 0 })
  const taken = tally.goal + tally.saved

  return (
    <footer className="mx-auto max-w-[1400px] px-4 pb-20 pt-28 md:px-8">
      {/* The penalty scene stands on the footer's ground line. */}
      <Penalty onResult={(kind) => setTally((t) => ({ ...t, [kind]: t[kind] + 1 }))} />
      <div className="flex flex-col justify-between gap-3 border-t-2 border-ink pt-4 md:flex-row md:items-center">
        <p className="font-mono text-xs text-ink-soft" aria-live="polite">
          {taken === 0 ? 'Click or tap the ball to take a penalty.' : `Penalties: scored ${tally.goal}, saved ${tally.saved}`}
        </p>
        <p className="text-sm text-ink-soft">
          © {new Date().getFullYear()} Anshuman Tyagi. Built with React, Motion and matter-js.
        </p>
      </div>
    </footer>
  )
}
