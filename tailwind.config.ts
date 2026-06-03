import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0E1E3D",
          mid: "#1B3460",
          light: "#2E4F8A",
        },
        gold: {
          DEFAULT: "#C9933A",
          light: "#E8B86D",
        },
        cream: {
          DEFAULT: "#F9F6F0",
          mid: "#EDE8DC",
          dark: "#DDD7C8",
        },
        status: {
          red: "#C0392B",
          amber: "#B7770D",
          green: "#1A7F6E",
          blue: "#2563EB",
          purple: "#6D28D9",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
      },
      borderRadius: {
        DEFAULT: "10px",
        card: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
