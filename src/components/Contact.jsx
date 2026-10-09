import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, GithubLogo, LinkedinLogo, PaperPlaneTilt } from '@phosphor-icons/react'
import Magnetic from './Magnetic'
import { EMAIL, GITHUB, LINKEDIN } from '../data'

export default function Contact() {
  const [state, setState] = useState('idle') // idle | copied | failed

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setState('copied')
    } catch {
      setState('failed')
    }
    setTimeout(() => setState('idle'), 2200)
  }

  return (
    <section id="contact" className="mx-auto max-w-[1400px] px-4 py-28 md:px-8 md:py-40">
      <h2 className="max-w-[16ch] text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-ink">
        Working on something interesting?
      </h2>
      <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-soft md:text-xl">
        I’m looking for internships and side projects in AI and full-stack work. My inbox is open.
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Magnetic strength={0.2}>
          <button
            type="button"
            onClick={copy}
            className="group inline-flex items-center gap-3 rounded-full bg-accent py-4 pl-6 pr-5 text-lg font-semibold text-accent-ink transition active:scale-[0.97] md:text-xl"
          >
            {EMAIL}
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-accent-ink/15">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={state}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {state === 'copied' ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>
        </Magnetic>
        <span className="font-mono text-sm text-ink-soft" role="status" aria-live="polite">
          {state === 'copied' ? 'Copied. Paste it anywhere.' : state === 'failed' ? 'Couldn’t copy. Use the mail link instead.' : 'Click to copy'}
        </span>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {[
          { href: `mailto:${EMAIL}`, label: 'Open in mail app', Icon: PaperPlaneTilt },
          { href: GITHUB, label: 'GitHub', Icon: GithubLogo },
          { href: LINKEDIN, label: 'LinkedIn', Icon: LinkedinLogo },
        ].map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 font-semibold text-ink transition hover:bg-ink hover:text-paper active:scale-[0.97]"
          >
            <Icon size={18} weight="bold" className="transition-transform group-hover:-rotate-12" />
            {label}
          </a>
        ))}
      </div>
    </section>
  )
}
