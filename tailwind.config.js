/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const mode = "jit";
export const theme = {
  extend: {
    colors: {
      primary: "#0a0e27",        // Deep navy blue (darker than before)
      secondary: "#64b5f6",      // Light blue (replacing purple-gray)
      tertiary: "#1a237e",       // Royal blue (replacing dark purple)
      "black-100": "#0d1321",    // Very dark blue-black
      "black-200": "#020617",    // Almost black with blue tint
      "white-100": "#f0f9ff",    // Slightly blue-tinted white
      "blue-50": "#e0f2fe",      // Very light blue
      "blue-100": "#bae6fd",     // Light sky blue
      "blue-200": "#7dd3fc",     // Sky blue
      "blue-300": "#38bdf8",     // Bright sky blue
      "blue-400": "#0ea5e9",     // Ocean blue
      "blue-500": "#0284c7",     // Deep ocean blue
      "blue-600": "#0369a1",     // Navy blue
      "blue-700": "#075985",     // Deep navy
      "blue-800": "#0c4a6e",     // Dark navy
      "blue-900": "#1e3a8a",     // Royal blue
      "cyan-400": "#22d3ee",     // Bright cyan
      "cyan-500": "#06b6d4",     // Cyan
      "cyan-600": "#0891b2",     // Deep cyan
    },
    boxShadow: {
      card: "0px 35px 120px -15px #0c4a6e",
      "blue-glow": "0 0 20px rgba(14, 165, 233, 0.5)",
      "cyan-glow": "0 0 20px rgba(6, 182, 212, 0.5)",
    },
    screens: {
      xs: "450px",
    },
    backgroundImage: {
      "hero-pattern": "url('/src/assets/herobg.png')",
    },
    animation: {
      "spin-slow": "spin 3s linear infinite",
      "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
    keyframes: {
      "pulse-glow": {
        "0%, 100%": {
          opacity: "1",
          boxShadow: "0 0 20px rgba(14, 165, 233, 0.5)",
        },
        "50%": {
          opacity: "0.8",
          boxShadow: "0 0 30px rgba(14, 165, 233, 0.8)",
        },
      },
    },
  },
};
export const plugins = [];
