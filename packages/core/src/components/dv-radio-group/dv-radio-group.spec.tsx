import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvRadioGroup } from './dv-radio-group';
import { DvRadio } from '../dv-radio/dv-radio';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-radio-group', () => {
	let radioGroup: TypedSpecPage<DvRadioGroup>;
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
		radioGroup = (await newSpecPage({
			components: [DvRadioGroup, DvRadio],
			html: `
				<dv-radio-group label="radio group select:" name="tests">
					<dv-radio value="1" label="test 1"></dv-radio>
					<dv-radio value="2" label="test 2"></dv-radio>
				</dv-radio-group>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvRadioGroup>;
	});

	afterEach(() => {
		radioGroup = null;
	});

	describe('Initialization with default state', () => {
		it('should not continue with value update when value has not changed from default', async () => {
			await radioGroup.waitForChanges();

			expect(radioGroup.rootInstance.defaultValue).toBeFalsy();
			expect(radioGroup.rootInstance.valueHasChanged).toBe(false);
		});
	});

	describe('Props', () => {
		it('should display help text with default styles applied when provided', async () => {
			radioGroup.root.helpText = 'Choose one of the above options';
			await radioGroup.waitForChanges();

			const wrapper = radioGroup.root.shadowRoot.querySelector('div.body-xs');
			expect(wrapper).not.toBeNull();
			const helpTextElement = wrapper.querySelector('div.text-subtle');
			expect(helpTextElement).not.toBeNull();
			const helpSpan = helpTextElement.querySelector('span');
			expect(helpSpan.textContent).toBe(radioGroup.root.helpText);
		});

		it('should display error text with error styles when errorText is provided', async () => {
			radioGroup.root.errorText = 'Selection is required';
			await radioGroup.waitForChanges();

			const wrapper = radioGroup.root.shadowRoot.querySelector('div.body-xs');
			const errorElement = wrapper.querySelector('span.text-status-error');
			expect(errorElement).not.toBeNull();
			expect(errorElement.textContent).toBe('Selection is required');
		});

		it('should hide help text when error text is displayed', async () => {
			radioGroup.root.helpText = 'Choose one of the above options';
			radioGroup.root.errorText = 'Selection is required';
			await radioGroup.waitForChanges();

			const helpTextElement = radioGroup.root.shadowRoot.querySelector('div.text-subtle');
			expect(helpTextElement).toBeNull();

			const errorElement = radioGroup.root.shadowRoot.querySelector('.text-status-error');
			expect(errorElement).not.toBeNull();
		});

		it('removes error message when error text is cleared', async () => {
			radioGroup.root.errorText = 'Selection is required';
			await radioGroup.waitForChanges();

			radioGroup.root.errorText = '';
			await radioGroup.waitForChanges();

			const errorElement = radioGroup.root.shadowRoot.querySelector('.text-status-error');
			expect(errorElement).toBeNull();
		});

		it('renders error text regardless of value state', async () => {
			radioGroup.root.errorText = 'This is an error';
			await radioGroup.waitForChanges();

			const errorText = radioGroup.root.shadowRoot.querySelector('.text-status-error');

			// Ensure error text displayed correctly no value
			expect(radioGroup.root.value).toBeFalsy();
			expect(radioGroup.rootInstance.hasError).toBe(true);
			expect(errorText.textContent).toBe('This is an error');

			radioGroup.root.value = '1';
			await radioGroup.waitForChanges();

			// Ensure error text displayed correctly when has value
			expect(radioGroup.root.value).toBe('1');
			expect(radioGroup.rootInstance.hasError).toBe(true);
			expect(errorText.textContent).toBe('This is an error');
		});

		it('should continue with value update when value has changed from default', async () => {
			radioGroup.root.value = '2';
			await radioGroup.waitForChanges();

			expect(radioGroup.rootInstance.defaultValue).toBeFalsy();
			expect(radioGroup.rootInstance.valueHasChanged).toBe(true);
		});
	});

	describe('Methods', () => {
		it('should return without error when selecting a radio programmatically and radio disabled', async () => {
			const radios = radioGroup.root.querySelectorAll('dv-radio');
			radios[0].disabled = true;
			await radioGroup.waitForChanges();

			expect(radios[0].disabled).toBe(true);
			expect(radioGroup.root.value).toBeFalsy();

			radioGroup.rootInstance.selectRadio(radios[0]);
			await radioGroup.waitForChanges();

			expect(radioGroup.root.value).toBeFalsy();
			expect(radios[0].checked).toBe(false);
		});

		it('should return without error when selecting a radio programmatically and radio is not in group', async () => {
			await radioGroup.waitForChanges();

			expect(radioGroup.root.value).toBeFalsy();

			radioGroup.rootInstance.selectRadio(null as unknown as HTMLDvRadioElement);
			await radioGroup.waitForChanges();

			expect(radioGroup.root.value).toBeFalsy();
		});

		it('should run without error when value of radio group is set programmatically to the same value', async () => {
			const sameValuePage = (await newSpecPage({
				components: [DvRadioGroup, DvRadio],
				html: `
					<dv-radio-group label="radio group select:" name="tests" value="1">
						<dv-radio value="1" label="test 1"></dv-radio>
						<dv-radio value="2" label="test 2"></dv-radio>
					</dv-radio-group>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvRadioGroup>;

			const radios = sameValuePage.root.querySelectorAll('dv-radio');
			const sameValueRadio = radios[0] as HTMLDvRadioElement;
			const changeSpy = jest.fn();
			sameValuePage.root.addEventListener('change', changeSpy);

			(sameValuePage.rootInstance as any).selectRadio(sameValueRadio);
			await sameValuePage.waitForChanges();

			expect(sameValuePage.root.value).toBe('1');
			expect(sameValuePage.rootInstance.valueHasChanged).toBe(false);
			expect(changeSpy).not.toHaveBeenCalled();
		});
	});

	describe('Slots', () => {
		it('renders child radios correctly', async () => {
			await radioGroup.waitForChanges();
			const radios = radioGroup.root.querySelectorAll('dv-radio');

			expect(radios.length).toBe(2);
			expect(radios[0].value).toBe('1');
			expect(radios[1].value).toBe('2');
		});

		it('should call updateProps on slotchange', async () => {
			const slotElement = radioGroup.root.shadowRoot.querySelector('slot');
			const slotChangeEvent = new Event('slotchange');
			const updateRadioGroupPropsSpy = jest.spyOn(radioGroup.rootInstance, 'updateRadioGroupProps');

			// Dispatch the slotchange event on the slot element
			slotElement.dispatchEvent(slotChangeEvent);
			await radioGroup.waitForChanges();

			expect(updateRadioGroupPropsSpy).toHaveBeenCalled();
			updateRadioGroupPropsSpy.mockRestore();
		});
	});

	describe('Accessibility', () => {
		it('should allow navigation between radios with arrow keys', async () => {
			const radios = Array.from(radioGroup.root.querySelectorAll('dv-radio')) as HTMLDvRadioElement[];
			const fieldset = radioGroup.root.shadowRoot.querySelector('fieldset');

			radioGroup.root.value = '1';
			await radioGroup.waitForChanges();

			const focusSecondSpy = jest.spyOn(radios[1], 'focus');
			fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			await radioGroup.waitForChanges();

			expect(focusSecondSpy).toHaveBeenCalled();

			radioGroup.root.value = '2';
			await radioGroup.waitForChanges();

			const focusFirstSpy = jest.spyOn(radios[0], 'focus');
			fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
			await radioGroup.waitForChanges();

			expect(focusFirstSpy).toHaveBeenCalled();

			focusSecondSpy.mockRestore();
			focusFirstSpy.mockRestore();
		});

		it('should use first enabled radio when no active or checked radio exists on arrow navigation', async () => {
			const radios = Array.from(radioGroup.root.querySelectorAll('dv-radio')) as HTMLDvRadioElement[];
			const fieldset = radioGroup.root.shadowRoot.querySelector('fieldset');

			radios[0].checked = false;
			radios[1].checked = false;
			await radioGroup.waitForChanges();

			const selectSpy = jest.spyOn(radioGroup.rootInstance as any, 'selectRadio');
			const hostFocusSpy = jest.spyOn(radios[0], 'focus');
			const input0 = radios[0].shadowRoot.querySelector('input[type="radio"]') as HTMLInputElement;
			const inputFocusSpy = jest.spyOn(input0, 'focus');

			fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			await radioGroup.waitForChanges();

			expect(selectSpy).toHaveBeenCalledWith(radios[0]);
			expect(hostFocusSpy).toHaveBeenCalled();
			expect(inputFocusSpy).toHaveBeenCalled();

			selectSpy.mockRestore();
			hostFocusSpy.mockRestore();
			inputFocusSpy.mockRestore();
		});

		it('should compute next index from current checked radio for ArrowUp navigation', async () => {
			const radios = Array.from(radioGroup.root.querySelectorAll('dv-radio')) as HTMLDvRadioElement[];
			const fieldset = radioGroup.root.shadowRoot.querySelector('fieldset');

			radioGroup.root.value = '1';
			await radioGroup.waitForChanges();

			const selectSpy = jest.spyOn(radioGroup.rootInstance as any, 'selectRadio');
			const hostFocusSpy = jest.spyOn(radios[1], 'focus');
			const input1 = radios[1].shadowRoot.querySelector('input[type="radio"]') as HTMLInputElement;
			const inputFocusSpy = jest.spyOn(input1, 'focus');

			fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
			await radioGroup.waitForChanges();

			expect(selectSpy).toHaveBeenCalledWith(radios[1]);
			expect(hostFocusSpy).toHaveBeenCalled();
			expect(inputFocusSpy).toHaveBeenCalled();

			selectSpy.mockRestore();
			hostFocusSpy.mockRestore();
			inputFocusSpy.mockRestore();
		});

		it('should not throw when next radio has no focusable input during arrow navigation', async () => {
			const radios = Array.from(radioGroup.root.querySelectorAll('dv-radio')) as HTMLDvRadioElement[];
			const fieldset = radioGroup.root.shadowRoot.querySelector('fieldset');

			radioGroup.root.value = '1';
			await radioGroup.waitForChanges();

			const selectSpy = jest.spyOn(radioGroup.rootInstance as any, 'selectRadio');
			const hostFocusSpy = jest.spyOn(radios[1], 'focus');
			const missingInputSpy = jest.spyOn(radios[1].shadowRoot as ShadowRoot, 'querySelector').mockReturnValue(null);

			expect(() =>
				fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
			).not.toThrow();
			await radioGroup.waitForChanges();

			expect(selectSpy).toHaveBeenCalledWith(radios[1]);
			expect(hostFocusSpy).toHaveBeenCalled();

			selectSpy.mockRestore();
			hostFocusSpy.mockRestore();
			missingInputSpy.mockRestore();
		});

		it('should not throw when next radio shadowRoot is null during arrow navigation', () => {
			const instance = radioGroup.rootInstance as any;
			const currentRadio = {
				checked: false,
				focus: jest.fn(),
				shadowRoot: { querySelector: jest.fn() }
			} as any;
			const nextRadio = {
				checked: false,
				focus: jest.fn(),
				shadowRoot: null
			} as any;

			const getRadiosSpy = jest.spyOn(instance, 'getRadios').mockReturnValue([currentRadio, nextRadio]);
			const selectSpy = jest.spyOn(instance, 'selectRadio').mockImplementation(() => undefined);

			const event = {
				key: 'ArrowDown',
				preventDefault: jest.fn(),
				target: {
					closest: jest.fn().mockReturnValue(currentRadio)
				}
			} as any;

			expect(() => instance.handleKeyDown(event)).not.toThrow();
			expect(selectSpy).toHaveBeenCalledWith(nextRadio);
			expect(nextRadio.focus).toHaveBeenCalled();

			getRadiosSpy.mockRestore();
			selectSpy.mockRestore();
		});

		it('should select first enabled radio when none is checked and keep current checked radio when present', async () => {
			const radios = Array.from(radioGroup.root.querySelectorAll('dv-radio')) as HTMLDvRadioElement[];
			const fieldset = radioGroup.root.shadowRoot.querySelector('fieldset');

			// currentIndex < 0 path: no radio checked, should use targetIndex = 0
			radios[0].checked = false;
			radios[1].checked = false;
			await radioGroup.waitForChanges();

			fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
			await radioGroup.waitForChanges();

			expect(radioGroup.root.value).toBe('1');
			expect(radios[0].checked).toBe(true);

			// currentIndex >= 0 path: checked radio exists, should use current index
			radios[1].checked = true;
			radios[0].checked = false;
			await radioGroup.waitForChanges();

			fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
			await radioGroup.waitForChanges();

			expect(radioGroup.root.value).toBe('2');
			expect(radios[1].checked).toBe(true);
			expect(radios[0].checked).toBe(false);
		});

		it('should return without error if no radios when updating tabbable elements', async () => {
			const emptyRadioGroup = (await newSpecPage({
				components: [DvRadioGroup],
				html: `<dv-radio-group label="empty group" name="empty"></dv-radio-group>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvRadioGroup>;

			expect(() => (emptyRadioGroup.rootInstance as any).updateRadioTabStops()).not.toThrow();
		});

		it('should return early when all radios are disabled while updating tabbable elements', async () => {
			const radios = Array.from(radioGroup.root.querySelectorAll('dv-radio')) as HTMLDvRadioElement[];

			radios[0].disabled = true;
			radios[1].disabled = true;
			await radioGroup.waitForChanges();

			expect(() => (radioGroup.rootInstance as any).updateRadioTabStops()).not.toThrow();
		});

		it('should return without error if no radios when handling keydown', async () => {
			const emptyRadioGroup = (await newSpecPage({
				components: [DvRadioGroup],
				html: `<dv-radio-group label="empty group" name="empty"></dv-radio-group>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvRadioGroup>;

			const fieldset = emptyRadioGroup.root.shadowRoot.querySelector('fieldset');

			expect(() =>
				fieldset.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
			).not.toThrow();
			expect(emptyRadioGroup.root.value).toBeFalsy();
		});

		it('should skip radios without internal input when updating tabbable elements', async () => {
			const radios = Array.from(radioGroup.root.querySelectorAll('dv-radio')) as HTMLDvRadioElement[];
			radioGroup.root.value = '2';
			await radioGroup.waitForChanges();

			const firstShadowRoot = radios[0].shadowRoot as ShadowRoot;
			const missingInputSpy = jest.spyOn(firstShadowRoot, 'querySelector').mockReturnValue(null);

			expect(() => (radioGroup.rootInstance as any).updateRadioTabStops()).not.toThrow();

			const secondInput = radios[1].shadowRoot.querySelector('input[type="radio"]') as HTMLInputElement;
			expect(secondInput.tabIndex).toBe(0);

			missingInputSpy.mockRestore();
		});

		it('should handle radios with null shadowRoot when updating tabbable elements', () => {
			const instance = radioGroup.rootInstance as any;
			const firstInput = { tabIndex: -1 } as HTMLInputElement;
			const radioWithShadowRoot = {
				disabled: false,
				checked: true,
				shadowRoot: {
					querySelector: jest.fn().mockReturnValue(firstInput)
				}
			} as any;
			const radioWithoutShadowRoot = {
				disabled: false,
				checked: false,
				shadowRoot: null
			} as any;

			const getRadiosSpy = jest
				.spyOn(instance, 'getRadios')
				.mockReturnValueOnce([radioWithShadowRoot, radioWithoutShadowRoot])
				.mockReturnValueOnce([radioWithShadowRoot, radioWithoutShadowRoot]);

			expect(() => instance.updateRadioTabStops()).not.toThrow();
			expect(firstInput.tabIndex).toBe(0);

			getRadiosSpy.mockRestore();
		});
	});

	describe('Form handling', () => {
		it('should log specific error message when ElementInternals constructor fails', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			const originalAttachInternals = HTMLElement.prototype.attachInternals;
			HTMLElement.prototype.attachInternals = () => {
				throw new Error('attachInternals is not a function');
			};

			new DvRadioGroup();
			await radioGroup.waitForChanges();

			expect(consoleSpy).toHaveBeenCalledWith('ElementInternals not supported', 'attachInternals is not a function');

			HTMLElement.prototype.attachInternals = originalAttachInternals;
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setValidity fails in updateValidityState', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			radioGroup.rootInstance.internals = {
				setValidity: () => {
					throw new Error('setValidity failed');
				}
			} as any;

			radioGroup.rootInstance.hasError = true;
			radioGroup.rootInstance.errorText = 'Test error';
			(radioGroup.rootInstance as any).updateValidityState();

			expect(consoleSpy).toHaveBeenCalledWith('Validity state update not supported', 'setValidity failed');
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setFormValue fails in updateFormValue', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			radioGroup.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('updateFormValue failed');
				}
			} as any;

			radioGroup.rootInstance.value = 'test value';
			(radioGroup.rootInstance as any).updateFormValue('test value');

			expect(consoleSpy).toHaveBeenCalledWith('Form value update not supported', 'updateFormValue failed');
			consoleSpy.mockRestore();
		});

		it('should not call setValidity when internals is null', async () => {
			radioGroup.rootInstance.internals = null;

			// Should not throw
			expect(() => (radioGroup.rootInstance as any).updateValidityState()).not.toThrow();
		});

		it('should clear validity when hasError is false', async () => {
			const setValidityMock = jest.fn();
			radioGroup.rootInstance.internals = {
				setValidity: setValidityMock
			} as any;

			radioGroup.rootInstance.hasError = false;
			(radioGroup.rootInstance as any).updateValidityState();

			expect(setValidityMock).toHaveBeenCalledWith({});
		});

		it('should not call setFormValue when internals is null', async () => {
			radioGroup.rootInstance.internals = null;

			// Should not throw
			expect(() => (radioGroup.rootInstance as any).updateFormValue('test')).not.toThrow();
		});
	});

	describe('handleKeyDown Enter', () => {
		it('should call requestSubmit when Enter is pressed inside a form', () => {
			const form = document.createElement('form');
			const button = document.createElement('button');
			button.type = 'submit';
			form.appendChild(button);
			form.requestSubmit = jest.fn();
			radioGroup.rootInstance.internals = { form } as any;

			(radioGroup.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).toHaveBeenCalledWith(button);
		});

		it('should resolve an external submit button via form attribute', () => {
			const form = document.createElement('form');
			form.id = 'radio-group-test-form';
			form.requestSubmit = jest.fn();
			const externalButton = document.createElement('button');
			externalButton.type = 'submit';
			externalButton.setAttribute('form', 'radio-group-test-form');
			document.body.appendChild(externalButton);
			radioGroup.rootInstance.internals = { form } as any;

			(radioGroup.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(form.requestSubmit).toHaveBeenCalledWith(externalButton);

			document.body.removeChild(externalButton);
		});

		it('should not call requestSubmit when isComposing', () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			radioGroup.rootInstance.internals = { form } as any;

			const event = {
				key: 'Enter',
				isComposing: true,
				defaultPrevented: false,
				preventDefault: jest.fn(),
				target: { closest: jest.fn().mockReturnValue(null) }
			} as any;
			(radioGroup.rootInstance as any).handleKeyDown(event);

			expect(form.requestSubmit).not.toHaveBeenCalled();
		});

		it('should not throw and not call requestSubmit when no owning form', () => {
			radioGroup.rootInstance.internals = { form: null } as any;
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();

			expect(() =>
				(radioGroup.rootInstance as any).handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))
			).not.toThrow();
			expect(form.requestSubmit).not.toHaveBeenCalled();
		});
	});
});

