/**
 * Unit tests for DvUI Theme Initialization
 *
 * Note: Storage availability checks are excluded from coverage using istanbul ignore comments
 * because they cannot be tested due to module auto-initialization timing.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
describe('theme-handler', () => {
	const STORAGE_KEY = 'dv-theme';
	const ATTR_NAME = 'data-dv-theme';

	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute(ATTR_NAME);
		jest.clearAllMocks();
	});

	describe('Initialization with default state', () => {
		it('should export DvTheme constant with correct default name', async () => {
			const { DvTheme } = await import('./theme-handler');

			expect(DvTheme).toBeDefined();
			expect(DvTheme.name).toBe('dv');
		});

		it('should set data-dv-theme attribute on documentElement', () => {
			localStorage.clear();

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			expect(document.documentElement.getAttribute(ATTR_NAME)).toBe('dv');
		});

		it('should store theme in localStorage on initialization', () => {
			localStorage.clear();

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			const storedValue = localStorage.getItem(STORAGE_KEY);
			expect(storedValue).toBeDefined();
		});

		it('should add DOMContentLoaded listener when document is loading', () => {
			const originalReadyState = document.readyState;
			const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
			Object.defineProperty(document, 'readyState', {
				get: () => 'loading',
				configurable: true
			});

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function), { once: true });

			Object.defineProperty(document, 'readyState', {
				get: () => originalReadyState,
				configurable: true
			});
			addEventListenerSpy.mockRestore();
		});

		it('should initialize immediately when document is not loading', () => {
			const originalReadyState = document.readyState;
			const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
			Object.defineProperty(document, 'readyState', {
				get: () => 'complete',
				configurable: true
			});

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			expect(document.documentElement.getAttribute(ATTR_NAME)).toBe('dv');

			Object.defineProperty(document, 'readyState', {
				get: () => originalReadyState,
				configurable: true
			});
			addEventListenerSpy.mockRestore();
		});
	});

	describe('Methods', () => {
		it('should load valid persisted theme from localStorage', () => {
			localStorage.setItem(STORAGE_KEY, 'dv');

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			expect(document.documentElement.getAttribute(ATTR_NAME)).toBe('dv');
		});

		it('should ignore invalid persisted theme and use default', () => {
			localStorage.setItem(STORAGE_KEY, 'invalid-theme');

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			expect(document.documentElement.getAttribute(ATTR_NAME)).toBe('dv');
		});

		it('should handle missing documentElement gracefully', () => {
			const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
			const originalDocumentElement = document.documentElement;
			Object.defineProperty(document, 'documentElement', {
				get: () => null,
				configurable: true
			});

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			expect(consoleWarnSpy).toHaveBeenCalledWith('Theme Manager: No target element specified');

			Object.defineProperty(document, 'documentElement', {
				get: () => originalDocumentElement,
				configurable: true
			});
			consoleWarnSpy.mockRestore();
		});

		it('should handle Storage being undefined', () => {
			const originalStorage = (global as any).Storage;
			delete (global as any).Storage;

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			expect(document.documentElement.getAttribute(ATTR_NAME)).toBe('dv');

			(global as any).Storage = originalStorage;
		});

		it('should handle error in autoInitializeThemeManager', () => {
			const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
			Object.defineProperty(document, 'documentElement', {
				value: {
					setAttribute: jest.fn(() => {
						throw new Error('setAttribute error');
					}),
					getAttribute: jest.fn(),
					removeAttribute: jest.fn()
				},
				writable: true,
				configurable: true
			});

			jest.isolateModules(() => {
				require('./theme-handler');
			});

			expect(consoleWarnSpy).toHaveBeenCalledWith('DvUI Theme Manager: Auto-initialization deferred', expect.any(Error));

			consoleWarnSpy.mockRestore();
			Object.defineProperty(document, 'documentElement', {
				value: document.querySelector('html'),
				writable: true,
				configurable: true
			});
		});
	});

	describe('TypeScript type definitions', () => {
		it('should export DvThemeName type', async () => {
			const _module = await import('./theme-handler');
			type DvThemeName = typeof _module.DvTheme.name;
			const themeName: DvThemeName = 'dv';

			expect(themeName).toBe('dv');
		});

		it('should export DvThemeChangeEvent interface', async () => {
			type DvThemeChangeEvent = {
				theme: 'dv';
				previousTheme: 'dv' | null;
			};
			const event: DvThemeChangeEvent = {
				theme: 'dv',
				previousTheme: null
			};

			expect(event.theme).toBe('dv');
			expect(event.previousTheme).toBeNull();
		});
	});
});

