import { Component, Host, h } from '@stencil/core';

/**
 * ## Overview
 * The Skeleton component provides a loading placeholder animation that mimics the shape and size of content being loaded.
 * It helps maintain layout stability and provides visual feedback during data fetching.
 *
 * The component uses a subtle animation effect to indicate loading state while preserving the approximate dimensions
 * and shape of the content being loaded.
 *
 * By maintaining consistent sizing during loading states, the skeleton prevents layout shifts and provides users with
 * a visual indication of content structure.
 *
 * The `<dv-skeleton>` component supports these display patterns:
 * - **Block Loading**: Full-width content blocks
 * - **Text Lines**: Multiple line text placeholders
 * - **Custom Dimensions**: Specific width/height values
 * - **Flexible Sizing**: Responsive width handling
 * - **Container Adaptation**: Fits parent constraints
 *
 * ## Accessibility
 * - Uses `aria-hidden="true"` as it is purely decorative.
 * - Non-interactive element.
 * - Maintains layout stability.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Loading Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/loading/)
 *
 * @summary A loading placeholder that animates to indicate pending content.
 *
 * @tag dv-skeleton
 */
@Component({
	tag: 'dv-skeleton',
	styleUrl: 'dv-skeleton.scss',
	shadow: true
})
export class DvSkeleton {
	/** @private */
	render() {
		return (
			<Host>
				<div class="animate-pulse size-full bg-strong rounded-radius-lg min-h-4"></div>
			</Host>
		);
	}
}

