/**
 * Event name for item click events.
 * Emitted when a list item is clicked.
 */
export const ITEM_CLICK_EVENT = 'itemClick';

export interface ItemClickEventDetail {
	value: string;
	native: MouseEvent;
}

