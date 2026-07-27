import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvListItem } from './dv-list-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-list-item', () => {
	let itemSpec: TypedSpecPage<DvListItem>;

	// Initialize a new instance for DvListItem
	beforeEach(async () => {
		itemSpec = (await newSpecPage({
			components: [DvListItem],
			html: `<dv-list-item>Item 1</dv-list-item>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvListItem>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		jest.restoreAllMocks();
		itemSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should render the component', async () => {
			// Check that the component is rendered
			expect(itemSpec.root).toBeTruthy();
		});
	});

	describe('Props', () => {
		it('should render radio button when showRadio is true', async () => {
			itemSpec.rootInstance.showRadio = true;
			itemSpec.rootInstance.name = 'test-group';
			itemSpec.rootInstance.value = 'test-value';
			await itemSpec.waitForChanges();

			const radioInput = itemSpec.root.shadowRoot.querySelector('input');
			expect(radioInput).toBeTruthy();
			expect(radioInput.name).toBe('test-group');
			expect(radioInput.value).toBe('test-value');
		});

		it('should hide radio button when showRadio is false', async () => {
			itemSpec.rootInstance.showRadio = false;
			await itemSpec.waitForChanges();

			const radioInput = itemSpec.root.shadowRoot.querySelector('input');
			expect(radioInput.classList.contains('sr-only')).toBe(true);
		});

		it('should replace spaces with underscores in value', async () => {
			itemSpec.rootInstance.value = 'test value with spaces';
			await itemSpec.rootInstance.handleValueChange();

			expect(itemSpec.rootInstance.value).toBe('test_value_with_spaces');
		});

		it('should convert non-string value to string when handleValueChange is called', async () => {
			Object.defineProperty(itemSpec.rootInstance, 'value', {
				value: 456,
				writable: true,
				configurable: true
			});
			itemSpec.rootInstance.handleValueChange();

			expect(itemSpec.rootInstance.value).toBe('456');
		});

		it('should handle null value in handleValueChange', async () => {
			itemSpec.rootInstance.value = null;
			itemSpec.rootInstance.handleValueChange();

			expect(itemSpec.rootInstance.value).toBeNull();
		});
	});

	describe('Events', () => {
		it('should emit itemClick when radio button changes', async () => {
			itemSpec.rootInstance.showRadio = true;
			itemSpec.rootInstance.value = 'test-value';
			itemSpec.rootInstance.disabled = false;

			const itemClickSpy = jest.spyOn(itemSpec.rootInstance.itemClick, 'emit');

			// Simulate radio change
			const radioInput = itemSpec.root.shadowRoot.querySelector('input');
			radioInput.dispatchEvent(new Event('change'));

			expect(itemClickSpy).toHaveBeenCalledWith({
				value: 'test-value',
				native: expect.any(MouseEvent)
			});
		});

		it('should not emit itemClick when disabled', async () => {
			itemSpec.rootInstance.showRadio = true;
			itemSpec.rootInstance.value = 'test-value';
			itemSpec.rootInstance.disabled = true;

			const itemClickSpy = jest.spyOn(itemSpec.rootInstance.itemClick, 'emit');

			const radioInput = itemSpec.root.shadowRoot.querySelector('input');
			radioInput.dispatchEvent(new Event('change'));

			expect(itemClickSpy).not.toHaveBeenCalled();
		});
	});

	describe('Methods', () => {
		it('should set focus on the list item', async () => {
			const focusSpy = jest.spyOn(itemSpec.rootInstance.listItemRef, 'focus');
			await itemSpec.rootInstance.listItemSetFocus();
			// Check that the focus method was called
			expect(focusSpy).toHaveBeenCalled();
		});

		it('should set radioRef when listItemSetRadio is called', async () => {
			await itemSpec.rootInstance.listItemSetRadio(true);
			await itemSpec.waitForChanges();

			expect(itemSpec.rootInstance.radioRef).toBe(true);

			await itemSpec.rootInstance.listItemSetRadio(false);
			await itemSpec.waitForChanges();

			expect(itemSpec.rootInstance.radioRef).toBe(false);
		});

		it('should set selected when listItemSetSelected is called', async () => {
			await itemSpec.rootInstance.listItemSetSelected(true);
			await itemSpec.waitForChanges();

			expect(itemSpec.rootInstance.selected).toBe(true);

			await itemSpec.rootInstance.listItemSetSelected(false);
			await itemSpec.waitForChanges();

			expect(itemSpec.rootInstance.selected).toBe(false);
		});
	});

	describe('Form handling', () => {
		it('should set tabIndex -1 on radio input', async () => {
			itemSpec.rootInstance.showRadio = true;
			await itemSpec.waitForChanges();

			const radioInput = itemSpec.root.shadowRoot.querySelector('input');
			expect(radioInput.tabIndex).toBe(-1);
		});

		it('should prevent radio focus on disabled items', async () => {
			itemSpec.rootInstance.disabled = true;
			await itemSpec.waitForChanges();

			const label = itemSpec.root.shadowRoot.querySelector('label');
			expect(label.tabIndex).toBe(-1);
		});
	});

	describe('Accessibility', () => {
		it('should set aria-selected attribute when selected changes', async () => {
			itemSpec.rootInstance.selected = true;
			await itemSpec.rootInstance.selectedHandler();
			// Check that the aria-selected attribute is set to true
			expect(itemSpec.root.getAttribute('aria-selected')).toBe('true');
			itemSpec.rootInstance.selected = false;
			await itemSpec.rootInstance.selectedHandler();
			// Check that the aria-selected attribute is set to false
			expect(itemSpec.root.getAttribute('aria-selected')).toBe('false');
		});

		it('should set aria-disabled attribute when disabled changes', async () => {
			itemSpec.rootInstance.disabled = true;
			await itemSpec.rootInstance.disabledHandler();
			// Check that the aria-disabled attribute is set to true
			expect(itemSpec.root.getAttribute('aria-disabled')).toBe('true');

			itemSpec.rootInstance.disabled = false;
			await itemSpec.rootInstance.disabledHandler();
			// Check that the aria-disabled attribute is set to false
			expect(itemSpec.root.getAttribute('aria-disabled')).toBe('false');
		});
	});
});

