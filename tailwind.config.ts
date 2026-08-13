import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        field: {
          50: "#f2f8ed",
          100: "#dff0d4",
          500: "#4d8d35",
          700: "#2e641f",
          900: "#17390f"
        },
        soil: "#8b6f47",
        harvest: "#f2b705"
      },
      fontFamily: {
        sans: ["Tahoma", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
