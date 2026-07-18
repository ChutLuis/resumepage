import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Max-width (1200px) section container with 40px side padding and a
 * sticky-nav-safe scroll anchor. Matches the handoff layout grid.
 */
export const Section = ({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) => (
  <section
    id={id}
    className={`mx-auto w-full max-w-content scroll-mt-24 px-6 sm:px-10 ${className}`}
  >
    {children}
  </section>
);

/**
 * Single subtle fade-up entrance (24px, 0.6s ease-out) — the only section
 * motion in the redesign. Collapses to a plain fade when the user prefers
 * reduced motion.
 */
export const Reveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.6, ease: "easeOut", delay },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

/** Mono uppercase section eyebrow (IBM Plex Mono, 12px, +0.1em, #9ea0b8). */
export const Eyebrow = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={`font-mono text-[12px] uppercase tracking-eyebrow text-body ${className}`}
  >
    {children}
  </p>
);
