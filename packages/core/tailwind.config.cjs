/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./tailwind.preset.cjs')],
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: true
  },
  theme: {
    extend: {
      colors: {
        default: 'var(--dv-color-surface-strong)',
        'default-hover': 'color-mix(in oklab, var(--dv-color-surface-strong) 88%, white)',
        'default-active': 'color-mix(in oklab, var(--dv-color-surface-strong) 80%, white)',
        subtle: 'var(--dv-color-surface)',
        strong: 'var(--dv-color-surface-strong)',
        knockout: 'var(--dv-color-text)',
        disabled: 'color-mix(in oklab, var(--dv-color-surface) 78%, black)',
        'brand-knockout': 'var(--dv-color-brand)',
        'brand-knockout-hover': 'var(--dv-color-brand-strong)',
        'brand-disabled': 'color-mix(in oklab, var(--dv-color-brand) 60%, gray)',
        'status-error': 'var(--dv-color-danger)',
        'status-success': '#16a34a',
        'status-warning': '#f59e0b',
        'status-info': '#0ea5e9',
        'status-neutral': 'var(--dv-color-text-muted)',
        'button-default': 'var(--dv-color-surface-strong)',
        'button-default-hover': 'color-mix(in oklab, var(--dv-color-surface-strong) 84%, white)',
        'button-default-disabled': 'color-mix(in oklab, var(--dv-color-surface) 75%, black)',
        'button-knockout': 'var(--dv-color-brand)',
        'button-knockout-hover': 'var(--dv-color-brand-strong)',
        'button-knockout-disabled': 'color-mix(in oklab, var(--dv-color-brand) 55%, gray)',
        'button-destructive': 'var(--dv-color-danger)',
        'button-destructive-hover': 'color-mix(in oklab, var(--dv-color-danger) 85%, black)',
        'button-destructive-knockout': 'var(--dv-color-danger)',
        'button-destructive-knockout-hover': 'color-mix(in oklab, var(--dv-color-danger) 85%, black)',
        'form-default': 'var(--dv-color-surface-strong)',
        'form-disabled': 'color-mix(in oklab, var(--dv-color-surface) 82%, black)',
        'form-focus': 'var(--dv-color-surface-strong)',
        'form-hover': 'color-mix(in oklab, var(--dv-color-surface-strong) 88%, white)',
        'form-active': 'color-mix(in oklab, var(--dv-color-surface-strong) 80%, white)',
        'focus-ring-default': 'var(--dv-color-brand)',
        'focus-ring-destructive': 'var(--dv-color-danger)'
      },
      borderRadius: {
        'radius-none': '0',
        'radius-sm': 'var(--dv-radius-sm)',
        'radius-rounded': 'var(--dv-radius-md)',
        'radius-md': 'var(--dv-radius-md)',
        'radius-lg': 'var(--dv-radius-lg)',
        'radius-full': '9999px',
        sm: 'var(--dv-radius-sm)',
        md: 'var(--dv-radius-md)',
        lg: 'var(--dv-radius-lg)',
        xl: 'var(--dv-radius-xl)'
      },
      borderWidth: {
        'width-sm': '1px',
        'width-md': '2px',
        'width-lg': '3px',
        'width-xl': '4px'
      },
      outlineColor: {
        'focus-ring-default': 'var(--dv-color-brand)',
        'focus-ring-destructive': 'var(--dv-color-danger)'
      },
      ringColor: {
        'focus-ring-default': 'var(--dv-color-brand)',
        'focus-ring-destructive': 'var(--dv-color-danger)'
      },
      boxShadow: {
        soft: 'var(--dv-shadow-soft)',
        'sm-left': '-2px 0px 4px 0px rgba(0, 0, 0, 0.25)',
        'sm-bottom': '0px 2px 4px 0px rgba(0, 0, 0, 0.25)'
      },
      zIndex: {
        60: '60',
        100: '100',
        200: '200',
        300: '300',
        400: '400',
        500: '500',
        top: '9999',
        bottom: '-1'
      }
    }
  },
  plugins: []
};
