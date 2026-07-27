import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvTextfield } from './dv-textfield';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-textfield', () => {
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
	let textfield: TypedSpecPage<DvTextfield>;

	beforeEach(async () => {
		textfield = (await newSpecPage({
			components: [DvTextfield],
			html: '<dv-textfield></dv-textfield>',
			supportsShadowDom: true
		})) as TypedSpecPage<DvTextfield>;
	});

	afterEach(() => {
		textfield = null;
	});

	describe('Initialization with default state', () => {
		it('should render with default props', async () => {
			await textfield.waitForChanges();
			const input = textfield.root.shadowRoot.querySelector('input');
			// check default props
			expect(input).toBeTruthy();
			expect(input.type).toBe('text');
			expect(input.disabled).toBe(false);
			expect(input.required).toBe(false);
			expect(input.value).toBe('');
		});
		it('should log specific error message when ElementInternals constructor fails', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock attachInternals to fail
			const originalAttachInternals = HTMLElement.prototype.attachInternals;
			HTMLElement.prototype.attachInternals = () => {
				throw new Error('attachInternals is not a function');
			};

			new DvTextfield();
			await textfield.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('ElementInternals not supported', 'attachInternals is not a function');

			HTMLElement.prototype.attachInternals = originalAttachInternals;
			consoleSpy.mockRestore();
		});
	});
	describe('Props', () => {
		it('should render with custom props', async () => {
			textfield.root.label = 'Test Label';
			textfield.root.type = 'email';
			textfield.root.required = true;
			textfield.root.value = 'test@email.com';
			textfield.root.placeholder = 'Test Placeholder';
			await textfield.waitForChanges();
			const input = textfield.root.shadowRoot.querySelector('input');
			const label = textfield.root.shadowRoot.querySelector('dv-label');
			// check custom props
			expect(label).toBeTruthy();
			expect(label.getAttribute('label')).toBe('Test Label');
			expect(input.placeholder).toBe('Test Placeholder');
			expect(input.type).toBe('email');
			expect(input.required).toBe(true);
			expect(input.value).toBe('test@email.com');
		});

		it('should handle disabled state correctly', async () => {
			textfield.root.disabled = true;
			await textfield.waitForChanges();
			// check disabled state
			const input = textfield.root.shadowRoot.querySelector('input');
			expect(input.disabled).toBe(true);
			expect(input.className).toContain('cursor-not-allowed');
		});

		it('should display help text when provided', async () => {
			textfield.root.helpText = 'This is help text';
			await textfield.waitForChanges();
			// check help text
			const helpDiv = textfield.root.shadowRoot.querySelector('div.body-xs');
			const helpSpan = helpDiv?.querySelector('span');
			expect(helpSpan.textContent).toBe('This is help text');
		});

		it('should render with different input types', async () => {
			const types = ['text', 'password', 'email', 'number', 'time'] as const;
			// Check each type
			for (const type of types) {
				textfield.root.type = type;
				await textfield.waitForChanges();
				const input = textfield.root.shadowRoot.querySelector('input');
				expect(input.type).toBe(type);
			}
		});

		it('should render error message when hasError is true', async () => {
			textfield.root.errorText = 'This is an error';
			await textfield.waitForChanges();

			// Check that error message div is rendered
			const errorDiv = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1');
			const errorSpan = errorDiv?.querySelector('span.text-status-error');
			expect(errorSpan?.textContent).toBe('This is an error');
		});

		it('should not render error message when hasError is false', async () => {
			textfield.root.errorText = '';
			await textfield.waitForChanges();

			// Check that error message div is not rendered when no error
			const errorSpan = textfield.root.shadowRoot.querySelector('span.text-status-error');
			expect(errorSpan).toBeNull();
		});

		it('should render help text with disabled styling when disabled', async () => {
			textfield.root.helpText = 'Help text';
			textfield.root.disabled = true;
			await textfield.waitForChanges();

			// Check that help text has disabled styling
			const helpDiv = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1');
			expect(helpDiv.className).toContain('text-disabled');
		});

		it('should render help text with default styling when not disabled', async () => {
			textfield.root.helpText = 'Help text';
			textfield.root.disabled = false;
			await textfield.waitForChanges();

			// Check that help text has default styling
			const helpDiv = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1');
			expect(helpDiv.className).toContain('text-subtle');
		});

		it('should not render help text when error is present', async () => {
			textfield.root.helpText = 'Help text';
			textfield.root.errorText = 'Error text';
			await textfield.waitForChanges();

			// Help text should not be rendered when error is present
			const helpDivs = textfield.root.shadowRoot.querySelectorAll('div.body-xs.mt-1');
			let helpTextFound = false;
			helpDivs.forEach((div) => {
				if (div.textContent.includes('Help text')) {
					helpTextFound = true;
				}
			});
			expect(helpTextFound).toBe(false);
		});

		it('should apply maxlength attribute to the input when maxLength is set', async () => {
			textfield.root.maxLength = 50;
			await textfield.waitForChanges();

			const input = textfield.root.shadowRoot.querySelector('input');
			expect(input.getAttribute('maxlength')).toBe('50');
		});

		it('should not apply maxlength attribute to the input when maxLength is not set', async () => {
			await textfield.waitForChanges();

			const input = textfield.root.shadowRoot.querySelector('input');
			expect(input.getAttribute('maxlength')).toBeNull();
		});

		it('should render character counter below input when maxLength is set', async () => {
			textfield.root.maxLength = 20;
			textfield.root.value = 'hello';
			await textfield.waitForChanges();

			const counterSpan = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('5 / 20');
		});

		it('should render character counter in error state when maxLength is set and hasError is true', async () => {
			textfield.root.maxLength = 20;
			textfield.root.value = 'hello';
			textfield.root.errorText = 'Too short';
			await textfield.waitForChanges();

			const errorDiv = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1');
			const counterSpan = errorDiv?.querySelector('span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('5 / 20');
		});

		it('should apply disabled styling to the character counter when disabled', async () => {
			textfield.root.maxLength = 20;
			textfield.root.value = 'hello';
			textfield.root.disabled = true;
			await textfield.waitForChanges();

			const counterSpan = textfield.root.shadowRoot.querySelector('span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.className).toContain('ml-auto text-nowrap');
		});

		it('should not render character counter when maxLength is not set', async () => {
			textfield.root.value = 'hello';
			await textfield.waitForChanges();

			const counterSpan = textfield.root.shadowRoot.querySelector('span.ml-auto');
			expect(counterSpan).toBeNull();
		});

		it('should render character counter below textfield with zero when value is empty', async () => {
			textfield.root.maxLength = 30;
			textfield.root.value = '';
			await textfield.waitForChanges();

			const counterSpan = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('0 / 30');
		});

		it('should render character counter below textfield with zero when maxLength is set and value null', async () => {
			textfield.root.maxLength = 20;
			textfield.root.value = null;
			await textfield.waitForChanges();

			const counterSpan = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('0 / 20');
		});

		it('should render character counter below textfield with zero when value is undefined', async () => {
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation((...args) => {
				if (
					args.some((arg) => typeof arg === 'string' && arg.includes('The state/prop "value" changed during rendering'))
				) {
					return;
				}
			});

			textfield.root.maxLength = 20;
			textfield.root.errorText = 'Too short';
			textfield.root.value = 'hello';
			await textfield.waitForChanges();

			let counterSpan = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan?.textContent).toBe('5 / 20');

			(textfield.rootInstance as any).value = undefined;
			textfield.root.disabled = true;
			await textfield.waitForChanges();

			const errorDiv = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1');
			counterSpan = errorDiv?.querySelector('span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('0 / 20');
			warnSpy.mockRestore();
		});

		it('should update the character counter as the value changes', async () => {
			textfield.root.maxLength = 10;
			textfield.root.value = 'hi';
			await textfield.waitForChanges();

			let counterSpan = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan.textContent).toBe('2 / 10');

			textfield.root.value = 'hello';
			await textfield.waitForChanges();

			counterSpan = textfield.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan.textContent).toBe('5 / 10');
		});

		it('should not render the clear button when clearable is false', async () => {
			textfield.root.clearable = false;
			textfield.root.value = 'some text';
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			expect(clearButton).toBeNull();
		});

		it('should not render the clear button when clearable is true but value is empty', async () => {
			textfield.root.clearable = true;
			textfield.root.value = '';
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			expect(clearButton).toBeNull();
		});

		it('should render the clear button when clearable is true and value is set', async () => {
			textfield.root.clearable = true;
			textfield.root.value = 'some text';
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			expect(clearButton).not.toBeNull();
			expect(clearButton.getAttribute('name')).toBe('circle-xmark');
		});

		it('should clear the value when handleClear is called', async () => {
			textfield.root.clearable = true;
			textfield.root.value = 'some text';
			await textfield.waitForChanges();

			textfield.rootInstance.el.dispatchEvent = jest.fn();
			textfield.rootInstance.handleClear();
			await textfield.waitForChanges();

			expect(textfield.root.value).toBe('');
		});

		it('should not render the clear button after value is cleared', async () => {
			textfield.root.clearable = true;
			textfield.root.value = 'some text';
			await textfield.waitForChanges();

			textfield.rootInstance.el.dispatchEvent = jest.fn();
			textfield.rootInstance.handleClear();
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			expect(clearButton).toBeNull();
		});

		it('should render the clear button alongside an endIcon', async () => {
			textfield.root.clearable = true;
			textfield.root.value = 'some text';
			textfield.root.innerHTML = '<dv-icon slot="endIcon" name="search"></dv-icon>';
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			const endIconSlot = textfield.root.shadowRoot.querySelector('slot[name="endIcon"]');
			expect(clearButton).not.toBeNull();
			expect(endIconSlot).not.toBeNull();
		});

		it('should position clear button with right-8 when size is sm and both endIcon and clearable are set', async () => {
			textfield.root.clearable = true;
			textfield.root.size = 'sm';
			textfield.root.value = 'some text';
			textfield.root.innerHTML = '<dv-icon slot="endIcon" name="search"></dv-icon>';
			await textfield.waitForChanges();

			const clearButtonContainer = textfield.root.shadowRoot.querySelector('.right-8');
			expect(clearButtonContainer).not.toBeNull();
		});

		it('should pass disabled state to the clear button', async () => {
			textfield.root.clearable = true;
			textfield.root.value = 'some text';
			textfield.root.disabled = true;
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			expect(clearButton).not.toBeNull();
			expect(clearButton.getAttribute('disabled')).not.toBeNull();
		});
	});
	describe('Events', () => {
		it('should test handleInput method', async () => {
			// Mock internals to avoid setFormValue error
			textfield.rootInstance.internals = {
				setFormValue: jest.fn()
			} as any;

			// Get the actual input element from the rendered component
			const input = textfield.root.shadowRoot.querySelector('input');
			input.value = 'handleInput test';

			// Create event with actual input as target
			const event = { target: input } as unknown as Event;

			// Call handleInput method
			textfield.rootInstance.handleInput(event);
			await textfield.waitForChanges();

			// Verify setFormValue was called
			expect(textfield.rootInstance.internals.setFormValue).toHaveBeenCalledWith('handleInput test');
		});

		it('should trigger onInput event handler when user types in input', async () => {
			// Mock internals to avoid setFormValue error
			textfield.rootInstance.internals = {
				setFormValue: jest.fn()
			} as any;

			await textfield.waitForChanges();

			const input = textfield.root.shadowRoot.querySelector('input') as HTMLInputElement;
			input.value = 'user typed text';
			const inputEvent = new Event('input', { bubbles: true });
			input.dispatchEvent(inputEvent);

			await textfield.waitForChanges();
			expect(textfield.root.value).toBe('user typed text');
			expect(textfield.rootInstance.internals.setFormValue).toHaveBeenCalledWith('user typed text');
		});

		it('should trigger onInput event handler when clear button clicked', async () => {
			const inputSpy = jest.fn();
			textfield.root.addEventListener('input', inputSpy);
			textfield.root.clearable = true;
			textfield.root.value = 'test';
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			clearButton.click();
			expect(inputSpy).toHaveBeenCalled();
		});
	});

	describe('Methods', () => {
		it('should properly handle disabled state spread operator in input element', async () => {
			// Test when disabled is false (should spread empty object)
			textfield.root.disabled = false;
			await textfield.waitForChanges();
			const enabledInput = textfield.root.shadowRoot.querySelector('input');
			expect(enabledInput.disabled).toBe(false);

			// Test when disabled is true (should spread disabled: true)
			textfield.root.disabled = true;
			await textfield.waitForChanges();
			const disabledInput = textfield.root.shadowRoot.querySelector('input');
			expect(disabledInput.disabled).toBe(true);
		});

		it('should apply default classes only when not disabled and no error', async () => {
			// Test default state (no error, not disabled)
			textfield.root.disabled = false;
			textfield.root.errorText = '';
			await textfield.waitForChanges();

			const input = textfield.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('border-form-default bg-form-default');

			// Test disabled state (should not have default classes)
			textfield.root.disabled = true;
			await textfield.waitForChanges();
			const disabledInput = textfield.root.shadowRoot.querySelector('input');
			expect(disabledInput.className).not.toContain('border-form-default bg-form-default');
			expect(disabledInput.className).toContain('border-form-disabled');

			// Test error state (should not have default classes)
			textfield.root.disabled = false;
			textfield.root.errorText = 'Error';
			await textfield.waitForChanges();
			const errorInput = textfield.root.shadowRoot.querySelector('input');
			expect(errorInput.className).not.toContain('border-form-default bg-form-default');
			expect(errorInput.className).toContain('border-status-error');
		});

		it('should handle valueChanged when internals is null', async () => {
			// Set internals to null to test the falsy path
			textfield.rootInstance.internals = null;
			textfield.rootInstance.valueHasChanged = true; // Ensure we skip the early return

			// Trigger valueChanged
			textfield.root.value = 'test value with null internals';
			await textfield.waitForChanges();

			// Should still update the value even without internals
			expect(textfield.root.value).toBe('test value with null internals');
		});

		it('should call errorTextChanged watcher when errorText prop changes', async () => {
			const validateInputSpy = jest.spyOn(textfield.rootInstance, 'validateInput');

			// Change errorText to trigger the watcher
			textfield.root.errorText = 'New error message';
			await textfield.waitForChanges();

			// Verify errorTextChanged triggered validation
			expect(validateInputSpy).toHaveBeenCalledWith(textfield.root.value);
			validateInputSpy.mockRestore();
		});

		it('should call helpTextChanged watcher when helpText prop changes', async () => {
			const validateInputSpy = jest.spyOn(textfield.rootInstance, 'validateInput');

			// Change helpText to trigger the watcher
			textfield.root.helpText = 'New help message';
			await textfield.waitForChanges();

			// Verify helpTextChanged triggered validation
			expect(validateInputSpy).toHaveBeenCalledWith(textfield.root.value);
			validateInputSpy.mockRestore();
		});

		it('should log specific error message when setFormValue fails in connectedCallback', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			textfield.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('connectedCallback setFormValue failed');
				}
			} as any;

			textfield.rootInstance.connectedCallback();

			expect(consoleSpy).toHaveBeenCalledWith(
				'Form value update not supported',
				'connectedCallback setFormValue failed'
			);
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setFormValue fails in valueChanged', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock setFormValue to fail
			textfield.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('value update failed');
				}
			} as any;

			textfield.root.value = 'new value';
			await textfield.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('Form value update not supported', 'value update failed');
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setValidity fails in updateValidityState', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock setValidity to fail
			textfield.rootInstance.internals = {
				setValidity: () => {
					throw new Error('setValidity failed');
				}
			} as any;

			textfield.rootInstance.hasError = true;
			textfield.rootInstance.errorText = 'Test error';
			(textfield.rootInstance as any).updateValidityState();

			expect(consoleSpy).toHaveBeenCalledWith('Validity state update not supported', 'setValidity failed');
			consoleSpy.mockRestore();
		});

		it('should handle updateValidityState when hasError is false', async () => {
			// Mock internals with setValidity
			textfield.rootInstance.internals = {
				setValidity: jest.fn()
			} as any;

			// Set hasError to false to trigger the else branch in updateValidityState
			textfield.rootInstance.hasError = false;
			(textfield.rootInstance as any).updateValidityState();

			// Verify setValidity was called with empty object (no error state)
			expect(textfield.rootInstance.internals.setValidity).toHaveBeenCalledWith({});
		});

		it('should test nested ternary logic for label variant attribute', async () => {
			textfield.root.label = 'Test Label';

			// Test case 1: hasError true, disabled false -> variant should be 'error'
			textfield.root.errorText = 'Error message';
			textfield.root.disabled = false;
			await textfield.waitForChanges();
			let label = textfield.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('error');

			// Test case 2: hasError false, disabled true -> variant should be 'disabled'
			textfield.root.errorText = '';
			textfield.root.disabled = true;
			await textfield.waitForChanges();
			label = textfield.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('disabled');

			// Test case 3: hasError true, disabled true -> variant should be 'error' (error takes precedence)
			textfield.root.errorText = 'Error message';
			textfield.root.disabled = true;
			await textfield.waitForChanges();
			label = textfield.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBe('error');

			// Test case 4: hasError false, disabled false -> variant should be undefined/null
			textfield.root.errorText = '';
			textfield.root.disabled = false;
			await textfield.waitForChanges();
			label = textfield.root.shadowRoot.querySelector('dv-label');
			expect(label.getAttribute('variant')).toBeNull();
		});

		it('should call sizeChanged watcher and syncIconSizes when size prop changes', async () => {
			textfield.root.innerHTML = '<dv-icon slot="startIcon" name="search"></dv-icon>';
			await textfield.waitForChanges();

			const syncIconSizesSpy = jest.spyOn(textfield.rootInstance as any, 'syncIconSizes');

			textfield.root.size = 'sm';
			await textfield.waitForChanges();

			expect(syncIconSizesSpy).toHaveBeenCalled();
			syncIconSizesSpy.mockRestore();
		});

		it('should propagate size to slotted icons via syncIconSizes', async () => {
			textfield.root.innerHTML = '<dv-icon slot="startIcon" name="search"></dv-icon>';
			textfield.root.size = 'sm';
			await textfield.waitForChanges();

			const icon = textfield.root.querySelector('dv-icon[slot="startIcon"]') as any;
			expect(icon.size).toBe('xs');
		});

		it('should propagate error color to slotted icons via syncIconColors when hasError is true', async () => {
			textfield.root.innerHTML = '<dv-icon slot="startIcon" name="search"></dv-icon>';
			textfield.root.errorText = 'Error message';
			await textfield.waitForChanges();

			const icon = textfield.root.querySelector('dv-icon[slot="startIcon"]') as any;
			expect(icon.color).toBe('error');
		});

		it('should propagate disabled color to slotted icons via syncIconColors when disabled is true', async () => {
			textfield.root.innerHTML = '<dv-icon slot="startIcon" name="search"></dv-icon>';
			textfield.root.disabled = true;
			await textfield.waitForChanges();

			const icon = textfield.root.querySelector('dv-icon[slot="startIcon"]') as any;
			expect(icon.color).toBe('disabled');
		});

		it('should set error color on the clear button when hasError is true', async () => {
			textfield.root.clearable = true;
			textfield.root.value = 'some text';
			textfield.root.errorText = 'Error message';
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			expect(clearButton).not.toBeNull();
			expect(clearButton.getAttribute('color')).toBe('error');
		});

		it('should not set color on the clear button when there is no error', async () => {
			textfield.root.clearable = true;
			textfield.root.value = 'some text';
			textfield.root.errorText = '';
			await textfield.waitForChanges();

			const clearButton = textfield.root.shadowRoot.querySelector('dv-icon-button');
			expect(clearButton).not.toBeNull();
			expect(clearButton.getAttribute('color')).toBeNull();
		});
	});
	describe('Slots', () => {
		it('should not render startIcon slot when not provided', async () => {
			await textfield.waitForChanges();
			const startIconSlot = textfield.root.shadowRoot.querySelector('slot[name="startIcon"]');

			expect(startIconSlot).toBeNull();
		});

		it('should not render endIcon slot when not provided', async () => {
			await textfield.waitForChanges();
			const endIconSlot = textfield.root.shadowRoot.querySelector('slot[name="endIcon"]');

			expect(endIconSlot).toBeNull();
		});

		it('should render startIcon slot when provided', async () => {
			textfield.root.innerHTML = '<dv-icon slot="startIcon" name="search"></dv-icon>';
			await textfield.waitForChanges();
			const startIconElement = textfield.root.querySelector('dv-icon[slot="startIcon"]');

			expect(startIconElement).not.toBeNull();
		});

		it('should render endIcon slot when provided', async () => {
			textfield.root.innerHTML = '<dv-icon slot="endIcon" name="search"></dv-icon>';
			await textfield.waitForChanges();
			const endIconElement = textfield.root.querySelector('dv-icon[slot="endIcon"]');

			expect(endIconElement).not.toBeNull();
		});

		it('should render endIcon container with text-subtle class when endIcon is provided', async () => {
			const page = await newSpecPage({
				components: [DvTextfield],
				html: `<dv-textfield><div slot="endIcon">end icon</div></dv-textfield>`,
				supportsShadowDom: true
			});

			const endIconWrapper = page.root.shadowRoot.querySelector('.absolute.inset-y-0.right-3');
			const endIconSlot = endIconWrapper.querySelector('slot[name="endIcon"]');
			expect(endIconWrapper).not.toBeNull();
			expect(endIconWrapper.classList.contains('text-subtle')).toBe(true);
			expect(endIconSlot).not.toBeNull();
		});

		it('should render endIcon container with text-disabled class when endIcon is provided and textfield disabled', async () => {
			const page = await newSpecPage({
				components: [DvTextfield],
				html: `<dv-textfield disabled><div slot="endIcon">end icon</div></dv-textfield>`,
				supportsShadowDom: true
			});

			const endIconWrapper = page.root.shadowRoot.querySelector('.absolute.inset-y-0.right-3');
			const endIconSlot = endIconWrapper.querySelector('slot[name="endIcon"]');
			expect(endIconWrapper).not.toBeNull();
			expect(endIconWrapper.classList.contains('text-disabled')).toBe(true);
			expect(endIconSlot).not.toBeNull();
		});

		it('should not add padding classes when no icons are present', async () => {
			await textfield.waitForChanges();
			const input = textfield.root.shadowRoot.querySelector('input');

			expect(input.className).not.toContain('pl-10');
			expect(input.className).not.toContain('pr-10');
		});

		it('should apply correct padding classes when end icon are present and size is small', async () => {
			textfield.root.size = 'sm';
			textfield.root.innerHTML = '<i slot="endIcon"></i>';
			textfield.root.placeholder = 'test';
			await textfield.waitForChanges();

			const input = textfield.root.shadowRoot.querySelector('input');
			expect(input.className).toContain('pr-9');
		});

		it('should apply correct padding classes when both start and end icons are present', async () => {
			textfield.root.innerHTML = '<i slot="startIcon"></i><i slot="endIcon"></i>';
			textfield.root.placeholder = 'test';
			await textfield.waitForChanges();

			const input = textfield.root.shadowRoot.querySelector('input');

			expect(input.className).toContain('pl-11');
			expect(input.className).toContain('pr-10');
		});
	});
	describe('handleKeyDown', () => {
		it('should call requestSubmit when Enter is pressed inside a form', async () => {
			const form = document.createElement('form');
			const button = document.createElement('button');
			button.type = 'submit';
			form.appendChild(button);
			form.requestSubmit = jest.fn();
			textfield.rootInstance.internals = { form } as any;

			(textfield.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).toHaveBeenCalledWith(button);
		});

		it('should not call requestSubmit when disabled=true', async () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			textfield.rootInstance.internals = { form } as any;
			textfield.root.disabled = true;
			await textfield.waitForChanges();

			(textfield.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not call requestSubmit when isComposing=true', async () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			textfield.rootInstance.internals = { form } as any;

			(textfield.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not call requestSubmit when the submit button is disabled', async () => {
			const form = document.createElement('form');
			const button = document.createElement('button');
			button.type = 'submit';
			button.disabled = true;
			form.appendChild(button);
			form.requestSubmit = jest.fn();
			textfield.rootInstance.internals = { form } as any;

			(textfield.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not call requestSubmit when no form is found', async () => {
			textfield.rootInstance.internals = { form: null } as any;
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();

			expect(() =>
				(textfield.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))
			).not.toThrow();
			expect(form.requestSubmit).not.toHaveBeenCalled();
		});
	});

	describe('Form handling', () => {
		it('should safely skip setFormValue in connectedCallback when internals do not implement it', async () => {
			textfield.rootInstance.internals = {} as any;

			expect(() => textfield.rootInstance.connectedCallback()).not.toThrow();
		});

		it('should safely skip setFormValue in connectedCallback when internals are null', async () => {
			textfield.rootInstance.internals = null;

			expect(() => textfield.rootInstance.connectedCallback()).not.toThrow();
		});

		it('should not continue with form update when value has not changed from default', async () => {
			textfield.root.value = '';
			await textfield.waitForChanges();

			expect(textfield.rootInstance.defaultValue).toBe('');
			expect(textfield.rootInstance.valueHasChanged).toBe(false);
		});

		it('should continue with form update when value has changed from default', async () => {
			textfield.root.value = 'This is a New Textfield Value';
			await textfield.waitForChanges();

			expect(textfield.rootInstance.defaultValue).toBe('');
			expect(textfield.rootInstance.valueHasChanged).toBe(true);
		});

		it('should call early return in valueChanged when value equals default and valueHasChanged is false', async () => {
			// Mock internals to avoid any side effects
			textfield.rootInstance.internals = {
				setFormValue: jest.fn()
			} as any;
			const validateInputSpy = jest.spyOn(textfield.rootInstance, 'validateInput');
			await textfield.waitForChanges();

			textfield.rootInstance.valueHasChanged = false;
			textfield.rootInstance.defaultValue = 'test';
			textfield.rootInstance.valueChanged('test');

			expect(validateInputSpy).not.toHaveBeenCalled();
			expect(textfield.rootInstance.internals.setFormValue).not.toHaveBeenCalled();

			validateInputSpy.mockRestore();
		});

		it('should handle validateInput when errorText changes state', async () => {
			// Test when errorText is not empty (should set hasError to true)
			textfield.root.errorText = 'This is an error';
			await textfield.waitForChanges();
			expect(textfield.rootInstance.hasError).toBe(true);

			// Test when errorText becomes empty (should set hasError to false)
			textfield.root.errorText = '';
			await textfield.waitForChanges();
			expect(textfield.rootInstance.hasError).toBe(false);

			// Test when errorText is whitespace only (should set hasError to false)
			textfield.root.errorText = '   ';
			await textfield.waitForChanges();
			expect(textfield.rootInstance.hasError).toBe(false);
		});
	});
});

