import { Component, h, Host, Prop } from '@stencil/core';

/**
 * Top application bar with named slots for left, center, and right content.
 *
 * @slot left - Content shown on the left side, typically logo or navigation trigger.
 * @slot center - Content centered in the bar, typically page title.
 * @slot right - Content shown on the right side, typically actions or profile menu.
 */
@Component({
  tag: 'dv-app-bar',
  styleUrl: 'app-bar.scss',
  shadow: true
})
export class DvAppBar {
	/** Accessible label applied to the header landmark. */
	@Prop({ reflect: true }) label?: string = '';

	/** @private */
	render() {
		return (
			<Host>
				<header
					aria-label={this.label}
					class="min-h-12 fixed z-10 top-0 left-0 w-full flex items-center justify-between bg-neutral-50 px-6 py-1"
				>
					<div class="items-center gap-4">
						<slot name="left"></slot>
					</div>

					<div class="justify-center gap-4">
						<slot name="center"></slot>
					</div>

					<div class="items-center gap-4">
						<slot name="right"></slot>
					</div>
				</header>
			</Host>
		);
	}
}
