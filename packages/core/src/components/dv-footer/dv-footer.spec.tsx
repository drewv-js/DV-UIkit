import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvFooter } from './dv-footer';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-footer', () => {
	let footerElement: TypedSpecPage<DvFooter>;

	// Initialize a new instance for DvFooter
	beforeEach(async () => {
		footerElement = (await newSpecPage({
			components: [DvFooter],
			html: `<dv-footer></dv-footer>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvFooter>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		footerElement = null;
	});

	describe('Initialization with default state', () => {
		it('should create a component instance', () => {
			expect(new DvFooter()).toBeInstanceOf(DvFooter);
		});
	});

	describe('Slots', () => {
		it('renders the slot content correctly', async () => {
			const slotContent = 'test content';
			// Query the option element in the shadow DOM
			const slotElementRoot = footerElement.root.shadowRoot.querySelector('footer');
			slotElementRoot.innerText = slotContent;
			await footerElement.waitForChanges();
			// Check slot content
			expect(slotElementRoot.textContent.trim()).toBe(slotContent);
		});
	});
});

