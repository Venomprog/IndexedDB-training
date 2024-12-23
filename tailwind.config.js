import plugin from 'tailwindcss/plugin'

export default {
  content: ['./src/**/*.{pug,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.33, 1, 0.68, 1)'
      },
      transitionDuration: {
        DEFAULT: '0.5s'
      },
      colors: {
        dark: '#0c0c0c',
        light: '#f2f2f2'
      }
    },
    screens: {
      desktop: { min: '1201px' },
      devices: { max: '1200px' },
      tablet: { max: '1200px', min: '769px' },
      mobile: { max: '768px' },
      xxl: { max: '1920px' },
      ll: { max: '1440px' },
      d: { max: '1201px' },
      t: { max: '1024px' },
      lg: { max: '992px' },
      m: { max: '768px' },
      s: { max: '576px' },
      xs: { max: '375px' }
    }
  },
  plugins: [
    plugin(function ({ theme, addUtilities }) {
      const screens = theme('screens')

      const newUtilities = {
        '.desktop': {
          [`@media (max-width: ${screens.tablet.max})`]: {
            display: 'none !important'
          }
        },
        '.mobile': {
          [`@media (min-width: ${screens.tablet.min})`]: {
            display: 'none !important'
          }
        },
        '.tablet': {
          [`@media (min-width: ${screens.desktop.min})`]: {
            display: 'none !important'
          },
          [`@media (max-width: ${screens.mobile.max})`]: {
            display: 'none !important'
          }
        },
        '.devices': {
          [`@media (min-width: ${screens.desktop.min})`]: {
            display: 'none !important'
          }
        }
      }

      addUtilities(newUtilities, ['responsive'])
    })
  ]
}
