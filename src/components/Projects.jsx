import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { projects } from '../data'
import ProjectsStage from './ProjectsStage'
import ProjectModal from './ProjectModal'

// Grid placement per project: the featured one is large, the rest vary in size.
const LAYOUT = {
  claimiq: 'md:col-span-7 md:row-span-2',
  concierge: 'md:col-span-5',
  signal: 'md:col-span-5',
  devvault: 'md:col-span-6',
  tryiton: 'md:col-span-3',
  booksanta: 'md:col-span-3',
}
const IMG = {
  claimiq: 'aspect-[16/10]',
  concierge: 'aspect-[16/9]',
  signal: 'aspect-[16/9]',
  devvault: 'aspect-[16/10]',
  tryiton: 'aspect-[4/5] md:aspect-square',
  booksanta: 'aspect-[4/5] md:aspect-square',
}

function Card({ p, onOpen, i }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 })
  const big = p.id === 'claimiq'

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`${LAYOUT[p.id]} [perspective:1000px]`}
    >
      <motion.button
        type="button"
        layoutId={`card-${p.id}`}
        onClick={() => onOpen(p)}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          mx.set((e.clientX - r.left) / r.width - 0.5)
          my.set((e.clientY - r.top) / r.height - 0.5)
        }}
        onPointerLeave={() => {
          mx.set(0)
          my.set(0)
        }}
        style={{ rotateX, rotateY, borderRadius: 14 }}
        className={`group flex h-full w-full flex-col overflow-hidden border border-line bg-paper-2 text-left transition-shadow hover:shadow-[0_30px_60px_-30px_rgb(21_32_26/0.45)]`}
      >
        <div className={`relative w-full overflow-hidden ${IMG[p.id]}`}>
          <motion.img
            layoutId={`img-${p.id}`}
            src={p.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className={`font-bold tracking-[-0.03em] text-ink ${big ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{p.title}</h3>
            <ArrowUpRight
              size={22}
              weight="bold"
              className="shrink-0 text-ink-soft transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
            />
          </div>
          <p className="font-mono text-xs text-ink-soft">{p.category}</p>
          {(big || !['tryiton', 'booksanta'].includes(p.id)) && (
            <p className="mt-1 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">{p.blurb}</p>
          )}
          {big && (
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <span className="rounded-full bg-accent px-3 py-1 font-mono text-xs text-accent-ink">{p.status}</span>
              {p.stack.slice(0, 4).map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.button>
    </motion.article>
  )
}

export default function Projects() {
  const [open, setOpen] = useState(null)

  return (
    <section id="work" className="relative mx-auto max-w-[1400px] px-4 pt-24 md:px-8 md:pt-36">
      <ProjectsStage />
      <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-12">
        {projects.map((p, i) => (
          <Card key={p.id} p={p} i={i} onOpen={setOpen} />
        ))}
      </div>
      {/* Rendered on <body> so it sits above the fixed nav, which lives outside <main>. */}
      {createPortal(
        <AnimatePresence>{open && <ProjectModal key={open.id} p={open} onClose={() => setOpen(null)} />}</AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
