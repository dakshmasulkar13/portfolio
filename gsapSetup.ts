import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const scroller: { lenis: Lenis | null } = { lenis: null }
export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isCoarse = () => window.matchMedia('(pointer: coarse)').matches

export function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (scroller.lenis) scroller.lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
}

/** Wrap each rendered line of an element in a masked span. Returns the inner spans. */
export function splitLines(el: HTMLElement): HTMLElement[] {
  const text = el.dataset.text ?? el.textContent ?? ''
  el.dataset.text = text
  el.innerHTML = text.split(/\s+/).filter(Boolean).map((w) => `<span class="w">${w}</span>`).join(' ')
  const words = Array.from(el.querySelectorAll<HTMLElement>('.w'))
  const lines: string[][] = []
  let top = -1
  words.forEach((w) => {
    if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop }
    lines[lines.length - 1].push(w.textContent ?? '')
  })
  el.innerHTML = lines.map((l) => `<span class="line"><span class="line__in">${l.join(' ')}</span></span>`).join('')
  return Array.from(el.querySelectorAll<HTMLElement>('.line__in'))
}

export { gsap, ScrollTrigger }
