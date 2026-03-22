/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f5257',
        secondary: '#0a3d41',
        accent: '#ff6b35',
      }
    },
  },
  plugins: [],
}

