import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from 'motion/react'

// The intro uses fixed colours so it looks the same in day and night themes.
const INK = '#15201a'
const ORANGE = '#ff6a2b'
const EASE = [0.76, 0, 0.24, 1]
const RISE = [0.22, 1, 0.36, 1]
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export function shouldPlayIntro() {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !sessionStorage.getItem('intro-seen')
  } catch {
    return true
  }
}

function Line({ text, delay, from = 'below' }) {
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={from === 'below' ? { y: '110%', rotate: 8 } : { x: '-60%', opacity: 0, skewX: -18 }}
          animate={from === 'below' ? { y: '0%', rotate: 0 } : { x: '0%', opacity: 1, skewX: 0 }}
          transition={{ duration: 0.8, delay: delay + i * 0.045, ease: RISE }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export default function Splash({ onDone }) {
  const nameRef = useRef(null)
  const [radius, setRadius] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const lensX = useMotionValue(-400)
  const ringOpacity = useMotionValue(0)
  const count = useMotionValue(0)
  const counter = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))
  const lensClip = useMotionTemplate`circle(${radius}px at ${lensX}px 50%)`
  const ringX = useTransform(lensX, (x) => x - radius)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    let stopped = false
    const run = async () => {
      const el = nameRef.current
      const r = el.offsetHeight * 0.46
      setRadius(r)
      lensX.set(-r * 1.2)
      animate(count, 100, { duration: 2.5, ease: [0.45, 0, 0.2, 1] })
      await wait(1050)
      if (stopped) return
      // The lens sweeps across the name, flipping the letters it passes over.
      animate(ringOpacity, 1, { duration: 0.2 })
      await animate(lensX, el.offsetWidth + r * 1.2, { duration: 1.25, ease: [0.65, 0, 0.35, 1] })
      animate(ringOpacity, 0, { duration: 0.15 })
      await wait(200)
      if (!stopped) setLeaving(true)
    }
    run()
    const skip = () => setLeaving(true)
    window.addEventListener('keydown', skip)
    return () => {
      stopped = true
      window.removeEventListener('keydown', skip)
    }
  }, [count, lensX, ringOpacity])

  const finish = () => {
    if (!leaving) return
    document.body.style.overflow = ''
    try {
      sessionStorage.setItem('intro-seen', '1')
    } catch {
      /* intro will just play again next visit */
    }
    onDone()
  }

  return (
    <motion.div
      role="presentation"
      onClick={() => setLeaving(true)}
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: leaving ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 0.9, ease: EASE }}
      onAnimationComplete={finish}
      className="fixed inset-0 z-50 cursor-pointer select-none overflow-hidden"
      style={{ background: ORANGE, color: INK }}
    >
      {/* grid */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: RISE }}
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${INK}14 1px, transparent 1px), linear-gradient(90deg, ${INK}14 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          backgroundPosition: 'center',
        }}
      />

      <motion.div
        animate={{ y: leaving ? -140 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative flex h-full flex-col justify-between p-5 font-mono text-[13px] md:p-8"
      >
        <div className="flex justify-between">
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Anshuman Tyagi
          </motion.span>
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            Portfolio 2026
          </motion.span>
        </div>

        <div className="flex flex-col items-center font-sans">
          <div
            ref={nameRef}
            className="relative text-[clamp(3.4rem,15.5vw,15rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.06em]"
          >
            <Line text="Anshuman" delay={0.3} />
            {/* lens layer: the same word, inverted, visible only inside the moving circle */}
            {radius > 0 && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 block pb-[0.04em]"
                style={{ clipPath: lensClip, background: INK, color: ORANGE }}
              >
                {/* split the same way as the visible line so kerning matches exactly */}
                {'Anshuman'.split('').map((ch, i) => (
                  <span key={i} className="inline-block">
                    {ch}
                  </span>
                ))}
              </motion.span>
            )}
            {radius > 0 && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 block rounded-full"
                style={{
                  x: ringX,
                  opacity: ringOpacity,
                  width: radius * 2,
                  height: radius * 2,
                  top: `calc(50% - ${radius}px)`,
                  boxShadow: `0 0 0 0.09em ${INK}, inset 0.12em 0.1em 0 -0.06em rgb(255 255 255 / 0.35)`,
                }}
              />
            )}
          </div>
          <div className="text-[clamp(3.4rem,15.5vw,15rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.06em]">
            <Line text="Tyagi" delay={0.75} from="left" />
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 1.3 }}
            className="mt-8 rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-[0.18em]"
            style={{ background: INK, color: ORANGE }}
          >
            Computer engineer at UMass Amherst
          </motion.span>
        </div>

        <div className="flex items-end justify-between">
          <span>
            Loading <motion.span className="tabular-nums">{counter}</motion.span>
          </span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }}>
            Click to skip
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  )
}
