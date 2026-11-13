import{W as A,S as F,P as G,T as V,a as I,b as j,c as B,V as m,M as O,C as _}from"./three-DcLe6qZR.js";const q=`
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
}`,X=`
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
}`;function Z(E,n,u){let v;try{v=new A({canvas:E,antialias:!0,alpha:!0,powerPreference:"high-performance"})}catch{return null}v.setPixelRatio(Math.min(window.devicePixelRatio,2)),v.setClearColor(0,0);const g=new F,a=new G(32,1,.1,50),w=new V,c=w.load("/media/portrait.webp",()=>{s=!0}),y=w.load("/media/depth.png",()=>{s=!0});c.colorSpace=I,c.anisotropy=4;const h=2.2,M=h*(900/1600),b=new j(M,h,96,160),r={uTex:{value:c},uDepth:{value:y},uMouse:{value:new m},uHoverPt:{value:new m(.5,.5)},uHover:{value:0},uReveal:{value:u?1:0},uTime:{value:0},uDisp:{value:.2}},P=new B({vertexShader:q,fragmentShader:X,uniforms:r}),f=new O(b,P);g.add(f);let D=u?1:0;const i=new m,p=new m;let d=0,s=!0,x=!0,H=0,R=5;const T=()=>{const e=n.clientWidth,o=n.clientHeight;if(!e||!o)return;v.setSize(e,o,!1),a.aspect=e/o;const t=a.fov*Math.PI/180,l=h*1.08,W=M*1.12/a.aspect;R=Math.max(l,W)/2/Math.tan(t/2),a.updateProjectionMatrix(),s=!0},S=new ResizeObserver(T);S.observe(n),T();const U=e=>{const o=n.getBoundingClientRect(),t=(e.clientX-o.left)/o.width,l=(e.clientY-o.top)/o.height;p.set((t-.5)*2,-(l-.5)*2),r.uHoverPt.value.set(t,1-l),d=t>=0&&t<=1&&l>=0&&l<=1?1:0,s=!0},C=()=>{p.set(0,0),d=0,s=!0};u||(window.addEventListener("pointermove",U,{passive:!0}),n.addEventListener("pointerleave",C));const L=new IntersectionObserver(([e])=>{x=e.isIntersecting,x&&(s=!0)},{threshold:0});L.observe(n);const k=new _,z=()=>{if(H=requestAnimationFrame(z),!x)return;const e=k.getElapsedTime();i.lerp(p,.06),r.uHover.value+=(d-r.uHover.value)*.08;const o=i.distanceTo(p)>.001||Math.abs(d-r.uHover.value)>.001;if(!s&&!o&&!(r.uHover.value>.01))return;s=!1,r.uTime.value=e,r.uMouse.value.copy(i);const t=D;a.position.set(i.x*.16+(t-.5)*.28,i.y*.08+(.5-t)*.12,R*(1.16-.16*t)),a.lookAt(0,0,0),f.rotation.y=i.x*.1+(t-.5)*.12,f.rotation.x=-i.y*.05,v.render(g,a)};return z(),{setProgress(e){D=e,r.uReveal.value=u?1:Math.min(1,Math.max(0,(e-.02)/.55)),s=!0},destroy(){cancelAnimationFrame(H),S.disconnect(),L.disconnect(),window.removeEventListener("pointermove",U),n.removeEventListener("pointerleave",C),b.dispose(),P.dispose(),c.dispose(),y.dispose(),v.dispose()}}}export{Z as createPortraitScene};
