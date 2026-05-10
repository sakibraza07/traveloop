/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8e7',
          100: '#ffedb8',
          400: '#f5c842',
          500: '#e8b800',
          600: '#c99e00',
        },
        dark: '#1a1a2e',
        card: '#16213e',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
