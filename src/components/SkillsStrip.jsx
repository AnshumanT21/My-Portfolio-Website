import { useReducedMotion } from 'motion/react'

// Logos come from the Simple Icons CDN in each brand's own colour.
const ROWS = [
  [
    { name: 'Python', slug: 'python' },
    { name: 'FastAPI', slug: 'fastapi' },
    { name: 'React', slug: 'react' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'Supabase', slug: 'supabase' },
    { name: 'Firebase', slug: 'firebase' },
  ],
  [
    { name: 'Tailwind CSS', slug: 'tailwindcss' },
    { name: 'Cloudflare R2', slug: 'cloudflare' },
    { name: 'Vite', slug: 'vite' },
    { name: 'GitHub', slug: 'github' },
    { name: 'Blender', slug: 'blender' },
    { name: 'HTML & CSS', slug: 'html5' },
  ],
]

function Row({ items, reverse, reduce }) {
  const pills = items.map((s) => (
    <li
      key={s.name}
      className="flex shrink-0 items-center gap-3 rounded-full border border-line bg-paper-2 py-3 pl-3 pr-6 transition-transform hover:-translate-y-1"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fbfaf5]">
        <img src={`https://cdn.simpleicons.org/${s.slug}`} alt="" width="22" height="22" loading="lazy" />
      </span>
      <span className="text-lg font-semibold tracking-[-0.02em] text-ink">{s.name}</span>
    </li>
  ))
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      {[0, 1].map((k) => (
        <ul
          key={k}
          aria-hidden={k === 1}
          className={`flex shrink-0 gap-4 pr-4 ${reduce ? '' : 'skills-scroll group-hover:[animation-play-state:paused]'}`}
          style={{ animationDirection: reverse ? 'reverse' : 'normal' }}
        >
          {pills}
        </ul>
      ))}
    </div>
  )
}

// Two rows sliding in opposite directions. Hovering a row pauses it.
export default function SkillsStrip() {
  const reduce = useReducedMotion()
  return (
    <section aria-label="Skills" className="space-y-4 py-10">
      <Row items={ROWS[0]} reduce={reduce} />
      <Row items={ROWS[1]} reverse reduce={reduce} />
    </section>
  )
}
