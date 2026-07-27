import { Component, Host, h } from '@stencil/core';

/**
 * ## Overview
 * The CarouselItem is a container component designed to be used within a Carousel to display custom content.
 *
 * ## Resources
 * - [WAI-ARIA Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
 *
 * @summary A single slide container for use inside an `<dv-carousel>`.
 *
 * @tag dv-carousel-item
 *
 * @slot - Content displayed within the CarouselItem.
 */
@Component({
	tag: 'dv-carousel-item',
	styleUrl: 'dv-carousel-item.scss',
	shadow: true
})
export class DvCarouselItem {
	/** @private */
	render() {
		return (
			<Host>
				<div class={'flex flex-col snap-start snap-always w-full max-h-full overflow-auto justify-center'}>
					<slot></slot>
				</div>
			</Host>
		);
	}
}

