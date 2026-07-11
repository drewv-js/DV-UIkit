import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'dv-app-bar',
  styleUrl: 'app-bar.scss',
  shadow: true
})
export class DvAppBar {
@Prop({ reflect: true }) label?: string = '';

	/** @private */
	render() {
		return (
			<Host>
				<header
					aria-label={this.label}
					class="min-h-12 fixed z-10 top-0 left-0 w-full flex items-center justify-between bg-[image:--oui-theme-app-bar-color-background-default] px-6 py-1"
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
