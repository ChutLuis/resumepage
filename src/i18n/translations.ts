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
    headline: string;
    headlineLead: string;
    headlineAccent: string;
    intro: string;
    contactCta: string;
    contactLink: string;
    workCta: string;
    metaRole: string;
    metaEdition: string;
    metaLocation: string;
  };
  work: {
    subhead: string;
    heading: string;
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
    heading: string;
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
    colophonLead: string;
    colophonSource: string;
    colophonTail: string;
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
    headline: "Mobile apps, from screen to server.",
    headlineLead: "Mobile apps, from screen",
    headlineAccent: "to server.",
    intro:
      "I build React Native apps and Node.js services, from navigation and accessibility to the APIs behind them. Currently, I work on TELUS’s customer app.",
    contactCta: "Get in touch",
    contactLink: "Contact",
    workCta: "View selected work",
    metaRole: "Software engineer",
    metaEdition: "Portfolio",
    metaLocation: "Guatemala",
  },
  work: {
    subhead: "Selected work",
    heading: "Things I’ve built.",
    secondaryLabel: "Also built",
    status: {
      production: "production",
      live: "live",
      "case-study": "case study",
      flagship: "in production",
    },
    items: {
      "mobile-platform": {
        name: "React Native platform engineering",
        descriptor: "TELUS customer app used by millions",
        paragraph:
          "I work on a production React Native app and built a new customer experience from screen composition and navigation controls to engagement components. It was released behind remote feature flags with regression tests. I also work on shared platform layers: the in-app WebView, a marketing SDK integration, error observability, accessibility, and backend reliability—including request de-duplication and circuit breaking—in the Node/NestJS BFF.",
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
      comal: {
        name: "Comal",
        descriptor: "Counter-service POS for cafeterias and comedores",
        paragraph:
          "Order-taking, kitchen board, two-minute cash-close reconciliation, and live inventory — server-authoritative pricing and stock in Prisma transactions, with authenticated access. Seeded demo data.",
        linkLabel: "live demo",
        imageLabel: "Comal POS showcase",
      },
      "erp-pymes": {
        name: "Café & Comedor POS",
        descriptor: "Counter-service POS demo",
        paragraph:
          "Order-taking, kitchen board, cash-close reconciliation, and reporting for cafés and comedores — server-authoritative pricing and stock in Prisma transactions, with authenticated access. Seeded demo data.",
        linkLabel: "live site",
      },
    },
  },
  experience: {
    subhead: "Experience",
    heading: "Where I’ve worked.",
    items: {
      telus: {
        title: "Senior Applications Developer",
        date: "Oct 2024 — Present",
        summary:
          "Core engineer on TELUS’s React Native customer app, used by millions. Led the build of a new customer experience, including screen composition, navigation controls, and engagement components, released behind remote feature flags with test coverage. Also responsible for shared platform layers: the in-app WebView, marketing SDK integration, observability, and accessibility.",
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
          "Built and maintained 12+ client sites on AWS and helped develop the company’s Web AR offering, including 8+ interactive experiences in A-Frame and Three.js.",
      },
    },
  },
  tech: {
    subhead: "Capabilities",
    heading: "Tools I build with.",
    groups: {
      mobile: "mobile",
      backend: "backend",
      frontend: "frontend & tools",
    },
  },
  about: {
    subhead: "About",
    heading: "A bit about me.",
    bioLead:
      "I’m a full-stack engineer based in Guatemala, currently working on TELUS’s React Native customer app and the platform components behind it.",
    bioSecondary:
      "Bachelor of Engineering in Computers & Systems. Bilingual — English (C2) and Spanish (native).",
    resumeCta: "Download resume",
    talkCta: "Let's talk",
    currentlyLabel: "currently at TELUS",
    currentlyPoints: [
      "Leading mobile feature delivery in React Native",
      "Maintaining shared layers: WebView, feature flags, analytics, and observability",
      "Improving app performance, accessibility, and reliability",
    ],
  },
  testimonials: {
    subhead: "What others say",
    heading: "From people I’ve worked with.",
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
    subhead: "Get in touch",
    heading: "Tell me what you're building.",
    intro:
      "Have a project or a question? Tell me a little about what you’re working on.",
    preferEmail: "Prefer email?",
    responseNote: "You can also find me on GitHub and LinkedIn.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell me about your project or question.",
    required: "required",
    send: "Send message",
    sending: "Sending…",
    validation: {
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      messageRequired: "Message is required",
      messageMin: "Your message must be at least 10 characters",
    },
    success: {
      title: "Message sent.",
      body: "Thanks for your message.",
    },
    error: {
      title: "Message not sent.",
      body: "Something went wrong. Please try again or contact me directly.",
    },
  },
  footer: {
    github: "GitHub profile",
    linkedin: "LinkedIn profile",
    email: "Email Luis",
    colophonLead: "Hebe — Bertel Thorvaldsen, 1816. 3D scan by ",
    colophonSource: "SMK – Statens Museum for Kunst",
    colophonTail: ", Public Domain.",
  },
  system: {
    skipToContent: "Skip to main content",
    loadingSection: "Loading section",
    loadingContent: "Loading content...",
    errorTitle: "Something went wrong",
    errorFallback:
      "We're sorry, but something unexpected happened. Please try refreshing the page.",
    tryAgain: "Try again",
    refresh: "Refresh page",
    developmentError: "Error details (development only)",
  },
  meta: {
    lang: "en",
    title: "Luis Ortiz | Senior React Native & TypeScript Engineer",
    description:
      "Luis Ortiz is a software engineer in Guatemala working on mobile apps and backend services with React Native, TypeScript, and Node.js.",
    ogLocale: "en_US",
    ogLocaleAlternate: "es_GT",
    personDescription:
      "Luis Ortiz is a software engineer in Guatemala working on mobile apps and backend services with React Native, TypeScript, and Node.js.",
    serviceDescription:
      "Mobile and web application development, backend services, and APIs with React Native, TypeScript, and Node.js.",
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
    headline: "Apps móviles, de la pantalla al servidor.",
    headlineLead: "Apps móviles, de la pantalla",
    headlineAccent: "al servidor.",
    intro:
      "Desarrollo aplicaciones con React Native y servicios con Node.js, desde la navegación y la accesibilidad hasta las API que las respaldan. Actualmente trabajo en la app de clientes de TELUS.",
    contactCta: "Escríbeme",
    contactLink: "Contacto",
    workCta: "Ver proyectos seleccionados",
    metaRole: "Ingeniero de software",
    metaEdition: "Portafolio",
    metaLocation: "Guatemala",
  },
  work: {
    subhead: "Proyectos seleccionados",
    heading: "Lo que he construido.",
    secondaryLabel: "También he construido",
    status: {
      production: "producción",
      live: "en vivo",
      "case-study": "caso de estudio",
      flagship: "en producción",
    },
    items: {
      "mobile-platform": {
        name: "Ingeniería de plataforma React Native",
        descriptor: "App de clientes de TELUS utilizada por millones de personas",
        paragraph:
          "Trabajo en una app React Native en producción y construí una nueva experiencia para clientes: desde la composición de pantallas y el control de navegación hasta componentes de interacción. Se lanzó detrás de feature flags remotos y con pruebas de regresión. También trabajo en capas compartidas de la plataforma: el WebView de la app, una integración de SDK de marketing, la observabilidad de errores, la accesibilidad y la confiabilidad del backend —incluidas la deduplicación de solicitudes y los circuit breakers— en el BFF de Node/NestJS.",
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
      comal: {
        name: "Comal",
        descriptor: "Punto de venta para cafeterías y comedores",
        paragraph:
          "Toma de pedidos, tablero de cocina, cuadre de caja en dos minutos y control de inventario — precios y stock recalculados en el servidor dentro de transacciones de Prisma, con acceso autenticado. Datos de demo.",
        linkLabel: "ver demo",
        imageLabel: "Captura de Comal POS",
      },
      "erp-pymes": {
        name: "POS para cafés y comedores",
        descriptor: "Demo de POS de mostrador",
        paragraph:
          "Toma de pedidos, tablero de cocina, cierre y cuadre de caja, y reportes para cafeterías y comedores — precios y stock recalculados en el servidor dentro de transacciones de Prisma, con acceso autenticado. Datos de demo.",
        linkLabel: "ver sitio",
      },
    },
  },
  experience: {
    subhead: "Experiencia",
    heading: "Dónde he trabajado.",
    items: {
      telus: {
        title: "Desarrollador Senior de Aplicaciones",
        date: "Oct 2024 — Actualidad",
        summary:
          "Ingeniero del equipo que desarrolla la app de clientes de TELUS con React Native, utilizada por millones de personas. Lideré la construcción de una nueva experiencia para clientes, incluyendo la composición de pantallas, el control de navegación y componentes de interacción; se lanzó detrás de feature flags remotos y con cobertura de pruebas. También soy responsable de capas compartidas: el WebView de la app, la integración del SDK de marketing, la observabilidad y la accesibilidad.",
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
          "Construí y mantuve más de 12 sitios de clientes en AWS y ayudé a desarrollar la oferta de Web AR de la empresa, incluyendo más de 8 experiencias interactivas con A-Frame y Three.js.",
      },
    },
  },
  tech: {
    subhead: "Capacidades",
    heading: "Las herramientas con las que construyo.",
    groups: {
      mobile: "móvil",
      backend: "backend",
      frontend: "frontend y herramientas",
    },
  },
  about: {
    subhead: "Acerca de",
    heading: "Un poco sobre mí.",
    bioLead:
      "Soy ingeniero full-stack en Guatemala. Actualmente trabajo en la app de clientes de TELUS con React Native y en los componentes de su plataforma.",
    bioSecondary:
      "Licenciatura en Ingeniería en Informática y Sistemas. Bilingüe — inglés (C2) y español (nativo).",
    resumeCta: "Descargar currículum",
    talkCta: "Conversemos",
    currentlyLabel: "actualmente en TELUS",
    currentlyPoints: [
      "Lidero el desarrollo de funcionalidades móviles con React Native",
      "Mantengo capas compartidas: WebView, feature flags, analítica y observabilidad",
      "Mejoro el rendimiento, la accesibilidad y la confiabilidad de la app",
    ],
  },
  testimonials: {
    subhead: "Lo que dicen otros",
    heading: "De personas con las que he trabajado.",
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
    subhead: "Contacto",
    heading: "Cuéntame qué estás construyendo.",
    intro:
      "¿Tienes un proyecto o alguna pregunta? Cuéntame un poco sobre lo que estás haciendo.",
    preferEmail: "¿Prefieres correo?",
    responseNote: "También puedes encontrarme en GitHub y LinkedIn.",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Correo",
    emailPlaceholder: "tú@empresa.com",
    messageLabel: "Mensaje",
    messagePlaceholder: "Cuéntame sobre tu proyecto o consulta.",
    required: "obligatorio",
    send: "Enviar mensaje",
    sending: "Enviando…",
    validation: {
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El correo es obligatorio",
      emailInvalid: "Ingresa una dirección de correo válida",
      messageRequired: "El mensaje es obligatorio",
      messageMin: "El mensaje debe tener al menos 10 caracteres",
    },
    success: {
      title: "Mensaje enviado.",
      body: "Gracias por escribir.",
    },
    error: {
      title: "No se pudo enviar el mensaje.",
      body: "Algo salió mal. Inténtalo de nuevo o contáctame directamente.",
    },
  },
  footer: {
    github: "Perfil de GitHub",
    linkedin: "Perfil de LinkedIn",
    email: "Enviar correo a Luis",
    colophonLead: "Hebe — Bertel Thorvaldsen, 1816. Escaneo 3D de ",
    colophonSource: "SMK – Statens Museum for Kunst",
    colophonTail: ", dominio público.",
  },
  system: {
    skipToContent: "Saltar al contenido principal",
    loadingSection: "Cargando sección",
    loadingContent: "Cargando contenido...",
    errorTitle: "Ocurrió un error",
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
      "Luis Ortiz es ingeniero de software en Guatemala y desarrolla aplicaciones móviles y servicios backend con React Native, TypeScript y Node.js.",
    ogLocale: "es_GT",
    ogLocaleAlternate: "en_US",
    personDescription:
      "Luis Ortiz es ingeniero de software en Guatemala y desarrolla aplicaciones móviles y servicios backend con React Native, TypeScript y Node.js.",
    serviceDescription:
      "Desarrollo de aplicaciones móviles y web, servicios backend y API con React Native, TypeScript y Node.js.",
  },
} satisfies Dictionary;

export const dictionaries: Record<Locale, Dictionary> = { en, es };
