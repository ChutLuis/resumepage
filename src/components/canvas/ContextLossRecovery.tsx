import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Handles WebGL context loss/restoration for a Canvas.
 *
 * Render this as a child of <Canvas>. When the GPU drops the WebGL context
 * (common on mobile, tab switches, or when many contexts are alive), the
 * browser will permanently lose it unless `preventDefault()` is called on the
 * `webglcontextlost` event. On restore we `invalidate()` so the `frameloop="demand"`
 * canvas redraws itself.
 *
 * This replaces the previous approach of remounting the whole canvas with a
 * `key={Date.now()}` on every scroll, which was expensive and could itself
 * trigger context loss by churning WebGL contexts.
 */
const ContextLossRecovery = () => {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      // Allows the browser to fire `webglcontextrestored` later.
      event.preventDefault();
    };

    const handleContextRestored = () => {
      // Redraw now that the context is back (frameloop is "demand").
      invalidate();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl, invalidate]);

  return null;
};

export default ContextLossRecovery;
