import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../gsapSetup'
import type { PortraitScene } from '../scene/portraitScene'

export default function Portrait() {
  const sec = useRef<HTMLElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let scene: PortraitScene | null = null
    let last = 0
    let dead = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // lazy-load three.js so the first paint stays fast
    import('../scene/portraitScene').then(({ createPortraitScene }) => {
      if (dead || !canvas.current || !wrap.current) return
      scene = createPortraitScene(canvas.current, wrap.current, reduced)
      if (!scene) wrap.current.classList.add('no-webgl')
      else scene.setProgress(reduced ? 1 : last)
    })

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('.pt-line', { yPercent: 112 })
        gsap.set('.portrait__slab', { scaleY: 0, transformOrigin: 'bottom' })
        gsap.set('.portrait__meta', { opacity: 0 })
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sec.current, start: 'top top', end: '+=260%', pin: true, scrub: 0.7, anticipatePin: 1,
            onUpdate: (s) => { last = s.progress; scene?.setProgress(s.progress) },
          },
        })
        tl.to('.pt-line.l1', { yPercent: 0, ease: 'power3.out', duration: 0.2 }, 0.04)
          .to('.pt-line.l2', { yPercent: 0, ease: 'power3.out', duration: 0.26 }, 0.16)
          .to('.pt-line.l3', { yPercent: 0, ease: 'power3.out', duration: 0.22 }, 0.34)
          .to('.portrait__slab', { scaleY: 1, ease: 'power2.out', duration: 0.4 }, 0.1)
          .to('.portrait__meta', { opacity: 1, duration: 0.15 }, 0.55)
          .fromTo('.portrait__text', { yPercent: 8 }, { yPercent: -8, duration: 1 }, 0)
          .fromTo('.portrait__slab', { xPercent: 4 }, { xPercent: -3, duration: 1 }, 0)
          .fromTo(wrap.current, { scale: 0.92 }, { scale: 1.03, duration: 1 }, 0)
      })
      mm.add('(prefers-reduced-motion: reduce)', () => { last = 1 })
    }, sec)

    return () => { dead = true; ctx.revert(); scene?.destroy(); ScrollTrigger.refresh() }
  }, [])

  return (
    <section id="portrait" className="portrait" ref={sec} aria-label="Portrait">
      <div className="portrait__stage">
        <div className="portrait__slab" aria-hidden="true" />
        <div className="portrait__wrap" ref={wrap} data-cursor="DAKSH">
          <canvas ref={canvas} role="img" aria-label="Portrait photograph of Daksh Masulkar in a black shirt, giving a thumbs-up" />
          <img className="portrait__fallback" src="/media/portrait.jpg" alt="Daksh Masulkar in a black shirt, giving a thumbs-up" loading="lazy" decoding="async" />
        </div>
        <h2 className="portrait__text" aria-label="The Honourable One">
          <span className="pt-mask"><span className="pt-line l1">THE</span></span>
          <span className="pt-mask"><span className="pt-line l2">HONOURABLE</span></span>
          <span className="pt-mask"><span className="pt-line l3 red">ONE</span></span>
        </h2>
        <div className="portrait__meta mono" aria-hidden="true">
          <span>FIG. 01 — DAKSH MASULKAR</span>
          <span>2.5D DEPTH EFFECT · MOVE YOUR CURSOR</span>
        </div>
      </div>
    </section>
  )
}
