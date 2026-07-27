/**
 * Unit tests for DvUI Accessibility Utilities
 */

import {
	FocusTrap,
	createFocusTrap,
	setupSlotChangeHandlers,
	createFocusHandler,
	type FocusableComponent
} from './a11y';

// Mock MutationObserver and ResizeObserver
global.MutationObserver = class MutationObserver {
	constructor(public callback: MutationCallback) {}
	observe() {
		/* no mock functionality required beyond declaration */
	}
	disconnect() {
		/* no mock functionality required beyond declaration */
	}
	takeRecords(): MutationRecord[] {
		return [];
	}
};

global.ResizeObserver = class ResizeObserver {
	constructor(public callback: ResizeObserverCallback) {}
	observe() {
		/* no mock functionality required beyond declaration */
	}
	disconnect() {
		/* no mock functionality required beyond declaration */
	}
	unobserve() {
		/* no mock functionality required beyond declaration */
	}
};

describe('a11y utilities', () => {
	let rootElement: HTMLElement;

	beforeEach(() => {
		rootElement = document.createElement('div');
		rootElement.tabIndex = 0;
		document.body.appendChild(rootElement);
	});

	afterEach(() => {
		document.body.innerHTML = '';
		jest.restoreAllMocks();
	});

	describe('FocusTrap class', () => {
		describe('Initialization with default state', () => {
			it('should create a FocusTrap instance', () => {
				const focusTrap = new FocusTrap(rootElement);

				expect(focusTrap).toBeInstanceOf(FocusTrap);
			});

			it('should initialize with isActive false', () => {
				const focusTrap = new FocusTrap(rootElement);

				expect(focusTrap['isActive']).toBe(false);
			});

			it('should initialize with empty focusableElements array', () => {
				const focusTrap = new FocusTrap(rootElement);

				expect(focusTrap['focusableElements']).toEqual([]);
			});

			it('should use default focusable selector when none provided', () => {
				const focusTrap = new FocusTrap(rootElement);

				expect(focusTrap['focusableSelector']).toContain('a[href]');
				expect(focusTrap['focusableSelector']).toContain('button:not([disabled])');
				expect(focusTrap['focusableSelector']).toContain('input:not([disabled])');
			});

			it('should combine custom selector with default selector', () => {
				const focusTrap = new FocusTrap(rootElement, '[data-focusable]');

				expect(focusTrap['focusableSelector']).toContain('a[href]');
				expect(focusTrap['focusableSelector']).toContain('[data-focusable]');
			});

			it('should fallback to default selector when empty selector is provided', () => {
				const focusTrap = new FocusTrap(rootElement, '');

				expect(focusTrap['focusableSelector']).toBe(
					'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), dv-button:not([disabled]), dv-icon-button:not([disabled])'
				);
			});

			it('should set autoFocus to false by default', () => {
				const focusTrap = new FocusTrap(rootElement);

				expect(focusTrap['autoFocus']).toBe(false);
			});

			it('should set autoFocus when provided', () => {
				const focusTrap = new FocusTrap(rootElement, undefined, true);

				expect(focusTrap['autoFocus']).toBe(true);
			});
		});
		describe('Methods', () => {
			describe('activate()', () => {
				it('should set isActive to true when activated', () => {
					const focusTrap = new FocusTrap(rootElement);

					focusTrap.activate();

					expect(focusTrap['isActive']).toBe(true);
				});

				it('should add keydown event listener on activation', () => {
					const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
					const focusTrap = new FocusTrap(rootElement);

					focusTrap.activate();

					expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
				});

				it('should not activate if already active', () => {
					const focusTrap = new FocusTrap(rootElement);
					const setupObserversSpy = jest.spyOn(focusTrap as any, 'setupObservers');

					focusTrap.activate();
					setupObserversSpy.mockClear();
					focusTrap.activate();

					expect(setupObserversSpy).not.toHaveBeenCalled();
				});

				it('should setup observers on activation', () => {
					const focusTrap = new FocusTrap(rootElement);
					const setupObserversSpy = jest.spyOn(focusTrap as any, 'setupObservers');

					focusTrap.activate();

					expect(setupObserversSpy).toHaveBeenCalled();
				});

				it('should auto-focus first focusable element when autoFocus is true', () => {
					jest.useFakeTimers();
					const button = document.createElement('button');
					rootElement.appendChild(button);
					Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
					Object.defineProperty(button, 'offsetHeight', { value: 50, configurable: true });
					const focusSpy = jest.spyOn(button, 'focus');

					const focusTrap = new FocusTrap(rootElement, undefined, true);
					focusTrap.activate();

					jest.advanceTimersByTime(150);

					expect(focusSpy).toHaveBeenCalled();
					jest.useRealTimers();
				});

				it('should focus root element when autoFocus is false', () => {
					jest.useFakeTimers();
					const focusSpy = jest.spyOn(rootElement, 'focus');

					const focusTrap = new FocusTrap(rootElement, undefined, false);
					focusTrap.activate();

					jest.advanceTimersByTime(150);

					expect(focusSpy).toHaveBeenCalled();
					jest.useRealTimers();
				});

				it('should collect focusable elements after setTimeout delay', () => {
					jest.useFakeTimers();
					const collectSpy = jest.spyOn(FocusTrap.prototype as any, 'collectFocusableElements');

					const focusTrap = new FocusTrap(rootElement);
					focusTrap.activate();

					const initialCalls = collectSpy.mock.calls.length;
					jest.advanceTimersByTime(150);

					expect(collectSpy.mock.calls.length).toBeGreaterThan(initialCalls);
					jest.useRealTimers();
				});
			});

			describe('deactivate()', () => {
				it('should set isActive to false when deactivated', () => {
					const focusTrap = new FocusTrap(rootElement);
					focusTrap.activate();

					focusTrap.deactivate();

					expect(focusTrap['isActive']).toBe(false);
				});

				it('should remove keydown event listener on deactivation', () => {
					const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
					const focusTrap = new FocusTrap(rootElement);
					focusTrap.activate();

					focusTrap.deactivate();

					expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
				});

				it('should not deactivate if not active', () => {
					const focusTrap = new FocusTrap(rootElement);
					const cleanupObserversSpy = jest.spyOn(focusTrap as any, 'cleanupObservers');

					focusTrap.deactivate();

					expect(cleanupObserversSpy).not.toHaveBeenCalled();
				});

				it('should clear focusableElements array on deactivation', () => {
					const focusTrap = new FocusTrap(rootElement);
					focusTrap.activate();
					focusTrap['focusableElements'] = [document.createElement('button')];

					focusTrap.deactivate();

					expect(focusTrap['focusableElements']).toEqual([]);
				});

				it('should cleanup observers on deactivation', () => {
					const focusTrap = new FocusTrap(rootElement);
					focusTrap.activate();
					const cleanupObserversSpy = jest.spyOn(focusTrap as any, 'cleanupObservers');

					focusTrap.deactivate();

					expect(cleanupObserversSpy).toHaveBeenCalled();
				});
			});

			describe('update()', () => {
				it('should collect focusable elements when no slot provided', () => {
					const focusTrap = new FocusTrap(rootElement);
					focusTrap.activate();
					const collectSpy = jest.spyOn(focusTrap as any, 'collectFocusableElements');

					focusTrap.update();

					expect(collectSpy).toHaveBeenCalled();
				});

				it('should add focusable elements from slot when provided', () => {
					const slot = document.createElement('slot') as HTMLSlotElement;
					const button = document.createElement('button');
					slot.assignedElements = jest.fn().mockReturnValue([button]);

					const focusTrap = new FocusTrap(rootElement);
					focusTrap.activate();
					const addElementsSpy = jest.spyOn(focusTrap as any, 'addFocusableElements');

					focusTrap.update(slot);

					expect(addElementsSpy).toHaveBeenCalledWith([button]);
				});

				it('should not update when not active', () => {
					const focusTrap = new FocusTrap(rootElement);
					const collectSpy = jest.spyOn(focusTrap as any, 'collectFocusableElements');

					focusTrap.update();

					expect(collectSpy).not.toHaveBeenCalled();
				});

				it('should process slotted elements when active and slot provided', () => {
					const slot = document.createElement('slot') as HTMLSlotElement;
					const button = document.createElement('button');
					Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
					Object.defineProperty(button, 'offsetHeight', { value: 50, configurable: true });
					slot.assignedElements = jest.fn().mockReturnValue([button]);

					const focusTrap = new FocusTrap(rootElement);
					focusTrap.activate();

					focusTrap.update(slot);

					expect(slot.assignedElements).toHaveBeenCalledWith({ flatten: true });
				});
			});
		});

		describe('addFocusableElements method', () => {
			it('should add visible focusable elements', () => {
				const button = document.createElement('button');
				rootElement.appendChild(button);
				Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button, 'offsetHeight', { value: 50, configurable: true });

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				focusTrap['addFocusableElements']([button]);

				expect(focusTrap['focusableElements']).toContain(button);
			});

			it('should add nested focusable elements', () => {
				const container = document.createElement('div');
				const button = document.createElement('button');
				Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button, 'offsetHeight', { value: 50, configurable: true });
				container.appendChild(button);
				rootElement.appendChild(container);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				focusTrap['addFocusableElements']([container]);

				// Should find the button inside the container
				expect(focusTrap['focusableElements'].some((el) => el === button || el.tagName === 'BUTTON')).toBe(true);
			});

			it('should remove duplicates when adding elements', () => {
				const button = document.createElement('button');
				Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button, 'offsetHeight', { value: 50, configurable: true });

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();
				focusTrap['focusableElements'] = [button];

				focusTrap['addFocusableElements']([button]);

				const buttonCount = focusTrap['focusableElements'].filter((el) => el === button).length;
				expect(buttonCount).toBe(1);
			});

			it('should sort elements after adding', () => {
				const button1 = document.createElement('button');
				button1.tabIndex = 2;
				Object.defineProperty(button1, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button1, 'offsetHeight', { value: 50, configurable: true });
				rootElement.appendChild(button1);

				const button2 = document.createElement('button');
				button2.tabIndex = 1;
				Object.defineProperty(button2, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button2, 'offsetHeight', { value: 50, configurable: true });
				rootElement.appendChild(button2);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				focusTrap['addFocusableElements']([button1, button2]);

				const index1 = focusTrap['focusableElements'].indexOf(button1);
				const index2 = focusTrap['focusableElements'].indexOf(button2);
				expect(index2).toBeLessThan(index1);
			});

			it('should filter out non-HTMLElement items', () => {
				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();
				const initialLength = focusTrap['focusableElements'].length;

				const textNode = document.createTextNode('text');
				focusTrap['addFocusableElements']([textNode as any]);

				expect(focusTrap['focusableElements'].length).toBe(initialLength);
			});
		});

		describe('Focusable elements collection', () => {
			it('should exclude disabled buttons', () => {
				const button = document.createElement('button');
				button.disabled = true;
				rootElement.appendChild(button);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['collectFocusableElements']();

				expect(focusTrap['focusableElements']).not.toContain(button);
			});

			it('should exclude disabled inputs', () => {
				const input = document.createElement('input');
				input.disabled = true;
				rootElement.appendChild(input);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['collectFocusableElements']();

				expect(focusTrap['focusableElements']).not.toContain(input);
			});

			it('should exclude elements with tabindex -1', () => {
				const div = document.createElement('div');
				div.tabIndex = -1;
				rootElement.appendChild(div);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['collectFocusableElements']();

				expect(focusTrap['focusableElements']).not.toContain(div);
			});

			it('should remove duplicate elements', () => {
				const button = document.createElement('button');
				rootElement.appendChild(button);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['focusableElements'] = [button, button];
				focusTrap['collectFocusableElements']();

				const buttonCount = focusTrap['focusableElements'].filter((el) => el === button).length;
				expect(buttonCount).toBeLessThanOrEqual(1);
			});

			it('should handle error when rootElement is null', () => {
				const focusTrap = new FocusTrap(rootElement);
				focusTrap['rootElement'] = null as any;

				expect(() => focusTrap['collectFocusableElements']()).not.toThrow();
				expect(focusTrap['focusableElements']).toEqual([]);
			});

			it('should include rootElement if it has tabindex and is visible', () => {
				rootElement.tabIndex = 0;
				Object.defineProperty(rootElement, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(rootElement, 'offsetHeight', { value: 50, configurable: true });

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['collectFocusableElements']();

				expect(focusTrap['focusableElements']).toContain(rootElement);
			});

			it('should process slotted elements', () => {
				const slot = document.createElement('slot') as HTMLSlotElement;
				const button = document.createElement('button');
				Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button, 'offsetHeight', { value: 50, configurable: true });

				slot.assignedElements = jest.fn().mockReturnValue([button]);
				rootElement.appendChild(slot);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['collectFocusableElements']();

				expect(slot.assignedElements).toHaveBeenCalledWith({ flatten: true });
			});

			it('should handle nested focusable elements in slotted content', () => {
				const slot = document.createElement('slot') as HTMLSlotElement;
				const container = document.createElement('div');
				const button = document.createElement('button');
				Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button, 'offsetHeight', { value: 50, configurable: true });

				container.appendChild(button);
				slot.assignedElements = jest.fn().mockReturnValue([container]);
				rootElement.appendChild(slot);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['collectFocusableElements']();

				expect(slot.assignedElements).toHaveBeenCalledWith({ flatten: true });
			});
		});

		describe('Visibility checks', () => {
			it('should return false for null element', () => {
				const focusTrap = new FocusTrap(rootElement);

				const result = focusTrap['isVisible'](null as any);

				expect(result).toBe(false);
			});

			it('should return false for hidden elements', () => {
				const div = document.createElement('div');
				div.style.visibility = 'hidden';
				rootElement.appendChild(div);

				const focusTrap = new FocusTrap(rootElement);

				const result = focusTrap['isVisible'](div);

				expect(result).toBe(false);
			});

			it('should return false for display none elements', () => {
				const div = document.createElement('div');
				div.style.display = 'none';
				rootElement.appendChild(div);

				const focusTrap = new FocusTrap(rootElement);

				const result = focusTrap['isVisible'](div);

				expect(result).toBe(false);
			});

			it('should return true for visible element with dimensions', () => {
				const button = document.createElement('button');
				button.style.width = '100px';
				button.style.height = '50px';
				rootElement.appendChild(button);

				// Mock offsetWidth/offsetHeight
				Object.defineProperty(button, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button, 'offsetHeight', { value: 50, configurable: true });

				const focusTrap = new FocusTrap(rootElement);
				const result = focusTrap['isVisible'](button);

				expect(result).toBe(true);
			});

			it('should return false for element with zero dimensions and no client rects', () => {
				const div = document.createElement('div');
				rootElement.appendChild(div);

				// Mock zero dimensions
				Object.defineProperty(div, 'offsetWidth', { value: 0, configurable: true });
				Object.defineProperty(div, 'offsetHeight', { value: 0, configurable: true });
				div.getClientRects = jest.fn().mockReturnValue([]);

				const focusTrap = new FocusTrap(rootElement);
				const result = focusTrap['isVisible'](div);

				expect(result).toBe(false);
			});
		});

		describe('Focus trap behavior', () => {
			it('should trap Tab key to cycle through focusable elements', () => {
				const button1 = document.createElement('button');
				const button2 = document.createElement('button');
				rootElement.appendChild(button1);
				rootElement.appendChild(button2);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
				const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
				button2.focus();

				document.dispatchEvent(event);

				expect(preventDefaultSpy).toHaveBeenCalled();
			});

			it('should not handle non-Tab keys', () => {
				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
				const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

				document.dispatchEvent(event);

				expect(preventDefaultSpy).not.toHaveBeenCalled();
			});

			it('should prevent default when fewer than 2 focusable elements', () => {
				const button = document.createElement('button');
				rootElement.appendChild(button);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
				const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

				document.dispatchEvent(event);

				expect(preventDefaultSpy).toHaveBeenCalled();
			});

			it('should not handle Tab when not active', () => {
				new FocusTrap(rootElement);

				const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
				const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

				document.dispatchEvent(event);

				expect(preventDefaultSpy).not.toHaveBeenCalled();
			});

			it('should handle Tab+Shift to move focus backwards', () => {
				const button1 = document.createElement('button');
				const button2 = document.createElement('button');
				Object.defineProperty(button1, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button1, 'offsetHeight', { value: 50, configurable: true });
				Object.defineProperty(button2, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button2, 'offsetHeight', { value: 50, configurable: true });
				rootElement.appendChild(button1);
				rootElement.appendChild(button2);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				// Manually set focusable elements to ensure they're tracked
				focusTrap['focusableElements'] = [button1, button2];

				const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
				const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
				const focusSpy = jest.spyOn(button2, 'focus');

				// Mock composedPath to return the expected path
				jest
					.spyOn(event, 'composedPath')
					.mockReturnValue([
						button1,
						rootElement,
						document.body,
						document.documentElement,
						document,
						window
					] as EventTarget[]);

				// Simulate focus on first element
				button1.focus();
				Object.defineProperty(rootElement.getRootNode(), 'activeElement', {
					value: button1,
					configurable: true
				});

				focusTrap['handleKeyDown'](event);

				expect(preventDefaultSpy).toHaveBeenCalled();
				expect(focusSpy).toHaveBeenCalled();
			});

			it('should handle Tab to move focus forwards from last element', () => {
				const button1 = document.createElement('button');
				const button2 = document.createElement('button');
				Object.defineProperty(button1, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button1, 'offsetHeight', { value: 50, configurable: true });
				Object.defineProperty(button2, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button2, 'offsetHeight', { value: 50, configurable: true });
				rootElement.appendChild(button1);
				rootElement.appendChild(button2);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				focusTrap['focusableElements'] = [button1, button2];

				const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true });
				const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
				const focusSpy = jest.spyOn(button1, 'focus');

				// Mock composedPath to return the expected path
				jest
					.spyOn(event, 'composedPath')
					.mockReturnValue([
						button2,
						rootElement,
						document.body,
						document.documentElement,
						document,
						window
					] as EventTarget[]);

				button2.focus();
				Object.defineProperty(document, 'activeElement', {
					value: button2,
					configurable: true
				});

				focusTrap['handleKeyDown'](event);

				expect(preventDefaultSpy).toHaveBeenCalled();
				expect(focusSpy).toHaveBeenCalled();
			});
			it('should recollect focusable elements on Tab keydown', () => {
				const button = document.createElement('button');
				rootElement.appendChild(button);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();

				const collectSpy = jest.spyOn(focusTrap as any, 'collectFocusableElements');
				const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });

				focusTrap['handleKeyDown'](event);

				expect(collectSpy).toHaveBeenCalled();
			});

			it('should treat delegated shadow focus as direct focus for wrapping', () => {
				const button1 = document.createElement('button');
				const button2 = document.createElement('button');
				const shadowChild = document.createElement('span');
				Object.defineProperty(button1, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button1, 'offsetHeight', { value: 50, configurable: true });
				Object.defineProperty(button2, 'offsetWidth', { value: 100, configurable: true });
				Object.defineProperty(button2, 'offsetHeight', { value: 50, configurable: true });
				rootElement.appendChild(button1);
				rootElement.appendChild(button2);

				Object.defineProperty(button1, 'shadowRoot', {
					value: {
						delegatesFocus: true,
						contains: jest.fn().mockReturnValue(true)
					},
					configurable: true
				});

				const focusTrap = new FocusTrap(rootElement);
				focusTrap.activate();
				focusTrap['focusableElements'] = [button1, button2];

				const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
				const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
				const focusSpy = jest.spyOn(button2, 'focus');

				jest
					.spyOn(event, 'composedPath')
					.mockReturnValue([
						shadowChild,
						button1,
						rootElement,
						document.body,
						document.documentElement,
						document,
						window
					] as EventTarget[]);

				focusTrap['handleKeyDown'](event);

				expect(preventDefaultSpy).toHaveBeenCalled();
				expect(focusSpy).toHaveBeenCalled();
			});
		});

		describe('Observer setup and cleanup', () => {
			it('should setup mutation observer on activation', () => {
				const focusTrap = new FocusTrap(rootElement);

				focusTrap.activate();

				expect(focusTrap['mutationObserver']).not.toBeNull();
			});

			it('should setup resize observer on activation', () => {
				const focusTrap = new FocusTrap(rootElement);

				focusTrap.activate();

				expect(focusTrap['resizeObserver']).not.toBeNull();
			});

			it('should collect focusable elements from mutation observer callback when active', () => {
				const focusTrap = new FocusTrap(rootElement);
				const collectSpy = jest.spyOn(focusTrap as any, 'collectFocusableElements');
				focusTrap['isActive'] = true;
				focusTrap['setupObservers']();
				const mutationObserver = focusTrap['mutationObserver'] as MutationObserver & {
					callback: MutationCallback;
				};

				mutationObserver.callback([], mutationObserver);

				expect(collectSpy).toHaveBeenCalled();
			});

			it('should not collect focusable elements from mutation observer callback when inactive', () => {
				const focusTrap = new FocusTrap(rootElement);
				const collectSpy = jest.spyOn(focusTrap as any, 'collectFocusableElements');
				focusTrap['isActive'] = false;
				focusTrap['setupObservers']();
				const mutationObserver = focusTrap['mutationObserver'] as MutationObserver & {
					callback: MutationCallback;
				};

				mutationObserver.callback([], mutationObserver);

				expect(collectSpy).not.toHaveBeenCalled();
			});

			it('should collect focusable elements from resize observer callback when active', () => {
				const focusTrap = new FocusTrap(rootElement);
				const collectSpy = jest.spyOn(focusTrap as any, 'collectFocusableElements');
				focusTrap['isActive'] = true;
				focusTrap['setupObservers']();
				const resizeObserver = focusTrap['resizeObserver'] as ResizeObserver & {
					callback: ResizeObserverCallback;
				};

				resizeObserver.callback([], resizeObserver);

				expect(collectSpy).toHaveBeenCalled();
			});

			it('should not collect focusable elements from resize observer callback when inactive', () => {
				const focusTrap = new FocusTrap(rootElement);
				const collectSpy = jest.spyOn(focusTrap as any, 'collectFocusableElements');
				focusTrap['isActive'] = false;
				focusTrap['setupObservers']();
				const resizeObserver = focusTrap['resizeObserver'] as ResizeObserver & {
					callback: ResizeObserverCallback;
				};

				resizeObserver.callback([], resizeObserver);

				expect(collectSpy).not.toHaveBeenCalled();
			});

			it('should observe rootElement with mutation observer', () => {
				const focusTrap = new FocusTrap(rootElement);
				const observeSpy = jest.spyOn(MutationObserver.prototype, 'observe');

				focusTrap.activate();

				expect(observeSpy).toHaveBeenCalledWith(rootElement, {
					childList: true,
					subtree: true,
					attributes: true,
					attributeFilter: ['disabled', 'tabindex', 'hidden', 'style']
				});
			});

			it('should observe rootElement with resize observer', () => {
				const focusTrap = new FocusTrap(rootElement);
				const observeSpy = jest.spyOn(ResizeObserver.prototype, 'observe');

				focusTrap.activate();

				expect(observeSpy).toHaveBeenCalledWith(rootElement);
			});

			it('should disconnect mutation observer on cleanup', () => {
				const focusTrap = new FocusTrap(rootElement);
				focusTrap['setupObservers']();
				const disconnectSpy = jest.spyOn(focusTrap['mutationObserver']!, 'disconnect');

				focusTrap['cleanupObservers']();

				expect(disconnectSpy).toHaveBeenCalled();
			});

			it('should not throw when cleanup runs with null observers', () => {
				const focusTrap = new FocusTrap(rootElement);
				focusTrap['mutationObserver'] = null;
				focusTrap['resizeObserver'] = null;

				expect(() => focusTrap['cleanupObservers']()).not.toThrow();
				expect(focusTrap['mutationObserver']).toBeNull();
				expect(focusTrap['resizeObserver']).toBeNull();
			});

			it('should disconnect resize observer on cleanup', () => {
				const focusTrap = new FocusTrap(rootElement);
				focusTrap['setupObservers']();
				const disconnectSpy = jest.spyOn(focusTrap['resizeObserver']!, 'disconnect');

				focusTrap['cleanupObservers']();

				expect(disconnectSpy).toHaveBeenCalled();
			});

			it('should set observers to null after cleanup', () => {
				const focusTrap = new FocusTrap(rootElement);
				focusTrap['setupObservers']();

				focusTrap['cleanupObservers']();

				expect(focusTrap['mutationObserver']).toBeNull();
				expect(focusTrap['resizeObserver']).toBeNull();
			});
		});

		describe('Element sorting', () => {
			it('should sort elements by tabindex', () => {
				const elem1 = document.createElement('button');
				elem1.tabIndex = 2;
				const elem2 = document.createElement('button');
				elem2.tabIndex = 1;
				const elem3 = document.createElement('button');
				elem3.tabIndex = 3;

				rootElement.appendChild(elem1);
				rootElement.appendChild(elem2);
				rootElement.appendChild(elem3);

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['focusableElements'] = [elem1, elem2, elem3];
				focusTrap['sortFocusableElements']();

				expect(focusTrap['focusableElements'][0].tabIndex).toBe(1);
				expect(focusTrap['focusableElements'][1].tabIndex).toBe(2);
				expect(focusTrap['focusableElements'][2].tabIndex).toBe(3);
			});

			it('should prioritize positive tabindex over 0', () => {
				const elem1 = document.createElement('button');
				elem1.tabIndex = 0;
				const elem2 = document.createElement('button');
				elem2.tabIndex = 1;

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['focusableElements'] = [elem1, elem2];
				focusTrap['sortFocusableElements']();

				expect(focusTrap['focusableElements'][0]).toBe(elem2);
			});

			it('should handle mixed positive and zero tabindex values', () => {
				const elem1 = document.createElement('button');
				elem1.tabIndex = 0;
				const elem2 = document.createElement('button');
				elem2.tabIndex = 2;
				const elem3 = document.createElement('button');
				elem3.tabIndex = 0;
				const elem4 = document.createElement('button');
				elem4.tabIndex = 1;

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['focusableElements'] = [elem1, elem2, elem3, elem4];
				focusTrap['sortFocusableElements']();

				expect(focusTrap['focusableElements'][0].tabIndex).toBe(1);
				expect(focusTrap['focusableElements'][1].tabIndex).toBe(2);
			});

			it('should keep natural order for elements with same tabindex', () => {
				const elem1 = document.createElement('button');
				elem1.tabIndex = 0;
				elem1.id = 'first';
				const elem2 = document.createElement('button');
				elem2.tabIndex = 0;
				elem2.id = 'second';

				const focusTrap = new FocusTrap(rootElement);
				focusTrap['focusableElements'] = [elem1, elem2];
				focusTrap['sortFocusableElements']();

				expect(focusTrap['focusableElements'][0].id).toBe('first');
				expect(focusTrap['focusableElements'][1].id).toBe('second');
			});
		});

		describe('Error handling', () => {
			it('should handle errors in collectFocusableElements gracefully', () => {
				const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
				const focusTrap = new FocusTrap(rootElement);

				// Force an error by making querySelectorAll throw
				jest.spyOn(rootElement, 'querySelectorAll').mockImplementation(() => {
					throw new Error('Test error');
				});

				expect(() => focusTrap['collectFocusableElements']()).not.toThrow();
				expect(consoleErrorSpy).toHaveBeenCalledWith('Error in collectFocusableElements:', expect.any(Error));
			});

			it('should handle errors in isVisible gracefully', () => {
				const focusTrap = new FocusTrap(rootElement);
				const element = document.createElement('div');

				// Mock getComputedStyle to throw
				jest.spyOn(window, 'getComputedStyle').mockImplementation(() => {
					throw new Error('Test error');
				});

				const result = focusTrap['isVisible'](element);

				expect(result).toBe(false);
			});
		});
	});

	describe('createFocusTrap function', () => {
		describe('Initialization with default state', () => {
			it('should create a FocusTrap instance', () => {
				const focusTrap = createFocusTrap({ rootElement });

				expect(focusTrap).toBeInstanceOf(FocusTrap);
			});

			it('should use provided rootElement', () => {
				const focusTrap = createFocusTrap({ rootElement });

				expect(focusTrap['rootElement']).toBe(rootElement);
			});

			it('should use provided focusableSelector', () => {
				const focusTrap = createFocusTrap({
					rootElement,
					focusableSelector: '[data-custom]'
				});

				expect(focusTrap['focusableSelector']).toContain('[data-custom]');
			});

			it('should use provided autoFocus option', () => {
				const focusTrap = createFocusTrap({
					rootElement,
					autoFocus: true
				});

				expect(focusTrap['autoFocus']).toBe(true);
			});
		});
	});

	describe('setupSlotChangeHandlers function', () => {
		describe('Initialization with default state', () => {
			it('should register slotchange handlers for all slots', () => {
				const slot1 = document.createElement('slot') as HTMLSlotElement;
				const slot2 = document.createElement('slot') as HTMLSlotElement;
				const addEventListenerSpy1 = jest.spyOn(slot1, 'addEventListener');
				const addEventListenerSpy2 = jest.spyOn(slot2, 'addEventListener');

				const focusTrap = createFocusTrap({ rootElement });

				setupSlotChangeHandlers(focusTrap, [slot1, slot2]);

				expect(addEventListenerSpy1).toHaveBeenCalledWith('slotchange', expect.any(Function));
				expect(addEventListenerSpy2).toHaveBeenCalledWith('slotchange', expect.any(Function));
			});

			it('should return cleanup function', () => {
				const slot = document.createElement('slot') as HTMLSlotElement;
				const focusTrap = createFocusTrap({ rootElement });

				const cleanup = setupSlotChangeHandlers(focusTrap, [slot]);

				expect(typeof cleanup).toBe('function');
			});

			it('should filter out null/undefined slots', () => {
				const slot = document.createElement('slot') as HTMLSlotElement;
				const focusTrap = createFocusTrap({ rootElement });

				expect(() => {
					setupSlotChangeHandlers(focusTrap, [slot, null as any, undefined as any]);
				}).not.toThrow();
			});
		});

		describe('Methods', () => {
			it('should call focusTrap.update when slot changes', () => {
				const slot = document.createElement('slot') as HTMLSlotElement;
				const focusTrap = createFocusTrap({ rootElement });
				const updateSpy = jest.spyOn(focusTrap, 'update');

				setupSlotChangeHandlers(focusTrap, [slot]);
				slot.dispatchEvent(new Event('slotchange'));

				expect(updateSpy).toHaveBeenCalledWith(slot);
			});

			it('should remove event listeners when cleanup called', () => {
				const slot = document.createElement('slot') as HTMLSlotElement;
				const removeEventListenerSpy = jest.spyOn(slot, 'removeEventListener');
				const focusTrap = createFocusTrap({ rootElement });

				const cleanup = setupSlotChangeHandlers(focusTrap, [slot]);
				cleanup();

				expect(removeEventListenerSpy).toHaveBeenCalledWith('slotchange', expect.any(Function));
			});
		});
	});

	describe('createFocusHandler function', () => {
		let component: FocusableComponent;
		let internalElement: HTMLInputElement;

		beforeEach(() => {
			internalElement = document.createElement('input');
			const hostElement = document.createElement('div');
			document.body.appendChild(hostElement);
			document.body.appendChild(internalElement);

			component = {
				host: hostElement,
				disabled: false,
				internalElement
			};
		});

		describe('Initialization with default state', () => {
			it('should return focus handler object with required methods', () => {
				const handler = createFocusHandler(component, () => internalElement);

				expect(handler).toHaveProperty('handleHostFocus');
				expect(handler).toHaveProperty('setupFocusHandling');
				expect(handler).toHaveProperty('cleanupFocusHandling');
				expect(handler).toHaveProperty('setFocus');
			});

			it('should return functions for all handler methods', () => {
				const handler = createFocusHandler(component, () => internalElement);

				expect(typeof handler.handleHostFocus).toBe('function');
				expect(typeof handler.setupFocusHandling).toBe('function');
				expect(typeof handler.cleanupFocusHandling).toBe('function');
				expect(typeof handler.setFocus).toBe('function');
			});
		});

		describe('Methods', () => {
			describe('handleHostFocus()', () => {
				it('should focus internal element when host receives focus', () => {
					const handler = createFocusHandler(component, () => internalElement);
					const focusSpy = jest.spyOn(internalElement, 'focus');

					handler.handleHostFocus();

					expect(focusSpy).toHaveBeenCalled();
				});

				it('should not focus internal element when component is disabled', () => {
					component.disabled = true;
					const handler = createFocusHandler(component, () => internalElement);
					const focusSpy = jest.spyOn(internalElement, 'focus');

					handler.handleHostFocus();

					expect(focusSpy).not.toHaveBeenCalled();
				});

				it('should not focus when internal element is null', () => {
					const handler = createFocusHandler(component, () => null);

					expect(() => handler.handleHostFocus()).not.toThrow();
				});
			});

			describe('setupFocusHandling()', () => {
				it('should add focus event listener to host', () => {
					const addEventListenerSpy = jest.spyOn(component.host, 'addEventListener');
					const handler = createFocusHandler(component, () => internalElement);

					handler.setupFocusHandling();

					expect(addEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
				});

				it('should override host focus method', () => {
					const originalFocus = component.host.focus;
					const handler = createFocusHandler(component, () => internalElement);

					handler.setupFocusHandling();

					expect(component.host.focus).not.toBe(originalFocus);
				});

				it('should focus internal element when host.focus() called', () => {
					const handler = createFocusHandler(component, () => internalElement);
					handler.setupFocusHandling();
					const focusSpy = jest.spyOn(internalElement, 'focus');

					component.host.focus();

					expect(focusSpy).toHaveBeenCalled();
				});

				it('should not focus internal element when disabled', () => {
					component.disabled = true;
					const handler = createFocusHandler(component, () => internalElement);
					handler.setupFocusHandling();
					const focusSpy = jest.spyOn(internalElement, 'focus');

					component.host.focus();

					expect(focusSpy).not.toHaveBeenCalled();
				});
			});

			describe('cleanupFocusHandling()', () => {
				it('should remove focus event listener from host', () => {
					const removeEventListenerSpy = jest.spyOn(component.host, 'removeEventListener');
					const handler = createFocusHandler(component, () => internalElement);

					handler.cleanupFocusHandling();

					expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
				});
			});

			describe('setFocus()', () => {
				it('should return a Promise', () => {
					const handler = createFocusHandler(component, () => internalElement);

					const result = handler.setFocus();

					expect(result).toBeInstanceOf(Promise);
				});

				it('should focus internal element when called', async () => {
					const handler = createFocusHandler(component, () => internalElement);
					const focusSpy = jest.spyOn(internalElement, 'focus');

					await handler.setFocus();

					expect(focusSpy).toHaveBeenCalled();
				});

				it('should not focus when component is disabled', async () => {
					component.disabled = true;
					const handler = createFocusHandler(component, () => internalElement);
					const focusSpy = jest.spyOn(internalElement, 'focus');

					await handler.setFocus();

					expect(focusSpy).not.toHaveBeenCalled();
				});

				it('should not focus when internal element is null', async () => {
					const handler = createFocusHandler(component, () => null);

					await expect(handler.setFocus()).resolves.toBeUndefined();
				});

				it('should resolve promise successfully', async () => {
					const handler = createFocusHandler(component, () => internalElement);

					await expect(handler.setFocus()).resolves.toBeUndefined();
				});
			});
		});

		describe('Edge cases', () => {
			it('should handle null internal element getter', () => {
				const handler = createFocusHandler(component, () => null);

				expect(() => handler.handleHostFocus()).not.toThrow();
				expect(() => handler.setupFocusHandling()).not.toThrow();
			});

			it('should handle undefined internal element getter', () => {
				const handler = createFocusHandler(component, () => undefined);

				expect(() => handler.handleHostFocus()).not.toThrow();
			});

			it('should fallback to original focus when internal element is null', () => {
				const originalFocus = jest.fn();
				component.host.focus = originalFocus;
				const handler = createFocusHandler(component, () => null);

				handler.setupFocusHandling();
				component.host.focus();

				expect(originalFocus).toHaveBeenCalled();
			});
		});
	});
});

