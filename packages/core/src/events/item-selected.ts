/**
 * Event name for item selection events.
 * Emitted when an item is selected in a list or collection component.
 */
export const ITEM_SELECTED_EVENT = 'itemSelected';

export interface ItemSelectedEventDetail {
	value: string;
}

