export type NavId = "work" | "experience" | "about" | "contact";
export type WorkId =
  | "socialhub"
  | "jersey-guatemala"
  | "portfolio-analytics"
  | "socializa"
  | "erp-pymes";
export type ExperienceId = "telus" | "hmd" | "holland" | "adslive";
export type TestimonialId = "emmanuel" | "lisa" | "andres";
export type TechGroupId = "frontend" | "backend" | "infra";

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
  status?: "production" | "live";
  /** Mono stack line, e.g. "nextjs 15 · nestjs · redis/bullmq · s3". */
  stack: string;
  url: string;
  /** Imported thumbnail; when omitted the row renders a labeled placeholder. */
  image?: string;
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
