import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, GithubLogo, Pause, Play, SpeakerHigh, SpeakerSlash, X } from '@phosphor-icons/react'

// Local files live in /public and need the site's base path; full URLs pass through.
const asset = (src) => (/^https?:/.test(src) ? src : import.meta.env.BASE_URL + src)
const SPRING = { type: 'spring', stiffness: 380, damping: 30 }

// Autoplays muted (browsers only allow silent autoplay), with play, sound and seek controls.
function VideoPlayer({ item, title }) {
  const reduce = useReducedMotion()
  const video = useRef(null)
  const bar = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const v = video.current
    if (reduce) return
    // Start once the card has finished opening.
    const t = setTimeout(() => v.play().catch(() => {}), 550)
    return () => {
      clearTimeout(t)
      v.pause()
    }
  }, [reduce])

  // The browser's timeupdate event only fires about four times a second, which makes the
  // bar step. Reading the time on every animation frame while playing keeps it smooth.
  const paint = () => {
    const v = video.current
    if (bar.current && v?.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`
  }
  useEffect(() => {
    if (!playing) return
    let raf = requestAnimationFrame(function tick() {
      paint()
      raf = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const toggle = () => {
    const v = video.current
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }
  const seek = (e) => {
    const v = video.current
    const r = e.currentTarget.getBoundingClientRect()
    if (v.duration) v.currentTime = ((e.clientX - r.left) / r.width) * v.duration
    paint()
  }

  return (
    <div className="group/vid absolute inset-0">
      <video
        ref={video}
        src={asset(item.src)}
        poster={item.poster ? asset(item.poster) : undefined}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onSeeked={paint}
        aria-label={`${title} demo video`}
        className="h-full w-full cursor-pointer object-contain"
      />

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#0b120e]/75 text-[#f3f0e6] backdrop-blur transition hover:bg-accent hover:text-accent-ink active:scale-95"
        >
          {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
        </button>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-pressed={!muted}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0b120e]/75 px-4 text-sm font-medium text-[#f3f0e6] backdrop-blur transition hover:bg-accent hover:text-accent-ink active:scale-95"
        >
          {muted ? <SpeakerSlash size={16} weight="fill" /> : <SpeakerHigh size={16} weight="fill" />}
          {muted ? 'Sound off' : 'Sound on'}
        </button>
      </div>

      {/* seek bar: the whole strip is clickable */}
      <div onClick={seek} className="absolute inset-x-0 bottom-0 h-2 cursor-pointer bg-[#f3f0e6]/15" role="presentation">
        <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
      </div>
    </div>
  )
}

function MediaStage({ p }) {
  const items = p.media?.length ? p.media : [{ type: 'image', src: p.image }]
  const [index, setIndex] = useState(0)
  const item = items[index]

  useEffect(() => {
    if (items.length < 2) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % items.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [items.length])

  return (
    <div className="bg-[#0b120e]">
      <div className="relative aspect-video w-full overflow-hidden">
        {/* The card's own image morphs into the stage; the chosen media then fades in over it. */}
        <motion.img layoutId={`img-${p.id}`} src={p.image} alt="" className="absolute inset-0 h-full w-full object-cover object-left-top" />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: index === 0 ? 0.3 : 0 }}
            className="absolute inset-0 bg-[#0b120e]"
          >
            {item.type === 'video' ? (
              <VideoPlayer item={item} title={p.title} />
            ) : (
              <img src={asset(item.src)} alt={item.caption || `${p.title} screenshot`} className="h-full w-full object-contain" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {(items.length > 1 || item.caption) && (
        <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          {items.length > 1 && (
            <div className="flex gap-2">
              {items.map((m, i) => (
                <button
                  key={m.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${m.type} ${i + 1} of ${items.length}`}
                  aria-pressed={i === index}
                  className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-[8px] ring-2 transition ${
                    i === index ? 'ring-accent' : 'opacity-60 ring-transparent hover:opacity-100'
                  }`}
                >
                  <img src={asset(m.type === 'video' ? m.poster || p.image : m.src)} alt="" className="h-full w-full object-cover" />
                  {m.type === 'video' && (
                    <span className="absolute inset-0 grid place-items-center bg-[#0b120e]/35 text-[#f3f0e6]">
                      <Play size={14} weight="fill" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {item.caption && <p className="text-sm text-[#a3ab9f] md:text-right">{item.caption}</p>}
        </div>
      )}
    </div>
  )
}

const reveal = (i) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] },
})

export default function ProjectModal({ p, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const isGit = p.url?.includes('github.com')
  const facts = [
    ['When', p.when],
    ['Where', p.where],
    ['Type', p.category],
  ].filter(([, v]) => v)

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby={`t-${p.id}`}>
      <motion.div
        className="absolute inset-0 bg-[#0b120e]/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        layoutId={`card-${p.id}`}
        transition={SPRING}
        style={{ borderRadius: 14 }}
        className="relative max-h-[94dvh] w-full max-w-5xl overflow-y-auto overscroll-contain bg-paper"
      >
        <MediaStage p={p} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          autoFocus
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink shadow-lg transition hover:rotate-90 hover:bg-ink hover:text-paper"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="p-6 md:p-10">
          <motion.div {...reveal(0)}>
            <p className="font-mono text-xs text-accent">{p.status}</p>
            <h3 id={`t-${p.id}`} className="mt-2 text-4xl font-bold tracking-[-0.04em] text-ink md:text-6xl">
              {p.title}
            </h3>
            <p className="mt-3 max-w-[56ch] text-lg leading-relaxed text-ink-soft md:text-xl">{p.blurb}</p>
          </motion.div>

          {p.stats && (
            <motion.dl {...reveal(1)} className="mt-9 grid grid-cols-3 gap-4 border-y border-line py-6">
              {p.stats.map((s) => (
                <div key={s.label}>
                  <dd className="text-3xl font-bold tracking-[-0.04em] text-ink md:text-5xl">{s.value}</dd>
                  <dt className="mt-1.5 max-w-[22ch] text-sm leading-snug text-ink-soft">{s.label}</dt>
                </div>
              ))}
            </motion.dl>
          )}

          <div className="mt-10 grid gap-10 md:grid-cols-12">
            <div className="space-y-10 md:col-span-7">
              <motion.section {...reveal(2)}>
                <h4 className="text-lg font-bold tracking-[-0.02em] text-ink">The problem</h4>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{p.challenge}</p>
              </motion.section>

              {p.steps && (
                <motion.section {...reveal(3)}>
                  <h4 className="text-lg font-bold tracking-[-0.02em] text-ink">How it works</h4>
                  <ol className="mt-4">
                    {p.steps.map((step, i) => (
                      <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
                        {/* the connecting line stops at the last step */}
                        {i < p.steps.length - 1 && <span className="absolute bottom-0 left-[13px] top-7 w-px bg-line" />}
                        <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink font-mono text-xs text-paper">{i + 1}</span>
                        <span className="pt-0.5 text-[15px] leading-relaxed text-ink">{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.section>
              )}

              <motion.section {...reveal(4)}>
                <h4 className="text-lg font-bold tracking-[-0.02em] text-ink">What came of it</h4>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{p.results}</p>
              </motion.section>
            </div>

            <motion.aside {...reveal(3)} className="md:col-span-5">
              <div className="rounded-[14px] bg-paper-2 p-6 md:sticky md:top-6">
                <dl className="space-y-4">
                  {facts.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-6">
                      <dt className="font-mono text-xs text-ink-soft">{k}</dt>
                      <dd className="text-right text-[15px] font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 font-mono text-xs text-ink-soft">Built with</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <span key={t} className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-xs text-ink">
                      {t}
                    </span>
                  ))}
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 font-semibold text-accent-ink transition active:scale-[0.97]"
                  >
                    {isGit ? <GithubLogo size={18} weight="bold" /> : <ArrowUpRight size={18} weight="bold" />}
                    {isGit ? 'View on GitHub' : 'Visit the site'}
                  </a>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
