import { Component, Element, Host, h, Prop, Event, Method, State } from '@stencil/core';
import type { EventEmitter } from '@stencil/core';
import { BREADCRUMB_ITEM_CLICK_EVENT } from '../../events';

/**
 * ## Overview
 * The Breadcrumb Item component provides an individual step within a breadcrumb trail. It supports
 * default link, active (current page), and disabled states with proper semantic markup and accessibility.
 *
 * Unlike plain anchors, this component manages click intent internally by emitting a `breadcrumbItemClick`
 * event that the parent framework can handle for routing.
 *
 * The `<dv-breadcrumb-item>` component supports:
 * - **Interactive States**: Default, hover, active (current page), focus, and disabled
 * - **Accessible**: Uses `aria-current="page"` for the active item and `aria-disabled` for disabled items
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
 * - [WAI-ARIA Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
 * - [dv-breadcrumb](/docs/components-breadcrumb--docs)
 *
 * @summary An individual breadcrumb item with link, active, and disabled states for use within dv-breadcrumb.
 *
 * @tag dv-breadcrumb-item
 * @event breadcrumbItemClick - Fired on click without modifier keys. Read `href` from `event.target`.
 *
 * @slot - The breadcrumb item label text.
 */
@Component({
	tag: 'dv-breadcrumb-item',
	styleUrl: 'dv-breadcrumb-item.scss',
	shadow: true
})
export class DvBreadcrumbItem {
	private itemElement?: HTMLElement;

	/** @internal */
	@Element() host!: HTMLElement;

	/** @internal */
	@State() private isLastItem: boolean = false;

	/** The navigation target URL used by the internal anchor element. */
	@Prop({ reflect: true }) href: string = '';

	/** Marks the breadcrumb item as the current page. Applies distinct styling and sets `aria-current="page"`. */
	@Prop({ reflect: true }) active: boolean = false;

	/** Disables the breadcrumb item, preventing user interaction and applying disabled styling. */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Controls the size of the breadcrumb item. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** Emitted when the item is clicked and the consumer should navigate; read `href` from `event.target`. */
	@Event({ eventName: BREADCRUMB_ITEM_CLICK_EVENT, bubbles: true, composed: true })
	breadcrumbItemClick: EventEmitter<void>;

	/** @private */
	componentWillLoad() {
		const parent = this.host.parentElement;
		const lastSibling = parent?.querySelector('dv-breadcrumb-item:last-of-type');
		this.isLastItem = lastSibling === this.host;
	}

	/** Sets focus on the breadcrumb item for keyboard navigation. */
	@Method()
	async setFocus(options?: FocusOptions) {
		if (this.itemElement) {
			this.itemElement.focus(options);
		}
	}

	/** @private */
	private handleClick = (event: MouseEvent) => {
		if (this.disabled || this.active) {
			event.preventDefault();
			return;
		}

		// Allow modifier clicks to open in new tab/window
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		event.preventDefault();
		this[BREADCRUMB_ITEM_CLICK_EVENT].emit();
	};

	/** @private */
	handleKeyDown = (event: KeyboardEvent) => {
		if (this.disabled || this.active) {
			return;
		}

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this[BREADCRUMB_ITEM_CLICK_EVENT].emit();
		}
	};

	/** @private */
	render() {
		const anchorHref = this.disabled || this.active ? undefined : this.href;

		const isSm = this.size === 'sm';
		const sizeClasses = isSm
			? 'body-xs focus-visible:rounded-radius-rounded'
			: 'body-default focus-visible:rounded-radius-lg';
		const baseClasses = `${sizeClasses} text-nowrap px-2 py-1 no-underline focus-visible:outline focus-visible:outline-width-lg focus-visible:outline-focus-ring-default`;

		let stateClasses = '';
		if (this.disabled) {
			stateClasses = 'text-disabled cursor-not-allowed';
		} else if (this.active) {
			stateClasses = 'text-default cursor-default';
		} else {
			stateClasses = `text-brand cursor-pointer hover:text-brand hover:bg-brand-hover ${isSm ? 'hover:rounded-radius-rounded' : 'hover:rounded-radius-lg'}`;
		}

		return (
			<Host>
				<div class="flex items-center">
					<div
						role="link"
						class={`${baseClasses} ${stateClasses}`}
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
							class={`contents no-underline`}
						>
							<span
								class={`${this.disabled ? 'text-disabled' : this.active ? 'text-default' : 'text-brand'} ${!this.active ? 'block max-w-[24ch] truncate' : ''}`}
							>
								<slot></slot>
							</span>
						</a>
					</div>
					{!this.isLastItem && !this.active && (
						<dv-icon class="px-2 text-subtle" name="chevron-right" size="xs" aria-hidden="true"></dv-icon>
					)}
				</div>
			</Host>
		);
	}
}

