import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, h, Host, Prop, Watch } from '@stencil/core';
import { VALUE_CHANGE_EVENT } from '../../events';
import type { ValueChangeEventDetail } from '../../events';

/**
 * ## Overview
 * `dv-toggle-group` is a lightweight mode-switching control that renders a set of visually
 * connected segments. Exactly one segment is active at a time.
 *
 * Use it when all segments act on the same content — for example, switching between chart types or
 * view layouts. All segments share the available width equally. Long labels truncate automatically.
 *
 * **Use Tabs** when switching between distinct content sections.
 * **Use Toggle Group** when controlling how content is shown or behaves.
 *
 * ## Accessibility
 * - Uses `role="radiogroup"` for the container.
 * - Each segment uses `role="radio"` with `aria-checked`.
 * - Arrow keys (Left/Right/Up/Down) navigate between segments; Home/End jump to first/last.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
 * - [dv-toggle-group-item](/docs/components-toggle-group-toggle-group-item--docs)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-toggle-group-item>` | Individual selectable segments |
 * | `<dv-icon>` | Optional icons for each segment |
 *
 * @summary A set of visually connected, equally-sized segments where exactly one is active at a time.
 *
 * @tag dv-toggle-group
 *
 * @slot - Container for `dv-toggle-group-item` elements.
 */
@Component({
	tag: 'dv-toggle-group',
	styleUrl: 'dv-toggle-group.scss',
	shadow: true
})
export class DvToggleGroup {
	/** @internal */
	@Element() host!: HTMLDvToggleGroupElement;

	/** The size variant applied to all segments. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** The value of the currently active segment. */
	@Prop({ mutable: true }) value?: string;

	/** An accessible label for the group used by assistive technologies. */
	@Prop() label?: string;

	/** Emitted when the selected segment changes. The new value is provided in `event.detail.value`. */
	@Event({ eventName: VALUE_CHANGE_EVENT }) valueChange!: EventEmitter<ValueChangeEventDetail>;

	/** @private */
	@Watch('value')
	watchValue() {
		this.syncItems();
	}

	/** @private */
	@Watch('size')
	watchSize() {
		this.syncItems();
	}

	/** @private */
	componentDidLoad() {
		this.syncItems();
	}

	private getItems(): HTMLDvToggleGroupItemElement[] {
		return Array.from(this.host.querySelectorAll<HTMLDvToggleGroupItemElement>('dv-toggle-group-item'));
	}

	private syncItems() {
		const items = this.getItems();
		const activeItem = items.find((item) => item.value === this.value);
		const tabTarget = activeItem ?? items[0];

		items.forEach((item) => {
			item.active = item.value === this.value;
			item.size = this.size;
			item.itemTabIndex = item === tabTarget ? 0 : -1;
		});
	}

	/* istanbul ignore next */
	private handleClick = (event: MouseEvent) => {
		const path = event.composedPath();
		const item = path.find((el) => (el as HTMLElement)?.tagName?.toLowerCase() === 'dv-toggle-group-item') as
			HTMLDvToggleGroupItemElement | undefined;

		if (!item) return;
		if (item.value === this.value) return;

		this.value = item.value;
		this.syncItems();
		this[VALUE_CHANGE_EVENT].emit({ value: this.value });
	};

	/* istanbul ignore next */
	private handleKeyDown = (event: KeyboardEvent) => {
		const path = event.composedPath();
		const item = path.find((el) => (el as HTMLElement)?.tagName?.toLowerCase() === 'dv-toggle-group-item') as
			HTMLDvToggleGroupItemElement | undefined;

		if (!item) return;

		const items = this.getItems();
		const index = items.indexOf(item);
		if (index === -1) return;

		// Space or Enter selects the currently focused item
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			if (item.value !== this.value) {
				this.value = item.value;
				this.syncItems();
				this[VALUE_CHANGE_EVENT].emit({ value: this.value });
			}
			return;
		}

		let newIndex = index;

		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowUp':
				newIndex = index > 0 ? index - 1 : items.length - 1;
				break;
			case 'ArrowRight':
			case 'ArrowDown':
				newIndex = index < items.length - 1 ? index + 1 : 0;
				break;
			case 'Home':
				newIndex = 0;
				break;
			case 'End':
				newIndex = items.length - 1;
				break;
			default:
				return;
		}

		event.preventDefault();
		// Move focus only — do not change the selected value
		items.forEach((it, i) => {
			it.itemTabIndex = i === newIndex ? 0 : -1;
		});
		void items[newIndex].setFocus({ preventScroll: true });
	};

	/** @private */
	render() {
		return (
			<Host>
				<div
					class="w-full grid grid-flow-col auto-cols-fr border border-default rounded-radius-rounded overflow-hidden p-1 gap-1"
					role="radiogroup"
					aria-label={this.label}
					tabIndex={-1}
					onClick={this.handleClick}
					onKeyDown={this.handleKeyDown}
				>
					<slot onSlotchange={() => this.syncItems()} />
				</div>
			</Host>
		);
	}
}

