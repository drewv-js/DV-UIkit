import type { EventEmitter } from '@stencil/core';
import { Component, Host, h, Prop, Event, Method, Watch, Element, State } from '@stencil/core';
import type { DvListItem } from '../dv-list-item/dv-list-item';
import { ITEM_SELECTED_EVENT, VALUE_CHANGE_EVENT, ITEM_CLICK_EVENT } from '../../events';
import type { ItemSelectedEventDetail, ValueChangeEventDetail } from '../../events';

/**
 * ## Overview
 * The List component provides a container for displaying collections of related [dv-list-item](/docs/components-list-list-item--docs)
 * elements. It manages proper spacing and organization of list items while supporting both ordered and unordered list patterns.
 *
 * The component implements semantic list structures while providing consistent styling and spacing between items.
 *
 * Lists maintain proper HTML semantics through `<dv-list-item>` children while providing flexibility for
 * different types of content organization.
 *
 * The `<dv-list>` component supports these display patterns:
 * - **Radio Button Lists**: Single-selection with native radio button functionality
 * - **Nested Lists**: Hierarchical item organization
 * - **Custom Markers**: Configurable list markers
 * - **Spacing Control**: Consistent item spacing
 * - **Programmatic Control**: Methods for controlling selection and radio mode
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
 * @summary A selection list container for `<dv-list-item>` elements with optional radio-button mode and form association.
 *
 * @tag dv-list
 *
 * @slot - One or more `<dv-list-item>` elements to display in the list.
 */
@Component({
	tag: 'dv-list',
	styleUrl: 'dv-list.scss',
	shadow: true,
	formAssociated: true
})
export class DvList {
	/** @internal */
	@Element() hostElement!: HTMLDvListElement;

	private internals: ElementInternals | null = null;
	private defaultValue: string = '';
	private valueHasChanged: boolean = false;

	/** @internal */
	/** The currently selected item value. */
	@Prop({ mutable: true, reflect: true }) value: string = '';
	/** The form input name used for form submission. */
	@Prop({ mutable: true }) name: string;
	/** The accessible label for the list. */
	@Prop({ mutable: true }) label: string;
	/** Marks the list as required for form submission. */
	@Prop({ mutable: true }) required: boolean = false;
	/** Optional help text displayed below the list. */
	@Prop({ mutable: true }) helpText: string;
	/** Error message displayed when validation fails. */
	@Prop({ mutable: true }) errorText: string = '';
	/** When true, displays radio buttons for single-selection mode. */
	@Prop({ mutable: true, reflect: true }) showRadio: boolean = false;

	/** @internal */
	@State() hasError: boolean = false;

	/** Emitted when an item is selected */
	@Event({ eventName: ITEM_SELECTED_EVENT })
	itemSelected: EventEmitter<ItemSelectedEventDetail>;

	/** Emitted when the list item value changes */
	@Event({ eventName: VALUE_CHANGE_EVENT })
	valueChange: EventEmitter<ValueChangeEventDetail>;

	private observer?: MutationObserver;
	/** @internal */
	static DISABLE_MUTATION_OBSERVER = false;

	constructor() {
		// Validation to allow unit tests to run without ElementInternals support
		try {
			if (typeof this.hostElement.attachInternals === 'function') {
				this.internals = this.hostElement.attachInternals();
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('ElementInternals not supported', e.message);
		}
	}

	/** @private */
	componentWillLoad() {
		this.defaultValue = this.value;
		this.updateListItemProps();
		this.validateInput(this.value);
		this.updateFormValue(this.value);
	}

	private getListItems(): HTMLDvListItemElement[] {
		return Array.from(this.hostElement.querySelectorAll('dv-list-item'));
	}

	private updateListItemProps() {
		const items = this.getListItems();
		items.forEach((item) => {
			item.name = this.getRadioGroupName();
			item.selected = item.value === this.value;
		});
	}

	/** Sets a new selected value for the list. Pass an item value to select it, or an empty string to clear selection. */
	@Method()
	async listSetSelectedItem(value: string) {
		if (value !== this.value) {
			const items = this.getListItems();
			const targetItem = items.find((item) => item.value && item.value === value);

			if (targetItem && !targetItem.disabled) {
				this.value = value;
				this.updateListItemProps();
				return true;
			} else if (value === '') {
				this.value = value;
				this.updateListItemProps();
				return true;
			}
		}
		return false;
	}

	/** @private */
	@Watch('required')
	requiredHandler() {
		this.validateInput(this.value);
	}

	/** @private */
	@Watch('showRadio')
	async showRadioHandler() {
		await this.updateListItems();
	}

	/** @private */
	@Watch('name')
	async nameHandler() {
		this.updateListItemProps();
	}

	/** @private */
	@Watch('value')
	async valueHandler(newValue: string) {
		if (!this.valueHasChanged && this.defaultValue === newValue) {
			return;
		}
		await this.updateListItems();

		this.validateInput(newValue);
		this.updateFormValue(newValue);

		this[ITEM_SELECTED_EVENT].emit({ value: this.value });
		this[VALUE_CHANGE_EVENT].emit({ value: this.value });
		this.valueHasChanged = true;
	}

	/** @private */
	@Watch('errorText')
	errorTextChanged() {
		this.validateInput(this.value);
		this.updateValidityState();
	}

	/** @private */
	@Watch('helpText')
	helpTextChanged() {
		this.validateInput(this.value);
	}

	/** Validates the input value */
	/** @private */
	validateInput(_value: string) {
		this.hasError = this.errorText.trim() !== '';
		this.updateValidityState();
	}

	/** @private */
	updateValidityState() {
		if (!this.internals) return;
		try {
			if (this.hasError) {
				this.internals.setValidity?.({ customError: true }, this.errorText);
			} else {
				this.internals.setValidity?.({});
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('Validity state update not supported', e.message);
		}
	}

	/** @private */
	updateFormValue(value: string) {
		if (this.internals?.setFormValue) {
			try {
				this.internals.setFormValue(value || null);
			} catch (e) {
				console.warn('Form value update not supported', e.message);
			}
		}
	}

	/** @private */
	handleDefaultSlotChange() {
		const allItems = this.getListItems();
		const itemValues: string[] = [];

		// Check for duplicate values and collect valid values
		allItems.forEach((item) => {
			if (item.value) {
				itemValues.push(item.value);
			}
		});

		if (this.value) {
			const matchedItem = allItems.find((item) => item.value && this.value === item.value);
			if (matchedItem) {
				void this.listSetSelectedItem(matchedItem.value);
			}
		}
	}

	/** @private */
	private handleItemClick = async (event: CustomEvent<{ value: string }>) => {
		const clickedValue = event.detail.value;
		await this.listSetSelectedItem(clickedValue);
		this.validateInput(this.value);
	};

	/** @private */
	async componentDidLoad() {
		await this.updateListItems();

		this.hostElement.addEventListener(
			ITEM_CLICK_EVENT,
			(event: CustomEvent<{ value: string }>) => void this.handleItemClick(event)
		);

		if (!DvList.DISABLE_MUTATION_OBSERVER) {
			this.observer = new MutationObserver(() => {
				void this.updateListItems();
			});

			this.observer.observe(this.hostElement, { childList: true, subtree: true });
		}
	}

	/** @private */
	disconnectedCallback() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	/** @private */
	async componentDidRender() {
		this.applyMarginClasses();
	}

	private applyMarginClasses() {
		const items = this.getListItems();
		items.forEach((item, index) => {
			const listItem = item.shadowRoot?.querySelector('li');
			if (listItem) {
				if (index < items.length - 1) {
					listItem.classList.add('mb-2.5');
				} else {
					listItem.classList.remove('mb-2.5');
				}
			}
		});
	}

	private getRadioGroupName(): string {
		return this.name;
	}

	private async updateListItems() {
		const items = this.getListItems();
		this.updateListItemProps();

		const promises = items.map(async (item) => {
			await (item as unknown as DvListItem).listItemSetRadio(this.showRadio);
		});

		await Promise.all(promises);
	}

	/** @private */
	render() {
		return (
			<Host>
				<fieldset class="border-0 p-0 m-0">
					{this.label && (
						<legend class="flex p-0 mb-0">
							<dv-label
								label={this.label}
								variant={this.hasError ? 'error' : undefined}
								required={this.required}
								class="label-default"
							></dv-label>
						</legend>
					)}
					<div class="list-none p-0">
						<slot onSlotchange={() => this.handleDefaultSlotChange()}></slot>
					</div>
				</fieldset>
				{this.helpText && <div class="body-default mt-1 text-default">{this.helpText}</div>}
				{this.hasError && (
					<div class="body-default mt-1">
						<span class="text-status-error">{this.errorText}</span>
					</div>
				)}
			</Host>
		);
	}
}

