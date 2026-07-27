import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvOption } from './dv-option';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-option', () => {
	let option: TypedSpecPage<DvOption>;

	beforeEach(async () => {
		option = (await newSpecPage({
			components: [DvOption],
			html: `
          <dv-option>Option Label</dv-option>
        `,
			supportsShadowDom: true
		})) as TypedSpecPage<DvOption>;
	});

	afterEach(() => {
		option = null;
	});

	describe('Initialization with default state', () => {
		it('should render option with default styles', async () => {
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');
			expect(optionDiv).toHaveClass('body-default');
			expect(optionDiv).toHaveClass('relative');
			expect(optionDiv).toHaveClass('flex');
			expect(optionDiv).toHaveClass('items-center');
			expect(optionDiv).toHaveClass('cursor-pointer');
		});
	});

	describe('Props', () => {
		it('should render with correct styles when selected', async () => {
			option.rootInstance.selected = true;
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');
			expect(optionDiv).toHaveClass('bg-default-active');
			expect(optionDiv).toHaveClass('text-default');
		});

		it('should render with correct styles when disabled', async () => {
			option.root.disabled = true;
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');

			expect(optionDiv).toHaveClass('text-disabled');
			expect(optionDiv).toHaveClass('cursor-not-allowed');
		});

		it('should render with correct styles when both selected and disabled', async () => {
			option.rootInstance.selected = true;
			option.root.disabled = true;
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');

			expect(optionDiv).toHaveClass('text-disabled');
			expect(optionDiv).toHaveClass('cursor-not-allowed');
		});

		it('should render with correct styles when current', async () => {
			option.rootInstance.current = true;
			await option.root.setFocus(true);
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');
			expect(optionDiv).toHaveClass('bg-default-active');
			expect(optionDiv).toHaveClass('text-default');
			expect(optionDiv).toHaveClass('outline-focus-ring-default');
		});

		it('should render value correctly when proper value', async () => {
			option.root.value = 'properValue';
			await option.waitForChanges();

			expect(option.root.value).toBe('properValue');
		});

		it('should render value correctly when includes spaces', async () => {
			option.root.value = 'value with spaces';
			await option.waitForChanges();

			expect(option.root.value).toBe('value_with_spaces');
		});
	});

	describe('Methods', () => {
		it('should render focus ring when setFocus called with true and current is true', async () => {
			option.rootInstance.current = true;
			await option.root.setFocus(true);
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');
			expect(optionDiv).toHaveClass('outline-focus-ring-default');
		});

		it('should not render focus ring when setFocus called with false', async () => {
			option.rootInstance.current = true;
			await option.root.setFocus(false);
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');
			expect(optionDiv).not.toHaveClass('outline-focus-ring-default');
		});

		it('should not render focus ring when setFocus called with default value', async () => {
			option.rootInstance.current = true;
			await option.root.setFocus();
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');
			expect(optionDiv).not.toHaveClass('outline-focus-ring-default');
		});

		it('should return accurate option label text content', async () => {
			await option.waitForChanges();

			const textContent = await option.root.getTextContent();

			expect(textContent).toBe('Option Label');
		});

		it('should return text content from element nodes without slot attributes', async () => {
			option.root.innerHTML = '<span>Element Text</span>';
			await option.waitForChanges();

			const textContent = await option.root.getTextContent();
			expect(textContent).toBe('Element Text');
		});

		it('should convert non-string value to string when value is set to number', async () => {
			option.rootInstance.value = null as any;
			option.rootInstance.handleValueChange();
			await option.waitForChanges();

			expect(option.rootInstance.value).toBe('null');
		});
	});

	describe('Accessibility', () => {
		it('should render option with default aria labels', async () => {
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');

			expect(optionDiv.getAttribute('aria-disabled')).toBe('false');
			expect(optionDiv.getAttribute('aria-selected')).toBe('false');
		});

		it('should render option with correct aria labels when selected', async () => {
			option.rootInstance.selected = true;
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');

			expect(optionDiv.getAttribute('aria-disabled')).toBe('false');
			expect(optionDiv.getAttribute('aria-selected')).toBe('true');
		});

		it('should render option with correct aria labels when disabled', async () => {
			option.root.disabled = true;
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');

			expect(optionDiv.getAttribute('aria-disabled')).toBe('true');
			expect(optionDiv.getAttribute('aria-selected')).toBe('false');
		});

		it('should render option with correct aria labels when both selected and disabled', async () => {
			option.rootInstance.selected = true;
			option.root.disabled = true;
			await option.waitForChanges();

			const optionDiv = option.root.shadowRoot.querySelector('div');

			expect(optionDiv.getAttribute('aria-disabled')).toBe('true');
			expect(optionDiv.getAttribute('aria-selected')).toBe('true');
		});
	});
});

