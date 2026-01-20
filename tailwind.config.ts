import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        background: "#101012",
        foreground: "#ffffff",
        surface: "#202022",
        primary: {
          DEFAULT: "#3182F6",
          50: "#E5F0FF",
          100: "#CCE1FF",
          200: "#99C2FF",
          300: "#66A3FF",
          400: "#3384FF",
          500: "#3182F6",
          600: "#2565CD",
          700: "#1C4BA3",
          800: "#12327A",
          900: "#0B1E52",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F2F4F6",
          200: "#E5E8EB",
          300: "#D1D6DB",
          400: "#B0B8C1",
          500: "#8B95A1",
          600: "#6B7684",
          700: "#4E5968",
          800: "#333D4B",
          900: "#191F28",
          950: "#101012",
        },
        "text-secondary": "#B0B8C1",
        "text-tertiary": "#8B95A1",
      },
    },
  },
  plugins: [],
};
export default config;
