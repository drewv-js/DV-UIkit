import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { HIDE_EVENT, SHOW_EVENT } from '../../events';
import type { IconName } from '../../icon-name.generated';
import { getColorGroups } from '../../internal/color';

const toastStack = Object.assign(document.createElement('div'), {
	// ToDo: When we expose root.css we should replace the
	// hardcoded properties with css variables.
	// position: var(--dv-toast-stack-position);
	// top: var(--dv-toast-stack-top);
	// right: var(--dv-toast-stack-right);
	// z-index: var(--dv-toast-stack-z-index);
	style: `
        position: fixed;
				bottom: 0px;
				left: 50%;
				transform: translate(-50%);
				z-index: 9999;
    `
});

/**
 * ## Overview
 * The Toast component displays temporary notifications with various states and auto-hide functionality. It manages its own
 * positioning and stacking behavior when multiple toasts are shown.
 *
 * The component handles automatic positioning and layering while providing smooth animations for entry and exit transitions.
 *
 * Toasts are displayed in a stacked formation, with newer messages appearing below existing ones, and include
 * proper ARIA attributes for accessibility.
 *
 * The `<dv-toast>` component supports these display patterns:
 * - **Colors**: Different color options for different statuses
 *   - Info: Blue border for information - default
 *   - Success: Green border for success
 *   - Warning: Orange border for warnings
 *   - Error: Red border for errors
 *   - Neutral: White border for general messages
 * - **Duration Control**: Configurable display time
 * - **Stack Management**: Proper positioning of multiple toasts
 * - **Animation**: Smooth entry and exit transitions
 *
 * ## Accessibility
 * - Uses `role="alert"` for important messages
 * - `aria-live="assertive"` for screen readers
 * - `aria-atomic="true"` for complete message reading
 * - Proper focus management
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-icon>` | Displays status icon |
 * | `<dv-icon-button>` | Provides close button functionality |
 *
 * @summary A temporary notification component with status color variants, auto-hide, and stacking.
 *
 * @tag dv-toast
 *
 * @slot - Content displayed in the toast notification.
 */
@Component({
	tag: 'dv-toast',
	styleUrl: 'dv-toast.scss',
	shadow: true
})
export class DvToast {
	private statusColors = getColorGroups(['status']);
	private colorKeys = Object.keys(this.statusColors);

	/** Default color */
	private readonly DEFAULT_COLOR = 'info' as const;

	private autoHideTimeout?: number;

	@Element() host!: HTMLDvToastElement;

	@State() isVisible = false;
	@State() isExiting = false;
	@State() isEntering = false;

	/** Indicates whether or not the toast is open. */
	@Prop({ mutable: true, reflect: true }) open = false;

	/** Set to true to make the toast closable. */
	@Prop({ reflect: true }) closable = false;

	/** The color of the toast. */
	@Prop({ mutable: true, reflect: true }) color: keyof ReturnType<typeof getColorGroups> = this.DEFAULT_COLOR;

	/** The length of time, in milliseconds, the toast will show before closing itself. */
	@Prop({ mutable: true, reflect: true }) duration = Infinity;

	/** Emitted when the toast is shown. */
	@Event({ eventName: SHOW_EVENT }) show!: EventEmitter<void>;

	/** Emitted when the toast is hidden. */
	@Event({ eventName: HIDE_EVENT }) hide!: EventEmitter<void>;

	/** @private */
	@Watch('open')
	handleOpenChange() {
		void (this.open ? this.toastShow() : this.toastHide());
	}

	/** @private */
	@Watch('duration')
	handleDurationChange() {
		this.restartAutoHide();
	}

	/** @private */
	componentWillLoad() {
		if (this.open) {
			void this.toastShow();
		}
	}

	/** Displays the toast with animation. */
	@Method()
	async toastShow() {
		if (this.isVisible) {
			return;
		}

		// Check if the host is connected to the DOM
		if (this.host.isConnected) {
			const event = this[SHOW_EVENT].emit();
			if (event.defaultPrevented) {
				this.open = false;
				return;
			}
		}
		this.isEntering = true;
		this.isVisible = true;
		this.open = true;

		/* istanbul ignore next */
		// Perform DOM manipulation if not in a testing environment
		if (typeof jest === 'undefined') {
			// Append the toastStack to the body if it's not already there
			if (!toastStack.parentElement) {
				document.body.append(toastStack);
			}

			// Append the current toast to the toastStack
			toastStack.append(this.host);
		}
		/* istanbul ignore next */
		// RequestAnimationFrame for entering animation in non-test environments
		if (typeof requestAnimationFrame !== 'undefined') {
			requestAnimationFrame(() => {
				this.isEntering = false;
			});
		} else {
			// Fallback for testing
			this.isEntering = false;
		}

		if (this.duration < Infinity) {
			this.autoHideTimeout = window.setTimeout(() => void this.toastHide(), this.duration);
		}
	}

	/** Removes the toast with animation. */
	@Method()
	async toastHide() {
		if (!this.isVisible) {
			return;
		}

		const event = this[HIDE_EVENT].emit();
		if (event.defaultPrevented) {
			this.open = true;
			return;
		}

		clearTimeout(this.autoHideTimeout);
		this.isExiting = true;
		this.isVisible = false;
		this.open = false;
		/* istanbul ignore next */
		// Perform DOM manipulation if not in a testing environment
		if (typeof jest === 'undefined') {
			// Remove the toast from the stack after a delay
			await new Promise((resolve) => setTimeout(resolve, 300));
			this.isVisible = false;
			this.open = false;
			this.isExiting = false;
			this.host.remove();
			if (toastStack.childElementCount === 0) {
				toastStack.remove();
			}
		}
	}

	/** Shows toast and returns promise on completion. */
	@Method()
	async toast() {
		return new Promise<void>((resolve) => {
			/* istanbul ignore next */
			if (typeof jest === 'undefined') {
				if (!toastStack.parentElement) {
					document.body.append(toastStack);
				}
				toastStack.append(this.host);
			}

			requestAnimationFrame(() => void this.toastShow());

			this.host.addEventListener(
				`${[HIDE_EVENT]}`,
				() => {
					resolve();
				},
				{ once: true }
			);
		});
	}

	/** Pauses the autoHide functionality. */
	private pauseAutoHide() {
		clearTimeout(this.autoHideTimeout);
	}

	/** Resets the autoHide timer. */
	private resetAutoHide() {
		if (this.open && this.duration < Infinity) {
			this.autoHideTimeout = window.setTimeout(() => void this.toastHide(), this.duration);
		}
	}

	/** Restarts the autoHide timer. */
	private restartAutoHide() {
		this.pauseAutoHide();
		this.resetAutoHide();
	}

	private handleCloseClick = () => {
		void this.toastHide();
	};

	private handleMouseEnter = () => {
		this.pauseAutoHide();
	};

	private handleMouseLeave = () => {
		this.resetAutoHide();
	};

	/* istanbul ignore next */
	private handleTransitionEnd = (event: TransitionEvent) => {
		const target = event.target as HTMLElement;
		if (event.propertyName === 'opacity' && target.classList.contains('toast')) {
			this.isVisible = this.open;
		}
	};

	private getIconDetails() {
		const iconMap = {
			success: 'circle-check',
			warning: 'circle-exclamation',
			error: 'circle-xmark',
			neutral: 'circle-info',
			info: 'circle-info'
		};

		return {
			iconName: (iconMap[this.color] || iconMap[this.DEFAULT_COLOR]) as IconName,
			iconColor: this.colorKeys.includes(this.color) ? this.color : this.DEFAULT_COLOR
		};
	}

	private getColorClasses() {
		const currentColor = this.statusColors[this.color] || this.statusColors[this.DEFAULT_COLOR];
		return currentColor.border;
	}

	/** @private */
	render() {
		// Return null if the toast is not visible
		if (!this.isVisible) {
			return null;
		}

		const { iconName, iconColor } = this.getIconDetails();

		const baseClass =
			'flex items-center transition-opacity duration-300 ease-in-out border-t-4 rounded-radius-lg shadow-sm-bottom bg-brand-knockout text-brand w-80 xl:w-[440px] px-4 py-4 mb-4 gap-4';
		const stateClass = this.isExiting
			? 'opacity-0 -translate-y-4'
			: this.isEntering
				? 'opacity-0 translate-y-4'
				: 'opacity-100 translate-y-0';

		return (
			<Host>
				<div
					class={`${baseClass} ${stateClass} ${this.getColorClasses()}`}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
					aria-hidden={!this.open}
					onTransitionEnd={this.handleTransitionEnd}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
				>
					<div>
						<dv-icon name={iconName} color={iconColor} size="md" class="pr-2"></dv-icon>
					</div>
					<div class="body-default flex-1 overflow-hidden">
						<slot />
					</div>

					{this.closable && (
						<div class="relative top-[-10px] text-knockout">
							<dv-icon-button
								name="xmark"
								size="xs"
								onClick={this.handleCloseClick}
								label="Close"
								class="scale-[1.4]"
							></dv-icon-button>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
