import * as THREE from 'three'

const VERT = /* glsl */ `
uniform sampler2D uDepth;
uniform float uDisp;
varying vec2 vUv;
void main(){
  vUv = uv;
  float d = texture2D(uDepth, uv).r;
  vec3 p = position;
  float e = smoothstep(0.0, 0.09, uv.x) * smoothstep(0.0, 0.09, 1.0 - uv.x) * smoothstep(0.0, 0.07, uv.y) * smoothstep(0.0, 0.07, 1.0 - uv.y);
  p.z += (d - 0.5) * uDisp * e;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uDepth;
uniform vec2 uMouse;
uniform vec2 uHoverPt;
uniform float uHover;
uniform float uReveal;
uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 uv = vUv;
  float d = texture2D(uDepth, uv).r;
  // layered parallax: nearer pixels shift more with the pointer
  float e = smoothstep(0.0, 0.1, vUv.x) * smoothstep(0.0, 0.1, 1.0 - vUv.x) * smoothstep(0.0, 0.08, vUv.y) * smoothstep(0.0, 0.08, 1.0 - vUv.y);
  uv += uMouse * (d - 0.45) * 0.03 * e;
  // localised ripple distortion where the pointer hovers
  vec2 dv = (uv - uHoverPt) * vec2(0.5625, 1.0);
  float dist = length(dv);
  uv += normalize(dv + 1e-5) * sin(dist * 70.0 - uTime * 3.0) * 0.006 * uHover * smoothstep(0.28, 0.0, dist);
  vec3 c = texture2D(uTex, clamp(uv, 0.001, 0.999)).rgb;
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(l), c, 0.55);
  c = (c - 0.5) * 1.1 + 0.5;
  // far pixels pick up a faint red cast (depth-based lighting)
  c.r += (1.0 - d) * 0.025;
  c.gb *= 1.0 - (1.0 - d) * 0.04;
  // reveal: hard-edged horizontal shutters open as you scroll (no soft gradients)
  float bands = 28.0;
  float row = floor(vUv.y * bands);
  float thr = fract(sin(row * 91.7) * 43758.5453);
  float lit = step(thr, uReveal * 1.25 - 0.1);
  float bright = mix(0.32, 1.0, smoothstep(0.0, 1.0, uReveal));
  c *= mix(0.05, 1.0, lit) * bright;
  gl_FragColor = vec4(c, 1.0);
}`

export interface PortraitScene {
  setProgress: (p: number) => void
  destroy: () => void
}

export function createPortraitScene(canvas: HTMLCanvasElement, wrap: HTMLElement, reduced: boolean): PortraitScene | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  const loader = new THREE.TextureLoader()
  const tex = loader.load('/media/portrait.webp', () => { dirty = true })
  const depth = loader.load('/media/depth.png', () => { dirty = true })
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4

  const H = 2.2
  const W = H * (900 / 1600)
  const geo = new THREE.PlaneGeometry(W, H, 96, 160)
  const uniforms = {
    uTex: { value: tex }, uDepth: { value: depth },
    uMouse: { value: new THREE.Vector2() }, uHoverPt: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 }, uReveal: { value: reduced ? 1 : 0 }, uTime: { value: 0 }, uDisp: { value: 0.2 },
  }
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms })
  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)

  let progress = reduced ? 1 : 0
  const mouse = new THREE.Vector2()
  const mouseT = new THREE.Vector2()
  let hoverT = 0
  let dirty = true
  let visible = true
  let raf = 0
  let baseZ = 5

  const resize = () => {
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    const fovR = (camera.fov * Math.PI) / 180
    const needH = H * 1.08
    const needW = (W * 1.12) / camera.aspect
    baseZ = Math.max(needH, needW) / 2 / Math.tan(fovR / 2)
    camera.updateProjectionMatrix()
    dirty = true
  }
  const ro = new ResizeObserver(resize)
  ro.observe(wrap)
  resize()

  const onMove = (e: PointerEvent) => {
    const r = wrap.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height
    mouseT.set((nx - 0.5) * 2, -(ny - 0.5) * 2)
    uniforms.uHoverPt.value.set(nx, 1 - ny)
    hoverT = nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1 ? 1 : 0
    dirty = true
  }
  const onLeave = () => { mouseT.set(0, 0); hoverT = 0; dirty = true }
  if (!reduced) {
    window.addEventListener('pointermove', onMove, { passive: true })
    wrap.addEventListener('pointerleave', onLeave)
  }

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) dirty = true }, { threshold: 0 })
  io.observe(wrap)

  const clock = new THREE.Clock()
  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    const t = clock.getElapsedTime()
    mouse.lerp(mouseT, 0.06)
    uniforms.uHover.value += (hoverT - uniforms.uHover.value) * 0.08
    const moving = mouse.distanceTo(mouseT) > 0.001 || Math.abs(hoverT - uniforms.uHover.value) > 0.001
    if (!dirty && !moving && !(uniforms.uHover.value > 0.01)) return
    dirty = false
    uniforms.uTime.value = t
    uniforms.uMouse.value.copy(mouse)
    const p = progress
    // slow cinematic dolly + orbit with scroll, pointer adds a little parallax
    camera.position.set(mouse.x * 0.16 + (p - 0.5) * 0.28, mouse.y * 0.08 + (0.5 - p) * 0.12, baseZ * (1.16 - 0.16 * p))
    camera.lookAt(0, 0, 0)
    mesh.rotation.y = mouse.x * 0.1 + (p - 0.5) * 0.12
    mesh.rotation.x = -mouse.y * 0.05
    renderer.render(scene, camera)
  }
  tick()

  return {
    setProgress(p: number) {
      progress = p
      uniforms.uReveal.value = reduced ? 1 : Math.min(1, Math.max(0, (p - 0.02) / 0.55))
      dirty = true
    },
    destroy() {
      cancelAnimationFrame(raf)
      ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      geo.dispose(); mat.dispose(); tex.dispose(); depth.dispose(); renderer.dispose()
    },
  }
}
