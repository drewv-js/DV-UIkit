/**
 *
 * ******************************************************************
 * Utility for managing focus trapping within DvUI components.
 * This allows components like DvDrawer, DvDialogs, etc. to trap focus
 * within their boundaries for improved accessibility.
 * ******************************************************************
 *
 */

export interface FocusTrapOptions {
	/** The root element of the component where focus will be trapped */
	rootElement: HTMLElement;
	/** The selector for additional focusable elements */
	focusableSelector?: string;
	/** Whether to initially focus the first element when trap is activated */
	autoFocus?: boolean;
}

// Define default focusable selector
const DEFAULT_FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), dv-button:not([disabled]), dv-icon-button:not([disabled])';

export class FocusTrap {
	private focusableElements: HTMLElement[] = [];
	private isActive: boolean = false;
	private resizeObserver: ResizeObserver | null = null;
	private mutationObserver: MutationObserver | null = null;

	constructor(
		private rootElement: HTMLElement,
		private focusableSelector: string = DEFAULT_FOCUSABLE_SELECTOR,
		private autoFocus: boolean = false
	) {
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.collectFocusableElements = this.collectFocusableElements.bind(this);
		this.isVisible = this.isVisible.bind(this);

		if (focusableSelector) {
			this.focusableSelector = `${DEFAULT_FOCUSABLE_SELECTOR}, ${focusableSelector}`;
		} else {
			/* istanbul ignore next */
			this.focusableSelector = DEFAULT_FOCUSABLE_SELECTOR;
		}
	}

	/**
	 * Activates the focus trap
	 */
	public activate(): void {
		if (this.isActive) return;
		this.isActive = true;
		document.addEventListener('keydown', this.handleKeyDown);
		this.collectFocusableElements();
		this.setupObservers();
		setTimeout(() => {
			this.collectFocusableElements();

			if (this.autoFocus) {
				if (this.focusableElements.length) {
					this.focusableElements[0].focus();
				}
			} else {
				// Focus the root element if autoFocus is false
				this.rootElement.focus();
			}
		}, 150);
	}

	/**
	 * Deactivates the focus trap
	 */
	public deactivate(): void {
		if (!this.isActive) return;
		this.isActive = false;
		document.removeEventListener('keydown', this.handleKeyDown);
		this.cleanupObservers();
		this.focusableElements = [];
	}

	/**
	 * Set up observers to track DOM changes
	 */
	private setupObservers(): void {
		this.mutationObserver = new MutationObserver(() => this.isActive && this.collectFocusableElements());
		this.resizeObserver = new ResizeObserver(() => this.isActive && this.collectFocusableElements());

		if (this.rootElement) {
			this.mutationObserver.observe(this.rootElement, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['disabled', 'tabindex', 'hidden', 'style']
			});
			this.resizeObserver.observe(this.rootElement);
		}
	}

	/**
	 * Clean up observers
	 */
	private cleanupObservers(): void {
		this.mutationObserver?.disconnect();
		this.mutationObserver = null;
		this.resizeObserver?.disconnect();
		this.resizeObserver = null;
	}

	/**
	 * Updates the list of focusable elements
	 * @param slot Optional slot that changed, to only process specific elements
	 */
	public update(slot?: HTMLSlotElement): void {
		if (this.isActive) {
			slot ? this.addFocusableElements(slot.assignedElements({ flatten: true })) : this.collectFocusableElements();
		}
	}

	/**
	 * Collects all focusable elements within the component
	 */
	private collectFocusableElements(): void {
		this.focusableElements = [];
		if (!this.rootElement) return;
		try {
			const query = (selector: string, root: Element): HTMLElement[] =>
				Array.from(root.querySelectorAll(selector)).filter(this.isVisible) as HTMLElement[];

			// Check if the root element itself is focusable
			if (this.rootElement.matches('[tabindex]:not([tabindex="-1"])') && this.isVisible(this.rootElement)) {
				this.focusableElements.push(this.rootElement);
			}

			this.focusableElements.push(...query(this.focusableSelector, this.rootElement));

			/* istanbul ignore next */
			this.rootElement.querySelectorAll('slot').forEach((slot) => {
				slot.assignedElements({ flatten: true }).forEach((el) => {
					if (el instanceof HTMLElement) {
						if (el.matches(this.focusableSelector) && this.isVisible(el)) {
							this.focusableElements.push(el);
						}
						if (el.querySelectorAll) {
							try {
								this.focusableElements.push(...query(this.focusableSelector, el));
							} catch (err) {
								console.error('Error querying nested focusable elements:', err);
							}
						}
					}
				});
			});

			// Remove duplicates and sort
			this.focusableElements = Array.from(new Set(this.focusableElements));
			this.sortFocusableElements();
		} catch (err) {
			console.error('Error in collectFocusableElements:', err);
		}
	}

	/**
	 * Sort focusable elements by tabindex
	 */
	private sortFocusableElements(): void {
		this.focusableElements.sort((a, b) => {
			const aTabIndex = a.tabIndex;
			const bTabIndex = b.tabIndex;
			return aTabIndex > 0 && bTabIndex > 0 ? aTabIndex - bTabIndex : aTabIndex > 0 ? -1 : bTabIndex > 0 ? 1 : 0;
		});
	}

	/**
	 * Check if an element is visible
	 */
	private isVisible(element: HTMLElement): boolean {
		if (!element) return false;
		try {
			const { visibility, display } = window.getComputedStyle(element);
			return (
				(element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0) &&
				visibility !== 'hidden' &&
				display !== 'none'
			);
		} catch (_err) {
			return false;
		}
	}

	/**
	 * Helper method to add focusable elements from a node list
	 */
	private addFocusableElements(elements: Element[]): void {
		try {
			const newElements: HTMLElement[] = [];
			/* istanbul ignore next */
			elements.forEach((element) => {
				if (element instanceof HTMLElement) {
					if (element.matches(this.focusableSelector) && this.isVisible(element)) {
						newElements.push(element);
					}
					if (element.querySelectorAll) {
						try {
							const childFocusable = Array.from(element.querySelectorAll(this.focusableSelector)).filter(
								this.isVisible
							) as HTMLElement[];
							newElements.push(...childFocusable);
						} catch (err) {
							console.error('Error querying child focusable elements:', err);
						}
					}
				}
			});
			this.focusableElements = Array.from(new Set([...this.focusableElements, ...newElements]));
			this.sortFocusableElements();
		} catch (err) {
			/* istanbul ignore next */
			console.error('Error in addFocusableElements:', err);
		}
	}

	/**
	 * Handles Tab key events to trap focus
	 */
	private handleKeyDown(event: KeyboardEvent): void {
		/* istanbul ignore next */
		if (!this.isActive || event.key !== 'Tab') return;
		this.collectFocusableElements();
		if (this.focusableElements.length < 2) {
			event.preventDefault();
			return;
		}
		const [firstElement, lastElement] = [this.focusableElements[0], this.focusableElements.at(-1)!];

		// shadowRoot.activeElement fails for slotted elements
		const path = event.composedPath();
		const focusedElement = path.find((el) => this.focusableElements.includes(el as HTMLElement)) as
			HTMLElement | undefined;

		// Prevent false matches from ancestor containers in nested shadow DOM
		const actualTarget = path[0] as HTMLElement;
		const isDirectFocus =
			focusedElement != null &&
			(actualTarget === focusedElement ||
				(focusedElement.shadowRoot?.delegatesFocus === true && focusedElement.shadowRoot.contains(actualTarget)));

		if (event.shiftKey && isDirectFocus && focusedElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
		} else if (!event.shiftKey && isDirectFocus && focusedElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	}
}

/**
 * Creates a focus trap instance for the given element
 * @param options Configuration options for the focus trap
 * @returns A new FocusTrap instance
 */
export function createFocusTrap(options: FocusTrapOptions): FocusTrap {
	return new FocusTrap(options.rootElement, options.focusableSelector, options.autoFocus);
}

/**
 * Registers slot change handlers to update focus trap
 * @param focusTrap The focus trap instance
 * @param slots Array of slots to monitor for changes
 * @returns A function to cleanup the event listeners
 */
export function setupSlotChangeHandlers(focusTrap: FocusTrap, slots: HTMLSlotElement[]): () => void {
	const cleanups = slots.filter(Boolean).map((slot) => {
		const handler = () => focusTrap.update(slot);
		slot.addEventListener('slotchange', handler);
		return () => slot.removeEventListener('slotchange', handler);
	});
	return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 *
 * ********************************
 * Focus Handling utility functions
 * ********************************
 *
 */

/**
 * FocusableComponent interface defines the structure required for components
 * that can be focused
 */
export interface FocusableComponent {
	host: HTMLElement;
	disabled?: boolean;
	internalElement?: HTMLElement;

	// Optional method to be implemented by the component
	setFocus?: () => Promise<void>;
}

/**
 * Creates focus handling functionality for DvUI components
 *
 * @param component The component instance that implements FocusableComponent interface
 * @param internalElementGetter Function that returns the internal focusable element
 * @returns Object with focus handling methods
 */
export function createFocusHandler<T extends FocusableComponent>(
	component: T,
	internalElementGetter: () => HTMLElement | null | undefined
) {
	// Handler function for focus events on the host element
	const handleHostFocus = () => {
		const internalEl = internalElementGetter();
		if (internalEl && !component.disabled) {
			internalEl.focus();
		}
	};

	/**
	 * Setup focus handling - call this in connectedCallback
	 */
	const setupFocusHandling = () => {
		// Add focus event listener to forward focus to internal element
		component.host.addEventListener('focus', handleHostFocus);
		// Store original focus method
		const originalFocus = component.host.focus;
		component.host.focus = () => {
			const internalEl = internalElementGetter();
			if (internalEl && !component.disabled) {
				internalEl.focus();
			} else if (originalFocus) {
				originalFocus.call(component.host);
			}
		};
	};

	/**
	 * Clean up focus handling - call this in disconnectedCallback
	 */
	const cleanupFocusHandling = () => {
		component.host.removeEventListener('focus', handleHostFocus);
	};

	/**
	 * Public method to focus the element - implement this as a @Method in the component
	 * The name is setFocus() to avoid conflicts with the native focus() method
	 */
	const setFocus = async (): Promise<void> => {
		const internalEl = internalElementGetter();
		if (internalEl && !component.disabled) {
			internalEl.focus();
		}
		return Promise.resolve();
	};

	return {
		handleHostFocus,
		setupFocusHandling,
		cleanupFocusHandling,
		setFocus
	};
}

