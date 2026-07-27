import { Component, h, Prop, Host, State, Element, Watch } from '@stencil/core';
import { submitOwningForm } from '../../internal/forms';

/**
 * ## Overview
 * The Textfield component provides a single-line text input with form association capabilities and extensive validation support.
 * It offers customizable icons, labels, and help text while maintaining consistent styling and accessibility.
 *
 * The component implements native form integration through the ElementInternals API while providing enhanced validation
 * and error handling capabilities.
 *
 * Built on native input functionality, it preserves standard behavior while adding support for icons,
 * validation states, and consistent styling across different input types.
 *
 * The `<dv-textfield>` component supports these input patterns:
 * - **Multiple Types**: Support for text, password, email, number, time
 * - **Icon Integration**: Optional start and end icons
 * - **Validation**: Built-in and custom validation
 * - **Error States**: Visual feedback with messages.
 * - **Help Text**: Optional descriptive text
 *
 * ## Accessibility
 * - Proper label association
 * - Clear error messaging
 * - Required field indication
 * - Focus states
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Text Input Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/textbox/)
 * - [MDN Input Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-label>` | Provides accessible label for the input |
 *
 * @summary A single-line text input with form integration, type variants, icon slots, and validation.
 *
 * @tag dv-textfield
 *
 * @slot startIcon - Icon displayed at the start of the input field. Icon size is controlled by the textfield's `size` prop; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 * @slot endIcon - Icon displayed at the end of the input field. Icon size is controlled by the textfield's `size` prop; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 */
@Component({
	tag: 'dv-textfield',
	styleUrl: 'dv-textfield.scss',
	shadow: true,
	formAssociated: true
})
export class DvTextfield {
	private defaultValue: string = '';
	private valueHasChanged: boolean = false;

	/** The name attribute for the input. */
	@Prop() nameValue: string = 'default';

	/** Label for the text field */
	@Prop() label: string = '';

	/** Placeholder text for the input */
	@Prop() placeholder: string = '';

	/** Input type (e.g., text, password, email) */
	@Prop() type: 'text' | 'password' | 'email' | 'number' | 'time' = 'text';

	/** Indicates if the input is required */
	@Prop() required: boolean = false;

	/** Indicates if the input is disabled */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Error message displayed when validation fails. */
	@Prop() errorText: string = '';

	/** Help text to display below the input */
	@Prop() helpText: string = '';

	/** Maximum number of characters allowed. When set, displays a character counter below the input. */
	@Prop() maxLength?: number;

	/** When true, displays a clear button inside the input to reset its value. When an endIcon slot is also present, the clear button is positioned beside it. */
	@Prop() clearable: boolean = false;

	/** Size variant of the textfield. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** Value of the input field */
	@Prop({ mutable: true, reflect: true }) value?: string = '';

	/** Indicates if the input has an error */
	@State() hasError: boolean = false;

	/** Reference to the host element */
	@Element() el: HTMLElement;

	private internals: ElementInternals | null = null;

	constructor() {
		// Validation to allow unit tests to run without ElementInternals support
		try {
			if (typeof this.el.attachInternals === 'function') {
				this.internals = this.el.attachInternals();
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('ElementInternals not supported', e.message);
		}
	}

	connectedCallback() {
		this.validateInput(this.value);
		/* istanbul ignore if */
		if (this.internals?.setFormValue) {
			try {
				this.internals.setFormValue(this.value);
			} catch (e) {
				console.warn('Form value update not supported', e.message);
			}
		}
	}

	componentWillLoad() {
		this.validateInput(this.value);
	}

	componentDidLoad() {
		this.defaultValue = this.value;
		this.syncIconSizes();
		this.syncIconColors();
	}

	/** @private */
	@Watch('value')
	valueChanged(newValue: string) {
		if (!this.valueHasChanged && this.defaultValue === newValue) {
			return;
		}
		this.validateInput(newValue);
		/* istanbul ignore if */
		if (this.internals?.setFormValue) {
			try {
				this.internals.setFormValue(newValue);
			} catch (e) {
				console.warn('Form value update not supported', e.message);
			}
		}
		this.valueHasChanged = true;
	}

	/** @private */
	@Watch('errorText')
	errorTextChanged() {
		/* istanbul ignore next */
		this.validateInput(this.value);
	}

	/** @private */
	@Watch('helpText')
	helpTextChanged() {
		this.validateInput(this.value);
	}

	/** @private */
	@Watch('size')
	sizeChanged() {
		this.syncIconSizes();
	}

	/** @private */
	@Watch('disabled')
	disabledChanged() {
		this.syncIconColors();
	}

	/** Propagates the size prop to every slotted dv-icon element. */
	private syncIconSizes() {
		const icons = this.el.querySelectorAll<HTMLDvIconElement>(
			'[slot="startIcon"] dv-icon, [slot="endIcon"] dv-icon, dv-icon[slot="startIcon"], dv-icon[slot="endIcon"]'
		);
		const iconSize = this.size === 'sm' ? 'xs' : 'md';
		icons.forEach((icon) => {
			icon.size = iconSize;
		});
	}

	/** Propagates the color prop to every slotted dv-icon element based on current state. */
	private syncIconColors() {
		const icons = this.el.querySelectorAll<HTMLDvIconElement>(
			'[slot="startIcon"] dv-icon, [slot="endIcon"] dv-icon, dv-icon[slot="startIcon"], dv-icon[slot="endIcon"]'
		);
		const color = this.hasError ? 'error' : this.disabled ? 'disabled' : undefined;
		icons.forEach((icon) => {
			icon.color = color as any;
		});
	}

	/** Validates the input value */
	/** @private */
	validateInput(_value: string) {
		this.hasError = this.errorText.trim() !== '';
		this.updateValidityState();
		this.syncIconColors();
	}

	/** Update validity state for form association */
	private updateValidityState() {
		if (!this.internals) return;
		// Allow unit tests to run without ElementInternals support
		try {
			/* istanbul ignore if */
			if (this.hasError) {
				this.internals.setValidity?.({ customError: true }, this.errorText, this.el.shadowRoot.querySelector('input'));
			} else {
				this.internals.setValidity?.({});
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('Validity state update not supported', e.message);
		}
	}

	/** @private */
	private handleKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== 'Enter' || event.isComposing || event.defaultPrevented || this.disabled) return;
		event.preventDefault();
		submitOwningForm(this.el, this.internals);
	};

	/** Handle input change */
	/** @private */
	handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		this.value = input.value;
		this.validateInput(this.value);
		this.internals.setFormValue(this.value);
	}

	/** Clears the input value and dispatches an input event */
	/** @private */
	handleClear() {
		this.value = '';
		this.el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
	}

	/** @private */
	render() {
		const baseClasses = `border-width-sm rounded-radius-lg ${
			this.size === 'sm' ? 'py-1 px-4 body-sm' : 'py-2 px-4 body-default'
		} w-full appearance-none focus:outline-width-lg focus:-outline-offset-2 focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default`;

		const inputClasses = this.disabled
			? `${baseClasses} placeholder:text-disabled text-disabled border-form-disabled bg-form-disabled cursor-not-allowed`
			: this.hasError
				? `${baseClasses} placeholder:text-status-error text-status-error border-status-error focus:outline-focus-ring-destructive focus-visible:ring-focus-ring-destructive`
				: `${baseClasses} placeholder:text-subtle text-default border-form-default bg-form-default`;

		// Check if startIcon and endIcon slots are filled
		const hasStartIcon = !!this.el.querySelector('[slot="startIcon"]');
		const hasEndIcon = !!this.el.querySelector('[slot="endIcon"]');

		const showClearButton = this.clearable && !!this.value;
		const hasRightPadding = hasEndIcon || showClearButton;
		const hasBothRight = hasEndIcon && showClearButton;
		const rightPaddingClass = hasBothRight
			? this.size === 'sm'
				? 'pr-14'
				: 'pr-16'
			: hasRightPadding
				? this.size === 'sm'
					? 'pr-9'
					: 'pr-10'
				: '';
		const iconPaddingClasses =
			`${hasStartIcon ? (this.size === 'sm' ? 'pl-9' : 'pl-11') : ''} ${rightPaddingClass}`.trim();

		return (
			<Host>
				<div class="antialiased relative">
					{this.label && (
						<dv-label
							htmlFor={this.nameValue}
							label={this.label}
							variant={this.hasError ? 'error' : this.disabled ? 'disabled' : undefined}
							required={this.required}
							floating={true}
						></dv-label>
					)}
					<div class="relative -mt-2">
						{/* Conditionally render Start Icon Slot */}
						{hasStartIcon && (
							<div
								class={`absolute inset-y-0 left-4 flex items-center pointer-events-none ${this.disabled ? 'text-disabled' : 'text-subtle'}`}
							>
								<slot name="startIcon"></slot>
							</div>
						)}
						<input
							class={`${inputClasses} ${iconPaddingClasses}`}
							id={this.nameValue}
							type={this.type}
							placeholder={this.placeholder}
							value={this.value}
							disabled={this.disabled}
							required={this.required}
							{...(this.maxLength !== undefined ? { maxlength: this.maxLength } : {})}
							onInput={(event: Event) => this.handleInput(event)}
							onKeyDown={this.handleKeyDown}
						/>
						{/* Conditionally render End Icon Slot */}
						{hasEndIcon && (
							<div
								class={`absolute inset-y-0 right-3 flex items-center pointer-events-none ${this.disabled ? 'text-disabled' : 'text-subtle'}`}
							>
								<slot name="endIcon"></slot>
							</div>
						)}
						{/* Conditionally render Clear Button */}
						{showClearButton && (
							<div
								class={`absolute inset-y-0 ${hasBothRight ? (this.size === 'sm' ? 'right-8' : 'right-9') : 'right-2'} flex items-center `}
							>
								<dv-icon-button
									name="circle-xmark"
									size={this.size === 'sm' ? 'xs' : 'md'}
									label="Clear"
									type="button"
									disabled={this.disabled}
									onClick={() => this.handleClear()}
									color={this.hasError ? 'error' : undefined}
								></dv-icon-button>
							</div>
						)}
					</div>
					{this.hasError && (
						<div class="body-xs mt-1 flex justify-between">
							<span class="text-status-error mr-2">{this.errorText}</span>
							{this.maxLength !== undefined && (
								<span class={`ml-auto text-nowrap ${this.disabled ? 'text-disabled' : 'text-status-error'}`}>
									{this.value?.length ?? 0} / {this.maxLength}
								</span>
							)}
						</div>
					)}
					{!this.hasError && (this.helpText || this.maxLength !== undefined) && (
						<div class={`body-xs mt-1 flex justify-between  ${this.disabled ? 'text-disabled' : 'text-subtle'}`}>
							<span class="mr-2 line-clamp-2">{this.helpText}</span>
							{this.maxLength !== undefined && (
								<span class="ml-auto text-nowrap">
									{this.value?.length ?? 0} / {this.maxLength}
								</span>
							)}
						</div>
					)}
				</div>
			</Host>
		);
	}
}

