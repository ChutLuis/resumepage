import type {
  ExperienceId,
  NavId,
  TechGroupId,
  TestimonialId,
  WorkId,
} from "../types";

export type Locale = "en" | "es";

export const locales: readonly Locale[] = ["en", "es"] as const;

type TranslatedWork = {
  name: string;
  descriptor: string;
  paragraph: string;
  linkLabel: string;
  imageLabel?: string;
};
type TranslatedExperience = { title: string; date: string; summary: string };
type TranslatedTestimonial = { testimonial: string; designation: string };

export interface Dictionary {
  nav: Record<NavId, string> & {
    resume: string;
    mainNavigation: string;
    openMenu: string;
    closeMenu: string;
    brand: string;
  };
  language: {
    label: string;
    en: string;
    es: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    intro: string;
    contactCta: string;
    workCta: string;
    canvasAria: string;
  };
  work: {
    subhead: string;
    secondaryLabel: string;
    status: Record<"production" | "live" | "case-study" | "flagship", string>;
    items: Record<WorkId, TranslatedWork>;
  };
  experience: {
    subhead: string;
    heading: string;
    items: Record<ExperienceId, TranslatedExperience>;
  };
  tech: {
    subhead: string;
    groups: Record<TechGroupId, string>;
  };
  about: {
    subhead: string;
    heading: string;
    bioLead: string;
    bioSecondary: string;
    resumeCta: string;
    talkCta: string;
    currentlyLabel: string;
    currentlyPoints: [string, string, string];
    openToNote: string;
  };
  testimonials: {
    subhead: string;
    items: Record<TestimonialId, TranslatedTestimonial>;
  };
  contact: {
    subhead: string;
    heading: string;
    intro: string;
    preferEmail: string;
    responseNote: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    required: string;
    send: string;
    sending: string;
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
    work: "Work",
    experience: "Experience",
    about: "About",
    contact: "Contact",
    resume: "Resume",
    mainNavigation: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    brand: "Luis Ortiz",
  },
  language: { label: "Language", en: "EN", es: "ES" },
  hero: {
    eyebrow: "Senior React Native & TypeScript Engineer — Remote, worldwide",
    headline: "React Native and Node systems that run at production scale.",
    intro:
      "I work full-time on a flagship enterprise customer app used by millions of users, and take on a small number of outside engagements with a defined React Native, TypeScript, or Node.js scope. If that's what you're planning, let's talk.",
    contactCta: "Discuss a project",
    workCta: "View selected work",
    canvasAria: "Decorative animation of the Aquarius constellation.",
  },
  work: {
    subhead: "Selected work",
    secondaryLabel: "Also built",
    status: {
      production: "production",
      live: "live",
      "case-study": "case study",
      flagship: "flagship, in production",
    },
    items: {
      "mobile-platform": {
        name: "React Native platform engineering",
        descriptor: "Flagship enterprise customer app, millions of users",
        paragraph:
          "Core engineer on a production React Native app. Built a new customer experience end to end — screen composition, navigation gating, engagement components — dark-launched behind remote feature flags with full regression coverage. Own shared platform layers: the in-app WebView system, a marketing SDK integration, error observability, accessibility, and backend reliability (request de-duplication, circuit breaking) in the Node/NestJS BFF.",
        linkLabel: "full write-up coming with the next case study",
        imageLabel: "No public screenshot — proprietary production work",
      },
      socialhub: {
        name: "SocialHub",
        descriptor: "Social media management platform",
        paragraph:
          "Queue-backed scheduling and publishing across connected accounts, workspace RBAC, OAuth token auto-refresh.",
        linkLabel: "demo video — coming soon",
        imageLabel: "SocialHub product shot",
      },
      "jersey-guatemala": {
        name: "Jersey Guatemala",
        descriptor: "Bilingual cattle breeders association site",
        paragraph:
          "Farm directory with individual herd profiles and filterable cattle-for-sale listings — fully bilingual (Spanish/English), built on Astro content collections with an automatic image pipeline.",
        linkLabel: "live site",
        imageLabel: "Jersey Guatemala site shot",
      },
      "portfolio-analytics": {
        name: "Portfolio Analytics",
        descriptor: "Analytics dashboard UI demo",
        paragraph:
          "Analytics dashboard UI — KPI cards, Recharts graphs, and a Three.js hero — built with React Router and Tailwind over sample data, containerized with Docker.",
        linkLabel: "source on GitHub",
      },
      socializa: {
        name: "Socializa.io",
        descriptor: "Marketing site with pricing and checkout",
        paragraph:
          "Multi-page marketing site for a social media management platform — scroll-choreographed motion, an interactive 3D scene, tiered pricing, and a Braintree checkout.",
        linkLabel: "live site",
      },
      "erp-pymes": {
        name: "Café & Comedor POS",
        descriptor: "Counter-service POS demo",
        paragraph:
          "Order-taking, kitchen board, cash-close reconciliation, and reporting for cafés and comedores — server-authoritative pricing and stock in Prisma transactions, with real auth. Seeded demo data.",
        linkLabel: "live site",
      },
    },
  },
  experience: {
    subhead: "Experience",
    heading: "Track record.",
    items: {
      telus: {
        title: "Senior Applications Developer",
        date: "Oct 2024 — Present",
        summary:
          "Core engineer on TELUS's flagship customer app (React Native, millions of users). Led the end-to-end build of a new customer experience — screen composition, navigation gating, and engagement components — dark-launched behind remote feature flags with full test coverage. Also own shared platform layers: the in-app WebView system, marketing SDK integration, observability, and accessibility.",
      },
      hmd: {
        title: "Full-Stack Engineer (contract)",
        date: "Sep — Oct 2024",
        summary:
          "Shipped a full-stack internal tool for an LLM project (Vue, NestJS, Prisma/PostgreSQL) inside a two-week deadline.",
      },
      holland: {
        title: "Software Engineer",
        date: "May 2023 — Jun 2024",
        summary:
          "Owned an internal software suite end to end — replacing a legacy tool and cutting operational time by ~70%.",
      },
      adslive: {
        title: "Web Developer",
        date: "Mar 2021 — May 2023",
        summary:
          "Built and ran 12+ client sites on AWS, and pioneered the company's Web AR offering with 8+ interactive experiences in A-Frame and Three.js.",
      },
    },
  },
  tech: {
    subhead: "Capabilities",
    groups: {
      mobile: "mobile",
      backend: "backend",
      frontend: "frontend & tools",
    },
  },
  about: {
    subhead: "About",
    heading: "Built and shipped at production scale.",
    bioLead:
      "I'm a full-stack engineer who architects and ships React Native and Node.js products at production scale — currently core engineer on a flagship enterprise customer app used by millions of users.",
    bioSecondary:
      "Bachelor of Engineering in Computers & Systems. Bilingual — English (C2) and Spanish (native).",
    resumeCta: "Download resume",
    talkCta: "Let's talk",
    currentlyLabel: "currently @ TELUS",
    currentlyPoints: [
      "Leading feature delivery on a React Native app serving millions of users",
      "Own shared platform layers: WebView, feature flags, analytics, observability",
      "Ship performance, accessibility, and reliability improvements app-wide",
    ],
    openToNote:
      "Available for a small number of scope-defined engagements alongside my full-time role.",
  },
  testimonials: {
    subhead: "What others say",
    items: {
      emmanuel: {
        testimonial:
          "Luis proved to be a valuable member of any team he is in. Only his ambitions exceed his achievements.",
        designation: "ITS DevOps Engineer, Allied Global",
      },
      lisa: {
        testimonial:
          "An honest, respectful, responsible, and hardworking individual… he worked as a programmer for a custom-made application and website system.",
        designation: "Marketing & Sales Manager, Holland Orchids",
      },
      andres: {
        testimonial:
          "He consistently delivered high-quality work and was always ready to mentor junior developers.",
        designation: "Product Owner, AdsLive Media",
      },
    },
  },
  contact: {
    subhead: "Start a project",
    heading: "Tell me what you're building.",
    intro:
      "Scope, timeline, and what success looks like. I take on a small number of scope-defined engagements each quarter, so the more context, the faster we can tell if it's a fit.",
    preferEmail: "Prefer email?",
    responseNote: "GitHub · LinkedIn — replies within 2 business days.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    messageLabel: "About the project",
    messagePlaceholder: "Scope, timeline, and what you're trying to achieve…",
    required: "required",
    send: "Send message",
    sending: "Sending…",
    validation: {
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      messageRequired: "Project details are required",
      messageMin: "Project details must be at least 10 characters",
    },
    success: {
      title: "Success!",
      body: "Thank you for your message. I'll get back to you soon!",
    },
    error: {
      title: "Error!",
      body: "Something went wrong. Please try again or contact me directly.",
    },
  },
  footer: {
    github: "GitHub profile",
    linkedin: "LinkedIn profile",
    email: "Email Luis",
  },
  system: {
    skipToContent: "Skip to main content",
    loadingSection: "Loading section",
    loadingContent: "Loading content...",
    errorTitle: "Oops! Something went wrong",
    errorFallback:
      "We're sorry, but something unexpected happened. Please try refreshing the page.",
    tryAgain: "Try Again",
    refresh: "Refresh Page",
    developmentError: "Error Details (Development Only)",
  },
  meta: {
    lang: "en",
    title: "Luis Ortiz | Senior React Native & TypeScript Engineer",
    description:
      "Senior engineer building React Native, TypeScript, and Node products — core contributor to a production mobile app used by millions of users. Available for a small number of scope-defined project engagements.",
    ogLocale: "en_US",
    ogLocaleAlternate: "es_GT",
    personDescription:
      "Senior software engineer in Guatemala building React Native, TypeScript, and Node products — core contributor to a production mobile app used by millions of users.",
    serviceDescription:
      "Select, scope-defined React Native and Node.js engagements — mobile apps, APIs, and full-stack systems, taken on alongside a full-time senior engineering role.",
  },
} satisfies Dictionary;

const es = {
  nav: {
    work: "Proyectos",
    experience: "Experiencia",
    about: "Acerca de",
    contact: "Contacto",
    resume: "Currículum",
    mainNavigation: "Navegación principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    brand: "Luis Ortiz",
  },
  language: { label: "Idioma", en: "EN", es: "ES" },
  hero: {
    eyebrow:
      "Ingeniero Senior React Native & TypeScript — Remoto, en todo el mundo",
    headline: "Sistemas React Native y Node que operan a escala de producción.",
    intro:
      "Trabajo tiempo completo en una app insignia de cliente empresarial usada por millones de usuarios, y acepto un número reducido de proyectos externos con un alcance definido en React Native, TypeScript o Node.js. Si eso es lo que estás planeando, conversemos.",
    contactCta: "Hablemos de tu proyecto",
    workCta: "Ver proyectos seleccionados",
    canvasAria: "Animación decorativa de la constelación de Acuario.",
  },
  work: {
    subhead: "Proyectos seleccionados",
    secondaryLabel: "También he construido",
    status: {
      production: "producción",
      live: "en vivo",
      "case-study": "caso de estudio",
      flagship: "insignia, en producción",
    },
    items: {
      "mobile-platform": {
        name: "Ingeniería de plataforma React Native",
        descriptor: "App insignia de cliente empresarial, millones de usuarios",
        paragraph:
          "Ingeniero clave en una app React Native de producción. Construí una nueva experiencia de cliente de principio a fin — composición de pantallas, control de navegación, componentes de engagement — lanzada en oscuro tras feature flags remotos y con cobertura completa de regresión. Soy responsable de capas compartidas de la plataforma: el sistema de WebView de la app, una integración de SDK de marketing, observabilidad de errores, accesibilidad y confiabilidad de backend (deduplicación de requests, circuit breaking) en el BFF de Node/NestJS.",
        linkLabel: "reporte completo próximamente con el siguiente caso de estudio",
        imageLabel: "Sin captura pública — trabajo de producción propietario",
      },
      socialhub: {
        name: "SocialHub",
        descriptor: "Plataforma de gestión de redes sociales",
        paragraph:
          "Programación y publicación respaldadas por colas en cuentas conectadas, RBAC por espacio de trabajo y renovación automática de tokens OAuth.",
        linkLabel: "video demo — próximamente",
        imageLabel: "Captura de SocialHub",
      },
      "jersey-guatemala": {
        name: "Jersey Guatemala",
        descriptor: "Sitio bilingüe de la asociación de criadores de ganado",
        paragraph:
          "Directorio de fincas con perfiles de hato y listados filtrables de ganado en venta — totalmente bilingüe (español/inglés), construido con content collections de Astro y una canalización automática de imágenes.",
        linkLabel: "ver sitio",
        imageLabel: "Captura de Jersey Guatemala",
      },
      "portfolio-analytics": {
        name: "Portfolio Analytics",
        descriptor: "Demo de UI de dashboard analítico",
        paragraph:
          "UI de dashboard analítico — tarjetas de KPI, gráficas con Recharts y un hero en Three.js — construida con React Router y Tailwind sobre datos de ejemplo, empaquetada con Docker.",
        linkLabel: "código en GitHub",
      },
      socializa: {
        name: "Socializa.io",
        descriptor: "Sitio de marketing con precios y checkout",
        paragraph:
          "Sitio de marketing multipágina para una plataforma de gestión de redes sociales — animaciones coreografiadas al hacer scroll, una escena 3D interactiva, planes de precios y un checkout con Braintree.",
        linkLabel: "ver sitio",
      },
      "erp-pymes": {
        name: "POS para cafés y comedores",
        descriptor: "Demo de POS de mostrador",
        paragraph:
          "Toma de pedidos, tablero de cocina, cierre y cuadre de caja, y reportes para cafeterías y comedores — precios y stock recalculados en el servidor dentro de transacciones de Prisma, con autenticación real. Datos de demo.",
        linkLabel: "ver sitio",
      },
    },
  },
  experience: {
    subhead: "Experiencia",
    heading: "Trayectoria comprobada.",
    items: {
      telus: {
        title: "Desarrollador Senior de Aplicaciones",
        date: "Oct 2024 — Actualidad",
        summary:
          "Ingeniero clave en la app principal de clientes de TELUS (React Native, millones de usuarios). Lideré de inicio a fin la construcción de una nueva experiencia de cliente — composición de pantallas, control de navegación y componentes de engagement — lanzada en oscuro tras feature flags remotos y con cobertura completa de pruebas. También soy responsable de capas compartidas de la plataforma: el sistema de WebView de la app, la integración del SDK de marketing, observabilidad y accesibilidad.",
      },
      hmd: {
        title: "Ingeniero Full-Stack (contrato)",
        date: "Sep — Oct 2024",
        summary:
          "Entregué una herramienta interna full-stack para un proyecto de LLM (Vue, NestJS, Prisma/PostgreSQL) dentro de un plazo de dos semanas.",
      },
      holland: {
        title: "Ingeniero de Software",
        date: "May 2023 — Jun 2024",
        summary:
          "Fui responsable de una suite de software interna de principio a fin — reemplazando una herramienta heredada y reduciendo el tiempo operativo en ~70%.",
      },
      adslive: {
        title: "Desarrollador Web",
        date: "Mar 2021 — May 2023",
        summary:
          "Construí y mantuve más de 12 sitios de clientes en AWS, y fui pionero de la oferta de Web AR de la empresa con más de 8 experiencias interactivas en A-Frame y Three.js.",
      },
    },
  },
  tech: {
    subhead: "Capacidades",
    groups: {
      mobile: "móvil",
      backend: "backend",
      frontend: "frontend y herramientas",
    },
  },
  about: {
    subhead: "Acerca de",
    heading: "Construido y entregado a escala de producción.",
    bioLead:
      "Soy un ingeniero full-stack que diseña y entrega productos React Native y Node.js a escala de producción — actualmente ingeniero clave en una app insignia de cliente empresarial usada por millones de usuarios.",
    bioSecondary:
      "Licenciatura en Ingeniería en Informática y Sistemas. Bilingüe — inglés (C2) y español (nativo).",
    resumeCta: "Descargar currículum",
    talkCta: "Conversemos",
    currentlyLabel: "actualmente @ TELUS",
    currentlyPoints: [
      "Lidero la entrega de features en una app React Native con millones de usuarios",
      "Responsable de capas compartidas: WebView, feature flags, analítica, observabilidad",
      "Entrego mejoras de rendimiento, accesibilidad y confiabilidad en toda la app",
    ],
    openToNote:
      "Disponible para un número reducido de proyectos de alcance definido, junto a mi trabajo de tiempo completo.",
  },
  testimonials: {
    subhead: "Lo que dicen otros",
    items: {
      emmanuel: {
        testimonial:
          "Luis demostró ser un miembro valioso en cualquier equipo. Solo sus ambiciones superan sus logros.",
        designation: "Ingeniero DevOps de ITS, Allied Global",
      },
      lisa: {
        testimonial:
          "Una persona honesta, respetuosa, responsable y trabajadora… trabajó como programador para una aplicación y sistema web a la medida.",
        designation: "Gerente de Marketing y Ventas, Holland Orchids",
      },
      andres: {
        testimonial:
          "Entregaba trabajo de alta calidad de forma consistente y siempre estuvo dispuesto a orientar a desarrolladores junior.",
        designation: "Product Owner, AdsLive Media",
      },
    },
  },
  contact: {
    subhead: "Iniciemos un proyecto",
    heading: "Cuéntame qué estás construyendo.",
    intro:
      "Alcance, cronograma y cómo se ve el éxito. Tomo un número reducido de proyectos de alcance definido cada trimestre, así que mientras más contexto compartas, más rápido sabremos si encajamos.",
    preferEmail: "¿Prefieres correo?",
    responseNote: "GitHub · LinkedIn — respondo en un plazo de 2 días hábiles.",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Correo",
    emailPlaceholder: "tú@empresa.com",
    messageLabel: "Sobre el proyecto",
    messagePlaceholder: "Alcance, cronograma y lo que quieres lograr…",
    required: "obligatorio",
    send: "Enviar mensaje",
    sending: "Enviando…",
    validation: {
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El correo es obligatorio",
      emailInvalid: "Ingresa una dirección de correo válida",
      messageRequired: "Los detalles del proyecto son obligatorios",
      messageMin: "Los detalles del proyecto deben tener al menos 10 caracteres",
    },
    success: {
      title: "¡Mensaje enviado!",
      body: "Gracias por escribir. Te responderé pronto.",
    },
    error: {
      title: "Error",
      body: "Algo salió mal. Inténtalo de nuevo o contáctame directamente.",
    },
  },
  footer: {
    github: "Perfil de GitHub",
    linkedin: "Perfil de LinkedIn",
    email: "Enviar correo a Luis",
  },
  system: {
    skipToContent: "Saltar al contenido principal",
    loadingSection: "Cargando sección",
    loadingContent: "Cargando contenido...",
    errorTitle: "Ups, algo salió mal",
    errorFallback:
      "Lo sentimos, ocurrió algo inesperado. Intenta actualizar la página.",
    tryAgain: "Intentar de nuevo",
    refresh: "Actualizar página",
    developmentError: "Detalles del error (solo desarrollo)",
  },
  meta: {
    lang: "es",
    title: "Luis Ortiz | Ingeniero Senior React Native & TypeScript",
    description:
      "Ingeniero senior que construye productos con React Native, TypeScript y Node — contribuidor clave en una app móvil de producción usada por millones de usuarios. Disponible para un número reducido de proyectos de alcance definido.",
    ogLocale: "es_GT",
    ogLocaleAlternate: "en_US",
    personDescription:
      "Ingeniero de software senior en Guatemala que construye productos con React Native, TypeScript y Node — contribuidor clave en una app móvil de producción usada por millones de usuarios.",
    serviceDescription:
      "Proyectos selectos y de alcance definido en React Native y Node.js — apps móviles, APIs y sistemas full-stack, junto a un rol senior de tiempo completo.",
  },
} satisfies Dictionary;

export const dictionaries: Record<Locale, Dictionary> = { en, es };
