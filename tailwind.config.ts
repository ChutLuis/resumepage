import type { Config } from "tailwindcss";

/**
 * Refined Aurora v2 — dark violet identity, senior/editorial restraint.
 *
 * Semantic surface/text tokens are driven by CSS variables (see index.css)
 * so the palette stays in one place. Brand colors (accent violet, status
 * green) and the fixed design hairlines are declared here as literals to
 * match the high-fidelity handoff exactly.
 *
 * A few legacy aliases (primary, secondary, tertiary, black-100…) are kept
 * and remapped so any residual references keep compiling.
 */
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic, token-driven surfaces/text
        primary: withVar("--bg"), // page #0a0a12
        "bg-2": withVar("--bg-2"), // card surface #0e0e16
        surface: withVar("--surface"), // card surface #0e0e16
        "surface-2": withVar("--surface-2"),
        heading: withVar("--text"), // #ecebf4
        body: withVar("--text-muted"), // #9ea0b8
        line: withVar("--border"), // hairline #2a2a40

        // Fixed design tokens from the handoff
        divider: "#16161f", // subtler row divider
        "body-strong": "#c9c8d6", // secondary body / chips
        quote: "#d6d4e4", // pull-quote text
        caption: "#7c7996", // smallest text (4.7:1 on page)
        control: "#5f5c78", // input borders + link underlines (3.1:1 on page)
        status: "#34d399", // production/live chip

        // Legacy aliases remapped onto the new system
        tertiary: withVar("--surface-2"),
        "black-100": withVar("--bg-2"),
        "black-200": withVar("--surface"),
        "white-100": withVar("--text"),
        secondary: withVar("--text-muted"),

        // Brand — Accent (violet)
        accent: {
          DEFAULT: "#8b5cf6",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
        poppins: ['"Inter"', "sans-serif"], // legacy alias
      },
      /**
       * Refined type scale: ten sizes in all. Display roles are fluid by
       * viewport width only, so the hero is always the largest type.
       */
      fontSize: {
        "display-hero": ["clamp(44px, 5.8vw, 84px)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-mailto": ["clamp(32px, 4.2vw, 60px)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-section": ["clamp(32px, 3.1vw, 44px)", { lineHeight: "1.08", letterSpacing: "-0.028em" }],
        "display-stat": ["clamp(32px, 3.1vw, 44px)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-feature": ["clamp(26px, 2.3vw, 32px)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-statement": ["clamp(22px, 2vw, 28px)", { lineHeight: "1.35", letterSpacing: "-0.015em" }],
        "display-item": ["clamp(20px, 1.7vw, 24px)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        lead: ["18px", { lineHeight: "1.6" }],
        copy: ["16px", { lineHeight: "1.65" }],
        small: ["14px", { lineHeight: "1.55" }],
        label: ["13px", { lineHeight: "1.4" }],
      },
      maxWidth: {
        content: "1200px",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
} satisfies Config;
