import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

// A grid of dots that bend away from the pointer, then ease back into place.
export default function DotField({ className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const GAP = 30
    const RADIUS = 150
    let dots = []
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    const pointer = { x: -9999, y: -9999 }
    let color = '0 0 0'

    const readColor = () => {
      color = getComputedStyle(document.documentElement).getPropertyValue('--dot').trim() || '0 0 0'
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) dots.push({ ox: x, oy: y, x, y })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        const dx = d.ox - pointer.x
        const dy = d.oy - pointer.y
        const dist = Math.hypot(dx, dy)
        let tx = d.ox
        let ty = d.oy
        let near = 0
        if (dist < RADIUS && !reduce) {
          near = 1 - dist / RADIUS
          const push = near * near * 38
          tx += (dx / (dist || 1)) * push
          ty += (dy / (dist || 1)) * push
        }
        d.x += (tx - d.x) * 0.14
        d.y += (ty - d.y) * 0.14
        ctx.fillStyle = `rgb(${color} / ${0.16 + near * 0.5})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.3 + near * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      draw()
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
    }
    const onLeave = () => {
      pointer.x = pointer.y = -9999
    }

    readColor()
    resize()
    loop()

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf && !reduce) loop()
    })
    io.observe(canvas)
    const mo = new MutationObserver(() => {
      readColor()
      if (reduce) draw()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)
    const host = canvas.parentElement
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      mo.disconnect()
      ro.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [reduce])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
