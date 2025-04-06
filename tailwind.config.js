/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A0B1C',
          900: '#0F1125',
          800: '#151832',
        }
      }
    },
  },
  plugins: [],
};