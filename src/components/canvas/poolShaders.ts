export const poolVertex = /* glsl */ `
attribute float aKind;  // 0 surface, 1 rim, 2 splash, 3 reflected star, 4 reflected edge dot, 5 glint, 6 reflected streak
attribute vec2 aParam;  // surface/rim: (x across -1..1, depth/phase 0..1); splash: (angle 0..1, strength); reflection/streak: constellation position, -1..1 per axis
attribute float aSeed;  // reflection: draw order 0..1; streak: dot index + draw order; otherwise random
attribute float aSize;

uniform float uTime;
uniform float uScrollY;
uniform float uWpp;
uniform float uDpr;
uniform vec2 uViewport;
uniform vec2 uCenter;
uniform vec2 uRadii;
uniform vec2 uImpact;      // lake-local (-1..1) position where the stream lands
uniform vec4 uReflect;     // xy: lake-local centre of the reflection, zw: lake-local half extents
uniform vec4 uCalm;        // lake-local rect (left, top, right, bottom) kept calm for content
uniform vec4 uCalm2;       // second calm rect (the footer)
uniform float uImpactSpread; // half-width of the falling sheet, in lake-local x units
uniform float uFill;
uniform float uFillStart;
uniform float uSettled;
uniform float uIsMobile;
uniform float uCalmStrength;

varying vec3 vColor;
varying float vAlpha;

const float TAU = 6.28318530718;
const vec3 WHITE = vec3(0.9255, 0.9216, 0.9569);  // #ecebf4
const vec3 PALE = vec3(0.7686, 0.7098, 0.9922);   // #c4b5fd
const vec3 DEEP = vec3(0.5451, 0.3608, 0.9647);   // #8b5cf6
const float RING_PERIOD = 2.2;
const float RING_SPEED = 0.42;
const float RING_WIDTH = 0.035;
// The lake is a wide, shallow rectangle read as water seen from above and in
// front. Ripples and the plunge pool are therefore flattened vertically: they
// spread ACROSS the surface instead of reading as circles squashed by aspect.
const float RING_PERSPECTIVE = 3.2;
const float RING_REACH = 1.1;
const float CALM_SOFT = 0.06;
const float STREAK_DOTS = 7.0;
const float STREAK_STEP_PX = 7.0;

float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }

// 1 inside the lake-local rectangle, 0 outside, soft edges.
float rectMask(vec2 p, vec4 r, float soft) {
  if (r.z <= r.x || r.w <= r.y) return 0.0;
  vec2 lo = smoothstep(r.xy - soft, r.xy + soft, p);
  vec2 hi = 1.0 - smoothstep(r.zw - soft, r.zw + soft, p);
  return lo.x * lo.y * hi.x * hi.y;
}

// Height of the travelling ripple rings at lake-local distance d from the impact.
float ripple(float d, float t, float reach) {
  float h = 0.0;
  float base = mod(t, RING_PERIOD);
  for (int i = 0; i < 3; i++) {
    float ringR = (base + float(i) * RING_PERIOD) * RING_SPEED;
    float x = (d - ringR) / RING_WIDTH;
    float amp = mix(1.0, 0.25, clamp(ringR / reach, 0.0, 1.0)) * (1.0 - smoothstep(reach * 0.85, reach, ringR));
    h += exp(-x * x) * amp;
  }
  float since = t - uFillStart;
  float shockR = max(since, 0.0) * 0.45;
  float sx = (d - shockR) / (RING_WIDTH * 1.6);
  h += exp(-sx * sx) * 1.3 * (1.0 - smoothstep(reach * 0.8, reach, shockR)) * step(0.0, since);
  return h;
}

// Perspective-flattened distance from the impact, in x half-widths.
float surfaceDist(vec2 l) {
  vec2 dp = (l - uImpact) * uRadii;
  return length(vec2(dp.x, dp.y * RING_PERSPECTIVE)) / uRadii.x;
}

void main() {
  // Distance is measured in half-widths so the rectangular lake reads isotropically.
  float fillReach = length(vec2(1.0, 2.0 * uRadii.y / uRadii.x * RING_PERSPECTIVE));
  float fillR = smoothstep(0.0, 1.0, uFill) * fillReach * 1.05;
  float hasWater = step(0.0001, uFill);
  vec2 local = vec2(0.0);
  float lift = 0.0;
  float alpha = 0.0;
  vec3 color = DEEP;
  float size = aSize;

  if (aKind < 0.5) {
    // Surface: the bulk of the lake, read as one flat water plane — a dark base
    // that deepens downstream, horizontal shimmer streaks, ripple rings and a
    // plunging glow under the falling sheet.
    float flow = uSettled > 0.5 ? 0.0 : uTime * (0.006 + aSeed * 0.01);
    float yy = fract(aParam.y + flow);            // drifts downstream and wraps
    local = vec2(aParam.x + sin(uTime * 0.15 + aSeed * TAU) * 0.01, -1.0 + 2.0 * yy);
    float wrapFade = smoothstep(0.0, 0.03, yy) * (1.0 - smoothstep(0.97, 1.0, yy));
    float d = surfaceDist(local);
    float h = ripple(d, uTime, RING_REACH);
    float glow = 0.45 * exp(-d * d / 0.02);       // bright plunge pool under the cascade
    lift = h * 3.0;
    float depth = yy;
    float pxDepth = max((local.y + 1.0) * uRadii.y, 0.0);
    float streak = pow(
      0.5 + 0.5 * sin(TAU * pow(pxDepth / 14.0, 0.85) - uTime * 0.35 + sin(local.x * 6.0 + uTime * 0.4) * 0.5),
      8.0
    );
    float calmMask = max(rectMask(local, uCalm, CALM_SOFT), rectMask(local, uCalm2, CALM_SOFT));
    float calm = 1.0 - uCalmStrength * calmMask;
    float inside = 1.0 - smoothstep(fillR - 0.08, fillR, d);
    float fillEdge = exp(-pow((d - fillR) / 0.06, 2.0)) * (1.0 - uFill) * hasWater;
    alpha = (0.06 + 0.24 * depth * depth + streak * 0.3 * (0.3 + 0.7 * depth) + h * 0.55 + glow) * inside * wrapFade * calm + fillEdge * 0.35;
    alpha *= 0.8 + 0.2 * sin(uTime * 2.1 + aSeed * 40.0);
    alpha *= mix(1.0, 0.75, uIsMobile);
    color = mix(DEEP, PALE, clamp(h * 0.9 + streak * 0.65 + glow, 0.0, 1.0));
    color = mix(color, WHITE, clamp(h - 0.6, 0.0, 1.0));
    size *= (1.0 + h * 0.5) * mix(0.9, 1.25, depth);
  } else if (aKind < 1.5) {
    // Meniscus: a thin water line hugging the hairline, brightest where the
    // sheet lands and fading out well before the gutters.
    float x = aParam.x;
    local = vec2(x, -1.0);
    float d = surfaceDist(local);
    float h = ripple(d, uTime, RING_REACH);
    float near = exp(-x * x / 0.05);
    lift = -aParam.y * 3.0 + h * 2.0;              // a thin band just under the hairline
    float inside = 1.0 - smoothstep(fillR - 0.08, fillR, d);
    alpha = (0.06 + 0.6 * near + h * 0.5) * inside * hasWater;
    color = mix(PALE, WHITE, clamp(h + near * 0.5, 0.0, 1.0));
  } else if (aKind < 2.5) {
    // Splash: mist thrown up where the sheet lands, spanning the sheet's width.
    float life = 0.8 + aSeed * 0.6;
    float age = mod(uTime + aSeed * 7.31, life);
    float strength = aParam.y;
    float angle = aParam.x * TAU;
    vec2 origin = uImpact + vec2((hash11(aSeed * 91.0) - 0.5) * 2.0 * uImpactSpread, 0.0);
    local = origin + vec2(cos(angle), sin(angle) * 0.25) * (0.02 + strength * 0.08) * age;
    float v0 = 90.0 + strength * 200.0;
    lift = v0 * age - 0.5 * 520.0 * age * age;
    float airborne = step(0.0, lift);
    alpha = 0.75 * (1.0 - age / life) * airborne * hasWater * (1.0 - uSettled);
    color = mix(WHITE, PALE, aSeed);
    lift = max(lift, 0.0);
  } else if (aKind > 5.5) {
    // Reflected streak: a dot trailing each reflected star down the water.
    float j = floor(aSeed);
    float order = fract(aSeed);
    local = uReflect.xy + aParam * uReflect.zw;
    local.y += (j + 1.0) * STREAK_STEP_PX / uRadii.y;
    local.x += sin(local.y * 40.0 + uTime * 1.9 + j) * 0.004;
    float d = surfaceDist(local);
    float inside = 1.0 - smoothstep(fillR - 0.08, fillR, d);
    float reveal = smoothstep(0.5, 1.0, uFill);
    float drawn = step(order, smoothstep(0.55, 1.0, uFill) * 1.02);
    alpha = 0.5
      * pow(1.0 - j / STREAK_DOTS, 2.0)
      * (0.6 + 0.4 * sin(uTime * 3.1 + aSeed * 17.0 + j * 0.9))
      * inside * reveal * drawn;
    color = PALE;
  } else if (aKind > 4.5) {
    // Glints: sparse light catching the water surface, twinkling.
    float flow = uSettled > 0.5 ? 0.0 : uTime * (0.006 + aSeed * 0.01);
    float yy = fract(aParam.y + flow);
    local = vec2(aParam.x, -1.0 + 2.0 * yy);
    float wrapFade = smoothstep(0.0, 0.03, yy) * (1.0 - smoothstep(0.97, 1.0, yy));
    float d = surfaceDist(local);
    float inside = 1.0 - smoothstep(fillR - 0.08, fillR, d);
    float calmMask = max(rectMask(local, uCalm, CALM_SOFT), rectMask(local, uCalm2, CALM_SOFT));
    float twinkle = pow(max(0.0, sin(uTime * (0.6 + aSeed * 1.4) + aSeed * 91.0)), 24.0);
    if (uSettled > 0.5) twinkle = step(0.82, aSeed) * 0.6; // static sparkle for reduced motion
    alpha = 0.95 * twinkle * inside * wrapFade * mix(1.0, 0.15, calmMask) * mix(1.0, 0.8, uIsMobile);
    color = mix(WHITE, PALE, aSeed * 0.6);
  } else {
    local = uReflect.xy + aParam * uReflect.zw;
    float d = surfaceDist(local);
    float h = ripple(d, uTime, RING_REACH);
    local.x += sin(local.y * 40.0 + uTime * 1.9) * 0.004 + sin(uTime * 1.3 + aSeed * 9.0) * 0.0015;
    lift = h * 2.0;
    float reveal = smoothstep(0.5, 1.0, uFill);
    float drawn = step(aSeed, smoothstep(0.55, 1.0, uFill) * 1.02);
    float inside = 1.0 - smoothstep(fillR - 0.08, fillR, d);
    float shimmer = 0.68 + 0.32 * sin(uTime * 2.6 + aSeed * 23.0);
    if (aKind < 3.5) {
      alpha = (0.95 * inside * shimmer + h * 0.3) * reveal * drawn;
      color = WHITE;
    } else {
      alpha = (0.5 * inside * shimmer + h * 0.15) * reveal * drawn;
      color = PALE;
    }
  }

  vec2 doc = uCenter + local * uRadii - vec2(0.0, lift);
  float worldX = (doc.x - uViewport.x * 0.5) * uWpp;
  float worldY = -(doc.y - uScrollY - uViewport.y * 0.5) * uWpp;
  vColor = color;
  vAlpha = clamp(alpha, 0.0, 1.0);
  gl_Position = vAlpha > 0.002
    ? projectionMatrix * viewMatrix * vec4(worldX, worldY, 0.0, 1.0)
    : vec4(2.0, 2.0, 2.0, 1.0);
  gl_PointSize = size * uDpr;
}
`;