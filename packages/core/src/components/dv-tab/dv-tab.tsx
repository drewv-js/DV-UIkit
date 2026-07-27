import { Component, Element, h, Host, Method, Prop } from '@stencil/core';

let id = 0;

/**
 * ## Overview
 * `dv-tab` represents an individual tab button within an `dv-tab-group`. It must be placed in the
 * `nav` slot of the `dv-tab-group` and paired with an `dv-tab-panel` sharing the same panel name.
 *
 * ## Accessibility
 * - Uses `role="tab"` for proper tab semantics.
 * - Sets `aria-selected` and `aria-disabled` attributes to communicate state.
 * - Manages `tabindex` to support keyboard navigation within the tab list.
 * - View [Accessibility](/docs/accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
 *
 * @summary An individual tab button that controls the visibility of its associated dv-tab-panel.
 *
 * @tag dv-tab
 *
 * @slot - Label content for the tab.
 * @slot startIcon - Displays an icon on the left side of the tab label.
 * @slot endIcon - Displays an icon on the right side of the tab label.
 */
@Component({
	tag: 'dv-tab',
	styleUrl: 'dv-tab.scss',
	shadow: true
})
export class DvTab {
	private componentId = `tab-${++id}`;
	private tab?: HTMLElement;

	@Element() host!: HTMLDvTabElement;

	/** The name of the tab panel the tab will control. The panel must be located in the same tab group. */
	@Prop({ reflect: true }) panel = '';

	/** Set to true to draw the tab in an active state. */
	@Prop({ reflect: true }) active = false;

	/** Set to true to draw the tab in a disabled state. */
	@Prop({ reflect: true }) disabled = false;

	/** @internal Controlled by the parent dv-tab-group. */
	@Prop() size: 'sm' | 'md' = 'md';

	/** Sets focus to the tab. */
	@Method()
	async setFocus(options?: FocusOptions) {
		this.tab?.focus(options);
	}

	/** Removes focus from the tab. */
	@Method()
	async removeFocus() {
		this.tab?.blur();
	}

	/** Returns icon color classes based on tab state. */
	private getIconClasses(): string {
		if (this.disabled) return 'text-disabled';
		if (this.active) return 'text-brand';
		return 'text-default';
	}

	/** Returns icon hover classes - only apply on non-disabled, non-active tabs. */
	private getIconHoverClasses(): string {
		return !this.disabled && !this.active ? 'group-hover:text-brand-hover' : '';
	}

	/** Returns size-specific classes for padding and label size. */
	private getSizeClasses(): string {
		if (this.size === 'sm') {
			return 'py-1 px-2 label-sm';
		}
		return 'py-2 px-3 label-default';
	}

	/** @private */
	render() {
		// Base tab button styles (excluding size-specific padding and label size)
		const baseClasses = `flex items-center gap-2 whitespace-nowrap select-none w-full focus:outline-width-lg focus:-outline-offset-2 focus-visible:outline-width-lg focus-visible:rounded focus:outline-focus-ring-default focus-visible:ring-focus-ring-default focus-visible:outline justify-center ml-px border-b-2`;

		// Border color based on state
		const borderClasses = `${this.disabled ? 'border-disabled' : this.active ? 'border-brand' : 'border-default'}`;

		// Text color and cursor based on state
		const textClasses = `${this.disabled ? 'text-disabled cursor-not-allowed' : 'cursor-pointer'} ${this.active ? 'text-brand' : this.disabled ? '' : 'text-subtle hover:text-brand-hover'}`;

		// Size-specific classes (padding and label size)
		const sizeClasses = this.getSizeClasses();

		return (
			<Host>
				{/* group class enables group-hover for icon slots on tab hover */}
				<div id={this.host.id || this.componentId} class="relative py-4 lg:py-6 group">
					<div
						ref={(el) => (this.tab = el)}
						class={`${baseClasses} ${sizeClasses} ${borderClasses} ${textClasses}`}
						role="tab"
						aria-disabled={this.disabled ? 'true' : 'false'}
						aria-selected={this.active ? 'true' : 'false'}
						tabindex={this.disabled || !this.active ? '-1' : '0'}
					>
						<span class={`flex gap-2 ${this.getIconClasses()} ${this.getIconHoverClasses()}`}>
							<slot name="startIcon"></slot>
						</span>
						<slot />
						<span class={`flex gap-2 ${this.getIconClasses()} ${this.getIconHoverClasses()}`}>
							<slot name="endIcon"></slot>
						</span>
					</div>
				</div>
			</Host>
		);
	}
}

