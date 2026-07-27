import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, Watch, h } from '@stencil/core';
import { SHOW_EVENT, HIDE_EVENT, AFTER_SHOW_EVENT, AFTER_HIDE_EVENT } from '../../events';

let id = 0;

/**
 * ## Overview
 * The Tooltip component displays additional information based on specific actions.
 *
 * Tooltips can be displayed in one of twelve positions relative to the target, and include
 * proper ARIA attributes for accessibility.
 *
 * The `<dv-tooltip>` component supports these display patterns:
 * - **Placement**: Positioning of the tooltip popup relative to the target
 *   - top
 *   - top-start
 *   - top-end
 *   - bottom
 *   - bottom-start
 *   - bottom-end
 *   - right
 *   - right-start
 *   - right-end
 *   - left
 *   - left-start
 *   - left-end
 * - **Trigger Control**: Configurable trigger options (one or more)
 *   - hover
 *   - focus
 *   - click
 *   - manual
 * - **Animation**: Smooth entry and exit transitions
 *
 * ## Accessibility
 * - Uses `role="tooltip"`
 * - `aria-live="polite"` for screen readers
 *
 * ## Resources
 * - [WAI-ARIA Tooltip Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-popup>` | Provides underlying popover functionality |
 *
 * @summary A contextual tooltip that displays additional information triggered by hover, focus, or click.
 *
 * @tag dv-tooltip
 *
 * @slot - The target element or component that the tooltip is anchored to.
 */
@Component({
	tag: 'dv-tooltip',
	styleUrl: 'dv-tooltip.scss',
	shadow: true
})
export class DvTooltip {
	private popup: HTMLDvPopupElement;
	private body: HTMLElement;
	private hoverTimeout: number;
	private animationTimeout: number;
	private isAnimating: boolean = false;

	/** Reference to the host element */
	@Element() host: HTMLDvTooltipElement;

	/** The text content to be displayed in the tooltip */
	@Prop() content: string = '';

	/** The open state of the tooltip, defaults to closed (false) */
	@Prop({ mutable: true }) open: boolean = false;

	/** Position of the tooltip relative to the target */
	@Prop() placement:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'right'
		| 'right-start'
		| 'right-end'
		| 'left'
		| 'left-start'
		| 'left-end' = 'top';

	/** Whether the tooltip is disabled, preventing user interaction. */
	@Prop() disabled: boolean = false;

	/** If true, sets the popup positioning strategy to fixed instead of absolute - can be used to get around overflow issues */
	@Prop() hoist: boolean = false;

	/** The trigger type of the tooltip, separated by a space - can be hover, focus, click, manual, or a combination */
	@Prop() trigger: string = 'hover focus';

	/** Maximum width (in rem) of the tooltip popover, allowing optional text wrapping */
	@Prop() maxWidth: number | null = 20;

	/** Emitted when the tooltip is shown. */
	@Event({ eventName: SHOW_EVENT }) show: EventEmitter<void>;

	/** Emitted when the tooltip is hidden. */
	@Event({ eventName: HIDE_EVENT }) hide: EventEmitter<void>;

	/** Emitted after the tooltip is shown. */
	@Event({ eventName: AFTER_SHOW_EVENT }) afterShow: EventEmitter<void>;

	/** Emitted after the tooltip is hidden. */
	@Event({ eventName: AFTER_HIDE_EVENT }) afterHide: EventEmitter<void>;

	private componentId = `tooltip-${++id}`;

	/** @private */
	@Watch('open')
	async handleOpenChange() {
		// Prevent race conditions from multiple open/close calls
		if (this.isAnimating) {
			return;
		}

		if (this.open) {
			if (this.disabled) {
				return;
			}

			this.isAnimating = true;

			try {
				// Show
				this[SHOW_EVENT].emit();
				document.addEventListener('keydown', this.handleDocumentKeyDown);

				await this.stopAnimations();
				this.body.hidden = false;
				this.popup.active = true;

				const config = this.getAnimationConfig('show');
				await this.animateTooltip(config);

				this[AFTER_SHOW_EVENT].emit();
			} catch (error) {
				console.warn('dv-tooltip show animation failed:', error);
			} finally {
				this.isAnimating = false;
			}
		} else {
			this.isAnimating = true;

			try {
				// Hide
				this[HIDE_EVENT].emit();
				document.removeEventListener('keydown', this.handleDocumentKeyDown);

				await this.stopAnimations();

				const config = this.getAnimationConfig('hide');
				await this.animateTooltip(config);

				this.popup.active = false;
				this.body.hidden = true;

				this[AFTER_HIDE_EVENT].emit();
			} catch (error) {
				console.warn('dv-tooltip hide animation failed:', error);
			} finally {
				this.isAnimating = false;
			}
		}
	}

	/** @private */
	@Watch('content')
	@Watch('hoist')
	@Watch('placement')
	handleOptionsChange() {
		void this.popup.reposition();
	}

	/** @private */
	@Watch('disabled')
	handleDisabledChange() {
		if (this.disabled && this.open) {
			void this.tooltipHide();
		}
	}

	/** Displays the tooltip with animation. */
	@Method()
	async tooltipShow() {
		if (this.open) {
			return undefined;
		}

		this.open = true;
	}

	/** Removes the tooltip with animation. */
	@Method()
	async tooltipHide() {
		if (!this.open) {
			return undefined;
		}

		this.open = false;
	}

	/** @private */
	connectedCallback() {
		this.host.addEventListener('focus', this.handleFocus, true);
		this.host.addEventListener('blur', this.handleBlur, true);
		this.host.addEventListener('click', this.handleClick);
		this.host.addEventListener('mouseover', this.handleMouseOver);
		this.host.addEventListener('mouseout', this.handleMouseOut);
	}

	/** @private */
	disconnectedCallback() {
		this.host.removeEventListener('focus', this.handleFocus, true);
		this.host.removeEventListener('blur', this.handleBlur, true);
		this.host.removeEventListener('click', this.handleClick);
		this.host.removeEventListener('mouseover', this.handleMouseOver);
		this.host.removeEventListener('mouseout', this.handleMouseOut);
		document.removeEventListener('keydown', this.handleDocumentKeyDown);

		// Clean all timeouts
		if (this.hoverTimeout) {
			/** @private */
			clearTimeout(this.hoverTimeout);
			this.hoverTimeout = undefined;
		}
		if (this.animationTimeout) {
			/** @private */
			clearTimeout(this.animationTimeout);
			this.animationTimeout = undefined;
		}
		// Reset animation state
		this.isAnimating = false;
	}

	/** @private */
	hasTrigger(triggerType: string) {
		const triggers = this.trigger.split(' ');
		return triggers.includes(triggerType);
	}

	/* istanbul ignore next */
	handleFocus = () => {
		if (this.hasTrigger('focus')) {
			void this.tooltipShow();
		}
	};

	/* istanbul ignore next */
	handleBlur = () => {
		if (this.hasTrigger('focus')) {
			void this.tooltipHide();
		}
	};

	/* istanbul ignore next */
	handleClick = () => {
		if (this.hasTrigger('click')) {
			if (this.open) {
				void this.tooltipHide();
			} else {
				void this.tooltipShow();
			}
		}
	};

	handleDocumentKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			event.stopPropagation();
			void this.tooltipHide();
		}
	};

	/* istanbul ignore next */
	handleMouseOver = () => {
		if (this.hasTrigger('hover')) {
			/** @private */
			clearTimeout(this.hoverTimeout);
			this.hoverTimeout = window.setTimeout(() => void this.tooltipShow(), 150);
		}
	};

	/* istanbul ignore next */
	handleMouseOut = () => {
		if (this.hasTrigger('hover')) {
			/** @private */
			clearTimeout(this.hoverTimeout);
			this.hoverTimeout = window.setTimeout(() => void this.tooltipHide(), 0);
		}
	};

	private async stopAnimations(): Promise<void> {
		// Stop animations on the body element, similar to Shoelace
		/* istanbul ignore next */
		if (typeof jest === 'undefined' && this.body) {
			const animations = this.body.getAnimations();
			animations.forEach((animation) => animation.cancel());
		}
		return Promise.resolve();
	}

	/* istanbul ignore next */
	private getTransformOrigin(): string {
		const placement = this.placement.split('-')[0];
		switch (placement) {
			case 'top':
				return 'bottom';
			case 'bottom':
				return 'top';
			case 'left':
				return 'right';
			case 'right':
				return 'left';
			default:
				return 'center';
		}
	}

	/* istanbul ignore next */
	private getAnimationConfig(type: 'show' | 'hide') {
		const baseConfig = {
			duration: 150,
			transition: 'opacity 150ms ease, transform 150ms ease'
		};

		if (type === 'show') {
			return {
				...baseConfig,
				initialScale: 0.8,
				finalScale: 1,
				initialOpacity: '0',
				finalOpacity: '1'
			};
		}

		return {
			...baseConfig,
			initialScale: 1,
			finalScale: 0.8,
			initialOpacity: '1',
			finalOpacity: '0'
		};
	}

	/* istanbul ignore next */
	private async animateTooltip(config: ReturnType<typeof this.getAnimationConfig>): Promise<void> {
		const popupElement = this.popup.shadowRoot?.querySelector('div[class*="isolate"]') as HTMLElement;
		if (!popupElement) return;

		// Reposition first
		if (config.finalScale === 1) {
			await this.popup.reposition();
		}

		return new Promise<void>((resolve) => {
			/** @private */
			requestAnimationFrame(() => {
				// Set transform origin and get current positioning
				const transformOrigin = this.getTransformOrigin();
				popupElement.style.transformOrigin = transformOrigin;
				// Get current transform and adjust for existing scale if hiding
				let currentTransform = popupElement.style.transform;
				if (config.finalScale === 0.8) {
					currentTransform = currentTransform.replace(/\s*scale\([^)]*\)/, '');
				}
				// Apply initial state without transition
				popupElement.style.transition = 'none';
				popupElement.style.transform = `${currentTransform} scale(${config.initialScale})`;
				popupElement.style.opacity = config.initialOpacity;
				// Force reflow
				popupElement.offsetHeight;
				// Animate to final state
				/** @private */
				requestAnimationFrame(() => {
					popupElement.style.transition = config.transition;
					popupElement.style.transform = `${currentTransform} scale(${config.finalScale})`;
					popupElement.style.opacity = config.finalOpacity;
					// Wait for animation to complete
					this.animationTimeout = window.setTimeout(() => {
						if (config.finalScale === 0.8) {
							popupElement.style.transition = '';
							popupElement.style.opacity = '';
							popupElement.style.transform = currentTransform;
							popupElement.style.transformOrigin = '';
						}
						this.animationTimeout = undefined;
						/** @private */
						resolve();
					}, config.duration);
				});
			});
		});
	}

	/** @private */
	render() {
		let maxWidthString = '';
		maxWidthString = this.maxWidth ? `${this.maxWidth}rem` : '';

		return (
			<Host>
				<dv-popup
					ref={(el) => (this.popup = el)}
					distance={10}
					placement={this.placement}
					strategy={this.hoist ? 'fixed' : 'absolute'}
					arrow
					hoverBridge
				>
					<span slot="anchor" aria-describedby={this.componentId} class="inline-block w-fit">
						<slot></slot>
					</span>
					<div
						ref={(el) => (this.body = el)}
						id={this.componentId}
						role="tooltip"
						class={`block ${this.maxWidth ? '' : 'w-max'} text-start rounded-radius-lg bg-status-neutral-knockout text-status-neutral-knockout px-4 py-2 body-default pointer-events-none z-60`}
						aria-live={this.open ? 'polite' : 'off'}
						style={{ maxWidth: `${this.maxWidth ? maxWidthString : ''}` }}
					>
						<slot name="content">{this.content}</slot>
					</div>
				</dv-popup>
			</Host>
		);
	}
}

