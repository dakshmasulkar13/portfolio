import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, scroller, prefersReduced, isCoarse } from './gsapSetup'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Portrait from './components/Portrait'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Path from './components/Path'
import Contact from './components/Contact'

export default function App() {
  // smooth scroll wired into GSAP's ticker
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    scroller.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); scroller.lenis = null }
  }, [])

  // magnetic hover on [data-magnetic] elements
  useEffect(() => {
    if (isCoarse() || prefersReduced()) return
    const cleanups: Array<() => void> = []
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
      const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        qx((e.clientX - (r.left + r.width / 2)) * 0.28)
        qy((e.clientY - (r.top + r.height / 2)) * 0.35)
      }
      const leave = () => { qx(0); qy(0) }
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
      cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) })
    })
    return () => cleanups.forEach((c) => c())
  }, [])

  // recalc pinned sections once everything (fonts, images) has settled
  useEffect(() => {
    const r = () => ScrollTrigger.refresh()
    window.addEventListener('load', r)
    document.fonts.ready.then(r)
    return () => window.removeEventListener('load', r)
  }, [])

  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Portrait />
        <About />
        <Skills />
        <Projects />
        <Path />
      </main>
      <Contact />
    </>
  )
}
