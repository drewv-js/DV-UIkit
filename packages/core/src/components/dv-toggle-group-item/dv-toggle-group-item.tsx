import { Component, Element, h, Host, Method, Prop } from '@stencil/core';

let id = 0;

/**
 * ## Overview
 * `dv-toggle-group-item` is an individual selectable segment within an `dv-toggle-group`.
 * Each item can display an icon, a label, or both. Long labels are truncated automatically.
 *
 * ## Accessibility
 * - Uses `role="radio"` for proper selection semantics within the group.
 * - Sets `aria-checked` to communicate state.
 * - `tabindex` is managed by the parent group to support arrow-key navigation.
 * - For icon-only segments, set `aria-label` on the element to provide an accessible name.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Radio Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
 *
 * @summary An individual segment inside an dv-toggle-group that acts as a radio-style selection control.
 *
 * @tag dv-toggle-group-item
 *
 * @slot startIcon - Optional icon displayed to the left of the label.
 */
@Component({
	tag: 'dv-toggle-group-item',
	styleUrl: 'dv-toggle-group-item.scss',
	shadow: true
})
export class DvToggleGroupItem {
	private componentId = `toggle-group-item-${++id}`;
	private buttonEl?: HTMLButtonElement;

	/** @internal */
	@Element() host!: HTMLDvToggleGroupItemElement;

	/** The value associated with this item, used by the parent group for selection tracking. */
	@Prop({ reflect: true }) value!: string;

	/** The text label displayed inside the item. Long labels are truncated. */
	@Prop() label?: string;

	/** Indicates this item is the currently active selection. Managed by the parent group. */
	@Prop({ reflect: true }) active: boolean = false;

	/** @internal Controlled by the parent dv-toggle-group. */
	@Prop() size: 'sm' | 'md' = 'md';

	/** @internal Controlled by the parent group to manage keyboard navigation order. */
	@Prop() itemTabIndex: number = -1;

	/** Programmatically focuses the item. */
	@Method()
	async setFocus(options?: FocusOptions): Promise<void> {
		this.buttonEl?.focus(options);
	}

	private getSizeClasses(): string {
		return this.size === 'sm' ? ' label-sm' : 'label-default';
	}

	/** @private */
	render() {
		const baseClasses = 'w-full flex items-center justify-center gap-1 rounded-radius-rounded py-1 px-2';

		const stateClasses = this.active
			? 'bg-button-knockout text-button-knockout'
			: 'bg-button-default text-button-default cursor-pointer';

		const focusClasses =
			'focus:outline-none focus-visible:outline focus-visible:outline-width-lg focus:outline-offset-0 focus:outline-focus-ring-default focus-visible:ring-focus-ring-default';

		// Fall back to the host's aria-label so icon-only segments still expose an accessible name.
		const ariaLabel = this.label ? undefined : (this.host.getAttribute('aria-label') ?? undefined);

		return (
			<Host>
				<div class="flex w-full min-w-0">
					<button
						id={this.componentId}
						ref={(el) => (this.buttonEl = el as HTMLButtonElement)}
						class={`${baseClasses} ${this.getSizeClasses()} ${stateClasses} ${focusClasses}`}
						role="radio"
						aria-checked={this.active ? 'true' : 'false'}
						aria-label={ariaLabel}
						tabIndex={this.itemTabIndex}
						type="button"
					>
						<slot name="startIcon" />
						{this.label && <span class="truncate min-w-0">{this.label}</span>}
					</button>
				</div>
			</Host>
		);
	}
}

