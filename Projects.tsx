import { useEffect, useRef } from 'react'
import { PROJECTS } from '../data'
import { gsap } from '../gsapSetup'

function Preview({ kind }: { kind: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent) => {
    const el = ref.current!, r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, { rotateY: x * 14, rotateX: -y * 12, duration: 0.6, ease: 'power3.out' })
  }
  const leave = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'power3.out' })
  return (
    <div className="pv" onPointerMove={move} onPointerLeave={leave}>
      <div className={`pv__stage pv--${kind}`} ref={ref} aria-hidden="true">
        {kind === 'study' && (<>
          <div className="pv__win a"><i /><i /><i /><b /><b /><b className="s" /></div>
          <div className="pv__phone"><b /><b className="s" /><b /><b className="r" /></div>
        </>)}
        {kind === 'voice' && (
          <div className="pv__wave">{Array.from({ length: 21 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.13}s` }} />)}</div>
        )}
        {kind === 'college' && (
          <div className="pv__mods">{['ACCESS', 'RECORDS', 'NOTICES', 'TIMETABLE', 'SECURITY', 'SUPPORT'].map((m) => <span key={m}>{m}</span>)}</div>
        )}
      </div>
      <p className="pv__cap mono">CONCEPT PREVIEW — NOT A LIVE DEMO</p>
    </div>
  )
}

const Placeholder = ({ label }: { label: string }) => (
  <span className="btn btn--ghost is-disabled" aria-disabled="true" title="Placeholder — link coming soon">{label} <em>SOON</em></span>
)

export default function Projects() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const t = track.current!
        const dist = () => t.scrollWidth - window.innerWidth + window.innerWidth * 0.08
        gsap.to(t, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: root.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8,
            invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (s) => {
              const i = Math.min(PROJECTS.length - 1, Math.round(s.progress * (PROJECTS.length - 1)))
              const c = root.current?.querySelector('.projects__count b')
              if (c) c.textContent = String(i + 1).padStart(2, '0')
            },
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" className="projects" ref={root}>
      <div className="projects__head">
        <p className="label"><i />PROJECTS</p>
        <h2 className="h2">THINGS I'M<br /><span className="outline">BUILDING.</span></h2>
        <p className="projects__count mono hide-sm"><b>01</b> / {String(PROJECTS.length).padStart(2, '0')} <span>SCROLL →</span></p>
      </div>
      <div className="projects__track" ref={track}>
        {PROJECTS.map((p) => (
          <article className="card" key={p.n} data-cursor="EXPLORE">
            <div className="card__info">
              <p className="card__n mono">{p.n} <span>/ {String(PROJECTS.length).padStart(2, '0')}</span></p>
              <h3 className="card__title">{p.title}</h3>
              <p className="card__desc">{p.desc}</p>
              <ul className="chips" aria-label="Technologies">{p.tech.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
              <p className="card__status mono"><i />STATUS — {p.status}</p>
              <div className="card__links"><Placeholder label="GITHUB" /><Placeholder label="LIVE DEMO" /></div>
            </div>
            <Preview kind={p.kind} />
          </article>
        ))}
      </div>
    </section>
  )
}
