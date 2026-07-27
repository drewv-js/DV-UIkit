import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvNavigationSection } from './dv-navigation-section';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-navigation-section', () => {
	let navigationSection: TypedSpecPage<DvNavigationSection>;

	// Initialize a new instance for DvNavigationSection
	beforeEach(async () => {
		navigationSection = (await newSpecPage({
			components: [DvNavigationSection],
			html: `<dv-navigation-section></dv-navigation-section>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvNavigationSection>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		navigationSection = null;
	});

	describe('Initialization with default state', () => {
		it('should render the host element', () => {
			expect(navigationSection.root).toBeTruthy();
		});

		it('should render a default slot', () => {
			const slot = navigationSection.root?.shadowRoot?.querySelector('slot');
			expect(slot).toBeTruthy();
		});

		it('should not render a label header by default', () => {
			const header = navigationSection.root?.shadowRoot?.querySelector('span');
			expect(header).toBeNull();
		});

		it('should not render a divider on the only/last section', () => {
			const divider = navigationSection.root?.shadowRoot?.querySelector('dv-divider');
			expect(divider).toBeNull();
		});

		it('should render a divider on every section except the last', async () => {
			const page = await newSpecPage({
				components: [DvNavigationSection],
				html: `
					<div>
						<dv-navigation-section></dv-navigation-section>
						<dv-navigation-section></dv-navigation-section>
						<dv-navigation-section></dv-navigation-section>
					</div>
				`,
				supportsShadowDom: true
			});

			const sections = page.body.querySelectorAll('dv-navigation-section');
			expect(sections.length).toBe(3);
			expect(sections[0].shadowRoot?.querySelector('dv-divider')).toBeTruthy();
			expect(sections[1].shadowRoot?.querySelector('dv-divider')).toBeTruthy();
			expect(sections[2].shadowRoot?.querySelector('dv-divider')).toBeNull();
		});
	});

	describe('Props', () => {
		it('should render the label as a header when set', async () => {
			navigationSection.root.label = 'Menu';
			await navigationSection.waitForChanges();

			const header = navigationSection.root?.shadowRoot?.querySelector('span');
			expect(header?.textContent).toBe('Menu');
		});

		it('should default size to md', () => {
			expect(navigationSection.root.size).toBe('md');
		});

		it('should reflect the size prop as an attribute', async () => {
			navigationSection.root.size = 'sm';
			await navigationSection.waitForChanges();

			expect(navigationSection.root.getAttribute('size')).toBe('sm');
		});

		it('should apply mb-4 class to divider when size is md', async () => {
			const page = await newSpecPage({
				components: [DvNavigationSection],
				html: `
					<div>
						<dv-navigation-section size="md"></dv-navigation-section>
						<dv-navigation-section size="md"></dv-navigation-section>
					</div>
				`,
				supportsShadowDom: true
			});

			const firstSection = page.body.querySelectorAll('dv-navigation-section')[0];
			const divider = firstSection.shadowRoot?.querySelector('dv-divider');
			expect(divider?.className).toBe('mb-4');
		});

		it('should apply mb-2 class to divider when size is sm', async () => {
			const page = await newSpecPage({
				components: [DvNavigationSection],
				html: `
					<div>
						<dv-navigation-section size="sm"></dv-navigation-section>
						<dv-navigation-section size="sm"></dv-navigation-section>
					</div>
				`,
				supportsShadowDom: true
			});

			const firstSection = page.body.querySelectorAll('dv-navigation-section')[0];
			const divider = firstSection.shadowRoot?.querySelector('dv-divider');
			expect(divider?.className).toBe('mb-2');
		});
	});
});

