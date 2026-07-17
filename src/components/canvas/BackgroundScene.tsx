import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import type { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import scrollState from "../../lib/scrollState";

/* ------------------------------------------------------------------ */
/*  Live page-scroll progress (0..1), read straight from the window.   */
/*  Decoupled from Lenis so the scene still tracks scroll under         */
/*  reduced-motion / native scroll.                                     */
/* ------------------------------------------------------------------ */
const readProgress = () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
};

/* ================================================================== */
/*  Aurora backdrop shader (full-viewport, palette shifts by scroll)   */
/* ================================================================== */
const AuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uPointer: new THREE.Vector2(0, 0),
    uVelocity: 0,
    uProgress: 0,
  },
  /* glsl vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl fragment */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uVelocity;
    uniform float uProgress;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 5; i++) {
        v += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      vec2 p = vec2(uv.x * aspect, uv.y);

      float t = uTime * 0.05;
      float vel = uVelocity * 0.6;

      // Scroll slowly translates the noise field — the aurora "travels".
      vec2 scroll = vec2(uProgress * 0.6, -uProgress * 1.4);
      vec2 ptr = uPointer * 0.12;

      float flow = fbm(p * 2.4 + vec2(t, t * 0.6) + ptr + scroll);
      flow += 0.18 * vel;
      float bands = fbm(p * 1.4 - vec2(0.0, t * 1.3 + vel) + flow + scroll);

      vec3 nearBlack = vec3(0.018, 0.018, 0.039);
      vec3 violet = vec3(0.545, 0.361, 0.965); // #8b5cf6
      vec3 cyan   = vec3(0.133, 0.827, 0.933); // #22d3ee
      vec3 magenta = vec3(0.760, 0.247, 0.851); // #c13fd9

      // Palette glides violet -> cyan -> magenta as the page scrolls so each
      // section feels distinct without ever leaving the brand.
      vec3 warm = mix(violet, magenta, smoothstep(0.55, 1.0, uProgress));
      vec3 cool = mix(cyan, violet, smoothstep(0.0, 0.6, uProgress));

      vec3 col = nearBlack;
      float m1 = smoothstep(0.35, 0.85, bands);
      float m2 = smoothstep(0.45, 0.95, flow);
      col = mix(col, warm, m1 * 0.55);
      col = mix(col, cool, m2 * 0.40);

      // Soft radial vignette keeps the centre readable behind content.
      float vig = smoothstep(1.25, 0.2, length(uv - 0.5));
      col *= mix(0.7, 1.0, vig);

      gl_FragColor = vec4(col, 1.0);
    }
  `
);

/* ================================================================== */
/*  Parallax particle field (soft additive points, violet <-> cyan)    */
/* ================================================================== */
const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uSize: 26,
    uPixelRatio: 1,
    uProgress: 0,
    uVelocity: 0,
  },
  /* glsl vertex */ `
    attribute float aScale;
    attribute float aSeed;
    uniform float uTime;
    uniform float uSize;
    uniform float uPixelRatio;
    uniform float uProgress;
    uniform float uVelocity;
    varying float vSeed;
    varying float vTwinkle;

    void main() {
      vSeed = aSeed;
      vec3 pos = position;

      // Gentle individual drift.
      float a = aSeed * 6.2831853;
      pos.x += cos(uTime * 0.15 + a) * 0.18;
      pos.y += sin(uTime * 0.20 + a) * 0.18;

      // Endless vertical wrap driven by scroll — we "fly" through the field.
      float travel = uProgress * 14.0 + uTime * 0.12;
      pos.y = mod(pos.y + travel + 11.0, 22.0) - 11.0;

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;

      vTwinkle = 0.55 + 0.45 * sin(uTime * 1.6 + a * 9.0);
      float velBoost = 1.0 + abs(uVelocity) * 0.6;
      gl_PointSize = aScale * uSize * uPixelRatio * vTwinkle * velBoost * (1.0 / -mv.z);
    }
  `,
  /* glsl fragment */ `
    precision mediump float;
    varying float vSeed;
    varying float vTwinkle;

    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, d);

      vec3 violet = vec3(0.655, 0.545, 0.980); // #a78bfa
      vec3 cyan   = vec3(0.133, 0.827, 0.933); // #22d3ee
      vec3 col = mix(violet, cyan, vSeed);

      gl_FragColor = vec4(col, alpha * vTwinkle * 0.9);
    }
  `
);

interface AuroraMaterialInstance extends THREE.ShaderMaterial {
  uTime: number;
  uResolution: THREE.Vector2;
  uPointer: THREE.Vector2;
  uVelocity: number;
  uProgress: number;
}

interface ParticleMaterialInstance extends THREE.ShaderMaterial {
  uTime: number;
  uPixelRatio: number;
  uProgress: number;
  uVelocity: number;
}

extend({ AuroraMaterial, ParticleMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    auroraMaterial: ReactThreeFiber.MaterialNode<AuroraMaterialInstance, typeof AuroraMaterial>;
    particleMaterial: ReactThreeFiber.MaterialNode<ParticleMaterialInstance, typeof ParticleMaterial>;
  }
}

const AuroraPlane = () => {
  const ref = useRef<AuroraMaterialInstance>(null);
  const { size } = useThree();
  const pointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    const mat = ref.current;
    if (!mat) return;
    mat.uTime += delta;
    mat.uResolution.set(size.width, size.height);
    pointer.current.lerp(state.pointer, 0.05);
    mat.uPointer.copy(pointer.current);
    mat.uVelocity = scrollState.velocity;
    mat.uProgress += (readProgress() - mat.uProgress) * 0.08;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <auroraMaterial ref={ref} depthTest={false} depthWrite={false} />
    </mesh>
  );
};

const ParticleField = ({ count, pixelRatio }: { count: number; pixelRatio: number }) => {
  const ref = useRef<ParticleMaterialInstance>(null);
  const group = useRef<THREE.Points>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));

  const { positions, scales, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22; // y (tall column to wrap)
      positions[i * 3 + 2] = -2 - Math.random() * 8; // z (depth → parallax)
      scales[i] = 0.4 + Math.random() * 1.1;
      seeds[i] = Math.random();
    }
    return { positions, scales, seeds };
  }, [count]);

  useFrame((state, delta) => {
    const mat = ref.current;
    if (mat) {
      mat.uTime += delta;
      mat.uProgress += (readProgress() - mat.uProgress) * 0.08;
      mat.uVelocity = scrollState.velocity;
    }
    if (group.current) {
      // Cursor parallax — the field tilts gently toward the pointer.
      pointer.current.lerp(state.pointer, 0.04);
      group.current.rotation.y = pointer.current.x * 0.18;
      group.current.rotation.x = -pointer.current.y * 0.12;
    }
  });

  return (
    <points ref={group} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <particleMaterial
        ref={ref}
        uPixelRatio={pixelRatio}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export interface BackgroundSceneProps {
  active?: boolean;
  particleCount?: number;
  maxDpr?: number;
}

const BackgroundScene = ({
  active = true,
  particleCount = 4000,
  maxDpr = 1.75,
}: BackgroundSceneProps) => {
  const pixelRatio =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, maxDpr) : 1;

  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, maxDpr]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 100 }}
    >
      <AuroraPlane />
      <ParticleField count={particleCount} pixelRatio={pixelRatio} />
    </Canvas>
  );
};

export default BackgroundScene;
