import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvTextarea } from './dv-textarea';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-textarea', () => {
	let textarea: TypedSpecPage<DvTextarea>;
	const originalConsoleError = console.error;

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

	afterAll(() => {
		console.error = originalConsoleError;
	});

	beforeEach(async () => {
		textarea = (await newSpecPage({
			components: [DvTextarea],
			html: `<dv-textarea></dv-textarea>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvTextarea>;
	});

	afterEach(() => {
		textarea = null;
	});

	describe('Initialization with default state', () => {
		it('should render with default properties', async () => {
			await textarea.waitForChanges();
			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');

			expect(textareaElement.getAttribute('placeholder')).toBe('');
			expect(textareaElement.getAttribute('value')).toBe('');
			expect(textareaElement.hasAttribute('disabled')).toBe(false);
			expect(textareaElement.classList.contains('body-default')).toBe(true);
		});

		it('should render textarea with native rows default', async () => {
			await textarea.waitForChanges();
			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');

			expect(textareaElement.getAttribute('rows')).toBe('3');
		});

		it('should render textarea with custom rows', async () => {
			textarea.root.rows = 5;
			await textarea.waitForChanges();
			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');

			expect(textareaElement.getAttribute('rows')).toBe('5');
		});

		it('should not apply JS-driven inline resize styles', async () => {
			await textarea.waitForChanges();
			const textareaElement = textarea.root.shadowRoot.querySelector('textarea') as HTMLTextAreaElement;

			expect(textareaElement.style.height).toBe('');
			expect(textareaElement.style.overflowY).toBe('');
		});
	});

	describe('Props', () => {
		it('should render with a placeholder with placeholder styles applied', async () => {
			textarea.root.placeholder = 'Test Placeholder';
			await textarea.waitForChanges();

			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');
			expect(textareaElement.getAttribute('placeholder')).toBe('Test Placeholder');
			expect(textareaElement).toHaveClass('placeholder:text-subtle');
		});

		it('should display help text with default styles applied when provided', async () => {
			textarea.root.helpText = 'help text';
			await textarea.waitForChanges();

			const helpTextElement = textarea.root.shadowRoot.querySelector('div div.text-subtle');
			expect(helpTextElement).not.toBeNull();
			const helpSpan = helpTextElement.querySelector('span');
			expect(helpSpan.textContent).toBe(textarea.root.helpText);
			expect(helpTextElement).toHaveClasses(['body-xs', 'text-subtle']);
		});

		it('should display disabled help text with disabled styles applied when provided', async () => {
			textarea.root.disabled = true;
			textarea.root.helpText = 'help text';
			await textarea.waitForChanges();

			const helpTextElement = textarea.root.shadowRoot.querySelector('div div.text-disabled');
			expect(helpTextElement).not.toBeNull();
			const helpSpan = helpTextElement.querySelector('span');
			expect(helpSpan.textContent).toBe(textarea.root.helpText);
			expect(helpTextElement).toHaveClasses(['body-xs', 'text-disabled']);
		});

		it('should disable the textarea with disabled styles applied when disabled is true', async () => {
			textarea.root.disabled = true;
			await textarea.waitForChanges();

			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');
			expect(textareaElement).toHaveAttribute('disabled');
			expect(textareaElement).toHaveClasses([
				'border-form-disabled',
				'text-disabled',
				'bg-form-disabled',
				'cursor-not-allowed'
			]);
		});

		it('should render label with default variant when not disabled and no error', async () => {
			textarea.root.label = 'Test Label';
			await textarea.waitForChanges();

			const labelElement = textarea.root.shadowRoot.querySelector('dv-label');
			expect(labelElement).not.toBeNull();
			expect(labelElement.getAttribute('label')).toBe('Test Label');
			expect(labelElement.getAttribute('variant')).toBeNull();
		});

		it('should render label with error variant when errorText is provided', async () => {
			textarea.root.label = 'Test Label';
			textarea.root.errorText = 'Error message';
			await textarea.waitForChanges();

			const labelElement = textarea.root.shadowRoot.querySelector('dv-label');
			expect(labelElement).not.toBeNull();
			expect(labelElement.getAttribute('variant')).toBe('error');
		});

		it('should render label with disabled variant when disabled is true', async () => {
			textarea.root.label = 'Test Label';
			textarea.root.disabled = true;
			await textarea.waitForChanges();

			const labelElement = textarea.root.shadowRoot.querySelector('dv-label');
			expect(labelElement).not.toBeNull();
			expect(labelElement.getAttribute('variant')).toBe('disabled');
		});

		it('should display error text with error styles when errorText is provided', async () => {
			textarea.root.errorText = 'This field has an error';
			await textarea.waitForChanges();

			const errorElement = textarea.root.shadowRoot.querySelector('div.body-xs span.text-status-error');
			expect(errorElement).not.toBeNull();
			expect(errorElement.textContent).toBe('This field has an error');

			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');
			expect(textareaElement).toHaveClass('border-status-error');
		});

		it('should hide help text when error text is displayed', async () => {
			textarea.root.helpText = 'Help text';
			textarea.root.errorText = 'Error text';
			await textarea.waitForChanges();

			const helpTextElement = textarea.root.shadowRoot.querySelector('div.text-subtle');
			expect(helpTextElement).toBeNull();

			const errorElement = textarea.root.shadowRoot.querySelector('.text-status-error');
			expect(errorElement).not.toBeNull();
		});

		it('should apply maxlength attribute to the textarea when maxLength is set', async () => {
			textarea.root.maxLength = 50;
			await textarea.waitForChanges();

			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');
			expect(textareaElement.getAttribute('maxlength')).toBe('50');
		});

		it('should not apply maxlength attribute to the textarea when maxLength is not set', async () => {
			await textarea.waitForChanges();

			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');
			expect(textareaElement.getAttribute('maxlength')).toBeNull();
		});

		it('should render character counter below textarea when maxLength is set', async () => {
			textarea.root.maxLength = 20;
			textarea.root.value = 'hello';
			await textarea.waitForChanges();

			const counterSpan = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('5 / 20');
		});

		it('should render character counter below textarea with zero when maxLength is set and value null', async () => {
			textarea.root.maxLength = 20;
			textarea.root.value = null;
			await textarea.waitForChanges();

			const counterSpan = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('0 / 20');
		});

		it('should render character counter in error state when maxLength is set and hasError is true', async () => {
			textarea.root.maxLength = 20;
			textarea.root.value = 'hello';
			textarea.root.errorText = 'Too short';
			await textarea.waitForChanges();

			const errorDiv = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1');
			const counterSpan = errorDiv?.querySelector('span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('5 / 20');
		});

		it('should render 0 in error counter when value is undefined', async () => {
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation((...args) => {
				if (
					args.some((arg) => typeof arg === 'string' && arg.includes('The state/prop "value" changed during rendering'))
				) {
					return;
				}
			});

			textarea.root.maxLength = 20;
			textarea.root.errorText = 'Too short';
			textarea.root.value = 'hello';
			await textarea.waitForChanges();

			let counterSpan = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan?.textContent).toBe('5 / 20');

			(textarea.rootInstance as any).value = undefined;
			textarea.root.disabled = true;
			await textarea.waitForChanges();

			const errorDiv = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1');
			counterSpan = errorDiv?.querySelector('span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('0 / 20');
			warnSpy.mockRestore();
		});

		it('should apply error styling to character counter when in error state and not disabled', async () => {
			textarea.root.maxLength = 20;
			textarea.root.value = 'hello';
			textarea.root.errorText = 'Too short';
			await textarea.waitForChanges();

			const errorDiv = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1');
			const counterSpan = errorDiv?.querySelector('span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.className).toContain('text-status-error');
		});

		it('should apply disabled styling to error counter when disabled and in error state', async () => {
			textarea.root.maxLength = 20;
			textarea.root.value = 'hello';
			textarea.root.errorText = 'Too short';
			textarea.root.disabled = true;
			await textarea.waitForChanges();

			const errorDiv = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1');
			const counterSpan = errorDiv?.querySelector('span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.className).toContain('text-disabled');
		});

		it('should apply disabled styling to the character counter when disabled', async () => {
			textarea.root.maxLength = 20;
			textarea.root.value = 'hello';
			textarea.root.disabled = true;
			await textarea.waitForChanges();

			const counterSpan = textarea.root.shadowRoot.querySelector('span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.className).toContain('ml-auto text-nowrap');
		});

		it('should not render character counter when maxLength is not set', async () => {
			textarea.root.value = 'hello';
			await textarea.waitForChanges();

			const counterSpan = textarea.root.shadowRoot.querySelector('span.ml-auto');
			expect(counterSpan).toBeNull();
		});

		it('should display 0 / maxLength in the character counter when value is empty', async () => {
			textarea.root.maxLength = 30;
			textarea.root.value = '';
			await textarea.waitForChanges();

			const counterSpan = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('0 / 30');
		});

		it('should display 0 / maxLength in character counter when value is undefined', async () => {
			const warnSpy = jest.spyOn(console, 'warn').mockImplementation((...args) => {
				if (
					args.some((arg) => typeof arg === 'string' && arg.includes('The state/prop "value" changed during rendering'))
				) {
					return;
				}
			});

			textarea.root.maxLength = 20;
			textarea.root.value = 'hello';
			await textarea.waitForChanges();

			let counterSpan = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan?.textContent).toBe('5 / 20');

			(textarea.rootInstance as any).value = undefined;
			textarea.root.helpText = 'updated';
			await textarea.waitForChanges();

			counterSpan = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan).not.toBeNull();
			expect(counterSpan.textContent).toBe('0 / 20');
			warnSpy.mockRestore();
		});

		it('should update the character counter as the value changes', async () => {
			textarea.root.maxLength = 10;
			textarea.root.value = 'hi';
			await textarea.waitForChanges();

			let counterSpan = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan.textContent).toBe('2 / 10');

			textarea.root.value = 'hello';
			await textarea.waitForChanges();

			counterSpan = textarea.root.shadowRoot.querySelector('div.body-xs.mt-1 span.ml-auto');
			expect(counterSpan.textContent).toBe('5 / 10');
		});
	});

	describe('Events', () => {
		it('should update the value of the textarea on input', async () => {
			await textarea.waitForChanges();
			expect(textarea.root.value).toBe('');

			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');
			const inputEvent = new Event('input', { bubbles: true });
			textareaElement.value = 'new value';
			textareaElement.dispatchEvent(inputEvent);
			await textarea.waitForChanges();

			expect(textarea.root.value).toBe('new value');
		});
	});

	describe('Form handling', () => {
		it('should call setFormValue via internals when available on input', async () => {
			const mockSetFormValue = jest.fn();
			textarea.rootInstance.internals = { setFormValue: mockSetFormValue } as any;

			const textareaElement = textarea.root.shadowRoot.querySelector('textarea');
			const inputEvent = new Event('input', { bubbles: true });
			textareaElement.value = 'test value';
			textareaElement.dispatchEvent(inputEvent);
			await textarea.waitForChanges();

			expect(mockSetFormValue).toHaveBeenCalledWith('test value');
		});

		it('should safely skip setFormValue in connectedCallback when internals do not implement it', async () => {
			textarea.rootInstance.internals = {} as any;

			expect(() => textarea.rootInstance.connectedCallback()).not.toThrow();
		});

		it('should safely skip setFormValue in connectedCallback when internals are null', async () => {
			textarea.rootInstance.internals = null;

			expect(() => textarea.rootInstance.connectedCallback()).not.toThrow();
		});

		it('should safely skip setFormValue in handleInput when internals do not implement it', async () => {
			textarea.rootInstance.internals = null;
			await textarea.waitForChanges();
			textarea.root.value = 'test';
			await textarea.waitForChanges();

			expect(() => textarea.rootInstance.handleInput()).not.toThrow();
		});

		it('should return early in valueChanged when value equals default and has not changed', async () => {
			expect(textarea.rootInstance.defaultValue).toBe('');
			expect(textarea.rootInstance.valueHasChanged).toBe(false);

			(textarea.rootInstance as any).valueChanged('');

			expect(textarea.rootInstance.valueHasChanged).toBe(false);
		});

		it('should not continue the form updates if the value did not change from default', async () => {
			textarea.root.value = '';
			await textarea.waitForChanges();

			expect(textarea.rootInstance.defaultValue).toBe('');
			expect(textarea.rootInstance.valueHasChanged).toBe(false);
		});

		it('should continue the form updates if the value did change from default', async () => {
			textarea.root.value = 'A New Textarea Value';
			await textarea.waitForChanges();

			expect(textarea.rootInstance.defaultValue).toBe('');
			expect(textarea.rootInstance.valueHasChanged).toBe(true);
		});

		it('should log specific error message when ElementInternals constructor fails', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			const originalAttachInternals = HTMLElement.prototype.attachInternals;
			HTMLElement.prototype.attachInternals = () => {
				throw new Error('attachInternals is not a function');
			};

			new DvTextarea();
			await textarea.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('ElementInternals not supported', 'attachInternals is not a function');

			HTMLElement.prototype.attachInternals = originalAttachInternals;
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setFormValue fails in connectedCallback', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			textarea.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('connectedCallback setFormValue failed');
				}
			} as any;

			textarea.rootInstance.connectedCallback();

			expect(consoleSpy).toHaveBeenCalledWith(
				'Form value update not supported',
				'connectedCallback setFormValue failed'
			);
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setFormValue fails in valueChanged', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			textarea.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('value update failed');
				}
			} as any;

			textarea.root.value = 'new value';
			await textarea.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('Form value update not supported', 'value update failed');
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setValidity fails in updateValidityState', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			textarea.rootInstance.internals = {
				setValidity: () => {
					throw new Error('setValidity failed');
				}
			} as any;

			textarea.rootInstance.hasError = true;
			textarea.rootInstance.errorText = 'Test error';
			(textarea.rootInstance as any).updateValidityState();

			expect(consoleSpy).toHaveBeenCalledWith('Validity state update not supported', 'setValidity failed');
			consoleSpy.mockRestore();
		});

		it('should call setValidity with empty object when no error and internals are available', async () => {
			const mockSetValidity = jest.fn();
			textarea.rootInstance.internals = { setValidity: mockSetValidity } as any;
			textarea.rootInstance.hasError = false;

			(textarea.rootInstance as any).updateValidityState();

			expect(mockSetValidity).toHaveBeenCalledWith({});
		});
	});

	describe('handleKeyDown', () => {
		it('should not call requestSubmit when plain Enter is pressed', () => {
			const form = document.createElement('form');
			const button = document.createElement('button');
			button.type = 'submit';
			form.appendChild(button);
			form.requestSubmit = jest.fn();
			textarea.rootInstance.internals = { form } as any;

			(textarea.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should call requestSubmit when Ctrl+Enter is pressed inside a form', () => {
			const form = document.createElement('form');
			const button = document.createElement('button');
			button.type = 'submit';
			form.appendChild(button);
			form.requestSubmit = jest.fn();
			textarea.rootInstance.internals = { form } as any;

			(textarea.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true }));

			expect(form.requestSubmit).toHaveBeenCalledWith(button);
		});

		it('should call requestSubmit when Cmd+Enter is pressed inside a form', () => {
			const form = document.createElement('form');
			const button = document.createElement('button');
			button.type = 'submit';
			form.appendChild(button);
			form.requestSubmit = jest.fn();
			textarea.rootInstance.internals = { form } as any;

			(textarea.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true }));

			expect(form.requestSubmit).toHaveBeenCalledWith(button);
		});

		it('should resolve an external submit button via form attribute on Ctrl+Enter', () => {
			const form = document.createElement('form');
			form.id = 'textarea-test-form';
			form.requestSubmit = jest.fn();
			const externalButton = document.createElement('button');
			externalButton.type = 'submit';
			externalButton.setAttribute('form', 'textarea-test-form');
			document.body.appendChild(externalButton);
			textarea.rootInstance.internals = { form } as any;

			(textarea.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true }));

			expect(form.requestSubmit).toHaveBeenCalledWith(externalButton);

			document.body.removeChild(externalButton);
		});

		it('should not call requestSubmit when disabled', () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			textarea.rootInstance.internals = { form } as any;
			textarea.rootInstance.disabled = true;

			(textarea.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not call requestSubmit when isComposing', () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			textarea.rootInstance.internals = { form } as any;

			(textarea.rootInstance as any).handleKeyDown(
				new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, isComposing: true })
			);

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not throw and not call requestSubmit when no owning form', () => {
			textarea.rootInstance.internals = { form: null } as any;
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();

			expect(() =>
				(textarea.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true }))
			).not.toThrow();
			expect(form.requestSubmit).not.toHaveBeenCalled();
		});
	});
});

