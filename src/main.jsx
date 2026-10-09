import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log(
  '%cHey, you opened the console.%c\nThere are 7 secrets on this page. One of them involves typing a word Sprout likes to hear.\nThe code is at github.com/AnshumanT21',
  'font: 600 16px sans-serif; color: #ff6a2b',
  'font: 13px monospace',
)

// The tab icon is Sprout. Leave the tab and Sprout dozes off; come back and it wakes up.
const icon = document.querySelector('link[rel="icon"]')
const awakeIcon = icon?.href
const sleepyIcon =
  'data:image/svg+xml,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="31" fill="#15201a"/>
  <path d="M22 56 C 15 52 13 44 13.5 34 L 14 20 L 18 11 L 22 18 L 26 7 L 30.5 16 L 34 5 L 38 15 L 42 8 L 45.5 17 L 50 12 L 51 22 L 50.5 34 C 51 44 48 52 42 56 Z" fill="#b8915f" stroke="#33200f" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M15 22 L 18 12.5 L 22 19 L 26 8.5 L 30.5 17.5 L 34 6.5 L 38 16.5 L 42 9.5 L 45.5 18.5 L 49.6 13.5 L 50.6 23 Q 44 27 38 23.5 Q 32 28 26 23.5 Q 20 27.5 15 22 Z" fill="#3f6f31"/>
  <path d="M19.5 38 Q 25 42 30.5 38 M35.5 38 Q 41 42 46.5 38" stroke="#1a0f08" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  <path d="M30 48 Q 33 46.5 36 48" stroke="#33200f" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <text x="50" y="16" font-family="sans-serif" font-weight="700" font-size="14" fill="#ff6a2b">z</text>
</svg>`)
const awakeTitle = document.title
document.addEventListener('visibilitychange', () => {
  if (!icon) return
  const away = document.hidden
  icon.href = away ? sleepyIcon : awakeIcon
  document.title = away ? 'Sprout misses you' : awakeTitle
})
