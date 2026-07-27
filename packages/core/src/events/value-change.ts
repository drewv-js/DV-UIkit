/**
 * Event name for value change events in custom components.
 * Emitted when a component's value changes, providing the new value in the detail.
 */
export const VALUE_CHANGE_EVENT = 'valueChange';

export interface ValueChangeEventDetail {
	value: string;
}

