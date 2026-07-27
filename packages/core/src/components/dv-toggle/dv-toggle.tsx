import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Prop, State, Watch, h } from '@stencil/core';
import { CHANGE_EVENT } from '../../events';
import { submitOwningForm } from '../../internal/forms';

/**
 * ## Overview
 * The Toggle component provides a binary on/off control for enabling or disabling a single option.
 * It uses a native checkbox input under the hood while presenting a switch-style visual treatment.
 *
 * The component supports checked, unchecked, and indeterminate states, and emits a change event
 * when its checked state updates.
 *
 * ## Accessibility
 * - Uses a native checkbox input for built-in keyboard and screen reader support.
 * - Supports disabled state to prevent interaction when unavailable.
 * - Associates visible label text when the label prop is provided.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Switch Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
 * - [MDN Checkbox Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * ## Dependencies
 * | Component   | Purpose                                     |
 * |-------------|---------------------------------------------|
 * | `<dv-label>` | Provides accessible label text for the toggle |
 * | `<dv-icon>`  | Displays the visual on/off indicator icon   |
 *
 * @summary A switch-style toggle control with checked, disabled, and indeterminate states.
 *
 * @tag dv-toggle
 *
 * @slot - This component does not use slots; label and help text are configured via props.
 */
@Component({
	tag: 'dv-toggle',
	styleUrl: 'dv-toggle.scss',
	shadow: true,
	formAssociated: true
})
export class DvToggle {
	private input: HTMLInputElement;
	private internals: ElementInternals | null = null;

	@Element() el: HTMLElement;

	/** The name attribute for the toggle input */
	@Prop() nameValue: string = 'default';

	/** Determines the initial checked state of the toggle. */
	@Prop({ mutable: true }) checked: boolean = false;

	/** Used for Storybook documentation purposes */
	@Prop({ reflect: true }) label: string;

	/** Disables the toggle, preventing user interaction */
	@Prop({ reflect: true }) disabled = false;

	/** @internal */
	/** The value submitted with the form when the toggle is checked */
	@Prop({ reflect: true }) value: string;

	/** Places the toggle in an indeterminate (mixed) state. When both `indeterminate` and `checked` are true, the indeterminate state takes visual priority. */
	@Prop({ mutable: true }) indeterminate: boolean = false;

	/** Help text to display below the input */
	@Prop() helpText: string = '';

	/** Emitted when the toggle's checked state changes. */
	@Event({ eventName: CHANGE_EVENT }) change: EventEmitter<void>;

	/** @internal Tracks focus styling for the visible toggle */
	@State() hasFocus: boolean = false;

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

	/** @private */
	/** Sets the initial form state of the input element */
	connectedCallback() {
		/* istanbul ignore if */
		if (this.internals?.setFormValue) {
			try {
				this.internals.setFormValue(this.checked ? this.value || 'on' : null);
			} catch (e) {
				console.warn('Form value update not supported', e.message);
			}
		}
	}

	/** @private */
	/** Sets the initial indeterminate state of the input element */
	componentDidLoad() {
		if (this.input) {
			this.input.indeterminate = this.indeterminate;
		}
	}

	/** Watches for changes to the 'indeterminate' property
	 * @private
	 */
	@Watch('indeterminate')
	watchIndeterminate(newValue: boolean) {
		if (this.input) {
			this.input.indeterminate = newValue;
		}
	}

	/** Watches for changes to the 'checked' property
	 * @private
	 */
	@Watch('checked')
	watchChecked(newValue: boolean) {
		if (this.input) {
			this.input.checked = newValue;
			/* istanbul ignore if */
			if (this.internals?.setFormValue) {
				this.internals.setFormValue(this.checked ? this.value || 'on' : null);
			}
			this[CHANGE_EVENT].emit();
		}
	}

	/** @private */
	private handleKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== 'Enter' || event.isComposing || event.defaultPrevented || this.disabled) return;
		event.preventDefault();
		submitOwningForm(this.el, this.internals);
	};

	/** Handles toggle click */
	/** @private */
	handleChange = (event: MouseEvent) => {
		if (this.disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		this.indeterminate = false;
		this.checked = !this.input.checked;
	};

	/** Handles setting focus to visible toggle */
	/** @private */
	handleFocus() {
		this.hasFocus = true;
	}

	/** Handles removing focus from visible toggle */
	/** @private */
	handleBlur() {
		this.hasFocus = false;
	}

	/** @private */
	render() {
		const indeterminateClasses =
			'peer-indeterminate:after:w-4 peer-indeterminate:after:h-1 peer-indeterminate:after:bg-brand-knockout peer-indeterminate:after:rounded-radius-sm peer-indeterminate:after:absolute peer-indeterminate:after:top-[7px]  peer-indeterminate:after:left-[7px] indeterminate:bg-brand';

		const disabledClasses =
			'peer-disabled:cursor-not-allowed peer-disabled:border-disabled peer-disabled:bg-disabled peer-disabled:after:bg-brand-disabled';

		const iconColor = this.disabled
			? 'text-disabled bg-disabled'
			: this.checked
				? 'text-brand-knockout bg-brand-knockout'
				: 'text-brand bg-brand';

		const iconPositioning = this.checked ? 'right-px translate-x-0' : 'left-0.5';

		const colorClasses = this.indeterminate
			? 'bg-brand group-hover:bg-brand-hover group-hover:border-brand-hover'
			: this.checked
				? 'bg-brand-knockout group-hover:bg-brand-knockout-hover group-hover:border-brand-hover'
				: 'bg-brand group-hover:bg-brand-hover group-hover:border-brand-hover';

		const focusClasses = this.hasFocus
			? 'outline outline-visible outline-width-lg outline-focus-ring-default outline-offset-0 ring-focus-ring-default'
			: '';

		return (
			<div class="antialiased">
				<div class="items-center body-default flex antialiased group hover:cursor-pointer" onClick={this.handleChange}>
					<input
						id={this.nameValue}
						ref={(el) => (this.input = el as HTMLInputElement)}
						type="checkbox"
						class="sr-only peer"
						checked={this.checked}
						disabled={this.disabled}
						indeterminate={this.indeterminate}
						value={this.value}
						onKeyDown={this.handleKeyDown}
						onFocus={() => this.handleFocus()}
						onBlur={() => this.handleBlur()}
					></input>
					<div
						class={`relative w-8 h-5 z-500 border-width-sm border-brand rounded-full ${indeterminateClasses} ${disabledClasses} ${colorClasses} ${focusClasses}`}
					>
						{!this.indeterminate && (
							<div
								class={`${iconColor} ${iconPositioning} absolute z-top top-px rounded-radius-lg ease-in-out duration-[250ms]`}
							>
								<dv-icon size="xs" name={this.checked ? 'circle-check' : 'circle-xmark'}></dv-icon>
							</div>
						)}
					</div>

					{this.label && (
						<span class="ml-2 flex items-center">
							<dv-label
								label={this.label}
								htmlFor={this.nameValue}
								variant={this.disabled ? 'disabled' : undefined}
							></dv-label>
						</span>
					)}
				</div>
				{this.helpText && (
					<div class={`body-xs mt-1 ml-10 flex justify-between ${this.disabled ? 'text-disabled' : 'text-subtle'}`}>
						{this.helpText}
					</div>
				)}
			</div>
		);
	}
}

