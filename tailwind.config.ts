import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#eef8f0",
          100: "#d7efdb",
          600: "#2f855a",
          700: "#276749",
          900: "#173c2a"
        },
        fruit: {
          100: "#fff1cc",
          400: "#f5b642",
          600: "#d97706"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(23, 60, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
