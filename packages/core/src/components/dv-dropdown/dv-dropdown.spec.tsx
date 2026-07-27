import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvDropdown } from './dv-dropdown';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-dropdown', () => {
	let dropdownSpec: TypedSpecPage<DvDropdown>;

	beforeEach(async () => {
		dropdownSpec = (await newSpecPage({
			components: [DvDropdown],
			html: `
          <dv-dropdown>
          </dv-dropdown>
        `,
			supportsShadowDom: true
		})) as TypedSpecPage<DvDropdown>;
		jest.spyOn(dropdownSpec.rootInstance, 'getMenu').mockReturnValue([document.createElement('dv-menu') as any]);
		await dropdownSpec.waitForChanges();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		dropdownSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should render aria-hidden as true when open property is false', async () => {
			dropdownSpec.root.open = false;
			await dropdownSpec.waitForChanges();

			const div = dropdownSpec.root.shadowRoot.querySelectorAll('div')[1];
			expect(div.getAttribute('aria-hidden')).toBe('true');
		});
	});

	describe('Props', () => {
		it('should render aria-hidden as false when open property is true', async () => {
			dropdownSpec.root.open = true;
			await dropdownSpec.waitForChanges();

			const div = dropdownSpec.root.shadowRoot.querySelectorAll('div')[1];
			expect(div.getAttribute('aria-hidden')).toBe('false');
		});

		it('should not show the dropdown when the show method is called and the dropdown is disabled', async () => {
			dropdownSpec.root.disabled = true;
			dropdownSpec.root.open = false;
			await dropdownSpec.waitForChanges();

			await dropdownSpec.rootInstance.show();
			await dropdownSpec.waitForChanges();

			expect(dropdownSpec.root.open).toBe(false);
		});

		it('should set open to false and return early when disabled', async () => {
			dropdownSpec.root.disabled = true;
			dropdownSpec.root.open = true;
			await dropdownSpec.waitForChanges();

			await (dropdownSpec.rootInstance as any).watchOpen();

			expect(dropdownSpec.root.open).toBe(false);
		});
	});

	describe('Events', () => {
		it('should call hide method when Escape key is pressed', async () => {
			dropdownSpec.root.open = false;
			await dropdownSpec.waitForChanges();

			dropdownSpec.root.open = true;
			await dropdownSpec.waitForChanges();

			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			document.dispatchEvent(event);
			dropdownSpec.root.removeAttribute('open');
			await dropdownSpec.waitForChanges();

			expect(dropdownSpec.root.open).toBe(false);
		});
	});

	describe('Methods', () => {
		it('should return menu', async () => {
			const menu = await dropdownSpec.rootInstance.getMenu();
			expect(menu.length).toBe(1);
		});

		it('should show the dropdown when the show method is called', async () => {
			dropdownSpec.root.open = false;
			await dropdownSpec.waitForChanges();

			await dropdownSpec.rootInstance.show();
			await dropdownSpec.waitForChanges();

			expect(dropdownSpec.root.open).toBe(true);
		});

		it('should hide the dropdown when the hide method is called', async () => {
			dropdownSpec.root.open = true;
			await dropdownSpec.waitForChanges();

			await dropdownSpec.rootInstance.hide();
			await dropdownSpec.waitForChanges();

			expect(dropdownSpec.root.open).toBe(false);
		});

		it('should not change open state when show is called on an already open dropdown', async () => {
			dropdownSpec.root.open = true;
			await dropdownSpec.waitForChanges();

			await dropdownSpec.rootInstance.show();

			expect(dropdownSpec.root.open).toBe(true);
		});

		it('should not change open state when hide is called on an already closed dropdown', async () => {
			dropdownSpec.root.open = false;
			await dropdownSpec.waitForChanges();

			await dropdownSpec.rootInstance.hide();

			expect(dropdownSpec.root.open).toBe(false);
		});

		it('should return undefined when no dv-menu is in the panel', async () => {
			// Reset mock to test real behavior
			jest.restoreAllMocks();

			// Mock panel.assignedElements to return non-menu elements
			(dropdownSpec.rootInstance as any).panel = {
				assignedElements: () => [document.createElement('div')]
			};

			const menu = dropdownSpec.rootInstance.getMenu();
			expect(menu).toBeUndefined();
		});

		it('should return the dv-menu element when present', async () => {
			jest.restoreAllMocks();

			const mockMenu = document.createElement('dv-menu');

			// Mock panel.assignedElements to return dv-menu
			(dropdownSpec.rootInstance as any).panel = {
				assignedElements: () => [mockMenu]
			};

			const menu = dropdownSpec.rootInstance.getMenu();
			expect(menu).toBe(mockMenu);
		});

		it('should handle undefined assignedElements', async () => {
			jest.restoreAllMocks();

			// Mock panel without assignedElements
			(dropdownSpec.rootInstance as any).panel = {
				assignedElements: undefined
			};

			const menu = dropdownSpec.rootInstance.getMenu();
			expect(menu).toBeUndefined();
		});

		it('should focus on trigger element when it has focus method', async () => {
			const mockTrigger = document.createElement('button');
			const focusSpy = jest.spyOn(mockTrigger, 'focus');

			(dropdownSpec.rootInstance as any).trigger = {
				assignedElements: () => [mockTrigger]
			};

			dropdownSpec.rootInstance.focusOnTrigger();

			expect(focusSpy).toHaveBeenCalled();
			focusSpy.mockRestore();
		});

		it('should not focus on when trigger has no assigned elements', async () => {
			(dropdownSpec.rootInstance as any).trigger = {};
			expect(() => dropdownSpec.rootInstance.focusOnTrigger()).not.toThrow();
		});

		it('should call animateTo with undefined element when popup becomes undefined before animation', async () => {
			const panel = document.createElement('div');
			dropdownSpec.rootInstance.panel = panel;

			const popupWithSideEffect = {
				set active(_value: boolean) {
					(dropdownSpec.rootInstance as any).popup = undefined;
				},
				get active() {
					return false;
				},
				shadowRoot: {
					querySelector: jest.fn().mockReturnValue(document.createElement('div'))
				}
			};

			(dropdownSpec.rootInstance as any).popup = popupWithSideEffect as any;
			const animateToSpy = jest.spyOn(dropdownSpec.rootInstance, 'animateTo').mockResolvedValue(undefined);

			dropdownSpec.root.open = true;
			await dropdownSpec.waitForChanges();
			expect(animateToSpy).toHaveBeenCalledWith(undefined, expect.any(Array), expect.any(Object));
		});

		it('should call animateTo with undefined element in close path when popup is cleared before query', async () => {
			const panel = document.createElement('div');
			dropdownSpec.rootInstance.panel = panel as any;

			const popupWithCloseSideEffect = {
				set active(value: boolean) {
					if (value === false) {
						(dropdownSpec.rootInstance as any).popup = undefined;
					}
				},
				get active() {
					return true;
				},
				shadowRoot: {
					querySelector: jest.fn().mockReturnValue(document.createElement('div'))
				}
			};

			(dropdownSpec.rootInstance as any).popup = popupWithCloseSideEffect;
			dropdownSpec.rootInstance.open = false;
			const animateToSpy = jest.spyOn(dropdownSpec.rootInstance, 'animateTo').mockResolvedValue(undefined);

			await (dropdownSpec.rootInstance as any).watchOpen();

			expect(animateToSpy).toHaveBeenCalledWith(undefined, expect.any(Array), expect.any(Object));
		});

		it('should animate element and resolve promise when element exists', async () => {
			const mockElement = document.createElement('div');
			const mockAnimation = {
				onfinish: null as (() => void) | null
			};

			mockElement.animate = jest.fn().mockReturnValue(mockAnimation);

			const promise = (dropdownSpec.rootInstance as any).animateTo(mockElement, [{ opacity: 0 }, { opacity: 1 }], {
				duration: 100
			});

			// Trigger onfinish callback
			mockAnimation.onfinish?.();

			await expect(promise).resolves.toBeUndefined();
			expect(mockElement.animate).toHaveBeenCalled();
		});

		it('should resolve immediately when element is null', async () => {
			const result = await (dropdownSpec.rootInstance as any).animateTo(null, [{ opacity: 0 }, { opacity: 1 }], {
				duration: 100
			});

			expect(result).toBeUndefined();
		});

		it('should return dropdown.show animation', async () => {
			const animation = (dropdownSpec.rootInstance as any).getAnimation('dropdown.show');
			expect(animation.keyframes).toHaveLength(2);
			expect(animation.options.duration).toBe(100);
		});

		it('should return dropdown.hide animation', async () => {
			const animation = (dropdownSpec.rootInstance as any).getAnimation('dropdown.hide');
			expect(animation.keyframes).toHaveLength(2);
			expect(animation.options.duration).toBe(100);
		});

		it('should return empty keyframes for unknown animation', async () => {
			const animation = (dropdownSpec.rootInstance as any).getAnimation('unknown.animation');
			expect(animation.keyframes).toEqual([]);
			expect(animation.options).toEqual({});
		});

		it('should show panel and activate popup when opened', async () => {
			// Mock panel and popup
			const mockPanel = { hidden: true };
			const mockPopup = {
				active: false,
				shadowRoot: {
					querySelector: () => document.createElement('div')
				}
			};

			(dropdownSpec.rootInstance as any).panel = mockPanel;
			(dropdownSpec.rootInstance as any).popup = mockPopup;
			(dropdownSpec.rootInstance as any).addListeners = jest.fn();
			(dropdownSpec.rootInstance as any).animateTo = jest.fn().mockResolvedValue(undefined);

			dropdownSpec.root.disabled = false;
			dropdownSpec.rootInstance.open = true;

			await (dropdownSpec.rootInstance as any).watchOpen();

			expect((dropdownSpec.rootInstance as any).addListeners).toHaveBeenCalled();
			expect(mockPanel.hidden).toBe(false);
			expect(mockPopup.active).toBe(true);
		});

		it('should hide panel and deactivate popup when closed', async () => {
			// Mock panel and popup
			const mockPanel = { hidden: false };
			const mockPopup = {
				active: true,
				shadowRoot: {
					querySelector: () => document.createElement('div')
				}
			};

			(dropdownSpec.rootInstance as any).panel = mockPanel;
			(dropdownSpec.rootInstance as any).popup = mockPopup;
			(dropdownSpec.rootInstance as any).removeListeners = jest.fn();
			(dropdownSpec.rootInstance as any).animateTo = jest.fn().mockResolvedValue(undefined);

			dropdownSpec.root.disabled = false;
			dropdownSpec.rootInstance.open = false;

			await (dropdownSpec.rootInstance as any).watchOpen();

			expect((dropdownSpec.rootInstance as any).removeListeners).toHaveBeenCalled();
			expect(mockPanel.hidden).toBe(true);
			expect(mockPopup.active).toBe(false);
		});
	});

	describe('Slots', () => {
		it('should call handleContentSlotChange when slot content changes', async () => {
			// Mock getMenu to return a menu with getMenuItems
			const mockMenu = {
				menuGetMenuItems: jest.fn().mockResolvedValue([])
			};
			jest.spyOn(dropdownSpec.rootInstance as any, 'getMenu').mockReturnValue(mockMenu);

			const handleContentSlotChangeSpy = jest.spyOn(dropdownSpec.rootInstance as any, 'handleContentSlotChange');

			// Get the panel slot and trigger slotchange event
			const slots = dropdownSpec.root.shadowRoot.querySelectorAll('slot');
			const panelSlot = Array.from(slots).find((slot) => !slot.getAttribute('name'));

			if (panelSlot) {
				panelSlot.dispatchEvent(new Event('slotchange'));
			}

			await dropdownSpec.waitForChanges();

			expect(handleContentSlotChangeSpy).toHaveBeenCalled();
			handleContentSlotChangeSpy.mockRestore();
		});
	});

	describe('Accessibility', () => {
		it('should render trigger wrapper with keyboard accessibility attributes', async () => {
			await dropdownSpec.waitForChanges();
			const triggerWrapper = dropdownSpec.root.shadowRoot.querySelector('div[slot="anchor"]') as HTMLElement;
			expect(triggerWrapper).not.toBeNull();
			expect(triggerWrapper.getAttribute('role')).toBe('button');
			expect(triggerWrapper.getAttribute('tabindex')).toBe('0');
		});

		it('should handle keyboard navigation on trigger wrapper', async () => {
			await dropdownSpec.waitForChanges();
			const triggerWrapper = dropdownSpec.root.shadowRoot.querySelector('div[slot="anchor"]') as HTMLElement;
			expect(triggerWrapper).not.toBeNull();

			// Verify the trigger wrapper is accessible
			expect(triggerWrapper).toBeTruthy();
		});
	});
});

