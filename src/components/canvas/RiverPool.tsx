import { useEffect, useLayoutEffect, useMemo } from "react";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Vector2, Vector4 } from "three";
import {
  EDGE_SCHEDULE, INTRO_END, STARS, STAR_IDS, STAR_IGNITE, starPosition,
} from "./aquariusData";
import { seededRandom, type RiverFrameUniforms } from "./River";
import type { RiverPool as RiverPoolShape } from "./riverPath";
import { poolVertex } from "./poolShaders";
import { riverFragment } from "./riverShaders";

interface Uniform<T> {
  value: T;
}

export interface PoolStateUniforms {
  uFill: Uniform<number>;
  uFillStart: Uniform<number>;
  uSettled: Uniform<number>;
}

const EDGE_DOTS = 16;

/** Particle budgets for the lake surface, meniscus rim, splash mist and reflection. */
const POOL_SURFACE_DESKTOP = 56000;
const POOL_SURFACE_MOBILE = 18000;
const POOL_RIM_DESKTOP = 3000;
const POOL_RIM_MOBILE = 1000;
const POOL_SPLASH_DESKTOP = 1400;
const POOL_SPLASH_MOBILE = 500;
const POOL_GLINT_DESKTOP = 2200;
const POOL_GLINT_MOBILE = 700;

// Aquarius mirrored onto the pool surface: scene +y (up) maps to pool +y (toward the viewer).
const reflectionLayout = () => {
  const points = STAR_IDS.map((id) => starPosition(id));
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const hx = (maxX - minX) / 2 || 1;
  const hy = (maxY - minY) / 2 || 1;
  return new Map(STAR_IDS.map((id, i) => [id, [(points[i][0] - cx) / hx, (points[i][1] - cy) / hy] as [number, number]]));
};

const createPoolParticles = (mobile: boolean) => {
  const random = seededRandom(4242 + (mobile ? 1 : 0));
  const local = reflectionLayout();
  const kind: number[] = [];
  const param: number[] = [];
  const seed: number[] = [];
  const size: number[] = [];
  const push = (k: number, a: number, b: number, s: number, z: number) => {
    kind.push(k);
    param.push(a, b);
    seed.push(s);
    size.push(z);
  };
  const surface = mobile ? POOL_SURFACE_MOBILE : POOL_SURFACE_DESKTOP;
  const rim = mobile ? POOL_RIM_MOBILE : POOL_RIM_DESKTOP;
  const splash = mobile ? POOL_SPLASH_MOBILE : POOL_SPLASH_DESKTOP;
  // kind 0 surface: x spread across the rect, y is depth 0 (hairline) .. 1 (page end)
  for (let i = 0; i < surface; i++) push(0, random() * 2 - 1, random(), random(), 1.1 + random() * 1.4);
  for (let i = 0; i < rim; i++) push(1, random() * 2 - 1, random(), random(), 1.0 + random());
  for (let i = 0; i < splash; i++) push(2, random(), Math.pow(random(), 0.7), random(), 1.2 + random() * 1.2);
  STAR_IDS.forEach((id) => {
    const [x, y] = local.get(id) ?? [0, 0];
    push(3, x, y, STAR_IGNITE[id] / INTRO_END, STARS[id][2] >= 1.4 ? 5.6 : 4.2);
  });
  EDGE_SCHEDULE.forEach((edge) => {
    const [ax, ay] = local.get(edge.from) ?? [0, 0];
    const [bx, by] = local.get(edge.to) ?? [0, 0];
    for (let j = 1; j <= EDGE_DOTS; j++) {
      const t = j / (EDGE_DOTS + 1);
      push(4, ax + (bx - ax) * t, ay + (by - ay) * t, (edge.delay + t * edge.duration) / INTRO_END, 1.9);
    }
  });
  const glints = mobile ? POOL_GLINT_MOBILE : POOL_GLINT_DESKTOP;
  for (let i = 0; i < glints; i++) push(5, random() * 2 - 1, random(), random(), 2.2 + random() * 1.8);
  const count = kind.length;
  return {
    position: new Float32Array(count * 3),
    kind: new Float32Array(kind),
    param: new Float32Array(param),
    seed: new Float32Array(seed),
    size: new Float32Array(size),
  };
};

/** Lake-local [-1,1] rect from document px; disabled rects collapse to (0,0,0,0). */
const localRect = (
  left: number, top: number, right: number, bottom: number,
  centerX: number, centerY: number, radiusX: number, radiusY: number,
) =>
  right <= left || bottom <= top
    ? new Vector4(0, 0, 0, 0)
    : new Vector4(
      (left - centerX) / radiusX,
      (top - centerY) / radiusY,
      (right - centerX) / radiusX,
      (bottom - centerY) / radiusY,
    );

const RiverPool = ({
  pool,
  mobile,
  frameUniforms,
  stateUniforms,
}: {
  pool: RiverPoolShape;
  mobile: boolean;
  frameUniforms: RiverFrameUniforms;
  stateUniforms: PoolStateUniforms;
}) => {
  const particles = useMemo(() => createPoolParticles(mobile), [mobile]);
  const geometry = useMemo(() => {
    const next = new BufferGeometry();
    next.setAttribute("position", new Float32BufferAttribute(particles.position, 3));
    next.setAttribute("aKind", new Float32BufferAttribute(particles.kind, 1));
    next.setAttribute("aParam", new Float32BufferAttribute(particles.param, 2));
    next.setAttribute("aSeed", new Float32BufferAttribute(particles.seed, 1));
    next.setAttribute("aSize", new Float32BufferAttribute(particles.size, 1));
    return next;
  }, [particles]);
  const {
    centerX, centerY, radiusX, radiusY,
    impactX, impactY, reflectX, reflectY, reflectHalfWidth, reflectHalfHeight,
    calmLeft, calmTop, calmRight, calmBottom, calm2Left, calm2Top, calm2Right, calm2Bottom,
    impactHalfWidth,
  } = pool;
  // ONE uniforms object for the material's whole lifetime.
  //
  // Rebuilding it per pool change is a silent no-op: R3F assigns
  // `material.uniforms = newObject`, but three's WebGLRenderer keeps uploading the
  // object it captured when the program was first compiled, so the GPU would render
  // the first (pre-settle) lake rectangle forever while JS held the correct one.
  // Mutating the existing vectors' `.value`s in place is what reaches the shader.
  const uniforms = useMemo(() => ({
    ...frameUniforms,
    ...stateUniforms,
    uCenter: { value: new Vector2() },
    uRadii: { value: new Vector2() },
    uImpact: { value: new Vector2() },
    uReflect: { value: new Vector4() },
    uCalm: { value: new Vector4() },
    uCalm2: { value: new Vector4() },
    uImpactSpread: { value: 0 },
    uIsMobile: { value: 0 },
  }), [frameUniforms, stateUniforms]);

  useLayoutEffect(() => {
    uniforms.uCenter.value.set(centerX, centerY);
    uniforms.uRadii.value.set(radiusX, radiusY);
    uniforms.uImpact.value.set(
      (impactX - centerX) / radiusX,
      (impactY - centerY) / radiusY,
    );
    uniforms.uReflect.value.set(
      (reflectX - centerX) / radiusX,
      (reflectY - centerY) / radiusY,
      reflectHalfWidth / radiusX,
      reflectHalfHeight / radiusY,
    );
    uniforms.uCalm.value.copy(
      localRect(calmLeft, calmTop, calmRight, calmBottom, centerX, centerY, radiusX, radiusY),
    );
    uniforms.uCalm2.value.copy(
      localRect(calm2Left, calm2Top, calm2Right, calm2Bottom, centerX, centerY, radiusX, radiusY),
    );
    uniforms.uImpactSpread.value = impactHalfWidth / radiusX;
    uniforms.uIsMobile.value = mobile ? 1 : 0;
  }, [
    uniforms,
    centerX, centerY, radiusX, radiusY,
    impactX, impactY, reflectX, reflectY, reflectHalfWidth, reflectHalfHeight,
    calmLeft, calmTop, calmRight, calmBottom, calm2Left, calm2Top, calm2Right, calm2Bottom,
    impactHalfWidth, mobile,
  ]);

  useEffect(() => () => geometry.dispose(), [geometry]);

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
        vertexShader={poolVertex}
        fragmentShader={riverFragment}
      />
    </points>
  );
};

export default RiverPool;