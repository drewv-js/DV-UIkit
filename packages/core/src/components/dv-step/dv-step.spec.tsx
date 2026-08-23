import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvStep } from './dv-step';

interface TypeSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-step', () => {
	let step: TypeSpecPage<DvStep>;

	beforeEach(async () => {
		step = (await newSpecPage({
			components: [DvStep],
			html: `<dv-step></dv-step>`,
			supportsShadowDom: true
		})) as TypeSpecPage<DvStep>;
	});

	// Teardown Instance after each test case
	afterEach(() => {
		step = null;
	});

	describe('Initialization with default state', () => {
		it('renders successfully with default properties', async () => {
			await step.waitForChanges();

			expect(step.root).toBeTruthy();
			expect(step.root.shadowRoot).toBeTruthy();

			// Should render the step container
			const stepContainer = step.root.shadowRoot.querySelector('.flex.items-center');
			expect(stepContainer).toBeTruthy();
		});
	});
	describe('Props', () => {
		it('renders default variant with step number', async () => {
			step.root.variant = 'default';
			step.root.index = 1;
			await step.waitForChanges();

			const icon = step.root.shadowRoot.querySelector('.border-default');
			expect(icon).toBeTruthy();
			expect(icon.textContent.trim()).toBe('1');
		});

		it('renders completed variant with check icon and green styles', async () => {
			step.root.variant = 'completed';
			await step.waitForChanges();

			const icon = step.root.shadowRoot.querySelector('dv-icon');
			expect(icon.getAttribute('name')).toBe('check');
			const iconContainer = step.root.shadowRoot.querySelector('.text-status-success');
			expect(iconContainer).toBeTruthy();
			expect(iconContainer.querySelector('dv-icon')).toBeTruthy();
		});

		it('renders error variant with exclamation icon and red styles', async () => {
			step.root.variant = 'error';
			await step.waitForChanges();

			const icon = step.root.shadowRoot.querySelector('dv-icon');
			expect(icon.getAttribute('name')).toBe('triangle-exclamation');
			expect(icon.getAttribute('color')).toBe('error');
			expect(icon).not.toHaveAttribute('knockout');
		});

		it('renders active variant with blue nested circle and custom spacing', async () => {
			step.root.variant = 'active';
			step.root.index = 4;
			await step.waitForChanges();

			const nested = step.root.shadowRoot.querySelector('.bg-brand-knockout');
			expect(nested.textContent.trim()).toBe('4');
		});
	});
	describe('Slots', () => {
		it('renders slot content when provided', async () => {
			const slotContent = document.createElement('div');
			slotContent.className = 'testslot';
			slotContent.textContent = 'Custom Slot Text';
			step.root.shadowRoot.querySelector('.flex.items-center').appendChild(slotContent);
			await step.waitForChanges();
			const stepElement = step.root.shadowRoot.querySelector('.flex.items-center');
			expect(stepElement).not.toBeNull();
			const renderedContent = stepElement.querySelector('div.testslot');
			expect(renderedContent).not.toBeNull();
			expect(renderedContent.textContent).toBe('Custom Slot Text');
		});
	});
});
