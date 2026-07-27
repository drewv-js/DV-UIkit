import { Component, Element, Host, Method, Prop, Watch, h } from '@stencil/core';
import { arrow, autoUpdate, computePosition, offset, size, flip, platform } from '@floating-ui/dom';
import { offsetParent } from 'composed-offset-position';

/**
 * ## Overview
 * `dv-popup` is a low-level positioning primitive built on top of Floating UI. It anchors a floating
 * panel to a trigger element and handles automatic repositioning on scroll, resize, and layout shifts.
 * It is used internally by components such as `dv-dropdown`, `dv-select`, and `dv-tooltip`.
 *
 * ## Accessibility
 * - `dv-popup` itself does not provide ARIA roles or focus management; parent components are
 *   responsible for communicating open/close state and managing keyboard interactions.
 * - The optional hover bridge maintains hover state between the anchor and popup to prevent
 *   accidental dismissal during mouse traversal.
 *
 * @summary Low-level floating positioning primitive used internally by popover-style components.
 *
 * @tag dv-popup
 *
 * @slot anchor - The trigger element that the popup is anchored to.
 * @slot - The content displayed inside the floating popup panel.
 */
@Component({
	tag: 'dv-popup',
	styleUrl: 'dv-popup.scss',
	shadow: true
})
export class DvPopup {
	private anchorEl: Element | null;
	popup: HTMLElement | null;
	private arrowEl: HTMLElement | null;
	private hoverBridgeEl: HTMLElement | null;
	private cleanup: ReturnType<typeof autoUpdate> | undefined;
	private repositionTimeout: number | undefined;

	/** Reference to the host element */
	@Element() host: HTMLElement;

	/** The open state of the popup, defaults to closed (false) */
	@Prop({ reflect: true }) active: boolean = false;

	/** Position of the popup relative to the anchor */
	@Prop({ reflect: true }) placement:
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

	/** Sets whether popup uses fixed positioning, defaults to absolute */
	@Prop({ reflect: true }) strategy: 'absolute' | 'fixed' = 'absolute';

	/** Determines amount of space between anchor and popup content, defaults to zero */
	@Prop() distance: number = 0;

	/** Syncs sizing of popup content to anchor sizing */
	@Prop() sync: 'width' | 'height' | 'both';

	/** Allows popup to change position on axis to remain in view, defaults to false */
	@Prop() flip: boolean = false;

	/** Sets whether an arrow displays along the bottom edge of the popup */
	@Prop() arrow: boolean = false;

	/** Allows for creation of element between popup and anchor when popup is active to maintain hover state */
	@Prop() hoverBridge: boolean = false;

	@Watch('active')
	watchActive() {
		void this.update('active');
	}

	connectedCallback() {
		this.start();
	}

	async disconnectedCallback() {
		await this.stop();
	}

	/* istanbul ignore next */
	start() {
		if (typeof jest === 'undefined') {
			if (!this.anchorEl || !this.active) {
				return;
			}

			this.cleanup = autoUpdate(
				this.anchorEl,
				this.popup,
				() => {
					// Fix bug FEND-738 where autoUpdate triggers multiple times rapidly
					// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors
					// Debounce to prevent rapid consecutive updates
					if (this.repositionTimeout) {
						cancelAnimationFrame(this.repositionTimeout);
					}

					// Use requestAnimationFrame to defer to next paint cycle
					this.repositionTimeout = requestAnimationFrame(() => {
						void this.reposition();
					});
				},
				{
					// Explicitly configure which events trigger updates
					ancestorResize: true,
					ancestorScroll: true,
					elementResize: true,
					// Only update on actual resize/scroll events, not every animation frame
					animationFrame: false
				}
			);
		}
	}
	private async stop(): Promise<void> {
		return new Promise((resolve) => {
			// Clean up debounce timeout
			if (this.repositionTimeout) {
				cancelAnimationFrame(this.repositionTimeout);
				this.repositionTimeout = undefined;
			}

			if (this.cleanup) {
				this.cleanup();
				this.cleanup = undefined;
				requestAnimationFrame(() => resolve());
			} else {
				resolve();
			}
		});
	}

	private destroyAutoUpdate(): void {
		if (this.repositionTimeout) {
			cancelAnimationFrame(this.repositionTimeout);
			this.repositionTimeout = undefined;
		}

		if (this.cleanup) {
			this.cleanup();
			this.cleanup = undefined;
		}
	}

	private async handleAnchorChange() {
		this.destroyAutoUpdate();

		this.anchorEl = this.host?.querySelector<HTMLElement>('[slot="anchor"]');

		// if anchor is <slot>, dig a layer deeper to set the anchor appropriately (used in the case of nested popups)
		/* istanbul ignore next */
		if (typeof jest === 'undefined') {
			if (this.anchorEl instanceof HTMLSlotElement) {
				this.anchorEl = this.anchorEl.assignedElements({ flatten: true })[0] as HTMLElement;
			}
		}

		if (this.anchorEl && this.active) {
			requestAnimationFrame(() => this.start());
		}
	}

	/* istanbul ignore next */
	private async update(property) {
		if (typeof jest === 'undefined') {
			if (property === 'active') {
				if (this.active) {
					this.start();
				} else {
					this.destroyAutoUpdate();
				}
			}

			if (this.active) {
				await this.reposition();
			}
		}
	}

	/* istanbul ignore next */
	roundByDPR(value) {
		const dpr = window.devicePixelRatio || 1;
		return Math.round(value * dpr) / dpr;
	}

	/* istanbul ignore next */
	/** Recalculates and applies the popup's position relative to its anchor element. */
	@Method()
	async reposition() {
		const middleware = [offset(this.distance)];
		// padding from side of popup container to arrow
		const ARROW_PADDING = 10;
		// width and height of initial arrow box, before rotation and shift
		const ARROW_BOX_SIZE = 10;

		if (this.sync) {
			middleware.push(
				size({
					apply: ({ rects }) => {
						const syncWidth = this.sync === 'width' || this.sync === 'both';
						const syncHeight = this.sync === 'height' || this.sync === 'both';
						this.popup.style.width = syncWidth ? `${rects.reference.width}px` : '';
						this.popup.style.height = syncHeight ? `${rects.reference.height}px` : '';
					}
				})
			);
		} else {
			this.popup.style.width = '';
			this.popup.style.height = '';
		}

		if (this.flip) {
			middleware.push(flip());
		}

		if (this.arrow) {
			middleware.push(
				arrow({
					element: this.arrowEl,
					padding: ARROW_PADDING
				})
			);
		}

		const getOffsetParent =
			this.strategy === 'absolute'
				? (element: Element) => platform.getOffsetParent(element, offsetParent)
				: platform.getOffsetParent;

		computePosition(this.anchorEl, this.popup, {
			placement: this.placement,
			middleware,
			strategy: this.strategy,
			platform: {
				...platform,
				getOffsetParent
			}
		})
			.then(({ x, y, middlewareData, placement }) => {
				Object.assign(this.popup.style, {
					left: '0',
					top: '0',
					transform: `translate(${this.roundByDPR(x)}px,${this.roundByDPR(y)}px)`
				});

				if (this.arrow) {
					const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[placement.split('-')[0]]!;

					const arrowX = middlewareData.arrow.x;
					const arrowY = middlewareData.arrow.y;

					Object.assign(this.arrowEl.style, {
						left: arrowX != null ? `${arrowX}px` : '',
						top: arrowY != null ? `${arrowY}px` : '',
						[staticSide]: `${-ARROW_BOX_SIZE / 2}px`
					});
				}
			})
			.catch(() => {
				console.warn('Popup positioning failed');
			});

		requestAnimationFrame(() => this.updateHoverBridge());
	}

	/* istanbul ignore next */
	updateHoverBridge = () => {
		if (this.hoverBridge && this.anchorEl) {
			const anchorRect = this.anchorEl.getBoundingClientRect();
			const popupRect = this.popup.getBoundingClientRect();
			const isVertical = this.placement.includes('top') || this.placement.includes('bottom');
			let topLeftX = 0;
			let topLeftY = 0;
			let topRightX = 0;
			let topRightY = 0;
			let bottomLeftX = 0;
			let bottomLeftY = 0;
			let bottomRightX = 0;
			let bottomRightY = 0;

			if (isVertical) {
				if (anchorRect.top < popupRect.top) {
					// Anchor is above
					topLeftX = anchorRect.left;
					topLeftY = anchorRect.bottom;
					topRightX = anchorRect.right;
					topRightY = anchorRect.bottom;

					bottomLeftX = popupRect.left;
					bottomLeftY = popupRect.top;
					bottomRightX = popupRect.right;
					bottomRightY = popupRect.top;
				} else {
					// Anchor is below
					topLeftX = popupRect.left;
					topLeftY = popupRect.bottom;
					topRightX = popupRect.right;
					topRightY = popupRect.bottom;

					bottomLeftX = anchorRect.left;
					bottomLeftY = anchorRect.top;
					bottomRightX = anchorRect.right;
					bottomRightY = anchorRect.top;
				}
			} else {
				if (anchorRect.left < popupRect.left) {
					// Anchor is on the left
					topLeftX = anchorRect.right;
					topLeftY = anchorRect.top;
					topRightX = popupRect.left;
					topRightY = popupRect.top;

					bottomLeftX = anchorRect.right;
					bottomLeftY = anchorRect.bottom;
					bottomRightX = popupRect.left;
					bottomRightY = popupRect.bottom;
				} else {
					// Anchor is on the right
					topLeftX = popupRect.right;
					topLeftY = popupRect.top;
					topRightX = anchorRect.left;
					topRightY = anchorRect.top;

					bottomLeftX = popupRect.right;
					bottomLeftY = popupRect.bottom;
					bottomRightX = anchorRect.left;
					bottomRightY = anchorRect.bottom;
				}
			}

			this.hoverBridgeEl.style.setProperty('--hover-bridge-top-left-x', `${topLeftX}px`);
			this.hoverBridgeEl.style.setProperty('--hover-bridge-top-left-y', `${topLeftY}px`);
			this.hoverBridgeEl.style.setProperty('--hover-bridge-top-right-x', `${topRightX}px`);
			this.hoverBridgeEl.style.setProperty('--hover-bridge-top-right-y', `${topRightY}px`);
			this.hoverBridgeEl.style.setProperty('--hover-bridge-bottom-left-x', `${bottomLeftX}px`);
			this.hoverBridgeEl.style.setProperty('--hover-bridge-bottom-left-y', `${bottomLeftY}px`);
			this.hoverBridgeEl.style.setProperty('--hover-bridge-bottom-right-x', `${bottomRightX}px`);
			this.hoverBridgeEl.style.setProperty('--hover-bridge-bottom-right-y', `${bottomRightY}px`);
		}
	};

	render() {
		const displayClass = this.active ? '' : 'hidden';
		return (
			<Host>
				<slot name="anchor" onSlotchange={() => void this.handleAnchorChange()}></slot>
				<span
					ref={(el) => (this.hoverBridgeEl = el)}
					class={`hover-bridge fixed inset-0 ${!(this.hoverBridge && this.active) ? 'hidden' : ''}`}
				></span>
				<div ref={(el) => (this.popup = el)} class={`isolate top-0 left-0 z-40 ${this.strategy} ${displayClass}`}>
					<slot></slot>
					{this.arrow && (
						<div
							ref={(el) => {
								this.arrowEl = el;
							}}
							class={`absolute size-2.5 bg-knockout z-[-1] rotate-45 ${displayClass}`}
							role="presentation"
						></div>
					)}
				</div>
			</Host>
		);
	}
}

