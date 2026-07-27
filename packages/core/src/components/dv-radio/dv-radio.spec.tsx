import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvRadio } from './dv-radio';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-radio', () => {
	let page: TypedSpecPage<DvRadio>;
	let radio: HTMLInputElement;

	// Initialize a new instance for DvRadio
	beforeEach(async () => {
		page = (await newSpecPage({
			components: [DvRadio],
			html: `<dv-radio></dv-radio>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvRadio>;

		radio = page.root?.shadowRoot?.querySelector('input[type="radio"]');
	});

	// Teardown instance after each test case
	afterEach(() => {
		page = null;
	});

	describe('Props', () => {
		it('renders radio as checked when checked property is true', async () => {
			page.root.checked = true;
			await page.waitForChanges();

			expect(radio.checked).toBe(true);
		});

		it('renders radio as unchecked when checked property is false', async () => {
			page.root.checked = false;
			await page.waitForChanges();

			expect(radio.checked).toBe(false);
		});

		it('renders radio as disabled when disabled property is true', async () => {
			page.root.disabled = true;
			await page.waitForChanges();

			expect(radio.disabled).toBe(true);
		});

		it('renders the custom checked indicator span with correct classes', async () => {
			const page = await newSpecPage({
				components: [DvRadio],
				html: `<dv-radio label="Test" checked></dv-radio>`,
				supportsShadowDom: true
			});

			// Find the custom span for the checked indicator
			const span = page.root.shadowRoot.querySelector('span.absolute');
			expect(span).toBeTruthy();
			expect(span.className).toContain('peer-checked:opacity-100');
			expect(span.className).toContain('rounded-full');
			expect(span.className).toContain('size-2');
		});
	});

	describe('Events', () => {
		it('does not change checked state when disabled and clicked', async () => {
			const handleClickSpy = jest.fn();
			page.root.disabled = true;
			page.root.checked = false;
			page.root.addEventListener('click', handleClickSpy);
			await page.waitForChanges();

			radio.click();

			expect(page.root.checked).toBe(false);
		});

		it('bubbles click event when enabled', async () => {
			const handleClickSpy = jest.fn();
			page.root.disabled = false;
			page.root.addEventListener('click', handleClickSpy);
			await page.waitForChanges();

			radio.click();

			expect(handleClickSpy).toHaveBeenCalled();
		});

		it('does not set checked to true on Enter keydown', async () => {
			await page.waitForChanges();
			expect(page.root.checked).toBe(false);

			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			radio.dispatchEvent(event);
			await page.waitForChanges();

			expect(page.root.checked).toBe(false);
		});
	});
});

