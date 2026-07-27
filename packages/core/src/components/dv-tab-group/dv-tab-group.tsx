import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, h, Method, Prop, State, Watch } from '@stencil/core';
import { TAB_SHOW_EVENT, TAB_HIDE_EVENT } from '../../events';
import type { TabShowEventDetail, TabHideEventDetail } from '../../events';

/**
 * Utility Functions
 */

/**
 * Scrolls an element into view of its container. If the element is already in view, nothing will happen.
 * Defaults to horizontal scrolling.
 */
function scrollIntoView(element: HTMLElement, container: HTMLElement, behavior: 'smooth' | 'auto' = 'smooth') {
	const offset = getOffset(element, container);
	const offsetLeft = offset.left + container.scrollLeft;
	const minX = container.scrollLeft;
	const maxX = container.scrollLeft + container.offsetWidth;

	// Horizontal scrolling logic
	if (offsetLeft < minX) {
		container.scrollTo({ left: offsetLeft, behavior });
	} else if (offsetLeft + element.clientWidth > maxX) {
		container.scrollTo({ left: offsetLeft - container.offsetWidth + element.clientWidth, behavior });
	}
}

/**
 * Returns an element's offset relative to its parent. Similar to element.offsetTop and element.offsetLeft, except the
 * parent doesn't have to be positioned relative or absolute.
 *
 * NOTE: This was created to work around what appears to be a bug in Chrome where a slotted element's offsetParent
 * seems to ignore elements inside the surrounding shadow DOM: https://bugs.chromium.org/p/chromium/issues/detail?id=920069
 */
function getOffset(element: HTMLElement, parent: HTMLElement) {
	return {
		top: Math.round(element.getBoundingClientRect().top - parent.getBoundingClientRect().top),
		left: Math.round(element.getBoundingClientRect().left - parent.getBoundingClientRect().left)
	};
}

/**
 * Animates a given `element` from the position and dimension of `fromElement` to
 * its current position and dimension. Can be useful to implement the FLIP animation technique.
 *
 * @see {@link https://css-tricks.com/animating-layouts-with-the-flip-technique/} for details on the FLIP technique.
 *
 */
function flipAnimate(
	element: Element,
	fromElement: Element,
	options: KeyframeAnimationOptions = {
		duration: 150,
		easing: 'ease',
		fill: 'both'
	}
) {
	const dimensionsTo = fromElement.getBoundingClientRect();
	const dimensionsFrom = element.getBoundingClientRect();

	const deltaX = dimensionsTo.left - dimensionsFrom.left;
	const deltaY = dimensionsTo.top - dimensionsFrom.top;
	const deltaW = dimensionsTo.width / dimensionsFrom.width;
	const deltaH = dimensionsTo.height / dimensionsFrom.height;

	element.animate(
		[
			{
				transformOrigin: 'top left',
				transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
			},
			{
				transformOrigin: 'top left',
				transform: 'none'
			}
		],
		options
	);
}

/**
 * ## Overview
 * `dv-tab-group` manages a collection of tabs and their associated panels. It requires `dv-tab` and
 * `dv-tab-panel` components as children to function properly.
 *
 * The component orchestrates tab selection, panel visibility, and keyboard navigation while
 * maintaining proper ARIA relationships between tabs and their content panels.
 *
 * Tab groups handle all keyboard interactions and maintain focus management between tabs while ensuring only
 * one panel is visible at a time.
 *
 * The `<dv-tab-group>` component supports these interaction patterns:
 * - **Arrow Keys**: Navigate between tabs
 * - **Home/End**: Jump to first/last tab
 * - **Activation**: Space/Enter to select tab
 * - **Focus Management**: Proper tab focus handling
 * - **Panel Control**: Automatic panel visibility
 *
 * ## Accessibility
 * - Uses `role="tablist"` for the navigation container.
 * - Proper tab and panel associations via ARIA attributes.
 * - Keyboard navigation support (arrow keys, Home, End).
 * - Focus management between tabs.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-tab>` | Child elements define the interactive tabs rendered in the nav slot |
 * | `<dv-tab-panel>` | Child elements provide the associated tab panel content |
 *
 * @summary A tab container that manages dv-tab and dv-tab-panel children for tabbed navigation.
 *
 * @tag dv-tab-group
 *
 * @slot nav - Container for `dv-tab` elements in the navigation bar.
 * @slot - Container for `dv-tab-panel` elements with tab content.
 */
@Component({
	tag: 'dv-tab-group',
	styleUrl: 'dv-tab-group.scss',
	shadow: true
})
export class DvTabGroup {
	private activeTab?: HTMLDvTabElement;
	private body?: HTMLElement;
	private mutationObserver?: MutationObserver;
	private nav?: HTMLElement;
	private resizeObserver?: ResizeObserver;
	private tabGroup?: HTMLElement;
	private tabs?: HTMLElement;

	/** @internal Host element reference used to coordinate tabs and panels. */
	@Element() host!: HTMLDvTabGroupElement;

	/** @internal Tracks whether the left overflow control should be shown. */
	@State() hasLeftControl = false;
	/** @internal Tracks whether the right overflow control should be shown. */
	@State() hasRightControl = false;

	/** @internal */
	/** The placement of the tabs. */
	@Prop() placement: 'top' = 'top';

	/** The size variant of all tabs in the group. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** Disables the scroll arrows that appear when tabs overflow. */
	@Prop() noScrollControls = false;

	/**
	 * @internal Flags to disable the IntersectionObserver, ResizeObserver, and MutationObserver
	 * for unit tests where these browser APIs are unavailable.
	 */
	static DISABLE_INTERSECTION_OBSERVER = false;
	/** @internal Test-only flag that disables the resize observer wiring. */
	static DISABLE_RESIZE_OBSERVER = false;
	/** @internal Test-only flag that disables the mutation observer wiring. */
	static DISABLE_MUTATION_OBSERVER = false;

	/* istanbul ignore next */
	/** @private */
	@Watch('size')
	handleSizeChange() {
		this.syncTabSizes();
	}

	/* istanbul ignore next */
	/** @private */
	@Watch('noScrollControls')
	handleNoScrollControlsChange() {
		this.updateScrollControls();
	}

	/** Emitted when a tab is shown. */
	@Event({ eventName: TAB_SHOW_EVENT }) tabShow!: EventEmitter<TabShowEventDetail>;

	/** Emitted when a tab is hidden. */
	@Event({ eventName: TAB_HIDE_EVENT }) tabHide!: EventEmitter<TabHideEventDetail>;

	/* istanbul ignore next */
	/** @private */
	componentDidLoad() {
		if (this.tabGroup == null || this.nav == null) return;
		if (!DvTabGroup.DISABLE_INTERSECTION_OBSERVER) {
			// Set initial tab state when the tabs first become visible
			const observer = new IntersectionObserver((entries, observer) => {
				if (entries[0].intersectionRatio > 0) {
					this.setAriaLabels();
					this.setActiveTab(this.getActiveTab() || this.getAllTabs()[0], false);
					observer.unobserve(entries[0].target);
				}
			});
			observer.observe(this.host);
		}
		if (!DvTabGroup.DISABLE_RESIZE_OBSERVER) {
			this.resizeObserver = new ResizeObserver(() => this.updateScrollControls());
			this.resizeObserver.observe(this.nav);
		}
		requestAnimationFrame(() => this.updateScrollControls());

		this.nav.addEventListener('scroll', () => {
			if (this.nav == null) {
				return;
			}
			this.hasRightControl = this.calculateRightControlVisibility();
			this.hasLeftControl = this.calculateLeftControlVisibility();
		});
		if (!DvTabGroup.DISABLE_MUTATION_OBSERVER) {
			// Update aria labels if the DOM changes
			this.mutationObserver = new MutationObserver((mutations) => {
				if (
					mutations.some((mutation) => {
						return !['aria-labelledby', 'aria-controls'].includes(mutation.attributeName ?? '');
					})
				) {
					setTimeout(() => this.setAriaLabels());
				}
			});
			this.mutationObserver.observe(this.host, { attributes: true, childList: true, subtree: true });
		}
	}
	/* istanbul ignore next */
	/** @private */
	disconnectedCallback() {
		if (this.mutationObserver == null || this.tabGroup == null || this.nav == null || this.resizeObserver == null) {
			return;
		}
		this.mutationObserver.disconnect();
		this.resizeObserver.unobserve(this.nav);
	}

	/** Shows the specified tab panel. */
	@Method()
	async tabGroupShow(panel: string) {
		const tabs = this.getAllTabs();
		const tab = tabs.find((el) => el.panel === panel);

		if (tab != null) {
			this.setActiveTab(tab);
		}
	}

	/** Propagates the group's size prop to every child dv-tab. */
	private syncTabSizes() {
		this.getAllTabs(true).forEach((tab) => {
			tab.size = this.size;
		});
	}

	private getAllTabs(includeDisabled = false): HTMLDvTabElement[] {
		const slot = this.tabs?.querySelector('slot');
		if (slot == null) return [];

		return [...(slot.assignedElements?.() || [])].filter((el: Element) => {
			return includeDisabled
				? el.tagName.toLowerCase() === 'dv-tab'
				: el.tagName.toLowerCase() === 'dv-tab' && !(el as HTMLDvTabElement).disabled;
		}) as [HTMLDvTabElement];
	}

	private getAllPanels(): HTMLDvTabPanelElement[] {
		const slot = this.body?.querySelector('slot');
		if (slot == null) return [];
		return [...(slot.assignedElements?.() || [])].filter(
			(el: Element) => el.tagName.toLowerCase() === 'dv-tab-panel'
		) as [HTMLDvTabPanelElement];
	}

	private getActiveTab() {
		return this.getAllTabs().find((el) => el.active);
	}

	/* istanbul ignore next */
	private handleClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		const tab = target.closest('dv-tab');
		const tabGroup = tab?.closest('dv-tab-group');

		// Ensure the target tab is in this tab group
		if (tabGroup !== this.host) {
			return false;
		}

		if (tab != null) {
			this.setActiveTab(tab);
		}
	};

	/* istanbul ignore next */
	private handleKeyDown = (event: KeyboardEvent) => {
		if (this.nav == null) return;

		const target = event.target as HTMLElement;
		const tab = target.closest('dv-tab');
		const tabGroup = tab?.closest('dv-tab-group');

		// Ensure the target tab is in this tab group
		if (tabGroup !== this.host) {
			return false;
		}

		// Move focus left or right
		if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
			const activeTab = (event.target as HTMLElement)?.closest('dv-tab') as HTMLDvTabElement;

			if (activeTab) {
				const tabs = this.getAllTabs();
				let index = tabs.indexOf(activeTab);

				if (event.key === 'Home') {
					index = 0;
				} else if (event.key === 'End') {
					index = tabs.length - 1;
				} else if (event.key === 'ArrowLeft') {
					index = Math.max(0, index - 1);
				} else if (event.key === 'ArrowRight') {
					index = Math.min(tabs.length - 1, index + 1);
				}

				void tabs[index].setFocus({ preventScroll: true });
				this.setActiveTab(tabs[index]);

				if (['top'].includes(this.placement)) {
					scrollIntoView(tabs[index], this.nav);
				}

				event.preventDefault();
			}
		}
	};

	private handleScrollLeft = () => {
		if (this.nav == null) return;

		this.nav.scroll({
			left: this.nav.scrollLeft - this.nav.clientWidth,
			behavior: 'smooth'
		});
	};

	private handleScrollRight = () => {
		if (this.nav == null) return;

		this.nav.scroll({
			left: this.nav.scrollLeft + this.nav.clientWidth,
			behavior: 'smooth'
		});
	};

	private calculateRightControlVisibility() {
		if (this.nav == null) {
			return false;
		}
		return Math.abs(this.nav?.scrollLeft) + this.nav?.clientWidth < this.nav?.scrollWidth - 1;
	}

	private calculateLeftControlVisibility() {
		if (this.nav == null) {
			return false;
		}
		return Math.abs(this.nav?.scrollLeft) > 0;
	}

	private updateScrollControls() {
		if (this.nav == null) return;

		this.hasRightControl = this.noScrollControls
			? false
			: ['top'].includes(this.placement) && this.calculateRightControlVisibility();
	}

	private setActiveTab(tab: HTMLDvTabElement, emitEvents = true) {
		if (this.nav == null) return;

		const newIndicator = tab?.shadowRoot?.querySelector('.tab__indicator');
		const oldIndicator = this.getActiveTab()?.shadowRoot?.querySelector('.tab__indicator');

		if (oldIndicator != null && newIndicator != null) {
			flipAnimate(newIndicator, oldIndicator);
		}

		// Sync sizes on every activation to catch dynamically added tabs
		this.syncTabSizes();

		if (tab !== this.activeTab && !tab.disabled) {
			const previousTab = this.activeTab;
			this.activeTab = tab;

			// Sync tabs and panels
			this.getAllTabs().map((el) => (el.active = el === this.activeTab));
			this.getAllPanels().map((el) => (el.active = el.name === this.activeTab?.panel));

			if (['top'].includes(this.placement)) {
				scrollIntoView(this.activeTab, this.nav);
			}

			// Emit events
			if (emitEvents) {
				if (previousTab != null) {
					this[TAB_HIDE_EVENT].emit({ name: previousTab.panel });
				}

				this[TAB_SHOW_EVENT].emit({ name: this.activeTab.panel });
			}
		}
	}

	/* istanbul ignore next */
	private setAriaLabels() {
		const tabs = this.getAllTabs();
		const panels = this.getAllPanels();

		// Link each tab with its corresponding panel
		tabs.map((tab) => {
			const panel = panels.find((el) => el.name === tab.panel);
			if (panel != null) {
				tab.setAttribute('aria-controls', panel.getAttribute('id') ?? '');
				panel.setAttribute('aria-labelledby', tab.getAttribute('id') ?? '');
			}
		});
	}

	/** @private */
	render() {
		return (
			<div
				ref={(el) => (this.tabGroup = el)}
				class={`flex flex-col px-0.5 ${this.hasRightControl || this.hasLeftControl ? 'overflow-hidden' : ''} 
          ${this.placement === 'top' ? 'flex-col' : ''}
        `}
				onClick={this.handleClick}
				onKeyDown={this.handleKeyDown}
			>
				<div class="flex items-center">
					{this.hasLeftControl && (
						<dv-tab-control name="chevron-left" label="Scroll tabs left" onClick={this.handleScrollLeft} />
					)}
					<div ref={(el) => (this.nav = el)} class="overflow-hidden whitespace-nowrap w-full" role="tablist">
						<div ref={(el) => (this.tabs = el)} class="flex" role="tablist">
							<slot name="nav" />
						</div>
					</div>
					{this.hasRightControl && (
						<dv-tab-control name="chevron-right" label="Scroll tabs right" onClick={this.handleScrollRight} />
					)}
				</div>

				<div ref={(el) => (this.body = el)}>
					<slot />
				</div>
			</div>
		);
	}
}

