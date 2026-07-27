import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvBadge } from './dv-badge';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-badge', () => {
	let badgeSpec: TypedSpecPage<DvBadge>;

	// Initialize a new instance for DvBadge
	beforeEach(async () => {
		badgeSpec = (await newSpecPage({
			components: [DvBadge],
			html: '<dv-badge></dv-badge>',
			supportsShadowDom: true
		})) as TypedSpecPage<DvBadge>;
	});

	// Teardown instance and restore after each test case
	afterEach(() => {
		badgeSpec = null;
	});

	describe('Initialization with default state', () => {
		it('badge renders with the default styling', async () => {
			await badgeSpec.waitForChanges();
			// Check default properties
			const wrapperDiv = badgeSpec.root.shadowRoot.querySelector('div');
			expect(wrapperDiv).toHaveClass('inline-flex');
			expect(wrapperDiv).toHaveClass('items-center');
			expect(wrapperDiv).toHaveClass('justify-center');
			expect(wrapperDiv).toHaveClass('label-default');
			expect(wrapperDiv).toHaveClass('rounded-radius-full');
			expect(wrapperDiv).toHaveClass('px-3');
			expect(wrapperDiv).toHaveClass('py-1');
			expect(wrapperDiv).toHaveClass('border-width-sm');
			expect(wrapperDiv).toHaveClass('text-status-neutral');
			expect(wrapperDiv).toHaveClass('border-status-neutral');
			expect(wrapperDiv).toHaveClass('max-w-full');
			expect(wrapperDiv).toHaveClass('truncate');
		});

		// Inner span classes for text content
		it('span for content renders with the default styling', async () => {
			await badgeSpec.waitForChanges();
			// Check default properties
			const wrapperDiv = badgeSpec.root.shadowRoot.querySelector('span');
			expect(wrapperDiv).toHaveClass('truncate');
		});
	});

	describe('Props', () => {
		it('badge renders with success styling when color changes to success', async () => {
			badgeSpec.root.setAttribute('color', 'success');
			const wrapperDiv = badgeSpec.root.shadowRoot.querySelector('div');
			await badgeSpec.waitForChanges();
			expect(wrapperDiv).toHaveClass('text-status-success');
			expect(wrapperDiv).toHaveClass('border-status-success');
		});

		it('badge renders with error styling when color changes to error', async () => {
			badgeSpec.root.setAttribute('color', 'error');
			const wrapperDiv = badgeSpec.root.shadowRoot.querySelector('div');
			await badgeSpec.waitForChanges();
			expect(wrapperDiv).toHaveClass('text-status-error');
			expect(wrapperDiv).toHaveClass('border-status-error');
		});

		it('badge renders with warning styling when color changes to warning', async () => {
			badgeSpec.root.setAttribute('color', 'warning');
			const wrapperDiv = badgeSpec.root.shadowRoot.querySelector('div');
			await badgeSpec.waitForChanges();
			expect(wrapperDiv).toHaveClass('text-status-warning');
			expect(wrapperDiv).toHaveClass('border-status-warning');
		});

		it('badge renders with neutral styling when color changes to neutral', async () => {
			badgeSpec.root.setAttribute('color', 'neutral');
			const wrapperDiv = badgeSpec.root.shadowRoot.querySelector('div');
			await badgeSpec.waitForChanges();
			expect(wrapperDiv).toHaveClass('text-status-neutral');
			expect(wrapperDiv).toHaveClass('border-status-neutral');
		});

		it('badge renders with info styling when color changes to info', async () => {
			badgeSpec.root.setAttribute('color', 'info');
			const wrapperDiv = badgeSpec.root.shadowRoot.querySelector('div');
			await badgeSpec.waitForChanges();
			expect(wrapperDiv).toHaveClass('text-status-info');
			expect(wrapperDiv).toHaveClass('border-status-info');
		});

		it('badge falls back to neutral styling when color is invalid', async () => {
			badgeSpec.root.setAttribute('color', 'unknown-color');
			const wrapperDiv = badgeSpec.root.shadowRoot.querySelector('div');
			await badgeSpec.waitForChanges();
			expect(wrapperDiv).toHaveClass('text-status-neutral');
			expect(wrapperDiv).toHaveClass('border-status-neutral');
		});
	});

	describe('Slots', () => {
		it('renders slot content when provided', async () => {
			// Inject slot content into the component
			const slotElementRoot = badgeSpec.root.shadowRoot.querySelector('div');
			slotElementRoot.innerText = '100';
			await badgeSpec.waitForChanges();

			expect(slotElementRoot.textContent.trim()).toBe('100');
		});
	});
});

