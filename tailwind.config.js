/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        darkBox: {
          800: "#27272a",
          900: "#18181b",
        },
        darkBorder: {
          700: "#3f3f46",
        },
        darkText: {
          300: "#d4d4d8",
          400: "#a1a1aa",
        },
      },
    },
  },
  plugins: [],
};
