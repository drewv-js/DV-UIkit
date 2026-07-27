import { Component, h, Host, Element, Prop } from '@stencil/core';
import { dvTokenVars } from '../../internal/design-tokens';

/**
 * ## Overview
 * The Card component provides a flexible container for content with optional header elements. It uses a clean, white background
 * with rounded corners and subtle borders to create distinct content sections.
 *
 * The component supports a modular structure through its slot system, allowing for header customization with both text and icons.
 *
 * Cards help organize related content and actions into coherent sections, improving visual hierarchy and content
 * comprehension within the interface.
 *
 * The `<dv-card>` component supports several content arrangements:
 * - **Basic Card**: Simple container for content
 * - **Header Card**: Container with title and optional icon
 * - **Action Card**: Container with interactive elements
 * - **Content Card**: Structured content with semantic sections
 *
 * ## Accessibility
 * - Uses semantic HTML structure
 * - Maintains proper content hierarchy
 * - Preserves content relationships
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WCAG Content Structure](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * @summary A flexible content container with optional header text and icon slots for organizing related content.
 *
 * @tag dv-card
 *
 * @slot - Main content area of the card.
 * @slot header-text - Text content for the card header.
 * @slot header-icon - Icon element for the card header.
 */
@Component({
	tag: 'dv-card',
	styleUrl: 'dv-card.scss',
	shadow: true
})
export class DvCard {
	/** @internal */
	@Element() el: HTMLElement;

	/** The background color of the card. Accepts `'default'` or `'subtle'`. Defaults to `'default'`. */
	@Prop({ reflect: true }) color: 'default' | 'subtle' = 'default';

	/** Checks if the header slot has content */
	/** @private */
	private hasHeaderSlot(): boolean {
		return !!this.el.querySelector('[slot="header-text"], [slot="header-icon"]');
	}

	/** @private */
	render() {
		const rootStyle = {
			background: this.color === 'subtle' ? dvTokenVars.color.surface : dvTokenVars.color.surfaceStrong,
			borderRadius: dvTokenVars.radius.lg,
			border: `1px solid ${dvTokenVars.color.border}`,
			boxShadow: dvTokenVars.shadow.soft,
			color: dvTokenVars.color.text
		};

		const headerStyle = {
			borderBottom: `1px solid ${dvTokenVars.color.border}`,
			padding: dvTokenVars.spacing.s4
		};

		const bodyStyle = {
			padding: dvTokenVars.spacing.s4
		};

		return (
			<Host>
				<div class="w-full flex flex-col" style={rootStyle}>
					{this.hasHeaderSlot() && (
						<div class="flex justify-between items-center title-default" style={headerStyle}>
							<slot name="header-text"></slot>
							<slot name="header-icon"></slot>
						</div>
					)}
					<div class="w-full" style={bodyStyle}>
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}

