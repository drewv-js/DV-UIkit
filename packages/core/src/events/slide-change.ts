/**
 * Event name for slide change in carousel components.
 * Emitted when the active slide changes.
 */
export const SLIDE_CHANGE_EVENT = 'slideChange';

/**
 * Event detail payload for slideChange event.
 */
export interface SlideChangeEventDetail {
	/** The index of the new active slide */
	index: number;
	/** The active slide element */
	slide: HTMLDvCarouselItemElement;
}

