import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { ArrowDownRight } from '@phosphor-icons/react'
import DotField from './DotField'
import KineticName from './KineticName'
import Magnetic from './Magnetic'
import { PHOTO } from '../data'

const STICKERS = [
  { label: 'UMass Amherst', className: 'left-[-8%] top-[8%] -rotate-[8deg] bg-accent text-accent-ink', delay: 0.9 },
  { label: 'iCons Program', className: 'left-[-14%] top-[54%] -rotate-[5deg] bg-ink text-paper', delay: 1.05 },
  { label: 'Open to internships', className: 'bottom-[22%] right-[-12%] rotate-[6deg] bg-leaf text-paper', delay: 1.2 },
]

const rise = (delay, ready) => ({
  initial: { opacity: 0, y: 28 },
  animate: ready ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
})

function Polaroid({ bounds, ready }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 160, damping: 14 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 160, damping: 14 })

  return (
    <motion.figure
      drag={!reduce}
      dragConstraints={bounds}
      dragElastic={0.2}
      whileDrag={{ scale: 1.04, rotate: -2 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      initial={{ opacity: 0, rotate: 10, y: 60 }}
      animate={ready ? { opacity: 1, rotate: 3, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.5 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="relative w-full max-w-[340px] cursor-grab rounded-[14px] bg-[#fbfaf5] p-3 pb-14 shadow-[0_30px_60px_-25px_rgb(21_32_26/0.55)] active:cursor-grabbing"
    >
      <img
        src={PHOTO}
        alt="Anshuman Tyagi"
        draggable="false"
        className="aspect-[4/5] w-full rounded-[8px] object-cover"
        fetchPriority="high"
      />
      <figcaption className="absolute bottom-4 left-0 right-0 text-center font-mono text-[13px] text-[#4b574f]">
        hi, that’s me
      </figcaption>
    </motion.figure>
  )
}

export default function Hero({ ready = true }) {
  const bounds = useRef(null)
  const reduce = useReducedMotion()

  return (
    <section id="top" ref={bounds} className="relative min-h-[100dvh] overflow-hidden pt-24 md:pt-20">
      <DotField />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-4 pb-16 md:grid-cols-12 md:px-8 md:pb-10 lg:min-h-[calc(100dvh-5rem)]">
        <div className="md:col-span-7">
          <motion.p {...rise(0.1, ready)} className="mb-6 font-mono text-sm text-ink-soft">
            Computer Engineering at UMass Amherst
          </motion.p>

          <motion.div {...rise(0.2, ready)}>
            <KineticName
              lines={['Anshuman', 'Tyagi']}
              className="text-[clamp(3.8rem,10.5vw,9.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-ink"
            />
          </motion.div>

          <motion.p {...rise(0.4, ready)} className="mt-8 max-w-[38ch] text-lg leading-relaxed text-ink-soft md:text-xl">
            I build AI tools that take the tedious parts out of real work, like reading a stack of insurance claims.
          </motion.p>

          <motion.div {...rise(0.55, ready)} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-ink transition active:scale-[0.97]"
              >
                See my work
                <ArrowDownRight size={18} weight="bold" className="transition-transform group-hover:rotate-[-45deg]" />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border-2 border-ink px-6 py-3 font-semibold text-ink transition hover:bg-ink hover:text-paper active:scale-[0.97]"
              >
                Say hello
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <div className="relative mx-auto w-[78%] max-w-[340px] md:col-span-5 md:w-full">
          <Polaroid bounds={bounds} ready={ready} />
          {STICKERS.map((s) => (
            <motion.span
              key={s.label}
              drag={!reduce}
              dragConstraints={bounds}
              dragElastic={0.3}
              whileDrag={{ scale: 1.12 }}
              whileHover={{ scale: 1.06 }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={ready ? { opacity: 1, scale: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: s.delay }}
              className={`absolute cursor-grab touch-none select-none whitespace-nowrap rounded-full px-4 py-2 font-mono text-[13px] font-medium shadow-[0_10px_24px_-12px_rgb(21_32_26/0.6)] active:cursor-grabbing ${s.className}`}
            >
              {s.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
