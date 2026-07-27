/**
 * Event name for component close requests.
 * Emitted with payload indicating the source of the close request.
 * This event is typically cancelable via event.preventDefault().
 */
export const REQUEST_CLOSE_EVENT = 'requestClose';

/**
 * Payload for requestClose event.
 */
export interface RequestCloseEventDetail {
	source: 'close-button' | 'keyboard' | 'overlay';
}

