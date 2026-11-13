import { useEffect, useRef, useState } from 'react'
import { CONTACT } from '../data'
import { gsap, prefersReduced } from '../gsapSetup'
import LoopVideo from './LoopVideo'

function Out({ href, label, placeholder }: { href: string; label: string; placeholder: string }) {
  return href ? (
    <a className="btn" href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" data-magnetic>{label}</a>
  ) : (
    <span className="btn is-disabled" aria-disabled="true" title={`Placeholder — set ${placeholder} in src/data.ts`}>{label} <em>PLACEHOLDER</em></span>
  )
}

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReduced()) return
      gsap.from('.cta__line', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.cta', start: 'top 80%' } })
      gsap.from('.contact__fade', { opacity: 0, y: 24, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.contact__fade', start: 'top 92%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (!CONTACT.email) { setMsg('Email is not configured yet — add it in src/data.ts to enable the form.'); return }
    const subject = encodeURIComponent(`Portfolio message from ${f.get('name')}`)
    const body = encodeURIComponent(`${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`)
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
    setMsg('Opening your email app…')
  }

  return (
    <section id="contact" className="contact" ref={root}>
      <LoopVideo name="contact-loop" className="contact__video" />
      <div className="contact__shade" aria-hidden="true" />
      <div className="wrap contact__in">
        <p className="label"><i />CONTACT</p>
        <h2 className="cta" aria-label="Let's build something that matters.">
          {["LET'S BUILD", 'SOMETHING', 'THAT MATTERS.'].map((l, i) => (
            <span className="cta__mask" key={l} aria-hidden="true"><span className={`cta__line ${i === 2 ? 'red' : ''}`}>{l}</span></span>
          ))}
        </h2>
        <p className="contact__sub contact__fade">Always open to meaningful collaborations, ambitious ideas, learning opportunities, and conversations about technology.</p>

        <div className="contact__btns contact__fade">
          <Out href={CONTACT.email ? `mailto:${CONTACT.email}` : ''} label="EMAIL" placeholder="CONTACT.email" />
          <Out href={CONTACT.linkedin} label="LINKEDIN" placeholder="CONTACT.linkedin" />
          <Out href={CONTACT.github} label="GITHUB" placeholder="CONTACT.github" />
          {CONTACT.resume ? (
            <a className="btn btn--solid" href={CONTACT.resume} download data-magnetic>RESUME ↓</a>
          ) : (
            <span className="btn is-disabled" aria-disabled="true" title="Placeholder — set CONTACT.resume in src/data.ts">RESUME ↓ <em>PLACEHOLDER</em></span>
          )}
          <button className="btn btn--solid" type="button" data-magnetic aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'CLOSE' : 'CONTACT'}
          </button>
        </div>

        <form className={`form ${open ? 'is-open' : ''}`} onSubmit={submit} aria-hidden={!open}>
          <div className="form__in">
            <label><span className="mono">NAME</span><input name="name" required tabIndex={open ? 0 : -1} autoComplete="name" /></label>
            <label><span className="mono">YOUR EMAIL</span><input name="email" type="email" required tabIndex={open ? 0 : -1} autoComplete="email" /></label>
            <label className="full"><span className="mono">MESSAGE</span><textarea name="message" rows={4} required tabIndex={open ? 0 : -1} /></label>
            <button className="btn btn--solid" type="submit" tabIndex={open ? 0 : -1}>SEND MESSAGE →</button>
            <p className="mono form__msg" role="status">{msg}</p>
          </div>
        </form>

        <footer className="footer mono">
          <span>DAKSH MASULKAR © 2026</span>
          <span>DESIGNED WITH INTENTION. BUILT FOR WHAT'S NEXT.</span>
        </footer>
      </div>
    </section>
  )
}
