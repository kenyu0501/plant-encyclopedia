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
          50: "#f2f6f1",
          100: "#e4ece3",
          200: "#cbdacc",
          300: "#a4bda8",
          400: "#799b81",
          500: "#527c5e",
          600: "#386849",
          700: "#25543c",
          800: "#1b4031",
          900: "#142f27",
          950: "#0d211b"
        },
        fruit: {
          50: "#fdf9ef",
          100: "#f9eecf",
          200: "#f1dba7",
          300: "#e8c477",
          400: "#d8a64e",
          500: "#bd8035",
          600: "#9e6027",
          700: "#79491f",
          800: "#5f3b20",
          900: "#452d1d"
        }
      },
      boxShadow: {
        soft: "0 12px 34px rgba(20, 47, 39, 0.07)",
        lift: "0 20px 42px rgba(20, 47, 39, 0.14)"
      },
      borderRadius: {
        md: "0.75rem",
        lg: "1.125rem",
        xl: "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
