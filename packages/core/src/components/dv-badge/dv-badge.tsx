import { Component, Host, h, Prop } from '@stencil/core';
import { getColorGroups } from '../../internal/color';

/**
 * ## Overview
 *The Badge component displays short status or contextual information through color-coded visual indicators.
 *It provides immediate visual feedback about states, categories, or statuses within the application interface.
 *
 *Each badge variant uses specific colors and styling to create clear visual distinctions between different types of information, making it easy for users to quickly identify and understand various states.
 *
 *The component maintains consistent padding and rounded corners across all  *variants while using semantic status colors to convey meaning.
 *
 * The `<dv-badge>` component supports five status colors:
 * - **Info**: Default information alert (blue)
 * - **Success**: Positive confirmation messages (green)
 * - **Neutral**: General information messages (gray)
 * - **Warning**: Cautionary messages (orange)
 * - **Error**: Error or critical messages (red)
 *
 * ## Accessibility
 * - Readable text size and font weight
 * - Uses semantic colors for visual distinction
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * @summary A small inline status badge with contextual color variants (neutral, info, success, warning, error).
 *
 * @tag dv-badge
 *
 * @slot - The text or content displayed inside the badge
 */
@Component({
	tag: 'dv-badge',
	styleUrl: 'dv-badge.scss',
	shadow: true
})
export class DvBadge {
	private statusColors = getColorGroups(['status']);

	/** Default color */
	private readonly DEFAULT_COLOR = 'neutral' as const;

	/** The status color theme of the badge. Accepts `'neutral'`, `'info'`, `'success'`, `'warning'`, or `'error'`. Defaults to `'neutral'`. */
	@Prop({ reflect: true }) color: keyof ReturnType<typeof getColorGroups> = this.DEFAULT_COLOR;

	private getColorClasses() {
		const currentColor = this.statusColors[this.color] || this.statusColors[this.DEFAULT_COLOR];
		return {
			text: currentColor.text,
			border: currentColor.border
		};
	}

	/** @private */
	render() {
		const colorClasses = this.getColorClasses();

		return (
			<Host>
				<div
					class={`label-default inline-flex items-center justify-center rounded-radius-full px-3 py-1 max-w-full truncate border-width-sm bg-default ${colorClasses.text} ${colorClasses.border}`}
				>
					<span class="truncate">
						<slot></slot>
					</span>
				</div>
			</Host>
		);
	}
}

