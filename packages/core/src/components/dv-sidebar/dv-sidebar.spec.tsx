import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { SIDEBAR_ITEM_CLICK_EVENT } from '../../events';
import { DvSidebar } from './dv-sidebar';
import { DvSidebarItem } from '../dv-sidebar-item/dv-sidebar-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

type SidebarItemRef = HTMLElement & {
	index: 0 | -1;
};

type SidebarInternals = {
	sidebarSetCurrentItem: (item: HTMLElement & DvSidebarItem) => Promise<void>;
};

type SidebarPrivateInternals = SidebarInternals & {
	handleKeyDown: (event: KeyboardEvent) => void;
	getSidebarItems: () => Array<HTMLElement & DvSidebarItem>;
	defaultSlot?: Partial<HTMLSlotElement>;
	footerSlot?: Partial<HTMLSlotElement>;
};

describe('dv-sidebar', () => {
	let sidebar: TypedSpecPage<DvSidebar>;

	// Initialize a new instance for DvSidebar
	beforeEach(async () => {
		sidebar = (await newSpecPage({
			components: [DvSidebar, DvSidebarItem],
			html: `
				<dv-sidebar>
					<dv-sidebar-item href="/home">Home</dv-sidebar-item>
					<dv-sidebar-item href="/reports">Reports</dv-sidebar-item>
					<dv-sidebar-item slot="footer" href="/settings">Settings</dv-sidebar-item>
				</dv-sidebar>
			`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvSidebar>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		sidebar = null;
	});

	describe('Initialization with default state', () => {
		it('renders sidebar with a nav landmark', async () => {
			const nav = sidebar.root?.shadowRoot?.querySelector('nav');
			expect(nav).toBeTruthy();
		});

		it('renders sidebar nav with correct classes', async () => {
			const nav = sidebar.root?.shadowRoot?.querySelector('nav');
			expect(nav).toHaveClasses([
				'flex',
				'flex-col',
				'h-full',
				'overflow-y-auto',
				'bg-default',
				'box-border',
				'py-3',
				'px-2',
				'w-fit'
			]);
		});

		it('renders with default aria-label', async () => {
			const nav = sidebar.root?.shadowRoot?.querySelector('nav');
			expect(nav?.getAttribute('aria-label')).toBe('Sidebar navigation');
		});

		it('initializes the first slotted item as focusable', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[0] as unknown as HTMLElement & DvSidebarItem
			);
			await sidebar.waitForChanges();
			expect(items?.[0].index).toBe(0);
			expect(items?.[1].index).toBe(-1);
			expect(items?.[2].index).toBe(-1);
		});
	});

	describe('Props', () => {
		it('sets aria-label from the label prop', async () => {
			sidebar.root.label = 'Main navigation';
			await sidebar.waitForChanges();

			const nav = sidebar.root?.shadowRoot?.querySelector('nav');
			expect(nav?.getAttribute('aria-label')).toBe('Main navigation');
		});
	});

	describe('Methods', () => {
		it('triggers syncSidebarItems when handleSlotChange runs', async () => {
			const syncSpy = jest.spyOn(
				sidebar.rootInstance as unknown as { syncSidebarItems: () => Promise<void> },
				'syncSidebarItems'
			);

			(sidebar.rootInstance as unknown as { handleSlotChange: () => void }).handleSlotChange();
			await sidebar.waitForChanges();

			expect(syncSpy).toHaveBeenCalled();
		});

		it('updates roving tabindex when sidebarSetCurrentItem is called', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[1] as unknown as HTMLElement & DvSidebarItem
			);

			expect(items?.[0].index).toBe(-1);
			expect(items?.[1].index).toBe(0);
		});

		it('updates current item when focus moves to another slotted item', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			(
				sidebar.rootInstance as unknown as {
					handleFocusIn: (event: FocusEvent) => void;
				}
			).handleFocusIn({ target: items?.[1] } as unknown as FocusEvent);
			await sidebar.waitForChanges();

			expect(items?.[0].index).toBe(-1);
			expect(items?.[1].index).toBe(0);
		});

		it('ignores focusin from elements not inside a sidebar item', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[0] as unknown as HTMLElement & DvSidebarItem
			);
			await sidebar.waitForChanges();

			const nav = sidebar.root?.shadowRoot?.querySelector('nav') as HTMLElement;
			(
				sidebar.rootInstance as unknown as {
					handleFocusIn: (event: FocusEvent) => void;
				}
			).handleFocusIn({ target: nav } as unknown as FocusEvent);
			await sidebar.waitForChanges();

			expect(items?.[0].index).toBe(0);
		});

		it('ignores navigation keys when getSidebarItems returns no items', async () => {
			jest
				.spyOn(sidebar.rootInstance as unknown as { getSidebarItems: () => unknown[] }, 'getSidebarItems')
				.mockReturnValue([]);

			const nav = sidebar.root?.shadowRoot?.querySelector('nav') as HTMLElement;
			expect(() => {
				nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
			}).not.toThrow();
		});

		it('returns early when current item does not belong to this sidebar', () => {
			const preventDefault = jest.fn();
			const fakeExternalItem = {
				closest: () => null
			};

			(
				sidebar.rootInstance as unknown as {
					handleKeyDown: (event: KeyboardEvent) => void;
				}
			).handleKeyDown({
				key: 'ArrowDown',
				target: {
					closest: () => fakeExternalItem
				},
				composedPath: () => [],
				preventDefault,
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent);

			expect(preventDefault).not.toHaveBeenCalled();
		});

		it('returns early when current item is not in getSidebarItems result', () => {
			const preventDefault = jest.fn();
			const inHostButNotSlotted = {
				closest: (selector: string) => (selector === 'dv-sidebar' ? sidebar.root : null)
			};

			(
				sidebar.rootInstance as unknown as {
					handleKeyDown: (event: KeyboardEvent) => void;
				}
			).handleKeyDown({
				key: 'ArrowDown',
				target: {
					closest: () => inHostButNotSlotted
				},
				composedPath: () => [],
				preventDefault,
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent);

			expect(preventDefault).not.toHaveBeenCalled();
		});

		it('ignores non-navigation keys', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item') as unknown as SidebarItemRef[];
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[0] as unknown as HTMLElement & DvSidebarItem
			);
			await sidebar.waitForChanges();

			const nav = sidebar.root?.shadowRoot?.querySelector('nav') as HTMLElement;

			nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, composed: true }));
			await sidebar.waitForChanges();

			expect(items[0].index).toBe(0);
			expect(items[1].index).toBe(-1);
		});

		it('moves focus with ArrowDown and updates roving tabindex', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item') as unknown as SidebarItemRef[];
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[0] as unknown as HTMLElement & DvSidebarItem
			);
			await sidebar.waitForChanges();

			const nav = sidebar.root?.shadowRoot?.querySelector('nav') as HTMLElement;

			nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
			await sidebar.waitForChanges();

			expect(items[0].index).toBe(-1);
			expect(items[1].index).toBe(0);
		});

		it('moves focus with ArrowUp and updates roving tabindex', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[1] as unknown as HTMLElement & DvSidebarItem
			);

			const nav = sidebar.root?.shadowRoot?.querySelector('nav') as HTMLElement;
			nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true }));
			await sidebar.waitForChanges();

			expect(items?.[0].index).toBe(0);
			expect(items?.[1].index).toBe(-1);
		});

		it('supports Home and End key navigation', async () => {
			const nav = sidebar.root?.shadowRoot?.querySelector('nav') as HTMLElement;
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[1] as unknown as HTMLElement & DvSidebarItem
			);

			nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, composed: true }));
			await sidebar.waitForChanges();
			expect(items?.[0].index).toBe(0);

			nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, composed: true }));
			await sidebar.waitForChanges();
			expect(items?.[2].index).toBe(0);
		});

		it('selects current item when Enter is pressed', async () => {
			const nav = sidebar.root?.shadowRoot?.querySelector('nav') as HTMLElement;
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			const itemClickSpy = jest.fn();
			sidebar.root?.addEventListener(SIDEBAR_ITEM_CLICK_EVENT, itemClickSpy);

			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[1] as unknown as HTMLElement & DvSidebarItem
			);
			nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
			await sidebar.waitForChanges();

			expect(itemClickSpy).toHaveBeenCalled();
			expect(itemClickSpy.mock.calls[0][0].detail).toBeUndefined();
		});

		it('selects current item when Space is pressed', async () => {
			const nav = sidebar.root?.shadowRoot?.querySelector('nav') as HTMLElement;
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			const itemClickSpy = jest.fn();
			sidebar.root?.addEventListener(SIDEBAR_ITEM_CLICK_EVENT, itemClickSpy);

			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[2] as unknown as HTMLElement & DvSidebarItem
			);
			nav.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true }));
			await sidebar.waitForChanges();

			expect(itemClickSpy).toHaveBeenCalled();
			expect(itemClickSpy.mock.calls[0][0].detail).toBeUndefined();
		});

		it('removes the itemClick event listener on disconnectedCallback', () => {
			const removeSpy = jest.spyOn(sidebar.root, 'removeEventListener');
			sidebar.rootInstance.disconnectedCallback();
			expect(removeSpy).toHaveBeenCalledWith(SIDEBAR_ITEM_CLICK_EVENT, expect.any(Function));
		});

		it('does not set roving focus when there are no sidebar items to sync', async () => {
			jest
				.spyOn(sidebar.rootInstance as unknown as { getSidebarItems: () => [] }, 'getSidebarItems')
				.mockReturnValue([]);
			const sidebarSetCurrentItemSpy = jest.spyOn(
				sidebar.rootInstance as unknown as SidebarInternals,
				'sidebarSetCurrentItem'
			);

			await (sidebar.rootInstance as unknown as { syncSidebarItems: () => Promise<void> }).syncSidebarItems();

			expect(sidebarSetCurrentItemSpy).not.toHaveBeenCalled();
		});
		it('returns an empty array when slot refs are not initialized', () => {
			const instance = sidebar.rootInstance as unknown as SidebarPrivateInternals;
			instance.defaultSlot = undefined;
			instance.footerSlot = undefined;

			expect(instance.getSidebarItems()).toEqual([]);
		});

		it('safely handles composedPath entries without tagName or toLowerCase', () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item') as unknown as SidebarItemRef[];
			items.forEach((item) => {
				item.index = -1;
			});

			const preventDefault = jest.fn();
			(sidebar.rootInstance as unknown as SidebarPrivateInternals).handleKeyDown({
				key: 'ArrowDown',
				target: { closest: () => null },
				composedPath: () => [undefined, { tagName: undefined }, { tagName: { toLowerCase: undefined } }],
				preventDefault,
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent);

			expect(preventDefault).not.toHaveBeenCalled();
		});

		it('handles Enter selection when current item has no shadowRoot', () => {
			const fakeCurrentItem = {
				index: 0,
				active: false,
				setFocus: jest.fn().mockResolvedValue(undefined),
				closest: (selector: string) => (selector === 'dv-sidebar' ? sidebar.root : null),
				shadowRoot: undefined
			} as unknown as HTMLElement & DvSidebarItem;

			jest
				.spyOn(
					sidebar.rootInstance as unknown as { getSidebarItems: () => Array<HTMLElement & DvSidebarItem> },
					'getSidebarItems'
				)
				.mockReturnValue([fakeCurrentItem]);

			expect(() => {
				(sidebar.rootInstance as unknown as SidebarPrivateInternals).handleKeyDown({
					key: 'Enter',
					target: { closest: () => fakeCurrentItem },
					composedPath: () => [],
					preventDefault: jest.fn(),
					stopPropagation: jest.fn()
				} as unknown as KeyboardEvent);
			}).not.toThrow();
		});
	});

	describe('Events', () => {
		it('updates roving tabindex when a child sidebar item emits sidebarItemClick', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			items?.[1].dispatchEvent(
				new CustomEvent(SIDEBAR_ITEM_CLICK_EVENT, {
					bubbles: true,
					composed: true
				})
			);

			await sidebar.waitForChanges();

			expect(items?.[0].index).toBe(-1);
			expect(items?.[1].index).toBe(0);
		});

		it('does not change roving tabindex when handleItemClick receives an event without target', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[0] as unknown as HTMLElement & DvSidebarItem
			);
			await sidebar.waitForChanges();

			(
				sidebar.rootInstance as unknown as {
					handleItemClick: (event: Event) => void;
				}
			).handleItemClick({ target: undefined } as unknown as Event);
			await sidebar.waitForChanges();

			expect(items?.[0].index).toBe(0);
			expect(items?.[1].index).toBe(-1);
		});

		it('does not change roving tabindex when the event origin is not inside a sidebar item', async () => {
			const items = sidebar.root?.querySelectorAll('dv-sidebar-item');
			await (sidebar.rootInstance as unknown as SidebarInternals).sidebarSetCurrentItem(
				items?.[0] as unknown as HTMLElement & DvSidebarItem
			);
			await sidebar.waitForChanges();

			sidebar.root.dispatchEvent(
				new CustomEvent(SIDEBAR_ITEM_CLICK_EVENT, {
					bubbles: true,
					composed: true
				})
			);
			await sidebar.waitForChanges();

			expect(items?.[0].index).toBe(0);
			expect(items?.[1].index).toBe(-1);
		});
	});
});

