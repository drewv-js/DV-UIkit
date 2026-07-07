import { Component, Element, h, Host, Method, Prop, Watch } from '@stencil/core';
// import { submitForm } from '../../internal/forms';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

@Component({
	tag: 'd-button',
	styleUrls: ['o-button.scss'],
	shadow: { delegatesFocus: true }
})
export class DButton {
	/** @internal */
	@Element() host!: HTMLButtonElement;

	/** The visual style variant of the button. Accepts `'primary'`, `'secondary'`, or `'text'`. Defaults to `'primary'`. */
	@Prop({ reflect: true }) variant?: 'primary' | 'secondary' | 'text' = 'primary';

	/** Applies destructive styling for delete or remove actions. */
	@Prop({ reflect: true }) destructive: boolean = false;

	/** Disables the button, preventing user interaction. */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Puts the button in a loading state, showing a spinner and preventing interaction. The button width stays fixed. */
	@Prop({ reflect: true }) loading: boolean = false;

	/** @internal */
	/** Indicates the button is part of an `<o-button-group>`, adjusting border-radius for grouping. */
	@Prop({ reflect: true }) isButtonGroup?: boolean = false;

	/** Expands the button to fill the full width of its container. */
	@Prop({ reflect: true }) fullWidth: boolean = false;

	/** The native button type. Accepts `'button'`, `'submit'`, or `'reset'`. Defaults to `'submit'`. */
	@Prop({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'submit';

	/** Controls the size of the button. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** Associates the button with a form by its `id`. Useful when the button is rendered outside the form (e.g. in a Dialog footer). */
	@Prop({ reflect: true }) form?: string;

	/** Reference to the internal button element */
	// private buttonEl: HTMLButtonElement;

	/** @private */
	// componentDidLoad() {
	// 	this.syncIcons();
	// }

	/** @private */
	// @Watch('size')
	// sizeChanged() {
	// 	this.syncIcons();
	// }

	/** Propagates the correct icon size to every slotted o-icon element. */
	// private syncIcons() {
	// 	const icons = this.host.querySelectorAll<HTMLDIconElement>(
	// 		'[slot="startIcon"] o-icon, [slot="endIcon"] o-icon, o-icon[slot="startIcon"], o-icon[slot="endIcon"]'
	// 	);
	// 	const iconSize: HTMLOIconElement['size'] = this.size === 'sm' ? 'sm' : 'md';
	// 	icons.forEach((icon) => {
	// 		icon.size = iconSize;
	// 	});
	// }

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
	// @Method()
	// async setFocus(): Promise<void> {
	// 	this.buttonEl?.focus();
	// }

	/** Handles click events on the button or link. */
	private handleClick = (event: MouseEvent) => {
		if (this.disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		// event.preventDefault();
		// submitForm(this.host, this.form);
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
					disabledClasses = `${disabledBaseClasses} bg-button-knockout-disabled text-button-knockout-disabled`;
					break;
				}
				case 'secondary': {
					disabledClasses = `${disabledBaseClasses} bg-button-default-disabled text-button-default-disabled border border-button-default-disabled`;
					break;
				}
				case 'text': {
					disabledClasses = `${disabledBaseClasses} text-button-default-disabled block`;
					break;
				}
			}
		}

		// Add a class to indicate the button is in loading state
		const loadingClass = this.loading ? 'pointer-events-none' : '';

		// Add a Tailwind class for button to extend full-width
		const fullWide = this.fullWidth ? 'w-full flex justify-center' : '';

		// Set vertical padding and correct design tokens based on size prop (dense maps to 'sm')
		const sizeClasses = this.size === 'sm'

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
					// ref={(el) => (this.buttonEl = el as HTMLButtonElement)}
					tabIndex={0}
					type={this.type}
				>
					<span class="flex items-center gap-1 relative">
						<slot name="startIcon"></slot>
						<span class={`${this.loading ? 'invisible' : 'truncate'}`}>
							<slot></slot>
						</span>
						{this.loading && (
							<o-icon name="arrows-rotate" size="xs" class="animate-spin absolute top-2/4 left-2/4 -mt-1.5 -ml-1.5" />
						)}
						<slot name="endIcon"></slot>
					</span>
				</button>
			</Host>
		);
	}
}