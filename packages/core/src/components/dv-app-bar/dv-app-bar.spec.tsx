import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvAppBar } from './dv-app-bar';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('Subcomponents should render', () => {
	let appSpec: TypedSpecPage<DvAppBar>;

	//Initialize a new instance for DvAvatar
	beforeEach(async () => {
		appSpec = (await newSpecPage({
			components: [DvAppBar],
			html: '<dv-app-bar></dv-app-bar>',
			supportsShadowDom: true
		})) as TypedSpecPage<DvAppBar>;
	});

	// Teardown instance and restore after each test case
	afterEach(() => {
		appSpec = null;
	});

	describe('Props', () => {
		it('should set the correct aria-label from the label prop', async () => {
			appSpec.root.label = 'Custom Label';
			await appSpec.waitForChanges();
			const ariaLabelElement = appSpec.root.shadowRoot.querySelector('header');
			expect(ariaLabelElement).not.toBeNull();
			expect(ariaLabelElement.getAttribute('aria-label')).toBe('Custom Label');
		});
	});

	describe('Slots', () => {
		it('renders nothing when no slot is used', async () => {
			const slotContent = '';
			// Query the div element in the shadow DOM
			const slotElementRoot = appSpec.root.shadowRoot.querySelector('div');
			slotElementRoot.innerText = slotContent;
			await appSpec.waitForChanges();
			// Check slot content
			expect(slotElementRoot.textContent.trim()).toBe(slotContent);
		});

		it('renders the left slot content correctly', async () => {
			const leftSlotContent = 'dv-icon';
			// Query the option element in the shadow DOM
			const slotElementRoot = appSpec.root.shadowRoot.querySelector('div');
			slotElementRoot.innerText = leftSlotContent;
			await appSpec.waitForChanges();
			// Check slot content
			expect(slotElementRoot.textContent.trim()).toBe(leftSlotContent);
		});

		it('renders the center slot content correctly', async () => {
			const centerSlotContent = 'dv-icon';
			// Query the option element in the shadow DOM
			const slotElementRoot = appSpec.root.shadowRoot.querySelector('div');
			slotElementRoot.innerText = centerSlotContent;
			await appSpec.waitForChanges();
			// Check slot content
			expect(slotElementRoot.textContent.trim()).toBe(centerSlotContent);
		});

		it('renders the right slot content correctly', async () => {
			const leftSlotContent = 'dv-icon';
			// Query the option element in the shadow DOM
			const slotElementRoot = appSpec.root.shadowRoot.querySelector('div');
			slotElementRoot.innerText = leftSlotContent;
			await appSpec.waitForChanges();
			// Check slot content
			expect(slotElementRoot.textContent.trim()).toBe(leftSlotContent);
		});
	});
});

