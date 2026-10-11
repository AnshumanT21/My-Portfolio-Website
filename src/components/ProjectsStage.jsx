import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import Sprout from './Sprout'
import { useSecrets } from '../secrets'

const TITLE = 'My projects'
const SPROUT_W = 96
const SPROUT_H = 125
// matter-js is loaded lazily, the first time the stage scrolls into view.
let Matter = null
const loadMatter = () => (Matter ? Promise.resolve() : import('matter-js').then((m) => (Matter = m.default)))
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function ProjectsStage() {
  const reduce = useReducedMotion()
  const { unlock } = useSecrets()
  const stageRef = useRef(null)
  const sproutRef = useRef(null)
  const letterEls = useRef([])
  const physics = useRef(null) // { engine, items: [{ body, el, ox, oy }] }
  const visible = useRef(false)
  const raf = useRef(0)
  const greeted = useRef(false)
  const clicks = useRef(0)
  const calmUntil = useRef(0) // letters flying home under the cursor shouldn't knock them down again
  // Sprout's brain lives in a ref so the walk loop never re-renders React.
  const S = useRef({ x: 24, target: 260, mode: 'idle', until: 0, locked: false, facing: 1, mood: 'idle' })

  const [fallen, setFallen] = useState(false)
  const [mood, setMood] = useState('idle')
  const [facing, setFacing] = useState(1)
  const [leaves, setLeaves] = useState(0)
  const [bloom, setBloom] = useState(false)
  const [falling, setFalling] = useState([]) // leaves currently drifting to the ground
  const lastPoke = useRef(0)
  const [bubble, setBubble] = useState(null)
  const bubbleTimer = useRef()

  const say = useCallback((text, ms = 2200) => {
    clearTimeout(bubbleTimer.current)
    setBubble({ text, id: Math.random() })
    bubbleTimer.current = setTimeout(() => setBubble(null), ms)
  }, [])

  const showMood = useCallback((m) => {
    if (S.current.mood !== m) {
      S.current.mood = m
      setMood(m)
    }
  }, [])

  const face = useCallback((dir) => {
    if (dir && S.current.facing !== dir) {
      S.current.facing = dir
      setFacing(dir)
    }
  }, [])

  // Play a pose that the walk loop will not interrupt until it ends.
  const act = useCallback(
    (m, ms) => {
      const s = S.current
      s.locked = true
      s.until = performance.now() + ms
      showMood(m)
    },
    [showMood],
  )

  const tick = useCallback(
    (now) => {
      raf.current = 0
      if (!visible.current) return
      const stage = stageRef.current
      const W = stage.clientWidth
      const H = stage.clientHeight
      const s = S.current

      // Sprout
      if (s.locked && now >= s.until) {
        s.locked = false
        s.mode = 'idle'
        s.until = now + 700
      }
      if (!s.locked && !reduce) {
        if (s.mode === 'walk') {
          const dx = s.target - s.x
          const step = Math.sign(dx) * Math.min(Math.abs(dx), 1.1)
          s.x += step
          face(Math.sign(dx))
          showMood('walk')
          if (Math.abs(dx) < 1) {
            s.mode = 'idle'
            s.until = now + 1400 + Math.random() * 2600
          }
        } else {
          showMood('idle')
          if (now >= s.until) {
            s.mode = 'walk'
            s.target = Math.random() * Math.max(0, W - SPROUT_W)
          }
        }
      }
      s.x = Math.min(Math.max(s.x, 0), Math.max(0, W - SPROUT_W))
      if (sproutRef.current) sproutRef.current.style.transform = `translate3d(${s.x}px,0,0)`

      // Letters
      const p = physics.current
      if (p) {
        Matter.Engine.update(p.engine, 1000 / 60)
        for (const it of p.items) {
          const { position: pos, angle, bounds, speed } = it.body
          it.el.style.transform = `translate3d(${pos.x - it.ox}px, ${pos.y - it.oy}px, 0) rotate(${angle}rad)`
          // A fast letter landing on Sprout knocks it over.
          const hit =
            speed > 3.2 &&
            bounds.max.x > s.x + 22 &&
            bounds.min.x < s.x + SPROUT_W - 22 &&
            bounds.max.y > H - SPROUT_H + 10
          if (hit && s.mood !== 'fallen') {
            act('fallen', 1900)
            say('Ow.')
            Matter.Body.setVelocity(it.body, { x: it.body.velocity.x * -0.6, y: -6 })
          }
        }
      }
      raf.current = requestAnimationFrame(tick)
    },
    [act, face, reduce, say, showMood],
  )

  const start = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(tick)
  }, [tick])

  // Only animate while the stage is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
      if (e.isIntersecting) {
        loadMatter()
        start()
        if (!greeted.current) {
          greeted.current = true
          setTimeout(() => say('Please don’t touch the title.', 3400), 600)
        }
      }
    })
    io.observe(stageRef.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }, [start, say])

  const drop = useCallback(async () => {
    if (physics.current || reduce || performance.now() < calmUntil.current) return
    await loadMatter()
    if (physics.current) return
    const stage = stageRef.current
    const sr = stage.getBoundingClientRect()
    const W = sr.width
    const H = sr.height
    const engine = Matter.Engine.create({ gravity: { y: 1.15 } })
    const wall = { isStatic: true }
    // Glyphs sit low in their line box, so the floor is lifted a little
    // to make the letters rest on the drawn line instead of sinking past it.
    const letterH = letterEls.current[0]?.getBoundingClientRect().height || 100
    const floorY = H - letterH * 0.1
    Matter.Composite.add(engine.world, [
      Matter.Bodies.rectangle(W / 2, floorY + 30, W * 3, 60, wall),
      Matter.Bodies.rectangle(-30, H / 2, 60, H * 4, wall),
      Matter.Bodies.rectangle(W + 30, H / 2, 60, H * 4, wall),
      Matter.Bodies.rectangle(W / 2, -H, W * 3, 60, wall),
    ])
    const items = letterEls.current.filter(Boolean).map((el) => {
      const r = el.getBoundingClientRect()
      const ox = r.left - sr.left + r.width / 2
      const oy = r.top - sr.top + r.height / 2
      const body = Matter.Bodies.rectangle(ox, oy, r.width * 0.9, r.height * 0.74, {
        restitution: 0.4,
        friction: 0.35,
        frictionAir: 0.012,
        chamfer: { radius: 8 },
      })
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12)
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 4, y: -2 - Math.random() * 3 })
      body.plugin.el = el
      return { body, el, ox, oy }
    })
    Matter.Composite.add(engine.world, items.map((i) => i.body))
    physics.current = { engine, items }
    setFallen(true)
    unlock('fall')

    // Sprout reacts: jump, tremble, run away from the nearest letter.
    act('scared', 2300)
    say(pick(['AAH!', 'The letters are falling!', 'Not again!']))
    start()
  }, [act, reduce, say, start, unlock])

  const putBack = useCallback(() => {
    const p = physics.current
    if (!p) return
    physics.current = null
    calmUntil.current = performance.now() + 1500
    Matter.Engine.clear(p.engine)
    for (const it of p.items) {
      it.el.style.transition = 'transform 0.9s cubic-bezier(0.2, 1.3, 0.4, 1)'
      it.el.style.transform = ''
      setTimeout(() => (it.el.style.transition = ''), 950)
    }
    setFallen(false)
    act('wave', 1600)
    say('Phew. Thank you.')
  }, [act, say])

  // Reset on resize so the walls always match the stage.
  useEffect(() => {
    const onResize = () => physics.current && putBack()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [putBack])

  // Grab and throw letters once they have fallen.
  const grab = (e) => {
    const p = physics.current
    if (!p) return
    const item = p.items.find((i) => i.el === e.currentTarget)
    if (!item) return
    e.preventDefault()
    const sr = stageRef.current.getBoundingClientRect()
    const pt = { x: e.clientX - sr.left, y: e.clientY - sr.top }
    const c = Matter.Constraint.create({
      pointA: pt,
      bodyB: item.body,
      pointB: { x: pt.x - item.body.position.x, y: pt.y - item.body.position.y },
      stiffness: 0.12,
      damping: 0.08,
      length: 0,
    })
    Matter.Composite.add(p.engine.world, c)
    const move = (ev) => {
      const r = stageRef.current.getBoundingClientRect()
      c.pointA = { x: ev.clientX - r.left, y: ev.clientY - r.top }
    }
    const up = () => {
      Matter.Composite.remove(p.engine.world, c)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // Left alone for a few seconds, Sprout sheds its leaves one at a time until it is
  // back to a bare sapling. Poking it again grows them back.
  useEffect(() => {
    if (!leaves && !bloom) return
    const id = setInterval(() => {
      if (performance.now() - lastPoke.current < 4000) return
      const x = S.current.x + SPROUT_W / 2 + (Math.random() - 0.5) * 30
      setFalling((f) => [...f, { id: Math.random(), x, drift: (Math.random() - 0.5) * 70, spin: (Math.random() - 0.5) * 540 }])
      if (bloom) {
        setBloom(false)
        clicks.current = 9
      } else {
        const next = leaves - 1
        setLeaves(next)
        clicks.current = next
        if (next === 0) say('Back to a twig.', 1800)
        else if (next === 8) say('My leaves!', 1400)
      }
    }, 1300)
    return () => clearInterval(id)
  }, [leaves, bloom, say])

  const pokeSprout = () => {
    if (S.current.mood === 'fallen') return
    lastPoke.current = performance.now()
    clicks.current += 1
    const n = clicks.current
    if (n < 10) {
      setLeaves(Math.min(n, 9))
      act('wave', 1300)
      say(n === 1 ? 'I am Sprout.' : n === 5 ? 'More leaves! Keep going.' : pick(['I am Sprout.', 'Hi!', 'Hehe.', 'That tickles.']))
    } else {
      setBloom(true)
      act('dance', 4200)
      say(n === 10 ? 'I AM SPROUT!' : pick(['Dance break!', 'I AM SPROUT!']), 3000)
      if (n === 10) unlock('bloom')
    }
  }

  const onStageMove = (e) => {
    const s = S.current
    if (s.locked || s.mode !== 'idle') return
    const r = stageRef.current.getBoundingClientRect()
    face(Math.sign(e.clientX - r.left - (s.x + SPROUT_W / 2)))
  }

  let letterIndex = 0
  return (
    <div
      ref={stageRef}
      onPointerMove={onStageMove}
      className="relative h-[340px] select-none border-b-2 border-ink md:h-[440px]"
    >
      <h2
        id="work-title"
        onPointerEnter={(e) => e.pointerType === 'mouse' && drop()}
        onClick={drop}
        className="relative z-[2] pt-4 text-[clamp(3.6rem,13vw,11rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ink"
        aria-label={TITLE}
      >
        {TITLE.split('').map((ch, i) =>
          ch === ' ' ? (
            <span key={i} className="inline-block w-[0.28em]" aria-hidden="true" />
          ) : (
            <span
              key={i}
              aria-hidden="true"
              ref={((idx) => (el) => (letterEls.current[idx] = el))(letterIndex++)}
              onPointerDown={grab}
              className={`inline-block will-change-transform ${fallen ? 'cursor-grab touch-none active:cursor-grabbing' : 'cursor-default'}`}
            >
              {ch}
            </span>
          ),
        )}
      </h2>

      {/* Keyboard-only secret, so the hint is hidden on touch-sized screens. */}
      <p className="pointer-events-none absolute -bottom-7 right-0 hidden font-mono text-xs text-ink-soft md:block">
        Psst. Type “sprout” on your keyboard.
      </p>

      <div ref={sproutRef} className="absolute bottom-0 left-0 z-[1]" style={{ width: SPROUT_W }}>
        <AnimatePresence>
          {bubble && (
            <motion.div
              key={bubble.id}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="pointer-events-none absolute bottom-[132px] left-1/2 w-max max-w-[220px] -translate-x-1/2 rounded-2xl bg-ink px-3.5 py-2 text-sm font-medium text-paper"
            >
              {bubble.text}
              <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-ink" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={pokeSprout}
          aria-label="Poke Sprout"
          className="block cursor-pointer rounded-xl transition-transform active:scale-95"
        >
          <Sprout mood={mood} facing={facing} leaves={leaves} bloom={bloom} size={SPROUT_W} />
        </button>
      </div>

      {falling.map((f) => (
        <motion.svg
          key={f.id}
          viewBox="-8 -16 16 16"
          width="16"
          height="16"
          aria-hidden="true"
          className="pointer-events-none absolute z-[1]"
          style={{ left: f.x, bottom: 112 }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: [0, 40, 108], x: [0, f.drift, f.drift * 0.4], rotate: f.spin, opacity: [1, 1, 0] }}
          transition={{ duration: 2.2, ease: 'easeIn' }}
          onAnimationComplete={() => setFalling((all) => all.filter((x) => x.id !== f.id))}
        >
          <path d="M0 0 Q-6.5 -8 0 -15 Q6.5 -8 0 0 Z" fill="var(--leaf)" stroke="#33200f" strokeWidth="1.2" />
        </motion.svg>
      ))}

      <AnimatePresence>
        {fallen && (
          <motion.button
            type="button"
            onClick={putBack}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-4 z-[3] inline-flex items-center gap-2 rounded-full border border-ink bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper active:scale-[0.97]"
          >
            <ArrowCounterClockwise size={16} weight="bold" />
            Put it back
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
