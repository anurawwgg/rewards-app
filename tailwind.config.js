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
          50:  '#f5efe3',  // Cream — page background
          100: '#fdfaf5',  // Off-white — card surfaces
          200: '#d9cfc0',  // Steam — borders, dividers
          300: '#c8b8a8',  // mid tone
          400: '#9a8070',  // muted text
          500: '#c4722a',  // Caramel (alias for 600)
          600: '#c4722a',  // Caramel — primary action / accent
          700: '#a85e20',  // darker caramel — hover states
          800: '#2b1a0e',  // Espresso
          900: '#0e0b07',  // Ink — primary dark
        },
        gold: '#e8b84b',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        serif:   ['"DM Serif Display"', 'Georgia', 'serif'],
        label:   ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
