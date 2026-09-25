import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bank: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffe",
          300: "#7cc5fd",
          400: "#36a8fa",
          500: "#0c8ce9",
          600: "#016ec7",
          700: "#0257a1",
          800: "#064b85",
          900: "#0a3e6f",
          950: "#07284a",
        },
        navy: {
          800: "#0f172a",
          900: "#0a0f1d",
          950: "#060913",
        },
        emerald: {
          500: "#10b981",
          600: "#059669",
        },
      },
    },
  },
  plugins: [],
};
export default config;
