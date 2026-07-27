import type { EventEmitter } from '@stencil/core';
import { Component, h, Prop, Watch, Element, State, Event } from '@stencil/core';
import { CHANGE_EVENT } from '../../events';
import { submitOwningForm } from '../../internal/forms';

/**
 * ## Overview
 * The Checkbox component provides a form control for selecting multiple options from a list of choices. It maintains native
 * checkbox behavior while adding support for form validation, indeterminate states, and custom styling.
 *
 * The component integrates seamlessly with forms through the ElementInternals API, providing built-in validation and
 * proper form association.
 *
 * Built on native HTML checkbox functionality, it preserves all standard keyboard interactions while adding
 * enhanced visual states and error handling capabilities.
 *
 * The `<dv-checkbox>` component supports three main states:
 * - **Checked**: Option is selected (true)
 * - **Unchecked**: Option is not selected (false)
 * - **Indeterminate**: Mixed or partial selection state
 *
 * Form validation features include:
 * - Required field validation
 * - Custom error messages
 * - Visual error states
 * - Proper form integration
 *
 * ## Accessibility
 * - Native checkbox behavior and keyboard support
 * - Proper label association
 * - Clear error messaging
 * - Required field indication
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Checkbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
 * - [MDN Checkbox Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)
 * - [dv-label](/docs/components-label--docs)
 *
 * ## Dependencies
 * | Component    | Purpose                              |
 * |--------------|--------------------------------------|
 * | `<dv-label>`  | Provides label text for the checkbox |
 *
 * @summary A form-associated checkbox with checked, unchecked, and indeterminate states, built-in validation, and error display.
 *
 * @tag dv-checkbox
 *
 * @slot - The checkbox's label content.
 */
@Component({
	tag: 'dv-checkbox',
	styleUrl: 'dv-checkbox.scss',
	shadow: true,
	formAssociated: true
})
export class DvCheckbox {
	private defaultValue: boolean;
	private valueHasChanged: boolean = false;
	private checkbox: HTMLInputElement;

	@Element() el: HTMLElement;

	/** The name attribute for the checkbox input. */
	@Prop() nameValue: string = 'default';

	/** Determines the initial checked state of the checkbox. */
	@Prop({ mutable: true }) checked: boolean = false;

	/** Used for Storybook documentation purposes. */
	@Prop({ reflect: true }) label: string;

	/** Disables the checkbox, preventing user interaction. */
	@Prop({ reflect: true }) disabled = false;

	/** @internal */
	/** The value submitted with the form when the checkbox is checked. */
	@Prop({ reflect: true }) value: string;

	/** Places the checkbox in an indeterminate (mixed) state. */
	@Prop({ mutable: true }) indeterminate: boolean = false;

	/** Error message displayed below the checkbox when validation fails. */
	@Prop() errorText: string = '';

	/** Help text displayed below the checkbox to assist users. Hidden when errorText is set. */
	@Prop() helpText: string = '';

	/** Marks the checkbox as required for form submission. */
	@Prop() required: boolean = false;

	/** Indicates if the input has an error */
	@State() hasError: boolean = false;

	/** Emitted when the checkbox checked state changes. */
	@Event({ eventName: CHANGE_EVENT }) change: EventEmitter<void>;

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
		this.validateInput();
		/* istanbul ignore if */
		if (this.internals?.setFormValue) {
			try {
				this.internals.setFormValue(this.checked ? this.value || 'on' : null);
			} catch (e) {
				console.warn('Form value update not supported', e.message);
			}
		}
	}

	/** Watches for changes to the 'indeterminate' property.
	 * @private
	 */
	@Watch('indeterminate')
	watchIndeterminate(newValue: boolean) {
		if (this.checkbox) {
			this.checkbox.indeterminate = newValue;
		}
	}

	/** Watches for changes to the 'checked' property.
	 * @private
	 */
	@Watch('checked')
	watchChecked(newValue: boolean) {
		if (!this.valueHasChanged && this.defaultValue === newValue) {
			return;
		}
		this.validateInput();
		if (this.checkbox) {
			this.checkbox.checked = newValue;
			if (newValue) {
				this.indeterminate = false;
			}
			this.valueHasChanged = true;
		}

		/* istanbul ignore if */
		if (this.internals?.setFormValue) {
			try {
				this.internals.setFormValue(newValue ? this.value || 'on' : null);
			} catch (e) {
				/* istanbul ignore next */
				console.warn('Form value update not supported', e.message);
			}
		}
	}

	/** @private */
	@Watch('errorText')
	errorTextChanged() {
		this.validateInput();
		this.updateValidityState();
	}

	/** Validates the checkbox state */
	/** @private */
	validateInput() {
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
				this.internals.setValidity?.({ customError: true }, this.errorText, this.el.shadowRoot.querySelector('input'));
			} else {
				this.internals.setValidity?.({});
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('Validity state update not supported', e.message);
		}
	}

	/** It sets the default value and initial indeterminate state of the checkbox element */
	componentDidLoad() {
		this.defaultValue = this.checked;
		if (this.checkbox) {
			this.checkbox.indeterminate = this.indeterminate;
		}
		this.validateInput();
	}

	/** @private */
	private handleKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== 'Enter' || event.isComposing || event.defaultPrevented || this.disabled) return;
		event.preventDefault();
		submitOwningForm(this.el, this.internals);
	};

	/** Handle checkbox change */
	/** @private */
	handleChange() {
		this.checked = this.checkbox.checked;
		this.validateInput();
		/* istanbul ignore if */
		if (this.internals?.setFormValue) {
			this.internals.setFormValue(this.checked ? this.value || 'on' : null);
		}
		this[CHANGE_EVENT].emit();
	}

	/** @private */
	render() {
		/** Generates CSS classes for the disabled state of the checkbox. */
		const disabledClasses = this.disabled
			? 'border-form-disabled bg-form-disabled cursor-not-allowed checked:border-form-disabled checked:bg-form-disabled  checked:disabled:bg-brand-knockout-disabled indeterminate:disabled:bg-brand-knockout-disabled'
			: '';

		const errorClasses = this.hasError ? 'border-status-error' : '';
		const pointerClass = this.disabled ? 'cursor-not-allowed' : 'cursor-pointer';

		return (
			<div class="flex flex-col body-default antialiased">
				<div class="flex items-center">
					<input
						class={`focus:outline focus-visible:outline appearance-none bg-form-default checked:bg-brand-knockout checked:hover:bg-brand-knockout checked:focus:bg-brand-knockout indeterminate:bg-brand-knockout indeterminate:focus:bg-brand-knockout indeterminate:hover:bg-brand-knockout rounded-radius-sm border-brand border-width-md focus:outline-width-md focus:outline-focus-ring-default focus:outline-offset-0 focus-visible:outline-width-md focus-visible:ring-focus-ring-default focus:ring-focus-ring-default ${disabledClasses} ${errorClasses} ${pointerClass}`}
						id={this.nameValue}
						type="checkbox"
						checked={this.checked}
						disabled={this.disabled}
						value={this.value}
						required={this.required}
						onChange={() => this.handleChange()}
						onKeyDown={this.handleKeyDown}
						ref={(el) => (this.checkbox = el as HTMLInputElement)}
					/>
					<span class={`ml-2 flex items-center ${pointerClass}`}>
						<dv-label
							htmlFor={this.nameValue}
							label={this.label}
							variant={this.hasError ? 'error' : this.disabled ? 'disabled' : undefined}
							required={this.required}
						></dv-label>
					</span>
				</div>
				<div class="body-sm">
					{this.hasError && (
						<div class="mt-1 flex justify-between">
							<span class="text-status-error">{this.errorText}</span>
						</div>
					)}
					{!this.hasError && this.helpText && (
						<div class={`mt-1 ${this.disabled ? 'text-disabled' : 'text-subtle'}`}>
							<span class="line-clamp-2">{this.helpText}</span>
						</div>
					)}
				</div>
			</div>
		);
	}
}

