import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, h, Method, Prop, Watch, Host } from '@stencil/core';
import type { IconName } from '../../icon-name.generated';
import { getColorGroups } from '../../internal/color';
import { SHOW_EVENT, HIDE_EVENT } from '../../events';

/**
 * ## Overview
 * Alerts are used to provide different contextual messages and display important information.
 * A layout can contain multiple alerts to communicate different types of information to users.
 * The alert component includes an icon that visually represents the alert type, enhancing user understanding.
 * Each variant has a distinct color scheme and icon to clearly convey the message's importance and nature.
 *
 * Use the `open` prop to control the alert's visibility. The alert includes a close button by default.
 *
 * The `<dv-alert>` component supports five main variants:
 * - **Info**: Default information alert (blue)
 * - **Success**: Positive confirmation messages (green)
 * - **Neutral**: General information messages (gray)
 * - **Warning**: Cautionary messages (orange)
 * - **Error**: Error or critical messages (red)
 *
 * ## Accessibility
 * - Uses ARIA `role="alert"` for proper semantic meaning
 * - Proper `aria-hidden` management based on open state
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
 * @summary A dismissible alert component with status color variants and automatic icons.
 *
 * @tag dv-alert
 *
 * @slot - The alert message content.
 * @slot footer - The alert footer for calls to action like buttons and links.
 */
@Component({
	tag: 'dv-alert',
	styleUrl: 'dv-alert.scss',
	shadow: true
})
export class DvAlert {
	private statusColors = getColorGroups(['status']);
	private colorKeys = Object.keys(this.statusColors);

	/** Default color */
	private readonly DEFAULT_COLOR = 'info' as const;

	@Element() host!: HTMLDvAlertElement;

	/** Indicates whether or not the alert is open. */
	@Prop({ mutable: true, reflect: true }) open = false;

	/** The color of the alert. */
	@Prop({ reflect: true }) color: keyof ReturnType<typeof getColorGroups> = this.DEFAULT_COLOR;

	/** The label or title of the alert. */
	@Prop({ reflect: true }) label: string = null;

	/** Whether the status indicator icon appears within the alert. */
	@Prop({ reflect: true }) icon: boolean = true;

	/** The scope variant of the alert - local or global. */
	@Prop({ reflect: true }) variant: 'local' | 'global' = 'local';

	/** Whether the close button appears - defaults to true */
	@Prop({ reflect: true }) closable: boolean = true;

	/** Emitted when the alert is shown. */
	@Event({ eventName: SHOW_EVENT }) show!: EventEmitter<void>;

	/** Emitted when the alert is hidden. */
	@Event({ eventName: HIDE_EVENT }) hide!: EventEmitter<void>;

	/** @private */
	@Watch('open')
	handleOpenChange() {
		if (this.open) {
			this[SHOW_EVENT].emit();
		} else {
			this[HIDE_EVENT].emit();
		}
	}

	/** Shows the alert. */
	@Method()
	async alertShow() {
		this.open = true;
	}

	/** Hides the alert. */
	@Method()
	async alertHide() {
		this.open = false;
	}

	private handleCloseClick = () => void this.alertHide();

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

		return (
			<Host>
				<div
					class={`${
						this.open ? 'block' : 'hidden'
					} ${this.getColorClasses()} ${this.variant === 'global' ? 'rounded-none' : 'rounded-radius-md'} p-4 flex items-start justify-between text-default border-width-sm gap-4`}
					role="alert"
					aria-hidden={!this.open}
				>
					{this.icon && (
						<div>
							<dv-icon name={iconName} color={iconColor} size="md"></dv-icon>
						</div>
					)}
					<div class="flex-1">
						{this.label && (
							<div>
								<span class="title-sm">{this.label}</span>
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
					{this.closable && (
						<div>
							<dv-icon-button name="xmark" onClick={this.handleCloseClick} aria-label="Close alert"></dv-icon-button>
						</div>
					)}
				</div>
			</Host>
		);
	}
}

