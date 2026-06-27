import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        line: "#d8dee9",
        brand: "#0f766e",
        accent: "#c2410c"
      }
    }
  },
  plugins: []
};

export default config;
