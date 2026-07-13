import { Component, h, Host } from '@stencil/core';

/**
 * Bottom page container for legal text, metadata, and secondary links.
 *
 * @slot - Footer content rendered in a two-column flex layout.
 */
@Component({
  tag: 'dv-footer',
  styleUrl: 'footer.scss',
  shadow: true
})
export class DvFooter {
	/** @private */
	render() {
		return (
			<Host>
				<footer>
					<div class="p-6 bg-neutral-50 border-t border-neutral-200">
						<div class="flex justify-between text-sm text-neutral-500">
							<slot></slot>
						</div>
					</div>
				</footer>
			</Host>
		);
	}
}
