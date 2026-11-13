import { useEffect, useState } from 'react'
import { SECTIONS } from '../data'
import { goTo, gsap, ScrollTrigger } from '../gsapSetup'

export default function Nav() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>('.progress__bar')
    const st = ScrollTrigger.create({
      start: 0, end: 'max', refreshPriority: -1,
      onUpdate: (s) => {
        if (bar) gsap.set(bar, { scaleX: s.progress })
        // active section = the one covering the viewport midpoint (works with pinned sections)
        const mid = window.innerHeight * 0.5
        for (let i = SECTIONS.length - 1; i >= 0; i--) {
          const r = document.getElementById(SECTIONS[i].id)?.getBoundingClientRect()
          if (r && r.top <= mid && r.bottom > mid) { setActive(i); break }
        }
      },
    })
    return () => st.kill()
  }, [])

  return (
    <>
      <div className="progress" aria-hidden="true"><div className="progress__bar" /></div>
      <header className="nav">
        <a href="#top" className="nav__logo" data-magnetic onClick={(e) => { e.preventDefault(); goTo('top') }}>DM<span /></a>
        <nav aria-label="Primary">
          {SECTIONS.slice(1).map((s) => (
            <a key={s.id} href={`#${s.id}`} data-magnetic className={SECTIONS[active].id === s.id ? 'is-on' : ''}
               onClick={(e) => { e.preventDefault(); goTo(s.id) }}>{s.label}</a>
          ))}
        </nav>
      </header>
      <div className={`where ${active === SECTIONS.length - 1 ? 'is-off' : ''}`} aria-hidden="true">
        <b>{String(active + 1).padStart(2, '0')}</b> / {String(SECTIONS.length).padStart(2, '0')} — {SECTIONS[active].label}
      </div>
    </>
  )
}
