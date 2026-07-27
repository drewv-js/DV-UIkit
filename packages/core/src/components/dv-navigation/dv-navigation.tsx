import { Component, Host, Prop, Element, Watch, h } from '@stencil/core';

/**
 * ## Overview
 * The Navigation component provides a vertical sidebar navigation container with a fixed width. It serves as the primary
 * navigation structure for secondary navigation patterns, organizing navigation items and sections into a cohesive menu.
 *
 * The navigation uses a semantic `<nav>` element with proper ARIA labeling to ensure accessibility for assistive technologies.
 * It provides a consistent 16rem (w-64) width container with spacing and background styling.
 *
 * The `<dv-navigation>` component typically contains:
 * - **Navigation Sections**: Groups of related navigation items (`<dv-navigation-section>`)
 * - **Navigation Items**: Individual navigation links or buttons (`<dv-navigation-item>`)
 * - **Dividers**: Visual separators between sections
 *
 * ## Accessibility
 * - Uses semantic `<nav>` element with `aria-label` for screen readers
 * - Maintains proper heading hierarchy
 * - Supports keyboard navigation through slotted items
 * - Provides customizable accessible label via the `label` prop
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Navigation Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/navigation/)
 * - [dv-navigation-section](/docs/components-navigation-section--docs)
 * - [dv-navigation-item](/docs/components-navigation-item--docs)
 *
 * ## Dependencies
 * | Component                | Purpose                                    |
 * |--------------------------|--------------------------------------------|
 * | `<dv-navigation-section>` | Groups related navigation items            |
 * | `<dv-navigation-item>`    | Individual navigation links                |
 * | `<dv-divider>`            | Visual separator between sections          |
 *
 * @summary A vertical navigation container with semantic markup and accessibility features for sidebar navigation patterns.
 *
 * @tag dv-navigation
 *
 * @slot - The navigation content, typically containing navigation sections and items.
 */
@Component({
	tag: 'dv-navigation',
	styleUrl: 'dv-navigation.scss',
	shadow: true
})
export class DvNavigation {
	/** @internal */
	@Element() host!: HTMLElement;

	/** Accessible label applied to the internal navigation landmark. Defaults to `'Secondary navigation'`. */
	@Prop({ reflect: true }) label: string = 'Secondary navigation';

	/** Controls the size of all navigation items. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** @private */
	componentDidLoad() {
		this.syncItems();
	}

	/** @private */
	@Watch('size')
	sizeChanged() {
		this.syncItems();
	}

	/** Propagates the size prop to all child navigation items and sections. */
	private syncItems() {
		const items = this.host.querySelectorAll<HTMLDvNavigationItemElement>('dv-navigation-item');
		items.forEach((item) => {
			item.size = this.size;
		});
		const sections = this.host.querySelectorAll<HTMLDvNavigationSectionElement>('dv-navigation-section');
		sections.forEach((section) => {
			section.size = this.size;
		});
	}

	/** @private */
	render() {
		return (
			<Host>
				<nav aria-label={this.label} class="bg-default w-64 py-4 px-2">
					<slot></slot>
				</nav>
			</Host>
		);
	}
}

