import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvBreadcrumbItem } from './dv-breadcrumb-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

interface DvBreadcrumbItemInternal {
	isLastItem: boolean;
	itemElement: HTMLElement | undefined;
	componentWillLoad(): void;
	handleClick(event: MouseEvent): void;
	handleKeyDown(event: KeyboardEvent): void;
}

const asInternal = (instance: DvBreadcrumbItem): DvBreadcrumbItemInternal =>
	instance as unknown as DvBreadcrumbItemInternal;

describe('dv-breadcrumb-item', () => {
	let breadcrumbItem: TypedSpecPage<DvBreadcrumbItem>;

	beforeEach(async () => {
		breadcrumbItem = (await newSpecPage({
			components: [DvBreadcrumbItem],
			html: `<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvBreadcrumbItem>;
	});

	afterEach(() => {
		breadcrumbItem = null;
	});

	describe('Initialization with default state', () => {
		it('should render the host element', () => {
			expect(breadcrumbItem.root).toBeTruthy();
		});

		it('should render a default slot', () => {
			const slot = breadcrumbItem.root?.shadowRoot?.querySelector('slot:not([name])');
			expect(slot).toBeTruthy();
		});

		it('should have default prop values', () => {
			expect(breadcrumbItem.rootInstance.href).toBe('/home');
			expect(breadcrumbItem.rootInstance.active).toBe(false);
			expect(breadcrumbItem.rootInstance.disabled).toBe(false);
			expect(breadcrumbItem.rootInstance.size).toBe('md');
		});

		it('should use empty string as the href default when not provided', async () => {
			const page = (await newSpecPage({
				components: [DvBreadcrumbItem],
				html: `<dv-breadcrumb-item></dv-breadcrumb-item>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvBreadcrumbItem>;
			expect(page.rootInstance.href).toBe('');
		});

		it('should render the link element with default interactive state classes', () => {
			const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
			expect(linkDiv?.className).toContain('text-brand');
			expect(linkDiv?.className).toContain('cursor-pointer');
		});

		it('should not render a chevron icon when it is the last item', () => {
			// default beforeEach: single item in parent → isLastItem = true
			expect(breadcrumbItem.root?.shadowRoot?.querySelector('dv-icon')).toBeFalsy();
		});

		it('should render a chevron icon when not the last item and not active', async () => {
			asInternal(breadcrumbItem.rootInstance).isLastItem = false;
			await breadcrumbItem.waitForChanges();
			expect(breadcrumbItem.root?.shadowRoot?.querySelector('dv-icon')).toBeTruthy();
		});

		it('should set isLastItem to true when it is the last breadcrumb item in its parent', () => {
			expect(asInternal(breadcrumbItem.rootInstance).isLastItem).toBe(true);
		});

		it('should set isLastItem to false when the host has no parent element', () => {
			Object.defineProperty(breadcrumbItem.root, 'parentElement', { value: null, configurable: true });
			asInternal(breadcrumbItem.rootInstance).componentWillLoad();
			expect(asInternal(breadcrumbItem.rootInstance).isLastItem).toBe(false);
		});
	});

	describe('Props', () => {
		describe('href', () => {
			it('should reflect href as an attribute', async () => {
				breadcrumbItem.root.href = '/products';
				await breadcrumbItem.waitForChanges();
				expect(breadcrumbItem.root.getAttribute('href')).toBe('/products');
			});

			it('should apply href to the anchor element', () => {
				const anchor = breadcrumbItem.root?.shadowRoot?.querySelector('a');
				expect(anchor?.getAttribute('href')).toBe('/home');
			});

			it('should not apply href to the anchor when active', async () => {
				breadcrumbItem.root.active = true;
				await breadcrumbItem.waitForChanges();
				const anchor = breadcrumbItem.root?.shadowRoot?.querySelector('a');
				expect(anchor?.hasAttribute('href')).toBe(false);
			});

			it('should not apply href to the anchor when disabled', async () => {
				breadcrumbItem.root.disabled = true;
				await breadcrumbItem.waitForChanges();
				const anchor = breadcrumbItem.root?.shadowRoot?.querySelector('a');
				expect(anchor?.hasAttribute('href')).toBe(false);
			});
		});

		describe('active', () => {
			it('should reflect active as an attribute', async () => {
				breadcrumbItem.root.active = true;
				await breadcrumbItem.waitForChanges();
				expect(breadcrumbItem.root.getAttribute('active')).toBe('');
			});

			it('should apply active state classes to the link element', async () => {
				breadcrumbItem.root.active = true;
				await breadcrumbItem.waitForChanges();
				const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
				expect(linkDiv?.className).toContain('text-default');
				expect(linkDiv?.className).toContain('cursor-default');
			});

			it('should not render chevron when active and not the last item', async () => {
				asInternal(breadcrumbItem.rootInstance).isLastItem = false;
				breadcrumbItem.root.active = true;
				await breadcrumbItem.waitForChanges();
				expect(breadcrumbItem.root?.shadowRoot?.querySelector('dv-icon')).toBeFalsy();
			});
		});

		describe('disabled', () => {
			it('should reflect disabled as an attribute', async () => {
				breadcrumbItem.root.disabled = true;
				await breadcrumbItem.waitForChanges();
				expect(breadcrumbItem.root.getAttribute('disabled')).toBe('');
			});

			it('should apply disabled state classes to the link element', async () => {
				breadcrumbItem.root.disabled = true;
				await breadcrumbItem.waitForChanges();
				const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
				expect(linkDiv?.className).toContain('text-disabled');
				expect(linkDiv?.className).toContain('cursor-not-allowed');
			});

			it('should set tabIndex to -1 on the link element when disabled', async () => {
				breadcrumbItem.root.disabled = true;
				await breadcrumbItem.waitForChanges();
				const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
				expect(linkDiv?.getAttribute('tabIndex')).toBe('-1');
			});

			it('should set tabIndex to 0 on the link element when not disabled', () => {
				const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
				expect(linkDiv?.getAttribute('tabIndex')).toBe('0');
			});
		});

		describe('size', () => {
			it('should default to "md"', () => {
				expect(breadcrumbItem.rootInstance.size).toBe('md');
			});

			it('should reflect size as an attribute', async () => {
				breadcrumbItem.root.size = 'sm';
				await breadcrumbItem.waitForChanges();
				expect(breadcrumbItem.root.getAttribute('size')).toBe('sm');
			});

			it('should apply sm size classes when size is "sm"', async () => {
				breadcrumbItem.root.size = 'sm';
				await breadcrumbItem.waitForChanges();
				const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
				expect(linkDiv?.className).toContain('body-xs');
			});

			it('should apply md size classes when size is "md"', () => {
				const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
				expect(linkDiv?.className).toContain('body-default');
			});

			it('should apply sm hover radius class to the link element when size is "sm" and interactive', async () => {
				breadcrumbItem.root.size = 'sm';
				await breadcrumbItem.waitForChanges();
				const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
				expect(linkDiv?.className).toContain('hover:rounded-radius-rounded');
			});

			it('should apply md hover radius class to the link element when size is "md" and interactive', () => {
				const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]');
				expect(linkDiv?.className).toContain('hover:rounded-radius-lg');
			});
		});
	});

	describe('Methods', () => {
		describe('setFocus', () => {
			it('should call focus on the link element', async () => {
				const page = (await newSpecPage({
					components: [DvBreadcrumbItem],
					html: `<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>`,
					supportsShadowDom: true
				})) as TypedSpecPage<DvBreadcrumbItem>;

				const focusSpy = jest.fn();
				const linkDiv = page.root.shadowRoot.querySelector('[role="link"]') as HTMLElement;
				linkDiv.focus = focusSpy;

				await page.root.setFocus();

				expect(focusSpy).toHaveBeenCalled();
			});

			it('should pass focus options to focus', async () => {
				const page = (await newSpecPage({
					components: [DvBreadcrumbItem],
					html: `<dv-breadcrumb-item href="/home">Home</dv-breadcrumb-item>`,
					supportsShadowDom: true
				})) as TypedSpecPage<DvBreadcrumbItem>;

				const focusSpy = jest.fn();
				const linkDiv = page.root.shadowRoot.querySelector('[role="link"]') as HTMLElement;
				linkDiv.focus = focusSpy;

				const focusOptions = { preventScroll: true };
				await page.root.setFocus(focusOptions);

				expect(focusSpy).toHaveBeenCalledWith(focusOptions);
			});

			it('should do nothing when itemElement is not set', async () => {
				asInternal(breadcrumbItem.rootInstance).itemElement = undefined;
				await expect(breadcrumbItem.root.setFocus()).resolves.not.toThrow();
			});
		});
	});

	describe('Events', () => {
		it('should emit breadcrumbItemClick when clicked without modifiers', async () => {
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			breadcrumbItem.root?.shadowRoot?.querySelector('a').click();
			await breadcrumbItem.waitForChanges();
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should not emit breadcrumbItemClick when disabled', async () => {
			breadcrumbItem.root.disabled = true;
			await breadcrumbItem.waitForChanges();
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			breadcrumbItem.root?.shadowRoot?.querySelector('a').click();
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not emit breadcrumbItemClick when active', async () => {
			breadcrumbItem.root.active = true;
			await breadcrumbItem.waitForChanges();
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			breadcrumbItem.root?.shadowRoot?.querySelector('a').click();
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not emit breadcrumbItemClick when clicked with metaKey', async () => {
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			breadcrumbItem.root?.shadowRoot?.querySelector('a').dispatchEvent(new MouseEvent('click', { metaKey: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not emit breadcrumbItemClick when clicked with ctrlKey', async () => {
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			breadcrumbItem.root?.shadowRoot?.querySelector('a').dispatchEvent(new MouseEvent('click', { ctrlKey: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not emit breadcrumbItemClick when clicked with shiftKey', async () => {
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			breadcrumbItem.root?.shadowRoot?.querySelector('a').dispatchEvent(new MouseEvent('click', { shiftKey: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not emit breadcrumbItemClick when clicked with altKey', async () => {
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			breadcrumbItem.root?.shadowRoot?.querySelector('a').dispatchEvent(new MouseEvent('click', { altKey: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should emit breadcrumbItemClick on Enter key press', async () => {
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]') as HTMLElement;
			linkDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).toHaveBeenCalled();
		});

		it('should emit breadcrumbItemClick on Space key press', async () => {
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]') as HTMLElement;
			linkDiv.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).toHaveBeenCalled();
		});

		it('should not emit breadcrumbItemClick on other key press', async () => {
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]') as HTMLElement;
			linkDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not emit breadcrumbItemClick on keydown when disabled', async () => {
			breadcrumbItem.root.disabled = true;
			await breadcrumbItem.waitForChanges();
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]') as HTMLElement;
			linkDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});

		it('should not emit breadcrumbItemClick on keydown when active', async () => {
			breadcrumbItem.root.active = true;
			await breadcrumbItem.waitForChanges();
			const spy = jest.fn();
			breadcrumbItem.root.addEventListener('breadcrumbItemClick', spy);
			const linkDiv = breadcrumbItem.root?.shadowRoot?.querySelector('[role="link"]') as HTMLElement;
			linkDiv.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
			await breadcrumbItem.waitForChanges();
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('Accessibility', () => {
		it('should set aria-current="page" when active', async () => {
			breadcrumbItem.root.active = true;
			await breadcrumbItem.waitForChanges();
			const anchor = breadcrumbItem.root?.shadowRoot?.querySelector('a');
			expect(anchor?.getAttribute('aria-current')).toBe('page');
		});

		it('should not set aria-current when not active', () => {
			const anchor = breadcrumbItem.root?.shadowRoot?.querySelector('a');
			expect(anchor?.hasAttribute('aria-current')).toBe(false);
		});

		it('should set aria-disabled="true" when disabled', async () => {
			breadcrumbItem.root.disabled = true;
			await breadcrumbItem.waitForChanges();
			const anchor = breadcrumbItem.root?.shadowRoot?.querySelector('a');
			expect(anchor?.getAttribute('aria-disabled')).toBe('true');
		});

		it('should not set aria-disabled when not disabled', () => {
			const anchor = breadcrumbItem.root?.shadowRoot?.querySelector('a');
			expect(anchor?.hasAttribute('aria-disabled')).toBe(false);
		});

		it('should always set tabIndex to -1 on the anchor element', () => {
			const anchor = breadcrumbItem.root?.shadowRoot?.querySelector('a');
			expect(anchor?.getAttribute('tabIndex')).toBe('-1');
		});

		it('should set aria-hidden="true" on the chevron icon', async () => {
			asInternal(breadcrumbItem.rootInstance).isLastItem = false;
			await breadcrumbItem.waitForChanges();
			const icon = breadcrumbItem.root?.shadowRoot?.querySelector('dv-icon');
			expect(icon?.getAttribute('aria-hidden')).toBe('true');
		});
	});
});

