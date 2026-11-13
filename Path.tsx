import { useEffect, useRef } from 'react'
import { PATH_BLOCKS } from '../data'
import { gsap, prefersReduced } from '../gsapSetup'

export default function Path() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReduced()) return
      gsap.from('.tl__line', { scaleY: 0, transformOrigin: 'top', ease: 'none',
        scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 60%', scrub: true } })
      gsap.from('.tl__body > *', { opacity: 0, y: 30, stagger: 0.12, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.tl', start: 'top 70%' } })
      gsap.from('.block', { opacity: 0, y: 40, stagger: 0.08, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.blocks', start: 'top 85%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="path" className="path" ref={root}>
      <div className="wrap">
        <p className="label"><i />EXPERIENCE &amp; EDUCATION</p>
        <h2 className="h2">THE<br /><span className="outline">PATH.</span></h2>

        <div className="tl">
          <div className="tl__line" aria-hidden="true" />
          <div className="tl__dot" aria-hidden="true" />
          <div className="tl__body">
            <p className="mono tl__k">EDUCATION</p>
            <h3 className="tl__title">Ajeenkya D Y Patil University</h3>
            <p className="tl__sub">Bachelor of Technology — Artificial Intelligence &amp; Data Science</p>
            <p className="tl__status mono"><i />CURRENT STATUS: UNDERGRADUATE STUDENT</p>
          </div>
        </div>

        <div className="blocks">
          {PATH_BLOCKS.map((b, i) => (
            <div className="block" key={b.k}>
              <span className="mono block__n">{String(i + 1).padStart(2, '0')}</span>
              <h4>{b.k}</h4>
              <p className="mono">{b.note}</p>
              <span className="block__pill mono">UPDATING SOON</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
