import { Component, Element, Host, Prop, State, h } from '@stencil/core';

/**
 * ## Overview
 * The Navigation Section component groups related navigation items under an optional label within an `<dv-navigation>` container.
 * It automatically manages dividers between sections, rendering a divider after every section except the last one.
 *
 * Sections help organize navigation items into logical groups, improving scannability and comprehension. The optional
 * label provides context for the grouped items. The parent `<dv-navigation>` component automatically controls the
 * section's size to maintain consistent spacing density throughout the navigation.
 *
 * The component automatically detects if it's the last section in a navigation container and conditionally renders
 * dividers to maintain proper visual separation. Divider spacing adjusts based on the parent's size prop:
 * - **Small (`sm`)**: Compact 8px bottom margin for dense layouts
 * - **Medium (`md`)**: Standard 16px bottom margin for comfortable spacing
 *
 * The `<dv-navigation-section>` component supports:
 * - **Optional Labels**: Uppercase styled section headers
 * - **Automatic Dividers**: Renders between sections (except last) with size-appropriate spacing
 * - **Flexible Content**: Accepts any navigation items via slot
 * - **Parent-Controlled Size**: Size automatically inherited from `<dv-navigation>` parent
 *
 * ## Accessibility
 * - Uses semantic HTML structure for proper content hierarchy
 * - Label text is visible and programmatically accessible
 * - Maintains proper reading order for screen readers
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Navigation Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/navigation/)
 * - [dv-navigation](/docs/components-navigation--docs)
 * - [dv-navigation-item](/docs/components-navigation-item--docs)
 * - [dv-divider](/docs/components-divider--docs)
 *
 * ## Dependencies
 * | Component             | Purpose                                    |
 * |-----------------------|--------------------------------------------|
 * | `<dv-divider>`         | Visual separator between sections          |
 * | `<dv-navigation-item>` | Individual navigation items (slotted)      |
 *
 * @summary A grouping component for navigation items with optional labels and automatic divider management.
 *
 * @tag dv-navigation-section
 *
 * @slot - Navigation items to be grouped within this section.
 */
@Component({
	tag: 'dv-navigation-section',
	styleUrl: 'dv-navigation-section.scss',
	shadow: true
})
export class DvNavigationSection {
	/** @internal */
	@Element() host!: HTMLElement;

	/** Section label displayed above the slotted navigation items. Defaults to empty string (no label). */
	@Prop({ reflect: true }) label: string = '';

	/** Controls the divider spacing. Accepts `'sm'` or `'md'`. Defaults to `'md'`. Automatically set by parent `<dv-navigation>`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** @internal */
	@State() private isLastSection: boolean = false;

	/** @private */
	componentWillLoad() {
		const parent = this.host.parentElement;
		const lastSibling = parent!.querySelector('dv-navigation-section:last-of-type');
		this.isLastSection = lastSibling === this.host;
	}

	/** @private */
	render() {
		return (
			<Host>
				<div class="flex flex-col">
					{this.label && <span class="label-sm text-default uppercase ml-4 mb-2">{this.label}</span>}
					<slot></slot>
					{!this.isLastSection && <dv-divider class={this.size === 'sm' ? 'mb-2' : 'mb-4'}></dv-divider>}
				</div>
			</Host>
		);
	}
}

