import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0f2c52",
          navyDark: "#0a1f3a",
          navyLight: "#16375f",
          gold: "#d9a441",
          cream: "#f7f5f0",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        ledger:
          "repeating-linear-gradient(to bottom, transparent, transparent 39px, rgba(217,164,65,0.35) 40px)",
      },
    },
  },
  plugins: [typography],
};

export default config;
