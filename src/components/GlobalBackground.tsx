import { lazy, Suspense, useEffect, useRef, useState } from "react";

const BackgroundScene = lazy(() => import("./canvas/BackgroundScene"));

/**
 * Persistent, full-page WebGL background.
 *
 * One scene lives behind the entire document (fixed, pointer-events-none) and
 * every section's real DOM content layers on top of it. This is the site's
 * single signature WebGL moment — an aurora shader whose palette glides with
 * scroll, plus a 3D parallax particle field you "fly" through as you read.
 *
 * Responsibility split:
 * - Fidelity scales with the device (particle count + DPR) so the *same* scene
 *   runs everywhere without becoming janky on phones.
 * - `prefers-reduced-motion` freezes to a static CSS aurora (accessibility,
 *   non-negotiable) instead of the animated canvas.
 * - The render loop pauses when the tab is hidden to spare battery/GPU.
 */
const GlobalBackground = () => {
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [tier, setTier] = useState<{ particleCount: number; maxDpr: number }>({
    particleCount: 4000,
    maxDpr: 1.75,
  });
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(reducedMQ.matches);
    const onReduced = (e: MediaQueryListEvent) => setReduced(e.matches);
    reducedMQ.addEventListener?.("change", onReduced);

    // Scale fidelity to the viewport so phones stay smooth (same look, fewer
    // points + lower DPR ceiling) while desktops get the full field.
    const w = window.innerWidth;
    if (w < 640) setTier({ particleCount: 1800, maxDpr: 1.5 });
    else if (w < 1280) setTier({ particleCount: 3500, maxDpr: 1.6 });
    else setTier({ particleCount: 6000, maxDpr: 1.75 });

    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      reducedMQ.removeEventListener?.("change", onReduced);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Static base — the reduced-motion experience and the lazy-load placeholder. */}
      <div className="absolute inset-0 bg-aurora-fallback" />
      {!reduced && (
        <Suspense fallback={null}>
          <BackgroundScene
            active={visible}
            particleCount={tier.particleCount}
            maxDpr={tier.maxDpr}
          />
        </Suspense>
      )}
    </div>
  );
};

export default GlobalBackground;
