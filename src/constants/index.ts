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
  starbucks,
  tesla,
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
  Technology,
  Experience,
  Testimonial,
  Project,
} from "../types";

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
    id: "",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: Service[] = [
  {
    title: "Full-Stack Web Development",
    icon: web,
  },
  {
    title: "Mobile App Development",
    icon: mobile,
  },
  {
    title: "Cloud & DevOps Solutions",
    icon: backend,
  },
  {
    title: "Complex Project Architecture",
    icon: creator,
  },
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
    title: "Software Engineer",
    company_name: "Holland Orchids",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "May 2023 - Jun 2024",
    points: [
      "Led the full lifecycle of a new internal software suite, from initial UI/UX prototypes in Figma to full-stack development and deployment, which replaced an outdated legacy tool and reduced operational time by 70%.",
      "Improved the stability and performance of existing React legacy systems, reducing crashes by 95%, improving load times by 50%, and managed their on-premises server infrastructure with 99.8% uptime.",
    ],
  },
  {
    title: "Web Developer",
    company_name: "Adslivemedia Corp.",
    icon: starbucks,
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
    testimonial:
      "Luis proved to be a valuable member of any team he is in. Only his ambitions exceed his achievements.",
    name: "Emmanuel Alvarado",
    designation: "ITS DevOps Engineer",
    company: "Allied Global Technology Services",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQE7g-X3TFP0fw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1671477031793?e=1753315200&v=beta&t=YUUcyyGq-t2carst0siL_oE2OPw62M6GruhxFnR2p1A",
  },
  {
    testimonial:
      "He proved to be an honest, respectful, responsible, and hardworking individual. Under my supervision, he worked as a programmer for a custom-made application and website system.",
    name: "Lisa Gonzáles Solé",
    designation: "Marketing and sales manager",
    company: "Holland Orchids",
    image:
      "https://media.licdn.com/dms/image/D4E03AQHd7_l9-Z2Dgg/profile-displayphoto-shrink_200_200/0/1678215473375?e=2147483647&v=beta&t=DXAWM02sJEsLixe8pgY5SryKju7suCm-_hN6QgJx_aY",
  },
  {
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
    name: "Socializa.io Landing Page",
    description:
      "Complex landing page for Socializa.io, a social media management platform. Built with React, TypeScript, and advanced animations. Demonstrates expertise in modern web development, responsive design, and creating engaging user experiences for international clients. Achieved 95+ Lighthouse performance score.",
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
    name: "Portfolio Analytics Dashboard",
    description:
      "Enterprise-grade full-stack analytics dashboard with real-time data visualization. Complex architecture featuring React frontend, NestJS backend, PostgreSQL database, and cloud deployment. Showcases ability to build scalable solutions for data-intensive applications worldwide. Handles 10,000+ concurrent users with sub-200ms response times.",
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
    name: "ERP System for SMEs",
    description:
      "Comprehensive Enterprise Resource Planning system designed for small and medium enterprises. Features include inventory management, financial tracking, customer relationship management, and employee management. Built with modern technologies focusing on scalability and ease of use for businesses in Guatemala and Latin America.",
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

export { services, technologies, experiences, testimonials, projects };
