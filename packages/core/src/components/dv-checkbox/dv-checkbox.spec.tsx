import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvCheckbox } from './dv-checkbox';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-checkbox', () => {
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
	let page: TypedSpecPage<DvCheckbox>;
	let checkbox: HTMLInputElement;

	// Initialize a new instance for DvCheckbox
	beforeEach(async () => {
		page = (await newSpecPage({
			components: [DvCheckbox],
			html: `<dv-checkbox></dv-checkbox>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvCheckbox>;

		checkbox = page.root?.shadowRoot?.querySelector('input[type="checkbox"]');
	});

	// Teardown instance after each test case
	afterEach(() => {
		page = null;
	});

	describe('Initialization with default state', () => {
		it('should render with default unchecked state', async () => {
			// Check that the component renders
			expect(page.root).toBeTruthy();
			expect(checkbox).toBeTruthy();

			// Check default state - should be unchecked, enabled, and not indeterminate
			expect(checkbox.checked).toBe(false);
			expect(checkbox.disabled).toBe(false);
			expect(checkbox.indeterminate).toBe(false);
			expect(page.root.checked).toBe(false);
			expect(page.root.disabled).toBe(false);
			expect(page.root.indeterminate).toBe(false);
		});
	});

	describe('Props', () => {
		it('should render checkbox as checked when checked property is true', async () => {
			page.root.checked = true;
			await page.waitForChanges();

			// Check that the checkbox is checked
			expect(checkbox.checked).toBe(true);
		});

		it('should render checkbox as unchecked when checked property is false', async () => {
			page.root.checked = false;
			await page.waitForChanges();

			// Check that the checkbox is not checked
			expect(checkbox.checked).toBe(false);
		});

		it('should render checkbox as disabled when disabled property is true', async () => {
			page.root.disabled = true;
			await page.waitForChanges();

			// Check that the checkbox is disabled
			expect(checkbox.disabled).toBe(true);
		});

		it('should stay unchecked when disabled checkbox is clicked', async () => {
			const handleClickSpy = jest.fn();
			page.root.disabled = true;
			page.root.checked = false;
			page.root.addEventListener('click', handleClickSpy);
			await page.waitForChanges();

			// Simulate a click event
			checkbox.click();

			expect(page.root.checked).toBe(false);
		});

		it('should render the correct value attribute', async () => {
			const valueValue = 'checkboxValue';
			page.root.value = valueValue;
			await page.waitForChanges();

			// Check that the checkbox input has the correct value
			expect(checkbox.value).toBe(valueValue);
		});

		it('should set the checkbox to indeterminate when indeterminate property is true', async () => {
			page.root.indeterminate = true;
			await page.waitForChanges();

			// Check that the checkbox is in an indeterminate state
			expect(checkbox.indeterminate).toBe(true);
		});

		it('should not set the checkbox to indeterminate when indeterminate property is false', async () => {
			page.root.indeterminate = false;
			await page.waitForChanges();

			// Check that the checkbox is not in an indeterminate state
			expect(checkbox.indeterminate).toBe(false);
		});

		it('should clear indeterminate state when checked property is set to true', async () => {
			page.root.indeterminate = true;
			await page.waitForChanges();

			// Initially set to indeterminate
			expect(checkbox.indeterminate).toBe(true);

			// Set checked to true
			page.root.checked = true;
			await page.waitForChanges();

			// Check that the indeterminate state is cleared
			expect(checkbox.indeterminate).toBe(false);
		});

		it('should render error text regardless of checked state', async () => {
			page.root.errorText = 'This is an error';
			page.root.checked = true;
			await page.waitForChanges();

			const errorText = page.root.shadowRoot.querySelector('.text-status-error');

			// Ensure error text displayed correctly when checked
			expect(checkbox.checked).toBe(true);
			expect(page.rootInstance.hasError).toBe(true);
			expect(errorText.textContent).toBe('This is an error');

			page.root.checked = false;
			await page.waitForChanges();

			// Ensure error text displayed correctly when not checked
			expect(checkbox.checked).toBe(false);
			expect(page.rootInstance.hasError).toBe(true);
			expect(errorText.textContent).toBe('This is an error');
		});

		it('should render help text when helpText is provided and no error', async () => {
			page.root.helpText = 'This is help text';
			await page.waitForChanges();

			const helpTextElement = page.root.shadowRoot.querySelector('.text-subtle');
			expect(helpTextElement).not.toBeNull();
			const helpSpan = helpTextElement.querySelector('span');
			expect(helpSpan.textContent).toBe('This is help text');
		});

		it('should not render helpText when errorText is set', async () => {
			page.root.helpText = 'This is help text';
			page.root.errorText = 'This is an error';
			await page.waitForChanges();

			const helpTextElement = page.root.shadowRoot.querySelector('.text-subtle');
			expect(helpTextElement).toBeNull();

			const errorText = page.root.shadowRoot.querySelector('.text-status-error');
			expect(errorText).not.toBeNull();
		});

		it('should render help text with disabled styles when disabled', async () => {
			page.root.helpText = 'This is help text';
			page.root.disabled = true;
			await page.waitForChanges();

			const helpTextElement = page.root.shadowRoot.querySelector('.text-disabled');
			expect(helpTextElement).not.toBeNull();
		});
	});

	describe('Events', () => {
		it('should update checked state and dispatch custom change event', async () => {
			const dispatchEventMock = jest.spyOn(HTMLElement.prototype, 'dispatchEvent');
			// Set the checkbox to checked
			checkbox.checked = true;
			const changeEvent = new Event('change', { bubbles: true });
			checkbox.dispatchEvent(changeEvent);
			await page.waitForChanges();
			// Check that the checked state is updated
			expect(page.root.checked).toBe(true);
			// Check that the custom change event was dispatched
			expect(dispatchEventMock).toHaveBeenCalled();
			const dispatchedEvent = dispatchEventMock.mock.calls[0][0] as CustomEvent;
			expect(dispatchedEvent.type).toBe('change');
			// Restore the original implementation
			dispatchEventMock.mockRestore();
		});
	});

	describe('Methods', () => {
		it('should not continue with value update if value did not change from default', async () => {
			page.root.checked = false;
			await page.waitForChanges();

			expect(page.rootInstance.defaultValue).toBe(false);
			expect(page.rootInstance.valueHasChanged).toBe(false);
		});

		it('should continue with value update if value did change from default', async () => {
			page.root.checked = true;
			await page.waitForChanges();

			expect(page.rootInstance.defaultValue).toBe(false);
			expect(page.rootInstance.valueHasChanged).toBe(true);
		});

		it('should call early return in valueChanged when value equals default and valueHasChanged is false', async () => {
			// Mock internals to avoid any side effects
			page.rootInstance.internals = {
				setFormValue: jest.fn()
			} as any;
			const validateInputSpy = jest.spyOn(page.rootInstance, 'validateInput');
			await page.waitForChanges();

			page.rootInstance.valueHasChanged = false;
			page.rootInstance.defaultValue = false;
			page.rootInstance.watchChecked(false);

			expect(validateInputSpy).not.toHaveBeenCalled();
			expect(page.rootInstance.internals.setFormValue).not.toHaveBeenCalled();

			validateInputSpy.mockRestore();
		});
	});

	describe('Slots', () => {
		it('should render slot content correctly', async () => {
			const slotContent = 'Checkbox Label';
			const slotElementRoot = page.root.shadowRoot.querySelector('span');
			slotElementRoot.innerText = slotContent;
			await page.waitForChanges();

			// Query the span element in the shadow DOM
			const slotElement = page.root.shadowRoot.querySelector('span');

			// Check that the slot element's text content matches the slot content
			expect(slotElement.textContent).toBe(slotContent);
		});
	});

	describe('Accessibility', () => {
		it('should have focus outline classes on the input for keyboard visibility', async () => {
			const inputClass = checkbox.className;
			expect(inputClass).toContain('focus:outline');
			expect(inputClass).toContain('focus-visible:outline');
		});
	});

	describe('Form handling', () => {
		it('should log specific error message when ElementInternals constructor fails', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock attachInternals to fail
			const originalAttachInternals = HTMLElement.prototype.attachInternals;
			HTMLElement.prototype.attachInternals = () => {
				throw new Error('attachInternals is not a function');
			};

			new DvCheckbox();
			await page.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('ElementInternals not supported', 'attachInternals is not a function');

			// Restore original method
			HTMLElement.prototype.attachInternals = originalAttachInternals;
			consoleSpy.mockRestore();
		});

		it('should safely skip setFormValue in connectedCallback when internals do not implement it', async () => {
			page.rootInstance.internals = {} as any;

			expect(() => page.rootInstance.connectedCallback()).not.toThrow();
		});

		it('should safely skip setFormValue in connectedCallback when internals are null', async () => {
			page.rootInstance.internals = null;

			expect(() => page.rootInstance.connectedCallback()).not.toThrow();
		});

		it('should safely skip setFormValue in handleChange when internals do not implement it', async () => {
			page.rootInstance.internals = null;
			await page.waitForChanges();
			page.root.checked = true;
			await page.waitForChanges();

			expect(() => page.rootInstance.handleChange()).not.toThrow();
		});

		it('should log specific error message when setFormValue fails in connectedCallback', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock setFormValue to fail
			page.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('connectedCallback setFormValue failed');
				}
			} as any;

			page.rootInstance.connectedCallback();

			expect(consoleSpy).toHaveBeenCalledWith(
				'Form value update not supported',
				'connectedCallback setFormValue failed'
			);
			consoleSpy.mockRestore();
		});

		it('should update checked state in watchChecked when internals are null', async () => {
			page.rootInstance.internals = null;
			page.rootInstance.checkbox = document.createElement('input') as HTMLInputElement;

			page.rootInstance.watchChecked(true);

			expect(page.rootInstance.checkbox.checked).toBe(true);
		});

		it('should log specific error message when setFormValue fails in watchChecked', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock setFormValue to fail
			page.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('checked update failed');
				}
			} as any;

			page.root.checked = true;
			await page.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('Form value update not supported', 'checked update failed');
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setValidity fails in updateValidityState', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock setValidity to fail
			page.rootInstance.internals = {
				setValidity: () => {
					throw new Error('setValidity failed');
				}
			} as any;

			page.rootInstance.hasError = true;
			page.rootInstance.errorText = 'Test error';
			(page.rootInstance as any).updateValidityState();

			expect(consoleSpy).toHaveBeenCalledWith('Validity state update not supported', 'setValidity failed');
			consoleSpy.mockRestore();
		});

		it('should handle updateValidityState when hasError is false', async () => {
			// Mock internals with setValidity
			page.rootInstance.internals = {
				setValidity: jest.fn()
			} as any;

			// Set hasError to false to trigger the else branch in updateValidityState
			page.rootInstance.hasError = false;
			(page.rootInstance as any).updateValidityState();

			// Verify setValidity was called with empty object (no error state)
			expect(page.rootInstance.internals.setValidity).toHaveBeenCalledWith({});
		});

		it('should update checked state in handleChange when internals are null', async () => {
			page.rootInstance.internals = null;
			await page.waitForChanges();
			page.root.checked = true;
			await page.waitForChanges();

			expect(page.rootInstance.checkbox.checked).toBe(true);
		});
	});

	describe('handleKeyDown', () => {
		it('should call requestSubmit when Enter is pressed inside a form', () => {
			const form = document.createElement('form');
			const button = document.createElement('button');
			button.type = 'submit';
			form.appendChild(button);
			form.requestSubmit = jest.fn();
			page.rootInstance.internals = { form } as any;

			(page.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).toHaveBeenCalledWith(button);
		});

		it('should resolve an external submit button via form attribute', () => {
			const form = document.createElement('form');
			form.id = 'checkbox-test-form';
			form.requestSubmit = jest.fn();
			const externalButton = document.createElement('button');
			externalButton.type = 'submit';
			externalButton.setAttribute('form', 'checkbox-test-form');
			document.body.appendChild(externalButton);
			page.rootInstance.internals = { form } as any;

			(page.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).toHaveBeenCalledWith(externalButton);

			document.body.removeChild(externalButton);
		});

		it('should not call requestSubmit when disabled', () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			page.rootInstance.internals = { form } as any;
			page.rootInstance.disabled = true;

			(page.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not call requestSubmit when isComposing', () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			page.rootInstance.internals = { form } as any;

			(page.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not throw and not call requestSubmit when no owning form', () => {
			page.rootInstance.internals = { form: null } as any;
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();

			expect(() =>
				(page.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))
			).not.toThrow();
			expect(form.requestSubmit).not.toHaveBeenCalled();
		});
	});
});

