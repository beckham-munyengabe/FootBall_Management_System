/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pitch: { 900: '#06231a', 800: '#0a3325', 700: '#0f4a36', 500: '#16a34a', 400: '#22c55e' },
      },
      fontFamily: { display: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
