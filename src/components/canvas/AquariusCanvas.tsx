import { useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Aquarius constellation hero visual — a @react-three/fiber port of the
 * `aquarius` variant in the design bundle's hero3d.js. Star positions come
 * from real approximate RA (hours) / Dec (degrees) coordinates; the twinkle,
 * flare, group-motion, and cursor-parallax constants are kept 1:1 with the
 * reference so the motion reads identically.
 */

const ACCENT = "#a78bfa";

// Real approximate positions: [RA hours, Dec degrees, brightness weight].
const STARS: Record<string, [number, number, number]> = {
  eps: [20.79, -9.5, 1.2], // Albali
  bet: [21.53, -5.57, 1.6], // Sadalsuud
  alp: [22.1, -0.32, 1.6], // Sadalmelik
  gam: [22.36, -1.39, 1.2], // Sadalachbia
  zet: [22.48, 0.02, 1.0],
  eta: [22.59, -0.12, 1.0],
  pi: [22.42, 1.38, 0.9],
  the: [22.28, -7.78, 1.0], // Ancha
  iot: [22.11, -13.87, 0.9],
  lam: [22.88, -7.58, 1.0],
  tau: [22.83, -13.59, 0.9],
  del: [22.91, -15.82, 1.4], // Skat
  phi: [23.23, -6.05, 0.9],
  psi: [23.26, -9.09, 1.0],
  s88: [23.16, -21.17, 0.9],
};

// Traditional stick figure incl. the water-jar asterism.
const EDGES: [string, string][] = [
  ["eps", "bet"],
  ["bet", "alp"],
  ["alp", "gam"],
  ["gam", "zet"],
  ["zet", "eta"],
  ["gam", "pi"],
  ["alp", "the"],
  ["the", "iot"],
  ["the", "lam"],
  ["lam", "phi"],
  ["phi", "psi"],
  ["psi", "s88"],
  ["lam", "tau"],
  ["tau", "del"],
  ["del", "psi"],
];

interface Twinkle {
  mat: THREE.PointsMaterial;
  baseSize: number;
  baseOp: number;
  phase: number;
  speed: number;
}

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
};

const Constellation = ({ reduced }: { reduced: boolean }) => {
  const pointer = useMemo(() => ({ x: 0, y: 0 }), []);

  const { group, bgPoints, twinkles } = useMemo(() => {
    const color = new THREE.Color(ACCENT);

    // Map celestial coords into scene space; random z gives parallax depth.
    const pos: Record<string, THREE.Vector3> = {};
    for (const key of Object.keys(STARS)) {
      const [ra, dec] = STARS[key];
      pos[key] = new THREE.Vector3(
        -(ra - 22.05) * 2.1,
        (dec + 8.5) * 0.21,
        (Math.random() - 0.5) * 0.8
      );
    }

    const group = new THREE.Group();

    // Constellation lines.
    const linePositions: number[] = [];
    for (const [a, b] of EDGES) {
      linePositions.push(pos[a].x, pos[a].y, pos[a].z, pos[b].x, pos[b].y, pos[b].z);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    );
    group.add(
      new THREE.LineSegments(
        lineGeo,
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 })
      )
    );

    // Stars, sized by brightness; bright ones (β Sadalsuud, α Sadalmelik,
    // δ Skat) are white and larger, the rest use the accent violet.
    const twinkles: Twinkle[] = [];
    for (const key of Object.keys(STARS)) {
      const brightness = STARS[key][2];
      const starGeo = new THREE.BufferGeometry().setFromPoints([pos[key]]);
      const mat = new THREE.PointsMaterial({
        color: brightness >= 1.4 ? new THREE.Color("#ffffff") : color,
        size: brightness * 0.11,
        transparent: true,
        opacity: 0.95,
      });
      twinkles.push({
        mat,
        baseSize: mat.size,
        baseOp: mat.opacity,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.8,
      });
      group.add(new THREE.Points(starGeo, mat));
    }

    // Faint background starfield behind the figure.
    const bg: number[] = [];
    for (let i = 0; i < 160; i++) {
      bg.push((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, -1.5 - Math.random() * 3);
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(bg), 3));
    const bgPoints = new THREE.Points(
      bgGeo,
      new THREE.PointsMaterial({ color, size: 0.035, transparent: true, opacity: 0.45 })
    );

    return { group, bgPoints, twinkles };
  }, []);

  // Dispose GPU resources on unmount (objects are created outside R3F).
  useEffect(() => {
    return () => {
      group.traverse((obj) => {
        const node = obj as THREE.Mesh;
        node.geometry?.dispose?.();
        const material = node.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose?.();
      });
      bgPoints.geometry.dispose();
      (bgPoints.material as THREE.Material).dispose();
    };
  }, [group, bgPoints]);

  // Cursor parallax (window-relative), disabled under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, pointer]);

  const applyTwinkle = (t: number) => {
    for (const tw of twinkles) {
      const s = Math.sin(t * tw.speed + tw.phase);
      // Occasional bright flare.
      const flare = Math.max(0, Math.sin(t * tw.speed * 0.31 + tw.phase * 2.7) - 0.92) * 8;
      tw.mat.size = tw.baseSize * (1 + s * 0.22 + flare * 0.6);
      tw.mat.opacity = Math.min(1, tw.baseOp * (0.75 + 0.25 * s + flare));
    }
  };

  useFrame((state) => {
    // Reduced motion: freeze on a single representative frame (t ≈ 1.5).
    const t = reduced ? 1.5 : state.clock.getElapsedTime();

    applyTwinkle(t);
    group.rotation.y = Math.sin(t * 0.15) * 0.18;
    group.rotation.x = Math.sin(t * 0.11) * 0.06;
    group.position.y = Math.sin(t * 0.35) * 0.1;
    bgPoints.rotation.z = t * 0.008;

    if (!reduced) {
      state.camera.position.x += (pointer.x * 0.8 - state.camera.position.x) * 0.04;
      state.camera.position.y += (-pointer.y * 0.5 - state.camera.position.y) * 0.04;
    }
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <primitive object={bgPoints} />
      <primitive object={group} />
    </>
  );
};

const AquariusCanvas = () => {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 0, 7], near: 0.1, far: 100 }}
      frameloop={reduced ? "demand" : "always"}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <Constellation reduced={reduced} />
    </Canvas>
  );
};

export default AquariusCanvas;
