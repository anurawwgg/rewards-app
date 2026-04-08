/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#F5E6D3',  // page background — warm cappuccino
          100: '#EDD9C0',  // card/surface background — cream
          200: '#D4B896',
          300: '#BA9470',
          400: '#A07050',
          500: '#8B5A3C',
          600: '#6B3F1F',  // primary accent / secondary text
          700: '#5A3418',
          800: '#4A2910',
          900: '#3B1F0A',  // espresso — primary text / button hover
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
