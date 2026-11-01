// GLSL for the Aquarius scene. Colours are raw sRGB (hex / 255) and every layer outputs
// premultiplied alpha, so the transparent canvas shows exactly the SVG fallback's hex values.
// No tonemapping/colorspace chunks are included on purpose.

const COLORS = /* glsl */ `
const vec3 VIOLET = vec3(0.6549, 0.5451, 0.9804);  // #a78bfa
const vec3 DEEP   = vec3(0.5451, 0.3608, 0.9647);  // #8b5cf6
const vec3 PALE   = vec3(0.7686, 0.7098, 0.9922);  // #c4b5fd
const vec3 WHITE  = vec3(0.9255, 0.9216, 0.9569);  // #ecebf4
`;

// --- Constellation lines: draw-in with a pen tip and a faint ghost ---------------------
export const lineVertex = /* glsl */ `
attribute float aProgress;
attribute float aDelay;
attribute float aDuration;
varying float vProgress;
varying float vDelay;
varying float vDuration;
void main() {
  vProgress = aProgress;
  vDelay = aDelay;
  vDuration = aDuration;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const lineFragment = /* glsl */ `
${COLORS}
uniform float uTime;
uniform float uPenSpeed;
uniform float uHeroDim;
varying float vProgress;
varying float vDelay;
varying float vDuration;
void main() {
  float started = step(vDelay, uTime);
  float reveal = clamp((uTime - vDelay) / vDuration, 0.0, 1.0) * started;
  bool drawn = started > 0.5 && vProgress <= reveal;
  float behind = max(reveal - vProgress, 0.0) * vDuration * uPenSpeed; // scene units behind the pen
  float tipFade = started * (1.0 - clamp((uTime - vDelay - vDuration) / 0.35, 0.0, 1.0));
  float tip = drawn ? exp(-behind * 9.0) * tipFade : 0.0;
  vec3 col = mix(VIOLET, PALE, tip);
  col = mix(col, WHITE, tip * 0.5);
  float along = vProgress * vDuration * uPenSpeed; // scene units from the edge start
  float dash = step(0.5, fract(along / 0.055));
  float alpha = (drawn ? mix(0.55 * dash, 0.95, tip) : 0.05 * dash) * uHeroDim;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

// --- Stars: round core + soft halo, ignite flash, bright-star breathing -----------------
export const starVertex = /* glsl */ `
attribute float aSize;      // world units, including halo
attribute vec3 aColor;
attribute float aIgnite;
attribute float aBright;
uniform float uTime;
uniform float uScale;
varying vec3 vColor;
varying float vAlpha;
varying float vFlash;
varying float vCore;
varying float vHalo;
void main() {
  float age = uTime - aIgnite;
  float lit = smoothstep(0.0, 0.06, age);
  float pop = lit * exp(-max(age, 0.0) / 0.2) * 0.8;   // ~1.6x overshoot easing out in ~0.6 s
  float breath = aBright * 0.06 * sin(uTime * 0.8 + aIgnite * 9.0) * lit;
  float size = aSize * (mix(0.7, 1.0, lit) + pop + breath);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = size * uScale;
  vColor = aColor;
  vAlpha = mix(0.2, 1.0, lit);
  vFlash = pop;
  vCore = mix(0.36, 0.34, aBright);
  vHalo = mix(0.38, 0.55, aBright) * (1.0 + pop * 1.5);
}
`;

export const starFragment = /* glsl */ `
${COLORS}
uniform float uHeroDim;
varying vec3 vColor;
varying float vAlpha;
varying float vFlash;
varying float vCore;
varying float vHalo;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float core = 1.0 - smoothstep(vCore - 0.07, vCore + 0.07, d);
  float halo = exp(-d * d * 5.0) * vHalo * (1.0 - smoothstep(0.8, 1.0, d));
  float a = clamp(core + halo, 0.0, 1.0) * vAlpha * uHeroDim;
  vec3 col = mix(vColor, WHITE, clamp(vFlash * 1.2, 0.0, 1.0));
  gl_FragColor = vec4(col * a, a);
}
`;

// --- Energy pulses: comets travelling outward along edges -------------------------------
export const TRAIL_POINTS = 16;
export const TRAIL_STEP = 0.022; // scene units between trail points (tight enough to overlap into a smooth tail)

export const pulseVertex = /* glsl */ `
attribute vec3 aEnd;
attribute float aPhase;
attribute float aSpeed;       // cycles per second
attribute float aTravel;      // seconds spent travelling (rest of the cycle is idle)
attribute float aTrailIndex;  // 0 = head
uniform float uTime;
uniform float uScale;
uniform float uHeroDim;
uniform float uFade;
varying float vAlpha;
varying float vTrail;
void main() {
  vec3 start = position;
  float len = length(aEnd - start);
  float inCycle = fract(uTime * aSpeed + aPhase) / aSpeed;
  float hMax = 1.0 + ${(TRAIL_POINTS * TRAIL_STEP).toFixed(3)} / len;
  float h = inCycle / aTravel * hMax - aTrailIndex * ${TRAIL_STEP.toFixed(3)} / len;
  float tr = 1.0 - aTrailIndex / ${TRAIL_POINTS.toFixed(1)};
  float inRange = step(0.0, h) * step(h, 1.0);
  float edgeFade = smoothstep(0.0, 0.1, h) * (1.0 - smoothstep(0.9, 1.0, h));
  float alpha = inRange * edgeFade * pow(tr, 1.9) * uFade * 0.8 * uHeroDim;
  vAlpha = alpha;
  vTrail = tr;
  vec4 mv = modelViewMatrix * vec4(mix(start, aEnd, clamp(h, 0.0, 1.0)), 1.0);
  gl_Position = alpha > 0.001 ? projectionMatrix * mv : vec4(2.0, 2.0, 2.0, 1.0); // cull idle points
  gl_PointSize = mix(0.034, 0.07, tr) * uScale;
}
`;

export const pulseFragment = /* glsl */ `
${COLORS}
varying float vAlpha;
varying float vTrail;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = exp(-d * d * 3.2) * (1.0 - smoothstep(0.85, 1.0, d)) * vAlpha;
  vec3 col = mix(VIOLET, PALE, vTrail * vTrail);
  col = mix(col, WHITE, smoothstep(0.85, 1.0, vTrail) * 0.7);
  gl_FragColor = vec4(col * a, a);
}
`;

// --- Dust field: faint drifting specks in depth ------------------------------------------
export const starfieldVertex = /* glsl */ `
attribute float aSeed;
attribute float aSize;
uniform float uTime;
uniform float uDpr;
uniform float uHeroDim;
varying float vAlpha;
varying float vTint;
void main() {
  vec3 p = position;
  p.y = -4.0 + mod(position.y + 4.0 + uTime * (0.02 + aSeed * 0.05), 7.5);
  p.x += sin(uTime * 0.07 + aSeed * 40.0) * 0.06;
  float edge = smoothstep(-4.0, -3.2, p.y) * (1.0 - smoothstep(2.7, 3.5, p.y));
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 70.0);
  vAlpha = (0.05 + aSeed * 0.2) * twinkle * edge * uHeroDim;
  vTint = aSeed;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * uDpr;
}
`;

export const starfieldFragment = /* glsl */ `
${COLORS}
varying float vAlpha;
varying float vTint;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = (1.0 - smoothstep(0.3, 1.0, d)) * vAlpha;
  vec3 col = mix(PALE, WHITE, vTint);
  gl_FragColor = vec4(col * a, a);
}
`;
