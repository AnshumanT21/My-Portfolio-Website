import { useCallback, useState } from 'react'
import { SecretsProvider, useSecrets } from './secrets'
import Nav from './components/Nav'
import Hero from './components/Hero'
import SkillsStrip from './components/SkillsStrip'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Grow from './components/Grow'
import Splash, { shouldPlayIntro } from './components/Splash'
import Life from './components/Life'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { Fireflies, PitLane, SproutCameo } from './components/Extras'

function Page() {
  const { unlock } = useSecrets()
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'day')
  const [intro, setIntro] = useState(shouldPlayIntro)

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'night' ? 'day' : 'night'
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* theme just won't be remembered */
      }
      return next
    })
    unlock('lamp')
  }, [unlock])

  return (
    <>
      {intro && <Splash onDone={() => setIntro(false)} />}
      <Fireflies on={theme === 'night'} />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main className="relative z-[1]">
        <Hero ready={!intro} />
        <SkillsStrip />
        <Projects />
        <Grow />
        <Journey />
        <Life />
        <Contact />
      </main>
      <Footer />
      <PitLane />
      <SproutCameo />
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default function App() {
  return (
    <SecretsProvider>
      <Page />
    </SecretsProvider>
  )
}
