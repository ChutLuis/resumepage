import { useEffect } from "react";
import Lenis from "lenis";
import scrollState from "../lib/scrollState";
import { subscribeTicker } from "../lib/ticker";

/**
 * Initializes Lenis smooth scrolling for the whole document and keeps the
 * shared `scrollState` (velocity/progress) up to date for animation loops.
 *
 * Behavior:
 * - Lenis has no rAF loop of its own: it advances from the shared ticker at priority 0,
 *   so the WebGL scene (priority 10) always renders after the scroll position is updated.
 * - Disabled entirely under `prefers-reduced-motion` (native scroll is kept,
 *   and IntersectionObserver / Framer `useScroll` keep working because Lenis
 *   drives the real window scroll position).
 * - Intercepts in-page anchor clicks (e.g. `#work`) for a smooth, offset-aware
 *   scrollTo that clears the fixed navbar.
 */
const SmoothScroll = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    let maxVel = 1;
    const onScroll = () => {
      // Normalize velocity to a stable ~[-1, 1] range for shader uniforms.
      maxVel = Math.max(maxVel, Math.abs(lenis.velocity));
      scrollState.velocity = lenis.velocity / maxVel;
      scrollState.progress = lenis.progress;
    };
    lenis.on("scroll", onScroll);

    const unsubscribe = subscribeTicker((time) => {
      lenis.raf(time);
      // Decay velocity toward 0 so the shader settles when scrolling stops.
      scrollState.velocity *= 0.9;
    }, 0);

    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      unsubscribe();
      lenis.destroy();
      scrollState.velocity = 0;
    };
  }, []);

  return null;
};

export default SmoothScroll;
