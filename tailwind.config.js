/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    ripple: theme => ({
      colors: theme('colors')
    }),
    extend: {
      fontSize: {
        sm: 'clamp(0px, 15px, 3vw)',
        base: 'clamp(0px, 20px, 4vw)',
        lg: 'clamp(0px, 22.5px, 4.5vw)',
        xl: 'clamp(0px, 25px, 5vw)',
        '2xl': 'clamp(0px, 30px, 6vw)',
        '3xl': 'clamp(0px, 35px, 7vw)',
        '4xl': 'clamp(0px, 40px, 8vw)',
        '5xl': 'clamp(0px, 45px, 9vw)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jockey': ['Jockey One', 'serif'],
      },
      colors: {
        'purple-important': '#CAB8FF',
        'blue-background': '#193143',
        'dark-background': '#061F31',
        'disabled': '#61646B'
      }
    },
  },
  plugins: [
    require('tailwindcss-ripple')()
  ],
}