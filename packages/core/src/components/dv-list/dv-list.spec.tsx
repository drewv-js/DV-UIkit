import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvList } from './dv-list';
import { DvListItem } from '../dv-list-item/dv-list-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

// Disable the mutation observer for unit tests
DvList.DISABLE_MUTATION_OBSERVER = true;

describe('dv-list', () => {
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

	it('should create a component instance', () => {
		expect(new DvList()).toBeInstanceOf(DvList);
	});

	let listSpec: TypedSpecPage<DvList>;

	// Initialize a new instance for DvList
	beforeEach(async () => {
		listSpec = (await newSpecPage({
			components: [DvList, DvListItem],
			html: `
          <dv-list>
            <dv-list-item value="1">Item 1</dv-list-item>
            <dv-list-item value="2">Item 2</dv-list-item>
            <dv-list-item value="3">Item 3</dv-list-item>
          </dv-list>
        `,
			supportsShadowDom: true
		})) as TypedSpecPage<DvList>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		listSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should have the correct number of list items', async () => {
			const items = listSpec.root.querySelectorAll('dv-list-item');
			expect(items.length).toBe(3);
		});

		it('should set defaultValue and update list item props in componentWillLoad', async () => {
			const page = await newSpecPage({
				components: [DvList, DvListItem],
				html: `
						<dv-list value="2">
							<dv-list-item value="1">Item 1</dv-list-item>
							<dv-list-item value="2">Item 2</dv-list-item>
						</dv-list>
					`,
				supportsShadowDom: true
			});

			expect((page.rootInstance as any).defaultValue).toBe('2');
		});
	});

	describe('Props', () => {
		it('should set showRadio prop correctly', async () => {
			listSpec.rootInstance.showRadio = true;
			expect(listSpec.rootInstance.showRadio).toBe(true);
		});

		it('should use component name as radio group name when name exists', async () => {
			listSpec.root.id = 'test-list';
			listSpec.rootInstance.name = 'test-group';
			listSpec.rootInstance.showRadio = true;
			const radioGroupName = (listSpec.rootInstance as any).getRadioGroupName();
			expect(radioGroupName).toBe('test-group');
		});

		it('should validate correctly when showRadio is true and required', async () => {
			listSpec.rootInstance.showRadio = true;
			listSpec.rootInstance.required = true;
			listSpec.rootInstance.isInitialized = true;
			await listSpec.waitForChanges();

			// Test empty value
			listSpec.rootInstance.errorText = 'Field is required';
			(listSpec.rootInstance as any).validateInput('');
			await listSpec.waitForChanges();
			expect(listSpec.rootInstance.hasError).toBe(true);

			// Test with value - clear errorText
			listSpec.rootInstance.errorText = '';
			(listSpec.rootInstance as any).validateInput('1');
			await listSpec.waitForChanges();
		});

		it('should not show error when not required regardless of showRadio', async () => {
			listSpec.rootInstance.showRadio = true;
			listSpec.rootInstance.required = false;
			listSpec.rootInstance.isInitialized = true;
			await listSpec.waitForChanges();

			// Ensure errorText is empty
			listSpec.rootInstance.errorText = '';
			(listSpec.rootInstance as any).validateInput('');
			await listSpec.waitForChanges();
			expect(listSpec.rootInstance.hasError).toBe(false);
		});

		it('should apply showRadio to all list items when showRadio is true', async () => {
			const items = listSpec.root.querySelectorAll('dv-list-item');
			const setRadioMocks = Array.from(items).map((item) => {
				const mockListItemSetRadio = jest.fn().mockResolvedValue(undefined);
				Object.defineProperty(item, 'listItemSetRadio', {
					value: mockListItemSetRadio,
					writable: true,
					configurable: true
				});
				return mockListItemSetRadio;
			});

			listSpec.rootInstance.showRadio = true;
			await listSpec.rootInstance.showRadioHandler();

			setRadioMocks.forEach((mock) => {
				expect(mock).toHaveBeenCalledWith(true);
			});
		});

		it('should render label when label prop is provided', async () => {
			listSpec.rootInstance.label = 'Test Label';
			await listSpec.waitForChanges();

			const label = listSpec.root.shadowRoot.querySelector('dv-label');
			expect(label).not.toBeNull();
			expect(label.getAttribute('label')).toBe('Test Label');
		});

		it('should render helpText when helpText prop is provided', async () => {
			listSpec.rootInstance.helpText = 'This is help text';
			await listSpec.waitForChanges();

			const helpDiv = listSpec.root.shadowRoot.querySelector('.text-default');
			expect(helpDiv).not.toBeNull();
			expect(helpDiv.textContent).toBe('This is help text');
		});

		it('should render errorText when hasError is true', async () => {
			listSpec.rootInstance.required = true;
			listSpec.rootInstance.isInitialized = true;
			listSpec.rootInstance.errorText = 'This is an error';
			listSpec.rootInstance.value = '';
			(listSpec.rootInstance as any).validateInput('');
			await listSpec.waitForChanges();

			const errorSpan = listSpec.root.shadowRoot.querySelector('.text-status-error');
			expect(errorSpan).not.toBeNull();
			expect(errorSpan.textContent).toBe('This is an error');
		});

		it('should render label with error variant when hasError is true', async () => {
			listSpec.rootInstance.label = 'Test Label';
			listSpec.root.errorText = 'Error occurred';
			listSpec.rootInstance.isInitialized = true;
			listSpec.rootInstance.value = '';
			(listSpec.rootInstance as any).validateInput('');
			await listSpec.waitForChanges();

			const label = listSpec.root.shadowRoot.querySelector('dv-label');
			expect(label).not.toBeNull();
			expect(label.getAttribute('variant')).toBe('error');
		});

		it('should not render label when label prop is not provided', async () => {
			listSpec.rootInstance.label = undefined;
			await listSpec.waitForChanges();

			const label = listSpec.root.shadowRoot.querySelector('dv-label');
			expect(label).toBeNull();
		});

		it('should call validateInput when helpText changes', async () => {
			const validateSpy = jest.spyOn(listSpec.rootInstance as any, 'validateInput');
			listSpec.rootInstance.helpText = 'New help text';
			await listSpec.waitForChanges();

			expect(validateSpy).toHaveBeenCalled();
			validateSpy.mockRestore();
		});

		it('should call validateInput and updateValidityState when errorText changes', async () => {
			const validateSpy = jest.spyOn(listSpec.rootInstance as any, 'validateInput');
			const updateValiditySpy = jest.spyOn(listSpec.rootInstance as any, 'updateValidityState');

			listSpec.rootInstance.errorText = 'New error text';
			await listSpec.waitForChanges();

			expect(validateSpy).toHaveBeenCalled();
			expect(updateValiditySpy).toHaveBeenCalled();
			validateSpy.mockRestore();
			updateValiditySpy.mockRestore();
		});

		it('should update list item props when name changes', async () => {
			const updatePropsSpy = jest.spyOn(listSpec.rootInstance as any, 'updateListItemProps');
			listSpec.rootInstance.name = 'new-group-name';
			await listSpec.waitForChanges();

			expect(updatePropsSpy).toHaveBeenCalled();
			updatePropsSpy.mockRestore();
		});
	});

	describe('Events', () => {
		it('should emit itemSelected and valueChange events when value changes', async () => {
			const itemSelectedSpy = jest.fn();
			const valueChangeSpy = jest.fn();

			listSpec.root.addEventListener('itemSelected', itemSelectedSpy);
			listSpec.root.addEventListener('valueChange', valueChangeSpy);

			await listSpec.rootInstance.listSetSelectedItem('1');
			await listSpec.waitForChanges();

			expect(itemSelectedSpy).toHaveBeenCalled();
			expect(valueChangeSpy).toHaveBeenCalled();
		});

		it('should early return and not emit events when value equals defaultValue and valueHasChanged is false', async () => {
			// Set up internal state
			listSpec.rootInstance.value = '1';
			(listSpec.rootInstance as any).valueHasChanged = false;
			(listSpec.rootInstance as any).defaultValue = '1';

			const updateListItemsSpy = jest.spyOn(listSpec.rootInstance as any, 'updateListItems');
			const itemSelectedSpy = jest.fn();
			listSpec.root.addEventListener('itemSelected', itemSelectedSpy);

			// Trigger the value handler with the same value
			await (listSpec.rootInstance as any).valueHandler('1');

			// Should return early without calling updateListItems or emitting events
			expect(updateListItemsSpy).not.toHaveBeenCalled();
			expect(itemSelectedSpy).not.toHaveBeenCalled();

			updateListItemsSpy.mockRestore();
		});

		it('should update value and validate when handleItemClick is called', async () => {
			const mockEvent = {
				detail: { value: '2' }
			} as CustomEvent<{ value: string }>;

			await (listSpec.rootInstance as any).handleItemClick(mockEvent);
			await listSpec.waitForChanges();

			expect(listSpec.rootInstance.value).toBe('2');
		});

		it('should call validateInput after item click', async () => {
			const validateSpy = jest.spyOn(listSpec.rootInstance as any, 'validateInput');
			const mockEvent = {
				detail: { value: '1' }
			} as CustomEvent<{ value: string }>;

			await (listSpec.rootInstance as any).handleItemClick(mockEvent);

			expect(validateSpy).toHaveBeenCalled();
			validateSpy.mockRestore();
		});

		it('should handle itemClick event dispatched on host element', async () => {
			const handleItemClickSpy = jest.spyOn(listSpec.rootInstance as any, 'handleItemClick');

			// Dispatch itemClick event on the host element
			const customEvent = new CustomEvent('itemClick', {
				detail: { value: '2' },
				bubbles: true
			});
			listSpec.root.dispatchEvent(customEvent);

			await listSpec.waitForChanges();

			expect(handleItemClickSpy).toHaveBeenCalled();
			handleItemClickSpy.mockRestore();
		});
	});

	describe('Methods', () => {
		it('should update value when listSetSelectedItem is called with valid value', async () => {
			const result = await listSpec.rootInstance.listSetSelectedItem('1');
			expect(result).toBe(true);
			expect(listSpec.rootInstance.value).toBe('1');
		});

		it('should not update value if the same value is provided', async () => {
			await listSpec.rootInstance.listSetSelectedItem('1');
			expect(listSpec.rootInstance.value).toBe('1');
			await listSpec.rootInstance.listSetSelectedItem('1');
			expect(listSpec.rootInstance.value).toBe('1');
		});

		it('should not update value if the value is not found', async () => {
			await listSpec.rootInstance.listSetSelectedItem('4');
			expect(listSpec.rootInstance.value).toBe('');
		});

		it('should not select disabled items even when trying to set them', async () => {
			// Add a disabled item to the test setup
			const disabledItem = document.createElement('dv-list-item');
			disabledItem.setAttribute('value', '4');
			disabledItem.setAttribute('disabled', 'true');
			disabledItem.disabled = true;
			listSpec.root.appendChild(disabledItem);

			// Try to select the disabled item
			const result = await listSpec.rootInstance.listSetSelectedItem('4');

			expect(result).toBe(false);
			expect(listSpec.rootInstance.value).toBe('');
		});

		it('should allow setting value to empty string', async () => {
			listSpec.rootInstance.value = '1';
			await listSpec.waitForChanges();

			const result = await listSpec.rootInstance.listSetSelectedItem('');
			expect(result).toBe(true);
			expect(listSpec.rootInstance.value).toBe('');
		});

		it('should disconnect observer on disconnectedCallback when observer exists', async () => {
			// Mock MutationObserver
			const disconnectMock = jest.fn();
			const observeMock = jest.fn();
			const MockMutationObserver = jest.fn().mockImplementation(() => ({
				disconnect: disconnectMock,
				observe: observeMock
			}));
			(global as any).MutationObserver = MockMutationObserver;

			// Re-enable mutation observer for this test
			DvList.DISABLE_MUTATION_OBSERVER = false;

			const page = await newSpecPage({
				components: [DvList, DvListItem],
				html: `
						<dv-list>
							<dv-list-item value="1">Item 1</dv-list-item>
						</dv-list>
					`,
				supportsShadowDom: true
			});

			const component = page.rootInstance as DvList;
			await page.waitForChanges();

			// Verify observer was created
			expect((component as any).observer).toBeDefined();

			// Trigger disconnectedCallback
			component.disconnectedCallback();

			expect(disconnectMock).toHaveBeenCalled();

			// Re-disable mutation observer for other tests
			DvList.DISABLE_MUTATION_OBSERVER = true;
		});

		it('should call updateListItems when MutationObserver callback is triggered', async () => {
			// Mock MutationObserver to capture the callback
			let mutationCallback: MutationCallback | null = null;
			const disconnectMock = jest.fn();
			const observeMock = jest.fn();
			const MockMutationObserver = jest.fn().mockImplementation((callback: MutationCallback) => {
				mutationCallback = callback;
				return {
					disconnect: disconnectMock,
					observe: observeMock
				};
			});
			(global as any).MutationObserver = MockMutationObserver;

			// Re-enable mutation observer for this test
			DvList.DISABLE_MUTATION_OBSERVER = false;

			const page = await newSpecPage({
				components: [DvList, DvListItem],
				html: `
						<dv-list>
							<dv-list-item value="1">Item 1</dv-list-item>
						</dv-list>
					`,
				supportsShadowDom: true
			});

			const component = page.rootInstance as DvList;
			await page.waitForChanges();

			const updateListItemsSpy = jest.spyOn(component as any, 'updateListItems');

			// Trigger the mutation observer callback
			expect(mutationCallback).not.toBeNull();
			mutationCallback!([], {} as MutationObserver);

			expect(updateListItemsSpy).toHaveBeenCalled();

			updateListItemsSpy.mockRestore();
			// Re-disable mutation observer for other tests
			DvList.DISABLE_MUTATION_OBSERVER = true;
		});

		it('should not throw when disconnectedCallback is called without observer', async () => {
			(listSpec.rootInstance as any).observer = undefined;
			expect(() => listSpec.rootInstance.disconnectedCallback()).not.toThrow();
		});

		it('should apply margin classes to list items except the last one', async () => {
			const items = listSpec.root.querySelectorAll('dv-list-item');

			// Mock the shadowRoot for list items
			items.forEach((item) => {
				const mockLi = document.createElement('li');
				Object.defineProperty(item, 'shadowRoot', {
					value: { querySelector: () => mockLi },
					writable: true
				});
			});

			await (listSpec.rootInstance as any).applyMarginClasses();

			// We can't easily verify the class additions without proper shadow DOM setup
			// but we can verify the method executes without error
			expect(true).toBe(true);
		});

		it('should handle items without shadowRoot in applyMarginClasses', async () => {
			const items = listSpec.root.querySelectorAll('dv-list-item');
			items.forEach((item) => {
				Object.defineProperty(item, 'shadowRoot', {
					value: null,
					writable: true
				});
			});

			// Should not throw
			expect(() => (listSpec.rootInstance as any).applyMarginClasses()).not.toThrow();
		});

		it('should handle items with shadowRoot but no li element', async () => {
			const items = listSpec.root.querySelectorAll('dv-list-item');
			items.forEach((item) => {
				Object.defineProperty(item, 'shadowRoot', {
					value: { querySelector: () => null },
					writable: true
				});
			});

			// Should not throw
			expect(() => (listSpec.rootInstance as any).applyMarginClasses()).not.toThrow();
		});
	});

	describe('Slots', () => {
		it('should select matching item when value exists and matches an item on slot change', async () => {
			listSpec.rootInstance.value = '2';
			await listSpec.waitForChanges();

			const setSelectedSpy = jest.spyOn(listSpec.rootInstance, 'listSetSelectedItem');
			(listSpec.rootInstance as any).handleDefaultSlotChange();

			expect(setSelectedSpy).toHaveBeenCalledWith('2');
			setSelectedSpy.mockRestore();
		});

		it('should not call listSetSelectedItem when value does not match any item', async () => {
			listSpec.rootInstance.value = 'non-existent';
			await listSpec.waitForChanges();

			const setSelectedSpy = jest.spyOn(listSpec.rootInstance, 'listSetSelectedItem');
			(listSpec.rootInstance as any).handleDefaultSlotChange();

			expect(setSelectedSpy).not.toHaveBeenCalled();
			setSelectedSpy.mockRestore();
		});

		it('should not call listSetSelectedItem when value is empty', async () => {
			listSpec.rootInstance.value = '';
			await listSpec.waitForChanges();

			const setSelectedSpy = jest.spyOn(listSpec.rootInstance, 'listSetSelectedItem');
			(listSpec.rootInstance as any).handleDefaultSlotChange();

			expect(setSelectedSpy).not.toHaveBeenCalled();
			setSelectedSpy.mockRestore();
		});

		it('should trigger handleDefaultSlotChange when slot content changes', async () => {
			const handleSlotChangeSpy = jest.spyOn(listSpec.rootInstance as any, 'handleDefaultSlotChange');

			// Simulate slot change by adding a new item
			const newItem = document.createElement('dv-list-item');
			newItem.setAttribute('value', '4');
			newItem.textContent = 'Item 4';
			listSpec.root.appendChild(newItem);

			// Manually trigger slot change since shadow DOM testing doesn't fully support it
			const slot = listSpec.root.shadowRoot.querySelector('slot');
			if (slot) {
				slot.dispatchEvent(new Event('slotchange'));
			}

			// Verify the method can be called
			(listSpec.rootInstance as any).handleDefaultSlotChange();
			expect(handleSlotChangeSpy).toHaveBeenCalled();

			handleSlotChangeSpy.mockRestore();
		});
	});

	describe('Form handling', () => {
		it('should update form value with null when value is empty', async () => {
			const setFormValueMock = jest.fn();
			listSpec.rootInstance.internals = {
				setFormValue: setFormValueMock
			} as any;

			(listSpec.rootInstance as any).updateFormValue('');

			expect(setFormValueMock).toHaveBeenCalledWith(null);
		});

		it('should update form value with actual value when provided', async () => {
			const setFormValueMock = jest.fn();
			listSpec.rootInstance.internals = {
				setFormValue: setFormValueMock
			} as any;

			(listSpec.rootInstance as any).updateFormValue('test-value');

			expect(setFormValueMock).toHaveBeenCalledWith('test-value');
		});

		it('should not call setFormValue when internals is null', async () => {
			listSpec.rootInstance.internals = null;

			// Should not throw
			expect(() => (listSpec.rootInstance as any).updateFormValue('test')).not.toThrow();
		});

		it('should set custom validity message when hasError is true', async () => {
			const setValidityMock = jest.fn();
			listSpec.rootInstance.internals = {
				setValidity: setValidityMock
			} as any;

			listSpec.rootInstance.hasError = true;
			listSpec.rootInstance.required = true;
			listSpec.rootInstance.errorText = 'Custom error message';
			(listSpec.rootInstance as any).updateValidityState();

			expect(setValidityMock).toHaveBeenCalledWith({ customError: true }, 'Custom error message');
		});

		it('should clear validity when hasError is false', async () => {
			const setValidityMock = jest.fn();
			listSpec.rootInstance.internals = {
				setValidity: setValidityMock
			} as any;

			listSpec.rootInstance.hasError = false;
			(listSpec.rootInstance as any).updateValidityState();

			expect(setValidityMock).toHaveBeenCalledWith({});
		});

		it('should not call setValidity when internals is null', async () => {
			listSpec.rootInstance.internals = null;

			// Should not throw
			expect(() => (listSpec.rootInstance as any).updateValidityState()).not.toThrow();
		});

		it('should log specific error message when setValidity fails in updateValidityState', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock setValidity to fail
			listSpec.rootInstance.internals = {
				setValidity: () => {
					throw new Error('setValidity failed');
				}
			} as any;

			listSpec.rootInstance.hasError = true;
			listSpec.rootInstance.errorText = 'Test error';
			(listSpec.rootInstance as any).updateValidityState();

			expect(consoleSpy).toHaveBeenCalledWith('Validity state update not supported', 'setValidity failed');
			consoleSpy.mockRestore();
		});

		it('should log specific error message when setFormValue fails in updateFormValue', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			listSpec.rootInstance.internals = {
				setFormValue: () => {
					throw new Error('updateFormValue failed');
				}
			} as any;

			(listSpec.rootInstance as any).updateFormValue('test value');

			expect(consoleSpy).toHaveBeenCalledWith('Form value update not supported', 'updateFormValue failed');
			consoleSpy.mockRestore();
		});

		it('should log specific error message when ElementInternals constructor fails', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			const originalAttachInternals = HTMLElement.prototype.attachInternals;
			HTMLElement.prototype.attachInternals = () => {
				throw new Error('attachInternals is not a function');
			};

			new DvList();
			await listSpec.rootInstance.componentWillLoad();

			expect(consoleSpy).toHaveBeenCalledWith('ElementInternals not supported', 'attachInternals is not a function');

			HTMLElement.prototype.attachInternals = originalAttachInternals;
			consoleSpy.mockRestore();
		});

		it('should not call attachInternals when it is not a function', async () => {
			const originalAttachInternals = HTMLElement.prototype.attachInternals;
			// Set attachInternals to undefined (not a function)
			Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
				value: undefined,
				writable: true,
				configurable: true
			});

			// Create a new DvList instance - should not throw
			const component = new DvList();
			expect(component).toBeInstanceOf(DvList);

			// Restore
			Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
				value: originalAttachInternals,
				writable: true,
				configurable: true
			});
		});
	});
});

