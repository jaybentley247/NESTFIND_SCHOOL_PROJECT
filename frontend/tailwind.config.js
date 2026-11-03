/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Theme-aware colours: their values come from CSS variables in
        // index.css, which switch when <html> has the "dark" class.
        surface: "rgb(var(--surface) / <alpha-value>)",
        slate: {
          50: "rgb(var(--slate-50) / <alpha-value>)",
          100: "rgb(var(--slate-100) / <alpha-value>)",
          200: "rgb(var(--slate-200) / <alpha-value>)",
          300: "rgb(var(--slate-300) / <alpha-value>)",
          400: "rgb(var(--slate-400) / <alpha-value>)",
          500: "rgb(var(--slate-500) / <alpha-value>)",
          600: "rgb(var(--slate-600) / <alpha-value>)",
          700: "rgb(var(--slate-700) / <alpha-value>)",
          800: "rgb(var(--slate-800) / <alpha-value>)",
          900: "rgb(var(--slate-900) / <alpha-value>)",
          950: "rgb(var(--slate-950) / <alpha-value>)",
        },
        // Fixed dark shades for places that stay dark in both themes (the hero).
        ink: { 200: "#E2E8F0", 900: "#0F172A" },
        red: { 50: "rgb(var(--red-50) / <alpha-value>)", 100: "rgb(var(--red-100) / <alpha-value>)" },
        green: { 50: "rgb(var(--green-50) / <alpha-value>)", 100: "rgb(var(--green-100) / <alpha-value>)", 600: "rgb(var(--green-600) / <alpha-value>)", 700: "rgb(var(--green-700) / <alpha-value>)" },
        amber: { 100: "rgb(var(--amber-100) / <alpha-value>)", 600: "rgb(var(--amber-600) / <alpha-value>)", 700: "rgb(var(--amber-700) / <alpha-value>)" },
        primary: {
          DEFAULT: "#DC2626",
          50: "rgb(var(--primary-50) / <alpha-value>)",
          100: "rgb(var(--primary-100) / <alpha-value>)",
          200: "rgb(var(--primary-200) / <alpha-value>)",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          // Text on light red chips; lightens in dark mode for contrast.
          strong: "rgb(var(--primary-strong) / <alpha-value>)",
        },
        success: "#16A34A",
        error: "#DC2626",
        warning: "#D97706",
      },
      keyframes: {
        flow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        flow: "flow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

