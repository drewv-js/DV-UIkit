import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, h, Method, Prop, Watch, Host } from '@stencil/core';
import type { IconName } from '../../icon-name.generated';
import { getColorGroups } from '../../internal/color';
import { HIDE_EVENT } from '../../events';

/**
 * ## Overview
 * Callouts are used to provide different contextual messages and display important information.
 * A layout can contain multiple callouts to communicate different types of information to users.
 * The callout component includes an icon that visually represents the callout type, enhancing user understanding.
 * Each variant has a distinct color scheme and icon to clearly convey the message's importance and nature.
 *
 * The `<dv-callout>` component supports five main variants:
 * - **Info**: Default information callout (blue)
 * - **Success**: Positive confirmation messages (green)
 * - **Neutral**: General information messages (gray)
 * - **Warning**: Cautionary messages (orange)
 * - **Error**: Error or critical messages (red)
 *
 * ## Accessibility
 * - Includes accessible close button with `aria-label`
 * - Keyboard accessible close button
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * ## Dependencies
 * Other components used internally by this component.
 *
 * | Component | Purpose |
 * |---|---|
 * | `<dv-icon>` | Used for variant and close icons. |
 * | `<dv-icon-button>` | Used for the close button. |
 *
 * @summary A dismissible callout component with status color variants and automatic icons.
 *
 * @tag dv-callout
 *
 * @slot - The callout message content.
 * @slot footer - The callout footer for calls to action like buttons and links.
 * @slot actions - The callout actions area for links and action items.
 */
@Component({
	tag: 'dv-callout',
	styleUrl: 'dv-callout.scss',
	shadow: true
})
export class DvCallout {
	private statusColors = getColorGroups(['status']);
	private colorKeys = Object.keys(this.statusColors);

	/** Default color */
	private readonly DEFAULT_COLOR = 'info' as const;

	@Element() host!: HTMLDvCalloutElement;

	/** Indicates whether or not the callout is open. */
	@Prop({ mutable: true, reflect: true }) open = true;

	/** The color of the callout. */
	@Prop({ reflect: true }) color: keyof ReturnType<typeof getColorGroups> = this.DEFAULT_COLOR;

	/** The label or title of the callout. */
	@Prop({ reflect: true }) label: string = null;

	/** Whether the status indicator icon appears within the callout. */
	@Prop({ reflect: true }) icon: boolean = true;

	/** Whether the close button appears - defaults to true */
	@Prop({ reflect: true }) closable: boolean = true;

	/** Emitted when the callout is hidden. */
	@Event({ eventName: HIDE_EVENT }) hide!: EventEmitter<void>;

	/** @private */
	@Watch('open')
	handleOpenChange() {
		if (!this.open) {
			this[HIDE_EVENT].emit();
		}
	}

	/** Hides the callout. */
	@Method()
	async calloutHide() {
		this.open = false;
	}

	private handleCloseClick = () => void this.calloutHide();

	private getIconDetails() {
		const iconMap = {
			success: 'circle-check',
			warning: 'triangle-exclamation',
			error: 'triangle-exclamation',
			neutral: 'circle-info',
			info: 'circle-info'
		};

		return {
			iconName: (iconMap[this.color] ?? iconMap[this.DEFAULT_COLOR]) as IconName,
			iconColor: this.colorKeys.includes(this.color) ? this.color : this.DEFAULT_COLOR
		};
	}

	private getColorClasses() {
		const currentColor = this.statusColors[this.color] || this.statusColors[this.DEFAULT_COLOR];
		return `${currentColor.border} ${currentColor.bg}`;
	}

	/** @private */
	render() {
		const { iconName, iconColor } = this.getIconDetails();
		const hasFooter = !!this.host.querySelector('[slot="footer"]');
		const hasActions = !!this.host.querySelector('[slot="actions"]');

		return (
			<Host>
				<div
					class={`${
						this.open ? 'block' : 'hidden'
					} ${this.getColorClasses()} rounded-radius-md p-2 flex items-start body-sm text-default border-width-sm gap-2`}
					role="status"
					aria-hidden={!this.open}
				>
					{this.icon && (
						<div>
							<dv-icon name={iconName} color={iconColor} size="xs"></dv-icon>
						</div>
					)}
					<div class="flex flex-col -mt-0.5 gap-1">
						{this.label && (
							<div>
								<span class="title-xs">{this.label}</span>
							</div>
						)}
						<div>
							<slot></slot>
						</div>
						{hasFooter && (
							<div>
								<slot name="footer" />
							</div>
						)}
					</div>
					{(hasActions || this.closable) && (
						<div class="ml-auto flex gap-2">
							{hasActions && (
								<div class="text-nowrap ">
									<slot name="actions" />
								</div>
							)}
							{this.closable && (
								<div class="-my-2 -mr-2">
									<dv-icon-button
										name="xmark"
										onClick={this.handleCloseClick}
										aria-label="Close callout"
									></dv-icon-button>
								</div>
							)}
						</div>
					)}
				</div>
			</Host>
		);
	}
}

