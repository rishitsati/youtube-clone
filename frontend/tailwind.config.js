/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        yt: {
          dark: '#0f0f0f',
          bg: '#181818',
          hover: '#272727',
          text: '#f1f1f1',
          secondary: '#aaaaaa',
          red: '#ff0000',
        }
      },
      spacing: {
        '14': '3.5rem',
      }
    },
  },
  plugins: [],
}
