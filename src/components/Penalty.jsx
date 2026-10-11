import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react'
import { SoccerBall } from '@phosphor-icons/react'
import Sprout from './Sprout'

// A penalty kick in real CSS 3D. The camera sits behind the ball; the pitch recedes
// along the z-axis to a goal GOAL_Z units away, so everything shrinks as it travels.
//
// World units are px at z = 0. x is left/right, y is up (negative in CSS), z is depth.
const GOAL_Z = -380
const GOAL_W = 300
const GOAL_H = 112
const KEEPER_Z = GOAL_Z + 34
const SAVE_CHANCE = 0.42
const rand = (a, b) => a + Math.random() * (b - a)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const CONFETTI_COLORS = ['var(--accent)', '#ffd36b', 'var(--leaf)', 'var(--ink)']

function Confetti() {
  const bits = useRef(
    Array.from({ length: 44 }, (_, i) => ({
      id: i,
      from: rand(-GOAL_W / 2, GOAL_W / 2),
      dx: rand(-260, 260),
      up: rand(60, 220),
      dz: rand(80, 620),
      spin: rand(-720, 720),
      dur: rand(1.1, 1.9),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    })),
  ).current
  return bits.map((b) => (
    <motion.span
      key={b.id}
      className="absolute bottom-0 left-0 block h-[9px] w-[14px] rounded-[2px]"
      style={{ background: b.color }}
      initial={{ x: b.from, y: -50, z: GOAL_Z, rotate: 0, opacity: 1 }}
      animate={{ x: b.from + b.dx, y: [-50, -50 - b.up, 10], z: GOAL_Z + b.dz, rotate: b.spin, opacity: [1, 1, 0] }}
      transition={{ duration: b.dur, ease: 'easeOut', times: [0, 0.4, 1] }}
    />
  ))
}

export default function Penalty({ onResult }) {
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate()
  const [busy, setBusy] = useState(false)
  const [mood, setMood] = useState('idle')
  const [result, setResult] = useState(null) // { id, kind: 'goal' | 'saved' }
  const shots = useRef(0)

  // While waiting for a shot, the keeper shuffles along the goal line.
  useEffect(() => {
    if (busy || reduce) return
    const ctl = animate('.keeper', { x: [-24, 24] }, { duration: 1.7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' })
    return () => ctl.stop()
  }, [busy, reduce, animate])

  const shoot = async () => {
    if (busy) return
    setBusy(true)
    const id = ++shots.current
    const saved = Math.random() < SAVE_CHANCE
    const kind = saved ? 'saved' : 'goal'

    if (reduce) {
      setResult({ id, kind })
      onResult(kind)
      await wait(1600)
      setResult(null)
      setBusy(false)
      return
    }

    // Where the ball is headed inside the goal frame.
    const tx = rand(-GOAL_W / 2 + 26, GOAL_W / 2 - 26)
    const ty = rand(10, GOAL_H - 22)
    const side = Math.sign(tx) || (Math.random() < 0.5 ? -1 : 1)

    // The keeper commits just after the kick: to the ball on a save, the wrong way on a goal.
    const wrong = Math.abs(tx) < 30 ? (Math.random() < 0.5 ? -1 : 1) : -side
    const dive = saved
      ? { x: tx * 0.9, y: -Math.max(0, ty - 44), rotate: side * (30 + (Math.abs(tx) / (GOAL_W / 2)) * 55) }
      : { x: wrong * rand(70, 110), y: -rand(4, 26), rotate: wrong * 78 }
    setMood('scared') // arms up, eyes wide: the diving pose
    animate('.keeper', dive, { duration: 0.42, delay: 0.1, ease: [0.2, 0.8, 0.3, 1] })

    const stopZ = saved ? KEEPER_Z + 8 : GOAL_Z - 22
    await animate(
      '.ball',
      { x: [0, tx * 0.55, tx], y: [0, -(ty + 46), -ty], z: [0, stopZ * 0.6, stopZ], rotate: 620 },
      { duration: 0.56, ease: 'easeOut', times: [0, 0.55, 1] },
    )

    setResult({ id, kind })
    onResult(kind)
    if (saved) {
      setMood('dance')
      // Parried: the ball drops away to the side of the dive.
      await animate('.ball', { x: tx + side * 90, y: [-ty, -ty - 24, 0], z: KEEPER_Z + 130, opacity: [1, 1, 0] }, { duration: 0.75, ease: 'easeIn' })
    } else {
      animate('.goal', { scale: [1, 1.05, 1] }, { duration: 0.45 })
      // Into the net: it drops behind the line.
      await animate('.ball', { y: 0, z: GOAL_Z - 44, opacity: [1, 1, 0.9] }, { duration: 0.5, ease: 'easeIn' })
    }

    await wait(1250)
    setMood('idle')
    animate('.keeper', { x: 0, y: 0, rotate: 0 }, { duration: 0.45, ease: 'easeOut' })
    await animate('.ball', { opacity: 0 }, { duration: 0.15 })
    await animate('.ball', { x: 0, y: 0, z: 0, rotate: 0 }, { duration: 0 })
    await animate('.ball', { opacity: 1 }, { duration: 0.25 })
    setResult(null)
    setBusy(false)
  }

  return (
    // The scene is authored at 620px wide and scaled down on small screens.
    <div className="relative mx-auto h-[150px] sm:h-[200px] md:h-[260px]">
      <div
        className="absolute bottom-0 left-1/2 h-[260px] w-[620px] origin-bottom -translate-x-1/2 scale-[0.56] sm:scale-[0.76] md:scale-100"
        style={{ perspective: 1000, perspectiveOrigin: '50% 10%' }}
      >
        <div ref={scope} className="absolute bottom-0 left-1/2 h-0 w-0" style={{ transformStyle: 'preserve-3d' }}>
          {/* pitch: a flat plane lying on the ground, receding to the goal line */}
          <div
            className="absolute bottom-0 left-[-310px] h-[440px] w-[620px] origin-bottom"
            style={{ transform: 'rotateX(90deg)' }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 620 440" className="h-full w-full" fill="none" stroke="var(--line)" strokeWidth="3">
              <rect x="0" y="60" width="620" height="380" fill="var(--paper-2)" fillOpacity="0.7" stroke="none" />
              <path d="M0 60 H620" />
              <rect x="60" y="60" width="500" height="250" />
              <rect x="190" y="60" width="240" height="90" />
              <path d="M210 310 A 110 60 0 0 0 410 310" />
              <circle cx="310" cy="432" r="5" fill="var(--line)" stroke="none" />
            </svg>
          </div>

          {/* goal */}
          <motion.div
            className="goal absolute bottom-0 origin-bottom"
            style={{ z: GOAL_Z, left: -GOAL_W / 2, width: GOAL_W, height: GOAL_H }}
            aria-hidden="true"
          >
            <svg viewBox={`0 0 ${GOAL_W} ${GOAL_H}`} className="h-full w-full overflow-visible" fill="none">
              <g stroke="var(--ink-soft)" strokeWidth="1" opacity="0.55">
                {Array.from({ length: 14 }, (_, i) => (
                  <path key={`v${i}`} d={`M${(i + 1) * 20} 4 V ${GOAL_H}`} />
                ))}
                {Array.from({ length: 5 }, (_, i) => (
                  <path key={`h${i}`} d={`M4 ${(i + 1) * 19} H ${GOAL_W - 4}`} />
                ))}
              </g>
              <path d={`M3 ${GOAL_H} V 3 H ${GOAL_W - 3} V ${GOAL_H}`} stroke="var(--ink)" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* keeper */}
          <motion.div className="keeper absolute bottom-0 left-[-37px]" style={{ z: KEEPER_Z }} aria-hidden="true">
            <Sprout mood={mood} size={74} />
          </motion.div>

          {/* result text flies out of the goal toward the viewer */}
          <AnimatePresence>
            {result && (
              <motion.p
                key={result.id}
                role="status"
                className={`pointer-events-none absolute bottom-[34px] left-[-300px] w-[600px] text-center text-[84px] font-extrabold leading-none tracking-[-0.05em] ${
                  result.kind === 'goal' ? 'text-accent' : 'text-ink'
                }`}
                initial={reduce ? { opacity: 0 } : { z: GOAL_Z, opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { z: [GOAL_Z, 40, 210], opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.7, times: [0, 0.55, 1], ease: 'easeOut' }}
              >
                {result.kind === 'goal' ? 'GOOOOAL!' : 'SAVED!'}
              </motion.p>
            )}
          </AnimatePresence>
          {result?.kind === 'goal' && !reduce && <Confetti key={result.id} />}

          {/* ball */}
          <motion.button
            type="button"
            onClick={shoot}
            disabled={busy}
            aria-label="Take a penalty"
            whileHover={busy ? undefined : { scale: 1.12 }}
            className="ball absolute bottom-0 left-[-23px] grid h-[46px] w-[46px] cursor-pointer place-items-center rounded-full bg-paper text-ink before:absolute before:-inset-5 before:content-[''] disabled:cursor-default"
          >
            <SoccerBall size={46} weight="duotone" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
