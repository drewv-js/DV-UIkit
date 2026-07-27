import { Component, Host, h, Prop } from '@stencil/core';

/**
 * ## Overview
 * The App Bar provides a container for top-level navigation and actions. It organizes content into three distinct regions:
 * left, center, and right, allowing for flexible layout of navigation elements, branding, and actions.
 *
 * Each region (`left`, `center`, `right`) can contain various components like navigation menus, logos, search bars,
 * and action buttons to create a cohesive header experience.
 *
 * The App Bar maintains consistent positioning and styling across different viewport sizes, ensuring
 * your application's primary navigation remains accessible.
 *
 * The `<dv-app-bar>` component supports various content arrangements:
 * - **Left Region**: Typically used for navigation menus or branding
 * - **Center Region**: Often contains search functionality or primary actions
 * - **Right Region**: Common location for user-related actions and additional tools
 * - **Multiple Components**: Each region can contain multiple components
 * - **Flexible Layout**: Regions adapt to content size while maintaining alignment
 *
 * ## Accessibility
 * - Uses semantic `<header>` element
 * - Includes `aria-label` for screen readers
 * - Supports keyboard navigation through slotted content
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
 * - [dv-button](/docs/components-button--docs)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * @summary A fixed top-level app bar with left, center, and right content regions for navigation and actions.
 *
 * @tag dv-app-bar
 *
 * @slot left - Content rendered on the left side of the App Bar
 * @slot center - Content rendered in the center of the App Bar
 * @slot right - Content rendered on the right side of the App Bar
 */
@Component({
	tag: 'dv-app-bar',
	styleUrl: 'dv-app-bar.scss',
	shadow: true
})
export class DvAppBar {
	/** A description that gets read by assistive devices. */
	@Prop({ reflect: true }) label?: string = '';

	/** @private */
	render() {
		return (
			<Host>
				<header
					aria-label={this.label}
					class="min-h-12 fixed z-10 top-0 left-0 w-full flex items-center justify-between bg-[image:--dv-theme-app-bar-color-background-default] px-6 py-1"
				>
					<div class="items-center gap-4">
						<slot name="left"></slot>
					</div>

					<div class="justify-center gap-4">
						<slot name="center"></slot>
					</div>

					<div class="items-center gap-4">
						<slot name="right"></slot>
					</div>
				</header>
			</Host>
		);
	}
}

