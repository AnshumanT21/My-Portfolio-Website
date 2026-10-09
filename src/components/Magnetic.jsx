import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

// Pulls its child a little toward the cursor while hovered.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 })

  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
