/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#262626', // Dark shade
        secondary: '#404040', // Medium dark shade
        tertiary: '#A8A8A8', // Light shade
        dark: '171717', //dark color
      }
    },
  },
  plugins: [require("daisyui")],
}
