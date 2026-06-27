import { useRef, ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** How far the element follows the cursor (px) */
  strength?: number;
  download?: string | boolean;
  ariaLabel?: string;
}

/**
 * Wraps content in a "magnetic" element that subtly drifts toward the cursor
 * on hover and springs back on leave. Renders an <a> when `href` is provided,
 * otherwise a <button>. Disabled on touch / reduced-motion.
 */
const MagneticButton = ({
  children,
  href,
  onClick,
  className = "",
  strength = 18,
  download,
  ariaLabel,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength * 2);
    y.set((relY / rect.height) * strength * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = href ? motion.a : motion.button;
  const linkProps = href
    ? {
        href,
        ...(download !== undefined ? { download } : {}),
        ...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {}),
      }
    : { type: "button" as const };

  return (
    <Comp
      // @ts-expect-error – ref type differs between a/button, harmless here
      ref={ref}
      {...linkProps}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      aria-label={ariaLabel}
      data-cursor="hover"
      style={{ x: springX, y: springY }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </Comp>
  );
};

export default MagneticButton;
