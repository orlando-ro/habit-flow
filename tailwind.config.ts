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
        zinc: {
          950: "#09090b",
          900: "#18181b",
          800: "#27272a",
          700: "#3f3f46",
          400: "#a1a1aa",
          100: "#f4f4f5",
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'cyber-glow': '0 0 15px rgba(0,0,0,0)', // Dynamic via styles
      }
    },
  },
  plugins: [],
};
export default config;
