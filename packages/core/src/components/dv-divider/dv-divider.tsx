import { Component, h, Prop, Host, Watch, State } from '@stencil/core';

/**
 * ## Overview
 * The Divider component provides a visual separation between content sections. It offers both horizontal and vertical
 * orientations.
 *
 * The component supports different variants to match various design contexts:
 * - **Horizontal**: Creates clear section breaks in vertical layouts
 * - **Vertical**: Separates inline content or navigation items
 *
 * Key features:
 * - Multiple orientation options
 * - Configurable spacing through margins
 * - Consistent 1px line width
 *
 * ## Accessibility
 * - Maintains content relationships
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [MDN HR Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr)
 * - [WCAG Content Structure](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
 *
 * @summary A visual divider line with horizontal and vertical orientation variants for separating content sections.
 *
 * @tag dv-divider
 */
@Component({
	tag: 'dv-divider',
	styleUrl: 'dv-divider.scss',
	shadow: true
})
export class DvDivider {
	/** Divider variant: 'horizontal' (default) or 'vertical' */
	@Prop({ reflect: true }) variant: 'horizontal' | 'vertical' = 'horizontal';

	/** Stores the class for the divider */
	@State() dividerClass: string;

	/** Watch for variant changes and update classes */
	/** @private */
	@Watch('variant')
	handleVariantChange(newVariant: 'horizontal' | 'vertical') {
		this.dividerClass = this.computeClass(newVariant);
	}

	/** Take Tailwind classes based on variant */
	private computeClass(variant: 'horizontal' | 'vertical'): string {
		return variant === 'horizontal' ? 'border-b-width-sm w-full my-2' : 'border-r-width-sm h-full mx-2';
	}

	/** Set initial class */
	componentWillLoad() {
		this.dividerClass = this.computeClass(this.variant);
	}

	/** @private */
	render() {
		return (
			<Host>
				<div class={`border-default ${this.dividerClass}`}></div>
			</Host>
		);
	}
}

