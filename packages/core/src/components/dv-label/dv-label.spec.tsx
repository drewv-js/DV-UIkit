import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvLabel } from './dv-label';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-label', () => {
	let label: TypedSpecPage<DvLabel>;

	// Initialize a new instance for DvLabel
	beforeEach(async () => {
		label = (await newSpecPage({
			components: [DvLabel],
			html: `<dv-label></dv-label>`,
			supportsShadowDom: false
		})) as TypedSpecPage<DvLabel>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		label = null;
	});

	describe('Initialization with default state', () => {
		it('renders with default properties', async () => {
			await label.waitForChanges();
			expect(label.root).toBeTruthy();
			expect(label.root.tagName).toBe('DV-LABEL');
		});

		it('applies the correct CSS classes', async () => {
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			expect(labelElement.classList.contains('text-subtle')).toBe(false);
		});
	});

	describe('Props', () => {
		it('applies disabled classes when variant is disabled', async () => {
			label.root.variant = 'disabled';
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			expect(labelElement.classList.contains('text-disabled')).toBe(true);
			expect(labelElement.classList.contains('text-default')).toBe(false);
		});

		it('applies error classes when variant is error', async () => {
			label.root.variant = 'error';
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			expect(labelElement.classList.contains('text-status-error')).toBe(true);
			expect(labelElement.classList.contains('text-default')).toBe(false);
		});

		it('shows asterisk when required is true', async () => {
			label.root.required = true;
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			const asterisk = labelElement.querySelector('span');
			expect(asterisk).toBeTruthy();
			expect(asterisk.textContent).toContain('*');
		});

		it('does not show asterisk when required is false', async () => {
			label.root.required = false;
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			const asterisk = labelElement.querySelector('span');
			expect(asterisk).toBeNull();
		});

		it('displays the label text', async () => {
			label.root.label = 'Test Label';
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			expect(labelElement.textContent).toContain('Test Label');
		});

		it('applies floating default classes when floating is true and no variant', async () => {
			label.root.floating = true;
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			expect(labelElement.classList.contains('z-10')).toBe(true);
			expect(labelElement.classList.contains('relative')).toBe(true);
			expect(labelElement.classList.contains('body-xs')).toBe(true);
			expect(labelElement.classList.contains('text-subtle')).toBe(true);
			expect(labelElement.classList.contains('bg-default')).toBe(true);
			expect(labelElement.classList.contains('rounded-radius-rounded')).toBe(true);
		});

		it('applies floating disabled classes when floating is true and variant is disabled', async () => {
			label.root.floating = true;
			label.root.variant = 'disabled';
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			expect(labelElement.classList.contains('text-disabled')).toBe(true);
			expect(labelElement.classList.contains('z-10')).toBe(true);
			expect(labelElement.classList.contains('body-xs')).toBe(true);
		});

		it('applies floating error classes when floating is true and variant is error', async () => {
			label.root.floating = true;
			label.root.variant = 'error';
			await label.waitForChanges();
			const labelElement = label.root.querySelector('label');
			expect(labelElement.classList.contains('text-status-error')).toBe(true);
			expect(labelElement.classList.contains('z-10')).toBe(true);
			expect(labelElement.classList.contains('body-xs')).toBe(true);
		});
	});
});


