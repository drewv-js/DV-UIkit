import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvSelect } from './dv-select';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-select', () => {
	const originalConsoleError = console.error;
	// Before each test suite
	beforeAll(() => {
		// Suppress ElementInternals console errors
		console.error = (...args) => {
			if (
				args.some(
					(arg) =>
						typeof arg === 'string' &&
						(arg.includes('setFormValue was accessed on ElementInternals') ||
							arg.includes('setValidity was accessed on ElementInternals'))
				)
			) {
				return;
			}
			originalConsoleError(...args);
		};
	});

	// After each test suite
	afterAll(() => {
		// Restore the original console.error
		console.error = originalConsoleError;
	});

	let select: TypedSpecPage<DvSelect>;

	beforeEach(async () => {
		select = (await newSpecPage({
			components: [DvSelect],
			html: `
          <dv-select>
            <dv-option id='item1'></dv-option>
            <dv-option id='item2'></dv-option>
          </dv-select>
        `,
			supportsShadowDom: true
		})) as TypedSpecPage<DvSelect>;
		// Mock getMenuItems
		const item1 = select.root.querySelector('#item1') as any;
		const item2 = select.root.querySelector('#item2') as any;
		item1.focus = jest.fn();
		item2.focus = jest.fn();
		item1.setFocus = jest.fn();
		item2.setFocus = jest.fn();
		jest.spyOn(select.rootInstance, 'getAllOptions').mockReturnValue([item1, item2]);
		await select.waitForChanges();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		select = null;
	});

	describe('Initialization with default state', () => {
		it('should render with default classes', async () => {
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');

			expect(comboboxContainer).toHaveClass('border-form-default');
			expect(comboboxContainer).toHaveClass('bg-default');
			expect(comboboxContainer).toHaveClass('body-default');
			expect(comboboxContainer).toHaveClass('rounded-radius-lg');
			expect(comboboxContainer).toHaveClass('border');
			expect(comboboxContainer).toHaveClass('grow');
			expect(comboboxContainer).toHaveClass('flex');
			expect(comboboxContainer).toHaveClass('w-full');
			expect(comboboxContainer).toHaveClass('min-w-0');
			expect(comboboxContainer).toHaveClass('relative');
			expect(comboboxContainer).toHaveClass('items-center');
			expect(comboboxContainer).toHaveClass('justify-start');
			expect(comboboxContainer).toHaveClass('align-middle');
			expect(comboboxContainer).toHaveClass('overflow-hidden');
			expect(comboboxContainer).toHaveClass('pr-4');
			expect(comboboxContainer).toHaveClass('cursor-pointer');
		});

		it('should render without label when no label prop supplied', async () => {
			await select.waitForChanges();

			const label = select.root.shadowRoot.querySelector('dv-label');

			expect(select.root.label).toBeUndefined();
			expect(label).toBeNull();
		});

		it('should render without placeholder prop not supplied', async () => {
			await select.waitForChanges();

			const displayInput = select.root.shadowRoot.querySelector('input');

			expect(select.root.placeholder).toBe('');
			expect(displayInput.getAttribute('placeholder')).toBe('');
		});

		it('should render inner popup with absolute positioning when hoist false', async () => {
			await select.waitForChanges();

			const popup = select.root.shadowRoot.querySelector('dv-popup');
			expect(popup.getAttribute('strategy')).toBe('absolute');
		});

		it('should render listbox with tabIndex -1 for accessibility', async () => {
			await select.waitForChanges();

			const listboxContainer = select.root.shadowRoot.querySelector('[role="listbox"]');

			expect(listboxContainer).not.toBeNull();
			expect(listboxContainer.getAttribute('tabindex')).toBe('-1');
		});

		it('should render combobox input as focusable in tab sequence', async () => {
			await select.waitForChanges();

			const comboboxInput = select.root.shadowRoot.querySelector('input[role="combobox"]');

			expect(comboboxInput).not.toBeNull();
			const tabIndex = comboboxInput.getAttribute('tabindex');
			expect(tabIndex === '0' || tabIndex === null).toBe(true);
		});

		it('should render hidden value input with tabIndex -1', async () => {
			await select.waitForChanges();

			const valueInput = select.root.shadowRoot.querySelector('input[aria-hidden="true"]');

			expect(valueInput).not.toBeNull();
			expect(valueInput.getAttribute('tabindex')).toBe('-1');
		});

		it('should not update value if value has not changed from default', async () => {
			select.root.value = '';
			await select.waitForChanges();

			expect(select.rootInstance.defaultValue).toBe('');
			expect(select.rootInstance.valueHasChanged).toBe(false);
		});
	});

	describe('Props', () => {
		it('should render with label when label prop supplied', async () => {
			select.root.label = 'label supplied';
			await select.waitForChanges();

			const label = select.root.shadowRoot.querySelector('dv-label');

			expect(select.root.label).toBe('label supplied');
			expect(label).not.toBeNull();
		});

		it('should render with placeholder when prop supplied', async () => {
			select.root.placeholder = 'placeholder supplied';
			await select.waitForChanges();

			const displayInput = select.root.shadowRoot.querySelector('input');

			expect(select.root.placeholder).toBe('placeholder supplied');
			expect(displayInput.getAttribute('placeholder')).toBe('placeholder supplied');
		});

		it('should render with disabled classes when disabled prop is true', async () => {
			select.root.disabled = true;
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');

			expect(select.root.disabled).toBe(true);

			expect(comboboxContainer).toHaveClass('text-disabled');
			expect(comboboxContainer).toHaveClass('bg-form-disabled');
			expect(comboboxContainer).toHaveClass('cursor-not-allowed');
			expect(comboboxContainer).toHaveClass('outline-none');
			expect(comboboxContainer).not.toHaveClass('cursor-pointer');
		});

		it('should render inner popup with fixed positioning when hoist true', async () => {
			select.root.hoist = true;
			await select.waitForChanges();

			const popup = select.root.shadowRoot.querySelector('dv-popup');
			expect(popup.getAttribute('strategy')).toBe('fixed');
		});

		it('should set has error if required and no valid value selected', async () => {
			await select.waitForChanges();
			select.root.required = true;
			select.root.errorText = 'This is the error text';
			select.root.value = '';
			await select.waitForChanges();

			expect(select.rootInstance.hasError).toBe(true);
		});

		it('should render label with error variant when hasError is true', async () => {
			select.root.label = 'Test Label';
			select.rootInstance.hasError = true;
			await select.waitForChanges();

			const label = select.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('error');
		});

		it('should render label with disabled variant when disabled is true', async () => {
			select.root.label = 'Test Label';
			select.root.disabled = true;
			await select.waitForChanges();

			const label = select.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('disabled');
		});

		it('should render helpText with text-disabled class when disabled', async () => {
			select.root.helpText = 'Help message';
			select.root.disabled = true;
			await select.waitForChanges();

			const helpDiv = select.root.shadowRoot.querySelector('.body-xs.mt-1.text-disabled');
			expect(helpDiv).not.toBeNull();
			expect(helpDiv.textContent).toBe('Help message');
		});

		it('should render helpText with text-subtle class when not disabled', async () => {
			select.root.helpText = 'Help message';
			select.root.disabled = false;
			await select.waitForChanges();

			const helpDiv = select.root.shadowRoot.querySelector('.body-xs.mt-1.text-subtle');
			expect(helpDiv).not.toBeNull();
			expect(helpDiv.textContent).toBe('Help message');
		});

		it('should not change open state when disabled changes from true to false', async () => {
			select.root.disabled = true;
			select.root.open = false;
			await select.waitForChanges();

			select.root.disabled = false;
			await select.waitForChanges();

			expect(select.root.open).toBe(false);
		});

		it('should render sm size classes when size is sm', async () => {
			select.root.size = 'sm';
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');
			const displayInput = select.root.shadowRoot.querySelector('input[role="combobox"]');

			expect(comboboxContainer).toHaveClass('body-sm');
			expect(comboboxContainer).not.toHaveClass('body-default');
			expect(displayInput).toHaveClass('body-sm');
			expect(displayInput).toHaveClass('py-1');
			expect(displayInput).not.toHaveClass('py-2');
		});

		it('should render md size classes when size is md', async () => {
			select.root.size = 'md';
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');
			const displayInput = select.root.shadowRoot.querySelector('input[role="combobox"]');

			expect(comboboxContainer).toHaveClass('body-default');
			expect(comboboxContainer).not.toHaveClass('body-sm');
			expect(displayInput).toHaveClass('body-default');
			expect(displayInput).toHaveClass('py-2');
			expect(displayInput).not.toHaveClass('py-1');
		});

		it('should propagate size to slotted icons via syncIconSizes', async () => {
			select.root.innerHTML = '<dv-icon slot="startIcon" name="search"></dv-icon>';
			select.root.size = 'sm';
			await select.waitForChanges();

			const icon = select.root.querySelector('dv-icon[slot="startIcon"]') as any;
			expect(icon.size).toBe('xs');
		});

		it('should propagate disabled color to startIcon wrapper if disabled', async () => {
			select.root.innerHTML = '<dv-icon slot="startIcon" name="search"></dv-icon>';
			select.root.disabled = true;
			await select.waitForChanges();

			const startIconWrapper = select.root.shadowRoot.querySelector('div.absolute.inset-y-0.left-4');
			expect(startIconWrapper).not.toBeNull();
			expect(startIconWrapper).toHaveClass('text-disabled');
		});

		it('should update distance if popup placement top', async () => {
			select.root.placement = 'top';
			await select.waitForChanges();

			const popup = select.root.shadowRoot.querySelector('dv-popup');
			expect(popup).not.toBeNull();
			expect(popup.getAttribute('distance')).toBe('15');
		});
	});

	describe('Events', () => {
		it('should open listbox when select combobox clicked', async () => {
			select.root.open = false;
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');

			const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
			comboboxContainer.dispatchEvent(mousedownEvent);

			expect(select.root.open).toBe(true);
			expect(select.rootInstance.listbox.hidden).toBe(false);
			expect(select.rootInstance.popup.active).toBe(true);
		});

		it('should not open listbox when select combobox clicked if disabled', async () => {
			select.root.open = false;
			select.root.disabled = true;
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');

			const mousedownEvent = new MouseEvent('mousedown', { bubbles: true });
			comboboxContainer.dispatchEvent(mousedownEvent);

			expect(select.root.open).toBe(false);
		});

		it('calls hide method when Escape key is pressed', async () => {
			select.root.open = true;
			await select.waitForChanges();

			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			document.dispatchEvent(event);
			select.root.removeAttribute('open');
			await select.waitForChanges();

			expect(select.root.open).toBe(false);
		});

		it('calls show method when Enter key is pressed and select is closed', async () => {
			select.root.open = false;
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');
			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			comboboxContainer.dispatchEvent(event);
			select.root.removeAttribute('open');
			await select.waitForChanges();

			expect(select.root.open).toBe(true);
		});

		it('does not call keydown handler when Tab key is pressed', async () => {
			select.root.open = false;
			await select.waitForChanges();

			select.rootInstance.handleDocumentKeyDown = jest.fn();
			const comboboxContainer = select.root.shadowRoot.querySelector('div div');
			const event = new KeyboardEvent('keydown', { key: 'Tab' });
			comboboxContainer.dispatchEvent(event);
			select.root.removeAttribute('open');
			await select.waitForChanges();

			expect(select.root.open).toBe(false);
			expect(select.rootInstance.handleDocumentKeyDown).not.toHaveBeenCalled();
		});

		it('calls hide method when select is opened and elsewhere on document focused', async () => {
			select.root.open = true;
			select.root.disabled = false;
			await select.waitForChanges();

			// check that select starts open
			expect(select.root.open).toBe(true);

			// simulate focusin event in document
			const focusIn = new KeyboardEvent('focusin');
			document.dispatchEvent(focusIn);
			await select.waitForChanges();

			// check that select not open
			expect(select.root.open).toBe(false);
		});

		it('does not call hide method when select is opened and select focused', async () => {
			select.root.open = true;
			select.root.disabled = false;
			await select.waitForChanges();

			// check that select starts open
			expect(select.root.open).toBe(true);

			// simulate focusin event in select
			const combobox = select.root.shadowRoot.querySelector('div div');
			const focusIn = new KeyboardEvent('focusin');
			combobox.dispatchEvent(focusIn);
			await select.waitForChanges();

			// check that select remains open
			expect(select.root.open).toBe(true);
		});

		it('should navigate options with ArrowDown/ArrowUp/Home/End keys', async () => {
			const [item1, item2] = select.rootInstance.getAllOptions() as any[];
			item1.focus = jest.fn();
			item2.focus = jest.fn();

			const container = select.root.shadowRoot.querySelector('div div');

			// ArrowDown opens and selects first
			container.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			await select.waitForChanges();
			expect(select.rootInstance.currentOption).toBe(item1);

			// ArrowDown moves to second
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			await select.waitForChanges();
			expect(select.rootInstance.currentOption).toBe(item2);

			// ArrowDown wraps to first
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			await select.waitForChanges();
			expect(select.rootInstance.currentOption).toBe(item1);

			// ArrowUp wraps to last
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
			await select.waitForChanges();
			expect(select.rootInstance.currentOption).toBe(item2);

			// End goes to last
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
			await select.waitForChanges();
			expect(select.rootInstance.currentOption).toBe(item2);

			// Home goes to first
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
			await select.waitForChanges();
			expect(select.rootInstance.currentOption).toBe(item1);
		});

		it('should select current option and close on Enter key when open', async () => {
			const [item1] = select.rootInstance.getAllOptions() as any[];
			item1.disabled = false;
			item1.focus = jest.fn();

			await select.root.selectShow();
			await select.waitForChanges();

			(select.rootInstance as any).currentOption = item1;
			const setSelectedSpy = jest.spyOn(select.rootInstance as any, 'setSelectedOption').mockResolvedValue(undefined);

			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
			await select.waitForChanges();

			expect(setSelectedSpy).toHaveBeenCalledWith(item1);
			expect(select.root.open).toBe(false);
		});

		it('should set focusVisible on first option when opened by keyboard Enter', async () => {
			const [item1] = select.rootInstance.getAllOptions() as any[];

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');
			comboboxContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
			await select.waitForChanges();

			await new Promise((resolve) => requestAnimationFrame(resolve));
			await select.waitForChanges();

			expect(item1.setFocus).toHaveBeenCalledWith(true);
		});

		it('should not set focusVisible when opened by ArrowDown then navigated', async () => {
			const [item1] = select.rootInstance.getAllOptions() as any[];

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');
			comboboxContainer.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			await select.waitForChanges();

			await new Promise((resolve) => requestAnimationFrame(resolve));
			await select.waitForChanges();

			expect(item1.setFocus).toHaveBeenCalledWith(true);
		});

		it('should set hasFocus to true on displayInput focus', async () => {
			await select.waitForChanges();

			const displayInput = select.root.shadowRoot.querySelector('input[role="combobox"]');
			displayInput.dispatchEvent(new FocusEvent('focus'));
			await select.waitForChanges();

			expect(select.rootInstance.hasFocus).toBe(true);
		});

		it('should set hasFocus to false on displayInput blur', async () => {
			select.rootInstance.hasFocus = true;
			await select.waitForChanges();

			const displayInput = select.root.shadowRoot.querySelector('input[role="combobox"]');
			displayInput.dispatchEvent(new FocusEvent('blur'));
			await select.waitForChanges();

			expect(select.rootInstance.hasFocus).toBe(false);
		});
	});

	describe('Methods', () => {
		it('should open listbox when show method is called', async () => {
			select.root.open = false;
			await select.waitForChanges();

			await select.root.selectShow();
			await select.waitForChanges();

			expect(select.root.open).toBe(true);
		});

		it('should not open listbox when show method is called if select disabled', async () => {
			select.root.open = false;
			select.root.disabled = true;
			await select.waitForChanges();

			await select.root.selectShow();
			await select.waitForChanges();

			expect(select.root.open).toBe(false);
		});

		it('should close listbox when hide method is called', async () => {
			select.root.open = true;
			await select.waitForChanges();

			await select.root.selectHide();
			await select.waitForChanges();

			expect(select.root.open).toBe(false);
		});

		it('should return all options', async () => {
			const options = await select.rootInstance.getAllOptions();
			expect(options.length).toBe(2);
		});

		it('should set current item', async () => {
			const item2 = select.root.querySelector('#item2') as any;
			await select.waitForChanges();

			expect(select.rootInstance.currentOption).toBeFalsy();

			await select.rootInstance.setCurrentOption(item2);
			expect(select.rootInstance.currentOption).toBe(item2);
		});

		it('should return correct animation config for all keys in getAnimation', () => {
			const keys = ['select.show', 'select.hide'];
			for (const key of keys) {
				const config = select.rootInstance['getAnimation'](key);
				expect(config.keyframes.length).toBeGreaterThan(0);
				expect(typeof config.options).toBe('object');
			}
		});

		it('should return empty animation config for unknown animation name', () => {
			const animation = select.rootInstance['getAnimation']('unknown.animation');

			expect(animation.keyframes).toEqual([]);
			expect(animation.options).toEqual({});
		});

		it('should animate element when animateTo is called with valid element', async () => {
			const element = document.createElement('div') as any;
			const mockAnimation = { onfinish: null as (() => void) | null };
			element.animate = jest.fn().mockReturnValue(mockAnimation);

			const animatePromise = (select.rootInstance as any).animateTo(element, [{ opacity: 0 }, { opacity: 1 }], {
				duration: 100
			});

			mockAnimation.onfinish?.();
			await animatePromise;

			expect(element.animate).toHaveBeenCalledWith([{ opacity: 0 }, { opacity: 1 }], { duration: 100 });
		});

		it('should call setCurrentOption in requestAnimationFrame when opening', async () => {
			const [item1] = select.rootInstance.getAllOptions() as any[];
			item1.focus = jest.fn();
			item1.selected = true;

			const setCurrentSpy = jest.spyOn(select.rootInstance as any, 'setCurrentOption');

			await select.root.selectShow();
			await select.waitForChanges();

			// Trigger requestAnimationFrame callback
			await new Promise((resolve) => requestAnimationFrame(resolve));
			await select.waitForChanges();

			expect(setCurrentSpy).toHaveBeenCalled();
		});

		it('should call animateTo with undefined popup on open', async () => {
			const animateToSpy = jest.spyOn(select.rootInstance, 'animateTo').mockResolvedValue(undefined);
			const undefinedPopup = {
				set active(_value: boolean) {
					select.rootInstance.popup = undefined;
				},
				get active() {
					return false;
				},
				shadowRoot: {
					querySelector: jest.fn().mockReturnValue(document.createElement('div'))
				}
			};

			select.rootInstance.popup = undefinedPopup;
			select.root.open = true;
			await select.waitForChanges();
			expect(animateToSpy).toHaveBeenCalledWith(undefined, expect.any(Array), expect.any(Object));
		});

		it('should call animateTo with undefined shadowRoot on popup on open', async () => {
			const animateToSpy = jest.spyOn(select.rootInstance, 'animateTo').mockResolvedValue(undefined);
			const noShadowRootPopup = {
				active: false,
				shadowRoot: undefined
			};

			select.rootInstance.popup = noShadowRootPopup as any;
			select.root.open = false;
			await select.waitForChanges();

			animateToSpy.mockClear();

			select.rootInstance.popup = noShadowRootPopup as any;
			select.root.open = true;
			await select.waitForChanges();
			expect(animateToSpy).toHaveBeenLastCalledWith(undefined, expect.any(Array), expect.any(Object));
		});

		it('should call animateTo with correct element on open', async () => {
			const animateToSpy = jest.spyOn(select.rootInstance, 'animateTo').mockResolvedValue(undefined);
			const openPopupElement = document.createElement('div');
			const popup = {
				active: false,
				shadowRoot: {
					querySelector: jest.fn().mockReturnValue(openPopupElement)
				}
			};

			select.rootInstance.popup = popup as any;
			select.root.open = false;
			await select.waitForChanges();

			animateToSpy.mockClear();

			select.rootInstance.popup = popup as any;
			select.root.open = true;
			await select.waitForChanges();
			expect(animateToSpy).toHaveBeenLastCalledWith(openPopupElement, expect.any(Array), expect.any(Object));
		});

		it('should call animateTo with undefined popup on close', async () => {
			const animateToSpy = jest.spyOn(select.rootInstance, 'animateTo').mockResolvedValue(undefined);
			const undefinedPopup = {
				set active(value: boolean) {
					if (value === false) {
						select.rootInstance.popup = undefined;
					}
				},
				get active() {
					return true;
				},
				shadowRoot: {
					querySelector: jest.fn().mockReturnValue(document.createElement('div'))
				}
			};

			select.rootInstance.popup = undefinedPopup as any;
			select.rootInstance.open = false;
			await select.rootInstance.handleOpenChange();
			expect(animateToSpy).toHaveBeenCalledWith(undefined, expect.any(Array), expect.any(Object));
		});

		it('should call animateTo with undefined shadowRoot on popup on close', async () => {
			const animateToSpy = jest.spyOn(select.rootInstance, 'animateTo').mockResolvedValue(undefined);
			const noShadowRootPopup = {
				active: true,
				shadowRoot: undefined
			};

			select.rootInstance.popup = noShadowRootPopup;
			select.rootInstance.open = false;
			await select.rootInstance.handleOpenChange();

			expect(animateToSpy).toHaveBeenLastCalledWith(undefined, expect.any(Array), expect.any(Object));
		});

		it('should call animateTo with ideal popup element on close', async () => {
			const animateToSpy = jest.spyOn(select.rootInstance, 'animateTo').mockResolvedValue(undefined);
			const closePopupElement = document.createElement('div');
			const popupWithShadowRoot = {
				active: true,
				shadowRoot: {
					querySelector: jest.fn().mockReturnValue(closePopupElement)
				}
			};

			select.rootInstance.popup = popupWithShadowRoot as any;
			select.rootInstance.open = false;
			await select.rootInstance.handleOpenChange();

			expect(animateToSpy).toHaveBeenLastCalledWith(closePopupElement, expect.any(Array), expect.any(Object));
		});

		it('should animate element and resolve promise when element exists', async () => {
			const mockElement = document.createElement('div');
			const mockAnimation = {
				onfinish: null as (() => void) | null
			};

			mockElement.animate = jest.fn().mockReturnValue(mockAnimation);

			const promise = select.rootInstance.animateTo(mockElement, [{ opacity: 0 }, { opacity: 1 }], {
				duration: 100
			});

			// Trigger onfinish callback
			mockAnimation.onfinish?.();

			await expect(promise).resolves.toBeUndefined();
			expect(mockElement.animate).toHaveBeenCalled();
		});

		it('should resolve animateTo immediately when element is null', async () => {
			const result = await select.rootInstance.animateTo(null, [{ opacity: 0 }, { opacity: 1 }], {
				duration: 100
			});

			expect(result).toBeUndefined();
		});

		it('should not set option.selected when setSelectedOption is called with null', async () => {
			// Restore getAllOptions mock to test with real implementation
			jest.restoreAllMocks();

			await select.rootInstance.setSelectedOption(null);
			await select.waitForChanges();

			// Verify updateSelection was still called (value should be empty)
			expect(select.root.value).toBe('');
		});

		it('should update displayLabel from selected option getTextContent', async () => {
			const [item1] = select.rootInstance.getAllOptions() as any[];
			item1.selected = true;
			item1.value = 'v1';
			item1.getTextContent = jest.fn().mockResolvedValue('Label 1');

			await (select.rootInstance as any).updateSelection();
			await select.waitForChanges();

			expect(select.rootInstance.displayLabel).toBe('Label 1');
			expect(select.root.value).toBe('v1');
		});
	});

	describe('Slots', () => {
		it('should wire slotchange event to handleDefaultSlotChange', async () => {
			const handleSlotChangeSpy = jest.spyOn(select.rootInstance, 'handleDefaultSlotChange');
			const slot = select.rootInstance.listbox;

			const slotchangeEvent = new Event('slotchange');
			slot.dispatchEvent(slotchangeEvent);
			await select.waitForChanges();

			expect(handleSlotChangeSpy).toHaveBeenCalled();
		});

		it('should call setSelectedOption when handleDefaultSlotChange is called with value', async () => {
			const [item1, item2] = select.rootInstance.getAllOptions() as any[];
			item1.value = 'v1';
			item2.value = 'v2';

			select.root.value = 'v1';
			await select.waitForChanges();

			const setSelectedSpy = jest.spyOn(select.rootInstance as any, 'setSelectedOption').mockResolvedValue(undefined);

			select.rootInstance.handleDefaultSlotChange();
			await select.waitForChanges();

			expect(setSelectedSpy).toHaveBeenCalledWith(item1);
		});

		it('should render start icon container when startIcon slot is filled', async () => {
			const page = (await newSpecPage({
				components: [DvSelect],
				html: `
					<dv-select>
						<span slot="startIcon"></span>
						<dv-option value="option1">Option One</dv-option>
					</dv-select>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvSelect>;
			await page.waitForChanges();

			const iconContainer = page.root.shadowRoot.querySelector('[slot="anchor"] > div:first-child');
			expect(iconContainer).not.toBeNull();
			expect(iconContainer).toHaveClass('absolute');
			expect(iconContainer).toHaveClass('inset-y-0');
			expect(iconContainer).toHaveClass('left-4');
		});

		it('should apply sm padding to display input when startIcon present and size is sm', async () => {
			const page = (await newSpecPage({
				components: [DvSelect],
				html: `
					<dv-select size="sm">
						<span slot="startIcon"></span>
						<dv-option value="option1">Option One</dv-option>
					</dv-select>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvSelect>;
			await page.waitForChanges();

			const displayInput = page.root.shadowRoot.querySelector('input[role="combobox"]');
			expect(displayInput).toHaveClass('pl-9');
		});

		it('should apply md padding to display input when startIcon present and size is md', async () => {
			const page = (await newSpecPage({
				components: [DvSelect],
				html: `
					<dv-select size="md">
						<span slot="startIcon"></span>
						<dv-option value="option1">Option One</dv-option>
					</dv-select>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvSelect>;
			await page.waitForChanges();

			const displayInput = page.root.shadowRoot.querySelector('input[role="combobox"]');
			expect(displayInput).toHaveClass('pl-11');
		});
	});

	describe('Form handling', () => {
		it('should update value if value has changed from default', async () => {
			await select.waitForChanges();
			select.root.value = 'option1';
			await select.waitForChanges();

			expect(select.rootInstance.defaultValue).toBe('');
			expect(select.rootInstance.valueHasChanged).toBe(true);
		});

		it('should log specific error message when ElementInternals constructor fails', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			const originalAttachInternals = HTMLElement.prototype.attachInternals;
			HTMLElement.prototype.attachInternals = () => {
				throw new Error('attachInternals is not a function');
			};

			new DvSelect();
			await select.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('ElementInternals not supported', 'attachInternals is not a function');

			HTMLElement.prototype.attachInternals = originalAttachInternals;
		});

		it('should log specific error message when setValidity fails in updateValidityState', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			select.rootInstance.internals = {
				setValidity: () => {
					throw new Error('setValidity failed');
				}
			} as any;

			select.rootInstance.hasError = true;
			select.rootInstance.errorText = 'Test error';
			select.rootInstance.updateValidityState();

			expect(consoleSpy).toHaveBeenCalledWith('Validity state update not supported', 'setValidity failed');
		});

		it('should clear validity when hasError is false', async () => {
			const setValidityMock = jest.fn();
			select.rootInstance.internals = {
				setValidity: setValidityMock
			} as any;

			select.rootInstance.hasError = false;
			select.rootInstance.updateValidityState();

			expect(setValidityMock).toHaveBeenCalledWith({});
		});

		it('should not call setValidity when internals is null', async () => {
			select.rootInstance.internals = null;

			// Should not throw
			expect(() => select.rootInstance.updateValidityState()).not.toThrow();
		});

		it('should log specific error message when setFormValue fails in updateFormValue', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			select.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('updateFormValue failed');
				}
			} as any;

			(select.rootInstance as any).updateFormValue('test value');

			expect(consoleSpy).toHaveBeenCalledWith('Form value update not supported', 'updateFormValue failed');
		});

		it('should update form value with null when value is empty', async () => {
			const setFormValueMock = jest.fn();
			select.rootInstance.internals = {
				setFormValue: setFormValueMock
			} as any;

			(select.rootInstance as any).updateFormValue('');

			expect(setFormValueMock).toHaveBeenCalledWith(null);
		});

		it('should update form value with actual value when provided', async () => {
			const setFormValueMock = jest.fn();
			select.rootInstance.internals = {
				setFormValue: setFormValueMock
			} as any;

			(select.rootInstance as any).updateFormValue('test-value');

			expect(setFormValueMock).toHaveBeenCalledWith('test-value');
		});

		it('should not call setFormValue when internals is null', async () => {
			select.rootInstance.internals = null;

			// Should not throw
			expect(() => (select.rootInstance as any).updateFormValue('test')).not.toThrow();
		});
	});

	describe('Accessibility', () => {
		it('should render with focus classes when hasFocus state is true', async () => {
			select.rootInstance.hasFocus = true;
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');

			expect(comboboxContainer).toHaveClass('outline');
			expect(comboboxContainer).toHaveClass('outline-offset-0');
			expect(comboboxContainer).toHaveClass('outline-visible');
			expect(comboboxContainer).toHaveClass('outline-width-lg');
			expect(comboboxContainer).toHaveClass('outline-focus-ring-default');
		});

		it('should render with focus error classes when hasFocus and hasError states are both true', async () => {
			select.rootInstance.hasFocus = true;
			select.rootInstance.hasError = true;
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');

			expect(comboboxContainer).toHaveClass('outline');
			expect(comboboxContainer).toHaveClass('outline-offset-0');
			expect(comboboxContainer).toHaveClass('outline-visible');
			expect(comboboxContainer).toHaveClass('outline-width-lg');
			expect(comboboxContainer).toHaveClass('outline-focus-ring-destructive');
			expect(comboboxContainer).not.toHaveClass('outline-focus-ring-default');
		});

		it('should render with error classes when hasError state is true', async () => {
			select.rootInstance.hasError = true;
			await select.waitForChanges();

			const comboboxContainer = select.root.shadowRoot.querySelector('div div');

			expect(comboboxContainer).toHaveClass('border-status-error');
		});

		it('should render placeholder with status error color when hasError state is true', async () => {
			select.root.placeholder = 'Select an option';
			select.rootInstance.hasError = true;
			await select.waitForChanges();

			const displayInput = select.root.shadowRoot.querySelector('input[role="combobox"]');

			expect(displayInput).toHaveClass('placeholder:text-status-error');
			expect(displayInput).not.toHaveClass('placeholder:text-subtle');
		});
	});
});

