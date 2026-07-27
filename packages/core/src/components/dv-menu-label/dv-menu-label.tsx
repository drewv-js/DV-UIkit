import { Component, Host, h } from '@stencil/core';

/**
 * ## Overview
 * The Menu Label component renders a non-interactive label within an `<dv-menu>`, providing a section heading
 * or group label to organize related menu items.
 *
 * It is typically placed between groups of `<dv-menu-item>` elements to visually separate them.
 *
 * ## Accessibility
 * - Renders as a non-interactive `<span>` — not a `menuitem` role
 * - Provides visual grouping; use `aria-label` on the parent menu for group semantics if needed
 *
 * @summary A non-interactive label for grouping and labeling sections within an `<dv-menu>`.
 *
 * @tag dv-menu-label
 *
 * @slot - The label text or content.
 */
@Component({
	tag: 'dv-menu-label',
	styleUrl: 'dv-menu-label.scss',
	shadow: true
})
export class DvMenuLabel {
	render() {
		return (
			<Host>
				<span class={'inline-block label-default text-default px-4 py-2'}>
					<slot></slot>
				</span>
			</Host>
		);
	}
}

