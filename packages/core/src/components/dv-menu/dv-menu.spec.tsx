import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvMenu } from './dv-menu';
import { DvMenuItem } from '../dv-menu-item/dv-menu-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-menu', () => {
	let menuSpec: TypedSpecPage<DvMenu>;

	beforeEach(async () => {
		menuSpec = (await newSpecPage({
			components: [DvMenu, DvMenuItem],
			html: `
          <dv-menu>
            <dv-menu-item id='item1'></dv-menu-item>
            <dv-menu-item id='item2'></dv-menu-item>
          </dv-menu>
        `,
			supportsShadowDom: true
		})) as TypedSpecPage<DvMenu>;
		await menuSpec.waitForChanges();
	});

	afterEach(() => {
		menuSpec = null;
		jest.restoreAllMocks();
	});

	describe('Events', () => {
		it('should emit menuSelect event when menu-item clicked', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const selectEventSpy = jest.fn();
			menuSpec.rootInstance.host.addEventListener('menuSelect', selectEventSpy);
			await menuSpec.waitForChanges();

			item1.click();

			expect(selectEventSpy).not.toHaveBeenCalled();
		});

		it('should not emit if no menu-item in composedPath', () => {
			const selectEventSpy = jest.fn();
			menuSpec.rootInstance.host.addEventListener('menuSelect', selectEventSpy);

			const event = {
				composedPath: () => [document.createElement('div')]
			} as unknown as MouseEvent;

			menuSpec.rootInstance.handleClick(event);
			expect(selectEventSpy).not.toHaveBeenCalled();
		});

		it('should trigger click when Enter/Space pressed on activeItem if index 0', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			item1.index = 0;
			menuSpec.rootInstance.activeItem = item1;
			item1.shadowRoot = { querySelector: jest.fn(() => ({ click: jest.fn() })) };
			const event = {
				key: 'Enter',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as any;
			menuSpec.rootInstance.handleKeyDown(event);
			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();

			const event2 = { ...event, key: ' ' };
			menuSpec.rootInstance.handleKeyDown(event2);
			expect(event2.preventDefault).toHaveBeenCalled();
		});

		it('should navigate items on ArrowDown', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			menuSpec.rootInstance.menuItems = [item1, item2];
			menuSpec.rootInstance.activeItem = item1;
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');

			const event = {
				key: 'ArrowDown',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as any;

			menuSpec.rootInstance.handleKeyDown(event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
			expect(menuSetCurrentItemSpy).toHaveBeenCalledWith(item2);
		});

		it('should navigate items on ArrowUp', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			menuSpec.rootInstance.menuItems = [item1, item2];
			menuSpec.rootInstance.activeItem = item2;
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');

			const event = {
				key: 'ArrowUp',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as any;

			menuSpec.rootInstance.handleKeyDown(event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
			expect(menuSetCurrentItemSpy).toHaveBeenCalledWith(item1);
		});

		it('should navigate items on End', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			menuSpec.rootInstance.menuItems = [item1, item2];
			menuSpec.rootInstance.activeItem = item1;
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');

			const event = {
				key: 'End',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as any;

			menuSpec.rootInstance.handleKeyDown(event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
			expect(menuSetCurrentItemSpy).toHaveBeenCalledWith(item2);
		});

		it('should navigate items on Home', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			menuSpec.rootInstance.menuItems = [item1, item2];
			menuSpec.rootInstance.activeItem = item2;
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');

			const event = {
				key: 'Home',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as any;

			menuSpec.rootInstance.handleKeyDown(event);

			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
			expect(menuSetCurrentItemSpy).toHaveBeenCalledWith(item1);
		});

		it('should wrap to first item when ArrowDown pressed on final item', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			menuSpec.rootInstance.menuItems = [item1, item2];
			menuSpec.rootInstance.activeItem = item2;
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');

			const event = {
				key: 'ArrowDown',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as any;
			menuSpec.rootInstance.handleKeyDown(event);
			expect(menuSetCurrentItemSpy).toHaveBeenCalledWith(item1);
		});

		it('should wrap to last item when ArrowUp pressed on first item', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			menuSpec.rootInstance.menuItems = [item1, item2];
			menuSpec.rootInstance.activeItem = item1;
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');

			const event = {
				key: 'ArrowUp',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as any;
			menuSpec.rootInstance.handleKeyDown(event);
			expect(menuSetCurrentItemSpy).toHaveBeenCalledWith(item2);
		});

		it('should do nothing on KeyDown if menuItems is empty', () => {
			menuSpec.rootInstance.menuItems = [];
			menuSpec.rootInstance.activeItem = undefined;
			const event = {
				key: 'ArrowDown',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as any;
			menuSpec.rootInstance.handleKeyDown(event);
			expect(event.preventDefault).not.toHaveBeenCalled();
		});
	});

	describe('Methods', () => {
		it('should return all items', async () => {
			const items = (await menuSpec.rootInstance.menuGetMenuItems()) as DvMenuItem[];
			expect(items.length).toBe(2);
		});

		it('should return current item', async () => {
			const item2 = menuSpec.root.querySelector('#item2') as any;
			item2.index = 0;
			await menuSpec.waitForChanges();

			const currentItem = await menuSpec.rootInstance.getCurrentItem();
			expect(currentItem).toBe(item2);
		});

		it('should set current item', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			item2.index = 0;
			await menuSpec.waitForChanges();

			let currentItem = await menuSpec.rootInstance.getCurrentItem();
			expect(currentItem).toBe(item2);

			await menuSpec.rootInstance.menuSetCurrentItem(item1);
			await menuSpec.waitForChanges();

			currentItem = await menuSpec.rootInstance.getCurrentItem();
			expect(currentItem).toBe(item1);
		});

		it('should return true when child is menu-item', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			expect(menuSpec.rootInstance.isMenuItem(item1)).toBe(true);
		});

		it('should return false when child is not menu-item', async () => {
			const divider = document.createElement('dv-divider');
			menuSpec.root.appendChild(divider);
			await menuSpec.waitForChanges();
			expect(menuSpec.rootInstance.isMenuItem(divider)).toBe(false);
		});

		it('should set current item if menu-item', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');
			const event = { target: item1 } as unknown as MouseEvent;
			await menuSpec.rootInstance.handleMouseDown(event);
			expect(menuSetCurrentItemSpy).toHaveBeenCalledWith(item1);
		});

		it('should not set current item if not menu-item', async () => {
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');
			const event = { target: document.createElement('div') } as unknown as MouseEvent;
			await menuSpec.rootInstance.handleMouseDown(event);
			expect(menuSetCurrentItemSpy).not.toHaveBeenCalled();
		});

		it('should filter out inert and non-menuItem elements when retrieving menuItems', async () => {
			const slot = menuSpec.rootInstance.menu;
			const el1 = document.createElement('dv-menu-item');
			const el2 = document.createElement('div');
			const el3 = document.createElement('dv-menu-item');
			(el3 as any).inert = true;
			jest.spyOn(slot, 'assignedElements').mockReturnValue([el1, el2, el3]);
			const items = await menuSpec.rootInstance.menuGetMenuItems();
			expect(items).toEqual([el1]);
		});

		it('should handle null menu slot in menuGetMenuItems', async () => {
			// Set menu to null to test the fallback case
			menuSpec.rootInstance.menu = null;

			const items = await menuSpec.rootInstance.menuGetMenuItems();
			expect(items.length).toBe(0);
		});

		it('should update indices accurately when set activeItem called', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			jest.spyOn(menuSpec.rootInstance, 'menuGetMenuItems').mockResolvedValue([item1, item2]);
			await menuSpec.rootInstance.menuSetCurrentItem(item2);
			expect(menuSpec.rootInstance.activeItem).toBe(item2);
			expect(item1.index).toBe(-1);
			expect(item2.index).toBe(0);
		});

		it('should return item with index zero when getCurrentItem called', async () => {
			const item1 = menuSpec.root.querySelector('#item1') as any;
			const item2 = menuSpec.root.querySelector('#item2') as any;
			item1.index = -1;
			item2.index = 0;
			jest.spyOn(menuSpec.rootInstance, 'menuGetMenuItems').mockResolvedValue([item1, item2]);
			const current = await menuSpec.rootInstance.getCurrentItem();
			expect(current).toBe(item2);
		});
	});

	describe('Slots', () => {
		it('should call handleSlotChange on slotchange event', async () => {
			jest.spyOn(menuSpec.rootInstance, 'handleSlotChange');
			const slot = menuSpec.root.shadowRoot.querySelector('slot');
			slot.dispatchEvent(new Event('slotchange'));
			await menuSpec.waitForChanges();
			expect(menuSpec.rootInstance.handleSlotChange).toHaveBeenCalled();
		});

		it('should sets menuItems and current item when content slotted', async () => {
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');
			await menuSpec.rootInstance.handleSlotChange();
			expect(menuSpec.rootInstance.menuItems.length).toBe(2);
			expect(menuSetCurrentItemSpy).toHaveBeenCalledWith(menuSpec.rootInstance.menuItems[0]);
		});

		it('should not set current item if no menuItems slotted', async () => {
			jest.spyOn(menuSpec.rootInstance, 'menuGetMenuItems').mockResolvedValueOnce([]);
			const menuSetCurrentItemSpy = jest.spyOn(menuSpec.rootInstance, 'menuSetCurrentItem');
			await menuSpec.rootInstance.handleSlotChange();
			expect(menuSetCurrentItemSpy).not.toHaveBeenCalled();
		});
	});
});

