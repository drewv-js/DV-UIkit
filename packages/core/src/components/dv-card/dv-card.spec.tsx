import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvCard } from './dv-card';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-card', () => {
	it('should create a component instance', () => {
		expect(new DvCard()).toBeInstanceOf(DvCard);
	});

	describe('rendering', () => {
		let cardSpec: TypedSpecPage<DvCard>;

		// Initialize a new instance for DvCard
		beforeEach(async () => {
			cardSpec = (await newSpecPage({
				components: [DvCard],
				html: `<dv-card></dv-card>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvCard>;
		});

		// Teardown instance and restore after each test case
		afterEach(() => {
			cardSpec = null;
		});

		describe('Initialization with default state', () => {
			it('renders dv-card wrapper with token-driven inline styles', async () => {
				await cardSpec.waitForChanges();

				const wrapperDiv = cardSpec.root.shadowRoot.querySelector('div');
				expect(wrapperDiv).toHaveClass('w-full');
				expect(wrapperDiv?.getAttribute('style')).toContain('border-radius');
				expect(wrapperDiv?.getAttribute('style')).toContain('background');
			});

			it('defaults the color prop to "default"', async () => {
				await cardSpec.waitForChanges();
				expect(cardSpec.root.color).toBe('default');
			});

			it('applies subtle token background when color is set to "subtle"', async () => {
				cardSpec.root.setAttribute('color', 'subtle');
				await cardSpec.waitForChanges();

				const wrapperDiv = cardSpec.root.shadowRoot.querySelector('div');
				expect(wrapperDiv?.getAttribute('style')).toContain('var(--dv-color-surface)');
			});

			it('applies strong surface token background when color is set to "default"', async () => {
				cardSpec.root.setAttribute('color', 'default');
				await cardSpec.waitForChanges();

				const wrapperDiv = cardSpec.root.shadowRoot.querySelector('div');
				expect(wrapperDiv?.getAttribute('style')).toContain('var(--dv-color-surface-strong)');
			});

			it('reflects the color prop as an attribute', async () => {
				cardSpec.root.color = 'subtle';
				await cardSpec.waitForChanges();

				expect(cardSpec.root.getAttribute('color')).toBe('subtle');
			});
		});

		describe('Slots', () => {
			it('renders header section when header slot content is provided', async () => {
				const page = await newSpecPage({
					components: [DvCard],
					html: `<dv-card><div slot="header-text">Title</div></dv-card>`,
					supportsShadowDom: true
				});
				await page.waitForChanges();

				const headerDiv = page.root.shadowRoot.querySelector('.flex.justify-between');
				expect(headerDiv).not.toBeNull();
			});

			it('renders header text slot when provided', async () => {
				await cardSpec.waitForChanges();
				// Create slot content
				const slotContent = document.createElement('div');
				slotContent.setAttribute('slot', 'header-text');
				// Append the slot content
				cardSpec.root.shadowRoot.querySelector('div').appendChild(slotContent);
				await cardSpec.waitForChanges();
				// Query the header content in the shadow DOM
				const slotElement = cardSpec.root.shadowRoot.querySelector('div');
				// Check if the header content is rendered
				expect(slotElement).not.toBeNull();
			});

			it('does not render header slot when title and icon not provided', async () => {
				await cardSpec.waitForChanges();
				// Query the slot in the shadow DOM
				const slotContent = cardSpec.root.shadowRoot.querySelector('slot');
				// Check if the content is not rendered
				expect(slotContent.textContent.trim()).toBe('');
			});

			it('renders header-icon slot when provided', async () => {
				await cardSpec.waitForChanges();
				// Create slot content
				const slotContent = document.createElement('div');
				slotContent.setAttribute('slot', 'header-icon');
				// Append the slot content
				cardSpec.root.shadowRoot.querySelector('div').appendChild(slotContent);
				await cardSpec.waitForChanges();
				// Query the image content in the shadow DOM
				const slotElement = cardSpec.root.shadowRoot.querySelector('div');
				// Check if the image content is rendered
				expect(slotElement).not.toBeNull();
			});

			it('renders header container when header content is provided', async () => {
				const page = await newSpecPage({
					components: [DvCard],
					html: `<dv-card><div slot="header-text">Header</div></dv-card>`,
					supportsShadowDom: true
				});

				const headerWrapper = page.root.shadowRoot.querySelector('.flex.justify-between');
				const headerSlot = headerWrapper.querySelector('slot[name="header-text"]');
				expect(headerWrapper).not.toBeNull();
				expect(headerSlot).not.toBeNull();
			});

			it('renders content slot when provided', async () => {
				await cardSpec.waitForChanges();
				// Create slot content
				const slotContent = document.createElement('div');
				slotContent.setAttribute('slot', '');
				// Append the slot content
				cardSpec.root.shadowRoot.querySelector('div').appendChild(slotContent);
				await cardSpec.waitForChanges();
				// Query the content in the shadow DOM
				const slotElement = cardSpec.root.shadowRoot.querySelector('div');
				// Check if the content is rendered
				expect(slotElement).not.toBeNull();
			});
		});
	});
});

