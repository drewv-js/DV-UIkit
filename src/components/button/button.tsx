import { Component, Element, h, Host, Method, Prop } from '@stencil/core';
import { submitForm } from '../../internal/forms';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

@Component({
	tag: 'dv-button',
	styleUrl: 'button.scss',
	shadow: true
})
export class DvButton {
	/** @internal */
	@Element() host!: HTMLElement;

	/** The visual style variant of the button. */
	@Prop({ reflect: true }) variant: ButtonVariant = 'primary';

	/** Disables the button, preventing user interaction. */
	@Prop({ reflect: true }) disabled: boolean = false;

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

	private getClassName() {
		return {
			primary: this.variant === 'primary',
			secondary: this.variant === 'secondary',
			danger: this.variant === 'danger'
		};
	}

	render() {
		const classes = this.getClassName();

		return (
			<Host>
				<button
					class={classes}
					disabled={this.disabled}
					onClick={this.handleClick}
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