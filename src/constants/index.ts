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
  SocializaShowcase,
  PortfolioShowcase,
  ErpShowcase,
  SocialhubShowcase,
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
 * numbered "Also built" list. No public URL and no screenshot: this is
 * proprietary production work (the TELUS customer app), described by
 * mechanism rather than by artifact. PIN: replace this with the Waymark
 * case study once it has a public repo, RLS tests, and real screenshots —
 * the copy/story here is a placeholder until that ships.
 */
const featuredWork: WorkItem = {
  id: "mobile-platform",
  status: "flagship",
  featured: true,
  stack: "react native · typescript · node · nestjs",
};

/**
 * "Also built" numbered index — every row uses a real/live screenshot.
 * SocialHub is a case study (not a live link): its public demo sits behind
 * an Auth0 tenant with no self-serve signup, so linking to it directly would
 * dead-end a visitor. A short demo video / write-up replaces the live link
 * until a proper guest/demo account exists.
 */
const secondaryWork: WorkItem[] = [
  {
    id: "socialhub",
    status: "case-study",
    stack: "nextjs 15 · nestjs · redis/bullmq · s3",
    // No public URL: the live app sits behind Auth0 with no self-serve
    // signup. A demo video replaces the link until a guest account exists.
    image: SocialhubShowcase,
  },
  {
    id: "erp-pymes",
    status: "live",
    stack: "react router · prisma · postgresql · tailwind",
    url: "https://pos.lfortiz.com",
    image: ErpShowcase,
  },
  {
    id: "socializa",
    stack: "react router · tailwind · framer motion · three.js · braintree",
    url: "https://landing.socializa.io/",
    image: SocializaShowcase,
  },
  {
    id: "portfolio-analytics",
    stack: "react router · tailwind · recharts · three.js · docker",
    url: "https://github.com/ChutLuis/portfolio-analytics-dashboard",
    image: PortfolioShowcase,
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
  { id: "telus", company_name: "TELUS Digital Solutions", icon: telus },
  { id: "hmd", company_name: "Hidden Mountain Data", icon: hmd },
  { id: "holland", company_name: "Holland Orchids", icon: hollandOrchids },
  { id: "adslive", company_name: "Adslivemedia Corp.", icon: adslive },
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
  // "Also built" — numbered 01-05 independent of the featured item above it.
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
