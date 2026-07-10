/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        // "ink" = the navy/slate scale used for dark surfaces, sidebar, borders & text
        ink: {
          950: "#0B1220",
          900: "#111827",
          800: "#1B2436",
          700: "#293347",
          600: "#3A4459",
          500: "#4E5A70",
        },
        // "mist" = light neutral grey scale used for page background & light-mode surfaces
        mist: {
          50: "#F5F6F8",
          100: "#EEF0F3",
          200: "#DFE3E9",
        },
        // "violet" repurposed as the single muted-blue accent (kept the same key
        // name across the codebase so every component restyles automatically)
        violet: {
          50: "#EAF0FE",
          100: "#D2E0FD",
          400: "#4E7BC4",
          500: "#2E5AAC",
          600: "#24488B",
          700: "#1C3A72",
        },
        amber: {
          400: "#D9942C",
          500: "#C17F1C",
          600: "#A56A13",
        },
      },
      backgroundImage: {
        "grid-glow": "none",
      },
      boxShadow: {
        glass: "0 1px 2px 0 rgba(17, 24, 39, 0.06), 0 1px 3px 0 rgba(17, 24, 39, 0.05)",
        "glow-violet": "none",
        "glow-amber": "none",
      },
      borderRadius: {
        xl2: "0.5rem",
      },
      keyframes: {
        float: { "0%,100%": {}, "50%": {} },
        "pulse-slow": { "0%,100%": {}, "50%": {} },
      },
      animation: {
        float: "none",
        "pulse-slow": "none",
      },
    },
  },
  plugins: [],
};
