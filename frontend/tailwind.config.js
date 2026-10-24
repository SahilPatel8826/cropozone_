/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paddy: { DEFAULT: "#1F4D2B", dark: "#153820", light: "#E3ECDD" },
        turmeric: { DEFAULT: "#E0A21B", dark: "#B88108", light: "#FBEFCB" },
        soil: { DEFAULT: "#2A1F16", soft: "#5B4C3E" },
        mist: "#F3F5EF",
        jute: "#CDB88A",
        chilli: "#C23B22",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Hanken Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
