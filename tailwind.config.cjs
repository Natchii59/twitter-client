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
      animation: {
        'spin-fast': 'spin 0.7s linear infinite'
      },
      width: {
        4.5: '1.125rem',
        65: '65px',
        85: '85px',
        230: '230px',
        290: '290px',
        360: '360px',
        610: '610px'
      },
      height: {
        4.5: '1.125rem',
        'tweet-1': '32px',
        'tweet-2': '64px',
        'tweet-3': '96px',
        'tweet-4': '128px',
        'tweet-5': '160px',
        'tweet-6': '192px',
        'tweet-7': '224px',
        'tweet-8': '256px',
        'tweet-9': '288px',
        'tweet-10': '320px',
        'tweet-11': '352px',
        'tweet-12': '384px'
      },
      colors: {
        blue: '#1d9bf0'
      },
      fontSize: {
        13: ['0.8125rem', '1.125rem']
      }
    }
  },
  plugins: []
}
