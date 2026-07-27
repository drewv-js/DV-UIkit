import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvNavigation } from './dv-navigation';
import { DvNavigationItem } from '../dv-navigation-item/dv-navigation-item';
import { DvNavigationSection } from '../dv-navigation-section/dv-navigation-section';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-navigation', () => {
	let navigation: TypedSpecPage<DvNavigation>;

	// Initialize a new instance for DvNavigation
	beforeEach(async () => {
		navigation = (await newSpecPage({
			components: [DvNavigation],
			html: `<dv-navigation></dv-navigation>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvNavigation>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		navigation = null;
	});

	describe('Initialization with default state', () => {
		it('should render the host element', () => {
			expect(navigation.root).toBeTruthy();
		});

		it('should render a default slot', () => {
			const slot = navigation.root?.shadowRoot?.querySelector('slot');
			expect(slot).toBeTruthy();
		});

		it('should render with default aria-label', () => {
			const nav = navigation.root?.shadowRoot?.querySelector('nav');
			expect(nav?.getAttribute('aria-label')).toBe('Secondary navigation');
		});
	});

	describe('Props', () => {
		it('should set aria-label from the label prop', async () => {
			navigation.root.label = 'Primary navigation';
			await navigation.waitForChanges();

			const nav = navigation.root?.shadowRoot?.querySelector('nav');
			expect(nav?.getAttribute('aria-label')).toBe('Primary navigation');
		});

		it('should set default size to md', () => {
			expect(navigation.root.size).toBe('md');
		});

		it('should reflect the size prop as an attribute', async () => {
			navigation.root.size = 'sm';
			await navigation.waitForChanges();

			expect(navigation.root.getAttribute('size')).toBe('sm');
		});

		it('should propagate size to child navigation items', async () => {
			const page = (await newSpecPage({
				components: [DvNavigation, DvNavigationItem],
				html: `
					<dv-navigation size="sm">
						<dv-navigation-item>Item 1</dv-navigation-item>
						<dv-navigation-item>Item 2</dv-navigation-item>
					</dv-navigation>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvNavigation>;

			const items = page.root?.querySelectorAll('dv-navigation-item');
			expect(items?.length).toBe(2);
			expect(items?.[0].size).toBe('sm');
			expect(items?.[1].size).toBe('sm');
		});

		it('should update child navigation items when size changes', async () => {
			const page = (await newSpecPage({
				components: [DvNavigation, DvNavigationItem],
				html: `
					<dv-navigation size="md">
						<dv-navigation-item>Item 1</dv-navigation-item>
						<dv-navigation-item>Item 2</dv-navigation-item>
					</dv-navigation>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvNavigation>;

			page.root.size = 'sm';
			await page.waitForChanges();

			const items = page.root?.querySelectorAll('dv-navigation-item');
			expect(items?.[0].size).toBe('sm');
			expect(items?.[1].size).toBe('sm');
		});

		it('should propagate size to child navigation sections', async () => {
			const page = (await newSpecPage({
				components: [DvNavigation, DvNavigationSection],
				html: `
					<dv-navigation size="sm">
						<dv-navigation-section label="Section 1"></dv-navigation-section>
						<dv-navigation-section label="Section 2"></dv-navigation-section>
					</dv-navigation>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvNavigation>;

			const sections = page.root?.querySelectorAll('dv-navigation-section');
			expect(sections?.length).toBe(2);
			expect(sections?.[0].size).toBe('sm');
			expect(sections?.[1].size).toBe('sm');
		});

		it('should update child navigation sections when size changes', async () => {
			const page = (await newSpecPage({
				components: [DvNavigation, DvNavigationSection],
				html: `
					<dv-navigation size="md">
						<dv-navigation-section label="Section 1"></dv-navigation-section>
						<dv-navigation-section label="Section 2"></dv-navigation-section>
					</dv-navigation>
				`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvNavigation>;

			page.root.size = 'sm';
			await page.waitForChanges();

			const sections = page.root?.querySelectorAll('dv-navigation-section');
			expect(sections?.[0].size).toBe('sm');
			expect(sections?.[1].size).toBe('sm');
		});
	});
});

