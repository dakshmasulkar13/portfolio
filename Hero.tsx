import { useEffect, useRef } from 'react'
import { gsap, prefersReduced, isCoarse, goTo } from '../gsapSetup'
import LoopVideo from './LoopVideo'

const Word = ({ text }: { text: string }) => (
  <span className="name__word" aria-hidden="true">
    {text.split('').map((c, i) => (
      <span className="ltr" key={i}><span className="ltr__i">{c}</span></span>
    ))}
  </span>
)

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const bg = useRef<HTMLDivElement>(null)

  // entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReduced()) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to('.curtain', { scaleY: 0, transformOrigin: 'top', duration: 1.1, ease: 'expo.inOut', delay: 0.25 })
        .from('.ltr', { yPercent: 115, rotate: 4, duration: 1.3, stagger: 0.045 }, '-=0.5')
        .from('.hero__fade', { opacity: 0, y: 18, duration: 1, stagger: 0.12 }, '-=0.8')
        .from('.hero__video', { opacity: 0, duration: 1.8 }, '-=1.2')
    }, root)
    return () => ctx.revert()
  }, [])

  // magnetic typography + background parallax
  useEffect(() => {
    if (isCoarse() || prefersReduced()) return
    const el = nameRef.current!
    const letters = Array.from(el.querySelectorAll<HTMLElement>('.ltr'))
    const inner = letters.map((l) => l.firstElementChild as HTMLElement)
    const st = letters.map(() => ({ s: 1, x: 0, y: 0 }))
    let mx = -9999, my = -9999, raf = 0, active = true
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY }
    const leave = () => { mx = -9999; my = -9999 }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    const vis = new IntersectionObserver(([e]) => { active = e.isIntersecting }, { threshold: 0 })
    vis.observe(el)
    const R = Math.min(380, window.innerWidth * 0.3)
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!active) return
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect()
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2
        const d = Math.hypot(mx - cx, my - cy)
        const f = Math.pow(Math.max(0, 1 - d / R), 2)
        const t = { s: 1 + 0.2 * f, x: (mx - cx) * 0.22 * f, y: (my - cy) * 0.22 * f }
        const c = st[i]
        c.s += (t.s - c.s) * 0.12; c.x += (t.x - c.x) * 0.12; c.y += (t.y - c.y) * 0.12
        inner[i].style.transform = `translate3d(${c.x.toFixed(2)}px,${c.y.toFixed(2)}px,0) scale(${c.s.toFixed(3)})`
        inner[i].classList.toggle('is-hot', f > 0.35)
      })
    }
    loop()
    // background parallax
    const bx = gsap.quickTo(bg.current, 'x', { duration: 1.2, ease: 'power3' })
    const by = gsap.quickTo(bg.current, 'y', { duration: 1.2, ease: 'power3' })
    const pm = (e: PointerEvent) => {
      bx((e.clientX / window.innerWidth - 0.5) * -34)
      by((e.clientY / window.innerHeight - 0.5) * -22)
    }
    window.addEventListener('pointermove', pm, { passive: true })
    return () => {
      cancelAnimationFrame(raf); vis.disconnect()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointermove', pm)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section id="top" className="hero" ref={root}>
      <div className="curtain" aria-hidden="true" />
      <div className="hero__bg" ref={bg} aria-hidden="true">
        <LoopVideo name="hero-loop" className="hero__video" />
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__top mono hero__fade">
        <span>18 YEARS OLD / AI &amp; DS ENGINEER / INDIA</span>
        <span className="hide-sm">PORTFOLIO — 2026</span>
      </div>

      <h1 className="name" ref={nameRef} aria-label="Daksh Masulkar">
        <Word text="DAKSH" />
        <Word text="MASULKAR" />
      </h1>

      <div className="hero__bottom">
        <div className="hero__fade">
          <p className="hero__sub">BUILDING TOMORROW.<br />ONE LINE AT A TIME.</p>
        </div>
        <p className="hero__intro hero__fade">
          An aspiring engineer exploring the intersection of artificial intelligence, technology, creativity, and human potential.
        </p>
        <button className="scroll hero__fade mono" data-magnetic onClick={() => goTo('portrait')} aria-label="Scroll down">
          <span className="scroll__line" /> SCROLL
        </button>
      </div>
    </section>
  )
}
