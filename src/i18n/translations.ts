import type {
  CaseStudyId,
  ExperienceId,
  NavId,
  ProjectId,
  ServiceId,
  StatId,
  TestimonialId,
} from "../types";

export type Locale = "en" | "es";

export const locales: readonly Locale[] = ["en", "es"] as const;

type TranslatedService = { title: string; blurb: string };
type TranslatedExperience = { title: string; date: string; points: string[] };
type TranslatedTestimonial = { testimonial: string; designation: string };
type TranslatedProject = { name: string; description: string };
type TranslatedCaseStudy = TranslatedProject & {
  summary: string;
  highlights: string[];
  linkLabel: string;
};

export interface Dictionary {
  nav: Record<NavId, string> & {
    resume: string;
    mainNavigation: string;
    openMenu: string;
    closeMenu: string;
    brand: string;
    brandRole: string;
  };
  language: {
    label: string;
    en: string;
    es: string;
  };
  hero: {
    eyebrow: string;
    greeting: string;
    intro: string;
    badges: [string, string, string];
    contactCta: string;
    workCta: string;
    availability: string;
    computerAria: string;
    scrollAria: string;
  };
  about: {
    subhead: string;
    heading: string;
    currentBadge: string;
    bioLead: string;
    bioSecondary: string;
    resumeCta: string;
    talkCta: string;
    currentlyLabel: string;
    currentlyTitle: string;
    currentlyPoints: [string, string, string];
    openToNote: string;
    stats: Record<StatId, string>;
    services: Record<ServiceId, TranslatedService>;
  };
  experience: {
    subhead: string;
    heading: string;
    items: Record<ExperienceId, TranslatedExperience>;
  };
  tech: { subhead: string; heading: string };
  works: {
    subhead: string;
    heading: string;
    intro: string;
    moreBuilds: string;
    viewLive: string;
    viewSource: string;
    caseStudies: Record<CaseStudyId, TranslatedCaseStudy>;
    projects: Record<ProjectId, TranslatedProject>;
  };
  testimonials: {
    subhead: string;
    heading: string;
    items: Record<TestimonialId, TranslatedTestimonial>;
  };
  contact: {
    subhead: string;
    heading: string;
    intro: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    required: string;
    send: string;
    sending: string;
    preferEmail: string;
    validation: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      messageRequired: string;
      messageMin: string;
    };
    success: { title: string; body: string };
    error: { title: string; body: string };
  };
  footer: {
    brandBlurb: string;
    quickLinks: string;
    connect: string;
    downloadResume: string;
    rights: string;
    builtWith: string;
    github: string;
    linkedin: string;
    email: string;
  };
  system: {
    skipToContent: string;
    loadingSection: string;
    loadingContent: string;
    errorTitle: string;
    errorFallback: string;
    tryAgain: string;
    refresh: string;
    developmentError: string;
  };
  meta: {
    lang: "en" | "es";
    title: string;
    description: string;
    ogLocale: string;
    ogLocaleAlternate: string;
    personDescription: string;
    serviceDescription: string;
  };
}

const en = {
  nav: {
    about: "About",
    work: "Experience",
    projects: "Work",
    contact: "Contact",
    resume: "Resume",
    mainNavigation: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    brand: "Luis",
    brandRole: "Software Engineer",
  },
  language: { label: "Language", en: "EN", es: "ES" },
  hero: {
    eyebrow: "Senior Full-Stack Engineer · Selective Project Work",
    greeting: "Hi, I’m",
    intro:
      "I take on a small number of project-based engagements for growing businesses and startups — from customer-facing apps to the internal tools that keep operations moving.",
    badges: ["Web applications", "Mobile products", "Internal tools"],
    contactCta: "Start a conversation",
    workCta: "View selected work",
    availability: "Selectively booking new projects · Remote, worldwide.",
    computerAria: "3D computer model decoration",
    scrollAria: "Scroll to about section",
  },
  about: {
    subhead: "Introduction",
    heading: "Overview.",
    currentBadge: "Senior Applications Developer · TELUS Digital",
    bioLead:
      "I’m a full-stack engineer who architects and ships modern web and mobile products with React, TypeScript, and Node.js. Today I lead enhancements for native mobile apps and drive a strategic migration to React Native at TELUS Digital Solutions.",
    bioSecondary:
      "Over 4+ years, I’ve delivered solutions across enterprise apps, cloud infrastructure, and interactive Web AR — spanning React, Vue, Angular, NestJS, and AWS. Bachelor of Engineering in Computers & Systems; bilingual EN (C2) / ES (native).",
    resumeCta: "Download Resume",
    talkCta: "Let’s talk",
    currentlyLabel: "Currently",
    currentlyTitle: "Building at TELUS",
    currentlyPoints: [
      "Leading the native to React Native migration",
      "Shipping performance and engagement improvements",
      "Designing reusable component systems",
    ],
    openToNote: "Open to select project-based work alongside my full-time role.",
    stats: {
      years: "Years of experience",
      projects: "Projects delivered",
      languages: "Working languages",
      areas: "Delivery areas",
    },
    services: {
      fullstack: {
        title: "Full-Stack Web Development",
        blurb: "React, Vue, and Angular frontends backed by Node, NestJS, and Express.",
      },
      mobile: {
        title: "Mobile App Development",
        blurb: "Native enhancements and React Native migrations at scale.",
      },
      cloud: {
        title: "Cloud & DevOps Solutions",
        blurb: "AWS infrastructure, CI/CD, and Terraform for reliable delivery.",
      },
      architecture: {
        title: "Product & System Architecture",
        blurb: "Maintainable technical foundations from prototype to production.",
      },
    },
  },
  experience: {
    subhead: "What I have done so far",
    heading: "Work Experience",
    items: {
      telus: {
        title: "Senior Applications Developer",
        date: "October 2024 - Present",
        points: [
          "Architected and implemented key enhancements for native mobile applications, improving app performance by 40% and increasing user engagement metrics by 35%.",
          "Contributing to the strategic migration of the native codebase to React Native, designing reusable components to accelerate the project timeline by 30% and reduce development overhead.",
        ],
      },
      hmd: {
        title: "Full-Stack Engineer",
        date: "September 2024 - October 2024",
        points: [
          "As a key contractor on an LLM project, developed and delivered a full-stack internal tool using Vue.js and NestJS within a two-week deadline.",
          "Engineered the backend system, including the Prisma and PostgreSQL schema, enabling efficient language-model data processing with 60% faster query performance and 45% improved throughput.",
        ],
      },
      holland: {
        title: "Software Engineer",
        date: "May 2023 - June 2024",
        points: [
          "Led a new internal software suite from Figma prototypes through full-stack development and deployment, replacing a legacy tool and reducing operational time by 70%.",
          "Improved stability and performance of React legacy systems, reducing crashes by 95%, improving load times by 50%, and managing on-premises infrastructure with 99.8% uptime.",
        ],
      },
      adslive: {
        title: "Web Developer",
        date: "March 2021 - May 2023",
        points: [
          "Developed and deployed 12+ full-stack client sites using React, Vue, and Node.js, with an average 45% increase in client engagement and conversion rates.",
          "Managed AWS cloud infrastructure, including deployment, monitoring, and administration, achieving 99.9% uptime and reducing infrastructure costs by 30%.",
          "Built 8+ interactive Web AR experiences with A-Frame and Three.js, increasing client engagement by 60% and helping secure five enterprise contracts.",
        ],
      },
    },
  },
  tech: { subhead: "What I build with", heading: "Tech Stack." },
  works: {
    subhead: "Selected work",
    heading: "Case Studies.",
    intro:
      "A selection of product and website builds that show how I approach architecture, delivery, and the details that make software dependable.",
    moreBuilds: "More builds",
    viewLive: "View live",
    viewSource: "View source",
    caseStudies: {
      socialhub: {
        name: "SocialHub",
        summary: "Full-stack social media management platform",
        description:
          "A live social media management platform for scheduling and publishing across connected accounts. Built with a Next.js 15 / React 19 frontend and a NestJS API, backed by Prisma on MySQL with Redis and BullMQ for background jobs.",
        highlights: [
          "Auth0 authentication with workspace-based RBAC",
          "Social OAuth connections with automatic token refresh",
          "Post scheduling powered by Redis + BullMQ queues",
          "Media handling via AWS S3 presigned uploads",
        ],
        linkLabel: "View SocialHub live site",
      },
      "jersey-guatemala": {
        name: "Jersey Guatemala",
        summary: "Bilingual site for the Asociación de Criadores de Ganado Jersey de Guatemala",
        description:
          "A bilingual Spanish / English website for Guatemala’s Jersey cattle breeders association, built with Astro 7. It organizes membership information, a farm directory, registration and certification content, and cattle listings.",
        highlights: [
          "Bilingual Spanish / English content architecture",
          "Membership information and farm directory",
          "Registration and certification content",
          "Structured cattle listings",
        ],
        linkLabel: "View Jersey Guatemala live site",
      },
    },
    projects: {
      socializa: {
        name: "Socializa.io Landing Page",
        description:
          "Marketing site for Socializa.io, a social media management platform. Built with React, TypeScript, Tailwind, and purposeful motion design.",
      },
      "portfolio-analytics": {
        name: "Portfolio Analytics Dashboard",
        description:
          "Full-stack analytics dashboard built with a React frontend, NestJS API, PostgreSQL, and cloud deployment. A technical demonstration of a data-intensive product workflow.",
      },
      "erp-pymes": {
        name: "ERP System for SMEs",
        description:
          "Product prototype for small and medium businesses, with inventory, financial, customer, and employee workflows. Built with Next.js, TypeScript, and Prisma.",
      },
    },
  },
  testimonials: {
    subhead: "What others say",
    heading: "Testimonials.",
    items: {
      emmanuel: {
        testimonial:
          "Luis proved to be a valuable member of any team he is in. Only his ambitions exceed his achievements.",
        designation: "ITS DevOps Engineer",
      },
      lisa: {
        testimonial:
          "He proved to be an honest, respectful, responsible, and hardworking individual. Under my supervision, he worked as a programmer for a custom-made application and website system.",
        designation: "Marketing and Sales Manager",
      },
      andres: {
        testimonial:
          "He was a key member of our team at Adslivemedia Corp. He consistently delivered high-quality work and was always ready to mentor junior developers. Working with Luis was a pleasure, and his problem-solving skills and dedication were truly impressive.",
        designation: "Product Owner | Full-Stack Developer | AWS Certified",
      },
    },
  },
  contact: {
    subhead: "Start a project",
    heading: "Contact.",
    intro:
      "Tell me about the project scope, timeline, and what success looks like. I take on a limited number of project-based engagements, so the more context you share, the faster we can tell if it’s a fit.",
    nameLabel: "Your Name",
    namePlaceholder: "What’s your name?",
    emailLabel: "Your Email",
    emailPlaceholder: "What’s your email?",
    messageLabel: "About the project",
    messagePlaceholder: "Project scope, timeline, and what you are trying to achieve...",
    required: "required",
    send: "Send Message",
    sending: "Sending...",
    preferEmail: "Prefer email?",
    validation: {
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      messageRequired: "Project details are required",
      messageMin: "Project details must be at least 10 characters",
    },
    success: { title: "Success!", body: "Thank you for your message. I’ll get back to you soon!" },
    error: { title: "Error!", body: "Something went wrong. Please try again or contact me directly." },
  },
  footer: {
    brandBlurb: "Senior full-stack engineer. Open to select project-based work alongside my full-time role.",
    quickLinks: "Quick Links",
    connect: "Connect",
    downloadResume: "Download Resume",
    rights: "All rights reserved.",
    builtWith: "Built with React, Three.js & Tailwind CSS",
    github: "GitHub profile",
    linkedin: "LinkedIn profile",
    email: "Email Luis",
  },
  system: {
    skipToContent: "Skip to main content",
    loadingSection: "Loading section",
    loadingContent: "Loading content...",
    errorTitle: "Oops! Something went wrong",
    errorFallback: "We’re sorry, but something unexpected happened. Please try refreshing the page.",
    tryAgain: "Try Again",
    refresh: "Refresh Page",
    developmentError: "Error Details (Development Only)",
  },
  meta: {
    lang: "en",
    title: "Luis Ortiz | Senior Full-Stack Engineer",
    description:
      "Senior full-stack engineer in Guatemala building dependable React and Node.js products for growing businesses and startups. Available for select project work worldwide.",
    ogLocale: "en_US",
    ogLocaleAlternate: "es_GT",
    personDescription:
      "Senior full-stack engineer in Guatemala building dependable React and Node.js products for growing businesses and startups.",
    serviceDescription:
      "Project-based full-stack development for growing businesses and startups, including web applications, mobile products, and cloud solutions.",
  },
} satisfies Dictionary;

const es = {
  nav: {
    about: "Acerca de mí",
    work: "Experiencia",
    projects: "Proyectos",
    contact: "Contacto",
    resume: "Currículum",
    mainNavigation: "Navegación principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    brand: "Luis",
    brandRole: "Ingeniero de Software",
  },
  language: { label: "Idioma", en: "EN", es: "ES" },
  hero: {
    eyebrow: "Ingeniero Full-Stack Senior · Proyectos Selectos",
    greeting: "Hola, soy",
    intro:
      "Trabajo en un número reducido de proyectos para empresas en crecimiento y startups, desde aplicaciones para clientes hasta herramientas internas que mantienen la operación en marcha.",
    badges: ["Aplicaciones web", "Productos móviles", "Herramientas internas"],
    contactCta: "Conversemos",
    workCta: "Ver proyectos seleccionados",
    availability: "Agendando selectivamente nuevos proyectos · Remoto, mundial.",
    computerAria: "Decoración de modelo de computadora en 3D",
    scrollAria: "Ir a la sección Acerca de mí",
  },
  about: {
    subhead: "Introducción",
    heading: "Perfil.",
    currentBadge: "Desarrollador Senior de Aplicaciones · TELUS Digital",
    bioLead:
      "Soy un ingeniero full-stack que diseña y entrega productos web y móviles modernos con React, TypeScript y Node.js. Actualmente lidero mejoras para aplicaciones móviles nativas e impulso una migración estratégica a React Native en TELUS Digital Solutions.",
    bioSecondary:
      "Durante más de 4 años he entregado soluciones para aplicaciones empresariales, infraestructura en la nube y experiencias de Web AR, utilizando React, Vue, Angular, NestJS y AWS. Cuento con una licenciatura en Ingeniería en Informática y Sistemas; inglés C2 y español nativo.",
    resumeCta: "Descargar currículum",
    talkCta: "Conversemos",
    currentlyLabel: "Actualmente",
    currentlyTitle: "Construyendo en TELUS",
    currentlyPoints: [
      "Liderando la migración de nativo a React Native",
      "Entregando mejoras de rendimiento y engagement",
      "Diseñando sistemas de componentes reutilizables",
    ],
    openToNote: "Disponible para proyectos selectos junto a mi trabajo de tiempo completo.",
    stats: {
      years: "Años de experiencia",
      projects: "Proyectos entregados",
      languages: "Idiomas de trabajo",
      areas: "Áreas de entrega",
    },
    services: {
      fullstack: {
        title: "Desarrollo web full-stack",
        blurb: "Frontends con React, Vue y Angular respaldados por Node, NestJS y Express.",
      },
      mobile: {
        title: "Desarrollo de aplicaciones móviles",
        blurb: "Mejoras nativas y migraciones a React Native a escala.",
      },
      cloud: {
        title: "Soluciones Cloud y DevOps",
        blurb: "Infraestructura AWS, CI/CD y Terraform para entregas confiables.",
      },
      architecture: {
        title: "Arquitectura de productos y sistemas",
        blurb: "Bases técnicas mantenibles desde el prototipo hasta producción.",
      },
    },
  },
  experience: {
    subhead: "Trayectoria profesional",
    heading: "Experiencia laboral",
    items: {
      telus: {
        title: "Desarrollador Senior de Aplicaciones",
        date: "Octubre 2024 - Actualidad",
        points: [
          "Diseñé e implementé mejoras clave para aplicaciones móviles nativas, mejorando el rendimiento en 40% e incrementando las métricas de engagement en 35%.",
          "Contribuyo a la migración estratégica del código nativo a React Native, diseñando componentes reutilizables para acelerar el proyecto en 30% y reducir el esfuerzo de desarrollo.",
        ],
      },
      hmd: {
        title: "Ingeniero Full-Stack",
        date: "Septiembre 2024 - Octubre 2024",
        points: [
          "Como contratista clave en un proyecto de LLM, desarrollé y entregué una herramienta interna full-stack con Vue.js y NestJS dentro de un plazo de dos semanas.",
          "Diseñé el backend, incluido el esquema con Prisma y PostgreSQL, para procesar datos de modelos de lenguaje con consultas 60% más rápidas y 45% mejor throughput.",
        ],
      },
      holland: {
        title: "Ingeniero de Software",
        date: "Mayo 2023 - Junio 2024",
        points: [
          "Lideré una nueva suite de software interno desde prototipos en Figma hasta desarrollo full-stack y despliegue, reemplazando una herramienta heredada y reduciendo el tiempo operativo en 70%.",
          "Mejoré la estabilidad y el rendimiento de sistemas heredados en React, reduciendo fallos en 95%, mejorando tiempos de carga en 50% y administrando infraestructura local con 99.8% de disponibilidad.",
        ],
      },
      adslive: {
        title: "Desarrollador Web",
        date: "Marzo 2021 - Mayo 2023",
        points: [
          "Desarrollé y desplegué más de 12 sitios full-stack para clientes con React, Vue y Node.js, logrando un aumento promedio de 45% en engagement y conversiones.",
          "Administré infraestructura cloud en AWS, incluidos despliegue, monitoreo y administración, alcanzando 99.9% de disponibilidad y reduciendo costos de infraestructura en 30%.",
          "Construí más de 8 experiencias interactivas de Web AR con A-Frame y Three.js, aumentando el engagement de clientes en 60% y ayudando a conseguir cinco contratos empresariales.",
        ],
      },
    },
  },
  tech: { subhead: "Tecnologías con las que trabajo", heading: "Stack tecnológico." },
  works: {
    subhead: "Trabajo seleccionado",
    heading: "Casos de estudio.",
    intro:
      "Una selección de productos y sitios web que muestra mi enfoque para la arquitectura, la entrega y los detalles que hacen confiable al software.",
    moreBuilds: "Más proyectos",
    viewLive: "Ver sitio",
    viewSource: "Ver código",
    caseStudies: {
      socialhub: {
        name: "SocialHub",
        summary: "Plataforma full-stack para gestión de redes sociales",
        description:
          "Una plataforma en producción para gestionar redes sociales, programar y publicar contenido en cuentas conectadas. Construida con Next.js 15 / React 19 en el frontend y una API en NestJS, con Prisma sobre MySQL, Redis y BullMQ para procesos en segundo plano.",
        highlights: [
          "Autenticación con Auth0 y RBAC basado en espacios de trabajo",
          "Conexiones OAuth con redes sociales y renovación automática de tokens",
          "Programación de publicaciones con colas Redis + BullMQ",
          "Gestión de medios con cargas presignadas de AWS S3",
        ],
        linkLabel: "Ver sitio de SocialHub",
      },
      "jersey-guatemala": {
        name: "Jersey Guatemala",
        summary: "Sitio bilingüe para la Asociación de Criadores de Ganado Jersey de Guatemala",
        description:
          "Un sitio web bilingüe en español e inglés para la asociación guatemalteca de criadores de ganado Jersey, construido con Astro 7. Organiza información de membresías, directorio de fincas, contenido de registro y certificación, y listados de ganado.",
        highlights: [
          "Arquitectura de contenido bilingüe español / inglés",
          "Información de membresías y directorio de fincas",
          "Contenido de registro y certificación",
          "Listados estructurados de ganado",
        ],
        linkLabel: "Ver sitio de Jersey Guatemala",
      },
    },
    projects: {
      socializa: {
        name: "Landing page de Socializa.io",
        description:
          "Sitio de marketing para Socializa.io, una plataforma de gestión de redes sociales. Construido con React, TypeScript, Tailwind y animaciones con intención.",
      },
      "portfolio-analytics": {
        name: "Dashboard de analítica de portafolio",
        description:
          "Dashboard full-stack de analítica construido con un frontend en React, una API NestJS, PostgreSQL y despliegue en la nube. Una demostración técnica de un flujo de producto intensivo en datos.",
      },
      "erp-pymes": {
        name: "Sistema ERP para PyMEs",
        description:
          "Prototipo de producto para pequeñas y medianas empresas, con flujos de inventario, finanzas, clientes y empleados. Construido con Next.js, TypeScript y Prisma.",
      },
    },
  },
  testimonials: {
    subhead: "Lo que dicen otros",
    heading: "Testimonios.",
    items: {
      emmanuel: {
        testimonial:
          "Luis demostró ser un miembro valioso en cualquier equipo. Solo sus ambiciones superan sus logros.",
        designation: "Ingeniero DevOps de ITS",
      },
      lisa: {
        testimonial:
          "Demostró ser una persona honesta, respetuosa, responsable y trabajadora. Bajo mi supervisión trabajó como programador para una aplicación y sistema web a la medida.",
        designation: "Gerente de Marketing y Ventas",
      },
      andres: {
        testimonial:
          "Fue un miembro clave de nuestro equipo en Adslivemedia Corp. Entregaba trabajo de alta calidad de forma consistente y siempre estuvo dispuesto a orientar a desarrolladores junior. Trabajar con Luis fue un placer; sus habilidades de resolución de problemas y dedicación fueron realmente impresionantes.",
        designation: "Product Owner | Desarrollador Full-Stack | Certificado en AWS",
      },
    },
  },
  contact: {
    subhead: "Iniciemos un proyecto",
    heading: "Contacto.",
    intro:
      "Cuéntame sobre el alcance, cronograma y cómo se ve el éxito para el proyecto. Trabajo en un número limitado de proyectos, por lo que mientras más contexto compartas, más rápido sabremos si encajamos.",
    nameLabel: "Tu nombre",
    namePlaceholder: "¿Cómo te llamas?",
    emailLabel: "Tu correo",
    emailPlaceholder: "¿Cuál es tu correo?",
    messageLabel: "Sobre el proyecto",
    messagePlaceholder: "Alcance, cronograma y lo que quieres lograr...",
    required: "obligatorio",
    send: "Enviar mensaje",
    sending: "Enviando...",
    preferEmail: "¿Prefieres correo?",
    validation: {
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El correo es obligatorio",
      emailInvalid: "Ingresa una dirección de correo válida",
      messageRequired: "Los detalles del proyecto son obligatorios",
      messageMin: "Los detalles del proyecto deben tener al menos 10 caracteres",
    },
    success: { title: "¡Mensaje enviado!", body: "Gracias por escribir. Te responderé pronto." },
    error: { title: "Error", body: "Algo salió mal. Inténtalo de nuevo o contáctame directamente." },
  },
  footer: {
    brandBlurb: "Ingeniero full-stack senior. Disponible para proyectos selectos junto a mi trabajo de tiempo completo.",
    quickLinks: "Enlaces rápidos",
    connect: "Conecta conmigo",
    downloadResume: "Descargar currículum",
    rights: "Todos los derechos reservados.",
    builtWith: "Construido con React, Three.js y Tailwind CSS",
    github: "Perfil de GitHub",
    linkedin: "Perfil de LinkedIn",
    email: "Enviar correo a Luis",
  },
  system: {
    skipToContent: "Saltar al contenido principal",
    loadingSection: "Cargando sección",
    loadingContent: "Cargando contenido...",
    errorTitle: "Ups, algo salió mal",
    errorFallback: "Lo sentimos, ocurrió algo inesperado. Intenta actualizar la página.",
    tryAgain: "Intentar de nuevo",
    refresh: "Actualizar página",
    developmentError: "Detalles del error (solo desarrollo)",
  },
  meta: {
    lang: "es",
    title: "Luis Ortiz | Ingeniero Full-Stack Senior",
    description:
      "Ingeniero full-stack senior en Guatemala que construye productos confiables con React y Node.js para empresas en crecimiento y startups. Disponible para proyectos selectos a nivel mundial.",
    ogLocale: "es_GT",
    ogLocaleAlternate: "en_US",
    personDescription:
      "Ingeniero full-stack senior en Guatemala que construye productos confiables con React y Node.js para empresas en crecimiento y startups.",
    serviceDescription:
      "Desarrollo full-stack por proyecto para empresas en crecimiento y startups, con aplicaciones web, productos móviles y soluciones cloud.",
  },
} satisfies Dictionary;

export const dictionaries: Record<Locale, Dictionary> = { en, es };
