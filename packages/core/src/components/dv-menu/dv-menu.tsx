import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, h, Method } from '@stencil/core';
import type { DvMenuItem } from '../dv-menu-item/dv-menu-item';
import { MENU_SELECT_EVENT } from '../../events';
import type { MenuSelectEventDetail } from '../../events';

/**
 * ## Overview
 * The Menu component provides a list of selectable options with keyboard navigation support. It manages focus states,
 * keyboard interactions, and selection events for menu items.
 *
 * The component implements robust keyboard navigation and focus management while providing a flexible container for
 * menu items with proper ARIA roles and attributes.
 *
 * Each menu instance maintains its own selection state and keyboard navigation loop, ensuring proper
 * interaction within nested menu structures.
 *
 * The `<dv-menu>` component supports these interaction patterns:
 * - **Arrow Navigation**: Up/Down keys move between items
 * - **Home/End Keys**: Jump to first/last items
 * - **Selection**: Enter/Space to select items
 * - **Focus Management**: Maintains active item state
 * - **Circular Navigation**: Loops through items
 *
 * ## Accessibility
 * - Uses `role="menu"` for container
 * - Keyboard navigation support
 * - Proper focus management
 * - ARIA attributes for active states
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
 *
 * ## Dependencies
 * | Component        | Purpose                                      |
 * |------------------|----------------------------------------------|
 * | `<dv-menu-item>`  | Individual selectable items within the menu  |
 *
 * @summary A keyboard-navigable menu container for `<dv-menu-item>` elements with ARIA roles and focus management.
 *
 * @tag dv-menu
 *
 * @slot - Container for `<dv-menu-item>` elements.
 */
@Component({
	tag: 'dv-menu',
	styleUrl: 'dv-menu.scss',
	shadow: true
})
export class DvMenu {
	private menu: HTMLSlotElement;
	private menuItems: DvMenuItem[];
	private activeItem: DvMenuItem;
	/** @internal */
	@Element() host!: HTMLDvMenuElement;

	/** Emitted when a menu item is selected */
	@Event({ eventName: MENU_SELECT_EVENT }) menuSelect!: EventEmitter<MenuSelectEventDetail>;

	/* istanbul ignore next */
	private handleClick = (event: MouseEvent) => {
		const composedPath = event.composedPath();
		const target = composedPath.find((el: Element) => el?.getAttribute?.('role') === 'menuitem');

		if (!target) return;

		(target as HTMLElement).blur();
		this[MENU_SELECT_EVENT].emit({ item: target as unknown as DvMenuItem });
	};

	/* istanbul ignore next */
	private handleMouseDown = (event: MouseEvent) => {
		const target = event.target as HTMLElement;

		if (this.isMenuItem(target)) void this.menuSetCurrentItem(target as unknown as DvMenuItem);
	};

	/* istanbul ignore next */
	private handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopPropagation();

			if (this.activeItem.index === 0)
				(this.activeItem as unknown as HTMLElement).shadowRoot.querySelector<HTMLElement>('[role="menuitem"]').click();
		} else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
			let index = this.activeItem ? this.menuItems.indexOf(this.activeItem) : 0;

			if (this.menuItems.length > 0) {
				event.preventDefault();
				event.stopPropagation();

				if (event.key === 'ArrowDown') {
					index++;
				} else if (event.key === 'ArrowUp') {
					index--;
				} else if (event.key === 'Home') {
					index = 0;
				} else if (event.key === 'End') {
					index = this.menuItems.length - 1;
				}

				if (index < 0) {
					index = this.menuItems.length - 1;
				}
				if (index > this.menuItems.length - 1) {
					index = 0;
				}

				void this.menuSetCurrentItem(this.menuItems[index]);
				void this.menuItems[index].setFocus();
			}
		}
	};

	/** @private */
	async handleSlotChange() {
		const items = await this.menuGetMenuItems();
		this.menuItems = await this.menuGetMenuItems();

		if (items.length > 0) void this.menuSetCurrentItem(items[0]);
	}

	/** @private */
	isMenuItem(item: HTMLElement) {
		return item.tagName.toLowerCase() === 'dv-menu-item';
	}

	/** @private */
	async getCurrentItem() {
		return (await this.menuGetMenuItems()).find((i) => i.index === 0);
	}

	/** Sets the active (currently focused) menu item and updates tabIndex on all items accordingly. */
	@Method()
	async menuSetCurrentItem(item: DvMenuItem) {
		this.activeItem = item;
		const items = await this.menuGetMenuItems();

		items.forEach((i) => {
			i.index = i === item ? 0 : -1;
		});
	}

	/** Returns an array of all active (non-inert) `<dv-menu-item>` elements slotted into this menu. */
	@Method()
	async menuGetMenuItems() {
		const assignedElements = this.menu?.assignedElements?.({ flatten: true }) ?? [];
		return [...assignedElements].filter((el: HTMLElement) => {
			if (el.inert || !this.isMenuItem(el)) {
				return false;
			}
			return true;
		}) as unknown as DvMenuItem[];
	}

	/** @private */
	render() {
		return (
			<div
				role="menu"
				tabIndex={-1}
				onClick={this.handleClick}
				onMouseDown={this.handleMouseDown}
				onKeyDown={this.handleKeyDown}
				class="bg-default border-width-sm border-default rounded-radius-lg py-2"
			>
				<slot
					ref={(el) => (this.menu = el as HTMLSlotElement)}
					onSlotchange={() => void this.handleSlotChange()}
				></slot>
			</div>
		);
	}
}

