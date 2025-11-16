// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#f0fdf4",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
        },
      },
    },
  },
  plugins: [],
};

export default config;
