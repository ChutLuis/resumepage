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
type Fact = { label: string; value: string };
type ProofStat = { value: string; label: string };

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
    /** Accessible name for the proof strip under the headline. */
    proofLabel: string;
    proof: [ProofStat, ProofStat, ProofStat, ProofStat];
  };
  work: {
    subhead: string;
    heading: string;
    /** Header note; `{count}` is the number of rendered projects. */
    extent: string;
    secondaryLabel: string;
    featuredLabel: string;
    /** Field names for the featured case study's metadata rows. */
    meta: { platforms: string; testing: string; stack: string };
    /** Values for the featured case study's platform/testing rows. */
    featuredFacts: { platforms: string; testing: string };
    status: Record<"production" | "live" | "case-study" | "flagship" | "public", string>;
    items: Record<WorkId, TranslatedWork>;
  };
  experience: {
    subhead: string;
    heading: string;
    /** Header note; `{count}` roles, `{year}` the earliest start year. */
    extent: string;
    currentLabel: string;
    items: Record<ExperienceId, TranslatedExperience>;
  };
  tech: {
    subhead: string;
    heading: string;
    /** Header note; `{count}` tools across `{groups}` groups. */
    extent: string;
    groups: Record<TechGroupId, string>;
    /** Where each tool appears in the work and experience, keyed by tool name. */
    usedIn: Record<string, string>;
    notesCaption: string;
  };
  about: {
    subhead: string;
    heading: string;
    bioLead: string;
    resumeCta: string;
    talkCta: string;
    currentlyLabel: string;
    currentlyPoints: [string, string, string];
    facts: [Fact, Fact, Fact];
  };
  testimonials: {
    subhead: string;
    heading: string;
    /** Header note; `{count}` is the number of testimonials. */
    extent: string;
    items: Record<TestimonialId, TranslatedTestimonial>;
  };
  contact: {
    subhead: string;
    heading: string;
    intro: string;
    directLabel: string;
    elsewhereLabel: string;
    resumeLink: string;
    localTimeLabel: string;
    formLabel: string;
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
    colophonType: string;
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
    proofLabel: "Highlights",
    proof: [
      { value: "Millions", label: "of users on the TELUS customer app I build on" },
      { value: "~70%", label: "operational time cut by the suite I owned at Holland Orchids" },
      { value: "12+", label: "client sites built and maintained on AWS at Adslivemedia" },
      { value: "5+ years", label: "professional experience, since March 2021" },
    ],
  },
  work: {
    subhead: "Selected work",
    heading: "Things I’ve built.",
    extent: "{count} projects",
    secondaryLabel: "Also built",
    featuredLabel: "Featured",
    meta: { platforms: "Platforms", testing: "Tested", stack: "Stack" },
    featuredFacts: {
      platforms: "Android · iOS · web",
      testing: "100+ pgTAP assertions on RLS and RPCs · 670+ Vitest tests",
    },
    status: {
      production: "Production",
      live: "Live",
      "case-study": "Case study",
      flagship: "In production",
      public: "Public repo",
    },
    items: {
      waymark: {
        name: "Waymark",
        descriptor: "A shared trip planner for two",
        paragraph:
          "Built as a real product rather than a demo: one Expo codebase on Android, iOS and web, backed by Supabase. Row Level Security covers every table, privileged writes go only through reviewed RPCs, and a pgTAP suite proves that one member can’t read another’s private notes. An offline queue survives restarts, and the hand-made airmail design runs on Reanimated worklets: trips are dealt like envelopes, stops get postmarked, and private notes are sealed with wax.",
        linkLabel: "Source on GitHub",
        imageLabel: "Waymark on three phones: trips in dark mode, the day plan, and a private note opened from its envelope",
      },
      "waymark-web": {
        name: "Waymark site",
        descriptor: "Product site on a scroll-driven WebGL sky",
        paragraph:
          "A static Astro site whose home page sits on one three.js sky. The light changes from dawn to dusk section by section, the camera flies through cut-paper clouds, and a paper plane measures the real layout to wait in open sky, clear of text. three.js loads after first paint, and reduced motion gets a still sky.",
        linkLabel: "Live site",
        imageLabel: "Waymark product site: the hero over its WebGL sky",
      },
      "jersey-guatemala": {
        name: "Jersey Guatemala",
        descriptor: "Bilingual cattle breeders association site",
        paragraph:
          "Farm directory with individual herd profiles and filterable cattle-for-sale listings — fully bilingual (Spanish/English), built on Astro content collections with an automatic image pipeline.",
        linkLabel: "Live site",
        imageLabel: "Jersey Guatemala site shot",
      },
      comal: {
        name: "Comal",
        descriptor: "Counter-service POS for cafeterias and comedores",
        paragraph:
          "Order-taking, kitchen board, two-minute cash-close reconciliation, and live inventory — server-authoritative pricing and stock in Prisma transactions, with authenticated access. Seeded demo data.",
        linkLabel: "Live demo",
        imageLabel: "Comal POS showcase",
      },
      "erp-pymes": {
        name: "Café & Comedor POS",
        descriptor: "Counter-service POS demo",
        paragraph:
          "Order-taking, kitchen board, cash-close reconciliation, and reporting for cafés and comedores — server-authoritative pricing and stock in Prisma transactions, with authenticated access. Seeded demo data.",
        linkLabel: "Live site",
      },
    },
  },
  experience: {
    subhead: "Experience",
    heading: "Where I’ve worked.",
    extent: "{count} roles · {year} — present",
    currentLabel: "Current",
    items: {
      telus: {
        title: "Senior Applications Developer",
        date: "Oct 2024 — Present",
        summary:
          "Core engineer on TELUS’s React Native customer app, used by millions. Led the build of a new customer experience, including screen composition, navigation controls, and engagement components, released behind remote feature flags with test coverage. Also responsible for shared platform layers: the in-app WebView, marketing SDK integration, observability, and accessibility, plus reliability work in the Node/NestJS BFF (request de-duplication and circuit breaking).",
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
    extent: "{count} tools in {groups} groups",
    groups: {
      mobile: "Mobile",
      backend: "Backend",
      frontend: "Frontend & tools",
    },
    usedIn: {
      "React Native": "Waymark · TELUS customer app",
      Expo: "Waymark",
      TypeScript: "Waymark · TELUS customer app",
      "Node.js": "TELUS BFF",
      NestJS: "TELUS BFF · Hidden Mountain Data",
      Prisma: "Comal · Hidden Mountain Data",
      PostgreSQL: "Waymark (Supabase) · Comal · Hidden Mountain Data",
      AWS: "Adslivemedia client sites · this site (Amplify, Lambda, SES)",
      React: "Comal · this site",
      Tailwind: "Comal · this site",
      Docker: "Comal",
    },
    notesCaption: "Notes show where each tool appears in the work and experience above.",
  },
  about: {
    subhead: "About",
    heading: "A bit about me.",
    bioLead:
      "I’m a full-stack engineer based in Guatemala, currently working on TELUS’s React Native customer app and the platform components behind it.",
    resumeCta: "Download resume",
    talkCta: "Let's talk",
    currentlyLabel: "Currently at TELUS",
    currentlyPoints: [
      "Leading mobile feature delivery in React Native",
      "Maintaining shared layers: WebView, feature flags, analytics, and observability",
      "Improving app performance, accessibility, and reliability",
    ],
    facts: [
      { label: "Based in", value: "Guatemala · GMT−6" },
      { label: "Education", value: "B.Eng. in Computers & Systems" },
      { label: "Languages", value: "English (C2) · Spanish (native)" },
    ],
  },
  testimonials: {
    subhead: "What others say",
    heading: "From people I’ve worked with.",
    extent: "{count} references",
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
    directLabel: "Email me directly",
    elsewhereLabel: "Elsewhere",
    resumeLink: "Resume (PDF)",
    localTimeLabel: "Local time — Guatemala",
    formLabel: "Or send a message",
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
    colophonType: "Set in Space Grotesk and Inter.",
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
    proofLabel: "Datos destacados",
    proof: [
      { value: "Millones", label: "de personas usan la app de clientes de TELUS en la que trabajo" },
      { value: "~70%", label: "menos tiempo operativo con la suite que lideré en Holland Orchids" },
      { value: "12+", label: "sitios de clientes construidos y mantenidos en AWS en Adslivemedia" },
      { value: "5+ años", label: "de experiencia profesional, desde marzo de 2021" },
    ],
  },
  work: {
    subhead: "Proyectos seleccionados",
    heading: "Lo que he construido.",
    extent: "{count} proyectos",
    secondaryLabel: "También he construido",
    featuredLabel: "Destacado",
    meta: { platforms: "Plataformas", testing: "Pruebas", stack: "Tecnologías" },
    featuredFacts: {
      platforms: "Android · iOS · web",
      testing: "100+ aserciones pgTAP sobre RLS y RPC · 670+ pruebas en Vitest",
    },
    status: {
      production: "Producción",
      live: "En vivo",
      "case-study": "Caso de estudio",
      flagship: "En producción",
      public: "Repo público",
    },
    items: {
      waymark: {
        name: "Waymark",
        descriptor: "Planificador de viajes compartido para dos",
        paragraph:
          "Construido como un producto real y no como una demo: una sola base de código Expo para Android, iOS y web, con Supabase detrás. Row Level Security cubre cada tabla, las escrituras privilegiadas pasan solo por RPC revisadas y una suite de pgTAP demuestra que un miembro no puede leer las notas privadas de otro. La cola offline sobrevive a los reinicios, y el diseño de correo aéreo hecho a mano corre sobre worklets de Reanimated: los viajes se reparten como sobres, las paradas reciben matasellos y las notas privadas se sellan con lacre.",
        linkLabel: "Código en GitHub",
        imageLabel: "Waymark en tres teléfonos: viajes en modo oscuro, el plan del día y una nota privada abierta desde su sobre",
      },
      "waymark-web": {
        name: "Sitio de Waymark",
        descriptor: "Sitio del producto sobre un cielo WebGL guiado por el scroll",
        paragraph:
          "Un sitio estático en Astro cuya página de inicio vive sobre un único cielo de three.js. La luz pasa del amanecer al anochecer sección por sección, la cámara vuela entre nubes de papel recortado y un avión de papel mide el layout real para esperar en cielo abierto, lejos del texto. three.js carga después del primer render y, con movimiento reducido, el cielo queda quieto.",
        linkLabel: "Ver sitio",
        imageLabel: "Sitio de Waymark: el hero sobre su cielo WebGL",
      },
      "jersey-guatemala": {
        name: "Jersey Guatemala",
        descriptor: "Sitio bilingüe de la asociación de criadores de ganado",
        paragraph:
          "Directorio de fincas con perfiles de hato y listados filtrables de ganado en venta — totalmente bilingüe (español/inglés), construido con content collections de Astro y una canalización automática de imágenes.",
        linkLabel: "Ver sitio",
        imageLabel: "Captura de Jersey Guatemala",
      },
      comal: {
        name: "Comal",
        descriptor: "Punto de venta para cafeterías y comedores",
        paragraph:
          "Toma de pedidos, tablero de cocina, cuadre de caja en dos minutos y control de inventario — precios y stock recalculados en el servidor dentro de transacciones de Prisma, con acceso autenticado. Datos de demo.",
        linkLabel: "Ver demo",
        imageLabel: "Captura de Comal POS",
      },
      "erp-pymes": {
        name: "POS para cafés y comedores",
        descriptor: "Demo de POS de mostrador",
        paragraph:
          "Toma de pedidos, tablero de cocina, cierre y cuadre de caja, y reportes para cafeterías y comedores — precios y stock recalculados en el servidor dentro de transacciones de Prisma, con acceso autenticado. Datos de demo.",
        linkLabel: "Ver sitio",
      },
    },
  },
  experience: {
    subhead: "Experiencia",
    heading: "Dónde he trabajado.",
    extent: "{count} puestos · {year} — actualidad",
    currentLabel: "Actual",
    items: {
      telus: {
        title: "Desarrollador Senior de Aplicaciones",
        date: "Oct 2024 — Actualidad",
        summary:
          "Ingeniero del equipo que desarrolla la app de clientes de TELUS con React Native, utilizada por millones de personas. Lideré la construcción de una nueva experiencia para clientes, incluyendo la composición de pantallas, el control de navegación y componentes de interacción; se lanzó detrás de feature flags remotos y con cobertura de pruebas. También soy responsable de capas compartidas: el WebView de la app, la integración del SDK de marketing, la observabilidad y la accesibilidad, además de la confiabilidad del BFF en Node/NestJS (deduplicación de solicitudes y circuit breakers).",
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
    extent: "{count} herramientas en {groups} grupos",
    groups: {
      mobile: "Móvil",
      backend: "Backend",
      frontend: "Frontend y herramientas",
    },
    usedIn: {
      "React Native": "Waymark · app de clientes de TELUS",
      Expo: "Waymark",
      TypeScript: "Waymark · app de clientes de TELUS",
      "Node.js": "BFF de TELUS",
      NestJS: "BFF de TELUS · Hidden Mountain Data",
      Prisma: "Comal · Hidden Mountain Data",
      PostgreSQL: "Waymark (Supabase) · Comal · Hidden Mountain Data",
      AWS: "Sitios de clientes de Adslivemedia · este sitio (Amplify, Lambda, SES)",
      React: "Comal · este sitio",
      Tailwind: "Comal · este sitio",
      Docker: "Comal",
    },
    notesCaption:
      "Las notas indican dónde aparece cada herramienta en los proyectos y la experiencia anteriores.",
  },
  about: {
    subhead: "Acerca de",
    heading: "Un poco sobre mí.",
    bioLead:
      "Soy ingeniero full-stack en Guatemala. Actualmente trabajo en la app de clientes de TELUS con React Native y en los componentes de su plataforma.",
    resumeCta: "Descargar currículum",
    talkCta: "Conversemos",
    currentlyLabel: "Actualmente en TELUS",
    currentlyPoints: [
      "Lidero el desarrollo de funcionalidades móviles con React Native",
      "Mantengo capas compartidas: WebView, feature flags, analítica y observabilidad",
      "Mejoro el rendimiento, la accesibilidad y la confiabilidad de la app",
    ],
    facts: [
      { label: "Ubicación", value: "Guatemala · GMT−6" },
      { label: "Formación", value: "Lic. en Ingeniería en Informática y Sistemas" },
      { label: "Idiomas", value: "Inglés (C2) · español (nativo)" },
    ],
  },
  testimonials: {
    subhead: "Lo que dicen otros",
    heading: "De personas con las que he trabajado.",
    extent: "{count} referencias",
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
    directLabel: "Escríbeme directamente",
    elsewhereLabel: "También en",
    resumeLink: "Currículum (PDF)",
    localTimeLabel: "Hora local — Guatemala",
    formLabel: "O envíame un mensaje",
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
    colophonType: "Compuesto en Space Grotesk e Inter.",
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
