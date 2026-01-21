import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#191F28", // Deep dark background
        surface: "#202632", // Card background
        foreground: "#FFFFFF",
        primary: "#3182F6", // Toss Blue
        secondary: "#B0B8C1", // Toss Gray
        accent: "#F04452", // Toss Red
        muted: "#4E5968", // Darker Gray
        border: "#333D4B",
        success: "#4ADE80", // Green
        positive: "#34C759", // Apple/US Finance Green
        negative: "#FF3B30", // Apple/US Finance Red
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
