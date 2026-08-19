/** @type {import('lint-staged').Config} */
export default {
	'packages/core/src/**/*.{ts,tsx}': ['prettier --write', 'eslint --config packages/core/eslint.config.cjs --fix'],
	'packages/react/src/**/*.{ts,tsx}': ['prettier --write'],
	'packages/vue/src/**/*.{ts,tsx}': ['prettier --write'],
	'packages/design-tokens/**/*.{ts,js}': ['prettier --write'],
	'apps/**/*.{js,ts,jsx,tsx}': ['prettier --write'],
	'*.{json,css,scss,md}': ['prettier --write']
};
