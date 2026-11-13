# Daksh Masulkar — The Digital Identity

React + Vite + TypeScript · GSAP/ScrollTrigger · Three.js (2.5D depth portrait) · Lenis smooth scroll.

## Run
```bash
npm install
npm run dev        # local dev
npm run build      # production build -> dist/
```

## Deploy to Vercel
Push to GitHub and import the repo in Vercel (framework: Vite, defaults work), or run `npx vercel`.

## Fill in your details — `src/data.ts`
`CONTACT.email / linkedin / github / resume` are empty placeholders and render as clearly-labelled
disabled buttons until set. Put your resume PDF in `/public` and set `resume: '/resume.pdf'`.
Project tech tags are placeholders — edit to match what you actually use.

## Media (`public/media`)
- `portrait.jpg/.webp` — your original photo (unaltered).
- `depth.png` — an *approximated* depth map (colour/position heuristics, not an ML depth estimate).
  For a more accurate 3D feel, replace it with a map from a depth model (e.g. Depth Anything) — same filename, same size.
- `hero-loop` / `contact-loop` (.mp4/.webm) — procedurally rendered seamless loops. Swap in your own footage with the same names.
