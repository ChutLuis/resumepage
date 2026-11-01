// Hebe as a luminous point cloud. Positions are statue-root space (height ~1, base at y = 0).
export const statuePointVertex = /* glsl */ `
attribute vec3 aNormal;
attribute float aSeed;
attribute vec3 aScatter;
attribute float aSize;

uniform float uTime;
uniform float uSettled;
uniform float uHeroDim;
uniform float uAssembleStart;
uniform float uAssembleDuration;
uniform float uScrollDissolve;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uAspect;
uniform float uDpr;

varying vec3 vColor;
varying float vAlpha;

const vec3 WHITE = vec3(0.9255, 0.9216, 0.9569);  // #ecebf4
const vec3 PALE = vec3(0.7686, 0.7098, 0.9922);   // #c4b5fd
const vec3 DEEP = vec3(0.5451, 0.3608, 0.9647);   // #8b5cf6

float hash11(float n) { return fract(sin(n * 127.1) * 43758.5453); }

void main() {
  float y = position.y;

  // 1. Assembly: particles fly in from scattered stardust, base first.
  float startAt = uAssembleStart + y * uAssembleDuration * 0.5 + aSeed * uAssembleDuration * 0.35;
  float arrive = uSettled > 0.5 ? 1.0 : clamp((uTime - startAt) / (uAssembleDuration * 0.5), 0.0, 1.0);
  float ease = 1.0 - pow(1.0 - arrive, 3.0);
  vec3 p = position;
  p += aScatter * (1.0 - ease);

  // 2. The base turns into drifting dust.
  float dust = 1.0 - smoothstep(0.12, 0.42, y);
  float loose = step(aSeed, dust * 0.85);
  float fall = fract(uTime * (0.05 + aSeed * 0.06) + aSeed * 13.0);
  if (uSettled > 0.5) fall = aSeed;
  p += loose * vec3((hash11(aSeed * 31.0) - 0.5) * 0.1, -fall * 0.22, (hash11(aSeed * 17.0) - 0.5) * 0.05);

  // 3. Scrolling away blows the statue into stardust.
  float threshold = aSeed * 0.75 + (1.0 - y) * 0.25;
  float blown = smoothstep(threshold, threshold + 0.2, uScrollDissolve);
  p += (normalize(aScatter + vec3(0.0001)) * 0.35 + vec3(0.12, -0.18, 0.0)) * blown;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec3 viewDir = normalize(-mv.xyz);
  mv.xyz += viewDir * 0.025; // nudge toward the camera so front particles clear the occluder
  vec4 clip = projectionMatrix * mv;

  // 4. The pointer gently parts the particles.
  vec2 ndc = clip.xy / clip.w;
  vec2 delta = (ndc - uPointer) * vec2(uAspect, 1.0);
  float dist = length(delta);
  float push = uPointerStrength * exp(-dist * dist / 0.02) * 0.06;
  vec2 dir = dist > 0.0001 ? delta / dist : vec2(0.0);
  ndc += dir * push / vec2(uAspect, 1.0);
  clip.xy = ndc * clip.w;

  // Sculptural light, independent of the mesh's normal orientation.
  vec3 key = normalize(vec3(-0.8, 0.55, 0.25));
  vec3 n = normalize(normalMatrix * aNormal);
  float facing = dot(n, viewDir);
  n *= facing < 0.0 ? -1.0 : 1.0;
  facing = abs(facing);
  float diffuse = max(dot(n, key), 0.0);
  float rim = pow(1.0 - facing, 2.2);
  float light = 0.06 + pow(diffuse, 1.3) * 0.94;
  float scanY = fract(uTime * 0.09) * 1.4 - 0.2;
  float scanD = (y - scanY) / 0.035;
  float scan = exp(-scanD * scanD) * 0.6 * (1.0 - uSettled);
  vec3 color = mix(DEEP, PALE, smoothstep(0.1, 0.55, light));
  color = mix(color, WHITE, smoothstep(0.5, 0.95, light));
  color = mix(color, PALE, rim * 0.5);
  float alpha = light * 0.72 + rim * 0.35 + scan;
  alpha *= 0.9 + 0.1 * sin(uTime * (0.8 + aSeed * 2.2) + aSeed * 60.0);
  alpha *= mix(0.3, 1.0, ease);
  alpha *= mix(1.0 - dust * 0.75, (1.0 - fall) * 0.8, loose);
  alpha *= 0.25 + 0.75 * smoothstep(0.04, 0.24, y); // the plinth fades away
  alpha *= 1.0 - blown * 0.95;
  alpha *= uHeroDim;

  vColor = color;
  vAlpha = alpha;
  gl_Position = clip;
  gl_PointSize = aSize * uDpr * (1.0 + (1.0 - ease) * 0.8 + push * 8.0);
}
`;

// Invisible depth-only copy of the mesh so back-facing particles stay hidden.
export const statueOccluderVertex = /* glsl */ `
uniform mat4 uObjectTransform;
varying float vObjectY;
void main() {
  vObjectY = (uObjectTransform * vec4(position, 1.0)).y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const statueOccluderFragment = /* glsl */ `
uniform float uTime;
uniform float uSettled;
uniform float uReadyAt;
uniform float uScrollDissolve;
varying float vObjectY;
void main() {
  if (vObjectY < 0.3) discard;
  if (uSettled < 0.5 && uTime < uReadyAt) discard;
  if (uScrollDissolve > 0.15) discard;
  gl_FragColor = vec4(0.0);
}
`;