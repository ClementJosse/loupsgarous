/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'purple-important': '#CAB8FF',
        'blue-background': '#193143',
        'dark-background': '#061F31',
        'disabled': '#61646B'
      }
    },
  },
  plugins: [],
}