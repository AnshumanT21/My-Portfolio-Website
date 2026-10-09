import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { crafts } from '../data'
import { useSecrets } from '../secrets'

/* ---------- geometry ---------------------------------------------------- */

// Small seeded random so the foliage and fireflies look hand-placed but stay stable.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const quad = (b, t) => ({
  x: (1 - t) ** 2 * b.sx + 2 * (1 - t) * t * b.cx + t ** 2 * b.ex,
  y: (1 - t) ** 2 * b.sy + 2 * (1 - t) * t * b.cy + t ** 2 * b.ey,
})
const centerline = (b) => `M${b.sx} ${b.sy} Q ${b.cx} ${b.cy} ${b.ex} ${b.ey}`

// A filled limb that tapers from w0 at its base to w1 at its tip.
function taper(b) {
  const n = 20
  const left = []
  const right = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const p = quad(b, t)
    const dx = 2 * (1 - t) * (b.cx - b.sx) + 2 * t * (b.ex - b.cx)
    const dy = 2 * (1 - t) * (b.cy - b.sy) + 2 * t * (b.ey - b.cy)
    const len = Math.hypot(dx, dy) || 1
    const w = (b.w0 + (b.w1 - b.w0) * Math.pow(t, 0.75)) / 2
    left.push([p.x - (dy / len) * w, p.y + (dx / len) * w])
    right.push([p.x + (dy / len) * w, p.y - (dx / len) * w])
  }
  const f = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`
  return `M${left.map(f).join(' L')} L${right.reverse().map(f).join(' L')} Z`
}

const RAW = {
  wide: {
    w: 1000,
    h: 620,
    groundY: 594,
    seed: { x: 500, y: 580 },
    trunk: { sx: 500, sy: 596, cx: 486, cy: 430, ex: 508, ey: 236, w0: 84, w1: 14 },
    leader: { sx: 507, sy: 268, cx: 506, cy: 220, ex: 514, ey: 176, w0: 16, w1: 5 },
    roots: [
      { sx: 478, sy: 586, cx: 440, cy: 596, ex: 388, ey: 598, w0: 24, w1: 3 },
      { sx: 522, sy: 586, cx: 566, cy: 594, ex: 622, ey: 599, w0: 24, w1: 3 },
      { sx: 468, sy: 590, cx: 452, cy: 599, ex: 424, ey: 601, w0: 12, w1: 2 },
      { sx: 534, sy: 590, cx: 552, cy: 599, ex: 580, ey: 602, w0: 12, w1: 2 },
    ],
    branches: [
      { sx: 494, sy: 470, cx: 330, cy: 420, ex: 168, ey: 436, w0: 26, order: 0 },
      { sx: 492, sy: 402, cx: 318, cy: 312, ex: 148, ey: 262, w0: 22, order: 2 },
      { sx: 498, sy: 346, cx: 372, cy: 262, ex: 300, ey: 118, w0: 18, order: 4 },
      { sx: 494, sy: 450, cx: 672, cy: 396, ex: 832, ey: 424, w0: 26, order: 1 },
      { sx: 497, sy: 388, cx: 690, cy: 296, ex: 858, ey: 248, w0: 22, order: 3 },
      { sx: 503, sy: 332, cx: 636, cy: 248, ex: 702, ey: 110, w0: 18, order: 5 },
    ],
    crown: [
      { x: 514, y: 168, s: 1.35 },
      { x: 438, y: 196, s: 1 },
      { x: 592, y: 196, s: 1 },
    ],
    canopy: { x: 505, y: 262, rx: 375, ry: 198, n: 150, r: [22, 50] },
    flies: { canopy: [110, 890, 70, 440], ground: [300, 700, 540, 588], count: 30 },
    fontScale: 1,
  },
  tall: {
    w: 400,
    h: 900,
    groundY: 880,
    seed: { x: 200, y: 866 },
    trunk: { sx: 200, sy: 882, cx: 192, cy: 600, ex: 203, ey: 210, w0: 50, w1: 16 },
    leader: { sx: 202, sy: 260, cx: 200, cy: 180, ex: 206, ey: 116, w0: 18, w1: 4 },
    roots: [
      { sx: 188, sy: 872, cx: 160, cy: 880, ex: 120, ey: 884, w0: 16, w1: 2 },
      { sx: 212, sy: 872, cx: 242, cy: 880, ex: 284, ey: 885, w0: 16, w1: 2 },
    ],
    branches: [
      { sx: 197, sy: 760, cx: 120, cy: 748, ex: 70, ey: 690, w0: 16, order: 0 },
      { sx: 197, sy: 560, cx: 120, cy: 548, ex: 70, ey: 490, w0: 14, order: 2 },
      { sx: 199, sy: 360, cx: 120, cy: 348, ex: 70, ey: 290, w0: 12, order: 4 },
      { sx: 198, sy: 660, cx: 274, cy: 648, ex: 314, ey: 590, w0: 16, order: 1 },
      { sx: 200, sy: 460, cx: 274, cy: 448, ex: 314, ey: 390, w0: 14, order: 3 },
      { sx: 202, sy: 260, cx: 274, cy: 248, ex: 314, ey: 190, w0: 12, order: 5 },
    ],
    crown: [
      { x: 206, y: 110, s: 0.95 },
      { x: 160, y: 140, s: 0.7 },
      { x: 252, y: 140, s: 0.7 },
    ],
    canopy: { x: 200, y: 430, rx: 165, ry: 360, n: 140, r: [14, 32] },
    flies: { canopy: [30, 370, 80, 780], ground: [90, 310, 830, 872], count: 22 },
    fontScale: 0.62,
  },
}

// Turn the hand-placed skeleton into twigs, foliage clusters and fireflies.
function build(raw) {
  const r = rng(raw.w)
  const branches = raw.branches.map((b) => {
    const mid = quad(b, 0.58)
    const reach = (b.ex - b.sx) * 0.16
    const twig = {
      sx: mid.x,
      sy: mid.y,
      cx: mid.x + reach * 0.3,
      cy: mid.y - 46 * raw.fontScale,
      ex: mid.x + reach,
      ey: mid.y - 78 * raw.fontScale,
      w0: b.w0 * 0.38,
      w1: 1.6,
    }
    return { ...b, w1: Math.max(3, b.w0 * 0.2), twig }
  })

  const cluster = (x, y, s) => {
    const R = 34 * s * (raw.fontScale > 0.8 ? 1 : 0.85)
    const blobs = []
    // Back layer is darker and lower, front highlights smaller and up-left, which reads as volume.
    for (let i = 0; i < 6; i++) {
      const a = r() * Math.PI * 2
      const d = r() * R
      blobs.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * 0.7 + R * 0.25, r: R * (0.42 + r() * 0.3), tone: 'var(--leaf-d)' })
    }
    for (let i = 0; i < 6; i++) {
      const a = r() * Math.PI * 2
      const d = r() * R * 0.8
      blobs.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * 0.7, r: R * (0.34 + r() * 0.24), tone: 'var(--leaf)' })
    }
    for (let i = 0; i < 4; i++) {
      blobs.push({ x: x - R * 0.25 + (r() - 0.5) * R, y: y - R * 0.35 + (r() - 0.5) * R * 0.5, r: R * (0.18 + r() * 0.16), tone: 'var(--leaf-l)' })
    }
    return blobs
  }

  const clusters = branches.flatMap((b, i) => [
    { key: `b${i}`, branch: i, delay: 'tip', blobs: cluster(b.ex, b.ey - 4, raw.fontScale > 0.8 ? 1.15 : 1) },
    { key: `t${i}`, branch: i, delay: 'twig', blobs: cluster(b.twig.ex, b.twig.ey, raw.fontScale > 0.8 ? 0.75 : 0.62) },
  ])
  const crown = raw.crown.map((c, i) => ({ key: `c${i}`, branch: null, blobs: cluster(c.x, c.y, c.s) }))

  // The big crown behind the branches: overlapping blobs inside an ellipse,
  // mostly dark with a few mid-tone patches, so the limbs read through it.
  const cv = raw.canopy
  const mass = Array.from({ length: cv.n }, () => {
    const a = r() * Math.PI * 2
    const d = Math.pow(r(), 0.6)
    const x = cv.x + Math.cos(a) * d * cv.rx
    const y = cv.y + Math.sin(a) * d * cv.ry
    // Light from above: clumps near the top catch more of it, the underside stays in shadow.
    const lift = (cv.y - y) / cv.ry
    const roll = r() + lift * 0.45
    const tone = roll > 0.95 ? 'var(--leaf-l)' : roll > 0.58 ? 'var(--leaf)' : 'var(--leaf-d)'
    return { x, y, r: cv.r[0] + r() * (cv.r[1] - cv.r[0]), tone }
  })
  const rank = { 'var(--leaf-d)': 0, 'var(--leaf)': 1, 'var(--leaf-l)': 2 }
  mass.sort((a, b) => rank[a.tone] - rank[b.tone])

  const f = raw.flies
  const flies = Array.from({ length: f.count }, (_, i) => {
    const ground = i % 3 === 0
    const [x0, x1, y0, y1] = ground ? f.ground : f.canopy
    return {
      id: i,
      x: x0 + r() * (x1 - x0),
      y: y0 + r() * (y1 - y0),
      size: 1.6 + r() * 1.6,
      dur: 4 + r() * 6,
      blink: 1.6 + r() * 2.4,
      delay: -r() * 8,
      dx: (r() - 0.5) * 50,
      dy: (r() - 0.5) * 36,
    }
  })

  return { ...raw, branches, clusters, crown, mass, flies, treetop: raw.crown[0] }
}

const GEO = { wide: build(RAW.wide), tall: build(RAW.tall) }

function useTall() {
  const q = '(max-width: 639px)'
  const [tall, setTall] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q)
    const on = () => setTall(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return tall
}

/* ---------- timeline ----------------------------------------------------

   Growth is driven by scroll, not a clock. Every piece owns a window of the
   0..1 progress value, laid out like a timeline in "beats" (the old seconds),
   so scrolling down plays it forward and scrolling up rewinds it. */

const T = { seed: 1.05, roots: 1.15, trunk: 1.2, branches: 1.85, gap: 0.14 }
const branchBeat = (b) => T.branches + b.order * T.gap
const TOTAL = branchBeat({ order: 5 }) + 1.5
const win = (start, dur) => [start / TOTAL, Math.min(1, (start + dur) / TOTAL)]

// 0 -> 1 across a window.
const useGrow = (p, [a, b]) => useTransform(p, [a, b], [0, 1])
// 0 -> overshoot -> 1, so things still "pop" while being scrubbed.
const usePop = (p, [a, b]) => useTransform(p, [a, a + (b - a) * 0.65, b], [0, 1.15, 1])

/* ---------- pieces ------------------------------------------------------ */

// A tapered limb revealed by a growing mask, so a solid shape still "draws" in.
function Limb({ id, b, p, range, fill }) {
  const len = useGrow(p, range)
  return (
    <g>
      <mask id={id} maskUnits="userSpaceOnUse">
        <motion.path d={centerline(b)} stroke="white" strokeWidth={b.w0 * 2.4} strokeLinecap="round" fill="none" style={{ pathLength: len }} />
      </mask>
      <path d={taper(b)} fill={fill} mask={`url(#${id})`} />
    </g>
  )
}

function Cluster({ c, p, range, dim, lift }) {
  const scale = usePop(p, range)
  return (
    <motion.g style={{ scale, transformBox: 'fill-box', transformOrigin: '50% 80%' }}>
      <g
        style={{
          opacity: dim ? 0.5 : 1,
          transform: lift ? 'scale(1.06)' : 'none',
          transformBox: 'fill-box',
          transformOrigin: '50% 80%',
          transition: 'opacity 0.3s, transform 0.3s',
        }}
      >
        {c.blobs.map((bl, i) => (
          <circle key={i} cx={bl.x} cy={bl.y} r={bl.r} fill={bl.tone} />
        ))}
      </g>
    </motion.g>
  )
}

function Lantern({ b, i, p, tall, k, active, bloom }) {
  const scale = usePop(p, win(branchBeat(b) + 0.55, 0.4))
  return (
    <g>
      <motion.circle
        cx={b.ex}
        cy={b.ey}
        r={tall ? 16 : 24}
        fill={`url(#fly-${k})`}
        style={{ scale, opacity: 'calc(0.35 + var(--fly-glow) * 0.45)', transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <motion.circle
        cx={b.ex}
        cy={b.ey}
        r={tall ? 5 : 7}
        fill={active === i ? 'var(--accent)' : '#ffd36b'}
        stroke="#fff3c4"
        strokeWidth="2"
        style={{ scale, transformBox: 'fill-box', transformOrigin: 'center', transition: 'fill 0.3s' }}
      />
      {bloom > 0 && (
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 17, delay: i * 0.08 }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={b.ex} cy={b.ey - 13} rx="6" ry="10" fill="var(--accent)" transform={`rotate(${a} ${b.ex} ${b.ey})`} />
          ))}
          <circle cx={b.ex} cy={b.ey} r="5" fill="#ffd36b" />
        </motion.g>
      )}
    </g>
  )
}

function Label({ b, i, p, G, active, setActive }) {
  const range = win(branchBeat(b) + 0.6, 0.45)
  const scale = usePop(p, range)
  const opacity = useGrow(p, [range[0], range[0] + (range[1] - range[0]) * 0.4])
  const y = useTransform(p, range, [12, 0])
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-[155%]"
      style={{ left: `${(b.ex / G.w) * 100}%`, top: `${(b.ey / G.h) * 100}%` }}
    >
      <motion.button
        type="button"
        onPointerEnter={() => setActive(i)}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive(i)}
        onBlur={() => setActive(null)}
        onClick={() => setActive(i)}
        style={{ scale, opacity, y }}
        className="block"
      >
        <span
          className={`block whitespace-nowrap rounded-full border-2 px-2.5 py-1 text-[11px] font-semibold shadow-[0_8px_20px_-10px_rgb(0_0_0/0.5)] transition-colors sm:px-4 sm:py-2 sm:text-sm md:text-base ${
            active === i ? 'border-accent bg-accent text-accent-ink' : 'border-ink bg-paper text-ink'
          }`}
        >
          {crafts[i].title}
        </span>
      </motion.button>
    </div>
  )
}

function Petals({ run }) {
  const petals = useRef(
    Array.from({ length: 34 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.6,
      dur: 3.2 + Math.random() * 2.4,
      drift: (Math.random() - 0.5) * 240,
      spin: (Math.random() - 0.5) * 720,
      size: 8 + Math.random() * 10,
    })),
  ).current
  return (
    <AnimatePresence>
      {run > 0 && (
        <motion.div key={run} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
          {petals.map((pt) => (
            <motion.span
              key={pt.id}
              className="absolute -top-6 block rounded-[60%_0_60%_0] bg-accent"
              style={{ left: `${pt.left}%`, width: pt.size, height: pt.size * 0.8, opacity: 0.85 }}
              initial={{ y: 0, x: 0, rotate: 0 }}
              animate={{ y: '110vh', x: pt.drift, rotate: pt.spin }}
              transition={{ duration: pt.dur, delay: pt.delay, ease: [0.3, 0.1, 0.6, 1] }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- section ----------------------------------------------------- */

export default function Grow() {
  const tall = useTall()
  const G = GEO[tall ? 'tall' : 'wide']
  const reduce = useReducedMotion()
  const { unlock } = useSecrets()
  const ref = useRef(null)
  const [active, setActive] = useState(null)
  const [grown, setGrown] = useState(false)
  const [bloom, setBloom] = useState(0)
  const taps = useRef([])
  const k = tall ? 't' : 'w'

  // Scroll position through the tree -> growth. The spring eases it in and lets it
  // settle, so scrolling back up shrinks the tree slowly instead of snapping.
  const { scrollYProgress } = useScroll({ target: ref, offset: tall ? ['start 90%', 'end 100%'] : ['start 95%', 'end 96%'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6, restDelta: 0.0005 })
  const full = useMotionValue(1)
  const p = reduce ? full : smooth

  const percent = useTransform(p, (v) => `${String(Math.round(Math.min(1, v) * 100)).padStart(3, '0')}%`)
  useMotionValueEvent(p, 'change', (v) => setGrown(v > 0.97))
  useEffect(() => setGrown(p.get() > 0.97), [p])

  // Double-click (or tap twice) the treetop to make the tree blossom.
  const tapTop = () => {
    const now = performance.now()
    taps.current = [...taps.current.filter((t) => now - t < 700), now]
    if (taps.current.length >= 2) {
      taps.current = []
      setBloom((n) => n + 1)
      unlock('blossom')
    }
  }

  const lastBranch = branchBeat({ order: 5 })
  const ground = useGrow(p, win(0, 0.9))
  const ring = useGrow(p, win(0, T.seed))
  const ringFade = useTransform(p, win(T.trunk + 0.1, 0.4), [1, 0])
  const seedScale = useTransform(p, [0, win(0, T.seed * 0.85)[1], win(0, T.seed + 0.15)[1], win(0, T.seed + 0.3)[1]], [0.6, 0.6, 1.4, 1])
  const grooves = useTransform(p, win(T.trunk + 0.6, 0.6), [0, 0.7])
  const massScale = useTransform(p, win(T.branches + 0.2, 1.1), [0.2, 1])
  const massOpacity = useGrow(p, win(T.branches + 0.2, 0.5))
  const glow = useGrow(p, win(lastBranch + 0.5, 1))
  const flies = useGrow(p, win(lastBranch + 0.8, 0.7))

  const flyStyle = useMemo(
    () =>
      G.flies.map((f) => ({
        '--dx': `${f.dx}px`,
        '--dy': `${f.dy}px`,
        animationDuration: `${f.dur}s, ${f.blink}s`,
        animationDelay: `${f.delay}s, ${f.delay}s`,
      })),
    [G],
  )

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-28 md:px-8 md:py-36">
      <h2 className="max-w-[12ch] text-[clamp(2.6rem,5.5vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-ink">
        Six things I grow
      </h2>
      <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
        Different branches, same roots: I like building things people actually use.
      </p>

      <div ref={ref} className="relative mx-auto mt-10 w-full max-w-[960px]" style={{ aspectRatio: `${G.w} / ${G.h}` }}>
        <svg viewBox={`0 0 ${G.w} ${G.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`bark-${k}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="var(--bark-d)" />
              <stop offset="0.38" stopColor="var(--bark)" />
              <stop offset="0.55" stopColor="var(--bark-l)" />
              <stop offset="0.8" stopColor="var(--bark)" />
              <stop offset="1" stopColor="var(--bark-d)" />
            </linearGradient>
            <radialGradient id={`ground-${k}`}>
              <stop offset="0" stopColor="#ffcf5a" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffcf5a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`fly-${k}`}>
              <stop offset="0" stopColor="#fff3b0" />
              <stop offset="0.35" stopColor="#ffd25a" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffb52e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* warm glow pooled on the grass under the tree */}
          <motion.g style={{ scaleX: glow, transformBox: 'fill-box', transformOrigin: 'center' }}>
            <ellipse
              cx={G.seed.x}
              cy={G.groundY}
              rx={G.w * 0.3}
              ry={G.h * 0.05}
              fill={`url(#ground-${k})`}
              style={{ opacity: 'calc(var(--fly-glow) * 0.9)' }}
            />
          </motion.g>

          {/* ground, drawn outward from the seed */}
          {[G.w * 0.06, G.w * 0.94].map((x) => (
            <motion.path
              key={x}
              d={`M${G.seed.x} ${G.groundY} H ${x}`}
              stroke="var(--ink)"
              strokeOpacity="0.5"
              strokeWidth="2"
              fill="none"
              style={{ pathLength: ground }}
            />
          ))}

          {/* loading ring around the seed; fades as the trunk takes over */}
          <motion.g style={{ opacity: ringFade }}>
            <circle cx={G.seed.x} cy={G.seed.y} r="30" stroke="var(--line)" strokeWidth="3" fill="none" />
            <motion.circle
              cx={G.seed.x}
              cy={G.seed.y}
              r="30"
              stroke="var(--accent)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              style={{ pathLength: ring, rotate: -90, transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            <motion.ellipse
              cx={G.seed.x}
              cy={G.seed.y}
              rx="13"
              ry="10"
              fill="var(--bark)"
              style={{ scale: seedScale, transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          </motion.g>

          {/* crown mass, behind the limbs */}
          <motion.g style={{ scale: massScale, opacity: massOpacity, transformBox: 'fill-box', transformOrigin: '50% 90%' }}>
            <g style={{ opacity: active !== null ? 0.65 : 1, transition: 'opacity 0.3s' }}>
              {G.mass.map((m, i) => (
                <circle key={i} cx={m.x} cy={m.y} r={m.r} fill={m.tone} />
              ))}
            </g>
          </motion.g>

          {/* roots, trunk, leader */}
          {G.roots.map((b, i) => (
            <Limb key={i} id={`root-${k}-${i}`} b={b} p={p} range={win(T.roots, 0.5)} fill={`url(#bark-${k})`} />
          ))}
          <Limb id={`trunk-${k}`} b={G.trunk} p={p} range={win(T.trunk, 0.8)} fill={`url(#bark-${k})`} />
          <Limb id={`leader-${k}`} b={G.leader} p={p} range={win(T.trunk + 0.7, 0.5)} fill="var(--bark)" />

          {/* branches and twigs */}
          {G.branches.map((b, i) => (
            <g key={i} style={{ opacity: active !== null && active !== i ? 0.55 : 1, transition: 'opacity 0.3s' }}>
              <Limb id={`br-${k}-${i}`} b={b} p={p} range={win(branchBeat(b), 0.6)} fill="var(--bark)" />
              <Limb id={`tw-${k}-${i}`} b={b.twig} p={p} range={win(branchBeat(b) + 0.35, 0.35)} fill="var(--bark)" />
            </g>
          ))}

          {/* bark grooves, drawn after the branches so they stay visible where limbs cross the trunk */}
          <motion.g style={{ opacity: grooves }} stroke="var(--bark-d)" strokeWidth={tall ? 1.6 : 2.2} strokeLinecap="round" fill="none">
            {[-0.22, 0.05, 0.26].map((o, i) => {
              const t = G.trunk
              const x = t.sx + o * t.w0
              return <path key={i} d={`M${x} ${t.sy - 14} Q ${t.cx + o * t.w0 * 0.6} ${t.cy + 30} ${t.ex + o * t.w1 * 0.8} ${t.ey + 60 + i * 18}`} />
            })}
          </motion.g>

          {/* canopy clumps */}
          {G.crown.map((c) => (
            <Cluster key={c.key} c={c} p={p} range={win(lastBranch + 0.3, 0.6)} dim={active !== null} />
          ))}
          {G.clusters.map((c) => {
            const b = G.branches[c.branch]
            return (
              <Cluster
                key={c.key}
                c={c}
                p={p}
                range={win(branchBeat(b) + (c.delay === 'tip' ? 0.5 : 0.62), 0.5)}
                dim={active !== null && active !== c.branch}
                lift={active === c.branch}
              />
            )
          })}

          {/* the lantern each label hangs from, plus blossoms for the secret */}
          {G.branches.map((b, i) => (
            <Lantern key={i} b={b} i={i} p={p} tall={tall} k={k} active={active} bloom={bloom} />
          ))}

          {/* fireflies: sparse, so the labels stay readable */}
          <motion.g style={{ opacity: flies }}>
            {G.flies.map((f, i) => (
              <g key={f.id} className={reduce ? undefined : 'tree-fly'} style={flyStyle[i]}>
                <circle className="halo" cx={f.x} cy={f.y} r={f.size * 5} fill={`url(#fly-${k})`} />
                <circle cx={f.x} cy={f.y} r={f.size * 0.75} fill="#fff1a6" />
              </g>
            ))}
          </motion.g>
        </svg>

        {/* hit area on the treetop for the blossom secret */}
        <button
          type="button"
          onClick={tapTop}
          aria-label="Tap the treetop twice"
          className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${(G.treetop.x / G.w) * 100}%`, top: `${(G.treetop.y / G.h) * 100}%` }}
        />

        {G.branches.map((b, i) => (
          <Label key={`${k}-${crafts[i].title}`} b={b} i={i} p={p} G={G} active={active} setActive={setActive} />
        ))}
      </div>

      <div className="mx-auto mt-6 flex min-h-[3.5rem] max-w-[960px] items-start justify-center text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={grown ? (active ?? 'idle') : 'loading'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={grown && active !== null ? 'max-w-[46ch] text-lg text-ink' : 'font-mono text-sm text-ink-soft'}
          >
            {!grown ? (
              <>
                Keep scrolling to grow it <motion.span className="ml-2 tabular-nums">{percent}</motion.span>
              </>
            ) : active === null ? (
              tall ? 'Tap a branch.' : 'Hover a branch.'
            ) : (
              crafts[active].note
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      <Petals run={bloom} />
    </section>
  )
}
