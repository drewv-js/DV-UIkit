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
				'brand-knockout': 'var(--dv-color-brand)',
				'brand-knockout-hover': 'var(--dv-color-brand-strong)',
				'brand-knockout-disabled': 'var(--dv-theme-color-background-disabled)',
				'background-disabled': 'var(--dv-theme-color-background-disabled)',
				'content-disabled': 'var(--dv-theme-color-content-disabled)',
				'border-disabled': 'var(--dv-theme-color-border-disabled)',
				'brand-content': 'var(--dv-color-brand)',
				'brand-content-knockout': 'var(--dv-color-surface-strong)',
				'content-knockout': 'var(--dv-color-surface-strong)',
				disabled: 'var(--dv-theme-color-content-disabled)',
				'brand-disabled': 'color-mix(in oklab, var(--dv-color-brand) 60%, gray)',
				action: 'var(--dv-color-action)',
				'action-hover': 'var(--dv-color-action-hover)',
				'action-active': 'var(--dv-color-action-active)',
				accent: 'var(--dv-color-accent)',
				'accent-hover': 'var(--dv-color-accent-hover)',
				'status-error': 'var(--dv-color-danger)',
				'status-success': 'var(--dv-color-status-success)',
				'status-warning': 'var(--dv-color-status-warning)',
				'status-info': 'var(--dv-color-status-info)',
				'status-neutral': 'var(--dv-color-status-neutral)',
				'button-default': 'var(--dv-color-surface-strong)',
				'button-default-hover': 'color-mix(in oklab, var(--dv-color-surface-strong) 84%, white)',
				'button-default-disabled': 'var(--dv-theme-color-background-disabled)',
				'button-knockout': 'var(--dv-color-brand)',
				'button-knockout-hover': 'var(--dv-color-brand-strong)',
				'button-knockout-disabled': 'var(--dv-theme-color-background-disabled)',
				'button-default-content': 'var(--dv-color-brand)',
				'button-knockout-content': 'var(--dv-color-surface-strong)',
				'button-default-disabled-content': 'var(--dv-theme-color-content-disabled)',
				'button-knockout-disabled-content': 'var(--dv-theme-color-content-disabled)',
				'button-destructive': 'var(--dv-color-danger)',
				'button-destructive-hover': 'color-mix(in oklab, var(--dv-color-danger) 85%, black)',
				'button-destructive-knockout': 'var(--dv-color-danger)',
				'button-destructive-knockout-hover': 'color-mix(in oklab, var(--dv-color-danger) 85%, black)',
				'button-destructive-content': 'var(--dv-color-danger)',
				'button-destructive-knockout-content': 'var(--dv-color-surface-strong)',
				'status-success-knockout': 'var(--dv-theme-color-content-status-success)',
				'status-info-knockout': 'var(--dv-theme-color-content-status-info)',
				'status-warning-knockout': 'var(--dv-theme-color-content-status-warning)',
				'status-error-knockout': 'var(--dv-theme-color-content-status-error)',
				'status-neutral-knockout': 'var(--dv-theme-color-content-status-neutral)',
				'status-success-knockout-content': 'var(--dv-theme-color-background-status-success)',
				'status-info-knockout-content': 'var(--dv-theme-color-background-status-info)',
				'status-warning-knockout-content': 'var(--dv-theme-color-background-status-warning)',
				'status-error-knockout-content': 'var(--dv-theme-color-background-status-error)',
				'status-neutral-knockout-content': 'var(--dv-theme-color-background-status-neutral)',
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
	plugins: [
		({ addUtilities }) => {
			addUtilities({
				'.text-knockout': { color: 'var(--dv-color-surface-strong)' },
				'.text-brand-knockout': { color: 'var(--dv-color-surface-strong)' },
				'.text-button-default': { color: 'var(--dv-color-brand)' },
				'.text-button-knockout': { color: 'var(--dv-color-surface-strong)' },
				'.text-button-default-disabled': { color: 'var(--dv-theme-color-content-disabled)' },
				'.text-button-knockout-disabled': { color: 'var(--dv-theme-color-content-disabled)' },
				'.text-button-destructive': { color: 'var(--dv-color-danger)' },
				'.text-button-destructive-knockout': { color: 'var(--dv-color-surface-strong)' },
				'.text-status-success-knockout': { color: 'var(--dv-theme-color-background-status-success)' },
				'.text-status-info-knockout': { color: 'var(--dv-theme-color-background-status-info)' },
				'.text-status-warning-knockout': { color: 'var(--dv-theme-color-background-status-warning)' },
				'.text-status-error-knockout': { color: 'var(--dv-theme-color-background-status-error)' },
				'.text-status-neutral-knockout': { color: 'var(--dv-theme-color-background-status-neutral)' }
			});
		}
	]
};
