import { Component, Element, h, Host, Method, Prop } from '@stencil/core';
import { submitForm } from '../../internal/forms';

/**
 * Action button with visual variants and native form behaviors.
 *
 * @slot - Button label content. Falls back to the `label` prop when empty.
 */
@Component({
	tag: 'dv-button',
	shadow: true
})
export class DvButton {
	/** @internal */
	@Element() host!: HTMLElement;

	/** The visual style variant of the button. */
	@Prop({ reflect: true }) variant?: 'primary' | 'secondary' | 'text' = 'primary';

	/** Disables the button, preventing user interaction. */
	@Prop({ reflect: true }) disabled: boolean = false;

    /** Expands the button to fill the full width of its container. */
	@Prop({ reflect: true }) fullWidth: boolean = false;

	/** The native button type. */
	@Prop({ reflect: true }) type: 'button' | 'submit' | 'reset' = 'button';

	/** Fallback label content when slot is empty. */
	@Prop({ reflect: true }) label = 'Button';

	/** Associates the button with a form by id when rendered outside the form. */
	@Prop({ reflect: true }) form?: string;

	/** Reference to the internal button element */
	private buttonEl?: HTMLButtonElement;

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

		submitForm(this.host);
	};

	/** @private */
	render() {
		const baseClasses =
			'inline-flex w-auto max-w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

		const variantClasses = {
			primary: 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
			secondary: 'border-blue-600 bg-white text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-600',
			text: 'border-transparent bg-transparent text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-600'
		}[this.variant ?? 'primary'];

		const disabledClasses = this.disabled ? 'cursor-not-allowed opacity-60 pointer-events-none' : '';
		const widthClasses = this.fullWidth ? 'w-full' : '';
		const classes = `${baseClasses} ${variantClasses} ${disabledClasses} ${widthClasses}`.trim();

		return (
			<Host>
				<button
					class={classes}
					disabled={this.disabled}
					onClick={this.handleClick}
					{...(this.form ? { form: this.form } : {})}
					ref={(el) => {
						this.buttonEl = el as HTMLButtonElement;
					}}
					type={this.type}
				>
					<slot>{this.label}</slot>
				</button>
			</Host>
		);
	}
}