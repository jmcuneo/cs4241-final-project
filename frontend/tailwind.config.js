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
  dark: '#171717', //dark color
  other: '#414141',
  purp: '#502ee8',
  light: '#ffffff',
  back: '#202020',
  loginbutton: '#515151',
  loginbuttonhover: '#404040',
 welcome: "#e5e7eb",
 footer: "#e5e7eb",

       
      }
    },
  },
  plugins: [require("daisyui")],
}


//dark mode
// colors: {
  // primary: '#262626', // Dark shade
  // secondary: '#404040', // Medium dark shade
  // tertiary: '#A8A8A8', // Light shade
  // dark: '#171717', //dark color
  // other: '#414141',
  // purp: '#502ee8',
  // light: '#ffffff',
  // back: '#202020',
  // loginbutton: '#515151',
  //loginbuttonhover: '#404040',
 // welcome: "#e5e7eb",
//  footer: "#e5e7eb",
// }



//light mode

// primary: '#e6e6e6', // login box
// secondary: '#404040', // Medium dark shade
// tertiary: '#000000', // Light shade
// dark: '#a2a2a3', //dark color
// other: '#cacbcc',
// purp: '#502ee8',
// light: '#000000',
// back: '#ffffff',
// loginbutton: '#c9c7c7',
// loginbuttonhover: '#adacac',
// welcome: "#000000",
// footer: "#000000",