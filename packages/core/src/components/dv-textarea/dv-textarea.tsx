import { Component, Host, Prop, h, State, Element, Watch } from '@stencil/core';
import { submitOwningForm } from '../../internal/forms';

/**
 * ## Overview
 * The Textarea component provides a multi-line text input with form association capabilities. It supports validation,
 * error states, and includes helper text functionality.
 *
 * The component implements native form integration through the ElementInternals API while providing enhanced validation
 * and error handling capabilities.
 *
 * Built on native textarea functionality, it preserves standard behavior while adding support for form validation,
 * error states, and consistent styling.
 *
 * The `<dv-textarea>` component supports these input patterns:
 * - **Form Integration**: Native form value handling
 * - **Validation**: Built-in and custom validation
 * - **Error States**: Visual feedback with messages
 * - **Help Text**: Optional descriptive text
 * - **Size Control**: Flexible dimensions
 *
 * ## Accessibility
 * - Proper label association
 * - Error message announcement
 * - Required field indication
 * - Clear focus indication
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [MDN Textarea Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
 * - [WAI-ARIA Form Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/forms/)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-label>` | Provides accessible label for the textarea |
 *
 * @summary A multi-line text input with form integration, validation, and error state support.
 *
 * @tag dv-textarea
 */
@Component({
	tag: 'dv-textarea',
	styleUrl: 'dv-textarea.scss',
	shadow: true,
	formAssociated: true
})
export class DvTextarea {
	private defaultValue: string = '';
	private valueHasChanged: boolean = false;
	private textarea: HTMLTextAreaElement;

	/** The name attribute for the input. */
	@Prop() nameValue: string = 'default';

	/** The label text for the textarea. */
	@Prop() label: string = '';

	/** Placeholder text displayed when the textarea is empty. */
	@Prop() placeholder?: string = '';

	/** The current value of the textarea. */
	@Prop({ mutable: true, reflect: true }) value?: string = '';

	/** When true, marks the textarea as a required field. */
	@Prop() required = false;

	/** When true, prevents interaction with the textarea. */
	@Prop() disabled: boolean = false;

	/** Error message displayed when validation fails. */
	@Prop() errorText: string = '';

	/** Hint text displayed below the textarea to assist users. */
	@Prop() helpText: string;

	/** Maximum number of characters allowed. When set, displays a character counter below the textarea. */
	@Prop() maxLength?: number;

	/** Number of visible text lines for the native textarea element. */
	@Prop() rows: number = 3;

	/** Tracks whether the textarea currently has a validation error. */
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
		/* istanbul ignore next */
		this.updateValidityState();
	}

	/** @private */
	@Watch('helpText')
	helpTextChanged() {
		this.validateInput(this.value);
	}

	/**
	 * Validates the textarea value.
	 * @param {string} value - The textarea value to validate.
	 */
	/** @private */
	validateInput(_value: string) {
		this.hasError = this.errorText.trim() !== '';
		this.updateValidityState();
	}

	/** Update validity state for form association */
	private updateValidityState() {
		if (!this.internals) return;
		// Allow unit tests to run without ElementInternals support
		try {
			/* istanbul ignore if */
			if (this.hasError) {
				this.internals.setValidity?.(
					{ customError: true },
					this.errorText,
					this.el.shadowRoot.querySelector('textarea')
				);
			} else {
				this.internals.setValidity?.({});
			}
		} catch (e) {
			console.warn('Validity state update not supported', e.message);
		}
	}

	/** @private */
	private handleKeyDown = (event: KeyboardEvent): void => {
		if (
			event.key !== 'Enter' ||
			!(event.ctrlKey || event.metaKey) ||
			event.isComposing ||
			event.defaultPrevented ||
			this.disabled
		)
			return;
		event.preventDefault();
		submitOwningForm(this.el, this.internals);
	};

	/** Handle textarea change */
	/** @private */
	handleInput() {
		this.value = this.textarea.value;
		this.validateInput(this.value);
		if (this.internals?.setFormValue) {
			this.internals.setFormValue(this.value);
		}
	}

	/** @private */
	render() {
		const baseClasses =
			'block border-width-sm rounded-radius-lg body-default py-2 px-4 w-full appearance-none focus:outline-width-lg focus:-outline-offset-2 focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default';

		const textareaClasses = this.disabled
			? `${baseClasses} placeholder:text-disabled text-disabled border-form-disabled bg-form-disabled cursor-not-allowed`
			: this.hasError
				? `${baseClasses} placeholder:text-status-error text-status-error border-status-error focus:outline-focus-ring-destructive focus-visible:ring-focus-ring-destructive`
				: `${baseClasses} placeholder:text-subtle text-default border-form-default bg-form-default`;

		return (
			<Host>
				<div class="antialiased relative">
					{/* Render label if label prop is present and not empty */}
					{this.label && (
						<dv-label
							htmlFor={this.nameValue}
							label={this.label}
							variant={this.hasError ? 'error' : this.disabled ? 'disabled' : undefined}
							required={this.required}
							floating={true}
						></dv-label>
					)}
					{/* Textarea element */}
					<div class="relative -mt-2">
						<textarea
							ref={(el) => {
								this.textarea = el as HTMLTextAreaElement;
							}}
							class={textareaClasses}
							rows={this.rows}
							id={this.nameValue}
							placeholder={this.placeholder}
							value={this.value}
							disabled={this.disabled}
							required={this.required}
							{...(this.maxLength !== undefined ? { maxLength: this.maxLength } : {})}
							onInput={() => this.handleInput()}
							onKeyDown={this.handleKeyDown}
						/>
					</div>
					{/* Display error message if there's an error */}
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
					{/* Display help message if helpText has value and there's no error */}
					{!this.hasError && (this.helpText || this.maxLength !== undefined) && (
						<div class={`body-xs mt-1 flex justify-between ${this.disabled ? 'text-disabled' : 'text-subtle'}`}>
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

