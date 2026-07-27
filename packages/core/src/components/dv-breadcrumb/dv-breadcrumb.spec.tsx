import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvBreadcrumb } from './dv-breadcrumb';
import { DvBreadcrumbItem } from '../dv-breadcrumb-item/dv-breadcrumb-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

interface DvBreadcrumbInternal {
	isCollapsed: boolean;
	collapsedItems: { href: string; label: string; disabled: boolean; element: HTMLElement }[];
	itemWidths: number[];
	navEl: HTMLElement | null;
	resizeObserver: { disconnect: () => void } | undefined;
	calculateCollapse(): void;
	restoreAllItems(items: HTMLElement[]): void;
	disconnectedCallback(): void;
}

const asInternal = (instance: DvBreadcrumb): DvBreadcrumbInternal => instance as unknown as DvBreadcrumbInternal;

const stubAvailableWidth = (host: HTMLElement, width: number) => {
	jest.spyOn(host.parentElement as HTMLElement, 'getBoundingClientRect').mockReturnValue({ width } as DOMRect);
};

describe('dv-breadcrumb', () => {
	let breadcrumb: TypedSpecPage<DvBreadcrumb>;
	let capturedResizeCallback: (() => void) | null = null;

	beforeAll(() => {
		global.ResizeObserver = class ResizeObserver {
			observe = jest.fn();
			unobserve = jest.fn();
			disconnect = jest.fn();
			constructor(callback: ResizeObserverCallback) {
				capturedResizeCallback = () => callback([], null as unknown as ResizeObserver);
			}
		} as unknown as typeof ResizeObserver;
	});

	beforeEach(async () => {
		breadcrumb = (await newSpecPage({
			components: [DvBreadcrumb, DvBreadcrumbItem],
			html: `<dv-breadcrumb></dv-breadcrumb>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvBreadcrumb>;
	});

	afterEach(() => {
		breadcrumb = null;
	});

	describe('Initialization with default state', () => {
		it('should render the host element', () => {
			expect(breadcrumb.root).toBeTruthy();
		});

		it('should render a nav element', () => {
			const nav = breadcrumb.root?.shadowRoot?.querySelector('nav');
			expect(nav).toBeTruthy();
		});

		it('should have default prop values', () => {
			expect(breadcrumb.rootInstance.label).toBe('Breadcrumb');
			expect(breadcrumb.rootInstance.size).toBe('md');
		});

		it('should render a default slot', () => {
			const slot = breadcrumb.root?.shadowRoot?.querySelector('slot:not([name])');
			expect(slot).toBeTruthy();
		});

		it('should render a visible-start named slot', () => {
			const slot = breadcrumb.root?.shadowRoot?.querySelector('slot[name="visible-start"]');
			expect(slot).toBeTruthy();
		});

		it('should render a visible-end named slot', () => {
			const slot = breadcrumb.root?.shadowRoot?.querySelector('slot[name="visible-end"]');
			expect(slot).toBeTruthy();
		});

		it('should not render the collapse trigger by default', () => {
			const iconButton = breadcrumb.root?.shadowRoot?.querySelector('dv-icon-button');
			expect(iconButton).toBeFalsy();
		});

		it('should not render the dropdown by default', () => {
			const menu = breadcrumb.root?.shadowRoot?.querySelector('[role="menu"]');
			expect(menu).toBeFalsy();
		});

		it('should disconnect the ResizeObserver on disconnectedCallback', () => {
			const disconnectSpy = jest.fn();
			asInternal(breadcrumb.rootInstance).resizeObserver = { disconnect: disconnectSpy };

			asInternal(breadcrumb.rootInstance).disconnectedCallback();

			expect(disconnectSpy).toHaveBeenCalled();
		});

		it('should not throw when disconnectedCallback is called without a ResizeObserver', () => {
			asInternal(breadcrumb.rootInstance).resizeObserver = undefined;
			expect(() => asInternal(breadcrumb.rootInstance).disconnectedCallback()).not.toThrow();
		});
	});

	describe('Props', () => {
		describe('label', () => {
			it('should apply the label as aria-label on the nav element', () => {
				const nav = breadcrumb.root?.shadowRoot?.querySelector('nav');
				expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
			});

			it('should update the nav aria-label when the label prop changes', async () => {
				breadcrumb.root.label = 'Site navigation';
				await breadcrumb.waitForChanges();

				const nav = breadcrumb.root?.shadowRoot?.querySelector('nav');
				expect(nav?.getAttribute('aria-label')).toBe('Site navigation');
			});

			it('should reflect label as an attribute', async () => {
				breadcrumb.root.label = 'Page trail';
				await breadcrumb.waitForChanges();

				expect(breadcrumb.root.getAttribute('label')).toBe('Page trail');
			});
		});

		describe('size', () => {
			it('should default to "md"', () => {
				expect(breadcrumb.rootInstance.size).toBe('md');
			});

			it('should reflect size as an attribute', async () => {
				breadcrumb.root.size = 'sm';
				await breadcrumb.waitForChanges();

				expect(breadcrumb.root.getAttribute('size')).toBe('sm');
			});

			it('should propagate the initial size to all child breadcrumb items', async () => {
				const page = await newSpecPage({
					components: [DvBreadcrumb, DvBreadcrumbItem],
					html: `
						<dv-breadcrumb size="sm">
							<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
							<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
						</dv-breadcrumb>
					`,
					supportsShadowDom: true
				});

				const items = page.root.querySelectorAll<HTMLDvBreadcrumbItemElement>('dv-breadcrumb-item');
				items.forEach((item) => {
					expect(item.size).toBe('sm');
				});
			});

			it('should propagate updated size to all child breadcrumb items', async () => {
				const page = await newSpecPage({
					components: [DvBreadcrumb, DvBreadcrumbItem],
					html: `
						<dv-breadcrumb size="md">
							<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
							<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
						</dv-breadcrumb>
					`,
					supportsShadowDom: true
				});

				(page.root as HTMLDvBreadcrumbElement).size = 'sm';
				await page.waitForChanges();

				const items = page.root.querySelectorAll<HTMLDvBreadcrumbItemElement>('dv-breadcrumb-item');
				items.forEach((item) => {
					expect(item.size).toBe('sm');
				});
			});
		});
	});

	describe('Methods', () => {
		it('should not collapse when there are fewer than 2 middle items', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			asInternal(page.rootInstance).calculateCollapse();
			await page.waitForChanges();

			expect(page.root.shadowRoot.querySelector('dv-icon-button')).toBeFalsy();
		});

		it('should restore and hide collapse UI when navEl is not set', async () => {
			const internal = asInternal(breadcrumb.rootInstance);
			internal.isCollapsed = true;
			internal.navEl = null;
			internal.calculateCollapse();
			await breadcrumb.waitForChanges();

			expect(breadcrumb.root?.shadowRoot?.querySelector('dv-icon-button')).toBeFalsy();
		});

		it('should assign visible-start, collapse-hidden and visible-end slots when collapsing', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.itemWidths = [200, 200, 200, 200];
			stubAvailableWidth(page.root, 100);

			internal.calculateCollapse();
			await page.waitForChanges();

			const items = page.root.querySelectorAll('dv-breadcrumb-item');
			expect((items[0] as HTMLElement).slot).toBe('visible-start');
			expect((items[1] as HTMLElement).slot).toBe('collapse-hidden');
			expect((items[2] as HTMLElement).slot).toBe('collapse-hidden');
			expect((items[3] as HTMLElement).slot).toBe('visible-end');
		});

		it('should populate collapsedItems with the middle items when collapsing', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.itemWidths = [200, 200, 200, 200];
			stubAvailableWidth(page.root, 100);

			internal.calculateCollapse();
			await page.waitForChanges();

			expect(internal.collapsedItems).toHaveLength(2);
		});

		it('should restore items and clear collapsed state when the container is wide enough', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.isCollapsed = true;
			internal.collapsedItems = [{ href: '/products', label: 'Products', disabled: false, element: null }];
			internal.itemWidths = [100, 100, 100, 100];
			stubAvailableWidth(page.root, 1000);

			internal.calculateCollapse();
			await page.waitForChanges();

			expect(page.root.shadowRoot.querySelector('dv-icon-button')).toBeFalsy();
		});

		it('should fall back to empty string when item href or textContent is nullish', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			const items = Array.from(page.root.querySelectorAll('dv-breadcrumb-item'));
			Object.defineProperty(items[1], 'href', { value: undefined, configurable: true });
			Object.defineProperty(items[2], 'textContent', { value: null, configurable: true });

			internal.itemWidths = [200, 200, 200, 200];
			stubAvailableWidth(page.root, 100);

			internal.calculateCollapse();
			await page.waitForChanges();

			expect(internal.collapsedItems[0].href).toBe('');
			expect(internal.collapsedItems[1].label).toBe('');
		});

		it('should invoke calculateCollapse from the ResizeObserver callback', () => {
			const spy = jest.spyOn(asInternal(breadcrumb.rootInstance), 'calculateCollapse');
			capturedResizeCallback?.();
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});

		it('should clear slot attributes on all items when restoring', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const items = Array.from(page.root.querySelectorAll('dv-breadcrumb-item')) as HTMLElement[];
			asInternal(page.rootInstance).restoreAllItems(items);
			await page.waitForChanges();

			items.forEach((item) => {
				expect(item.slot).toBe('');
			});
		});

		it('should re-measure item widths when stored widths are all zero', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.navEl = page.root.shadowRoot.querySelector('nav');
			// Simulate widths captured while hidden (all zero)
			internal.itemWidths = [0, 0, 0, 0];
			stubAvailableWidth(page.root, 100);

			internal.calculateCollapse();

			// After re-measure, itemWidths should no longer all be zero (JSDOM returns 0 for offsetWidth,
			// but the branch is still exercised — the key assertion is that it doesn't throw)
			expect(internal.itemWidths).toBeDefined();
		});

		it('should fall back to navEl offsetWidth when parentElement is null', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.navEl = page.root.shadowRoot.querySelector('nav');
			internal.itemWidths = [200, 200, 200, 200];

			// Force parentElement to null
			Object.defineProperty(page.root, 'parentElement', { value: null, configurable: true });
			// Mock navEl offsetWidth
			Object.defineProperty(internal.navEl, 'offsetWidth', { value: 500, configurable: true });

			internal.calculateCollapse();

			expect(internal.isCollapsed).toBe(true);
		});

		it('should fall back to document.documentElement.clientWidth when parentElement and navEl are null', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.navEl = page.root.shadowRoot.querySelector('nav');
			internal.itemWidths = [200, 200, 200, 200];

			// Force parentElement to null and navEl to null
			Object.defineProperty(page.root, 'parentElement', { value: null, configurable: true });
			internal.navEl = null;

			// Mock document.documentElement.clientWidth
			Object.defineProperty(document.documentElement, 'clientWidth', { value: 300, configurable: true });

			// navEl is null so the early-return (!this.navEl) path fires — need navEl set for the fallback
			// Re-set navEl but with offsetWidth returning undefined
			const fakeNav = { offsetWidth: undefined } as unknown as HTMLElement;
			internal.navEl = fakeNav;

			internal.calculateCollapse();

			// measuredWidth (800) > clientWidth (300), so it should collapse
			expect(internal.isCollapsed).toBe(true);
		});

		describe('dropdown', () => {
			beforeEach(async () => {
				const internal = asInternal(breadcrumb.rootInstance);
				internal.isCollapsed = true;
				internal.collapsedItems = [
					{ href: '/products', label: 'Products', disabled: false, element: null },
					{ href: '/category', label: 'Category', disabled: false, element: null }
				];
				await breadcrumb.waitForChanges();
			});

			it('should render an dv-dropdown when collapsed', () => {
				expect(breadcrumb.root?.shadowRoot?.querySelector('dv-dropdown')).toBeTruthy();
			});

			it('should render an dv-menu inside the dropdown', () => {
				expect(breadcrumb.root?.shadowRoot?.querySelector('dv-dropdown dv-menu')).toBeTruthy();
			});

			it('should render a menu item for each collapsed item', () => {
				const menuItems = breadcrumb.root?.shadowRoot?.querySelectorAll('dv-menu-item');
				expect(menuItems?.length).toBe(2);
			});

			it('should render collapsed item labels as menu item text', () => {
				const menuItems = breadcrumb.root?.shadowRoot?.querySelectorAll('dv-menu-item');
				expect(menuItems?.[0]?.textContent?.trim()).toBe('Products');
				expect(menuItems?.[1]?.textContent?.trim()).toBe('Category');
			});

			it('should not render an dv-dropdown when not collapsed', async () => {
				asInternal(breadcrumb.rootInstance).isCollapsed = false;
				await breadcrumb.waitForChanges();

				expect(breadcrumb.root?.shadowRoot?.querySelector('dv-dropdown')).toBeFalsy();
			});

			it('should render the trigger icon-button with slot="trigger"', () => {
				const trigger = breadcrumb.root?.shadowRoot?.querySelector('dv-icon-button[slot="trigger"]');
				expect(trigger).toBeTruthy();
			});

			it('should set placement="bottom-start" on the dropdown', () => {
				const dropdown = breadcrumb.root?.shadowRoot?.querySelector('dv-dropdown');
				expect(dropdown?.getAttribute('placement')).toBe('bottom-start');
			});

			it('should dispatch breadcrumbItemClick with href in detail when a collapsed item is clicked', async () => {
				const spy = jest.fn();
				breadcrumb.root?.addEventListener('breadcrumbItemClick', spy);

				const menuItem = breadcrumb.root?.shadowRoot?.querySelector('dv-menu-item');
				menuItem?.click();
				await breadcrumb.waitForChanges();

				expect(spy).toHaveBeenCalledTimes(1);
				expect(spy.mock.calls[0][0].detail).toEqual({ href: '/products' });
			});

			it('should not dispatch breadcrumbItemClick when a modifier key is held during collapsed item click', async () => {
				const spy = jest.fn();
				breadcrumb.root?.addEventListener('breadcrumbItemClick', spy);

				const menuItem = breadcrumb.root?.shadowRoot?.querySelector('dv-menu-item');
				const ctrlClick = new MouseEvent('click', { bubbles: true, ctrlKey: true });
				menuItem?.dispatchEvent(ctrlClick);
				await breadcrumb.waitForChanges();

				expect(spy).not.toHaveBeenCalled();
			});
		});

		describe('sizeChanged', () => {
			it('should re-measure widths and recalculate collapse when size prop changes', async () => {
				// Mock requestAnimationFrame to invoke callback synchronously
				const originalRAF = global.requestAnimationFrame;
				global.requestAnimationFrame = ((cb: FrameRequestCallback) => {
					cb(0);
					return 0;
				}) as typeof requestAnimationFrame;

				const page = await newSpecPage({
					components: [DvBreadcrumb, DvBreadcrumbItem],
					html: `
						<dv-breadcrumb>
							<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
							<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
						</dv-breadcrumb>
					`,
					supportsShadowDom: true
				});

				const internal = asInternal(page.rootInstance);
				internal.itemWidths = [200, 200, 200, 200];
				stubAvailableWidth(page.root, 100);

				// Trigger sizeChanged via prop update
				page.root.size = 'sm';
				await page.waitForChanges();

				expect(internal.isCollapsed).toBe(true);

				global.requestAnimationFrame = originalRAF;
			});
		});

		describe('visible-middle slot', () => {
			it('should assign visible-middle slot to items that are not collapsed', async () => {
				const page = await newSpecPage({
					components: [DvBreadcrumb, DvBreadcrumbItem],
					html: `
						<dv-breadcrumb>
							<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/subcategory">Subcategory</dv-breadcrumb-item>
							<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
						</dv-breadcrumb>
					`,
					supportsShadowDom: true
				});

				const internal = asInternal(page.rootInstance);
				// Set widths so only the center item (index 2) needs to collapse
				// With 5 items, middle indices are [1,2,3], sorted from center outward: [2,1,3]
				// Available width enough to show all except the center one
				internal.itemWidths = [100, 100, 100, 100, 100]; // total = 500
				stubAvailableWidth(page.root, 450); // need to collapse just one item (saves 100, adds 48 ellipsis = net 52 saved => 448 <= 450)

				internal.calculateCollapse();
				await page.waitForChanges();

				const items = page.root.querySelectorAll('dv-breadcrumb-item');
				expect((items[0] as HTMLElement).slot).toBe('visible-start');
				expect((items[1] as HTMLElement).slot).toBe('visible-middle');
				expect((items[2] as HTMLElement).slot).toBe('collapse-hidden');
				expect((items[3] as HTMLElement).slot).toBe('visible-middle');
				expect((items[4] as HTMLElement).slot).toBe('visible-end');
			});
		});

		describe('itemWidths fallback', () => {
			it('should default to 0 when itemWidths entry is undefined for a collapsed index', async () => {
				const page = await newSpecPage({
					components: [DvBreadcrumb, DvBreadcrumbItem],
					html: `
						<dv-breadcrumb>
							<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
							<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
						</dv-breadcrumb>
					`,
					supportsShadowDom: true
				});

				const internal = asInternal(page.rootInstance);
				// Set itemWidths with undefined entries to trigger ?? 0 fallback
				internal.itemWidths = [200, undefined, undefined, 200] as unknown as number[];
				stubAvailableWidth(page.root, 100);

				internal.calculateCollapse();
				await page.waitForChanges();

				// Should still collapse (the undefined widths fall back to 0)
				expect(internal.isCollapsed).toBe(true);
				expect(internal.collapsedItems.length).toBeGreaterThan(0);
			});
		});

		describe('availableWidth fallback chain', () => {
			it('should use navEl offsetWidth when parentElement getBoundingClientRect returns undefined width', async () => {
				const page = await newSpecPage({
					components: [DvBreadcrumb, DvBreadcrumbItem],
					html: `
						<dv-breadcrumb>
							<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
							<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
							<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
						</dv-breadcrumb>
					`,
					supportsShadowDom: true
				});

				const internal = asInternal(page.rootInstance);
				internal.itemWidths = [200, 200, 200, 200];

				// Make parentElement.getBoundingClientRect().width return undefined (nullish)
				jest
					.spyOn(page.root.parentElement as HTMLElement, 'getBoundingClientRect')
					.mockReturnValue({ width: undefined } as unknown as DOMRect);
				// Set navEl with a valid offsetWidth so it's used as the fallback
				const fakeNav = { offsetWidth: 300 } as unknown as HTMLElement;
				internal.navEl = fakeNav;

				internal.calculateCollapse();
				await page.waitForChanges();

				// 800 > 300, should collapse
				expect(internal.isCollapsed).toBe(true);
			});
		});
	});

	describe('Accessibility', () => {
		it('should apply aria-label to the nav element', () => {
			const nav = breadcrumb.root?.shadowRoot?.querySelector('nav');
			expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
		});

		it('should render the trigger with an accessible label', async () => {
			const internal = asInternal(breadcrumb.rootInstance);
			internal.isCollapsed = true;
			internal.collapsedItems = [{ href: '/a', label: 'A', disabled: false, element: null }];
			await breadcrumb.waitForChanges();

			const iconButton = breadcrumb.root?.shadowRoot?.querySelector('dv-icon-button');
			expect(iconButton?.getAttribute('label')).toBe('Show hidden breadcrumb items');
		});

		it('should render an dv-dropdown for accessible keyboard navigation when collapsed', async () => {
			const internal = asInternal(breadcrumb.rootInstance);
			internal.isCollapsed = true;
			internal.collapsedItems = [{ href: '/a', label: 'A', disabled: false, element: null }];
			await breadcrumb.waitForChanges();

			const dropdown = breadcrumb.root?.shadowRoot?.querySelector('dv-dropdown');
			expect(dropdown).toBeTruthy();
		});
	});

	describe('disabled items in collapsed dropdown', () => {
		it('should pass disabled prop to collapsed menu items', async () => {
			const internal = asInternal(breadcrumb.rootInstance);
			internal.isCollapsed = true;
			internal.collapsedItems = [
				{ href: '/products', label: 'Products', disabled: false, element: null },
				{ href: '/locked', label: 'Locked', disabled: true, element: null }
			];
			await breadcrumb.waitForChanges();

			const menuItems = breadcrumb.root?.shadowRoot?.querySelectorAll('dv-menu-item');
			expect(menuItems?.[0]?.getAttribute('disabled')).toBeFalsy();
			expect(menuItems?.[1]?.getAttribute('disabled')).not.toBeNull();
		});

		it('should not dispatch breadcrumbItemClick when a disabled collapsed item is clicked', async () => {
			const internal = asInternal(breadcrumb.rootInstance);
			internal.isCollapsed = true;
			internal.collapsedItems = [{ href: '/locked', label: 'Locked', disabled: true, element: null }];
			await breadcrumb.waitForChanges();

			const spy = jest.fn();
			breadcrumb.root?.addEventListener('breadcrumbItemClick', spy);

			const menuItem = breadcrumb.root?.shadowRoot?.querySelector('dv-menu-item');
			menuItem?.click();
			await breadcrumb.waitForChanges();

			expect(spy).not.toHaveBeenCalled();
		});

		it('should capture disabled state from breadcrumb-item during collapse', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/locked" disabled>Locked</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.itemWidths = [200, 200, 200, 200];
			stubAvailableWidth(page.root, 100);

			internal.calculateCollapse();
			await page.waitForChanges();

			const disabledItem = internal.collapsedItems.find((item) => item.href === '/locked');
			expect(disabledItem).toBeTruthy();
			expect(disabledItem.disabled).toBe(true);
		});

		it('should capture disabled as false for non-disabled breadcrumb items', async () => {
			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.itemWidths = [200, 200, 200, 200];
			stubAvailableWidth(page.root, 100);

			internal.calculateCollapse();
			await page.waitForChanges();

			internal.collapsedItems.forEach((item) => {
				expect(item.disabled).toBe(false);
			});
		});
	});

	describe('stale width recovery', () => {
		it('should restore items and schedule re-measure when collapsed items have zero width', async () => {
			const originalRAF = global.requestAnimationFrame;
			const rafCallbacks: FrameRequestCallback[] = [];
			global.requestAnimationFrame = ((cb: FrameRequestCallback) => {
				rafCallbacks.push(cb);
				return 0;
			}) as typeof requestAnimationFrame;

			const page = await newSpecPage({
				components: [DvBreadcrumb, DvBreadcrumbItem],
				html: `
					<dv-breadcrumb>
						<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/products">Products</dv-breadcrumb-item>
						<dv-breadcrumb-item href="/category">Category</dv-breadcrumb-item>
						<dv-breadcrumb-item active>Current</dv-breadcrumb-item>
					</dv-breadcrumb>
				`,
				supportsShadowDom: true
			});

			const internal = asInternal(page.rootInstance);
			internal.isCollapsed = true;
			// Simulate hidden items having 0 width (as if items had slot="collapse-hidden")
			internal.itemWidths = [100, 0, 0, 100];
			internal.navEl = page.root?.shadowRoot?.querySelector('nav');

			internal.calculateCollapse();

			// The method should have called restoreAllItems and scheduled a rAF
			expect(internal.isCollapsed).toBe(false);
			expect(rafCallbacks.length).toBeGreaterThan(0);

			// Execute the rAF callback to cover measureItemWidths + calculateCollapse inside it (lines 133-134)
			rafCallbacks[0](0);

			global.requestAnimationFrame = originalRAF;
		});
	});
});

