/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'custom': ['Roboto', 'Roboto'],
      },
      backgroundColor: {
        'default': '#030712',
        'white-light': '#e5e7eb',
      },
      textColor: {
        'white-light': '#e5e7eb',
      },
    },
  },
  plugins: [],
}
