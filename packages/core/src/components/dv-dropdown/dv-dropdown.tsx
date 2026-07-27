import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import type { DvMenu } from '../dv-menu/dv-menu';
import type { DvMenuItem } from '../dv-menu-item/dv-menu-item';

/**
 * ## Overview
 * The Dropdown component creates an accessible popup menu that can be triggered by any element. It manages positioning,
 * keyboard navigation, focus management, and provides smooth animations.
 *
 * The component handles complex positioning logic and maintains proper focus management while providing a flexible
 * system for dropdown content through slots.
 *
 * When opened, the dropdown ensures proper keyboard navigation and accessibility compliance while managing
 * overlay interactions and click-outside behavior.
 *
 * The `<dv-dropdown>` component supports these interaction patterns:
 * - **Positioning**: 12 placement options for flexible layout
 * - **Animation**: Smooth entry/exit transitions
 * - **Focus Control**: Maintains focus between trigger and content
 * - **Keyboard Nav**: Arrow keys, Home, End support
 * - **Click Outside**: Automatic dismissal handling
 * - **Menu Integration**: Optional dv-menu component support
 *
 * ## Accessibility
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Escape key closes dropdown
 * - Focus management between trigger and content
 * - ARIA attributes for visibility state
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
 * - [dv-menu](/docs/components-menu--docs)
 *
 * @summary An accessible dropdown popup that positions content relative to a trigger element with keyboard navigation and smooth animations.
 *
 * @tag dv-dropdown
 *
 * @slot trigger - Element that triggers the dropdown.
 * @slot - Content displayed in the dropdown panel.
 */
@Component({
	tag: 'dv-dropdown',
	styleUrl: 'dv-dropdown.scss',
	shadow: true
})
export class DvDropdown {
	private popup: HTMLDvPopupElement;
	private panel: HTMLSlotElement;
	private trigger: HTMLSlotElement;
	private menu: DvMenu;
	private menuItems: DvMenuItem[];

	@Element() host: HTMLDvDropdownElement;

	/** Controls whether the dropdown panel is open. */
	@Prop({ mutable: true }) open: boolean = false;

	/** The preferred placement of the dropdown panel relative to the trigger. Supports 12 positions. */
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
		| 'left-end' = 'bottom';

	/** Disables the dropdown, preventing it from opening. */
	@Prop() disabled: boolean = false;

	/** @private */
	@Watch('open')
	async watchOpen() {
		if (this.disabled) {
			this.open = false;
			return;
		}

		if (this.open) {
			this.addListeners();
			this.panel.hidden = false;
			this.popup.active = true;

			const { keyframes, options } = this.getAnimation('dropdown.show');
			await Promise.resolve(this.animateTo(this.popup?.shadowRoot?.querySelector('div'), keyframes, options));
		} else {
			this.removeListeners();
			this.panel.hidden = true;
			this.popup.active = false;

			const { keyframes, options } = this.getAnimation('dropdown.hide');
			await Promise.resolve(this.animateTo(this.popup?.shadowRoot?.querySelector('div'), keyframes, options));
		}
	}

	/** @private */
	focusOnTrigger() {
		const trigger = this.trigger.assignedElements?.({ flatten: true })[0] as HTMLElement | undefined;
		if (typeof trigger?.focus === 'function') {
			trigger.focus();
		}
	}

	/** @private */
	getMenu() {
		return this.panel
			.assignedElements?.({ flatten: true })
			.find((el) => el.tagName.toLowerCase() === 'dv-menu') as unknown as DvMenu | undefined;
	}

	/* istanbul ignore next */
	/** @private */
	addListeners() {
		this.panel.addEventListener('menu-select', this.handlePanelSelect);
		this.panel.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keydown', this.handleDocumentKeyDown);
		document.addEventListener('mousedown', this.handleDocumentMouseDown);
	}

	/* istanbul ignore next */
	/** @private */
	removeListeners() {
		this.panel.removeEventListener('menu-select', this.handlePanelSelect);
		this.panel.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener('keydown', this.handleDocumentKeyDown);
		document.removeEventListener('mousedown', this.handleDocumentMouseDown);
	}

	/** @private */
	async show() {
		if (this.open) return;

		this.open = true;
	}

	/** @private */
	async hide() {
		if (!this.open) return;

		this.open = false;
	}

	/* istanbul ignore next */
	/** @private */
	async handleContentSlotChange() {
		this.menu = this.getMenu();
		if (this.menu) {
			this.menuItems = await this.menu.menuGetMenuItems();
		}
	}

	/* istanbul ignore next */
	handleTriggerClick = () => {
		if (this.open) {
			void this.hide();
		} else {
			void this.show();
			this.focusOnTrigger();
		}
	};

	/* istanbul ignore next */
	handleTriggerKeyDown = (event: KeyboardEvent) => {
		if ([' ', 'Enter'].includes(event.key)) {
			event.preventDefault();
			this.handleTriggerClick();
			return;
		}

		if (this.menu) {
			const firstMenuItem = this.menuItems[0];
			const lastMenuItem = this.menuItems[this.menuItems.length - 1];

			if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
				event.preventDefault();

				if (!this.open) () => this.show();

				if (this.menuItems.length > 0) {
					if (event.key === 'ArrowUp' || event.key === 'Home') {
						void this.menu.menuSetCurrentItem(firstMenuItem);
						void firstMenuItem.setFocus();
					}

					if (event.key === 'ArrowDown' || event.key === 'End') {
						void this.menu.menuSetCurrentItem(lastMenuItem);
						void lastMenuItem.setFocus();
					}
				}
			}
		}
	};

	/* istanbul ignore next */
	handlePanelSelect = () => {
		void this.hide();
		this.focusOnTrigger();
	};

	/* istanbul ignore next */
	handleKeyDown = (event: KeyboardEvent) => {
		if (this.open && event.key === 'Escape') {
			event.stopPropagation();
			void this.hide();
			this.focusOnTrigger();
		}
	};

	/* istanbul ignore next */
	handleDocumentKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && this.open) {
			event.stopPropagation();
			this.focusOnTrigger();
			void this.hide();
			return;
		}

		if (event.key === 'Tab') {
			const path = event.composedPath() as HTMLElement[];
			if (this.open && path.some((el) => el.tagName?.toLowerCase() === 'dv-menu-item')) {
				this.focusOnTrigger();
				void this.hide();
				return;
			}
		}
	};

	/* istanbul ignore next */
	handleDocumentMouseDown = (event: MouseEvent) => {
		const path = event.composedPath();
		if (this.host && !path.includes(this.host)) void this.hide();
	};

	/** @private */
	getAnimation(animationName: string) {
		const animations = {
			'dropdown.show': {
				keyframes: [
					{ opacity: 0, scale: 0.9 },
					{ opacity: 1, scale: 1 }
				],
				options: { duration: 100, easing: 'ease' }
			},
			'dropdown.hide': {
				keyframes: [
					{ opacity: 1, scale: 1 },
					{ opacity: 0, scale: 0.9 }
				],
				options: { duration: 100, easing: 'ease' }
			}
		};

		return animations[animationName] || { keyframes: [], options: {} };
	}

	/** @private */
	async animateTo(element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
		if (element) {
			const animation = element.animate(keyframes, options);
			return new Promise<void>((resolve) => {
				animation.onfinish = () => resolve();
			});
		} else {
			return Promise.resolve();
		}
	}

	/** @private */
	render() {
		return (
			<Host>
				<dv-popup ref={(el) => (this.popup = el)} placement={this.placement}>
					<div
						slot="anchor"
						role="button"
						tabIndex={0}
						onClick={this.handleTriggerClick}
						onKeyDown={this.handleTriggerKeyDown}
					>
						<slot ref={(el) => (this.trigger = el as HTMLSlotElement)} name="trigger"></slot>
					</div>
					<div
						aria-hidden={this.open ? 'false' : 'true'}
						aria-labelledby="dropdown"
						class={'shadow-sm-bottom rounded-radius-lg overflow-hidden'}
					>
						<slot
							ref={(el) => (this.panel = el as HTMLSlotElement)}
							onSlotchange={() => void this.handleContentSlotChange()}
						></slot>
					</div>
				</dv-popup>
			</Host>
		);
	}
}

