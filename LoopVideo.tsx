import { useEffect, useRef } from 'react'
import { prefersReduced } from '../gsapSetup'

/** Muted, looping, lazily-loaded background video with poster + dark fallback. */
export default function LoopVideo({ name, className = '' }: { name: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    let loaded = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!loaded) {
            loaded = true
            v.innerHTML = `<source src="/media/${name}.webm" type="video/webm"><source src="/media/${name}.mp4" type="video/mp4">`
            v.load()
          }
          if (!prefersReduced()) v.play().catch(() => {})
        } else v.pause()
      },
      { rootMargin: '300px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [name])

  return (
    <video
      ref={ref}
      className={`loopvideo ${className}`}
      muted loop playsInline preload="none"
      poster={`/media/${name}-poster.jpg`}
      aria-hidden="true" tabIndex={-1} disablePictureInPicture
    />
  )
}
