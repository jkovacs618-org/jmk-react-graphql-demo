/** @type {import('tailwindcss').Config} */
/* eslint-env node */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
  // Test dark mode:
  // Add index.html: <html class='dark'>
  // darkMode: 'class'
}