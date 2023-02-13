/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    screens: {
      xs: '614px',
      sm: '1002px',
      md: '1022px',
      lg: '1092px',
      xl: '1280px'
    },
    extend: {
      width: {
        65: '65px',
        85: '85px',
        230: '230px',
        290: '290px',
        360: '360px',
        610: '610px'
      },
      colors: {
        blue: '#1d9bf0'
      }
    }
  },
  plugins: []
}
