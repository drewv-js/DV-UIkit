import { Component, Event, Host, Method, Prop, h } from '@stencil/core';
import type { IconName } from '../../icon-name.generated';
import type { EventEmitter } from '@stencil/core';
import { SIDEBAR_ITEM_CLICK_EVENT } from '../../events';

/**
 * ## Overview
 * The Sidebar Item component is a compact navigation cell used inside `<dv-sidebar>`.
 * It renders an icon and label and emits selection intent while leaving routing behavior
 * to the parent framework.
 *
 * The active state is controlled by the parent through the `active` prop.
 * Modifier-key clicks (Ctrl/Cmd/Shift/Alt) are preserved so users can open links in a new tab/window.
 *
 * ## Accessibility
 * - Renders a semantic anchor element.
 * - Uses `aria-current="page"` when active.
 * - Participates in roving focus with controlled `tabIndex` from `<dv-sidebar>`.
 * - Keeps link semantics while supporting framework-managed navigation.
 *
 * ## Dependencies
 * | Component  | Purpose                              |
 * |------------|--------------------------------------|
 * | `<dv-icon>` | Renders the icon above the label     |
 *
 * ## Resources
 * - [WAI-ARIA Current Page](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)
 * - [Keyboard Navigable Widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
 *
 * @summary Navigation cell for sidebar with semantic link, icon and label.
 * @tag dv-sidebar-item
 * @event sidebarItemClick - Fired on click without modifier keys. The event has no payload.
 * @slot - Label text displayed under the icon.
 */
@Component({
	tag: 'dv-sidebar-item',
	styleUrl: 'dv-sidebar-item.scss',
	shadow: true
})
export class DvSidebarItem {
	private itemElement?: HTMLElement;

	/** The navigation target URL emitted and used by the internal anchor element. */
	@Prop({ reflect: true }) href: string = '';
	/** Marks the item as active and sets `aria-current="page"` on the internal link. */
	@Prop({ reflect: true }) active: boolean = false;
	/** The Font Awesome icon name shown above the label text. */
	@Prop({ reflect: true }) icon?: IconName;
	/** @internal Controlled by the parent dv-sidebar. */
	@Prop({ reflect: true, mutable: true }) index: 0 | -1 = -1;

	/** Emitted when the item is clicked and the consumer should navigate; read `href` from `event.target`. */
	@Event({ eventName: SIDEBAR_ITEM_CLICK_EVENT, bubbles: true, composed: true }) sidebarItemClick: EventEmitter<void>;
	/** Sets focus on the sidebar item container for keyboard navigation. */
	@Method()
	async setFocus(options?: FocusOptions) {
		if (this.itemElement) {
			this.itemElement.focus(options);
		}
	}

	/** Returns the item's href value used in selection events. */
	@Method()
	async sidebarItemGetHref() {
		return this.href ?? '';
	}

	/** Handles click behavior and emits item selection intent for the parent sidebar. */
	private handleClick = (event: MouseEvent) => {
		// Allow modifier clicks to open in new tab/window
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		event.preventDefault();
		this[SIDEBAR_ITEM_CLICK_EVENT].emit();
	};

	/** @private */
	render() {
		const iconName = this.icon ?? 'location-dot';

		const baseClasses =
			'w-[76px] min-h-[68px] max-h-[84px] box-border px-1 py-3 rounded-radius-lg flex flex-col items-center justify-center gap-1 cursor-pointer focus:outline-width-lg focus:outline-offset-0 focus-visible:outline focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default';
		const activeClasses = this.active ? 'bg-default-active' : '';
		const contentColorClasses = this.active ? 'text-brand' : 'text-subtle';
		const hoverClasses = this.active ? 'hover:bg-default-active' : 'hover:bg-default-hover';

		return (
			<Host>
				<div
					class={`${baseClasses} ${activeClasses} ${hoverClasses}`}
					tabIndex={this.index}
					ref={(el) => (this.itemElement = el as HTMLElement)}
				>
					<a
						part="base"
						href={this.href ?? ''}
						aria-current={this.active ? 'page' : undefined}
						tabIndex={-1}
						onClick={this.handleClick}
						class="contents no-underline"
					>
						<div class="flex size-full flex-col items-center justify-center gap-1">
							<span class={`flex items-center justify-center shrink-0 ${contentColorClasses}`}>
								<dv-icon name={iconName} size="md"></dv-icon>
							</span>
							<span
								class={`body-xs text-center w-full leading-4 overflow-hidden text-ellipsis line-clamp-2 ${contentColorClasses}`}
							>
								<slot></slot>
							</span>
						</div>
					</a>
				</div>
			</Host>
		);
	}
}

