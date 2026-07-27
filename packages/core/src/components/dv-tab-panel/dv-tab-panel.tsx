import { Component, Element, h, Host, Prop } from '@stencil/core';

let id = 0;

/**
 * ## Overview
 * `dv-tab-panel` holds the content associated with an `dv-tab` button. It must be placed inside an
 * `dv-tab-group` and its `name` must match the `panel` property of its corresponding `dv-tab`.
 *
 * ## Accessibility
 * - Renders with `role="tabpanel"` to correctly associate content with its controlling tab.
 * - Panel visibility is controlled by the `active` property managed by the parent `dv-tab-group`.
 * - View [Accessibility](/docs/accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
 *
 * @summary The content panel paired with an dv-tab, shown when the tab is active.
 *
 * @tag dv-tab-panel
 *
 * @slot - Content to display when the tab panel is active.
 */
@Component({
	tag: 'dv-tab-panel',
	styleUrl: 'dv-tab-panel.scss',
	shadow: true
})
export class DvTabPanel {
	private componentId = `tab-panel-${++id}`;

	@Element() host!: HTMLDvTabPanelElement;

	/** The tab panel's name. */
	@Prop() name = '';

	/** When true, the tab panel will be shown. */
	@Prop({ reflect: true }) active = false;

	/** @private */
	render() {
		return (
			<Host>
				<div id={this.host.id || this.componentId} class={this.active ? 'block' : 'hidden'}>
					<div class="body-default text-default" role="tabpanel">
						<slot />
					</div>
				</div>
			</Host>
		);
	}
}

