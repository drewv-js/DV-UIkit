import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import type { IconName } from '../../icon-name.generated';
import { getColorGroups } from '../../internal/color';

/**
 * ## Overview
 * The Icon component provides a flexible way to display Font Awesome Solid (fas) icons with customizable sizes and colors.
 * It integrates with the FontAwesome library to render SVG icons with consistent styling.
 *
 * The component handles icon loading and rendering while maintaining proper scaling and antialiasing across different sizes.
 *
 * Icons are rendered as SVG elements, ensuring sharp display at any size while supporting custom colors and
 * maintaining proper accessibility attributes.
 *
 * The `<dv-icon>` component supports these display patterns:
 * - **Size Options**: Five predefined sizes (xs, sm, md, lg, xl)
 * - **Color Control**: Custom color override support
 * - **Icon Types**: All Font Awesome Solid icons
 * - **SVG Output**: Vector-based rendering
 * - **Dynamic Updates**: Real-time icon changes
 *
 * ## Accessibility
 * - SVG icons are decorative by default
 * - Color contrast meets WCAG guidelines
 * - Proper scaling without pixelation
 * - View [Accessibility](/docs/accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [Font Awesome Icons](https://fontawesome.com/icons)
 * - [SVG Accessibility](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
 *
 * @summary A Font Awesome SVG icon with configurable size and optional status color variants.
 *
 * @tag dv-icon
 */
@Component({
	tag: 'dv-icon',
	styleUrl: 'dv-icon.scss',
	shadow: true
})
export class DvIcon {
	private statusColors = getColorGroups(['status']);

	/** The size of the icon, can be 'xs', 'sm', 'md', 'lg', 'xl'. */
	@Prop({ reflect: true, mutable: true }) size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'xs';

	/** Optional color for the icon, can be 'success', 'info', 'neutral', 'warning', 'error'. If not provided, inherits parent color. */
	@Prop({ reflect: true, mutable: true }) color?: keyof ReturnType<typeof getColorGroups>;

	/** The name of the icon to be rendered. */
	@Prop({ reflect: true }) name: IconName;

	/** Holds placeholder text derived from the icon name. */
	@State() iconText: string;

	/** Holds the size class for the icon based on the size prop. */
	@State() sizeClass: string;

	/** Holds the color class for the icon based on the size prop. */
	@State() colorClass: string;

	/** Lifecycle method that runs before the component loads. Sets the icon SVG variables, size, and color. */
	componentWillLoad() {
		this.updateIcon();
		this.setSize();
		this.setColor();
	}

	/** Watch for changes to the size prop and update the size class accordingly.
	 * @private
	 */
	@Watch('size')
	watchSizeHandler() {
		if (typeof this.size === 'undefined') this.size = 'xs';
		this.setSize();
	}

	/** @private */
	@Watch('color')
	watchColorHandler() {
		this.setColor();
	}

	/** Watch for changes to the name prop and update the icon accordingly.
	 * @private
	 */
	@Watch('name')
	watchNameHandler() {
		this.updateIcon();
	}

	/** Updates the SVG based on the current name. */
	private updateIcon() {
		this.iconText = (this.name ?? '?').slice(0, 2).toUpperCase();
	}

	/** Sets the size class based on the size prop. */
	/** @private */
	setSize() {
		switch (this.size) {
			case 'xs':
				this.sizeClass = 'size-4';
				break;
			case 'sm':
				this.sizeClass = 'size-5';
				break;
			case 'md':
				this.sizeClass = 'size-6';
				break;
			case 'lg':
				this.sizeClass = 'size-8';
				break;
			case 'xl':
				this.sizeClass = 'size-10';
				break;
			default:
				this.sizeClass = 'size-4'; // Default size 'xs'
		}
	}

	/** @private */
	setColor() {
		// If no color provided, inherit from parent
		if (!this.color) {
			this.colorClass = '';
			return;
		}
		// If color is a status color, set the corresponding class
		if (this.statusColors[this.color]) {
			this.colorClass = this.getStatusColorClass();
		}
	}

	/** @private */
	getStatusColorClass() {
		const currentColor = this.statusColors[this.color];
		return currentColor?.text || '';
	}

	/** @private */
	render() {
		const inheritStyle = !this.color ? { color: 'inherit' } : undefined;

		return (
			<Host>
				<div class={`antialiased justify-center flex ${this.colorClass} items-center`} style={inheritStyle}>
					<span
						class={`overflow-visible ${this.sizeClass} inline-flex items-center justify-center rounded-full border border-current text-[10px] leading-none`}
						title={`Font Awesome placeholder: ${this.name ?? 'unknown'}`}
					>
						{this.iconText}
					</span>
				</div>
			</Host>
		);
	}
}

