import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvToggle } from './dv-toggle';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-toggle', () => {
	let toggle: TypedSpecPage<DvToggle>;

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

	// Initialize a new instance for otoggle
	beforeEach(async () => {
		toggle = (await newSpecPage({
			components: [DvToggle],
			html: `
					<dv-toggle></dv-toggle>
				`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvToggle>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		toggle = null;
	});

	describe('Initialization with default state', () => {
		it('should render with default unchecked / off state', async () => {
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');

			expect(toggle.root.checked).toBe(false);
			expect(inputElement.checked).toBe(false);
			expect(toggle.root.disabled).toBe(false);
			expect(inputElement.disabled).toBe(false);
			expect(toggle.root.indeterminate).toBe(false);
			expect(inputElement.indeterminate).toBe(false);
		});
	});

	describe('Props', () => {
		it('renders toggle input as checked when checked property is true', async () => {
			toggle.root.checked = true;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			// Check that the input is checked
			expect(inputElement.checked).toBe(true);
		});

		it('renders toggle input as unchecked when checked property is false', async () => {
			toggle.root.checked = false;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			// Check that the input is not checked
			expect(inputElement.checked).toBe(false);
		});

		it('should render with label when label prop supplied', async () => {
			toggle.root.label = 'Test Label';
			await toggle.waitForChanges();

			const label = toggle.root.shadowRoot.querySelector('dv-label');

			expect(toggle.root.label).toBe('Test Label');
			expect(label).not.toBeNull();
		});

		it('should render without label when no label prop supplied', async () => {
			await toggle.waitForChanges();

			const label = toggle.root.shadowRoot.querySelector('dv-label');

			expect(toggle.root.label).toBeUndefined();
			expect(label).toBeNull();
		});

		it('should render label with disabled variant when disabled is true', async () => {
			toggle.root.label = 'Test Label';
			toggle.root.disabled = true;
			await toggle.waitForChanges();

			const label = toggle.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('disabled');
		});

		it('renders checkbox as disabled when disabled property is true', async () => {
			toggle.root.disabled = true;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			// Check that the input is disabled
			expect(inputElement.disabled).toBe(true);
		});

		it('does not call the click handler when the checkbox is disabled', async () => {
			const handleClickSpy = jest.fn();
			toggle.root.disabled = true;
			toggle.root.addEventListener('click', handleClickSpy);
			await toggle.waitForChanges();

			const toggleDiv = toggle.root.shadowRoot.querySelector('div div div') as HTMLDivElement;
			// Simulate a click event
			toggleDiv.click();

			// Check the click handler was not called
			expect(handleClickSpy).not.toHaveBeenCalled();
		});

		it('renders the correct value attribute', async () => {
			toggle.root.value = 'toggleValue';
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			// Check that the toggle input has the correct value
			expect(inputElement.value).toBe('toggleValue');
		});

		it('should set the toggle to indeterminate when indeterminate property is true', async () => {
			toggle.root.indeterminate = true;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			// Check that the toggle is in an indeterminate state
			expect(inputElement.indeterminate).toBe(true);
		});

		it('should not set the checkbox to indeterminate when indeterminate property is false', async () => {
			toggle.root.indeterminate = false;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			// Check that the toggle is not in an indeterminate state
			expect(inputElement.indeterminate).toBe(false);
		});

		it('should maintain indeterminate display when both checked and indeterminate are true', async () => {
			toggle.root.checked = true;
			await toggle.waitForChanges();

			toggle.root.indeterminate = true;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			// indeterminate takes priority — icon should be hidden
			const iconDiv = toggle.root.shadowRoot.querySelector('.absolute.z-top');
			expect(inputElement.indeterminate).toBe(true);
			expect(iconDiv).toBeNull();
		});

		it('should NOT clear indeterminate state when checked property is programmatically set to true', async () => {
			toggle.root.indeterminate = true;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			expect(inputElement.indeterminate).toBe(true);

			// Programmatically set checked — indeterminate should remain
			toggle.root.checked = true;
			await toggle.waitForChanges();

			expect(inputElement.indeterminate).toBe(true);
		});

		it('should clear indeterminate state when the toggle is clicked by the user', async () => {
			toggle.root.indeterminate = true;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			expect(inputElement.indeterminate).toBe(true);

			// Simulate a user click
			const toggleDiv = toggle.root.shadowRoot.querySelector('div div') as HTMLDivElement;
			toggleDiv.click();
			await toggle.waitForChanges();

			expect(inputElement.indeterminate).toBe(false);
		});

		it('should render helpText with text-disabled class when disabled', async () => {
			toggle.root.helpText = 'Help message';
			toggle.root.disabled = true;
			await toggle.waitForChanges();

			const helpDiv = toggle.root.shadowRoot.querySelector('.body-xs.text-disabled');
			expect(helpDiv).not.toBeNull();
			expect(helpDiv.textContent).toBe('Help message');
		});

		it('should render helpText with text-default class when not disabled', async () => {
			toggle.root.helpText = 'Help message';
			toggle.root.disabled = false;
			await toggle.waitForChanges();

			const helpDiv = toggle.root.shadowRoot.querySelector('.body-xs.text-subtle');
			expect(helpDiv).not.toBeNull();
			expect(helpDiv.textContent).toBe('Help message');
		});
	});

	describe('Events', () => {
		it('should update checked state and dispatch custom change event', async () => {
			await toggle.waitForChanges();

			const toggleDiv = toggle.root.shadowRoot.querySelector('div div div') as HTMLDivElement;
			const inputElement = toggle.root.shadowRoot.querySelector('input');
			const toggleChangeSpy = jest.spyOn(toggle.rootInstance.change, 'emit');

			// Verify initial state is unchecked
			expect(inputElement.checked).toBe(false);

			// Simulate a click event
			toggleDiv.click();
			await toggle.waitForChanges();

			// Check if the event was emitted
			expect(toggleChangeSpy).toHaveBeenCalled();
			expect(inputElement.checked).toBe(true);
		});

		it('should set hasFocus to true on input element focus', async () => {
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			inputElement.dispatchEvent(new FocusEvent('focus'));
			await toggle.waitForChanges();

			expect(toggle.rootInstance.hasFocus).toBe(true);
		});

		it('should set hasFocus to false on displayInput blur', async () => {
			toggle.rootInstance.hasFocus = true;
			await toggle.waitForChanges();

			const inputElement = toggle.root.shadowRoot.querySelector('input');
			inputElement.dispatchEvent(new FocusEvent('blur'));
			await toggle.waitForChanges();

			expect(toggle.rootInstance.hasFocus).toBe(false);
		});
	});

	describe('Form handling', () => {
		it('should safely skip setFormValue in connectedCallback when internals do not implement it', () => {
			toggle.rootInstance.internals = {} as any;

			expect(() => toggle.rootInstance.connectedCallback()).not.toThrow();
		});

		it('should safely skip setFormValue in connectedCallback when internals are null', () => {
			toggle.rootInstance.internals = null;

			expect(() => toggle.rootInstance.connectedCallback()).not.toThrow();
		});

		it('should update checked state in watchChecked when internals are null', () => {
			toggle.rootInstance.internals = null;
			toggle.rootInstance.input = document.createElement('input') as HTMLInputElement;

			toggle.rootInstance.watchChecked(true);

			expect(toggle.rootInstance.input.checked).toBe(true);
		});

		it('should log specific error message when ElementInternals constructor fails', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock attachInternals to fail
			const originalAttachInternals = HTMLElement.prototype.attachInternals;
			HTMLElement.prototype.attachInternals = () => {
				throw new Error('attachInternals is not a function');
			};

			new DvToggle();
			await toggle.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('ElementInternals not supported', 'attachInternals is not a function');

			// Restore original method
			HTMLElement.prototype.attachInternals = originalAttachInternals;
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setFormValue fails in connectedCallback', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock setFormValue to fail
			toggle.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('connectedCallback setFormValue failed');
				}
			} as any;

			toggle.rootInstance.connectedCallback();

			expect(consoleSpy).toHaveBeenCalledWith(
				'Form value update not supported',
				'connectedCallback setFormValue failed'
			);
			consoleSpy.mockRestore();
		});
	});

	describe('handleKeyDown', () => {
		it('should call requestSubmit when Enter is pressed inside a form', () => {
			const form = document.createElement('form');
			const button = document.createElement('button');
			button.type = 'submit';
			form.appendChild(button);
			form.requestSubmit = jest.fn();
			toggle.rootInstance.internals = { form } as any;

			(toggle.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).toHaveBeenCalledWith(button);
		});

		it('should resolve an external submit button via form attribute', () => {
			const form = document.createElement('form');
			form.id = 'toggle-test-form';
			form.requestSubmit = jest.fn();
			const externalButton = document.createElement('button');
			externalButton.type = 'submit';
			externalButton.setAttribute('form', 'toggle-test-form');
			document.body.appendChild(externalButton);
			toggle.rootInstance.internals = { form } as any;

			(toggle.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).toHaveBeenCalledWith(externalButton);

			document.body.removeChild(externalButton);
		});

		it('should not call requestSubmit when disabled', () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			toggle.rootInstance.internals = { form } as any;
			toggle.rootInstance.disabled = true;

			(toggle.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not call requestSubmit when isComposing', () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			toggle.rootInstance.internals = { form } as any;

			(toggle.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not throw and not call requestSubmit when no owning form', () => {
			toggle.rootInstance.internals = { form: null } as any;
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();

			expect(() =>
				(toggle.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))
			).not.toThrow();
			expect(form.requestSubmit).not.toHaveBeenCalled();
		});
	});
});

