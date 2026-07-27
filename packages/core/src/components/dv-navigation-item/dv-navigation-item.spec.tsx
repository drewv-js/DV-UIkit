import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvNavigationItem } from './dv-navigation-item';
import { DvIcon } from '../dv-icon/dv-icon';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-navigation-item', () => {
	let navigationItem: TypedSpecPage<DvNavigationItem>;

	// Initialize a new instance for DvNavigationItem
	beforeEach(async () => {
		navigationItem = (await newSpecPage({
			components: [DvNavigationItem],
			html: `<dv-navigation-item></dv-navigation-item>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvNavigationItem>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		navigationItem = null;
	});

	describe('Initialization with default state', () => {
		it('should render the host element', () => {
			expect(navigationItem.root).toBeTruthy();
		});

		it('should render a default slot', () => {
			const slot = navigationItem.root?.shadowRoot?.querySelector('slot:not([name])');
			expect(slot).toBeTruthy();
		});

		it('should have default prop values', () => {
			const instance = navigationItem.rootInstance;
			expect(instance.active).toBe(false);
			expect(instance.disabled).toBe(false);
			expect(instance.size).toBe('md');
			expect(instance.supportingText).toBeUndefined();
		});

		it('should render with default state classes', () => {
			const div = navigationItem.root?.shadowRoot?.querySelector('div');
			expect(div?.className).toContain('hover:bg-default-hover');
		});

		it('should apply medium size classes by default', () => {
			const div = navigationItem.root?.shadowRoot?.querySelector('div');
			expect(div?.className).toContain('px-4');
			expect(div?.className).toContain('py-3');
			expect(div?.className).toContain('body-default');
		});
	});

	describe('Props', () => {
		it('should apply active state classes when active is true', async () => {
			navigationItem.root.active = true;
			await navigationItem.waitForChanges();

			const div = navigationItem.root?.shadowRoot?.querySelector('div');
			expect(div?.className).toContain('bg-default-active');
			expect(div?.className).toContain('hover:bg-default-active');
		});

		it('should apply disabled state classes when disabled is true', async () => {
			navigationItem.root!.disabled = true;
			await navigationItem.waitForChanges();

			const div = navigationItem.root?.shadowRoot?.querySelector('div');
			expect(div?.className).toContain('text-disabled');
			expect(div?.className).toContain('cursor-not-allowed');
		});

		it('should set tabIndex to -1 when disabled', async () => {
			navigationItem.root.disabled = true;
			await navigationItem.waitForChanges();

			const anchor = navigationItem.root?.shadowRoot?.querySelector('a');
			expect(anchor?.getAttribute('tabIndex')).toBe('-1');
		});

		it('should set tabIndex to 0 when not disabled', async () => {
			navigationItem.root.disabled = false;
			await navigationItem.waitForChanges();

			const div = navigationItem.root?.shadowRoot?.querySelector('div');
			expect(div?.getAttribute('tabIndex')).toBe('0');
		});

		it('should apply small size classes when size is sm', async () => {
			navigationItem.root.size = 'sm';
			await navigationItem.waitForChanges();

			const div = navigationItem.root?.shadowRoot?.querySelector('div');
			expect(div?.className).toContain('px-4');
			expect(div?.className).toContain('py-2');
			expect(div?.className).toContain('body-sm');
		});

		it('should reflect active prop as attribute', async () => {
			navigationItem.root.active = true;
			await navigationItem.waitForChanges();

			expect(navigationItem.root.getAttribute('active')).toBe('');
		});

		it('should reflect disabled prop as attribute', async () => {
			navigationItem.root.disabled = true;
			await navigationItem.waitForChanges();

			expect(navigationItem.root.getAttribute('disabled')).toBe('');
		});

		it('should apply text-disabled to icon when disabled', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem, DvIcon],
				html: `<dv-navigation-item disabled>
					<dv-icon slot="startIcon" name="home"></dv-icon>
					Item
				</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const iconSpan = page.root?.shadowRoot?.querySelectorAll('span')[0];
			expect(iconSpan?.className).toContain('text-disabled');
		});

		it('should apply text-disabled to supporting text when disabled', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item disabled supporting-text="Supporting">Item</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const spans = page.root?.shadowRoot?.querySelectorAll('span');
			const supportingTextSpan = Array.from(spans || []).find((span) => span.textContent === 'Supporting');
			expect(supportingTextSpan?.className).toContain('text-disabled');
		});

		it('should reflect size prop as attribute', async () => {
			navigationItem.root.size = 'sm';
			await navigationItem.waitForChanges();

			expect(navigationItem.root.getAttribute('size')).toBe('sm');
		});

		it('should render supportingText when provided', async () => {
			navigationItem.root.supportingText = 'Additional info';
			await navigationItem.waitForChanges();

			const supportingTextEl = navigationItem.root?.shadowRoot?.querySelector('.text-subtle.body-xs');
			expect(supportingTextEl).toBeTruthy();
			expect(supportingTextEl?.textContent).toBe('Additional info');
		});

		it('should not render supportingText when not provided', async () => {
			const supportingTextEl = navigationItem.root?.shadowRoot?.querySelector('.text-subtle.body-xs');
			expect(supportingTextEl).toBeNull();
		});

		it('should reflect supportingText prop as attribute', async () => {
			navigationItem.root.supportingText = 'Helper text';
			await navigationItem.waitForChanges();

			expect(navigationItem.root.getAttribute('supporting-text')).toBe('Helper text');
		});
	});

	describe('Slots', () => {
		it('should render startIcon slot when provided', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `
					<dv-navigation-item>
						<dv-icon slot="startIcon" name="home"></dv-icon>
						Home
					</dv-navigation-item>
				`,
				supportsShadowDom: true
			});

			const startIconSlot = page.root.shadowRoot.querySelector('slot[name="startIcon"]');
			expect(startIconSlot).toBeTruthy();
		});

		it('should not render startIcon slot wrapper when no icon provided', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item>Home</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const startIconSlot = page.root.shadowRoot.querySelector('slot[name="startIcon"]');
			expect(startIconSlot).toBeNull();
		});

		it('should render default slot for content', () => {
			const defaultSlot = navigationItem.root?.shadowRoot?.querySelector('slot:not([name])');
			expect(defaultSlot).toBeTruthy();
		});
	});

	describe('Methods', () => {
		it('should sync icon size to xs when size prop is sm', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `
					<dv-navigation-item size="sm">
						<dv-icon slot="startIcon" name="home"></dv-icon>
						Home
					</dv-navigation-item>
				`,
				supportsShadowDom: true
			});

			const icon = page.root.querySelector('dv-icon[slot="startIcon"]') as HTMLDvIconElement;
			await page.waitForChanges();

			// syncIcons should set icon size to 'xs' for small navigation items
			expect(icon.size).toBe('xs');
		});

		it('should sync icon size to sm when size prop is md', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `
					<dv-navigation-item size="md">
						<dv-icon slot="startIcon" name="home"></dv-icon>
						Home
					</dv-navigation-item>
				`,
				supportsShadowDom: true
			});

			const icon = page.root.querySelector('dv-icon[slot="startIcon"]') as HTMLDvIconElement;
			await page.waitForChanges();

			// syncIcons should set icon size to 'sm' for medium navigation items
			expect(icon.size).toBe('sm');
		});

		it('should set focus on the navigation item on setFocus()', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const focusSpy = jest.fn();
			const div = page.root.shadowRoot.querySelector('div[role="link"]') as HTMLDivElement;
			div.focus = focusSpy;

			await page.root.setFocus();

			expect(focusSpy).toHaveBeenCalled();
		});

		it('should pass options to focus on setFocus()', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const focusSpy = jest.fn();
			const div = page.root.shadowRoot.querySelector('div[role="link"]') as HTMLDivElement;
			div.focus = focusSpy;

			const focusOptions = { preventScroll: true };
			await page.root.setFocus(focusOptions);

			expect(focusSpy).toHaveBeenCalledWith(focusOptions);
		});

		it('should returns the correct href value when href prop set', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/dashboard">Dashboard</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const href = await page.root.navigationItemGetHref();

			expect(href).toBe('/dashboard');
		});

		it('should returns empty string for href when href prop is not set', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item>No Link</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const href = await page.root.navigationItemGetHref();

			expect(href).toBe('');
		});
	});

	describe('Events', () => {
		it('should emit navigationItemClick when clicked without modifiers', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const navigationItemClickSpy = jest.fn();
			page.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const anchor = page.root.shadowRoot.querySelector('a');
			anchor.click();
			await page.waitForChanges();

			expect(navigationItemClickSpy).toHaveBeenCalledTimes(1);
		});

		it('should not emit navigationItemClick when disabled', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test" disabled>Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const navigationItemClickSpy = jest.fn();
			page.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const anchor = page.root.shadowRoot.querySelector('a');
			anchor.click();
			await page.waitForChanges();

			expect(navigationItemClickSpy).not.toHaveBeenCalled();
		});

		it('should not emit navigationItemClick when clicked with Ctrl modifier', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const navigationItemClickSpy = jest.fn();
			page.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const anchor = page.root.shadowRoot.querySelector('a');
			const clickEvent = new MouseEvent('click', { ctrlKey: true });
			anchor.dispatchEvent(clickEvent);
			await page.waitForChanges();

			expect(navigationItemClickSpy).not.toHaveBeenCalled();
		});

		it('should not emit navigationItemClick when clicked with Meta modifier', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const navigationItemClickSpy = jest.fn();
			page.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const anchor = page.root.shadowRoot.querySelector('a');
			const clickEvent = new MouseEvent('click', { metaKey: true });
			anchor.dispatchEvent(clickEvent);
			await page.waitForChanges();

			expect(navigationItemClickSpy).not.toHaveBeenCalled();
		});
	});

	describe('Accessibility', () => {
		it('should not emit navigationItemClick on Enter key press when disabled', async () => {
			navigationItem.root.disabled = true;
			await navigationItem.waitForChanges();

			const navigationItemClickSpy = jest.fn();
			navigationItem.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const div = navigationItem.root.shadowRoot.querySelector('div');
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			div.dispatchEvent(keydownEvent);
			await navigationItem.waitForChanges();

			expect(navigationItemClickSpy).not.toHaveBeenCalled();
		});

		it('should emit navigationItemClick on Enter key press', async () => {
			const navigationItemClickSpy = jest.fn();
			navigationItem.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const div = navigationItem.root.shadowRoot.querySelector('div[role="link"]');
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			div.dispatchEvent(keydownEvent);
			await navigationItem.waitForChanges();

			expect(navigationItemClickSpy).toHaveBeenCalled();
		});

		it('should emit navigationItemClick on Space key press', async () => {
			const navigationItemClickSpy = jest.fn();
			navigationItem.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const div = navigationItem.root.shadowRoot.querySelector('div[role="link"]');
			const keydownEvent = new KeyboardEvent('keydown', { key: ' ' });
			div.dispatchEvent(keydownEvent);
			await navigationItem.waitForChanges();

			expect(navigationItemClickSpy).toHaveBeenCalled();
		});

		it('should not emit navigationItemClick on Space key press when disabled', async () => {
			navigationItem.root.disabled = true;
			await navigationItem.waitForChanges();

			const navigationItemClickSpy = jest.fn();
			navigationItem.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const div = navigationItem.root.shadowRoot.querySelector('div');
			const keydownEvent = new KeyboardEvent('keydown', { key: ' ' });
			div.dispatchEvent(keydownEvent);
			await navigationItem.waitForChanges();

			expect(navigationItemClickSpy).not.toHaveBeenCalled();
		});

		it('should set aria-current to page when active', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test" active>Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const anchor = page.root.shadowRoot.querySelector('a');
			expect(anchor?.getAttribute('aria-current')).toBe('page');
		});

		it('should not set aria-current when not active', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const anchor = page.root.shadowRoot.querySelector('a');
			expect(anchor?.hasAttribute('aria-current')).toBe(false);
		});

		it('should set aria-disabled to true when disabled', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test" disabled>Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const anchor = page.root.shadowRoot.querySelector('a');
			expect(anchor?.getAttribute('aria-disabled')).toBe('true');
		});

		it('should not set aria-disabled when not disabled', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const anchor = page.root.shadowRoot.querySelector('a');
			expect(anchor?.hasAttribute('aria-disabled')).toBe(false);
		});

		it('should remove href when disabled', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test" disabled>Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const anchor = page.root.shadowRoot.querySelector('a');
			expect(anchor?.hasAttribute('href')).toBe(false);
		});

		it('should not emit navigationItemClick when clicked with Shift modifier', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const navigationItemClickSpy = jest.fn();
			page.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const anchor = page.root.shadowRoot.querySelector('a');
			const clickEvent = new MouseEvent('click', { shiftKey: true });
			anchor.dispatchEvent(clickEvent);
			await page.waitForChanges();

			expect(navigationItemClickSpy).not.toHaveBeenCalled();
		});

		it('should not emit navigationItemClick when clicked with Alt modifier', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `<dv-navigation-item href="/test">Test</dv-navigation-item>`,
				supportsShadowDom: true
			});

			const navigationItemClickSpy = jest.fn();
			page.root.addEventListener('navigationItemClick', navigationItemClickSpy);

			const anchor = page.root.shadowRoot.querySelector('a');
			const clickEvent = new MouseEvent('click', { altKey: true });
			anchor.dispatchEvent(clickEvent);
			await page.waitForChanges();

			expect(navigationItemClickSpy).not.toHaveBeenCalled();
		});

		it('should sync icon sizes when size prop changes', async () => {
			const page = await newSpecPage({
				components: [DvNavigationItem],
				html: `
					<dv-navigation-item size="md">
						<dv-icon slot="startIcon" name="home"></dv-icon>
						Home
					</dv-navigation-item>
				`,
				supportsShadowDom: true
			});

			const icon = page.root.querySelector('dv-icon[slot="startIcon"]') as HTMLDvIconElement;
			await page.waitForChanges();
			expect(icon.size).toBe('sm');

			// Change size to trigger watcher
			page.root.size = 'sm';
			await page.waitForChanges();

			// Icon size should update to xs
			expect(icon.size).toBe('xs');
		});
	});
});

