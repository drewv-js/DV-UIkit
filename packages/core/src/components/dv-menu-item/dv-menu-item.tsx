import { Component, Element, Prop, h, Host, Method } from '@stencil/core';

/**
 * ## Overview
 * The Menu Item component represents a single selectable action within an `<dv-menu>`. It manages its own
 * click and focus interactions and supports optional start and end icon slots.
 *
 * Menu items are typically used as direct children of `<dv-menu>`, which coordinates keyboard navigation
 * and selection events across all items.
 *
 * ## Accessibility
 * - Uses `role="menuitem"` for proper ARIA semantics
 * - Manages `tabIndex` to support roving focus within the parent menu
 * - Disabled items prevent interaction and are styled accordingly
 *
 * ## Resources
 * - [WAI-ARIA Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
 *
 * @summary A single selectable item within an `<dv-menu>`, with optional icon slots and disabled state.
 *
 * @tag dv-menu-item
 *
 * @slot - The label or content of the menu item.
 * @slot startIcon - Icon displayed at the start of the menu item. Icon size is fixed at `xs`; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 * @slot endIcon - Icon displayed at the end of the menu item. Icon size is fixed at `xs`; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 */
@Component({
	tag: 'dv-menu-item',
	styleUrl: 'dv-menu-item.scss',
	shadow: true
})
export class DvMenuItem {
	private item: HTMLElement;
	@Element() host!: HTMLDvMenuItemElement;

	/** The value emitted with the menu-select event when this item is selected. */
	@Prop() value = '';

	/** Optional URL. When set, the menu item renders as an anchor link. */
	@Prop({ reflect: true }) href: string;

	/** Disables the menu item, preventing clicks and focus. */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** @internal Roving tabIndex used by the parent `<dv-menu>` for keyboard navigation. */
	@Prop({ reflect: true }) index: 0 | -1 = -1;

	/* istanbul ignore next */
	connectedCallback() {
		this.host.addEventListener('click', this.handleHostClick);
		this.host.addEventListener('mouseover', this.handleMouseOver);
	}

	/* istanbul ignore next */
	disconnectedCallback() {
		this.host.removeEventListener('click', this.handleHostClick);
		this.host.removeEventListener('mouseover', this.handleMouseOver);
	}

	/** Programmatically focuses the menu item element. */
	@Method()
	async setFocus() {
		this.item.focus();
	}

	/* istanbul ignore next */
	private handleHostClick = (event: MouseEvent) => {
		if (this.disabled) {
			event.preventDefault();
			event.stopImmediatePropagation();
		}
	};

	/* istanbul ignore next */
	private handleMouseOver = (event: MouseEvent) => {
		this.host.focus();
		event.stopPropagation();
	};

	render() {
		const disabledClass = this.disabled
			? 'outline-none cursor-not-allowed text-disabled'
			: 'hover:bg-default-hover cursor-pointer focus:ring-0 focus-visible:outline focus-visible:ring-focus-ring-default focus:outline-width-lg focus:outline-focus-ring-default focus:outline-offset-0';

		// Check if endIcon slots are filled
		const startIconEl = this.host.querySelector('[slot="startIcon"]');
		const endIconEl = this.host.querySelector('[slot="endIcon"]');
		const hasStartIcon = !!startIconEl;
		const hasEndIcon = !!endIconEl;

		// Enforce xs size on slotted icons
		if (startIconEl?.tagName === 'DV-ICON') (startIconEl as HTMLDvIconElement).size = 'xs';
		if (endIconEl?.tagName === 'DV-ICON') (endIconEl as HTMLDvIconElement).size = 'xs';

		const Tag = this.href && !this.disabled ? 'a' : 'div';
		const linkProps = this.href && !this.disabled ? { href: this.href } : {};
		const textColorClass = this.disabled ? '' : 'text-default';

		return (
			<Host>
				<div
					ref={(el) => (this.item = el)}
					tabIndex={this.index}
					role="menuitem"
					aria-disabled={this.disabled ? 'true' : 'false'}
					class={`relative body-default px-4 py-1 ${disabledClass}`}
				>
					<Tag {...linkProps} class="contents">
						<div class={`flex items-center gap-2 ${textColorClass}`}>
							{/* Conditionally render Start Icon Slot */}
							{hasStartIcon && <slot name="startIcon"></slot>}
							<slot></slot>

							{/* Conditionally render End Icon Slot */}
							{hasEndIcon && (
								<div class="ml-auto">
									<slot name="endIcon"></slot>
								</div>
							)}
						</div>
					</Tag>
				</div>
			</Host>
		);
	}
}


