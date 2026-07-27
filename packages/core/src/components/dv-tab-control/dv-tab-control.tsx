import { Component, Element, Host, h, Prop, Method } from '@stencil/core';
import type { IconName } from '../../icon-name.generated';

/**
 * ## Overview
 * The Tab Control component combines the functionality of a button with a single icon display. It provides a compact,
 * icon-based interaction pattern for tab navigation actions and toolbars while maintaining proper accessibility and form integration.

 */
@Component({
	tag: 'dv-tab-control',
	styleUrl: 'dv-tab-control.scss',
	shadow: { delegatesFocus: true }
})
export class DvTabControl {
	/** @internal */
	@Element() host!: HTMLDvTabControlElement;

	/** The name of the icon to be rendered. */
	@Prop({ reflect: true }) name?: IconName;

	/** The size of the icon, can be 'xs, 'sm', 'md', 'lg', 'xl'. */
	@Prop({ reflect: true }) size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'xs';

	/** A description that gets read by assistive devices. */
	@Prop({ reflect: true }) label?: string = '';

	/** Reference to the internal button element */
	private buttonEl: HTMLButtonElement;

	/** Programmatically focuses the button element. */
	@Method()
	async setFocus(): Promise<void> {
		this.buttonEl?.focus();
	}

	/** @private */
	render() {
		const baseClasses =
			'p-2 text-default bg-default rounded-full shadow-sm-bottom hover:bg-default-hover shadow-none focus-visible:outline focus-visible:outline-width-lg focus:-outline-offset-2 focus:outline-focus-ring-default focus-visible:ring-focus-ring-default';

		return (
			<Host>
				<button
					class={baseClasses}
					aria-label={this.label}
					type="button"
					ref={(el) => (this.buttonEl = el as HTMLButtonElement)}
					tabIndex={0}
				>
					<span class="flex items-center gap-2">
						<dv-icon name={this.name} size={this.size}></dv-icon>
					</span>
				</button>
			</Host>
		);
	}
}

