import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Fragment, type ReactNode } from "react";

/** Shared ease for editorial entrances (matches the hero). */
export const EASE = [0.16, 1, 0.3, 1] as const;

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

/** Sentence-case field label (Inter 13px/500, caption colour). */
export const Eyebrow = ({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "h2";
}) => (
  <Tag className={`text-label font-medium text-caption ${className}`}>
    {children}
  </Tag>
);

/** 6x6 status square shown before live/production labels. */
export const StatusDot = () => (
  <span aria-hidden="true" className="mr-2.5 inline-block h-1.5 w-1.5 bg-status align-middle" />
);

/**
 * Section running head: hairline, then a sentence-case violet label over the
 * 44px display title, with an optional quiet "extent" note on the right. The
 * rule draws in and the title words rise out of a mask — the hero's own
 * motion language, one step down in scale.
 *
 * The rule is an absolutely-positioned span, not a border: the header's top
 * edge stays the anchor SceneLayer measures Contact's hairline from, and it is
 * the lake surface.
 */
export const SectionHead = ({
  label,
  title,
  aside,
}: {
  label: string;
  title: string;
  /** Short factual note shown opposite the title, e.g. "5 projects". */
  aside?: string;
}) => {
  const reduced = useReducedMotion();
  const words = title.split(" ");
  const headerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.06,
        delayChildren: reduced ? 0 : 0.1,
      },
    },
  };
  const ruleVariants: Variants = {
    hidden: { scaleX: reduced ? 1 : 0 },
    show: { scaleX: 1, transition: { duration: reduced ? 0 : 1.1, ease: EASE } },
  };
  const wordVariants: Variants = {
    hidden: reduced ? { opacity: 0 } : { y: "105%" },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration: reduced ? 0 : 0.9, ease: EASE },
    },
  };

  return (
    <motion.header
      className="relative flex flex-wrap items-end justify-between gap-x-12 gap-y-4 pt-8"
      variants={headerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-line"
        variants={ruleVariants}
      />
      <div className="min-w-0">
        <p className="text-label font-medium text-accent-300">{label}</p>
        <h2 className="mt-3 max-w-[24ch] text-balance font-display text-display-section font-medium text-heading">
          <span className="sr-only">{title}</span>
          <span aria-hidden="true">
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <motion.span className="inline-block" variants={wordVariants}>
                    {word}
                  </motion.span>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        </h2>
      </div>
      {aside ? <p className="pb-1 text-small text-body">{aside}</p> : null}
    </motion.header>
  );
};

/** Primary CTA: white fill, ink text, 6px radius. */
export const buttonClass =
  "group inline-flex h-12 items-center gap-2 rounded-md bg-heading px-5 text-[15px] font-medium text-primary transition-colors duration-200 hover:bg-white active:bg-body-strong";
/** Compact primary CTA for the nav bar. */
export const buttonSmClass =
  "group inline-flex h-9 items-center gap-2 rounded-md bg-heading px-3.5 text-[14px] font-medium text-primary transition-colors duration-200 hover:bg-white active:bg-body-strong";
export const textLinkClass =
  "group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-heading underline decoration-control underline-offset-4 transition-colors duration-200 hover:text-accent-300 hover:decoration-accent-300";
/** Small bordered tag for stacks and tool tags. */
export const tagClass =
  "inline-flex items-center rounded-md border border-line px-2.5 py-1 text-[13px] leading-[1.4] text-body-strong";

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

/** 14px up-right arrow for links that leave the site (replaces the "↗" glyph). */
export const ArrowUpRight = ({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className={`shrink-0 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px ${className}`}
  >
    <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/** Replaces `{name}` placeholders in a dictionary template. */
export const fillTemplate = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
