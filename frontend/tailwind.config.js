/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#14294A",
          light: "#1F3A63",
          mid: "#2B4C7E",
        },
        charcoal: {
          DEFAULT: "#1B1D22",
          light: "#24262D",
        },
        paper: "#F5F3EE",
        ink: "#1A1E24",
        redline: {
          DEFAULT: "#D6432E",
          hover: "#B8341F",
        },
        gridline: "#7FB8D0",
      },
      fontFamily: {
        display: ["'IBM Plex Mono'", "monospace"],
        body: ["'IBM Plex Sans'", "sans-serif"],
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(rgba(127,184,208,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(127,184,208,0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
    },
  },
  plugins: [],
};