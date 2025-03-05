/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // transparent: 'transparent',
        // current: 'currentColor',
        // black: colors.black,
        // white: colors.white,
        // gray: colors.gray,
        highlight: '#21BF89',
        ultra_light_gray: '#979f9c',
        light_gray: '#707070',
        medium_gray: '#4D4D4D',
        dark_gray: '#434343',
        ultra_dark_gray: '#222222',
      },
      data: {
        highlighted: 'ui~="highlighted"',
      },
    },
  },
  plugins: [],
};
