import { useEffect, useLayoutEffect, useMemo } from "react";
import {
  AdditiveBlending, BufferGeometry, DataTexture, Float32BufferAttribute, FloatType,
  NearestFilter, NoColorSpace, RGBAFormat, Vector4,
} from "three";
import type { Vector2 } from "three";
import type { RiverPathData } from "./riverPath";
import { MAX_RIVER_CALM_RECTS, RIVER_SAMPLE_COUNT } from "./riverPath";
import { riverFragment, riverVertex } from "./riverShaders";

interface Uniform<T> {
  value: T;
}

export interface RiverFrameUniforms {
  uTime: Uniform<number>;
  uScrollY: Uniform<number>;
  uWpp: Uniform<number>;
  uDpr: Uniform<number>;
  uFront: Uniform<number>;
  uViewport: Uniform<Vector2>;
  uPourOffset: Uniform<Vector2>;
}

export const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const RIVER_COUNT_DESKTOP = 18000;
const RIVER_COUNT_MOBILE = 10000;

const createParticles = (count: number) => {
  const random = seededRandom(1907 + count);
  const position = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const lateral = new Float32Array(count);
  const speed = new Float32Array(count);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const kind = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    phase[i] = (i + random()) / count;
    const pick = random();
    const gaussian = Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
    if (pick < 0.18) { // core filament: narrow, fast, small, bright
      kind[i] = 1;
      lateral[i] = Math.max(-0.25, Math.min(0.25, gaussian * 0.08));
      speed[i] = 1.3 + random() * 0.3;
      size[i] = 1.0 + random() * 1.2;
    } else if (pick < 0.3) { // spray: outside the banks, slow, small
      kind[i] = 2;
      lateral[i] = (random() < 0.5 ? -1 : 1) * (1.0 + random() * 0.9);
      speed[i] = 0.5 + random() * 0.4;
      size[i] = 0.8 + random() * 1.0;
    } else { // body (the existing distribution)
      kind[i] = 0;
      lateral[i] = Math.max(-1.4, Math.min(1.4, gaussian * 0.45));
      speed[i] = 0.75 + random() * 0.5;
      size[i] = 1.5 + random() * 2;
    }
    seed[i] = random();
  }
  return { position, phase, lateral, speed, size, seed, kind };
};

const River = ({ path, frameUniforms }: { path: RiverPathData; frameUniforms: RiverFrameUniforms }) => {
  const count = path.mobile ? RIVER_COUNT_MOBILE : RIVER_COUNT_DESKTOP;
  const particles = useMemo(() => createParticles(count), [count]);
  const geometry = useMemo(() => {
    const next = new BufferGeometry();
    next.setAttribute("position", new Float32BufferAttribute(particles.position, 3));
    next.setAttribute("aPhase", new Float32BufferAttribute(particles.phase, 1));
    next.setAttribute("aLateral", new Float32BufferAttribute(particles.lateral, 1));
    next.setAttribute("aSpeed", new Float32BufferAttribute(particles.speed, 1));
    next.setAttribute("aSize", new Float32BufferAttribute(particles.size, 1));
    next.setAttribute("aSeed", new Float32BufferAttribute(particles.seed, 1));
    next.setAttribute("aKind", new Float32BufferAttribute(particles.kind, 1));
    return next;
  }, [particles]);

  // ONE texture and ONE uniforms object for the material's whole lifetime.
  //
  // Rebuilding the uniforms object on every path change is a silent no-op: R3F just
  // assigns `material.uniforms = newObject`, but three's WebGLRenderer caches the
  // uniforms object it captured when the program was first compiled and keeps
  // uploading THOSE values. The GPU would therefore render the first (pre-settle)
  // path forever while JS held the correct one. Mutating the existing objects'
  // `.value`s is what actually reaches the shader.
  const textureData = useMemo(() => new Float32Array(RIVER_SAMPLE_COUNT * 4), []);
  const texture = useMemo(() => {
    const next = new DataTexture(textureData, RIVER_SAMPLE_COUNT, 1, RGBAFormat, FloatType);
    next.minFilter = NearestFilter;
    next.magFilter = NearestFilter;
    next.generateMipmaps = false;
    next.colorSpace = NoColorSpace;
    next.needsUpdate = true;
    return next;
  }, [textureData]);
  const uniforms = useMemo(() => ({
    ...frameUniforms,
    uPath: { value: texture },
    uLength: { value: 0 },
    uHeroEnd: { value: 0 },
    uHeroBottom: { value: 0 },
    uIsMobile: { value: 0 },
    uFallStart: { value: 0 },
    uCalmRects: {
      value: Array.from({ length: MAX_RIVER_CALM_RECTS }, () => new Vector4()),
    },
    uCalmCount: { value: 0 },
    uCalmStrength: { value: 0 },
  }), [frameUniforms, texture]);

  useLayoutEffect(() => {
    textureData.set(path.samples);
    texture.needsUpdate = true;
    uniforms.uLength.value = path.length;
    uniforms.uHeroEnd.value = path.heroEnd;
    uniforms.uHeroBottom.value = path.heroBottom;
    uniforms.uIsMobile.value = path.mobile ? 1 : 0;
    uniforms.uFallStart.value = path.fallStart;
    // Mutate the existing Vector4s in place: swapping the array would never
    // reach the compiled program (same trap as the path texture above).
    const calmRects = uniforms.uCalmRects.value;
    for (let i = 0; i < calmRects.length; i++) {
      const rect = path.calmRects[i];
      if (rect) calmRects[i].set(rect.left, rect.top, rect.right, rect.bottom);
      else calmRects[i].set(0, 0, 0, 0);
    }
    uniforms.uCalmCount.value = path.calmRects.length;
    uniforms.uCalmStrength.value = path.mobile ? 0.4 : 0.65;
  }, [path, textureData, texture, uniforms]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <points frustumCulled={false} renderOrder={0}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        transparent
        depthTest={false}
        depthWrite={false}
        premultipliedAlpha
        blending={AdditiveBlending}
        uniforms={uniforms}
        vertexShader={riverVertex}
        fragmentShader={riverFragment}
      />
    </points>
  );
};

export default River;
