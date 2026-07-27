import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { SIDEBAR_ITEM_CLICK_EVENT } from '../../events';
import { DvSidebarItem } from './dv-sidebar-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-sidebar-item', () => {
	let sidebarItem: TypedSpecPage<DvSidebarItem>;

	// Initialize a new instance for DvSidebarItem
	beforeEach(async () => {
		sidebarItem = (await newSpecPage({
			components: [DvSidebarItem],
			html: `<dv-sidebar-item></dv-sidebar-item>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvSidebarItem>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		sidebarItem = null;
	});

	describe('Initialization with default state', () => {
		it('renders a focusable wrapper and semantic anchor', () => {
			const wrapper = sidebarItem.root?.shadowRoot?.querySelector('div');
			const anchor = sidebarItem.root?.shadowRoot?.querySelector('a');

			expect(wrapper).toBeTruthy();
			expect(wrapper?.getAttribute('tabindex')).toBe('-1');
			expect(anchor).toBeTruthy();
			expect(anchor?.getAttribute('href')).toBe('');
		});

		it('renders icon and label content', () => {
			const icon = sidebarItem.root?.shadowRoot?.querySelector('dv-icon');
			const slot = sidebarItem.root?.shadowRoot?.querySelector('slot');

			expect(icon?.getAttribute('name')).toBe('location-dot');
			expect(slot).toBeTruthy();
		});
	});

	describe('Props', () => {
		it('renders the provided href', async () => {
			sidebarItem.root.href = '/dashboard';
			sidebarItem.root.textContent = 'Nav Item';
			await sidebarItem.waitForChanges();

			const anchor = sidebarItem.root?.shadowRoot?.querySelector('a');
			expect(anchor).toBeTruthy();
			expect(anchor?.getAttribute('href')).toBe('/dashboard');
		});

		it('renders the provided icon instead of the default icon', async () => {
			sidebarItem.root.icon = 'house';
			await sidebarItem.waitForChanges();

			const icon = sidebarItem.root?.shadowRoot?.querySelector('dv-icon');
			expect(icon?.getAttribute('name')).toBe('house');
		});

		it('sets aria-current and active styling when active', async () => {
			sidebarItem.root.active = true;
			sidebarItem.root.href = '/dashboard';
			sidebarItem.root.textContent = 'Nav Item';
			await sidebarItem.waitForChanges();

			const wrapper = sidebarItem.root?.shadowRoot?.querySelector('div');
			const anchor = sidebarItem.root?.shadowRoot?.querySelector('a');
			const label = sidebarItem.root?.shadowRoot?.querySelectorAll('span')[1];

			expect(anchor?.getAttribute('aria-current')).toBe('page');
			expect(wrapper).toHaveClass('bg-default-active');
			expect(label).toHaveClass('text-brand');
		});

		it('returns an empty string from sidebarItemGetHref when href is not set', async () => {
			await sidebarItem.waitForChanges();

			await expect(sidebarItem.rootInstance.sidebarItemGetHref()).resolves.toBe('');
		});

		it('focuses the wrapper when setFocus is called', async () => {
			const wrapper = sidebarItem.root?.shadowRoot?.querySelector('div') as HTMLElement;
			wrapper.focus = jest.fn();

			await sidebarItem.rootInstance.setFocus({ preventScroll: true });

			expect(wrapper.focus).toHaveBeenCalledWith({ preventScroll: true });
		});
	});

	describe('Events', () => {
		it('emits sidebarItemClick when clicked without modifier keys', async () => {
			sidebarItem.root.href = '/dashboard';
			sidebarItem.root.textContent = 'Nav Item';
			await sidebarItem.waitForChanges();

			const spy = jest.fn();
			sidebarItem.root?.addEventListener(SIDEBAR_ITEM_CLICK_EVENT, spy);

			const anchor = sidebarItem.root?.shadowRoot?.querySelector('a');
			anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

			expect(spy).toHaveBeenCalled();
			expect(spy.mock.calls[0][0].detail).toBeUndefined();
		});

		it('does not emit sidebarItemClick for modifier-key clicks', async () => {
			sidebarItem.root.href = '/dashboard';
			await sidebarItem.waitForChanges();

			const spy = jest.fn();
			sidebarItem.root?.addEventListener(SIDEBAR_ITEM_CLICK_EVENT, spy);

			(sidebarItem.rootInstance as unknown as { handleClick: (event: MouseEvent) => void }).handleClick(
				new MouseEvent('click', { metaKey: true })
			);

			expect(spy).not.toHaveBeenCalled();
		});

		it('emits sidebarItemClick with no payload when href is not set', async () => {
			sidebarItem.root?.removeAttribute('href');
			await sidebarItem.waitForChanges();

			const emitSpy = jest.spyOn(sidebarItem.rootInstance.sidebarItemClick, 'emit');
			const preventDefault = jest.fn();
			const nativeEvent = { preventDefault } as unknown as MouseEvent;

			(sidebarItem.rootInstance as unknown as { handleClick: (event: MouseEvent) => void }).handleClick(nativeEvent);

			expect(preventDefault).toHaveBeenCalled();
			expect(emitSpy).toHaveBeenCalledWith();
		});
	});

	describe('Methods', () => {
		it('returns correct value when href provided when sidebarItemGetHref called', async () => {
			sidebarItem.root.href = '/dashboard';
			await sidebarItem.waitForChanges();

			await expect(sidebarItem.rootInstance.sidebarItemGetHref()).resolves.toBe('/dashboard');
		});

		it('returns empty string when href set to null when sidebarItemGetHref called', async () => {
			sidebarItem.root.href = null;
			await sidebarItem.waitForChanges();

			await expect(sidebarItem.rootInstance.sidebarItemGetHref()).resolves.toBe('');
		});
	});
});

