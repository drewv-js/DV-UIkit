import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvTabPanel } from './dv-tab-panel';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-tab-panel', () => {
	it('should create a component instance', () => {
		expect(new DvTabPanel()).toBeInstanceOf(DvTabPanel);
	});

	describe('rendering', () => {
		let tabPanelSpec: TypedSpecPage<DvTabPanel>;

		// Initialize a new instance for DvTabPanel
		beforeEach(async () => {
			tabPanelSpec = (await newSpecPage({
				components: [DvTabPanel],
				html: `<dv-tab-panel></dv-tab-panel>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvTabPanel>;
		});

		// Teardown instance and restore after each test case
		afterEach(() => {
			tabPanelSpec = null;
		});

		it('renders dv-tab-panel div with proper class stylings when active', async () => {
			tabPanelSpec.root.active = true;
			await tabPanelSpec.waitForChanges();

			const wrapperDiv = tabPanelSpec.root.shadowRoot.querySelector('div');
			expect(wrapperDiv).toHaveClass('block');
			expect(wrapperDiv).not.toHaveClass('hidden');
		});

		it('renders dv-tab-panel div with proper class stylings when not active', async () => {
			tabPanelSpec.root.active = false;
			await tabPanelSpec.waitForChanges();

			const wrapperDiv = tabPanelSpec.root.shadowRoot.querySelector('div');
			expect(wrapperDiv).toHaveClass('hidden');
			expect(wrapperDiv).not.toHaveClass('block');
		});

		it('renders slot content when provided', async () => {
			tabPanelSpec.root.active = true;
			await tabPanelSpec.waitForChanges();
			// Create slot content
			const slotContent = document.createElement('div');
			slotContent.textContent = 'Tab Panel Content';
			tabPanelSpec.root.shadowRoot.querySelector('div[role="tabpanel"]').appendChild(slotContent);
			await tabPanelSpec.waitForChanges();
			// Query the slot content
			const slotElement = tabPanelSpec.root.shadowRoot.querySelector('div');
			// Check if the slot content is rendered
			expect(slotElement).not.toBeNull();
			expect(slotElement.textContent).toBe('Tab Panel Content');
		});

		it('does not render slot content when not provided', async () => {
			await tabPanelSpec.waitForChanges();
			const slotElement = tabPanelSpec.root.shadowRoot.querySelector('slot');
			expect(slotElement).not.toBeNull();
			// Check if the slot content is not rendered
			const panelDiv = tabPanelSpec.root.shadowRoot.querySelector('div[role="tabpanel"]');
			const slotContent = panelDiv.querySelector('div');
			// Check that the slot content is not present
			expect(slotContent).toBeNull();
		});

		it('renders an element with an aria role of tabpanel', async () => {
			tabPanelSpec.root.active = true;
			await tabPanelSpec.waitForChanges();
			const tabPanel = tabPanelSpec.root.shadowRoot.querySelector('[role="tabpanel"]');
			expect(tabPanel).not.toBeNull();
		});
	});
});

