export const registerDvComponents = (): void => {
	if (typeof window === 'undefined') return;

	// Use a non-literal specifier to avoid TS path resolution coupling to core build artifacts.
	const loaderSpecifier = '../../core/dist/loader/index.js';
	void import(loaderSpecifier)
		.then((loaderModule) => {
			if (typeof loaderModule.defineCustomElements === 'function') {
				loaderModule.defineCustomElements();
			}
		})
		.catch(() => {
			// Ignore dynamic import failures in non-browser or partial build contexts.
		});
};

export type DvUikitVuePluginType = {
	install: (app: unknown) => void;
};

export const DvUikitVuePlugin: DvUikitVuePluginType = {
	install: (_app: unknown): void => {
		registerDvComponents();
	}
};
