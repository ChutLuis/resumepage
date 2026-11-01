import { useMemo } from "react";
import { AdditiveBlending, NormalBlending, Vector2 } from "three";
import {
  EDGE_SCHEDULE, INTRO_END, PEN_SPEED, STARS, STAR_IDS,
  STAR_IGNITE, STATUE_DURATION, STATUE_START, starPosition,
} from "./aquariusData";
import {
  TRAIL_POINTS, lineFragment, lineVertex, pulseFragment, pulseVertex, starFragment, starVertex,
  starfieldFragment, starfieldVertex,
} from "./aquariusShaders";

// Uniform objects shared by every layer; the scene updates them once per frame.
export interface SharedUniforms {
  uTime: { value: number };
  uScale: { value: number };
  uSettled: { value: number }; // 1 = reduced motion: show the finished frame regardless of time
  uHeroDim: { value: number };
  uScrollDissolve: { value: number };
  uPointer: { value: Vector2 };
  uPointerStrength: { value: number };
  uAspect: { value: number };
  uDpr: { value: number };
}
export const createSharedUniforms = (): SharedUniforms => ({
  uTime: { value: 0 },
  uScale: { value: 700 },
  uSettled: { value: 0 },
  uHeroDim: { value: 1 },
  uScrollDissolve: { value: 0 },
  uPointer: { value: new Vector2(0, 0) },
  uPointerStrength: { value: 0 },
  uAspect: { value: 1 },
  uDpr: { value: 1 },
});

// Tuning knobs.
const STAR_SIZE = { bright: 0.165, quiet: 0.1 }; // world units, including halo
export const PULSE_FADE_IN = 1; // seconds
// Settled frame: the constellation is fully drawn; the independent river settles to its full front.
export const REST_TIME = Math.max(
  INTRO_END,
  STATUE_START + STATUE_DURATION
) + 2;

// Deterministic PRNG so the layout is stable between renders and reloads.
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const hex = (value: string) => {
  const n = parseInt(value.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255);
};

const common = { transparent: true, depthTest: true, depthWrite: false, premultipliedAlpha: true } as const;

export const Lines = ({ shared }: { shared: SharedUniforms }) => {
  const { position, progress, delay, duration } = useMemo(() => {
    const position: number[] = [];
    const progress: number[] = [];
    const delay: number[] = [];
    const duration: number[] = [];
    for (const edge of EDGE_SCHEDULE) {
      position.push(...starPosition(edge.from), ...starPosition(edge.to));
      progress.push(0, 1);
      delay.push(edge.delay, edge.delay);
      duration.push(edge.duration, edge.duration);
    }
    return {
      position: new Float32Array(position),
      progress: new Float32Array(progress),
      delay: new Float32Array(delay),
      duration: new Float32Array(duration),
    };
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: shared.uTime, uPenSpeed: { value: PEN_SPEED }, uHeroDim: shared.uHeroDim }),
    [shared]
  );

  return (
    <lineSegments frustumCulled={false} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[position, 3]} />
        <bufferAttribute attach="attributes-aProgress" args={[progress, 1]} />
        <bufferAttribute attach="attributes-aDelay" args={[delay, 1]} />
        <bufferAttribute attach="attributes-aDuration" args={[duration, 1]} />
      </bufferGeometry>
      <shaderMaterial
        {...common}
        blending={NormalBlending}
        uniforms={uniforms}
        vertexShader={lineVertex}
        fragmentShader={lineFragment}
      />
    </lineSegments>
  );
};

export const Stars = ({ shared }: { shared: SharedUniforms }) => {
  const data = useMemo(() => {
    const bright = hex("#ecebf4");
    const quiet = hex("#a78bfa");
    const isBright = STAR_IDS.map((id) => STARS[id][2] >= 1.4);
    return {
      position: new Float32Array(STAR_IDS.flatMap((id) => starPosition(id))),
      size: new Float32Array(isBright.map((b) => (b ? STAR_SIZE.bright : STAR_SIZE.quiet))),
      color: new Float32Array(isBright.flatMap((b) => (b ? bright : quiet))),
      ignite: new Float32Array(STAR_IDS.map((id) => STAR_IGNITE[id])),
      bright: new Float32Array(isBright.map((b) => (b ? 1 : 0))),
    };
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: shared.uTime, uScale: shared.uScale, uHeroDim: shared.uHeroDim }),
    [shared]
  );

  return (
    <points frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.position, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.size, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[data.color, 3]} />
        <bufferAttribute attach="attributes-aIgnite" args={[data.ignite, 1]} />
        <bufferAttribute attach="attributes-aBright" args={[data.bright, 1]} />
      </bufferGeometry>
      <shaderMaterial
        {...common}
        blending={AdditiveBlending}
        uniforms={uniforms}
        vertexShader={starVertex}
        fragmentShader={starFragment}
      />
    </points>
  );
};

// Pulses: one per edge plus a second on the three longest, travelling outward from alpha.
export const Pulses = ({ shared, fade }: { shared: SharedUniforms; fade: { value: number } }) => {
  const data = useMemo(() => {
    const rand = rng(7);
    const lengths = EDGE_SCHEDULE.map((e) => {
      const a = starPosition(e.from);
      const b = starPosition(e.to);
      return Math.hypot(a[0] - b[0], a[1] - b[1]);
    });
    const longest = [...lengths.keys()].sort((a, b) => lengths[b] - lengths[a]).slice(0, 3);
    const assigned = [...EDGE_SCHEDULE.keys(), ...longest];
    const count = assigned.length * TRAIL_POINTS;
    const out = {
      position: new Float32Array(count * 3),
      end: new Float32Array(count * 3),
      phase: new Float32Array(count),
      speed: new Float32Array(count),
      travel: new Float32Array(count),
      trail: new Float32Array(count),
    };
    assigned.forEach((edgeIndex, pulse) => {
      const edge = EDGE_SCHEDULE[edgeIndex];
      const cycle = 2.5 + rand() * 2; // seconds per cycle (travel + idle gap)
      const phase = rand();
      const travel = Math.max(0.6, lengths[edgeIndex] / 1.2);
      for (let k = 0; k < TRAIL_POINTS; k++) {
        const i = pulse * TRAIL_POINTS + k;
        out.position.set(starPosition(edge.from), i * 3);
        out.end.set(starPosition(edge.to), i * 3);
        out.phase[i] = phase;
        out.speed[i] = 1 / cycle;
        out.travel[i] = travel;
        out.trail[i] = k;
      }
    });
    return out;
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: shared.uTime, uScale: shared.uScale, uHeroDim: shared.uHeroDim, uFade: fade }),
    [shared, fade]
  );

  return (
    <points frustumCulled={false} renderOrder={3}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.position, 3]} />
        <bufferAttribute attach="attributes-aEnd" args={[data.end, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phase, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[data.speed, 1]} />
        <bufferAttribute attach="attributes-aTravel" args={[data.travel, 1]} />
        <bufferAttribute attach="attributes-aTrailIndex" args={[data.trail, 1]} />
      </bufferGeometry>
      <shaderMaterial
        {...common}
        blending={AdditiveBlending}
        uniforms={uniforms}
        vertexShader={pulseVertex}
        fragmentShader={pulseFragment}
      />
    </points>
  );
};

// Faint dust drifting in depth behind the statue, so she sits in a space rather than on a flat page.
export const Starfield = ({ shared, mobile }: { shared: SharedUniforms; mobile: boolean }) => {
  const data = useMemo(() => {
    const rand = rng(31 + (mobile ? 1 : 0));
    const count = mobile ? 380 : 900;
    const position = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      position[i * 3] = (rand() * 2 - 1) * 7.5;
      position[i * 3 + 1] = -4 + rand() * 7.5;
      position[i * 3 + 2] = -0.6 - rand() * 1.9;
      seed[i] = rand();
      size[i] = 0.6 + rand() * 1.1;
    }
    return { position, seed, size };
  }, [mobile]);
  const uniforms = useMemo(
    () => ({ uTime: shared.uTime, uHeroDim: shared.uHeroDim, uDpr: shared.uDpr }),
    [shared]
  );
  return (
    <points frustumCulled={false} renderOrder={0}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.position, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[data.seed, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[data.size, 1]} />
      </bufferGeometry>
      <shaderMaterial
        {...common}
        depthTest={false}
        blending={AdditiveBlending}
        uniforms={uniforms}
        vertexShader={starfieldVertex}
        fragmentShader={starfieldFragment}
      />
    </points>
  );
};
