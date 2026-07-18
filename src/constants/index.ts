import {
  javascript,
  typescript,
  reactjs,
  redux,
  tailwind,
  nodejs,
  docker,
  adslive,
  hollandOrchids,
  SocializaShowcase,
  PortfolioShowcase,
  ErpShowcase,
  angular,
  express,
  graphql,
  nest,
  remix,
  terraform,
  hmd,
  telus,
  figma,
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
 * "Selected Work" numbered index. SocialHub and Jersey Guatemala have no image
 * yet, so their rows render labeled placeholders until real screenshots land.
 */
const workItems: WorkItem[] = [
  {
    id: "socialhub",
    status: "production",
    stack: "nextjs 15 · nestjs · redis/bullmq · s3",
    url: "https://app.lfortiz.com",
  },
  {
    id: "jersey-guatemala",
    status: "live",
    stack: "astro 7 · typescript · i18n",
    url: "https://jersey-guatemala-production.up.railway.app",
  },
  {
    id: "portfolio-analytics",
    stack: "react · nestjs · postgresql",
    url: "https://github.com/ChutLuis/portfolio-analytics-upwork",
    image: PortfolioShowcase,
  },
  {
    id: "socializa",
    stack: "react · typescript · tailwind",
    url: "https://landing.socializa.io/",
    image: SocializaShowcase,
  },
  {
    id: "erp-pymes",
    stack: "nextjs · typescript · prisma",
    url: "https://github.com/ChutLuis/erp-pymes",
    image: ErpShowcase,
  },
];

const frontend: Technology[] = [
  { name: "JavaScript", icon: javascript },
  { name: "TypeScript", icon: typescript },
  { name: "React", icon: reactjs },
  { name: "Angular", icon: angular },
  { name: "Remix", icon: remix },
  { name: "Redux", icon: redux },
  { name: "Tailwind", icon: tailwind },
];

const backend: Technology[] = [
  { name: "Node.js", icon: nodejs },
  { name: "NestJS", icon: nest },
  { name: "Express", icon: express },
  { name: "GraphQL", icon: graphql },
];

const infra: Technology[] = [
  { name: "AWS", icon: aws },
  { name: "Docker", icon: docker },
  { name: "Terraform", icon: terraform },
  { name: "Git", icon: git },
  { name: "Figma", icon: figma },
];

const techGroups: TechGroup[] = [
  { id: "frontend", items: frontend },
  { id: "backend", items: backend },
  { id: "infra", items: infra },
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

export { techGroups, experiences, testimonials, workItems };

export const getLocalizedContent = (dictionary: Dictionary) => ({
  navLinks: navLinks.map((link) => ({ ...link, title: dictionary.nav[link.id] })),
  workItems: workItems.map((item, index) => ({
    ...item,
    ...dictionary.work.items[item.id],
    number: String(index + 1).padStart(2, "0"),
    statusLabel: item.status ? dictionary.work.status[item.status] : "",
  })),
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
