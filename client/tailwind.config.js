/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0b1220",
        secondary: "#ff5c2a",
        background: "#f6f1e8",
        textBgLight: "#f0e8db",
        textBgSoft: "#ffe4d6",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Space Grotesk", "sans-serif"],
        primary: ["Space Grotesk", "sans-serif"],
        secondary: ["Fraunces", "serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
