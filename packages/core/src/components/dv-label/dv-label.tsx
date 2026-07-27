import { Component, h, Prop } from '@stencil/core';

/**
 * ## Overview
 * The Label component renders an accessible `<label>` element associated with a form control.
 * It supports required field indication, disabled state, and error state styling.
 *
 * The component is used internally by form controls such as `<dv-checkbox>`, `<dv-radio>`, and `<dv-textfield>`
 * to provide consistent label presentation across the design system.
 *
 * ## Accessibility
 * - Renders a native `<label>` element with `htmlFor` association
 * - Required fields display an asterisk (`*`) indicator
 * - Error and disabled variants apply distinct text colors
 *
 * @summary An accessible form label with optional required indicator and error/disabled state variants.
 *
 * @tag dv-label
 */
@Component({
	tag: 'dv-label',
	styleUrls: ['dv-label.scss'],
	shadow: false
})
export class DvLabel {
	/** The ID of the input element the label is associated with */
	@Prop({ reflect: true }) htmlFor?: string;

	/** The label text to display */
	@Prop() label: string;

	/** Variant for different label states */
	@Prop() variant?: 'error' | 'disabled';

	/** Indicates if the field is required - shows asterisk */
	@Prop() required?: boolean = false;

	/** When true, applies floating label styles */
	@Prop() floating: boolean = false;

	render() {
		let disabledClasses: string;
		let errorClasses: string;
		let defaultClasses: string;

		if (this.floating) {
			disabledClasses =
				this.variant === 'disabled'
					? `truncate text-disabled z-10 relative body-xs bg-default rounded-radius-rounded px-1`
					: '';
			errorClasses =
				this.variant === 'error'
					? `truncate z-10 relative body-xs text-status-error bg-default rounded-radius-rounded px-1`
					: '';
			defaultClasses = !this.variant
				? `truncate z-10 relative body-xs text-subtle bg-default rounded-radius-rounded px-1`
				: '';
		} else {
			disabledClasses = this.variant === 'disabled' ? `text-disabled` : '';
			errorClasses = this.variant === 'error' ? `text-status-error` : '';
			defaultClasses = !this.variant ? `text-default` : '';
		}

		return (
			<div class={this.floating ? 'inline-flex max-w-full overflow-hidden mx-2 pr-4' : undefined}>
				<label
					htmlFor={this.htmlFor}
					class={[defaultClasses, errorClasses, disabledClasses, 'cursor-[inherit]'].filter(Boolean).join(' ')}
				>
					{this.label}
					{this.required ? <span>&nbsp;*</span> : null}
				</label>
			</div>
		);
	}
}

