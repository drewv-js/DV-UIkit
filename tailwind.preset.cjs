const tokenPreset = require('../design-tokens/build/tailwind/dv-tailwind-tokens.cjs');

module.exports = {
  theme: {
    extend: {
      ...(tokenPreset.theme?.extend ?? {}),
      colors: {
        brand: {
          50: '#d8e5fb',
          100: '#b4cef7',
          200: '#90b6f2',
          300: '#6b9eed',
          400: '#4786e8',
          500: '#1f6feb',
          600: '#195ec9',
          700: '#1450a3',
          800: '#103f80',
          900: '#0a2d5d'
        },
        accent: {
          50: '#ffe1e7',
          100: '#ffc4d0',
          200: '#ffa7b9',
          300: '#ff89a1',
          400: '#f26b85',
          500: '#cf3f5f',
          600: '#b1314f',
          700: '#93243f',
          800: '#761930',
          900: '#570f22'
        },
        neutral: {
          50: '#e8eef8',
          100: '#d4deee',
          200: '#b9c8df',
          300: '#9baccc',
          400: '#7f90b4',
          500: '#65779a',
          600: '#4d5f7f',
          700: '#374761',
          800: '#243143',
          900: '#0f141c'
        }
      }
    }
  }
};
