import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        ocean: "#173B57",
        mint: "#2F9E7E",
        amberline: "#C8892F",
        canvas: "#F5F7FA",
        line: "#DCE3EA"
      },
      boxShadow: {
        panel: "0 12px 30px rgba(23, 32, 51, 0.08)"
      }
    }
  },
  plugins: [typography]
};

export default config;
