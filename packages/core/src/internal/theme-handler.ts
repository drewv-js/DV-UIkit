/**
 * DvUI Theme Initialization
 *
 * Theme initialization for DvUI library.
 *
 * This is a simplified version containing only the functionality currently in use.
 * The full implementation with multi-theme support is archived at:
 * packages/core/archive/multi-theme-support/
 *
 */

/**
 * Available built-in theme names
 */
export type DvThemeName = 'dv';

/**
 * Theme change event detail
 */
export interface DvThemeChangeEvent {
	theme: DvThemeName;
	previousTheme: DvThemeName | null;
}

/**
 * Load persisted theme from localStorage
 *
 */
function loadPersistedTheme(): DvThemeName | null {
	const storageKey = 'dv-theme';
	const availableThemes: DvThemeName[] = ['dv'];

	/* istanbul ignore next */
	if (typeof Storage !== 'undefined') {
		try {
			const persisted = localStorage.getItem(storageKey);
			if (persisted && availableThemes.includes(persisted as DvThemeName)) {
				return persisted as DvThemeName;
			}
		} catch (error) {
			console.warn('Theme Manager: Failed to load persisted theme', error);
		}
	}
	return null;
}

/**
 * Persist theme to localStorage
 */
function persistTheme(theme: DvThemeName): void {
	const storageKey = 'dv-theme';

	/* istanbul ignore next */
	if (typeof Storage !== 'undefined') {
		try {
			localStorage.setItem(storageKey, theme);
		} catch (error) {
			console.warn('Theme Manager: Failed to persist theme', error);
		}
	}
}

/**
 * Update the DOM data attribute for theme
 */
function updateDomAttribute(theme: DvThemeName): void {
	const target = document.documentElement;

	if (!target) {
		console.warn('Theme Manager: No target element specified');
		return;
	}

	target.setAttribute('data-dv-theme', theme);
}

/**
 * Initialize DvUI theme
 *
 */
function initializeDvTheme(): void {
	const defaultTheme: DvThemeName = 'dv';

	// Load persisted theme or use default
	const persistedTheme = loadPersistedTheme();
	const initialTheme = persistedTheme || defaultTheme;

	// Update DOM data attribute
	updateDomAttribute(initialTheme);

	// Persist theme
	persistTheme(initialTheme);
}

/**
 * Auto-initialize theme manager
 *
 */
function autoInitializeThemeManager(): void {
	try {
		initializeDvTheme();
	} catch (error) {
		console.warn('DvUI Theme Manager: Auto-initialization deferred', error);
	}
}

/**
 * Auto-initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
 *
 */
if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', autoInitializeThemeManager, { once: true });
	} else {
		autoInitializeThemeManager();
	}
}

/**
 * Exported to ensure auto-initialization code runs when package is imported
 * Prevents tree-shaking from removing this module
 */
export const DvTheme = {
	name: 'dv' as DvThemeName
} as const;

/**
 * Declare global event type for TypeScript
 */
declare global {
	interface DocumentEventMap {
		'dv-theme-changed': CustomEvent<DvThemeChangeEvent>;
	}

	interface HTMLElementEventMap {
		'dv-theme-changed': CustomEvent<DvThemeChangeEvent>;
	}
}

