import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvDatePickerButton } from './dv-date-picker-button';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-date-picker-button', () => {
	let datePickerButton: TypedSpecPage<DvDatePickerButton>;

	// Initialize a new instance for DvSidebarItem
	beforeEach(async () => {
		datePickerButton = (await newSpecPage({
			components: [DvDatePickerButton],
			html: `<dv-date-picker-button></dv-date-picker-button>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvDatePickerButton>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		datePickerButton = null;
	});

	describe('Initialization with default state', () => {
		it('should render the component', () => {
			expect(new DvDatePickerButton()).toBeInstanceOf(DvDatePickerButton);
		});

		it('should render button with default styling', async () => {
			await datePickerButton.waitForChanges();

			const button = datePickerButton.root.shadowRoot.querySelector('button');
			expect(button).toHaveClass('rounded-full');
			expect(button).toHaveClass('py-2');
			expect(button).toHaveClass('px-6');
			expect(button).toHaveClass('body-sm');
			expect(button).toHaveClass('bg-brand');
			expect(button).not.toHaveClass('bg-brand-knockout');
		});
	});

	describe('Props', () => {
		it('should render with selected styles when selected prop true', async () => {
			datePickerButton.root.selected = true;
			await datePickerButton.waitForChanges();

			const button = datePickerButton.root.shadowRoot.querySelector('button');
			expect(button).toHaveClass('rounded-full');
			expect(button).toHaveClass('py-2');
			expect(button).toHaveClass('px-6');
			expect(button).toHaveClass('body-sm');
			expect(button).toHaveClass('bg-brand-knockout');
		});
	});
});

