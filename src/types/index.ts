export type NavId = "about" | "work" | "projects" | "contact";
export type ServiceId = "fullstack" | "mobile" | "cloud" | "architecture";
export type StatId = "years" | "projects" | "languages" | "areas";
export type ExperienceId = "telus" | "hmd" | "holland" | "adslive";
export type TestimonialId = "emmanuel" | "lisa" | "andres";
export type ProjectId = "socializa" | "portfolio-analytics" | "erp-pymes";
export type CaseStudyId = "socialhub" | "jersey-guatemala";

export interface NavLink {
  id: NavId;
  title: string;
}

export interface Service {
  id: ServiceId;
  title: string;
  icon: string;
  /** Key into the custom inline icon map (preferred over the PNG `icon`) */
  iconName?: "fullstack" | "mobile" | "cloud" | "architecture";
  /** Short supporting line shown under the title in the bento grid */
  blurb?: string;
}

export interface Stat {
  id: StatId;
  value: number;
  suffix?: string;
  label: string;
}

export interface Technology {
  name: string;
  icon: string;
}

export interface Experience {
  id: ExperienceId;
  title: string;
  company_name: string;
  icon: string;
  iconBg: string;
  date: string;
  points: string[];
}

export interface Testimonial {
  id: TestimonialId;
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  image: string;
}

export interface Tag {
  name: string;
  color: string;
}

export interface Project {
  id: ProjectId;
  name: string;
  description: string;
  tags: Tag[];
  image: string;
  source_code_link?: string;
  live_link?: string;
}

export interface CaseStudyLink {
  label: string;
  url: string;
  kind: "live" | "source";
}

export interface CaseStudyHighlight {
  text: string;
}

export interface CaseStudy {
  id: CaseStudyId;
  name: string;
  summary: string;
  description: string;
  highlights: CaseStudyHighlight[];
  tags: Tag[];
  links: CaseStudyLink[];
}

// Component prop types
export interface SectionWrapperProps {
  children: React.ReactNode;
  idName: string;
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
