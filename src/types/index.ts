export interface NavLink {
  id: string;
  title: string;
}

export interface Service {
  title: string;
  icon: string;
}

export interface Technology {
  name: string;
  icon: string;
}

export interface Experience {
  title: string;
  company_name: string;
  icon: string;
  iconBg: string;
  date: string;
  points: string[];
}

export interface Testimonial {
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
  name: string;
  description: string;
  tags: Tag[];
  image: string;
  source_code_link?: string;
  live_link?: string;
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