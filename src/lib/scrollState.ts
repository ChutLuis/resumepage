/**
 * Lightweight, render-free store for live scroll metrics.
 *
 * R3F's useFrame (Aurora shader) and other animation loops read these values
 * every frame, so we deliberately avoid React state here to prevent re-renders.
 * SmoothScroll writes to it; consumers read the mutable ref.
 */
export const scrollState = {
  /** Normalized, smoothed scroll velocity (roughly -1..1 under fast flicks). */
  velocity: 0,
  /** Overall page scroll progress, 0..1. */
  progress: 0,
};

export default scrollState;
