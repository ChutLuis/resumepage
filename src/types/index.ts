export type NavId = "work" | "experience" | "about" | "contact";
export type WorkId =
  | "mobile-platform"
  | "socialhub"
  | "jersey-guatemala"
  | "portfolio-analytics"
  | "socializa"
  | "comal"
  | "erp-pymes";
export type ExperienceId = "telus" | "hmd" | "holland" | "adslive";
export type TestimonialId = "emmanuel" | "lisa" | "andres";
export type TechGroupId = "mobile" | "backend" | "frontend";
export type SchematicLayerId = "screen" | "platform" | "server";

export interface NavLink {
  id: NavId;
  title: string;
}

/**
 * A row in the "Selected Work" numbered index. Copy (name / descriptor /
 * paragraph / link label / placeholder label) comes from the i18n dictionary;
 * the fields here are locale-independent.
 */
export interface WorkItem {
  id: WorkId;
  /** Inline status chip; omit for none. */
  status?: "production" | "live" | "case-study" | "flagship";
  /** Mono stack line, e.g. "nextjs 15 · nestjs · redis/bullmq · s3". */
  stack: string;
  /**
   * Outbound link. Omit when there is no safe public destination yet (e.g. a
   * case study write-up/video that hasn't been published, or the work is
   * proprietary with no public artifact) — Works.tsx renders no link at all
   * in that case rather than pointing at a dead end.
   */
  url?: string;
  /** Imported thumbnail; when omitted the row renders a labeled placeholder. */
  image?: string;
  /**
   * Marks the single lead item Works.tsx renders as the featured case study
   * above the numbered "Also built" list. Exactly one item should carry this.
   */
  featured?: boolean;
}

export interface Technology {
  name: string;
  icon: string;
}

export interface TechGroup {
  id: TechGroupId;
  items: Technology[];
}

/** Non-translated experience fields; title/date/summary come from i18n. */
export interface Experience {
  id: ExperienceId;
  company_name: string;
  icon: string;
  /** Start year shown large in the rail. Decorative, rendered aria-hidden. */
  startYear: number;
  /** Marks the current role; exactly one entry should set this. */
  current?: boolean;
}

/** Non-translated testimonial fields; testimonial/designation come from i18n. */
export interface Testimonial {
  id: TestimonialId;
  name: string;
}

export interface MotionVariants {
  hidden?: {
    x?: number | string;
    y?: number | string;
    opacity?: number;
    scale?: number;
  };
  show?: {
    x?: number | string;
    y?: number | string;
    opacity?: number;
    scale?: number;
    transition?: {
      type?: string;
      delay?: number;
      duration?: number;
      ease?: string;
      staggerChildren?: number;
      delayChildren?: number;
    };
  };
}
