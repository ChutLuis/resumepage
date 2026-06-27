import type { Config } from "tailwindcss";

/**
 * Aurora palette — violet/indigo primary + cyan secondary on near-black.
 *
 * Semantic surface/text tokens are driven by CSS variables (see index.css)
 * so the dark/light theme toggle can swap them at runtime. Brand colors
 * (accent / blue / cyan) stay constant and vivid across both themes.
 *
 * The legacy token names (primary, tertiary, black-100, secondary, etc.)
 * are intentionally preserved and remapped to the new system so existing
 * components keep working without a mass find/replace.
 */
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic, theme-aware tokens
        primary: withVar("--bg"),
        "bg-2": withVar("--bg-2"),
        surface: withVar("--surface"),
        "surface-2": withVar("--surface-2"),
        heading: withVar("--text"),
        body: withVar("--text-muted"),
        line: withVar("--border"),

        // Legacy aliases remapped onto the new system (keep components working)
        tertiary: withVar("--surface-2"),
        "black-100": withVar("--bg-2"),
        "black-200": withVar("--surface"),
        "white-100": withVar("--text"),
        secondary: withVar("--text-muted"),

        // Brand — Accent (violet/indigo). Constant across themes.
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

        // Brand — Cyan (secondary accent / bridge to the 3D scenes)
        "cyan-400": "#22d3ee",
        "cyan-500": "#06b6d4",
        "cyan-600": "#0891b2",

        // Blue scale kept for the existing 3D-adjacent UI bits
        "blue-50": "#eff6ff",
        "blue-100": "#dbeafe",
        "blue-200": "#bfdbfe",
        "blue-300": "#93c5fd",
        "blue-400": "#60a5fa",
        "blue-500": "#3b82f6",
        "blue-600": "#2563eb",
        "blue-700": "#1d4ed8",
        "blue-800": "#1e40af",
        "blue-900": "#1e3a8a",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        poppins: ['"Inter"', "sans-serif"], // legacy alias
      },
      boxShadow: {
        card: "0px 35px 120px -15px rgba(124, 58, 237, 0.25)",
        "accent-glow": "0 0 24px rgba(139, 92, 246, 0.45)",
        "cyan-glow": "0 0 24px rgba(34, 211, 238, 0.40)",
        "blue-glow": "0 0 24px rgba(139, 92, 246, 0.40)", // legacy alias → accent
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
        "aurora":
          "radial-gradient(60% 60% at 20% 10%, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0) 60%), radial-gradient(50% 50% at 90% 20%, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0) 55%)",
        "grid-fade":
          "linear-gradient(to right, rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,92,246,0.06) 1px, transparent 1px)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        marquee: "marquee 38s linear infinite",
        "marquee-reverse": "marquee-reverse 38s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        "fade-up": "fade-up 0.6s ease forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
          },
          "50%": {
            opacity: "0.85",
            boxShadow: "0 0 34px rgba(139, 92, 246, 0.85)",
          },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
