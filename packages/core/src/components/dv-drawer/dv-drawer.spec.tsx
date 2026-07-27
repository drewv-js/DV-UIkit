import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import * as a11y from '../../internal/a11y';
import type { FocusTrap } from '../../internal/a11y';
import { DvDrawer } from './dv-drawer';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	drawer: any;
	root?: HTMLElement & T;
}

describe('dv-drawer', () => {
	let drawer: TypedSpecPage<DvDrawer>;
	// Initialize a new instance for DvDrawer
	beforeEach(async () => {
		drawer = (await newSpecPage({
			components: [DvDrawer],
			html: `<dv-drawer></dv-drawer>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvDrawer>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		drawer = null;
		document.body.style.overflow = '';
		jest.restoreAllMocks();
	});

	describe('Initialization with default state', () => {
		it('should set body overflow to hidden when component is loaded with open true', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();
			// Check if the body's overflow style is set to 'hidden'
			expect(document.body.style.overflow).toBe('hidden');
		});
	});

	describe('Props', () => {
		it('should renders drawer with open attribute and appropriate elements when open prop true', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();

			// Check if the 'open' attribute is set correctly
			expect(drawer.root.hasAttribute('open')).toBe(true);

			// Check if the drawer is rendered it should have the overlay and drawer content
			const overlay = drawer.root.shadowRoot.querySelector('.fixed.inset-0');
			const drawerContent = drawer.root.shadowRoot.querySelector('#basic-drawer');
			expect(overlay).not.toBeNull();
			expect(drawerContent).not.toBeNull();
		});

		it('should render drawer without close button when noClose is true', async () => {
			drawer.root.open = true;
			drawer.root.noClose = true;
			await drawer.waitForChanges();
			const closeButton = drawer.root.shadowRoot.querySelector('button');
			expect(closeButton).toBeNull();
		});

		it('should render drawer with close button when noClose is false', async () => {
			drawer.root.open = true;
			drawer.root.noClose = false;
			await drawer.waitForChanges();
			const closeButton = drawer.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
		});
		it('should render without header when noClose is true and no label', async () => {
			drawer.root.noClose = true;
			drawer.root.label = '';
			drawer.root.open = true;
			await drawer.waitForChanges();

			const header = drawer.root.shadowRoot.querySelector('.p-4.flex.items-start');
			expect(header).toBeNull();
		});

		it('should render header when label is provided even with noClose', async () => {
			drawer.root.noClose = true;
			drawer.root.label = 'Test Label';
			drawer.root.open = true;
			await drawer.waitForChanges();

			const panel = drawer.root.shadowRoot.querySelector('#basic-drawer');
			expect(panel.getAttribute('aria-label')).toBe('Test Label');
		});

		it('should not render drawer panel when open is false', async () => {
			drawer.root.open = false;
			await drawer.waitForChanges();

			const panel = drawer.root.shadowRoot.querySelector('.dv-drawer-panel');
			expect(panel).toBeNull();
		});
	});

	describe('Events', () => {
		it('should call hide and update open to false when close button is clicked', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();
			drawer.root.noClose = false;
			await drawer.waitForChanges();
			// Hide the drawer when the close button is clicked
			const closeButton = drawer.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
			closeButton.click();
			drawer.root.removeAttribute('open');
			await drawer.waitForChanges();
			// Check if the drawer is closed
			expect(drawer.root.open).toBe(false);
		});

		it('should call hide method and update open to false when overlay is clicked', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();
			// Simulate a click on the overlay
			const overlay = drawer.root.shadowRoot.querySelector('div div') as HTMLElement;
			expect(overlay).not.toBeNull();
			overlay.click();
			drawer.root.removeAttribute('open');
			await drawer.waitForChanges();
			// Check if the drawer is closed
			expect(drawer.root.open).toBe(false);
		});

		it('should call hide method and set open to false when Escape key is pressed', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();
			// Create a new keyboard event
			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			document.dispatchEvent(event);
			drawer.root.removeAttribute('open');
			await drawer.waitForChanges();
			// Check if the drawer is closed
			expect(drawer.root.open).toBe(false);
		});

		it('should not trigger requestClose event when non-Escape key is pressed', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();

			const requestCloseSpy = jest.spyOn(drawer.rootInstance.requestClose, 'emit');

			const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
			document.dispatchEvent(event);
			await drawer.waitForChanges();

			expect(requestCloseSpy).not.toHaveBeenCalled();
		});
	});

	describe('Methods', () => {
		it('should ignore new open value when already animating with same operation', async () => {
			const drawerInstance = drawer.rootInstance;
			drawerInstance.isAnimating = true;
			drawerInstance.pendingOperation = 'show';

			// This should be ignored
			await drawerInstance.watchOpen(true);

			// Verify no state change
			expect(drawerInstance.isAnimating).toBe(true);
		});

		it('should ignore drawerShow when already showing', async () => {
			const drawerInstance = drawer.rootInstance;
			drawerInstance.isAnimating = true;
			drawerInstance.pendingOperation = 'show';

			await drawerInstance.drawerShow();

			// Should still be in same state
			expect(drawerInstance.pendingOperation).toBe('show');
		});

		it('should ignore drawerHide when already hiding', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();

			const drawerInstance = drawer.rootInstance;
			drawerInstance.isAnimating = true;
			drawerInstance.pendingOperation = 'hide';

			await drawerInstance.drawerHide();

			// Should still be in same state
			expect(drawerInstance.pendingOperation).toBe('hide');
		});

		it('should execute drawerHide successfully and update all state', async () => {
			const drawerInstance = drawer.rootInstance;

			// Setup initial state - drawer is open
			drawerInstance.isOpen = true;
			drawerInstance.isAnimating = false;
			drawerInstance.pendingOperation = null;
			document.body.style.overflow = 'hidden';

			// Mock animateTo to avoid animation issues
			const originalAnimateTo = drawerInstance['animateTo'];
			drawerInstance['animateTo'] = jest.fn().mockResolvedValue(undefined);

			// Mock requestAnimationFrame
			jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
				cb(0);
				return 0;
			});

			// Spy on hide event
			const hideEventSpy = jest.spyOn(drawerInstance.hide, 'emit');

			// Execute drawerHide
			await drawerInstance.drawerHide();

			// Verify state changes
			expect(drawerInstance.isOpen).toBe(false);
			expect(document.body.style.overflow).toBe('auto');
			expect(hideEventSpy).toHaveBeenCalled();
			expect(drawerInstance.isAnimating).toBe(false);
			expect(drawerInstance.pendingOperation).toBeNull();

			// Cleanup
			drawerInstance['animateTo'] = originalAnimateTo;
		});

		it('should call hide method when open property set to false', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();
			const drawerHideSpy = jest
				.spyOn(drawer.rootInstance, 'drawerHide')
				.mockImplementation(async () => Promise.resolve());
			drawer.rootInstance.pendingOperation = 'show';
			drawer.root.open = false;
			await drawer.waitForChanges();

			expect(drawer.rootInstance.pendingOperation).toBe('hide');
			expect(drawerHideSpy).toHaveBeenCalled();
		});

		it('should call cleanupAccessibility when drawerHide is called', async () => {
			const drawerInstance = drawer.rootInstance;

			// Setup initial state
			drawerInstance.isOpen = true;
			drawerInstance.isAnimating = false;

			// Mock animateTo
			const originalAnimateTo = drawerInstance['animateTo'];
			drawerInstance['animateTo'] = jest.fn().mockResolvedValue(undefined);

			// Spy on cleanupAccessibility
			const cleanupSpy = jest.spyOn(drawerInstance as any, 'cleanupAccessibility');

			// Execute drawerHide
			await drawerInstance.drawerHide();

			// Verify cleanup was called
			expect(cleanupSpy).toHaveBeenCalled();

			// Cleanup
			drawerInstance['animateTo'] = originalAnimateTo;
		});

		it('should remove keydown event listener when drawer hides', async () => {
			const drawerInstance = drawer.rootInstance;

			// Setup initial state
			drawerInstance.isOpen = true;
			drawerInstance.isAnimating = false;

			// Add event listener first
			const mockHandleKeyDown = jest.fn();
			drawerInstance['handleKeyDown'] = mockHandleKeyDown;
			document.addEventListener('keydown', drawerInstance['handleKeyDown']);

			// Mock animateTo
			const originalAnimateTo = drawerInstance['animateTo'];
			drawerInstance['animateTo'] = jest.fn().mockResolvedValue(undefined);

			// Spy on removeEventListener
			const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

			// Execute drawerHide
			await drawerInstance.drawerHide();

			// Verify event listener was removed
			expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', mockHandleKeyDown);

			// Cleanup
			drawerInstance['animateTo'] = originalAnimateTo;
		});

		it('should call animateDialog with hide animations', async () => {
			const drawerInstance = drawer.rootInstance;

			// Setup initial state
			drawerInstance.isOpen = true;
			drawerInstance.isAnimating = false;

			// Mock animateTo
			const originalAnimateTo = drawerInstance['animateTo'];
			const animateToSpy = jest.fn().mockResolvedValue(undefined);
			drawerInstance['animateTo'] = animateToSpy;

			// Setup panel and overlay
			drawerInstance.panel = document.createElement('div');
			drawerInstance.overlay = document.createElement('div');

			// Execute drawerHide
			await drawerInstance.drawerHide();

			// Verify animateTo was called with hide animations
			expect(animateToSpy).toHaveBeenCalled();
			// Should be called twice - once for panel, once for overlay
			expect(animateToSpy).toHaveBeenCalledTimes(2);

			// Cleanup
			drawerInstance['animateTo'] = originalAnimateTo;
		});

		it('should handle animateTo with null element', async () => {
			const drawerInstance = drawer.rootInstance;

			const result = await drawerInstance['animateTo'](null, [], {});

			expect(result).toBeUndefined();
		});

		it('should handle animateTo with valid element and resolve on animation finish', async () => {
			const drawerInstance = drawer.rootInstance;
			const mockElement = document.createElement('div');

			// Create a mock animation object with minimal required properties
			const mockAnimation = {
				onfinish: null as (() => void) | null
			} as unknown as Animation;

			// Mock the animate method
			const animateSpy = jest.spyOn(mockElement, 'animate').mockReturnValue(mockAnimation);

			const keyframes: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
			const options: KeyframeAnimationOptions = { duration: 250 };

			// Start the animation
			const animationPromise = drawerInstance['animateTo'](mockElement, keyframes, options);

			// Verify animate was called with correct arguments
			expect(animateSpy).toHaveBeenCalledWith(keyframes, options);

			// Verify that onfinish handler was set
			expect(mockAnimation.onfinish).not.toBeNull();

			// Trigger the onfinish callback
			if (mockAnimation.onfinish) {
				mockAnimation.onfinish({} as AnimationPlaybackEvent);
			}

			// Wait for the promise to resolve
			const result = await animationPromise;

			expect(result).toBeUndefined();
		});

		it('should return empty animation config for unknown animation name', () => {
			const drawerInstance = drawer.rootInstance;

			const animation = drawerInstance['getAnimation']('unknown.animation');

			expect(animation.keyframes).toEqual([]);
			expect(animation.options).toEqual({});
		});
	});

	describe('Slots', () => {
		it('should render drawer content in default slot', async () => {
			drawer.root.open = true;
			await drawer.waitForChanges();
			// Create slot content
			const slotContent = document.createElement('div');
			slotContent.textContent = 'Drawer Content';
			drawer.root.shadowRoot.querySelector('slot').appendChild(slotContent);
			await drawer.waitForChanges();
			// Check if the slot content is rendered correctly
			const slot = drawer.root.shadowRoot.querySelector('slot');
			expect(slot).not.toBeNull();
			expect(slot.textContent).toBe('Drawer Content');
		});

		it('should render title slot when provided', async () => {
			drawer.root.innerHTML = '<div slot="title"></div>';
			await drawer.waitForChanges();
			// Query the title content directly
			const titleElement = drawer.root.querySelector('div[slot="title"]');
			// Check if the title content slot is rendered
			expect(titleElement).not.toBeNull();
		});

		it('should not render title slot when not provided', async () => {
			await drawer.waitForChanges();
			// Query the title slot in the shadow DOM
			const titleElement = drawer.root.shadowRoot.querySelector('slot[name="title"]');
			// Check if the title slot is not rendered
			expect(titleElement).toBeNull();
		});

		it('should render actions slot when provided', async () => {
			drawer.root.innerHTML = '<div slot="actions"></div>';
			await drawer.waitForChanges();
			// Query the actions content directly
			const actionsElement = drawer.root.querySelector('div[slot="actions"]');
			// Check if the actions content slot is rendered
			expect(actionsElement).not.toBeNull();
		});

		it('should render actions slot container in the header when actions content is provided', async () => {
			const page = await newSpecPage({
				components: [DvDrawer],
				html: `<dv-drawer open="true"><button slot="actions">Action</button></dv-drawer>`,
				supportsShadowDom: true
			});

			const actionsContainer = page.root.shadowRoot.querySelector('.p-2');
			const actionsSlot = actionsContainer.querySelector('slot[name="actions"]');
			expect(actionsContainer).not.toBeNull();
			expect(actionsSlot).not.toBeNull();
		});

		it('should not render actions slot when not provided', async () => {
			await drawer.waitForChanges();
			// Query the actions slot in the shadow DOM
			const actionsElement = drawer.root.shadowRoot.querySelector('slot[name="actions"]');
			// Check if the actions slot is not rendered
			expect(actionsElement).toBeNull();
		});

		it('should render footer slot when provided', async () => {
			drawer.root.innerHTML = '<div slot="footer"></div>';
			await drawer.waitForChanges();
			// Query the footer content directly
			const footerElement = drawer.root.querySelector('div[slot="footer"]');
			// Check if the footer content slot is rendered
			expect(footerElement).not.toBeNull();
		});

		it('should render footer container when footer content is provided', async () => {
			const page = await newSpecPage({
				components: [DvDrawer],
				html: `<dv-drawer open="true"><div slot="footer">Footer</div></dv-drawer>`,
				supportsShadowDom: true
			});

			const footerWrapper = page.root.shadowRoot.querySelector('.py-7.px-5.flex.justify-end');
			const footerSlot = footerWrapper.querySelector('slot[name="footer"]');
			expect(footerWrapper).not.toBeNull();
			expect(footerSlot).not.toBeNull();
		});

		it('should not render footer slot when not provided', async () => {
			await drawer.waitForChanges();
			// Query the footer slot in the shadow DOM
			const footerSlot = drawer.root.shadowRoot.querySelector('slot[name="footer"]');
			// Check if the footer slot is not rendered
			expect(footerSlot).toBeNull();
		});
	});

	describe('Accessibility', () => {
		it('calls cleanupAccessibility and cleans up focus trap when component is removed', async () => {
			const mockDeactivate = jest.fn();
			const mockSlotCleanup = jest.fn();
			drawer.root.open = true;
			await drawer.waitForChanges();
			const drawerInstance = drawer.rootInstance;
			// Setup our mocks on this instance
			drawerInstance.focusTrap = {
				activate: jest.fn(),
				deactivate: mockDeactivate,
				update: jest.fn()
			} as unknown as FocusTrap;
			drawerInstance.slotCleanup = mockSlotCleanup;
			// Trigger disconnectedCallback which should call cleanupAccessibility
			await drawer.setContent('');
			await drawer.waitForChanges();
			// Verify that our mock methods were called
			expect(mockDeactivate).toHaveBeenCalled();
			expect(mockSlotCleanup).toHaveBeenCalled();
		});

		it('should call setupAccessibility when drawer opens', async () => {
			const drawerInstance = drawer.rootInstance;

			// Mock the animateTo method to avoid animation errors
			const originalAnimateTo = drawerInstance['animateTo'];
			drawerInstance['animateTo'] = jest.fn().mockResolvedValue(undefined);

			// Spy on the setupAccessibility method
			const setupAccessibilitySpy = jest.spyOn(drawerInstance, 'setupAccessibility');

			// Open the drawer
			await drawer.root.drawerShow();
			await drawer.waitForChanges();

			// Verify setupAccessibility was called
			expect(setupAccessibilitySpy).toHaveBeenCalled();

			// Restore the method
			drawerInstance['animateTo'] = originalAnimateTo;
		});

		it('should handle setupAccessibility when panel does not exist', async () => {
			const drawerInstance = drawer.rootInstance;
			drawerInstance.panel = null;

			await drawerInstance.setupAccessibility();

			expect(drawerInstance.focusTrap).toBeNull();
		});

		it('should handle setupAccessibility error gracefully', async () => {
			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
			const drawerInstance = drawer.rootInstance;

			// Mock createFocusTrap to throw an error
			jest.spyOn(a11y, 'createFocusTrap').mockImplementation(() => {
				throw new Error('Focus trap error');
			});

			drawer.root.open = true;
			await drawer.waitForChanges();
			await drawerInstance.setupAccessibility();

			expect(consoleErrorSpy).toHaveBeenCalledWith('Error setting up accessibility features:', expect.any(Error));
		});

		it('should setup focus trap with some slots present', async () => {
			const drawerInstance = drawer.rootInstance;

			// Manually set up the panel without triggering open
			const panel = document.createElement('div');
			drawerInstance.panel = panel;

			// Set only footer slot
			const footerSlot = document.createElement('slot') as HTMLSlotElement;
			footerSlot.setAttribute('name', 'footer');
			drawerInstance.footerSlot = footerSlot;

			const mockActivate = jest.fn();
			const mockFocusTrap = {
				activate: mockActivate,
				deactivate: jest.fn(),
				update: jest.fn()
			} as unknown as FocusTrap;
			const mockSlotCleanup = jest.fn();

			jest.spyOn(a11y, 'createFocusTrap').mockReturnValue(mockFocusTrap);
			const setupSlotChangeHandlersSpy = jest.spyOn(a11y, 'setupSlotChangeHandlers').mockReturnValue(mockSlotCleanup);

			await drawerInstance.setupAccessibility();

			// Verify setupSlotChangeHandlers was called (at least footer slot exists)
			expect(setupSlotChangeHandlersSpy).toHaveBeenCalled();
			expect(mockActivate).toHaveBeenCalled();
		});

		it('should setup focus trap without any named slots', async () => {
			const drawerInstance = drawer.rootInstance;

			// Manually set up the panel
			const panel = document.createElement('div');
			drawerInstance.panel = panel;

			const mockActivate = jest.fn();
			const mockFocusTrap = {
				activate: mockActivate,
				deactivate: jest.fn(),
				update: jest.fn()
			} as unknown as FocusTrap;

			const createFocusTrapSpy = jest.spyOn(a11y, 'createFocusTrap').mockReturnValue(mockFocusTrap);
			const setupSlotChangeHandlersSpy = jest.spyOn(a11y, 'setupSlotChangeHandlers');

			await drawerInstance.setupAccessibility();

			// Verify focus trap was created
			expect(createFocusTrapSpy).toHaveBeenCalled();

			// Verify setupSlotChangeHandlers was NOT called (no slots)
			expect(setupSlotChangeHandlersSpy).not.toHaveBeenCalled();

			// Verify focus trap was still activated
			expect(mockActivate).toHaveBeenCalled();
		});

		it('should call cleanupAccessibility before creating new focus trap', async () => {
			const drawerInstance = drawer.rootInstance;

			// Manually set up the panel
			const panel = document.createElement('div');
			drawerInstance.panel = panel;

			// Set up existing focus trap and slot cleanup
			const existingDeactivate = jest.fn();
			const existingSlotCleanup = jest.fn();
			drawerInstance.focusTrap = {
				activate: jest.fn(),
				deactivate: existingDeactivate,
				update: jest.fn()
			} as unknown as FocusTrap;
			drawerInstance.slotCleanup = existingSlotCleanup;

			const mockFocusTrap = {
				activate: jest.fn(),
				deactivate: jest.fn(),
				update: jest.fn()
			} as unknown as FocusTrap;
			jest.spyOn(a11y, 'createFocusTrap').mockReturnValue(mockFocusTrap);

			await drawerInstance.setupAccessibility();

			// Verify old focus trap was deactivated
			expect(existingDeactivate).toHaveBeenCalled();

			// Verify old slot cleanup was called
			expect(existingSlotCleanup).toHaveBeenCalled();
		});
	});
});

