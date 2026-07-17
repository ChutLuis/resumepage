import {
  mobile,
  backend,
  creator,
  web,
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
  Service,
  Stat,
  Technology,
  Experience,
  Testimonial,
  Project,
  CaseStudy,
} from "../types";
import type { Dictionary } from "../i18n/translations";

export const navLinks: NavLink[] = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: Service[] = [
  {
    id: "fullstack",
    title: "Full-Stack Web Development",
    icon: web,
    iconName: "fullstack",
    blurb: "React, Vue & Angular front-ends backed by Node, NestJS & Express.",
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    icon: mobile,
    iconName: "mobile",
    blurb: "Native enhancements and React Native migrations at scale.",
  },
  {
    id: "cloud",
    title: "Cloud & DevOps Solutions",
    icon: backend,
    iconName: "cloud",
    blurb: "AWS infrastructure, CI/CD and Terraform for reliable delivery.",
  },
  {
    id: "architecture",
    title: "Product & System Architecture",
    icon: creator,
    iconName: "architecture",
    blurb: "Maintainable technical foundations from prototype to production.",
  },
];

const stats: Stat[] = [
  { id: "years", value: 4, suffix: "+", label: "Years of experience" },
  { id: "projects", value: 20, suffix: "+", label: "Projects delivered" },
  { id: "languages", value: 2, suffix: "", label: "Working languages" },
  { id: "areas", value: 4, suffix: "", label: "Delivery areas" },
];

const technologies: Technology[] = [
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Nest JS",
    icon: nest,
  },
  {
    name: "Express",
    icon: express,
  },
  {
    name: "GraphQL",
    icon: graphql,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Figma",
    icon: figma,
  },
  {
    name: "AWS",
    icon: aws,
  },
  {
    name: "Docker",
    icon: docker,
  },
  {
    name: "Git",
    icon: git,
  },
  {
    name: "Angular",
    icon: angular,
  },
  {
    name: "Remix Run",
    icon: remix,
  },
  {
    name: "Terraform",
    icon: terraform,
  },
];

const experiences: Experience[] = [
  {
    id: "telus",
    title: "Senior Applications Developer",
    company_name: "TELUS Digital Solutions",
    icon: telus,
    iconBg: "#E6DEDD",
    date: "October 2024 - Present",
    points: [
      "Architected and implemented key enhancements for native mobile applications, improving app performance by 40% and increasing user engagement metrics by 35%.",
      "Actively contributing to the strategic migration of the native codebase to React Native, designing reusable components to accelerate the project timeline by 30% and reduce development overhead.",
    ],
  },
  {
    id: "hmd",
    title: "Fullstack Engineer",
    company_name: "Hidden Mountain Data",
    icon: hmd,
    iconBg: "#E6DEDD",
    date: "Sept 2024 - October 2024",
    points: [
      "As a key contractor on an LLM project, rapidly developed and delivered a full-stack internal tool using Vue.js and NestJS within a tight 2-week deadline, meeting all technical requirements.",
      "Engineered the backend system, including the database schema with Prisma and PostgreSQL, enabling efficient data processing for the language model with 60% faster query performance and 45% improved data throughput.",
    ],
  },
  {
    id: "holland",
    title: "Software Engineer",
    company_name: "Holland Orchids",
    icon: hollandOrchids,
    iconBg: "#E6DEDD",
    date: "May 2023 - Jun 2024",
    points: [
      "Led the full lifecycle of a new internal software suite, from initial UI/UX prototypes in Figma to full-stack development and deployment, which replaced an outdated legacy tool and reduced operational time by 70%.",
      "Improved the stability and performance of existing React legacy systems, reducing crashes by 95%, improving load times by 50%, and managed their on-premises server infrastructure with 99.8% uptime.",
    ],
  },
  {
    id: "adslive",
    title: "Web Developer",
    company_name: "Adslivemedia Corp.",
    icon: adslive,
    iconBg: "#383E56",
    date: "March 2021 - May 2023",
    points: [
      "Developed and deployed 12+ full-stack client websites using React, Vue, and Node.js, resulting in an average 45% increase in client engagement and conversion rates.",
      "Managed all aspects of cloud infrastructure on AWS, including service deployment, monitoring, and administration, achieving 99.9% uptime and reducing infrastructure costs by 30%.",
      "Pioneered the company's Web Augmented Reality offerings by building 8+ interactive AR experiences with A-Frame and Three.js, leading to a 60% increase in client engagement and securing 5 new enterprise contracts.",
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    id: "emmanuel",
    testimonial:
      "Luis proved to be a valuable member of any team he is in. Only his ambitions exceed his achievements.",
    name: "Emmanuel Alvarado",
    designation: "ITS DevOps Engineer",
    company: "Allied Global Technology Services",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQE7g-X3TFP0fw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1671477031793?e=1753315200&v=beta&t=YUUcyyGq-t2carst0siL_oE2OPw62M6GruhxFnR2p1A",
  },
  {
    id: "lisa",
    testimonial:
      "He proved to be an honest, respectful, responsible, and hardworking individual. Under my supervision, he worked as a programmer for a custom-made application and website system.",
    name: "Lisa Gonzáles Solé",
    designation: "Marketing and sales manager",
    company: "Holland Orchids",
    image:
      "https://media.licdn.com/dms/image/D4E03AQHd7_l9-Z2Dgg/profile-displayphoto-shrink_200_200/0/1678215473375?e=2147483647&v=beta&t=DXAWM02sJEsLixe8pgY5SryKju7suCm-_hN6QgJx_aY",
  },
  {
    id: "andres",
    testimonial:
      "He was a key member of our team at Adslivemedia Corp. He consistently delivered high-quality work and was always ready to mentor junior developers. Working with Luis was a pleasure, and his problem-solving skills and dedication were truly impressive.",
    name: "Andres Gálvez ",
    designation: "Product Owner | Full Stack Dev | AWS Certified",
    company: "AdsLive Media",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQEBSfrNFlnFAg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1712132607867?e=1753315200&v=beta&t=8UTSZj-Se8FwGVkW7OWJiVtc0Y_41ViYdB8NjqspoE0",
  },
];

const projects: Project[] = [
  {
    id: "socializa",
    name: "Socializa.io Landing Page",
    description:
      "Marketing site for Socializa.io, a social media management platform. Built with React, TypeScript, Tailwind, and purposeful motion design.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "typescript",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: SocializaShowcase,
    live_link: "https://landing.socializa.io/",
  },
  {
    id: "portfolio-analytics",
    name: "Portfolio Analytics Dashboard",
    description:
      "Full-stack analytics dashboard built with a React frontend, NestJS API, PostgreSQL, and cloud deployment. A technical demonstration of a data-intensive product workflow.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nestjs",
        color: "green-text-gradient",
      },
      {
        name: "postgresql",
        color: "pink-text-gradient",
      },
    ],
    image: PortfolioShowcase,
    source_code_link: "https://github.com/ChutLuis/portfolio-analytics-upwork",
    live_link: "https://portfolio-analytics-upwork-production.up.railway.app/",
  },
  {
    id: "erp-pymes",
    name: "ERP System for SMEs",
    description:
      "Product prototype for small and medium businesses, with inventory, financial, customer, and employee workflows. Built with Next.js, TypeScript, and Prisma.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "typescript",
        color: "green-text-gradient",
      },
      {
        name: "prisma",
        color: "pink-text-gradient",
      },
    ],
    image: ErpShowcase,
    source_code_link: "https://github.com/ChutLuis/erp-pymes",
  },
];

const caseStudies: CaseStudy[] = [
  {
    id: "socialhub",
    name: "SocialHub",
    summary: "Full-stack social media management platform",
    description:
      "A live social media management platform for scheduling and publishing across connected accounts. Built with a Next.js 15 / React 19 frontend and a NestJS API, backed by Prisma on MySQL with Redis and BullMQ for background jobs.",
    highlights: [
      { text: "Auth0 authentication with workspace-based RBAC" },
      { text: "Social OAuth connections with automatic token refresh" },
      { text: "Post scheduling powered by Redis + BullMQ queues" },
      { text: "Media handling via AWS S3 presigned uploads" },
    ],
    tags: [
      { name: "nextjs", color: "blue-text-gradient" },
      { name: "nestjs", color: "green-text-gradient" },
      { name: "prisma-mysql", color: "pink-text-gradient" },
      { name: "aws-s3", color: "orange-text-gradient" },
    ],
    links: [
      {
        label: "View SocialHub live site",
        url: "https://app.lfortiz.com",
        kind: "live",
      },
    ],
  },
  {
    id: "jersey-guatemala",
    name: "Jersey Guatemala",
    summary:
      "Bilingual site for the Asociación de Criadores de Ganado Jersey de Guatemala",
    description:
      "A bilingual Spanish / English website for Guatemala's Jersey cattle breeders association, built with Astro 7. It organizes membership information, a farm directory, registration and certification content, and cattle listings.",
    highlights: [
      { text: "Bilingual Spanish / English content architecture" },
      { text: "Membership information and farm directory" },
      { text: "Registration and certification content" },
      { text: "Structured cattle listings" },
    ],
    tags: [
      { name: "astro", color: "orange-text-gradient" },
      { name: "typescript", color: "green-text-gradient" },
      { name: "i18n", color: "blue-text-gradient" },
    ],
    links: [
      {
        label: "View Jersey Guatemala live site",
        url: "https://jersey-guatemala-production.up.railway.app",
        kind: "live",
      },
    ],
  },
];

export { services, stats, technologies, experiences, testimonials, projects, caseStudies };

export const getLocalizedContent = (dictionary: Dictionary) => ({
  navLinks: navLinks.map((link) => ({ ...link, title: dictionary.nav[link.id] })),
  services: services.map((service) => ({
    ...service,
    ...dictionary.about.services[service.id],
  })),
  stats: stats.map((stat) => ({ ...stat, label: dictionary.about.stats[stat.id] })),
  experiences: experiences.map((experience) => ({
    ...experience,
    ...dictionary.experience.items[experience.id],
  })),
  testimonials: testimonials.map((testimonial) => ({
    ...testimonial,
    ...dictionary.testimonials.items[testimonial.id],
  })),
  projects: projects.map((project) => ({
    ...project,
    ...dictionary.works.projects[project.id],
  })),
  caseStudies: caseStudies.map((caseStudy) => {
    const translation = dictionary.works.caseStudies[caseStudy.id];
    return {
      ...caseStudy,
      ...translation,
      highlights: translation.highlights.map((text) => ({ text })),
      links: caseStudy.links.map((link) => ({ ...link, label: translation.linkLabel })),
    };
  }),
});
