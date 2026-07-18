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
        quote: "#d6d4e4", // serif pull-quote text
        caption: "#6d6a85", // mono captions
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
        serif: ['"Newsreader"', "ui-serif", "Georgia", "serif"],
        poppins: ['"Inter"', "sans-serif"], // legacy alias
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        eyebrow: "0.1em",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [],
} satisfies Config;
