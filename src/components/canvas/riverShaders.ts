export const riverVertex = /* glsl */ `
attribute float aPhase;
attribute float aLateral;
attribute float aSpeed;
attribute float aSize;
attribute float aSeed;
attribute float aKind; // 0 body, 1 core filament, 2 spray

uniform sampler2D uPath;
uniform float uTime;
uniform float uScrollY;
uniform float uWpp;
uniform float uDpr;
uniform float uLength;
uniform float uHeroEnd;
uniform float uHeroBottom;
uniform float uIsMobile;
uniform float uFront;
uniform float uFallStart;
uniform vec2 uViewport;
uniform vec2 uPourOffset;

varying vec3 vColor;
varying float vAlpha;

const float SAMPLE_LAST = 511.0;
const float TAU = 6.28318530718;
const vec3 WHITE = vec3(0.9255, 0.9216, 0.9569);  // #ecebf4
const vec3 PALE = vec3(0.7686, 0.7098, 0.9922);   // #c4b5fd
const vec3 DEEP = vec3(0.5451, 0.3608, 0.9647);   // #8b5cf6

vec4 pathAt(float s) {
  float at = clamp(s, 0.0, 1.0) * SAMPLE_LAST;
  int index = int(min(floor(at), SAMPLE_LAST - 1.0));
  float t = at - float(index);
  vec4 a = texelFetch(uPath, ivec2(index, 0), 0);
  vec4 b = texelFetch(uPath, ivec2(index + 1, 0), 0);
  return mix(a, b, t);
}

void main() {
  float p = fract(aPhase + uTime * (60.0 * aSpeed) / max(uLength, 1.0));
  float s = p;
  if (uFallStart < 0.999 && p > uFallStart) {
    float span = 1.0 - uFallStart;
    float u = (p - uFallStart) / span;
    s = uFallStart + span * (0.55 * u + 0.45 * u * u); // gathers at the brink, accelerates as it falls
  }
  float fall = smoothstep(uFallStart, min(uFallStart + 0.02, 1.0), s) * step(uFallStart, 0.999);
  vec4 path = pathAt(s);
  vec2 center = path.xy;
  float travelled = s * uLength;
  float surge = pow(0.5 + 0.5 * sin((travelled - uTime * 220.0) * (TAU / 900.0)), 8.0);
  float halfWidth = path.z * (1.0 + surge * 0.18);
  float down = smoothstep(uHeroEnd, 1.0, s);

  float stepSize = 1.0 / SAMPLE_LAST;
  vec2 before = pathAt(max(s - stepSize, 0.0)).xy;
  vec2 after = pathAt(min(s + stepSize, 1.0)).xy;
  vec2 dir = after - before;
  float dirLength = length(dir);
  vec2 tangent = dirLength > 0.0001 ? dir / dirLength : vec2(0.0, 1.0);
  vec2 normal = vec2(-tangent.y, tangent.x);

  float isSpray = step(1.5, aKind);
  float isCore = step(0.5, aKind) * (1.0 - isSpray);
  float wobble = sin(aSeed * TAU + s * 52.0 - uTime * 0.55) * min(4.0, halfWidth * 0.16);
  float drift = sin(uTime * 0.8 + aSeed * TAU) * halfWidth * 0.25 * isSpray;
  vec2 doc = center + normal * (aLateral * (1.0 + isSpray * down * 0.6) * halfWidth + wobble * (1.0 - fall * 0.6) + drift);
  doc += uPourOffset * (1.0 - smoothstep(0.0, 150.0, travelled));
  float worldX = (doc.x - uViewport.x * 0.5) * uWpp;
  float worldY = -(doc.y - uScrollY - uViewport.y * 0.5) * uWpp;

  float visibleFront = uFront;
  float isVisible = step(s, visibleFront);
  float behindFront = max(visibleFront - s, 0.0);
  float softFront = smoothstep(0.0, 0.025, behindFront);
  float leading = exp(-abs(visibleFront - s) * uLength * 0.035) * 0.65;

  float heroFade = 1.0 - smoothstep(uHeroBottom - 120.0, uHeroBottom + 120.0, doc.y);
  float riverAlpha = mix(0.26, 0.5, down);
  float heroAlpha = mix(0.28, 0.46, smoothstep(0.0, max(uHeroEnd, 0.001), s));
  float alpha = mix(riverAlpha, heroAlpha, heroFade);
  float mobileDim = mix(0.3, 1.0, smoothstep(uHeroBottom - 120.0, uHeroBottom + 120.0, doc.y));
  alpha *= mix(1.0, mobileDim, uIsMobile);

  float glint = pow(max(0.0, sin(uTime * (1.1 + aSeed * 1.7) + aSeed * 83.0)), 48.0) * (1.0 - isSpray);
  float sprayFlicker = 0.4 + 0.6 * smoothstep(0.2, 1.0, 0.5 + 0.5 * sin(uTime * 1.3 + aSeed * 50.0));
  float kindAlpha = mix(1.0, 1.6, isCore) * mix(1.0, 0.5 * sprayFlicker, isSpray);
  alpha *= kindAlpha * (1.0 + surge * 0.9) + glint * 0.6;
  alpha *= 1.0 + fall * 0.35;
  alpha *= 1.0 - smoothstep(uLength - 16.0, uLength, travelled);
  alpha *= isVisible * (softFront + leading);

  float downstream = smoothstep(uHeroEnd * 0.45, uHeroEnd + 0.24, s);
  vec3 mouthColor = mix(WHITE, PALE, smoothstep(0.0, max(uHeroEnd * 0.35, 0.001), s));
  vec3 bodyColor = mix(mouthColor, DEEP, downstream);
  vec3 coreColor = mix(WHITE, PALE, downstream * 0.7);
  vColor = mix(bodyColor, coreColor, max(isCore, glint));
  vColor = mix(vColor, mix(PALE, WHITE, 0.4), fall * 0.5);
  vAlpha = alpha * (0.94 + 0.06 * sin(uTime * 1.7 + aSeed * 38.0));

  gl_Position = isVisible > 0.5
    ? projectionMatrix * viewMatrix * vec4(worldX, worldY, 0.0, 1.0)
    : vec4(2.0, 2.0, 2.0, 1.0);
  gl_PointSize = aSize * uDpr * (1.0 + glint * 0.8);
}
`;

export const riverFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float core = 1.0 - smoothstep(0.42, 1.0, d);
  float alpha = core * vAlpha;
  gl_FragColor = vec4(vColor * alpha, alpha);
}
`;
