import { useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react'
import { hobbies } from '../data'

// Where each polaroid rests on the desk (desktop), as % of the desk box.
const SPOTS = [
  { left: '2%', top: '4%', rotate: -6 },
  { left: '37%', top: '9%', rotate: 4 },
  { left: '71%', top: '2%', rotate: -3 },
  { left: '7%', top: '50%', rotate: 5 },
  { left: '40%', top: '53%', rotate: -5 },
  { left: '72%', top: '47%', rotate: 7 },
]

// Each hobby has its own small reaction when tapped.
const REACTIONS = {
  rev: { x: [0, -6, 6, -6, 6, -4, 4, 0], transition: { duration: 0.45 } },
  bounce: { y: [0, -60, 0, -34, 0, -14, 0], transition: { duration: 1, ease: 'easeOut' } },
  spin: { rotateY: [0, 360], transition: { duration: 0.9, ease: [0.6, 0, 0.3, 1] } },
  wobble: { rotate: [0, -6, 5, -3, 0], transition: { duration: 0.6 } },
  flash: { scale: [1, 0.96, 1], transition: { duration: 0.3 } },
}

function Polaroid({ h, spot, desk, z, onLift, onFlash, mobile }) {
  const reduce = useReducedMotion()
  const [scope, animate] = useAnimate()

  const react = () => {
    if (reduce) return
    if (h.react === 'flash') onFlash()
    animate(scope.current, REACTIONS[h.react], REACTIONS[h.react].transition)
  }

  return (
    <motion.figure
      drag={!mobile && !reduce}
      dragConstraints={desk}
      dragElastic={0.15}
      dragMomentum
      onPointerDown={onLift}
      onTap={react}
      whileHover={mobile ? undefined : { scale: 1.04, rotate: 0 }}
      whileDrag={{ scale: 1.08, rotate: 0, cursor: 'grabbing' }}
      initial={reduce ? false : { opacity: 0, y: 80, rotate: spot.rotate * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: spot.rotate }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      style={mobile ? { zIndex: z } : { left: spot.left, top: spot.top, zIndex: z }}
      className={`${mobile ? 'relative w-[72vw] max-w-[280px] shrink-0 snap-center' : 'absolute w-[26%] max-w-[300px] cursor-grab'} select-none`}
    >
      <div ref={scope} className="rounded-[14px] bg-[#fbfaf5] p-2.5 pb-4 shadow-[0_24px_50px_-24px_rgb(21_32_26/0.6)]">
        <img src={h.img} alt={h.title} draggable="false" loading="lazy" className="aspect-[4/3] w-full rounded-[8px] object-cover" />
        <figcaption className="px-1 pt-3">
          <span className="block text-lg font-bold tracking-[-0.02em] text-[#15201a]">{h.title}</span>
          <span className="block text-sm text-[#4b574f]">{h.note}</span>
        </figcaption>
      </div>
    </motion.figure>
  )
}

export default function Life() {
  const desk = useRef(null)
  const [order, setOrder] = useState(hobbies.map((_, i) => i))
  const [flash, setFlash] = useState(0)

  // The polaroid you pick up always comes to the top of the pile.
  const lift = (i) => setOrder((o) => [...o.filter((x) => x !== i), i])
  const zOf = (i) => order.indexOf(i) + 1

  return (
    <section id="life" className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <h2 className="max-w-[14ch] text-[clamp(2.6rem,5.5vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ink">
          Off the clock
        </h2>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
          Pick these up and move them around. Each one does something when you tap it.
        </p>

        <div ref={desk} className="relative mt-12 hidden h-[640px] rounded-[14px] bg-paper-2 md:block lg:h-[720px]">
          {hobbies.map((h, i) => (
            <Polaroid key={h.title} h={h} spot={SPOTS[i]} desk={desk} z={zOf(i)} onLift={() => lift(i)} onFlash={() => setFlash((n) => n + 1)} />
          ))}
        </div>
      </div>

      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 pt-4 md:hidden">
        {hobbies.map((h, i) => (
          <Polaroid key={h.title} h={h} spot={SPOTS[i]} z={1} mobile onLift={() => {}} onFlash={() => setFlash((n) => n + 1)} />
        ))}
      </div>

      <AnimatePresence>
        {flash > 0 && (
          <motion.div
            key={flash}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={() => setFlash(0)}
            className="pointer-events-none fixed inset-0 z-30 bg-white"
          />
        )}
      </AnimatePresence>
    </section>
  )
}
