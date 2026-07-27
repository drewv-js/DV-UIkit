import type { EventEmitter } from '@stencil/core';
import { Component, Element, Host, Prop, State, Watch, h, Event } from '@stencil/core';
import { CHANGE_EVENT } from '../../events';
import { submitOwningForm } from '../../internal/forms';

/**
 * ## Overview
 * The Radio Group component manages a collection of [dv-radio](/docs/components-radio-group-radio--docs) buttons,
 * ensuring proper selection behavior and accessibility. It handles form integration, keyboard navigation, and
 * maintains the selected state across radio options.
 *
 * The component implements form association capabilities and validation while managing the selection state of its
 * child radio buttons, ensuring only one option can be selected at a time.
 *
 * Radio groups handle all keyboard interactions and maintain proper focus management between options while
 * providing form validation and error states.
 *
 * The `<dv-radio-group>` component supports these interaction patterns:
 * - **Arrow Keys**: Navigate between radio options
 * - **Selection**: Space to select current option
 * - **Form Integration**: Native form value handling
 * - **Validation**: Required field and error states
 * - **Error States**: Visual feedback with messages.
 * - **Help Text**: Optional descriptive text
 * - **Focus Management**: Proper focus handling between options
 *
 * ## Accessibility
 * - Uses `role="radiogroup"` for the container.
 * - Maintains proper focus management.
 * - Supports arrow key navigation between options.
 * - Handles required state indication.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
 * - [dv-radio](/docs/components-radio-group-radio--docs)
 *
 * @summary A group container for dv-radio buttons that manages selection state and form integration.
 *
 * @tag dv-radio-group
 *
 * @slot - Container for `dv-radio` button elements.
 */
@Component({
	tag: 'dv-radio-group',
	styleUrl: 'dv-radio-group.scss',
	shadow: true,
	formAssociated: true
})
export class DvRadioGroup {
	private defaultValue: string;
	private valueHasChanged: boolean = false;
	private fieldset: HTMLFieldSetElement;

	/** @internal */
	@Element() host!: HTMLDvRadioGroupElement;

	/** The label text for the radio group. */
	@Prop() label: string;

	/** The name attribute used to bind the child radios together. */
	@Prop() name: string;

	/** The currently selected value of the radio group. */
	@Prop({ mutable: true }) value: string;

	/** Hint text displayed below the radio group to assist users. */
	@Prop() helpText: string = '';

	/** Error message displayed when validation fails. */
	@Prop() errorText: string = '';

	/** When true, marks the radio group as a required field. */
	@Prop() required: boolean = false;

	/** Tracks whether the radio group currently has a validation error. */
	/** @internal */
	@State() hasError: boolean = false;

	/** Emitted when the radio group value changes */
	@Event({ eventName: CHANGE_EVENT }) change: EventEmitter<void>;

	private internals: ElementInternals | null = null;

	constructor() {
		// Validation to allow unit tests to run without ElementInternals support
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
	componentWillLoad() {
		this.validateInput();
	}

	/** @private */
	componentDidLoad() {
		this.defaultValue = this.value;
		this.updateRadioGroupProps();
	}

	/* istanbul ignore next */
	/** @private */
	@Watch('value')
	watchValue(newValue: string) {
		if (!this.valueHasChanged && this.defaultValue === newValue) {
			return;
		}
		this.validateInput();
		this.updateFormValue(newValue);
		this.updateRadioGroupProps();
		this.valueHasChanged = true;
	}

	/** @private */
	@Watch('errorText')
	errorTextChanged() {
		this.validateInput();
	}

	private updateRadioGroupProps() {
		const radios = this.getRadios();
		radios.forEach((radio) => {
			radio.name = this.name;
			radio.checked = radio.value === this.value;
		});
		this.updateRadioTabStops();
	}

	private updateRadioTabStops() {
		const radios = this.getRadios();
		if (radios.length === 0) return;

		const enabledRadios = radios.filter((radio) => !radio.disabled);
		if (enabledRadios.length === 0) return;

		// If a radio is already checked, that should be tabbable. Otherwise, the first enabled radio should be tabbable.
		const tabbableRadio = enabledRadios.find((radio) => radio.checked) || enabledRadios[0];

		radios.forEach((radio) => {
			const input = radio.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement | null;
			if (!input) {
				return;
			}

			input.tabIndex = !radio.disabled && radio === tabbableRadio ? 0 : -1;
		});
	}

	private selectRadio(target: HTMLDvRadioElement) {
		if (!target || target.disabled) {
			return;
		}
		if (!this.valueHasChanged && this.defaultValue === target.value) {
			return;
		}

		this.value = target.value;
		this.updateRadioGroupProps();
		this.validateInput();
		this.updateFormValue(this.value);
		this[CHANGE_EVENT].emit();
		this.valueHasChanged = true;
	}

	private getRadios(enabled: boolean = false) {
		const radios = Array.from(this.host.querySelectorAll('dv-radio')) as HTMLDvRadioElement[];
		return enabled ? radios.filter((radio) => !radio.disabled) : radios;
	}

	/* istanbul ignore next */
	private handleClick = (event: MouseEvent) => {
		const target = (event.target as HTMLElement).closest('dv-radio') as HTMLDvRadioElement;
		this.selectRadio(target);
	};

	private handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.isComposing && !event.defaultPrevented) {
			event.preventDefault();
			submitOwningForm(this.host, this.internals);
			return;
		}

		const radios = this.getRadios(true);
		if (!radios.length) {
			return;
		}

		const eventTarget = event.target as HTMLElement;
		const activeRadio = eventTarget.closest('dv-radio') as HTMLDvRadioElement;
		const currentIndex = Math.max(
			radios.findIndex((radio) => radio === activeRadio),
			radios.findIndex((radio) => radio.checked)
		);

		if (
			event.key === 'ArrowDown' ||
			event.key === 'ArrowRight' ||
			event.key === 'ArrowUp' ||
			event.key === 'ArrowLeft'
		) {
			event.preventDefault();
			const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
			const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + radios.length) % radios.length;
			const nextRadio = radios[nextIndex];
			this.selectRadio(nextRadio);
			nextRadio.focus();
			nextRadio.shadowRoot?.querySelector('input')?.focus();
			return;
		}

		if (event.key === ' ') {
			event.preventDefault();
			const targetIndex = currentIndex < 0 ? 0 : currentIndex;
			this.selectRadio(radios[targetIndex]);
		}
	};

	/** Validates the radio group state */
	private validateInput() {
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
				this.internals.setValidity?.({ customError: true }, this.errorText, this.fieldset);
			} else {
				this.internals.setValidity?.({});
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('Validity state update not supported', e.message);
		}
	}

	/** Update form value for form association */
	private updateFormValue(value: string) {
		/* istanbul ignore if */
		if (this.internals?.setFormValue) {
			try {
				this.internals.setFormValue(value || null);
			} catch (e) {
				console.warn('Form value update not supported', e.message);
			}
		}
	}

	/** @private */
	render() {
		return (
			<Host>
				<fieldset
					onClick={this.handleClick}
					onKeyDown={this.handleKeyDown}
					ref={(el) => (this.fieldset = el)}
					role="radiogroup"
					aria-labelledby="legend"
				>
					<legend class="pb-4" id="legend">
						{this.label && (
							<dv-label
								label={this.label}
								variant={this.hasError ? 'error' : undefined}
								required={this.required}
								class="label-sm"
							></dv-label>
						)}
					</legend>
					<slot onSlotchange={() => this.updateRadioGroupProps()}></slot>
				</fieldset>
				<div class="body-xs">
					{this.hasError && (
						<div class="mt-1 flex justify-between">
							<span class="text-status-error">{this.errorText}</span>
						</div>
					)}
					{!this.hasError && this.helpText && (
						<div class="mt-1 flex justify-between text-subtle">
							<span class="line-clamp-2">{this.helpText}</span>
						</div>
					)}
				</div>
			</Host>
		);
	}
}

