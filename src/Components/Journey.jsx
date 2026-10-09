import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { experience } from '../data'

export default function Journey() {
  const reduce = useReducedMotion()
  const list = useRef(null)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 75%', 'end 55%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  return (
    <section id="journey" className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 py-28 md:grid-cols-12 md:px-8 md:py-40">
      <div className="md:col-span-4">
        <h2 className="text-[clamp(2.6rem,5.5vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ink md:sticky md:top-28">
          How I got here
        </h2>
      </div>

      <div ref={list} className="relative md:col-span-8">
        {/* The line fills in as you scroll, tracing the path from start to now. */}
        <div className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-line" />
        <motion.div
          style={{ scaleY: reduce ? 1 : draw }}
          className="absolute bottom-2 left-[7px] top-2 w-[2px] origin-top bg-accent"
        />
        <ol className="space-y-16">
          {experience.map((e, i) => (
            <motion.li
              key={e.title}
              initial={reduce ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-12"
            >
              <motion.span
                initial={reduce ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.15 }}
                className={`absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-paper ${i === 0 ? 'bg-accent' : 'bg-ink'}`}
              />
              <p className="font-mono text-sm text-ink-soft">{e.when}</p>
              <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-ink md:text-3xl">{e.title}</h3>
              <p className="mt-1 text-ink-soft">{e.where}</p>
              <ul className="mt-4 space-y-2">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                    <span className="mt-[11px] h-px w-4 shrink-0 bg-ink-soft" />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
