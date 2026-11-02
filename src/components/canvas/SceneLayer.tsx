import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector2, Vector3, type Group } from "three";
import { subscribeTicker } from "../../lib/ticker";
import { sceneStore } from "../../lib/sceneStore";
import {
  FRAME, PULSE_START, STATUE, STATUE_POUR_POINT, STREAM_START,
} from "./aquariusData";
import {
  Lines, Pulses, PULSE_FADE_IN, REST_TIME, Starfield, Stars, createSharedUniforms,
} from "./aquariusLayers";
import AquariusStatue from "./AquariusStatue";
import River, { type RiverFrameUniforms } from "./River";
import RiverPool, { type PoolStateUniforms } from "./RiverPool";
import {
  buildRiverPath,
  MAX_RIVER_CALM_RECTS,
  RIVER_SAMPLE_COUNT,
  type RiverPathData,
  type RiverPoolAnchor,
} from "./riverPath";

const CAMERA_FOV = 18;
const CAMERA_DISTANCE = 20;
const FIT_FOV = 42;
const FIT_MARGIN = 0.12;
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const FRAME_CENTER_Y = -(FRAME.y + FRAME.height / 2);
const TAU = Math.PI * 2;
const POOL_FILL_SECONDS = 3.2;

interface HeroFit {
  centerXDocPx: number;
  centerYDocPx: number;
  pxPerUnit: number;
}

interface AquariusDebug {
  anchorCenterPx: { x: number; y: number };
  groupCenterPx: { x: number; y: number };
  sceneTime: number;
  statueLoaded: boolean;
  pourPointPx: { x: number; y: number } | null;
}

declare global {
  interface Window {
    __aquariusDebug?: AquariusDebug;
  }
}

const worldPerCssPixel = () =>
  (2 * CAMERA_DISTANCE * Math.tan((CAMERA_FOV * Math.PI) / 360)) / Math.max(window.innerHeight, 1);

const docToWorld = (xPx: number, yDocPx: number, scrollY: number): [number, number] => {
  const wpp = worldPerCssPixel();
  return [
    (xPx - window.innerWidth / 2) * wpp,
    -(yDocPx - scrollY - window.innerHeight / 2) * wpp,
  ];
};

const getSceneSnapshot = () => sceneStore.getSnapshot();

const RIVER_SECTION_IDS = ["work", "experience", "tech", "about", "testimonials", "contact"];

const sAtViewportBottom = (path: RiverPathData, docY: number) => {
  const maxIndex = Math.min(
    RIVER_SAMPLE_COUNT - 1,
    Math.floor(path.poolStart * (RIVER_SAMPLE_COUNT - 1))
  );
  const firstY = path.samples[1];
  const lastY = path.samples[maxIndex * 4 + 1];
  if (docY <= firstY) return 0;
  if (docY >= lastY) return path.poolStart;

  let low = 0;
  let high = maxIndex;
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (path.samples[middle * 4 + 1] <= docY) low = middle;
    else high = middle;
  }
  const y0 = path.samples[low * 4 + 1];
  const y1 = path.samples[high * 4 + 1];
  const ratio = (docY - y0) / Math.max(y1 - y0, 0.0001);
  return (low + ratio) / (RIVER_SAMPLE_COUNT - 1);
};

const ContextGuard = () => {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = () => sceneStore.setLost(true);
    canvas.addEventListener("webglcontextlost", onLost);
    if (gl.getContext().isContextLost()) onLost();
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl]);

  return null;
};

const SceneController = () => {
  const snapshot = useSyncExternalStore(sceneStore.subscribe, getSceneSnapshot, getSceneSnapshot);
  const advance = useThree((state) => state.advance);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const dpr = useThree((state) => state.viewport.dpr);
  const [riverPath, setRiverPath] = useState<RiverPathData | null>(null);
  const outer = useRef<Group>(null);
  const inner = useRef<Group>(null);
  const statue = useRef<Group>(null);
  const fit = useRef<HeroFit | null>(null);
  const riverPathRef = useRef<RiverPathData | null>(null);
  const statuePourPointPx = useRef<{ x: number; y: number } | null>(null);
  const uniforms = useMemo(() => createSharedUniforms(), []);
  const pulseFade = useMemo(() => ({ value: 0 }), []);
  const riverFrameUniforms = useMemo<RiverFrameUniforms>(() => ({
    uTime: { value: 0 },
    uScrollY: { value: 0 },
    uWpp: { value: 0 },
    uDpr: { value: 1 },
    uFront: { value: 0 },
    uViewport: { value: new Vector2(1, 1) },
    uPourOffset: { value: new Vector2(0, 0) },
  }), []);
  const poolUniforms = useMemo<PoolStateUniforms>(() => ({
    uFill: { value: 0 },
    uFillStart: { value: -1000 },
    uSettled: { value: 0 },
  }), []);
  const poolFill = useRef(0);
  const clock = useRef(0);
  const frameReady = useRef(false);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const heroHeight = useRef(0);
  const dirty = useRef(true);
  const motion = useRef({ x: 0, y: 0, reduced: typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches });
  const oneShotUnsubscribe = useRef<(() => void) | null>(null);

  const drawFrame = useCallback((time: number) => {
    if (motion.current.reduced && !dirty.current) return;
    dirty.current = false;
    try {
      advance(time);
      if (gl.getContext().isContextLost()) {
        sceneStore.setLost(true);
        return;
      }
      if (!frameReady.current) {
        frameReady.current = true;
        sceneStore.setLost(false);
        sceneStore.setReady(true);
      }
    } catch {
      sceneStore.setLost(true);
    }
  }, [advance, gl]);

  const requestRender = useCallback(() => {
    dirty.current = true;
    if (!motion.current.reduced || oneShotUnsubscribe.current) return;
    let unsubscribe: (() => void) | null = null;
    unsubscribe = subscribeTicker((time) => {
      oneShotUnsubscribe.current = null;
      unsubscribe?.();
      drawFrame(time);
    }, 10);
    oneShotUnsubscribe.current = unsubscribe;
  }, [drawFrame]);

  useLayoutEffect(() => {
    const anchor = snapshot.anchor;
    const updateFit = () => {
      if (!anchor) {
        fit.current = null;
        riverPathRef.current = null;
        setRiverPath(null);
        requestRender();
        return;
      }
      const rect = anchor.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        riverPathRef.current = null;
        setRiverPath(null);
        return;
      }
      const aspect = rect.width / rect.height;
      const halfHeight = Math.max(FRAME.height / 2, FRAME.width / (2 * aspect));
      const distance = halfHeight / Math.tan((FIT_FOV * Math.PI) / 360) + FIT_MARGIN;
      const pxPerUnit = rect.height / (2 * distance * Math.tan((FIT_FOV * Math.PI) / 360));
      fit.current = {
        centerXDocPx: rect.left + rect.width / 2,
        centerYDocPx: rect.top + window.scrollY + rect.height / 2,
        pxPerUnit,
      };
      const regionRect = snapshot.region?.getBoundingClientRect();
      heroHeight.current = regionRect ? regionRect.height : rect.height;
      const heroBottom = regionRect
        ? regionRect.top + window.scrollY + regionRect.height
        : rect.top + window.scrollY + rect.height;
      const sections = RIVER_SECTION_IDS.flatMap((id) => {
        const section = document.getElementById(id);
        if (!section) return [];
        const bounds = section.getBoundingClientRect();
        return [{ id, top: bounds.top + window.scrollY, height: bounds.height }];
      });
      // Body blocks the River dims behind (tagged in the DOM, capped at 8).
      // Measured with the reveal offset: content that has not animated in yet
      // sits up to 24px low, which the shader's feather absorbs.
      const calmRects = Array.from(document.querySelectorAll<HTMLElement>("[data-scene-calm]"))
        .map((element) => {
          const bounds = element.getBoundingClientRect();
          return {
            left: bounds.left,
            top: bounds.top + window.scrollY,
            right: bounds.right,
            bottom: bounds.bottom + window.scrollY,
          };
        })
        .filter((rect) => rect.right > rect.left && rect.bottom > rect.top)
        .slice(0, MAX_RIVER_CALM_RECTS);
      const contactElement = document.getElementById("contact");
      const contentElement = document.getElementById("contact-content");
      const headElement = contactElement?.querySelector("header") ?? null;
      const footerElement = document.getElementById("site-footer");
      let pool: RiverPoolAnchor | null = null;
      if (contactElement) {
        const bounds = contactElement.getBoundingClientRect();
        const style = getComputedStyle(contactElement);
        const padTop = parseFloat(style.paddingTop) || 0;
        const padBottom = parseFloat(style.paddingBottom) || 0;
        const docWidth = document.documentElement.clientWidth;
        const contactTop = bounds.top + window.scrollY;
        const top = contactTop + padTop; // Contact's hairline is the lake surface
        const bottom = Math.max(document.documentElement.scrollHeight, contactTop + bounds.height);
        const contactBottom = contactTop + bounds.height;
        // The reflection lives in the open-water band Contact reserves for it.
        const reflectionElement = document.getElementById("contact-reflection");
        const reflectionRect = reflectionElement?.getBoundingClientRect();
        const reflectHalfWidth = reflectionRect
          ? Math.min(420, docWidth * 0.42)
          : Math.min(280, docWidth * 0.38);
        const reflectHalfHeight = reflectionRect
          ? Math.min(reflectionRect.height * 0.42, reflectHalfWidth * 0.5)
          : Math.min(100, reflectHalfWidth * 0.4, Math.max(padBottom, 240) * 0.42);
        const reflectX = reflectionRect
          ? reflectionRect.left + reflectionRect.width / 2
          : docWidth / 2;
        const reflectY = reflectionRect
          ? reflectionRect.top + window.scrollY + reflectionRect.height / 2
          : contactBottom - Math.max(padBottom, 240) * 0.5;
        const docRect = (el: Element | null, pad: number) => {
          if (!el) return [0, 0, 0, 0];
          const r = el.getBoundingClientRect();
          return [r.left - pad, r.top + window.scrollY - pad, r.right + pad, r.bottom + window.scrollY + pad];
        };
        const head = docRect(headElement, 24);
        const content = docRect(contentElement, 24);
        const calm = headElement && contentElement
          ? [Math.min(head[0], content[0]), head[1] + 48, Math.max(head[2], content[2]), content[3]]
          : content; // starts 48px under the hairline so the impact glow stays bright
        const calm2 = docRect(footerElement, 0);
        pool = {
          centerX: docWidth / 2, centerY: (top + bottom) / 2,
          radiusX: docWidth / 2, radiusY: Math.max((bottom - top) / 2, 1),
          impactX: docWidth / 2, impactY: top,
          reflectX, reflectY,
          reflectHalfWidth, reflectHalfHeight,
          calmLeft: calm[0], calmTop: calm[1], calmRight: calm[2], calmBottom: calm[3],
          calm2Left: calm2[0], calm2Top: calm2[1], calm2Right: calm2[2], calm2Bottom: calm2[3],
        };
      }
      const nextPath = buildRiverPath({
        fit: fit.current,
        heroBottom,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        sections,
        pool,
        calmRects,
      });
      riverPathRef.current = nextPath;
      setRiverPath(nextPath);
      requestRender();
    };

    updateFit();
    const observer = new ResizeObserver(updateFit);
    observer.observe(document.body);
    if (anchor) observer.observe(anchor);
    window.addEventListener("resize", updateFit);
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) updateFit();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("resize", updateFit);
    };
  }, [requestRender, snapshot.anchor, snapshot.kind, snapshot.region]);

  useEffect(() => {
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const region = snapshot.region;
    const onPointerMove = (event: PointerEvent) => {
      if (motion.current.reduced || !finePointer.matches || event.pointerType === "touch") return;
      if (!region) return;
      const rect = region.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      motion.current.y = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)) * 0.12;
      motion.current.x = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)) * 0.07;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
      pointer.current.active = true;
    };
    const resetTilt = () => {
      motion.current.x = 0;
      motion.current.y = 0;
      pointer.current.active = false;
    };

    region?.addEventListener("pointermove", onPointerMove);
    region?.addEventListener("pointerleave", resetTilt);
    finePointer.addEventListener("change", resetTilt);

    return () => {
      region?.removeEventListener("pointermove", onPointerMove);
      region?.removeEventListener("pointerleave", resetTilt);
      finePointer.removeEventListener("change", resetTilt);
    };
  }, [snapshot.region]);

  useEffect(() => {
    const reducedQuery = window.matchMedia(REDUCED_QUERY);
    motion.current.reduced = reducedQuery.matches;
    let animationUnsubscribe: (() => void) | null = null;
    const startAnimation = () => {
      if (!animationUnsubscribe) animationUnsubscribe = subscribeTicker(drawFrame, 10);
    };
    const stopAnimation = () => {
      animationUnsubscribe?.();
      animationUnsubscribe = null;
    };
    const onPreferenceChange = () => {
      motion.current.reduced = reducedQuery.matches;
      motion.current.x = 0;
      motion.current.y = 0;
      if (motion.current.reduced) {
        stopAnimation();
        requestRender();
      } else {
        oneShotUnsubscribe.current?.();
        oneShotUnsubscribe.current = null;
        dirty.current = true;
        startAnimation();
      }
    };
    const onScroll = () => requestRender();
    const unsubscribeStore = sceneStore.subscribe(requestRender);

    if (motion.current.reduced) requestRender();
    else startAnimation();
    window.addEventListener("scroll", onScroll, { passive: true });
    reducedQuery.addEventListener("change", onPreferenceChange);

    return () => {
      stopAnimation();
      oneShotUnsubscribe.current?.();
      oneShotUnsubscribe.current = null;
      unsubscribeStore();
      window.removeEventListener("scroll", onScroll);
      reducedQuery.removeEventListener("change", onPreferenceChange);
    };
  }, [drawFrame, requestRender]);

  useFrame((_, delta) => {
    const current = outer.current;
    const tilt = inner.current;
    const currentFit = fit.current;
    const wpp = worldPerCssPixel();
    uniforms.uAspect.value = window.innerWidth / Math.max(window.innerHeight, 1);
    uniforms.uDpr.value = dpr;
    uniforms.uPointer.value.set(pointer.current.x, pointer.current.y);
    riverFrameUniforms.uScrollY.value = window.scrollY;
    riverFrameUniforms.uWpp.value = wpp;
    riverFrameUniforms.uDpr.value = dpr;
    riverFrameUniforms.uViewport.value.set(window.innerWidth, window.innerHeight);
    const updateRiver = (time: number, settled = false) => {
      riverFrameUniforms.uTime.value = settled ? REST_TIME : time;
      if (settled) {
        riverFrameUniforms.uFront.value = 1;
        return;
      }
      const path = riverPathRef.current;
      if (!path) {
        riverFrameUniforms.uFront.value = 0;
        return;
      }
      const timeFront = Math.max(0, (time - STREAM_START) * 600 / path.length);
      const scrollFront = sAtViewportBottom(path, window.scrollY + window.innerHeight);
      riverFrameUniforms.uFront.value = Math.min(1, Math.max(timeFront, scrollFront));
    };
    const updateStatueAttachment = (time: number, settled = false) => {
      const statueGroup = statue.current;
      const path = riverPathRef.current;
      if (!statueGroup || !path) {
        riverFrameUniforms.uPourOffset.value.set(0, 0);
        return;
      }
      const sway = settled ? 0 : Math.sin((time * TAU) / 14) * 0.04;
      statueGroup.rotation.y = STATUE.rotY + sway;
      const pourPoint = statueGroup.localToWorld(new Vector3(...STATUE_POUR_POINT));
      const projected = pourPoint.project(camera);
      const liveX = (projected.x + 1) * window.innerWidth * 0.5;
      const liveY = (1 - projected.y) * window.innerHeight * 0.5 + window.scrollY;
      statuePourPointPx.current = { x: liveX, y: liveY - window.scrollY };
      riverFrameUniforms.uPourOffset.value.set(
        liveX - path.samples[0],
        liveY - path.samples[1]
      );
    };

    if (current && currentFit) {
      const [x, y] = docToWorld(currentFit.centerXDocPx, currentFit.centerYDocPx, window.scrollY);
      current.position.set(x, y, 0);
      current.scale.setScalar(currentFit.pxPerUnit * wpp);
      uniforms.uScale.value = currentFit.pxPerUnit * dpr;
      uniforms.uHeroDim.value = 1;
    }

    if (motion.current.reduced) {
      clock.current = Math.max(clock.current, REST_TIME);
      uniforms.uTime.value = REST_TIME;
      uniforms.uSettled.value = 1;
      pulseFade.value = 0;
      if (tilt) tilt.rotation.set(0, 0, 0);
      updateStatueAttachment(REST_TIME, true);
      updateRiver(REST_TIME, true);
      poolFill.current = 1;
      poolUniforms.uFill.value = 1;
      poolUniforms.uSettled.value = 1;
      poolUniforms.uFillStart.value = -1000;
      uniforms.uScrollDissolve.value = 0;
      uniforms.uPointerStrength.value = 0;
      return;
    }
    if (!frameReady.current) {
      updateStatueAttachment(clock.current);
      updateRiver(clock.current);
      return;
    }

    uniforms.uSettled.value = 0;
    const dt = Math.min(delta, 0.05);
    clock.current += dt;
    uniforms.uTime.value = clock.current;
    pulseFade.value = Math.min(Math.max((clock.current - PULSE_START) / PULSE_FADE_IN, 0), 1);
    uniforms.uPointerStrength.value += ((pointer.current.active ? 1 : 0) - uniforms.uPointerStrength.value) * (1 - Math.exp(-6 * dt));
    uniforms.uScrollDissolve.value = Math.min(1, Math.max(0, window.scrollY / Math.max(heroHeight.current * 0.85, 1)));

    if (tilt) {
      const damping = 1 - Math.exp(-10 * dt);
      tilt.rotation.x += (motion.current.x - tilt.rotation.x) * damping;
      tilt.rotation.y += (motion.current.y - tilt.rotation.y) * damping;
      if (Math.abs(motion.current.x - tilt.rotation.x) <= 0.0005 && Math.abs(motion.current.y - tilt.rotation.y) <= 0.0005) {
        tilt.rotation.x = motion.current.x;
        tilt.rotation.y = motion.current.y;
      }
    }
    updateStatueAttachment(clock.current);
    updateRiver(clock.current);

    poolUniforms.uSettled.value = 0;
    const activePath = riverPathRef.current;
    if (activePath && poolFill.current < 1 && riverFrameUniforms.uFront.value >= 0.999) {
      const impactScreenY = activePath.pool.impactY - window.scrollY;
      const poolBottomScreenY = activePath.pool.centerY + activePath.pool.radiusY - window.scrollY;
      const onScreen = impactScreenY < window.innerHeight * 0.85 && poolBottomScreenY > 0;
      if (onScreen) {
        if (poolFill.current === 0) poolUniforms.uFillStart.value = clock.current;
        poolFill.current = Math.min(1, poolFill.current + dt / POOL_FILL_SECONDS);
      }
    }
    poolUniforms.uFill.value = poolFill.current;

    if (import.meta.env.DEV && current && tilt && currentFit) {
      const center = tilt.localToWorld(new Vector3(0, FRAME_CENTER_Y, 0));
      const projected = center.project(camera);
      window.__aquariusDebug = {
        anchorCenterPx: {
          x: currentFit.centerXDocPx,
          y: currentFit.centerYDocPx - window.scrollY,
        },
        groupCenterPx: {
          x: (projected.x + 1) * window.innerWidth / 2,
          y: (1 - projected.y) * window.innerHeight / 2,
        },
        sceneTime: clock.current,
        statueLoaded: Boolean(statue.current),
        pourPointPx: statuePourPointPx.current,
      };
    }
  });

  return (
    <>
      <ContextGuard />
      <group ref={outer}>
        <group ref={inner} position={[0, -FRAME_CENTER_Y, 0]}>
          <Starfield shared={uniforms} mobile={riverPath?.mobile ?? false} />
          <Lines shared={uniforms} />
          <Stars shared={uniforms} />
          <Pulses shared={uniforms} fade={pulseFade} />
          <AquariusStatue shared={uniforms} statueRef={statue} onLoaded={requestRender} />
          {/* The River remains outside this hero-anchored, pointer-tilted group. */}
        </group>
      </group>
      {riverPath && (
        <>
          <River path={riverPath} frameUniforms={riverFrameUniforms} />
          <RiverPool
            pool={riverPath.pool}
            mobile={riverPath.mobile}
            frameUniforms={riverFrameUniforms}
            stateUniforms={poolUniforms}
          />
        </>
      )}
    </>
  );
};

const SceneLayer = () => (
  <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <Canvas
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      camera={{ fov: CAMERA_FOV, position: [0, 0, CAMERA_DISTANCE], near: 0.1, far: 100 }}
      frameloop="never"
    >
      <SceneController />
    </Canvas>
  </div>
);

export default SceneLayer;
