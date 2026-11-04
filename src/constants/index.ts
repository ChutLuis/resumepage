import {
  javascript,
  typescript,
  reactjs,
  reactNative,
  expo,
  tailwind,
  nodejs,
  docker,
  adslive,
  hollandOrchids,
  ComalShowcase,
  WaymarkShowcase,
  WaymarkWebShowcase,
  express,
  nest,
  prisma,
  postgresql,
  hmd,
  telus,
  aws,
  git,
} from "../assets";
import type {
  NavLink,
  Technology,
  TechGroup,
  Experience,
  Testimonial,
  WorkItem,
} from "../types";
import type { Dictionary } from "../i18n/translations";

export const navLinks: NavLink[] = [
  { id: "work", title: "Work" },
  { id: "experience", title: "Experience" },
  { id: "about", title: "About" },
  { id: "contact", title: "Contact" },
];

/**
 * Featured case study — the single lead item Works.tsx renders above the
 * numbered "Also built" list. Waymark is a real product with a public repo,
 * RLS proven by a pgTAP suite, and real product screenshots.
 */
const featuredWork: WorkItem = {
  id: "waymark",
  status: "public",
  featured: true,
  stack: "expo · react native · supabase · reanimated · tanstack query",
  url: "https://github.com/ChutLuis/waymark",
  image: WaymarkShowcase,
};

/**
 * "Also built" numbered index — every row uses a real/live screenshot.
 */
const secondaryWork: WorkItem[] = [
  {
    id: "waymark-web",
    status: "live",
    stack: "astro · three.js · lottie · railway",
    url: "https://waymark-web-production.up.railway.app",
    image: WaymarkWebShowcase,
  },
  {
    id: "comal",
    status: "live",
    stack: "react router · prisma · postgresql · tailwind",
    url: "https://comal.lfortiz.com",
    image: ComalShowcase,
  },
];

const workItems: WorkItem[] = [featuredWork, ...secondaryWork];

/**
 * Capability groups, replacing the old "keyword grid" (Angular, Remix, Redux,
 * GraphQL, Terraform, Figma). Mobile leads — it's the differentiator — and
 * every entry here is something actively used in production work, not a
 * one-off exposure.
 */
const mobile: Technology[] = [
  { name: "React Native", icon: reactNative },
  { name: "Expo", icon: expo },
  { name: "TypeScript", icon: typescript },
];

const backend: Technology[] = [
  { name: "Node.js", icon: nodejs },
  { name: "NestJS", icon: nest },
  { name: "Prisma", icon: prisma },
  { name: "PostgreSQL", icon: postgresql },
  { name: "AWS", icon: aws },
];

const frontend: Technology[] = [
  { name: "React", icon: reactjs },
  { name: "JavaScript", icon: javascript },
  { name: "Tailwind", icon: tailwind },
  { name: "Express", icon: express },
  { name: "Docker", icon: docker },
  { name: "Git", icon: git },
];

const techGroups: TechGroup[] = [
  { id: "mobile", items: mobile },
  { id: "backend", items: backend },
  { id: "frontend", items: frontend },
];

const experiences: Experience[] = [
  { id: "telus", company_name: "TELUS Digital Solutions", icon: telus, startYear: 2024, current: true },
  { id: "hmd", company_name: "Hidden Mountain Data", icon: hmd, startYear: 2024 },
  { id: "holland", company_name: "Holland Orchids", icon: hollandOrchids, startYear: 2023 },
  { id: "adslive", company_name: "Adslivemedia Corp.", icon: adslive, startYear: 2021 },
];

const testimonials: Testimonial[] = [
  { id: "emmanuel", name: "Emmanuel Alvarado" },
  { id: "lisa", name: "Lisa Gonzáles Solé" },
  { id: "andres", name: "Andres Gálvez" },
];

export { techGroups, experiences, testimonials, workItems, featuredWork, secondaryWork };

const localizeWorkItem = (dictionary: Dictionary) => (item: WorkItem, index: number) => ({
  ...item,
  ...dictionary.work.items[item.id],
  number: String(index + 1).padStart(2, "0"),
  statusLabel: item.status ? dictionary.work.status[item.status] : "",
});

export const getLocalizedContent = (dictionary: Dictionary) => ({
  navLinks: navLinks.map((link) => ({ ...link, title: dictionary.nav[link.id] })),
  // Featured case study, rendered separately and without a number.
  featuredWork: {
    ...featuredWork,
    ...dictionary.work.items[featuredWork.id],
    statusLabel: featuredWork.status ? dictionary.work.status[featuredWork.status] : "",
  },
  // "Also built" — numbered from 01, independent of the featured item above it.
  workItems: secondaryWork.map(localizeWorkItem(dictionary)),
  techGroups: techGroups.map((group) => ({
    ...group,
    label: dictionary.tech.groups[group.id],
  })),
  experiences: experiences.map((experience) => ({
    ...experience,
    ...dictionary.experience.items[experience.id],
  })),
  testimonials: testimonials.map((testimonial) => ({
    ...testimonial,
    ...dictionary.testimonials.items[testimonial.id],
  })),
});
