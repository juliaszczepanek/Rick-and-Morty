// tailwind.config.js
const { nextui } = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/@nextui-org/theme/dist/components/[object Object].js"],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};
