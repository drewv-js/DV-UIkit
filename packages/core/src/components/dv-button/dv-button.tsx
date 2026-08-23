import { Component, Element, h, Host, Method, Prop, Watch } from '@stencil/core';

/**
 * ## Overview
 * **Primary** and **Secondary** buttons include two versions: with icon and without icon.
 * A layout should contain a single prominent button that indicates position or hierarchy.
 *
 * The `secondary button` is the alternative to the `primary button`, and has less visual emphasis.
 * Icons in buttons are used to visually represent the action or function of the button, enhancing user understanding and engagement.
 * They can improve usability, reduce cognitive load, and add a visual appeal to the interface.
 *
 * Use the `loading` prop to keep the button in a busy state. The width stays fixed, so other layout elements won't shift around.
 *
 * The `<dv-button>` component supports the three main variants:
 * - **Primary**: Main call-to-action (e.g., "Add", "Save")
 * - **Secondary**: Lower emphasis action
 * - **Text**: Minimal button without borders or background
 *
 * ## Accessibility
 * - Keyboard accessible (tab target + enter/space support).
 * - Visible focus ring for keyboard users.
 * - Uses `<button>` natively with proper attributes.
 * - `setFocus()` method for programmatic focus management.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * ## Dependencies
 * | Component    | Purpose                            |
 * |--------------|------------------------------------|
 * | `<dv-icon>`   | Used for the loading spinner icon. |
 *
 * @summary A versatile button component with primary, secondary, and text variants supporting icons, loading state, and destructive styling.
 *
 * @tag dv-button
 *
 * @slot - The button label or content.
 * @slot startIcon - Displays an icon on the left side of the label. Icon size is controlled by the button's `size` prop; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 * @slot endIcon - Displays an icon on the right side of the label. Icon size is controlled by the button's `size` prop; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 */
@Component({
	tag: 'dv-button',
	styleUrls: ['dv-button.scss'],
	shadow: { delegatesFocus: true },
	formAssociated: true
})
export class DvButton {
	/** @internal */
	@Element() host!: HTMLDvButtonElement;

	private internals: ElementInternals | null = null;

	/** The visual style variant of the button. Accepts `'primary'`, `'secondary'`, or `'text'`. Defaults to `'primary'`. */
	@Prop({ reflect: true }) variant?: 'primary' | 'secondary' | 'text' = 'primary';

	/** Applies destructive styling for delete or remove actions. */
	@Prop({ reflect: true }) destructive: boolean = false;

	/** Disables the button, preventing user interaction. */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Puts the button in a loading state, showing a spinner and preventing interaction. The button width stays fixed. */
	@Prop({ reflect: true }) loading: boolean = false;

	/** @internal */
	/** Indicates the button is part of an `<dv-button-group>`, adjusting border-radius for grouping. */
	@Prop({ reflect: true }) isButtonGroup?: boolean = false;

	/** Expands the button to fill the full width of its container. */
	@Prop({ reflect: true }) fullWidth: boolean = false;

	/** The native button type. Accepts `'button'`, `'submit'`, or `'reset'`. Defaults to `'submit'`. */
	@Prop({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'submit';

	/** Controls the size of the button. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** Associates the button with a form by its `id`. Useful when the button is rendered outside the form (e.g. in a Dialog footer). */
	@Prop({ reflect: true }) form?: string;

	/**
	 * __⚠️@deprecated The prop 'dense' is deprecated as of v1.7.0.__ Use the `size` prop with value `'sm'` instead.
	 *
	 * @since 0.12.0 - Initial introduction of dense prop
	 * @since 1.7.0 - dense prop deprecated, use size='sm' instead
	 */
	@Prop() dense: boolean = false;

	/** Reference to the internal button element */
	private buttonEl: HTMLButtonElement;

	constructor() {
		try {
			if (typeof this.host.attachInternals === 'function') {
				this.internals = this.host.attachInternals();
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('ElementInternals not supported', e.message);
		}
	}

	/** @private */
	componentDidLoad() {
		this.syncIcons();
	}

	/** @private */
	@Watch('size')
	sizeChanged() {
		this.syncIcons();
	}

	/** Propagates the correct icon size to every slotted dv-icon element. */
	private syncIcons() {
		const icons = this.host.querySelectorAll<HTMLDvIconElement>(
			'[slot="startIcon"] dv-icon, [slot="endIcon"] dv-icon, dv-icon[slot="startIcon"], dv-icon[slot="endIcon"]'
		);
		const iconSize: HTMLDvIconElement['size'] = this.size === 'sm' ? 'sm' : 'md';
		icons.forEach((icon) => {
			icon.size = iconSize;
		});
	}

	/** @private */
	@Watch('isButtonGroup')
	watchIsButtonGroup(newValue: boolean) {
		if (newValue) {
			this.host.setAttribute('is-button-group', 'true');
		} else {
			this.host.removeAttribute('is-button-group');
		}
	}

	/** Programmatically focuses the button element. */
	@Method()
	async setFocus(): Promise<void> {
		this.buttonEl?.focus();
	}

	/** Handles click events on the button or link. */
	private handleClick = (event: MouseEvent) => {
		if (this.disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		if (this.type === 'button') return;
		event.preventDefault();
		const form = this.internals?.form ?? this.host.closest<HTMLFormElement>('form');
		if (!form) return;
		if (this.type === 'reset') {
			form.reset();
			return;
		}
		form.requestSubmit();
	};

	/** @private */
	render() {
		const baseClasses =
			'max-w-full truncate rounded-radius-lg px-4 transition focus:outline-width-lg focus:outline-offset-0 focus-visible:outline focus-visible:outline-width-lg';

		// Set color (text, background, border, focus) classes based on destructive prop
		let colorsClasses: string;
		let focusColorClasses: string;

		if (this.destructive) {
			colorsClasses =
				this.variant === 'primary'
					? 'text-button-destructive-knockout bg-button-destructive-knockout hover:bg-button-destructive-knockout-hover'
					: 'text-button-destructive bg-button-destructive-default hover:bg-button-destructive-hover';
			colorsClasses = this.variant !== 'text' ? `${colorsClasses} border-button-destructive` : colorsClasses;
			focusColorClasses = 'focus:outline-focus-ring-destructive focus-visible:ring-focus-ring-destructive';
		} else {
			// Default brand styling
			colorsClasses =
				this.variant === 'primary'
					? 'text-button-knockout bg-button-knockout hover:bg-button-knockout-hover'
					: 'text-button-default bg-button-default hover:bg-button-default-hover';
			colorsClasses = this.variant !== 'text' ? `${colorsClasses} border-button-default` : colorsClasses;
			focusColorClasses = 'focus:outline-focus-ring-default focus-visible:ring-focus-ring-default';
		}

		// Set variant-specific classes
		let btnClassName;
		switch (this.variant) {
			case 'primary':
			case 'secondary':
				btnClassName = `${baseClasses} inline-flex items-center justify-center shadow-sm border`;
				break;
			case 'text':
				btnClassName = `${baseClasses}`;
				break;
		}

		// Set disabled classes based on variant
		const disabledBaseClasses = 'cursor-not-allowed';
		let disabledClasses = '';
		if (this.disabled) {
			switch (this.variant) {
				case 'primary': {
					disabledClasses = `${disabledBaseClasses} bg-background-disabled text-content-disabled border border-border-disabled`;
					break;
				}
				case 'secondary': {
					disabledClasses = `${disabledBaseClasses} bg-background-disabled text-content-disabled border border-border-disabled`;
					break;
				}
				case 'text': {
					disabledClasses = `${disabledBaseClasses} text-content-disabled block`;
					break;
				}
			}
		}

		// Add a class to indicate the button is in loading state
		const loadingClass = this.loading ? 'pointer-events-none' : '';

		// Add a Tailwind class for button to extend full-width
		const fullWide = this.fullWidth ? 'w-full flex justify-center' : '';

		// Set vertical padding and correct design tokens based on size prop (dense maps to 'sm')
		const sizeClasses = this.size === 'sm' || this.dense ? 'label-sm py-1' : 'label-default py-2';

		// Add border-radius classes based on isButtonGroup prop
		const borderRadiusClass = this.isButtonGroup
			? this.host.classList.contains('first-button')
				? 'rounded-r-none '
				: this.host.classList.contains('last-button')
					? 'rounded-l-none -ml-1'
					: this.host.classList.contains('inner-button')
						? 'rounded-radius-none -ml-1'
						: ''
			: '';

		return (
			<Host>
				<button
					class={`${!this.disabled ? `${colorsClasses} ${focusColorClasses}` : ''}  ${
						this.disabled ? disabledClasses : ''
					} ${btnClassName} ${borderRadiusClass} ${fullWide} ${sizeClasses} ${loadingClass}`}
					disabled={this.disabled}
					onClick={this.handleClick}
					ref={(el) => (this.buttonEl = el as HTMLButtonElement)}
					tabIndex={0}
					type={this.type}
				>
					<span class="flex items-center gap-1 relative">
						<slot name="startIcon"></slot>
						<span class={`${this.loading ? 'invisible' : 'truncate'}`}>
							<slot></slot>
						</span>
						{this.loading && (
							<dv-icon name="arrows-rotate" size="xs" class="animate-spin absolute top-2/4 left-2/4 -mt-1.5 -ml-1.5" />
						)}
						<slot name="endIcon"></slot>
					</span>
				</button>
			</Host>
		);
	}
}
