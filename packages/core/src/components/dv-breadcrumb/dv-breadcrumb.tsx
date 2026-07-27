import { Component, Element, Host, Prop, Watch, State, h } from '@stencil/core';
import { BREADCRUMB_ITEM_CLICK_EVENT } from '../../events';

/**
 * ## Overview
 * The Breadcrumb component provides a horizontal trail of navigational links that helps users understand
 * their current location within a site hierarchy. It wraps one or more `<dv-breadcrumb-item>` elements
 * and automatically manages responsive collapse behavior when available space is limited.
 *
 * The breadcrumb uses a semantic `<nav>` element with proper ARIA labeling to ensure accessibility for
 * assistive technologies. When items overflow, middle items collapse into a dropdown menu that remains
 * keyboard-accessible.
 *
 * The `<dv-breadcrumb>` component typically contains:
 * - **Breadcrumb Items**: Individual navigation links (`<dv-breadcrumb-item>`)
 * - **Active Item**: The last item representing the current page (non-interactive)
 *
 * ## Accessibility
 * - Uses semantic `<nav>` element with `aria-label` for screen readers
 * - Collapsed items are accessible via a dropdown with `role="menu"`
 * - Supports keyboard navigation through slotted items
 * - Provides customizable accessible label via the `label` prop
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Breadcrumb Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
 * - [dv-breadcrumb-item](/docs/components-breadcrumb-breadcrumb-item--docs)
 *
 * ## Dependencies
 * | Component              | Purpose                                    |
 * |------------------------|--------------------------------------------|
 * | `<dv-breadcrumb-item>`  | Individual breadcrumb navigation links     |
 * | `<dv-icon-button>`      | Collapse trigger for hidden items          |
 * | `<dv-icon>`             | Chevron separator between items            |
 *
 * @summary A horizontal breadcrumb trail with responsive collapse and accessible navigation landmark.
 *
 * @tag dv-breadcrumb
 *
 * @slot - The breadcrumb content, typically containing breadcrumb items.
 */
@Component({
	tag: 'dv-breadcrumb',
	styleUrl: 'dv-breadcrumb.scss',
	shadow: true
})
export class DvBreadcrumb {
	/** @internal */
	@Element() host!: HTMLElement;

	/** Accessible label applied to the internal navigation landmark. Defaults to `'Breadcrumb'`. */
	@Prop({ reflect: true }) label: string = 'Breadcrumb';

	/** Controls the size of the breadcrumb items. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** @internal */
	@State() private isCollapsed: boolean = false;

	/** @internal */
	@State() private collapsedItems: Array<{
		href: string;
		label: string;
		disabled: boolean;
		element: HTMLDvBreadcrumbItemElement;
	}> = [];

	private navEl?: HTMLElement;
	private resizeObserver?: ResizeObserver;
	private itemWidths: number[] = [];

	/** @private */
	componentDidLoad() {
		this.syncItems();
		this.measureItemWidths();
		this.setupResizeObserver();
	}

	/** @private */
	disconnectedCallback() {
		this.resizeObserver?.disconnect();
	}

	/** @private */
	@Watch('size')
	sizeChanged() {
		this.syncItems();
		// Wait for children to re-render with new size before re-measuring
		requestAnimationFrame(() => {
			this.measureItemWidths();
			this.calculateCollapse();
		});
	}

	/** Propagates the size prop to all child breadcrumb items. */
	private syncItems() {
		const items = this.host.querySelectorAll<HTMLDvBreadcrumbItemElement>('dv-breadcrumb-item');
		items.forEach((item) => {
			item.size = this.size;
		});
	}

	/** Captures each item's rendered width once so collapse checks don't require DOM reflow. */
	private measureItemWidths() {
		const items = Array.from(this.host.querySelectorAll<HTMLDvBreadcrumbItemElement>('dv-breadcrumb-item'));
		this.itemWidths = items.map((item) => item.offsetWidth);
	}

	private setupResizeObserver() {
		this.resizeObserver = new ResizeObserver(() => {
			this.calculateCollapse();
		});
		this.resizeObserver.observe(this.host);
	}

	private calculateCollapse() {
		const items = Array.from(this.host.querySelectorAll<HTMLDvBreadcrumbItemElement>('dv-breadcrumb-item'));
		const middleItems = items.slice(1, items.length - 1);

		if (!this.navEl || middleItems.length < 2) {
			this.restoreAllItems(items);
			return;
		}

		// Re-measure if widths were captured while hidden (e.g. inside a tab panel or slot="collapse-hidden")
		const totalWidth = this.itemWidths.reduce((sum, w) => sum + w, 0);
		const hasHiddenItems = this.itemWidths.length > 0 && this.itemWidths.some((w) => w === 0);
		if ((totalWidth === 0 || hasHiddenItems) && items.length > 0) {
			// Restore items first so they can be measured at their true width
			if (hasHiddenItems && this.isCollapsed) {
				this.restoreAllItems(items);
				requestAnimationFrame(() => {
					this.measureItemWidths();
					this.calculateCollapse();
				});
				return;
			}
			this.measureItemWidths();
		}

		const availableWidth =
			this.host.parentElement?.getBoundingClientRect().width ??
			this.navEl?.offsetWidth ??
			document.documentElement.clientWidth;

		// Estimate the width of the ellipsis trigger (icon-button + chevron separator)
		const ellipsisWidth = 48;

		// Progressive collapse: hide middle items one at a time until it fits.
		// Start from the center of the middle items and expand outward.
		const middleIndices = middleItems.map((_, i) => i + 1); // indices in the full items array
		// Sort by distance from center (innermost first)
		const center = (middleIndices.length - 1) / 2;
		const sortedMiddleIndices = [...middleIndices].sort((a, b) => Math.abs(a - 1 - center) - Math.abs(b - 1 - center));

		let currentWidth = this.itemWidths.reduce((sum, w) => sum + w, 0);
		const hiddenIndices: Set<number> = new Set();

		for (const idx of sortedMiddleIndices) {
			if (currentWidth <= availableWidth) break;
			hiddenIndices.add(idx);
			// Subtract the hidden item's width; add ellipsis width only once
			currentWidth -= this.itemWidths[idx] ?? 0;
			if (hiddenIndices.size === 1) {
				currentWidth += ellipsisWidth;
			}
		}

		if (hiddenIndices.size === 0) {
			this.restoreAllItems(items);
			return;
		}

		// Apply slots: first and last always visible, hidden items get collapse-hidden
		items.forEach((item, i) => {
			if (i === 0) {
				item.slot = 'visible-start';
			} else if (i === items.length - 1) {
				item.slot = 'visible-end';
			} else if (hiddenIndices.has(i)) {
				item.slot = 'collapse-hidden';
			} else {
				item.slot = 'visible-middle';
			}
		});

		this.collapsedItems = items
			.filter((_, i) => hiddenIndices.has(i))
			.map((item) => ({
				href: item.href ?? '',
				label: item.textContent?.trim() ?? '',
				disabled: item.disabled ?? false,
				element: item
			}));
		this.isCollapsed = true;
	}

	private restoreAllItems(items: HTMLDvBreadcrumbItemElement[]) {
		items.forEach((item) => {
			item.slot = '';
		});
		this.isCollapsed = false;
		this.collapsedItems = [];
	}

	private handleCollapsedItemClick = (
		event: MouseEvent,
		item: { href: string; disabled: boolean; element: HTMLDvBreadcrumbItemElement }
	) => {
		// Disabled items should not navigate
		if (item.disabled) {
			event.preventDefault();
			return;
		}

		// Allow modifier clicks to open in new tab/window
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
			return;
		}

		event.preventDefault();
		const dispatcher = item.element ?? this.host;
		dispatcher.dispatchEvent(
			new CustomEvent(BREADCRUMB_ITEM_CLICK_EVENT, {
				bubbles: true,
				composed: true,
				detail: { href: item.href }
			})
		);
	};

	/** @private */
	render() {
		return (
			<Host>
				<nav
					aria-label={this.label}
					class="bg-default p-2 flex items-center"
					ref={(el) => (this.navEl = el as HTMLElement)}
				>
					<slot></slot>
					<slot name="visible-start"></slot>
					{this.isCollapsed && (
						<div class="flex items-center">
							<dv-dropdown placement="bottom-start">
								<dv-icon-button
									slot="trigger"
									name="ellipsis"
									size={this.size === 'sm' ? 'xs' : 'md'}
									label="Show hidden breadcrumb items"
									type="button"
									class="body-default text-brand cursor-pointer hover:bg-brand-hover hover:rounded-radius-lg border-none bg-transparent -my-2 "
								></dv-icon-button>
								<dv-menu>
									{this.collapsedItems.map((item) => (
										<dv-menu-item
											href={item.href}
											disabled={item.disabled}
											onClick={(e: MouseEvent) => this.handleCollapsedItemClick(e, item)}
										>
											{item.label}
										</dv-menu-item>
									))}
								</dv-menu>
							</dv-dropdown>
							<dv-icon name="chevron-right" size="xs" class="text-subtle px-2" aria-hidden="true"></dv-icon>
						</div>
					)}
					<slot name="visible-middle"></slot>
					<slot name="visible-end"></slot>
				</nav>
			</Host>
		);
	}
}

