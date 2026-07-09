/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: true
  },
  theme: {
    extend: {
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
