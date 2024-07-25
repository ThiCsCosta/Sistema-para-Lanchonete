/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily:{
      'sans':['Roboto', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg-1.jpg')"
      },
      colors: {
        primary: '#2091f9',
        primaryText: '#000002',
        secondText: '#374754',
        colorFooter: '#b91c1c',
        btnGreen: '#16a34a',
        btnRed: '#b91c1c'
      }
    },
  },
  plugins: [],
}

