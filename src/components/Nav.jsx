import { useRef } from 'react'
import { motion, useAnimate, useReducedMotion } from 'motion/react'
import { useSecrets } from '../secrets'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#journey', label: 'Journey' },
  { href: '#life', label: 'Life' },
]

// A lamp pull-string. Tug it (or click it) to switch day and night.
function PullString({ theme, onToggle }) {
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate()
  const dragged = useRef(false)

  const tug = () => {
    // A drag already toggled in onDragEnd, so ignore the click that follows it.
    if (dragged.current) {
      dragged.current = false
      return
    }
    onToggle()
    if (!reduce) animate(scope.current, { y: [0, 22, -4, 0] }, { duration: 0.5, ease: 'easeOut' })
  }

  return (
    <motion.button
      ref={scope}
      type="button"
      onClick={tug}
      drag={reduce ? false : 'y'}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragStart={() => (dragged.current = true)}
      onDragEnd={(_, info) => {
        if (info.offset.y > 24) onToggle()
        setTimeout(() => (dragged.current = false), 0)
      }}
      aria-label={theme === 'night' ? 'Turn the lights on' : 'Turn the lights off'}
      title="Pull me"
      className="group absolute right-5 top-0 flex cursor-grab touch-none flex-col items-center md:right-8 active:cursor-grabbing"
    >
      <span className="block h-[52px] w-px bg-ink-soft" />
      <span className="block h-4 w-3 rounded-b-full rounded-t-[3px] bg-accent transition-transform group-hover:scale-110" />
    </motion.button>
  )
}

export default function Nav({ theme, onToggleTheme }) {
  const { pitLane } = useSecrets()
  const revs = useRef([])
  // Five quick clicks on the logo "rev the engine" and send the car out.
  const onLogo = () => {
    const now = performance.now()
    revs.current = [...revs.current.filter((t) => now - t < 1500), now]
    if (revs.current.length >= 5) {
      revs.current = []
      pitLane()
    }
  }
  return (
    <header className="fixed inset-x-0 top-0 z-10">
      <nav className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 pr-16 md:px-8 md:pr-24">
        <a
          href="#top"
          onClick={onLogo}
          className="grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-bold tracking-tight text-paper transition hover:rotate-[-12deg] active:scale-95"
          aria-label="Back to top"
        >
          AT
        </a>
        <div className="flex items-center gap-1 rounded-full border border-line bg-paper/75 p-1 backdrop-blur-md">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper-2 hover:text-ink sm:inline-block"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-accent hover:text-accent-ink active:scale-[0.97]"
          >
            Say hello
          </a>
        </div>
        <PullString theme={theme} onToggle={onToggleTheme} />
      </nav>
    </header>
  )
}
