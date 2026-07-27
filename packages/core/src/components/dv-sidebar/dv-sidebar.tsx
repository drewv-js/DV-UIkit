import { Component, Element, Host, Prop, h } from '@stencil/core';
import { SIDEBAR_ITEM_CLICK_EVENT } from '../../events';

type SidebarItemElement = HTMLElement & {
	index: 0 | -1;
	active: boolean;
	setFocus(options?: FocusOptions): Promise<void>;
};

/**
 * ## Overview
 * The Sidebar component provides a compact vertical navigation rail for grouped application links.
 * It coordinates keyboard navigation and roving focus across child `<dv-sidebar-item>` elements while
 * keeping active state controlled by the consuming framework.
 *
 * Use the default slot for primary navigation and the `footer` slot for secondary actions.
 * Child `<dv-sidebar-item>` elements emit navigation events while the sidebar manages roving focus.
 *
 * ## Accessibility
 * - Uses a semantic `nav` landmark with an accessible label.
 * - Supports roving `tabIndex` for keyboard-only users.
 * - Supports Arrow Up/Down, Home, End, Enter and Space keyboard interactions.
 * - Keeps focus behavior predictable when items are added via slots.
 *
 * ## Resources
 * - [WAI-ARIA Navigation Landmark](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html)
 * - [Keyboard Accessibility Fundamentals](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
 *
 * @summary Vertical navigation rail with keyboard navigation and focus management.
 * @tag dv-sidebar
 * @slot - Main navigation content, typically `<dv-sidebar-item>` elements.
 * @slot footer - Footer navigation/actions.
 */
@Component({
	tag: 'dv-sidebar',
	styleUrl: 'dv-sidebar.scss',
	shadow: true
})
export class DvSidebar {
	@Element() host!: HTMLDvSidebarElement;

	/** Accessible label applied to the internal navigation landmark. */
	@Prop({ reflect: true }) label: string = 'Sidebar navigation';

	private defaultSlot?: HTMLSlotElement;
	private footerSlot?: HTMLSlotElement;

	/** Synchronizes roving focus state when slot content changes. */
	private handleSlotChange = () => {
		void this.syncSidebarItems();
	};

	/** Handles item click events from child sidebar items and updates roving focus. */
	private handleItemClick = (event: Event) => {
		const item = (event.target as HTMLElement)?.closest('dv-sidebar-item') as unknown as SidebarItemElement | null;

		if (item?.closest('dv-sidebar') !== this.host) {
			return;
		}

		void this.sidebarSetCurrentItem(item);
	};

	/** Updates the current roving-focus item when a sidebar item receives focus. */
	private handleFocusIn = (event: FocusEvent) => {
		const target = event.target as HTMLElement;
		const item = target.closest('dv-sidebar-item') as unknown as SidebarItemElement | null;

		if (item?.closest('dv-sidebar') !== this.host) {
			return;
		}

		void this.sidebarSetCurrentItem(item);
	};

	/** Handles keyboard navigation and activation for sidebar items. */
	private handleKeyDown = (event: KeyboardEvent) => {
		const isSelectionKey = event.key === 'Enter' || event.key === ' ';
		const isNavigationKey = ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key);

		if (!isSelectionKey && !isNavigationKey) {
			return;
		}

		const items = this.getSidebarItems();
		if (items.length === 0) {
			return;
		}

		const target = event.target as HTMLElement;
		const targetedItem =
			(target.closest('dv-sidebar-item') as unknown as SidebarItemElement | null) ||
			(event
				.composedPath()
				.find((el) => (el as HTMLElement)?.tagName?.toLowerCase?.() === 'dv-sidebar-item') as unknown as
				SidebarItemElement | undefined) ||
			null;

		const currentItem = targetedItem ?? items.find((item) => item.index === 0) ?? null;

		if (currentItem?.closest('dv-sidebar') !== this.host) {
			return;
		}

		if (isSelectionKey) {
			event.preventDefault();
			event.stopPropagation();

			const actionTarget = currentItem.shadowRoot?.querySelector('[part="base"]') as HTMLElement | null;
			actionTarget?.click();
			return;
		}

		let index = items.indexOf(currentItem);

		if (index === -1) {
			return;
		}

		if (event.key === 'Home') {
			index = 0;
		} else if (event.key === 'End') {
			index = items.length - 1;
		} else if (event.key === 'ArrowUp') {
			index = (index - 1 + items.length) % items.length;
		} else if (event.key === 'ArrowDown') {
			index = (index + 1) % items.length;
		}

		void this.sidebarSetCurrentItem(items[index]);
		void items[index].setFocus({ preventScroll: true });
		event.preventDefault();
	};

	/** Initializes sidebar focus state and subscribes to child item click events. */
	componentDidLoad() {
		void this.syncSidebarItems();
		this.host.addEventListener(SIDEBAR_ITEM_CLICK_EVENT, this.handleItemClick);
	}

	/** Removes event listeners when the component is disconnected. */
	disconnectedCallback() {
		this.host.removeEventListener(SIDEBAR_ITEM_CLICK_EVENT, this.handleItemClick);
	}
	/** Sets the current keyboard-focusable sidebar item. */
	private async sidebarSetCurrentItem(item: SidebarItemElement) {
		const items = this.getSidebarItems();

		items.forEach((sidebarItem) => {
			sidebarItem.index = sidebarItem === item ? 0 : -1;
		});
	}

	/** Returns all direct child `<dv-sidebar-item>` elements from default and footer slots. */
	private getSidebarItems(): SidebarItemElement[] {
		const defaultItems = this.defaultSlot?.assignedElements?.({ flatten: true }) ?? [];
		const footerItems = this.footerSlot?.assignedElements?.({ flatten: true }) ?? [];

		return [...defaultItems, ...footerItems].filter(
			(el) => el.tagName.toLowerCase() === 'dv-sidebar-item'
		) as SidebarItemElement[];
	}

	/** Ensures exactly one item is keyboard-focusable after slot initialization/updates. */
	private async syncSidebarItems() {
		const items = this.getSidebarItems();

		if (items.length === 0) {
			return;
		}

		// Initialize the first item as the current focusable item (roving focus)
		const currentItem = items.find((item) => item.index === 0) ?? items[0];
		await this.sidebarSetCurrentItem(currentItem);
	}

	/** @private */
	render() {
		return (
			<Host>
				<nav
					aria-label={this.label}
					onFocusin={this.handleFocusIn}
					onKeyDown={this.handleKeyDown}
					class="flex flex-col h-full overflow-y-auto bg-default box-border py-3 px-2 w-fit"
				>
					<div class="flex-1 flex flex-col">
						<slot ref={(el) => (this.defaultSlot = el as HTMLSlotElement)} onSlotchange={this.handleSlotChange}></slot>
					</div>
					<div class="bottom-0 flex flex-col">
						<slot
							name="footer"
							ref={(el) => (this.footerSlot = el as HTMLSlotElement)}
							onSlotchange={this.handleSlotChange}
						></slot>
					</div>
				</nav>
			</Host>
		);
	}
}

