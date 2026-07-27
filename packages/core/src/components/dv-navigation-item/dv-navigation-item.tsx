import { Component, Host, h, Prop, Element, Watch, Event, Method } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';
import { NAVIGATION_ITEM_CLICK_EVENT } from '../../events';

/**
 * ## Overview
 * The Navigation Item component provides a styled interactive element for navigation menus. It supports multiple states
 * (default, hover, active, focus, disabled), optional start icons, and size variants.
 *
 * Unlike slotted navigation components, this component manages the link and routing intent internally,
 * emitting a `navigationItemClick` event that the parent framework handles for routing.
 *
 * The `<dv-navigation-item>` component supports:
 * - **Interactive States**: Default, hover, active (selected), focus, and disabled
 * - **Start Icon**: Optional icon slot for visual enhancement
 * - **Size Variants**: Medium and small sizes for different contexts
 * - **Accessible**: Proper focus management and keyboard support
 * - **Framework Routing**: Emits click events for framework-managed navigation
 *
 * ## Accessibility
 * - Renders a semantic anchor element with proper href
 * - Uses `aria-current="page"` when active
 * - Supports keyboard focus and navigation
 * - Visible focus ring for keyboard users
 * - Disabled state prevents interaction
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Navigation Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/navigation/)
 * - [WAI-ARIA Link Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/)
 * - [dv-navigation](/docs/components-navigation--docs)
 * - [dv-navigation-section](/docs/components-navigation-section--docs)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * ## Dependencies
 * | Component  | Purpose                               |
 * |------------|---------------------------------------|
 * | `<dv-icon>` | Optional icon in the startIcon slot   |
 *
 * @summary An interactive navigation item with states, icons, and size variants for navigation menus.
 *
 * @tag dv-navigation-item
 * @event navigationItemClick - Fired on click without modifier keys. Read `href` from `event.target`.
 *
 * @slot - The navigation item label text.
 * @slot startIcon - Optional icon displayed at the start of the item. Icon size is controlled by the navigation item's `size` prop; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 */
@Component({
	tag: 'dv-navigation-item',
	styleUrl: 'dv-navigation-item.scss',
	shadow: true
})
export class DvNavigationItem {
	private itemElement?: HTMLElement;

	/** @internal */
	@Element() host!: HTMLElement;

	/** The navigation target URL emitted and used by the internal anchor element. */
	@Prop({ reflect: true }) href: string = '';

	/** Marks the navigation item as active/selected. Applies distinct styling to indicate current page or section. */
	@Prop({ reflect: true }) active: boolean = false;

	/** Disables the navigation item, preventing user interaction and applying disabled styling. */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Controls the size of the navigation item. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** Optional supporting text displayed below the main label. Uses subtle styling for secondary information. */
	@Prop({ reflect: true }) supportingText?: string;

	/** Emitted when the item is clicked and the consumer should navigate; read `href` from `event.target`. */
	@Event({ eventName: NAVIGATION_ITEM_CLICK_EVENT, bubbles: true, composed: true })
	navigationItemClick: EventEmitter<void>;

	/** Sets focus on the navigation item for keyboard navigation. */
	@Method()
	async setFocus(options?: FocusOptions) {
		if (this.itemElement) {
			this.itemElement.focus(options);
		}
	}

	/** Returns the item's href value used in selection events. */
	@Method()
	async navigationItemGetHref() {
		return this.href;
	}

	/** @private */
	componentDidLoad() {
		this.syncIcons();
	}

	/** @private */
	@Watch('size')
	sizeChanged() {
		this.syncIcons();
	}

	/** Propagates the correct icon size to every slotted dv-icon element in the startIcon slot. */
	private syncIcons() {
		const icons = this.host.querySelectorAll<HTMLDvIconElement>('[slot="startIcon"] dv-icon, dv-icon[slot="startIcon"]');
		const iconSize: HTMLDvIconElement['size'] = this.size === 'sm' ? 'xs' : 'sm';
		icons.forEach((icon) => {
			icon.size = iconSize;
		});
	}

	/** Handles click behavior and emits item selection intent for the parent navigation. */
	private handleClick = (event: MouseEvent) => {
		if (this.disabled) {
			event.preventDefault();
			return;
		}

		// Allow modifier clicks to open in new tab/window
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		event.preventDefault();
		this[NAVIGATION_ITEM_CLICK_EVENT].emit();
	};

	handleKeyDown = (event: KeyboardEvent) => {
		if (this.disabled) {
			return;
		}

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this[NAVIGATION_ITEM_CLICK_EVENT].emit();
		}
	};

	/** @private */
	render() {
		// Check if startIcon slot is filled
		const startIconEl = this.host.querySelector('[slot="startIcon"]');
		const hasStartIcon = !!startIconEl;

		// Base classes for layout and typography
		const baseClasses =
			'flex content-start gap-2 w-full mb-1 rounded-radius-md transition-colors focus:outline-width-lg focus:outline-offset-0 focus-visible:outline focus-visible:outline-width-lg focus-visible:outline-focus-ring-default focus:ring-focus-ring-default';

		// Size-specific classes (padding and text size)
		const sizeClasses = this.size === 'sm' ? 'px-4 py-2 body-sm' : 'px-4 py-3 body-default';

		// State-based classes
		let stateClasses = '';
		if (this.disabled) {
			stateClasses = 'text-disabled cursor-not-allowed';
		} else if (this.active) {
			stateClasses = 'cursor-pointer bg-default-active hover:bg-default-active';
		} else {
			stateClasses = 'cursor-pointer hover:bg-default-hover';
		}

		const anchorHref = this.disabled ? undefined : this.href;

		return (
			<Host>
				<div
					role="link"
					class={`${baseClasses} ${sizeClasses} ${stateClasses}`}
					tabIndex={this.disabled ? -1 : 0}
					ref={(el) => (this.itemElement = el as HTMLElement)}
					onKeyDown={this.handleKeyDown}
				>
					<a
						part="base"
						href={anchorHref}
						aria-current={this.active ? 'page' : undefined}
						aria-disabled={this.disabled ? 'true' : undefined}
						tabIndex={-1}
						onClick={this.handleClick}
						class="contents no-underline"
					>
						{hasStartIcon && (
							<span class={`flex pt-1 ${this.disabled ? 'text-disabled' : 'text-subtle'}`}>
								<slot name="startIcon"></slot>
							</span>
						)}
						<span class={`flex flex-col ${this.disabled ? 'text-disabled' : 'text-default'}`}>
							<span class="line-clamp-1">
								<slot></slot>
							</span>
							{this.supportingText && (
								<span class={`body-xs line-clamp-2 ${this.disabled ? 'text-disabled' : 'text-subtle'}`}>
									{this.supportingText}
								</span>
							)}
						</span>
					</a>
				</div>
			</Host>
		);
	}
}

