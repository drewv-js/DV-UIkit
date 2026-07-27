import type { EventEmitter } from '@stencil/core';
import { Component, Host, h, State, Method, Prop, Element, Watch, Event } from '@stencil/core';
import type { FocusTrap } from '../../internal/a11y';
import { createFocusTrap, setupSlotChangeHandlers } from '../../internal/a11y';
import { SHOW_EVENT, HIDE_EVENT, REQUEST_CLOSE_EVENT } from '../../events';
import type { RequestCloseEventDetail } from '../../events';

/**
 * ## Overview
 * The Dialog component creates an accessible modal overlay for focused user interactions. It manages focus trapping,
 * keyboard navigation, and provides smooth animations for entry and exit.
 *
 * The dialog supports both **simple** and **complex** interaction patterns through its flexible slot system.
 *
 * The `footer` slot allows for action buttons, while the default slot handles the main content.
 * Animation timing and easing are carefully tuned for a smooth user experience.
 *
 * Use the `closable` prop to control how users can dismiss the dialog: when `closable` is `true`, you can close it with the header close button, the Escape key, or an outside click; when `false`, dismissal must come from actions inside the dialog.
 *
 * The `<dv-dialog>` component supports several key features:
 * - **Fixed Sizes**: `sm` (31.25rem) or `md` (43.75rem) — widths are not overridable
 * - **Responsive Height**: Minimum 13.25rem, maximum `calc(100vh - 0.375rem)` (3rem top/bottom)
 * - **Keyboard Navigation**: Escape to close, tab trap for focus
 * - **Click Outside**: Dismissible by clicking overlay
 * - **Custom Headers**: Optional `label` and `subtitle` props
 * - **Action Footer**: Dedicated slot for buttons/actions
 * - **Sticky Regions**: Header and footer stay fixed; only the body scrolls
 * - **Animated States**: Smooth entry/exit transitions
 *
 * ## Accessibility
 * - Uses `dialog` role with proper ARIA attributes
 * - Traps focus when open for keyboard navigation
 * - Supports Escape key for dismissal
 * - Maintains proper focus management
 * - Returns focus to trigger element on close
 * - View [Accessibility](/docs/accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
 * - [MDN Dialog Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
 *
 * @summary An accessible modal dialog with focus trapping, keyboard navigation, and animated transitions.
 *
 * @tag dv-dialog
 *
 * @slot - Default slot for the main dialog content
 * @slot footer - Slot for action buttons and footer content
 */
@Component({
	tag: 'dv-dialog',
	styleUrl: 'dv-dialog.scss',
	shadow: true
})
export class DvDialog {
	@Element() el: HTMLDvDialogElement;

	/** @internal */
	@State() isOpen: boolean = false;

	/** Controls whether the dialog is open or closed. */
	@Prop({ reflect: true }) open: boolean = false;

	/** The label/title displayed in the dialog header. */
	@Prop({ reflect: true }) label = '';

	/** Optional subtitle displayed beneath the label in the dialog header. */
	@Prop({ reflect: true }) subtitle = '';

	/** Controls whether the dialog can be dismissed by the user (close button, overlay click, Escape key). Defaults to `true`. */
	@Prop({ reflect: true }) closable: boolean = true;

	/**
	 * __⚠️@deprecated The prop 'noClose' is deprecated as of v1.8.0.__ Use the `closable` prop with value `false` instead.
	 *
	 * @since 0.12.0 - Initial introduction of noClose prop
	 * @since 1.8.0 - noClose prop deprecated, use closable={false} instead
	 */
	@Prop({ reflect: true }) noClose: boolean = false;

	/** Size variant of the dialog. Accepts `'sm'` (33.25rem) or `'md'` (43.75rem). Widths are fixed and not overridable. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	private panel: HTMLElement;
	private overlay: HTMLElement;
	private bodySlot: HTMLSlotElement;
	private footerSlot: HTMLSlotElement;
	private focusTrap: FocusTrap | null = null;
	private slotCleanup: (() => void) | null = null;
	private focusTrapOptions = {
		autoFocus: false
	};

	/** @internal */
	@State() isHiding: boolean = false;

	/** Emitted when the dialog opens */
	@Event({ eventName: SHOW_EVENT }) show!: EventEmitter<void>;

	/** Emitted when the dialog closes */
	@Event({ eventName: HIDE_EVENT }) hide!: EventEmitter<void>;

	/** Emitted when dialog close is requested with the source of the request */
	@Event({ eventName: REQUEST_CLOSE_EVENT }) requestClose!: EventEmitter<RequestCloseEventDetail>;

	/**
	 * @private
	 */
	@Watch('open')
	async watchOpen(newValue: boolean) {
		if (this.isHiding) return;
		this.isOpen = newValue;
		if (this.isOpen) {
			await this.dialogShow();
		} else {
			await this.dialogHide();
		}
	}

	/** @private */
	componentWillLoad() {
		this.isOpen = this.open;
		if (this.isOpen) {
			document.body.style.overflow = 'hidden';
		}
	}

	/** @private */
	disconnectedCallback() {
		this.cleanupAccessibility();
		document.removeEventListener('keydown', this.handleKeyDown);
	}

	/** Clean up focus trap and related accessibility resources */
	private cleanupAccessibility() {
		if (this.focusTrap) {
			this.focusTrap.deactivate();
			this.focusTrap = null;
		}

		if (this.slotCleanup) {
			this.slotCleanup();
			this.slotCleanup = null;
		}
	}

	/** Initialize and activate focus trap  */
	private async setupAccessibility() {
		// Clean up any existing trap first
		this.cleanupAccessibility();

		if (!this.panel) return;

		try {
			// Create the focus trap
			this.focusTrap = createFocusTrap({
				rootElement: this.panel,
				...this.focusTrapOptions
			});

			if (this.bodySlot || this.footerSlot) {
				const slots = [this.bodySlot, this.footerSlot].filter(Boolean);
				if (slots.length > 0 && this.focusTrap) {
					this.slotCleanup = setupSlotChangeHandlers(this.focusTrap, slots);
				}
			}

			await new Promise((resolve) => setTimeout(resolve, 50));
			// Activate the focus trap
			if (this.focusTrap) {
				this.focusTrap.activate();
			}
		} catch (error) {
			console.error('Error initializing accessibility:', error);
		}
	}

	/** Public method to show the dialog. */
	@Method()
	async dialogShow() {
		this.isOpen = true;
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', this.handleKeyDown);
		await new Promise((resolve) => requestAnimationFrame(resolve));
		await this.animateDialog('dialog.show', 'dialog.overlay.show');

		this[SHOW_EVENT].emit();
		await this.setupAccessibility();
	}

	/** Public method to hide the dialog. */
	@Method()
	async dialogHide() {
		if (this.isHiding) return;
		this.isHiding = true;
		this.cleanupAccessibility();
		await new Promise((resolve) => requestAnimationFrame(resolve));
		await this.animateDialog('dialog.hide', 'dialog.overlay.hide');
		this.isOpen = false;
		document.body.style.overflow = 'auto';
		document.removeEventListener('keydown', this.handleKeyDown);

		this[HIDE_EVENT].emit();
		this.isHiding = false;
	}

	/** Animate the dialog and overlay */
	private async animateDialog(dialogAnimation: string, overlayAnimation: string) {
		const panelAnimation = this.getAnimation(dialogAnimation);
		const overlayAnimationConfig = this.getAnimation(overlayAnimation);
		if (this.panel && this.overlay) {
			await Promise.all([
				this.animateTo(this.panel, panelAnimation.keyframes, panelAnimation.options),
				this.animateTo(this.overlay, overlayAnimationConfig.keyframes, overlayAnimationConfig.options)
			]);
		}
	}

	/** Get animation configuration */
	private getAnimation(animationName: string) {
		const animations = {
			'dialog.show': {
				keyframes: [
					{ opacity: 0, transform: 'scale(0.8)' },
					{ opacity: 1, transform: 'scale(1)' }
				],
				options: { duration: 250, easing: 'ease' }
			},
			'dialog.hide': {
				keyframes: [
					{ opacity: 1, transform: 'scale(1)' },
					{ opacity: 0, transform: 'scale(0.8)' }
				],
				options: { duration: 250, easing: 'ease' }
			},
			'dialog.overlay.show': {
				keyframes: [{ opacity: 0 }, { opacity: 1 }],
				options: { duration: 250 }
			},
			'dialog.overlay.hide': {
				keyframes: [{ opacity: 1 }, { opacity: 0 }],
				options: { duration: 250 }
			},
			'dialog.shake': {
				keyframes: [
					{ transform: 'translateX(0)' },
					{ transform: 'translateX(-5px)' },
					{ transform: 'translateX(5px)' },
					{ transform: 'translateX(0)' }
				],
				options: { duration: 300, easing: 'ease-in-out' }
			}
		};

		return animations[animationName] || { keyframes: [], options: {} };
	}

	/** Animate to a specific element */
	private async animateTo(element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
		if (element) {
			const animation = element.animate(keyframes, options);
			return new Promise<void>((resolve) => {
				animation.onfinish = () => resolve();
			});
		} else {
			return Promise.resolve();
		}
	}

	/** Handles the close button click event. */
	private handleCloseButtonClick = () => {
		this.handleRequestClose('close-button');
	};

	/** Handles the overlay click event to close the dialog. */
	private handleOverlayClick = (_event: MouseEvent) => {
		this.handleRequestClose('overlay');
	};

	/** Handles keyboard events for closing the dialog. */
	private handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.handleRequestClose('keyboard');
		}
	};

	/** Requests to close the dialog and emits a custom event. */
	private handleRequestClose(source: 'close-button' | 'keyboard' | 'overlay') {
		// Either restriction blocks user-driven dismissal during the noClose deprecation period.
		// Mirrors the render-side `isClosable` check so X-button visibility and overlay/Esc behavior stay in sync.
		if (this.noClose || !this.closable) {
			void this.shakeDialog();
			return;
		}
		const closeEvent = this[REQUEST_CLOSE_EVENT].emit({ source });
		// If the event is not prevented, close the dialog.
		if (!closeEvent.defaultPrevented) {
			void this.dialogHide();
		} else {
			void this.shakeDialog();
		}
	}

	/** Triggers the shake animation on the dialog */
	private async shakeDialog() {
		if (this.panel) {
			const shakeAnimation = this.getAnimation('dialog.shake');
			await this.animateTo(this.panel, shakeAnimation.keyframes, shakeAnimation.options);
		}
	}

	/** @internal */
	render() {
		const isClosable = !this.noClose && this.closable;
		const widthClass = this.size === 'sm' ? 'w-[31.25rem]' : 'w-[43.75rem]';
		const hasHeader = !!this.label || !!this.subtitle || isClosable;
		const hasFooter = !!this.el.querySelector('[slot="footer"]');

		return (
			<Host>
				{/*
				 * Note: `bg-transparent` overrides the native `background-color: Canvas` user-agent style.
				 * Future: explore leveraging native Canvas behavior instead.
				 * Details: https://oeconnection.atlassian.net/browse/FEND-754
				 */}
				<dialog
					class={this.isOpen ? 'flex items-center justify-center fixed inset-0 z-50 p-4 w-full bg-transparent' : ''}
				>
					{/* Overlay click-to-dismiss is a mouse-only convenience; keyboard users close via Escape per ARIA APG */}
					{this.isOpen && (
						<div
							class="fixed inset-0 bg-overlay-default z-60 transition-opacity"
							onClick={this.handleOverlayClick}
							ref={(el) => (this.overlay = el as HTMLElement)}
						></div>
					)}

					{/* Dialog */}
					{/* Note: tabIndex={0} on dialog panel is a fallback for when no focusable elements exist (e.g., noClose prop) */}
					{this.isOpen && (
						<div
							id="basic-modal"
							class={`static z-60 ${widthClass} max-w-full min-h-[13.25rem] max-h-[calc(100vh-0.375rem)] rounded-radius-lg shadow-sm-bottom focus:outline-none flex flex-col bg-default`}
							role="dialog"
							aria-modal="true"
							tabIndex={0}
							ref={(el) => (this.panel = el as HTMLElement)}
						>
							{/* Header — sticky/fixed at top, fixed height (content-driven) */}
							{hasHeader && (
								<div class="flex-none p-4 border-b border-default">
									<div class="flex justify-between items-center gap-2">
										<div class="flex-1 min-w-0">
											{this.label && <h4 class="title-sm text-default">{this.label}</h4>}
											{this.subtitle && <p class="body-sm text-subtle mt-1">{this.subtitle}</p>}
										</div>
										{isClosable && (
											<dv-icon-button
												name="close"
												size="xs"
												class="text-default"
												onClick={this.handleCloseButtonClick}
											></dv-icon-button>
										)}
									</div>
								</div>
							)}

							{/* Body — only scrollable region */}
							<div class="flex-1 overflow-auto p-4 gap-6 body-default text-default">
								<slot ref={(el) => (this.bodySlot = el as HTMLSlotElement)}></slot>
							</div>

							{/* Footer — sticky/fixed at bottom, fixed height (content-driven) */}
							{hasFooter && (
								<div class="flex-none p-4 border-t border-default">
									<div class="flex flex-wrap justify-end space-x-2">
										<slot name="footer" ref={(el) => (this.footerSlot = el as HTMLSlotElement)}></slot>
									</div>
								</div>
							)}
						</div>
					)}
				</dialog>
			</Host>
		);
	}
}

