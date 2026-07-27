import type { EventEmitter } from '@stencil/core';
import { Component, Host, h, Prop, Event, Element } from '@stencil/core';
import { getColorGroups } from '../../internal/color';
import { DISMISS_EVENT, CLICK_EVENT } from '../../events';

/**
 * ## Overview
 * The Tag component provides a compact way to display categorical information with optional close functionality.
 * It supports multiple status color variants and can include icons to enhance visual classification.
 *
 * The component implements semantic button behavior when interactive while providing clear visual distinction
 * through color variants and optional icons.
 *
 * Tags maintain consistent styling and spacing while supporting both static and interactive states
 * with proper accessibility attributes.
 *
 * The `<dv-tag>` component supports four status colors:
 * - **Default**: General information messages (gray)
 * - **Success**: Positive confirmation messages (green)
 * - **Warning**: Cautionary messages (orange)
 * - **Error**: Error or critical messages (red)
 *
 * Additional features include:
 * - **Interactive States**: Optional click and close actions
 * - **Icon Integration**: Optional start icon for enhanced context
 * - **Content Flexibility**: Custom content through default slot
 *
 * ## Accessibility
 * - Interactive when clickable
 * - Clear visual contrast for all variants
 * - Proper button role for close action
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-icon-button>` | Used for the close button when closable |
 *
 * @summary A compact label component with optional close button and status color variants.
 *
 * @tag dv-tag
 *
 * @slot - Main content of the tag.
 * @slot startIcon - Icon displayed before the main content.
 */
@Component({
	tag: 'dv-tag',
	styleUrls: ['dv-tag.scss'],
	shadow: true
})
export class DvTag {
	private statusColors = getColorGroups(['status']);

	/** Default color of the tag */
	private readonly DEFAULT_COLOR = 'default' as const;

	/** Maps public color prop values to internal design token keys */
	private readonly colorTokenMap: Record<string, string> = {
		default: 'neutral'
	};

	@Element() host!: HTMLElement;

	/** Determines if the tag is dismissible (shows a close button) */
	@Prop() dismissible: boolean = false;

	/**
	 * __⚠️@deprecated The prop 'closable' is deprecated as of v1.7.0.__ Use the `dismissible` prop instead.
	 *
	 * @since 0.12.0 - Initial introduction of closable prop
	 * @since 1.7.0 - closable prop deprecated, use dismissible instead
	 */
	@Prop() closable: boolean = false;

	/** The status color theme of the tag. */
	@Prop() color: keyof ReturnType<typeof getColorGroups> = this.DEFAULT_COLOR;

	/** Event emitted when the close button is clicked */
	@Event({ eventName: DISMISS_EVENT }) dismiss: EventEmitter<void>;

	/** Event emitted when the tag is clicked */
	@Event({ eventName: CLICK_EVENT }) click: EventEmitter<void>;

	private getColorClasses() {
		const tokenKey = this.colorTokenMap[this.color] || this.color;
		const fallbackKey = this.colorTokenMap[this.DEFAULT_COLOR];
		const currentColor = this.statusColors[tokenKey] || this.statusColors[fallbackKey];
		return {
			text: currentColor.text,
			border: currentColor.border,
			bg: currentColor.bg
		};
	}

	private handleDismissClick(event: MouseEvent) {
		event.stopPropagation(); // Prevent triggering the click event on the tag
		this[DISMISS_EVENT].emit();
		(this.host as HTMLElement).remove(); // Remove the dv-tag from the DOM
	}

	/** Handles click events on the tag */
	private handleClick = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		this[CLICK_EVENT].emit();
	};

	/** @private */
	render() {
		const isDismissible = this.dismissible || this.closable;
		const baseClasses =
			'inline-flex items-center justify-center label-sm rounded-radius-full px-2 py-1 max-w-full truncate border-width-sm';

		const colorClasses = this.getColorClasses();

		return (
			<Host>
				<div
					class={`${baseClasses} ${colorClasses.text} ${colorClasses.border} ${colorClasses.bg} relative`}
					onClick={this.handleClick}
				>
					<div class={`flex items-center gap-1 ${isDismissible ? 'mr-5' : ''} max-w-full`}>
						<slot name="startIcon"></slot>
						<span class="truncate">
							<slot></slot>
						</span>
						{isDismissible && (
							<dv-icon-button
								name="circle-xmark"
								label="Close"
								color={this.colorTokenMap[this.color] || this.color}
								class="absolute right-0"
								onClick={(event) => this.handleDismissClick(event)}
							></dv-icon-button>
						)}
					</div>
				</div>
			</Host>
		);
	}
}

