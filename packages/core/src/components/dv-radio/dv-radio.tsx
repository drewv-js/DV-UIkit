import { Component, Prop, Watch, h, Element } from '@stencil/core';

/**
 * ## Overview
 * The Radio component provides a single radio button input with an associated label. Each radio button maintains its own state while coordinating
 * with its parent [dv-radio-group](/docs/components-radio-group--docs) for proper selection management and keyboard navigation.
 *
 * The component builds on the native radio input element while adding support for form association,
 * validation, and consistent styling across different states.
 *
 * It also supports form integration, custom styling, and maintains proper accessibility features while providing native form control functionality.

 * The `<dv-radio>` component supports these interaction patterns:
 * - **Selection**: Space to toggle state
 * - **Group Navigation**: Arrow keys when in a group
 * - **Form Integration**: Native form value handling
 * - **Focus States**: Clear visual feedback
 * - **Label Association**: Proper HTML labeling
 *
 * ## Accessibility
 * - Uses native radio input element.
 * - Maintains proper label association.
 * - Supports keyboard interaction.
 * - Clear focus indication.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Radio Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
 * - [MDN Radio Button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-label>` | Provides accessible label for the radio input |
 *
 * @summary A single radio button input with a label, used within an dv-radio-group.
 *
 * @tag dv-radio
 *
 * @slot - Additional content to render alongside the radio input.
 */
@Component({
	tag: 'dv-radio',
	styleUrl: 'dv-radio.scss',
	shadow: true
})
export class DvRadio {
	private radio: HTMLInputElement;

	/** @internal */
	@Element() el: HTMLDvRadioElement;

	/** The id attribute for the radio input. */
	@Prop() nameValue: string = 'default';

	/** The value attribute for the radio input. */
	@Prop({ reflect: true }) value: string;

	/** Determines the initial checked state of the radio. */
	@Prop({ mutable: true }) checked: boolean = false;

	/** When true, prevents interaction and applies disabled styling. */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** The name attribute for the radio input, used to bind radios together in a group. */
	@Prop({ reflect: true }) name: string = 'default';

	/** The visible label text for the radio input. */
	@Prop({ reflect: true }) label: string;

	/** Syncs the underlying native input's checked state when the checked property changes.
	 * @private
	 */
	@Watch('checked')
	watchChecked(newValue: boolean) {
		if (this.radio) {
			this.radio.checked = newValue;
		}
	}

	/** @private */
	render() {
		const disabledClasses = this.disabled
			? 'disabled:border-form-disabled disabled:hover:border-form-disabled  disabled:cursor-not-allowed'
			: '';
		const pointerClass = this.disabled ? 'cursor-not-allowed' : 'cursor-pointer';

		return (
			<div class="mb-4 flex items-center antialiased body-default relative">
				<input
					id={this.nameValue}
					ref={(el) => (this.radio = el)}
					type="radio"
					class={`appearance-none rounded-full border-brand bg-transparent size-5 border-width-md checked:border-brand checked:bg-transparent checked:hover:bg-transparent checked:hover:border-brand checked:focus:bg-transparent checked:focus:border-brand focus:outline-width-lg focus:outline-focus-ring-default focus:outline-offset-0 peer ${disabledClasses} ${pointerClass}`}
					value={this.value}
					checked={this.checked}
					disabled={this.disabled}
					name={this.name}
				/>
				<slot></slot>
				<span class={`ml-2 flex items-center ${pointerClass}`}>
					<dv-label
						htmlFor={this.nameValue}
						label={this.label}
						variant={this.disabled ? 'disabled' : undefined}
					></dv-label>
				</span>
				<span
					class={`absolute left-1.5 size-2 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity ${this.disabled ? 'bg-form-disabled' : 'bg-brand-knockout'}`}
				></span>
			</div>
		);
	}
}

