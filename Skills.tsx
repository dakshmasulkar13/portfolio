import { useEffect, useRef, useState } from 'react'
import { SKILLS } from '../data'
import { gsap, isCoarse, prefersReduced, ScrollTrigger } from '../gsapSetup'

export default function Skills() {
  const [on, setOn] = useState<number | null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const chaser = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!prefersReduced())
        gsap.from('.skill', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: grid.current, start: 'top 80%' } })
    }, grid)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (isCoarse() || prefersReduced()) return
    const g = grid.current!
    const qx = gsap.quickTo(chaser.current, 'x', { duration: 0.5, ease: 'power3' })
    const qy = gsap.quickTo(chaser.current, 'y', { duration: 0.5, ease: 'power3' })
    const move = (e: PointerEvent) => {
      const r = g.getBoundingClientRect()
      qx(e.clientX - r.left); qy(e.clientY - r.top)
      g.querySelectorAll<HTMLElement>('.skill').forEach((s) => {
        const b = s.getBoundingClientRect()
        const dx = (e.clientX - (b.left + b.width / 2)) / b.width
        const dy = (e.clientY - (b.top + b.height / 2)) / b.height
        s.style.setProperty('--px', `${(dx * 8).toFixed(1)}px`)
        s.style.setProperty('--py', `${(dy * 8).toFixed(1)}px`)
      })
    }
    g.addEventListener('pointermove', move)
    return () => g.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => { ScrollTrigger.refresh() }, [on])

  return (
    <section id="skills" className="skills">
      <div className="wrap">
        <p className="label"><i />TECHNICAL ARSENAL</p>
        <h2 className="h2">SKILLS<br /><span className="outline">IN PROGRESS.</span></h2>
        <p className="skills__note mono">A developing learning portfolio — every item below is something I'm actively learning and building with.</p>
        <div className="skills__grid" ref={grid} onPointerLeave={() => setOn(null)}>
          <div className="skills__chaser" ref={chaser} aria-hidden="true" />
          {SKILLS.map((s, i) => (
            <button
              key={s.name} type="button" data-cursor="" aria-expanded={on === i}
              className={`skill ${on === i ? 'is-on' : ''}`}
              onPointerEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(on === i ? null : i)}
            >
              <span className="skill__n mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="skill__name">{s.name}</span>
              <span className="skill__desc">{s.desc}</span>
              <span className="skill__tag mono">LEARNING</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
