import { Component, Host, h } from '@stencil/core';

/**
 * ## Overview
 * The Footer component provides a consistent bottom section for your application layout. It uses a white background
 * with a subtle top border and maintains consistent spacing for content.
 *
 * The component serves as a semantic footer element that adapts to different themes while preserving proper spacing
 * and content organization.
 *
 * When in dark mode, the footer automatically adjusts its background color to maintain visual hierarchy
 * and ensure proper contrast ratios.
 *
 * The `<dv-footer>` component supports these layout patterns:
 * - **Default Layout**: Clean white background with top border
 * - **Dark Theme**: Adjusted background for dark mode
 * - **Flexible Width**: Adapts to container width
 * - **Content Flow**: Maintains proper spacing for children
 * - **Border Style**: Subtle separation from main content
 *
 * ## Accessibility
 * - Uses semantic `<footer>` element
 * - Maintains proper text contrast in both themes
 * - Preserves content structure
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [MDN Footer Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer)
 *
 * @summary A semantic footer container with consistent spacing and adaptive theming for application layouts.
 *
 * @tag dv-footer
 *
 * @slot - Content to be displayed in the footer.
 */
@Component({
	tag: 'dv-footer',
	styleUrl: 'dv-footer.scss',
	shadow: true
})
export class DvFooter {
	/** The content to display in the footer when no custom content is provided. */
	/** @private */
	render() {
		return (
			<Host>
				<footer>
					<div class="p-6 bg-default border-t border-default">
						<div class="flex justify-between body-sm text-default">
							<slot></slot>
						</div>
					</div>
				</footer>
			</Host>
		);
	}
}

