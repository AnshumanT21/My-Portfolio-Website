import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { motion, useAnimate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useSecrets } from '../secrets'

const SPRING = { stiffness: 220, damping: 16, mass: 0.6 }
const RADIUS = 170

// One letter that leans away from the cursor and hops when clicked.
const Letter = forwardRef(function Letter({ ch, onHop }, ref) {
  const el = useRef(null)
  const [scope, animate] = useAnimate()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const r = useMotionValue(0)
  const sx = useSpring(x, SPRING)
  const sy = useSpring(y, SPRING)
  const sr = useSpring(r, SPRING)

  useImperativeHandle(ref, () => ({
    push(px, py, parentRect) {
      const node = el.current
      if (!node) return
      // offset* ignores transforms, so the rest position never drifts.
      const cx = parentRect.left + node.offsetLeft + node.offsetWidth / 2
      const cy = parentRect.top + node.offsetTop + node.offsetHeight / 2
      const dx = cx - px
      const dy = cy - py
      const d = Math.hypot(dx, dy)
      if (d < RADIUS) {
        const f = (1 - d / RADIUS) ** 2
        x.set((dx / (d || 1)) * f * 46)
        y.set((dy / (d || 1)) * f * 46)
        r.set(Math.sign(dx) * f * 16)
      } else {
        x.set(0)
        y.set(0)
        r.set(0)
      }
    },
    scatter() {
      const a = Math.random() * Math.PI * 2
      const dist = 260 + Math.random() * 320
      animate(
        scope.current,
        { x: [0, Math.cos(a) * dist, 0], y: [0, Math.sin(a) * dist, 0], rotate: [0, (Math.random() - 0.5) * 540, 0] },
        { duration: 1.6, times: [0, 0.35, 1], ease: ['easeOut', [0.2, 1.4, 0.4, 1]] },
      )
    },
  }))

  return (
    <motion.span ref={el} style={{ x: sx, y: sy, rotate: sr }} className="inline-block will-change-transform">
      <span
        ref={scope}
        onClick={() => {
          animate(scope.current, { y: [0, -70, 0], scaleY: [1, 1.08, 0.9, 1] }, { duration: 0.55, ease: 'easeOut' })
          onHop()
        }}
        className="inline-block cursor-pointer"
      >
        {ch}
      </span>
    </motion.span>
  )
})

export default function KineticName({ lines, className = '' }) {
  const reduce = useReducedMotion()
  const { unlock } = useSecrets()
  const wrap = useRef(null)
  const letters = useRef([])
  const hops = useRef(0)

  const onMove = useCallback((e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const rect = wrap.current.getBoundingClientRect()
    for (const l of letters.current) l?.push(e.clientX, e.clientY, rect)
  }, [reduce])

  const onLeave = useCallback(() => {
    for (const l of letters.current) l?.push(-9999, -9999, { left: 0, top: 0 })
  }, [])

  // Listen on the whole hero so letters react before the cursor reaches them.
  useEffect(() => {
    const host = wrap.current.closest('section') || wrap.current
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [onMove, onLeave])

  const onHop = () => {
    hops.current += 1
    if (hops.current % 7 === 0 && !reduce) {
      letters.current.forEach((l, i) => setTimeout(() => l?.scatter(), i * 25))
      unlock('scatter')
    }
  }

  let i = 0
  return (
    <h1 ref={wrap} className={`relative ${className}`} aria-label={lines.join(' ')}>
      {lines.map((line) => (
        <span key={line} className="block whitespace-nowrap" aria-hidden="true">
          {line.split('').map((ch, j) => (
            <Letter key={j} ch={ch} onHop={onHop} ref={((idx) => (h) => (letters.current[idx] = h))(i++)} />
          ))}
        </span>
      ))}
    </h1>
  )
}
