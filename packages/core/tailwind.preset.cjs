const tokenPreset = require('../design-tokens/build/tailwind/dv-tailwind-tokens.cjs');

module.exports = {
	theme: {
		extend: {
			...(tokenPreset.theme?.extend ?? {}),
			colors: {
				brand: {
					DEFAULT: '#343d68',
					50: '#f8f9ff',
					100: '#e8e9f6',
					200: '#d4d6ed',
					300: '#c4c7e4',
					400: '#8990b0',
					500: '#535a7a',
					600: '#343d68',
					700: '#2c3768',
					800: '#20284f',
					900: '#111632'
				},
				accent: {
					50: '#f0edff',
					100: '#e0dbff',
					200: '#c0baf4',
					300: '#a59de8',
					400: '#8177d8',
					500: '#6459c9',
					600: '#5146aa',
					700: '#413889',
					800: '#332d6d',
					900: '#251f52'
				},
				action: {
					DEFAULT: '#ff5b68',
					hover: '#e44858',
					active: '#c83d4c'
				},
				neutral: {
					50: '#f8f9ff',
					100: '#e8e9f6',
					200: '#d4d6ed',
					300: '#c4c7e4',
					400: '#aeb3ca',
					500: '#8990b0',
					600: '#6d7597',
					700: '#535a7a',
					800: '#343d68',
					900: '#111632'
				}
			}
		}
	}
};
