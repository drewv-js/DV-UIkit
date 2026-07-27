import type { EventEmitter } from '@stencil/core';
import { Component, Host, h, Prop, Event, Method, Watch, Element, State } from '@stencil/core';
import { ITEM_CLICK_EVENT } from '../../events';
import type { ItemClickEventDetail } from '../../events';

/**
 * ## Overview
 * The List Item component represents an individual item within a list structure. It must be used as a child of the
 * [dv-list](/docs/components-list--docs) component to maintain proper list semantics and styling.
 *
 * The component maintains proper list item semantics while providing a flexible container for content through its
 * default slot.
 *
 * List items preserve proper HTML structure and spacing while allowing for custom content and nested lists
 * to create hierarchical structures.
 *
 * The `<dv-list-item>` component supports these display patterns:
 * - **Content Flexibility**: Any valid HTML content
 * - **Radio Button Use**: Single-selection with radio buttons (controlled by parent dv-list)
 * - **Nested Lists**: Support for sub-lists
 * - **Marker Alignment**: Proper bullet/number alignment
 * - **Content Flow**: Maintains proper text wrapping
 * - **Spacing**: Consistent item separation
 *
 * ## Accessibility
 * - Uses ARIA `role="alert"` for proper semantic meaning
 * - Proper aria-hidden management based on open state
 * - Includes accessible close button with aria-label
 * - Keyboard accessible close button
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * @summary An individual selectable item for use inside an `<dv-list>`, with optional radio-button mode and click events.
 *
 * @tag dv-list-item
 *
 * @slot - Content of the list item title.
 * @slot description - Content of the list item description.
 */
@Component({
	tag: 'dv-list-item',
	styleUrl: 'dv-list-item.scss',
	shadow: true
})
export class DvListItem {
	/** @internal */
	@Element() hostElement!: HTMLDvListItemElement;

	private listItemRef?: HTMLLIElement | HTMLLabelElement;

	/** The value associated with this list item, used for selection tracking and form submission. */
	@Prop({ reflect: true, mutable: true }) value: string;
	/** Whether this list item is currently selected. */
	@Prop({ mutable: true }) selected: boolean = false;
	/** Disables the list item, preventing selection and interaction. */
	@Prop({ mutable: true }) disabled: boolean = false;
	/** The radio group name, synchronized from the parent `<dv-list>`. */
	@Prop({ reflect: true, mutable: true }) name: string = '';

	/** Emitted when the list item is clicked */
	@Event({ eventName: ITEM_CLICK_EVENT }) itemClick: EventEmitter<ItemClickEventDetail>;

	@State() private radioRef: boolean = false;

	/** @private */
	@Watch('value')
	handleValueChange() {
		if (this.value != null && typeof this.value !== 'string') {
			this.value = String(this.value);
		}

		// replace spaces with underscores as spaces can cause issues in some scenarios
		if (this.value?.includes(' ')) {
			this.value = this.value.replace(/ /g, '_');
		}
	}

	/** @internal Sets whether this item should display a radio button (controlled by the parent `<dv-list>`). */
	@Method()
	async listItemSetRadio(show: boolean) {
		this.radioRef = show;
	}

	/** Programmatically sets the selected state of this list item. */
	@Method()
	async listItemSetSelected(selected: boolean) {
		this.selected = selected;
	}

	/** Programmatically focuses the list item element. */
	@Method()
	async listItemSetFocus(options?: FocusOptions) {
		if (this.listItemRef) {
			this.listItemRef.focus(options);
		}
	}

	/** @private */
	@Watch('selected')
	selectedHandler() {
		this.hostElement.setAttribute('aria-selected', this.selected ? 'true' : 'false');
	}

	/** @private */
	@Watch('disabled')
	disabledHandler() {
		this.hostElement.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
	}

	private handleRadioChange = (_event: Event) => {
		if (!this.disabled && this.value) {
			const syntheticEvent = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				detail: 1
			});

			this[ITEM_CLICK_EVENT].emit({
				value: this.value,
				native: syntheticEvent
			});
		}
	};

	/** @private */
	componentWillLoad() {
		this.selectedHandler();
		this.disabledHandler();
	}

	/** @private */
	render() {
		const baseClasses =
			'mb-4 p-4 body-default text-default transition-all duration-150 bg-form-default border-width-sm rounded-radius-lg border-form-default flex flex-row align-items-center';
		const disabledClass = this.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer';
		const outlineClass = this.selected
			? 'outline outline-width-sm outline-focus-ring-default border-transparent'
			: 'focus:outline-width-lg focus:outline-offset-0 focus-visible:outline-width-lg focus-visible:outline focus:outline-focus-ring-default focus-visible:ring-focus-ring-default';
		const disabledRadioClasses = this.disabled
			? 'disabled:border-form-disabled disabled:bg-form-disabled disabled:cursor-not-allowed'
			: '';
		const itemTitleClasses = 'label-default text-default mb-1';
		const descriptionClasses = 'body-default text-default';

		const shouldShowRadio = this.radioRef;

		const radioClasses = shouldShowRadio
			? `mr-4 self-center appearance-none checked:bg-brand-knockout checked:hover:bg-brand-knockout checked:focus:bg-brand-knockout ${disabledRadioClasses} focus:ring-offset-0 ring-0 shadow-none focus:outline-none focus:ring-0 focus:shadow-none focus:outline-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none`
			: 'sr-only';

		return (
			<Host>
				<label
					aria-labelledby="item-title"
					tabIndex={this.disabled ? -1 : 0}
					ref={(el) => (this.listItemRef = el as HTMLLabelElement)}
					class={`${baseClasses} ${disabledClass} ${outlineClass}`}
				>
					<input
						aria-describedby="item-description"
						type="radio"
						name={this.name}
						value={this.value}
						checked={this.selected}
						disabled={this.disabled}
						tabIndex={-1}
						onChange={(event) => this.handleRadioChange(event)}
						class={radioClasses}
					/>
					<div>
						<div class={itemTitleClasses}>
							<slot></slot>
						</div>
						<div class={descriptionClasses}>
							<slot name="description"></slot>
						</div>
					</div>
				</label>
			</Host>
		);
	}
}

