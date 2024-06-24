import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      logoBorder:"#5C93B1",
      backgroundColor: {
        sidebar: "#006192",
     tableColor:"#D9EAF9",
     headerColor:"#D9F9F4",
        hoverColor:"#5C93B1"

      },
    },
  },
  plugins: [],
};
export default config;
