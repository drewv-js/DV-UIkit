import type { DvMenuItem } from '../components/dv-menu-item/dv-menu-item';

/**
 * Event name for menu select events.
 * Emitted when a menu item is selected.
 */
export const MENU_SELECT_EVENT = 'menuSelect';

export interface MenuSelectEventDetail {
	item: DvMenuItem;
}

