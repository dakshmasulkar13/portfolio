import { useEffect, useRef } from 'react'
import { ABOUT } from '../data'
import { gsap, ScrollTrigger, splitLines, prefersReduced } from '../gsapSetup'

export default function About() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {})
    let timer = 0
    const build = () => {
      ctx.revert()
      ctx.add(() => {
        gsap.utils.toArray<HTMLElement>('.about__p').forEach((p) => {
          const lines = splitLines(p)
          if (prefersReduced()) return
          gsap.fromTo(lines, { yPercent: 105, opacity: 0 }, {
            yPercent: 0, opacity: 1, ease: 'power3.out', duration: 1.1, stagger: 0.09,
            scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none none' },
          })
        })
        gsap.utils.toArray<HTMLElement>('.about__tag').forEach((t) => {
          if (prefersReduced()) return
          gsap.from(t, { opacity: 0, x: -24, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 90%' } })
        })
        gsap.to('.about__ghost', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true, start: 'top bottom', end: 'bottom top' } })
      })
      ScrollTrigger.refresh()
    }
    document.fonts.ready.then(build)
    const onResize = () => { clearTimeout(timer); timer = window.setTimeout(build, 250) }
    let w = window.innerWidth
    const rs = () => { if (window.innerWidth !== w) { w = window.innerWidth; onResize() } }
    window.addEventListener('resize', rs)
    return () => { clearTimeout(timer); window.removeEventListener('resize', rs); ctx.revert() }
  }, [])

  return (
    <section id="about" className="about" ref={root}>
      <div className="about__ghost" aria-hidden="true">ABOUT</div>
      <div className="wrap">
        <p className="label"><i />WHO</p>
        {ABOUT.map((a, i) => (
          <article className={`about__item ${i % 2 ? 'is-right' : ''}`} key={a.tag}>
            <p className="about__tag mono">{a.tag}</p>
            <p className="about__p" data-text={a.text} aria-label={a.text}>{a.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
