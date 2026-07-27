import type { EventEmitter } from '@stencil/core';
import { Component, Host, h, State, Method, Prop, Element, Watch, Event } from '@stencil/core';
import type { FocusTrap } from '../../internal/a11y';
import { createFocusTrap, setupSlotChangeHandlers } from '../../internal/a11y';
import { SHOW_EVENT, HIDE_EVENT, REQUEST_CLOSE_EVENT } from '../../events';
import type { RequestCloseEventDetail } from '../../events';

/**
 * ## Overview
 * The Drawer component provides a sliding panel that appears from the right edge of the screen, creating a temporary
 * content area for tasks, details, or forms. It implements focus management, keyboard interactions, and smooth
 * transitions for a polished user experience.
 *
 * The component handles complex interactions including overlay management, focus trapping, and proper ARIA roles
 * for accessibility compliance.
 *
 * When opened, the drawer maintains focus within its boundaries and provides multiple ways to dismiss,
 * including an optional close button, overlay click, and keyboard escape.
 *
 * The `<dv-drawer>` component includes these interaction patterns:
 * - **Entry Animation**: Slides in from right with fade overlay
 * - **Exit Animation**: Slides out to right with fade overlay
 * - **Focus Management**: Traps focus within drawer while open
 * - **Keyboard Support**: Escape key dismissal
 * - **Click Handling**: Overlay click to close
 * - **Footer Actions**: Optional bottom-aligned content
 *
 * ## Accessibility
 * - Uses `role="dialog"` with `aria-modal="true"`
 * - Implements focus trapping while open
 * - Supports Escape key for dismissal
 * - Provides `aria-label` for screen readers
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
 *
 * @summary An accessible sliding drawer panel with focus trapping, keyboard navigation, and animated transitions.
 *
 * @tag dv-drawer
 *
 * @slot - Main content area of the drawer.
 * @slot title - Content displayed at the start of the header of the drawer.
 * @slot actions - Content displayed at the end of the header of the drawer before the close button.
 * @slot footer - Content displayed at the bottom of the drawer.
 */
@Component({
	tag: 'dv-drawer',
	styleUrl: 'dv-drawer.scss',
	shadow: true
})
export class DvDrawer {
	@Element() el: HTMLDvDrawerElement;

	/** State to track if the drawer is open. */
	@State() isOpen: boolean = false;

	/** Indicates whether or not the drawer is open. */
	@Prop({ reflect: true }) open: boolean = false;

	/** The label for the aria label. */
	@Prop({ reflect: true }) label = '';

	/** Determines whether the close button is shown. */
	@Prop({ reflect: true }) noClose: boolean = false;

	private panel: HTMLElement;
	private overlay: HTMLElement;
	private bodySlot: HTMLSlotElement;
	private titleSlot: HTMLSlotElement;
	private actionsSlot: HTMLSlotElement;
	private footerSlot: HTMLSlotElement;
	private focusTrap: FocusTrap | null = null;
	private slotCleanup: (() => void) | null = null;
	private focusTrapOptions = {
		autoFocus: false
	};

	/** Track pending operations to prevent conflicts */
	@State() isAnimating: boolean = false;
	private pendingOperation: 'show' | 'hide' | null = null;

	/** Emitted when the drawer opens */
	@Event({ eventName: SHOW_EVENT }) show: EventEmitter<void>;

	/** Emitted when the drawer closes */
	@Event({ eventName: HIDE_EVENT }) hide: EventEmitter<void>;

	/** Emitted when drawer close is requested with the source of the request */
	@Event({ eventName: REQUEST_CLOSE_EVENT }) requestClose: EventEmitter<RequestCloseEventDetail>;

	/** Watches for changes to the 'open' property and updates the drawer state accordingly. */
	/** @private */
	@Watch('open')
	async watchOpen(newValue: boolean) {
		// If ongoing animating, ignore
		if (
			this.isAnimating &&
			((newValue && this.pendingOperation === 'show') || (!newValue && this.pendingOperation === 'hide'))
		) {
			return;
		}

		// Cancel any pending operation and start new one
		if (newValue) {
			this.pendingOperation = 'show';
			await this.drawerShow();
		} else {
			this.pendingOperation = 'hide';
			await this.drawerHide();
		}
	}

	/** Sets the initial state of the drawer based on the 'open' property before the component loads. */
	/** @private */
	componentWillLoad() {
		this.isOpen = this.open;
		if (this.isOpen) {
			document.body.style.overflow = 'hidden';
		}
	}

	/**
	 * Clean up event listeners when the component is removed
	 */
	/** @private */
	disconnectedCallback() {
		this.cleanupAccessibility();
		document.removeEventListener('keydown', this.handleKeyDown);
	}

	/**
	 * Clean up focus trap and related resources
	 */
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

	/**
	 * Initialize and activate the focus trap with proper timing
	 */
	private async setupAccessibility() {
		// Clean up any existing focus trap
		this.cleanupAccessibility();
		if (!this.panel) return;
		try {
			// Create the focus trap with the panel as the root element
			this.focusTrap = createFocusTrap({
				rootElement: this.panel,
				...this.focusTrapOptions
			});
			// Setup slot change handlers right after creating the focus trap
			if (this.bodySlot || this.footerSlot || this.titleSlot || this.actionsSlot) {
				const slots = [this.bodySlot, this.footerSlot, this.titleSlot, this.actionsSlot].filter(Boolean);
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
			console.error('Error setting up accessibility features:', error);
		}
	}

	/** Public method to show the drawer. */
	@Method()
	async drawerShow() {
		// Prevent multiple simultaneous show operations
		if (this.isAnimating && this.pendingOperation === 'show') return;

		this.isAnimating = true;
		this.pendingOperation = 'show';
		this.isOpen = true;

		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', this.handleKeyDown);

		await new Promise((resolve) => requestAnimationFrame(resolve));
		await this.animateDialog('drawer.show', 'drawer.overlay.show');

		this[SHOW_EVENT].emit();

		// Setup accessibility features
		await this.setupAccessibility();

		this.isAnimating = false;
		this.pendingOperation = null;
	}

	/** Public method to hide the drawer. */
	@Method()
	async drawerHide() {
		// Prevent multiple simultaneous hide operations
		if (this.isAnimating && this.pendingOperation === 'hide') return;

		this.isAnimating = true;
		this.pendingOperation = 'hide';

		// Clean up accessibility features
		this.cleanupAccessibility();

		await new Promise((resolve) => requestAnimationFrame(resolve));
		await this.animateDialog('drawer.hide', 'drawer.overlay.hide');

		// Update state after animation
		this.isOpen = false;
		document.body.style.overflow = 'auto';
		document.removeEventListener('keydown', this.handleKeyDown);

		this[HIDE_EVENT].emit();

		this.isAnimating = false;
		this.pendingOperation = null;
	}

	/** Animate the drawer and overlay */
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
			'drawer.show': {
				keyframes: [
					{ opacity: 0, transform: 'translateX(100%)' },
					{ opacity: 1, transform: 'translateX(0)' }
				],
				options: { duration: 250, easing: 'ease', fill: 'forwards' }
			},
			'drawer.hide': {
				keyframes: [
					{ opacity: 1, transform: 'translateX(0)' },
					{ opacity: 0, transform: 'translateX(100%)' }
				],
				options: { duration: 250, easing: 'ease', fill: 'forwards' }
			},
			'drawer.overlay.show': {
				keyframes: [{ opacity: 0 }, { opacity: 1 }],
				options: { duration: 250, fill: 'forwards' }
			},
			'drawer.overlay.hide': {
				keyframes: [{ opacity: 1 }, { opacity: 0 }],
				options: { duration: 250, fill: 'forwards' }
			}
		};

		return animations[animationName] ?? { keyframes: [], options: {} };
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

	/** Handles the overlay click event to close the drawer. */
	private handleOverlayClick = (_event: MouseEvent) => {
		this.handleRequestClose('overlay');
	};

	/** Handles keyboard events for closing the drawer. */
	private handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.handleRequestClose('keyboard');
		}
	};

	/** Requests to close the drawer and dispatches a custom event. */
	private handleRequestClose(source: RequestCloseEventDetail['source']) {
		const closeEvent = this[REQUEST_CLOSE_EVENT].emit({ source });
		if (!closeEvent.defaultPrevented) {
			void this.drawerHide();
		}
	}

	/** @private */
	render() {
		// Check if Footer and Actions slots are filled
		const hasFooter = !!this.el.querySelector('[slot="footer"]');
		const hasActions = !!this.el.querySelector('[slot="actions"]');

		return (
			<Host>
				<div class={this.isOpen ? 'flex items-center justify-center fixed inset-0 z-50' : ''}>
					{/* Overlay */}
					{/* Overlay click-to-dismiss is a mouse-only convenience; keyboard users close via Escape per ARIA APG */}
					{this.isOpen && (
						<div
							class="fixed inset-0 bg-overlay-default z-60"
							onClick={this.handleOverlayClick}
							ref={(el) => (this.overlay = el as HTMLElement)}
						></div>
					)}

					{/* Drawer */}
					{/* Note: tabIndex={0} on drawer panel is a fallback for when no focusable elements exist (e.g., noClose prop) */}
					{this.isOpen && (
						<div
							id="basic-drawer"
							class="fixed right-0 h-full w-[28rem] bg-default shadow-sm-left z-60 flex flex-col focus:outline-none max-w-full"
							role="dialog"
							aria-modal="true"
							aria-label={this.label || 'Drawer'}
							tabIndex={0}
							ref={(el) => {
								this.panel = el as HTMLElement;
							}}
						>
							{/* Header */}
							{!(this.noClose && !this.label) && (
								<div class="p-4 flex items-start title-default text-default">
									<div class="flex-auto">
										<slot name="title" ref={(el) => (this.titleSlot = el as HTMLSlotElement)}></slot>
									</div>
									{/* Conditionally render Actions container */}
									{hasActions && (
										<div class="p-2">
											<slot name="actions" ref={(el) => (this.actionsSlot = el as HTMLSlotElement)}></slot>
										</div>
									)}
									{!this.noClose && (
										<dv-icon-button
											name="close"
											size="xs"
											class="flex-none"
											onClick={this.handleCloseButtonClick}
										></dv-icon-button>
									)}
								</div>
							)}

							{/* Body */}
							{/* Note: tabindex={-1} allows programmatic focus for long scrollable content without adding to tab order */}
							<div tabindex={-1} class="px-7 flex-1 overflow-auto body-default text-default">
								<slot ref={(el) => (this.bodySlot = el as HTMLSlotElement)}></slot>
							</div>

							{/* Footer */}
							{/* Conditionally render Footer Section */}
							{hasFooter && (
								<div class="py-7 px-5 flex justify-end">
									<slot name="footer" ref={(el) => (this.footerSlot = el as HTMLSlotElement)}></slot>
								</div>
							)}
						</div>
					)}
				</div>
			</Host>
		);
	}
}

