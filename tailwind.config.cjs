/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        }
      },
      borderRadius: {
        lg: 'var(--dv-radius-lg)',
        xl: 'var(--dv-radius-xl)'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.1)'
      }
    }
  },
  plugins: []
};
