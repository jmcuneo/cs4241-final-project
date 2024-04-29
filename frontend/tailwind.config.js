// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Use 'class' strategy for dark mode
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // General colors for light theme
        // Dark mode specific colors
        primary: '#262626', 
        secondary: '#404040', 
        tertiary: '#A8A8A8', 
        dark: '#171717',
        other: '#414141',
        light: '#ffffff',
        back: '#202020',
        loginbutton: '#515151',
        loginbuttonhover: '#404040',
        welcome: "#e5e7eb",
        footer: "#e5e7eb",
        purp: '#502ee8',



         // General colors
         lightprimary: '#e6e6e6', // Light mode primary
         lightsecondary: '#404040', 
         lighttertiary: '#000000', 
         lightdark: '#a2a2a3', 
         lightother: '#cacbcc',
         lightlight: '#000000',
         lightback: '#ffffff', // Background color in light mode
         lightloginbutton: '#c9c7c7',
         lightloginbuttonhover: '#adacac',
         lightwelcome: "#000000",
         lightfooter: "#000000",
      }
    },
  },
  plugins: [require("daisyui")],
};
