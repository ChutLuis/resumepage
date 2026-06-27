import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  /** Target value to count up to */
  value: number;
  /** Text appended after the number, e.g. "+", "%", "K" */
  suffix?: string;
  /** Text shown before the number */
  prefix?: string;
  /** Animation duration in ms */
  duration?: number;
  className?: string;
}

/**
 * Counts up from 0 to `value` once it scrolls into view.
 * Respects prefers-reduced-motion by snapping straight to the value.
 */
const AnimatedCounter = ({
  value,
  suffix = "",
  prefix = "",
  duration = 1600,
  className = "",
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo for a satisfying settle
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
