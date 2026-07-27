import { Component, Prop, h } from '@stencil/core';

@Component({
	tag: 'dv-date-picker-button',
	styleUrl: 'dv-date-picker-button.scss',
	shadow: true
})
export class DvDatePickerButton {
	/** Indicates whether this option is currently selected. */
	@Prop({ mutable: true }) selected: boolean = false;

	render() {
		const baseButtonClasses =
			'rounded-full px-6 py-2 m-1 body-sm focus:outline focus:outline-width-lg focus:-outline-offset-2 focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default';
		const buttonColorClasses = this.selected ? 'bg-brand-knockout text-brand-knockout' : 'bg-brand text-default';

		return (
			<button class={`${baseButtonClasses} ${buttonColorClasses}`}>
				<slot></slot>
			</button>
		);
	}
}

