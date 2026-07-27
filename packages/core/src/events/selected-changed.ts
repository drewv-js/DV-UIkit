/**
 * Event name for step selection change.
 * Emitted when a step is clicked and its selection state changes.
 * Payload contains the HTMLDvStepElement that was selected.
 */
export const SELECTED_CHANGED_EVENT = 'selectedChanged';

/**
 * Event detail type for selectedChanged event.
 * Contains the step element that was selected.
 */
export type SelectedChangedEventDetail = HTMLDvStepElement;

