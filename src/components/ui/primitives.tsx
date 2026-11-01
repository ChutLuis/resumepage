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
      viewport={{ once: true, amount: "some" }}
    >
      {children}
    </motion.div>
  );
};

/** Mono uppercase section eyebrow (IBM Plex Mono, 12px, +0.1em, #9ea0b8). */
export const Eyebrow = ({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "h2";
}) => (
  <Tag
    className={`font-mono text-[12px] uppercase tracking-eyebrow text-body ${className}`}
  >
    {children}
  </Tag>
);

/** Editorial running head: hairline, mono index + label rail (3 cols), display title (9 cols). */
export const SectionHead = ({ index, label, title }: { index: string; label: string; title: string }) => (
  <header className="grid grid-cols-1 gap-y-5 border-t border-line pt-6 lg:grid-cols-12 lg:gap-x-10 lg:pt-8">
    <p className="font-mono text-[12px] uppercase tracking-eyebrow text-body lg:col-span-3 lg:pt-4">
      <span className="tabular-nums text-accent-300">{index}</span>
      <span aria-hidden="true" className="mx-2 text-line">/</span>
      {label}
    </p>
    <h2 className="max-w-[20ch] text-balance font-display text-[34px] font-medium leading-[1.04] tracking-[-0.035em] text-heading sm:text-[44px] lg:col-span-9 lg:text-[56px]">
      {title}
    </h2>
  </header>
);

export const buttonClass =
  "group inline-flex min-h-11 items-center gap-3 rounded-[4px] bg-accent-400 px-5 py-3 text-[15px] font-semibold text-primary transition-colors duration-200 hover:bg-accent-300 active:bg-accent-200";
export const textLinkClass =
  "inline-flex min-h-11 items-center text-[15px] font-medium text-heading underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-accent-300 hover:decoration-accent-300";

/** 16px arrow used inside buttons/CTAs (replaces the "→" glyph). */
export const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={`transition-transform duration-200 group-hover:translate-x-0.5 ${className}`}
  >
    <path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
