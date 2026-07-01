/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0F14",
          surface: "#121820",
          raised: "#1A222C",
          line: "#26323E",
        },
        ink: {
          DEFAULT: "#EDEFF2",
          muted: "#8A96A3",
          faint: "#5C6772",
        },
        brass: {
          DEFAULT: "#C9A227",
          light: "#E4C766",
          dim: "#8A6E1D",
        },
        bull: {
          DEFAULT: "#2DD4A7",
          dim: "#1B7A61",
        },
        bear: {
          DEFAULT: "#E5484D",
          dim: "#8A2A2D",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(201,162,39,0.06), transparent 60%)",
      },
    },
  },
  plugins: [],
};
