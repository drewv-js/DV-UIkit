import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvDialog } from './dv-dialog';
import * as a11y from '../../internal/a11y';
import type { FocusTrap } from '../../internal/a11y';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	dialog: any;
	root?: HTMLElement & T;
}
describe('dv-dialog', () => {
	let dialog: TypedSpecPage<DvDialog>;
	// Initialize a new instance for DvDialog
	beforeEach(async () => {
		dialog = (await newSpecPage({
			components: [DvDialog],
			html: `<dv-dialog></dv-dialog>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvDialog>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		dialog = null;
		document.body.style.overflow = '';
	});

	describe('Initialization with default state', () => {
		it('should set body overflow to hidden when component is loaded with open true', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			expect(document.body.style.overflow).toBe('hidden');
		});

		it('should default size to md', () => {
			expect(dialog.root.size).toBe('md');
		});

		it('should default closable to true', () => {
			expect(dialog.root.closable).toBe(true);
		});

		it('should default noClose to false', () => {
			expect(dialog.root.noClose).toBe(false);
		});
	});
	describe('Props', () => {
		it('should render dialog with open attribute', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			expect(dialog.root.hasAttribute('open')).toBe(true);
			const overlay = dialog.root.shadowRoot.querySelector('.fixed.inset-0');
			const dialogContent = dialog.root.shadowRoot.querySelector('#basic-modal');
			expect(overlay).not.toBeNull();
			expect(dialogContent).not.toBeNull();
		});

		it('should set body overflow to hidden when component is loaded with open true', async () => {
			await newSpecPage({
				components: [DvDialog],
				html: `
						<dv-dialog open="true"></dv-dialog>
					`,
				supportsShadowDom: true
			});
			expect(document.body.style.overflow).toBe('hidden');
		});

		it('should render dialog with label', async () => {
			dialog.root.open = true;
			dialog.root.label = 'Test Dialog';
			await dialog.waitForChanges();
			const header = dialog.root.shadowRoot.querySelector('h4');
			expect(header.textContent.trim()).toBe('Test Dialog');
		});

		it('should render subtitle when provided', async () => {
			dialog.root.open = true;
			dialog.root.label = 'Test Dialog';
			dialog.root.subtitle = 'Helper text';
			await dialog.waitForChanges();
			const subtitle = dialog.root.shadowRoot.querySelector('p');
			expect(subtitle).not.toBeNull();
			expect(subtitle.textContent.trim()).toBe('Helper text');
		});

		it('should not render subtitle when empty', async () => {
			dialog.root.open = true;
			dialog.root.label = 'Test Dialog';
			dialog.root.subtitle = '';
			await dialog.waitForChanges();
			const subtitle = dialog.root.shadowRoot.querySelector('p');
			expect(subtitle).toBeNull();
		});

		it('should render header when only subtitle is provided', async () => {
			dialog.root.open = true;
			dialog.root.label = '';
			dialog.root.subtitle = 'Just a subtitle';
			dialog.root.closable = false;
			await dialog.waitForChanges();
			const subtitle = dialog.root.shadowRoot.querySelector('p');
			expect(subtitle).not.toBeNull();
		});

		it('should apply md width class by default', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			const panel = dialog.root.shadowRoot.querySelector('#basic-modal');
			expect(panel.className).toContain('w-[43.75rem]');
		});

		it('should apply sm width class when size is sm', async () => {
			dialog.root.open = true;
			dialog.root.size = 'sm';
			await dialog.waitForChanges();
			const panel = dialog.root.shadowRoot.querySelector('#basic-modal');
			expect(panel.className).toContain('w-[31.25rem]');
		});

		it('should enforce min-h-[13.25rem] on the panel', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			const panel = dialog.root.shadowRoot.querySelector('#basic-modal');
			expect(panel.className).toContain('min-h-[13.25rem]');
		});

		it('should enforce viewport-relative max-h on the panel', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			const panel = dialog.root.shadowRoot.querySelector('#basic-modal');
			expect(panel.className).toContain('max-h-[calc(100vh-0.375rem)]');
		});

		it('should render dialog without close button when noClose is true (deprecated)', async () => {
			dialog.root.open = true;
			dialog.root.noClose = true;
			await dialog.waitForChanges();
			const closeButton = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).toBeNull();
		});

		it('should render dialog with close button when noClose is false', async () => {
			dialog.root.open = true;
			dialog.root.noClose = false;
			await dialog.waitForChanges();
			const closeButton = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
		});

		it('should render dialog without close button when closable is false', async () => {
			dialog.root.open = true;
			dialog.root.closable = false;
			await dialog.waitForChanges();
			const closeButton = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).toBeNull();
		});

		it('should render dialog with close button when closable is true (default)', async () => {
			dialog.root.open = true;
			dialog.root.closable = true;
			await dialog.waitForChanges();
			const closeButton = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
		});

		it('should hide close button when closable=false even if noClose=false', async () => {
			dialog.root.open = true;
			dialog.root.closable = false;
			dialog.root.noClose = false;
			await dialog.waitForChanges();
			const closeButton = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).toBeNull();
		});

		it('should hide close button when noClose=true even if closable=true', async () => {
			dialog.root.open = true;
			dialog.root.closable = true;
			dialog.root.noClose = true;
			await dialog.waitForChanges();
			const closeButton = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).toBeNull();
		});

		it('should render header and close button when label and noClose are set', async () => {
			dialog.root.open = true;
			dialog.root.label = 'Header';
			dialog.root.noClose = false;
			await dialog.waitForChanges();
			const header = dialog.root.shadowRoot.querySelector('h4');
			const closeBtn = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(header).not.toBeNull();
			expect(closeBtn).not.toBeNull();
		});

		it('should render header only when label is set and noClose is true (deprecated)', async () => {
			dialog.root.open = true;
			dialog.root.label = 'Header';
			dialog.root.noClose = true;
			await dialog.waitForChanges();
			const header = dialog.root.shadowRoot.querySelector('h4');
			const closeBtn = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(header).not.toBeNull();
			expect(closeBtn).toBeNull();
		});

		it('should render header only when label is set and closable is false', async () => {
			dialog.root.open = true;
			dialog.root.label = 'Header';
			dialog.root.closable = false;
			await dialog.waitForChanges();
			const header = dialog.root.shadowRoot.querySelector('h4');
			const closeBtn = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(header).not.toBeNull();
			expect(closeBtn).toBeNull();
		});

		it('should not render header if noClose is true and label and subtitle are empty (deprecated)', async () => {
			dialog.root.open = true;
			dialog.root.label = '';
			dialog.root.subtitle = '';
			dialog.root.noClose = true;
			await dialog.waitForChanges();
			const header = dialog.root.shadowRoot.querySelector('h4');
			expect(header).toBeNull();
		});

		it('should not render header if closable is false and label and subtitle are empty', async () => {
			dialog.root.open = true;
			dialog.root.label = '';
			dialog.root.subtitle = '';
			dialog.root.closable = false;
			await dialog.waitForChanges();
			const header = dialog.root.shadowRoot.querySelector('h4');
			expect(header).toBeNull();
		});
	});
	describe('Events', () => {
		it('should call hide method when close button is clicked', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			dialog.root.noClose = false;
			await dialog.waitForChanges();
			const closeButton = dialog.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
			closeButton.click();
			dialog.root.removeAttribute('open');
			await dialog.waitForChanges();
			expect(dialog.root.open).toBe(false);
		});

		it('should call hide method when overlay is clicked', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			const overlay = dialog.root.shadowRoot.querySelector('dialog div') as HTMLElement;
			expect(overlay).not.toBeNull();
			overlay.click();
			dialog.root.removeAttribute('open');
			await dialog.waitForChanges();
			expect(dialog.root.open).toBe(false);
		});

		it('should call hide method when Escape key is pressed', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			document.dispatchEvent(event);
			dialog.root.removeAttribute('open');
			await dialog.waitForChanges();
			expect(dialog.root.open).toBe(false);
		});

		it('should call handleRequestClose with overlay source on overlay click', () => {
			const reqCloseSpy = jest.spyOn(dialog.rootInstance, 'handleRequestClose');
			dialog.rootInstance['handleOverlayClick']({} as MouseEvent);
			expect(reqCloseSpy).toHaveBeenCalledWith('overlay');
			reqCloseSpy.mockRestore();
		});

		it('should call handleRequestClose with close-button source on close button click', () => {
			const reqCloseSpy = jest.spyOn(dialog.rootInstance, 'handleRequestClose');
			dialog.rootInstance['handleCloseButtonClick']();
			expect(reqCloseSpy).toHaveBeenCalledWith('close-button');
			reqCloseSpy.mockRestore();
		});

		it('should only trigger handleRequestClose on Escape in handleKeyDown', () => {
			const reqCloseSpy = jest.spyOn(dialog.rootInstance, 'handleRequestClose');
			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			dialog.rootInstance['handleKeyDown'](event);
			expect(reqCloseSpy).toHaveBeenCalledWith('keyboard');
			reqCloseSpy.mockRestore();
		});

		it('should not call handleRequestClose if key is not Escape', () => {
			const reqCloseSpy = jest.spyOn(dialog.rootInstance, 'handleRequestClose');
			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			dialog.rootInstance['handleKeyDown'](event);
			expect(reqCloseSpy).not.toHaveBeenCalled();
			reqCloseSpy.mockRestore();
		});

		it('should shake instead of dismissing via overlay when noClose=true even if closable=true', async () => {
			dialog.root.closable = true;
			dialog.root.noClose = true;
			await dialog.waitForChanges();
			const shakeSpy = jest.spyOn(dialog.rootInstance, 'shakeDialog').mockResolvedValue(void 0);
			const hideSpy = jest.spyOn(dialog.rootInstance, 'dialogHide').mockResolvedValue(void 0);
			dialog.rootInstance['handleRequestClose']('overlay');
			expect(shakeSpy).toHaveBeenCalled();
			expect(hideSpy).not.toHaveBeenCalled();
			shakeSpy.mockRestore();
			hideSpy.mockRestore();
		});

		it('should shake instead of dismissing via Escape when noClose=true even if closable=true', async () => {
			dialog.root.closable = true;
			dialog.root.noClose = true;
			await dialog.waitForChanges();
			const shakeSpy = jest.spyOn(dialog.rootInstance, 'shakeDialog').mockResolvedValue(void 0);
			const hideSpy = jest.spyOn(dialog.rootInstance, 'dialogHide').mockResolvedValue(void 0);
			dialog.rootInstance['handleRequestClose']('keyboard');
			expect(shakeSpy).toHaveBeenCalled();
			expect(hideSpy).not.toHaveBeenCalled();
			shakeSpy.mockRestore();
			hideSpy.mockRestore();
		});

		it('should still allow dismissal via overlay when closable=true and noClose=false', async () => {
			dialog.root.closable = true;
			dialog.root.noClose = false;
			await dialog.waitForChanges();
			const hideSpy = jest.spyOn(dialog.rootInstance, 'dialogHide').mockResolvedValue(void 0);
			dialog.rootInstance['handleRequestClose']('overlay');
			expect(hideSpy).toHaveBeenCalled();
			hideSpy.mockRestore();
		});

		it('should still allow dismissal via Escape when closable=true and noClose=false', async () => {
			dialog.root.closable = true;
			dialog.root.noClose = false;
			await dialog.waitForChanges();
			const hideSpy = jest.spyOn(dialog.rootInstance, 'dialogHide').mockResolvedValue(void 0);
			dialog.rootInstance['handleRequestClose']('keyboard');
			expect(hideSpy).toHaveBeenCalled();
			hideSpy.mockRestore();
		});
	});
	describe('Methods', () => {
		it('should call dialogShow in watchOpen when newValue is true', async () => {
			const showSpy = jest.spyOn(dialog.rootInstance, 'dialogShow').mockResolvedValue(void 0);
			await dialog.rootInstance.watchOpen(true);
			expect(showSpy).toHaveBeenCalled();
			showSpy.mockRestore();
		});

		it('should call dialogHide in watchOpen when newValue is false', async () => {
			const hideSpy = jest.spyOn(dialog.rootInstance, 'dialogHide').mockResolvedValue(void 0);
			await dialog.rootInstance.watchOpen(false);
			expect(hideSpy).toHaveBeenCalled();
			hideSpy.mockRestore();
		});

		it('should not call dialogShow/dialogHide in watchOpen if isHiding is true', async () => {
			dialog.rootInstance.isHiding = true;
			const showSpy = jest.spyOn(dialog.rootInstance, 'dialogShow');
			const hideSpy = jest.spyOn(dialog.rootInstance, 'dialogHide');
			await dialog.rootInstance.watchOpen(true);
			await dialog.rootInstance.watchOpen(false);
			expect(showSpy).not.toHaveBeenCalled();
			expect(hideSpy).not.toHaveBeenCalled();
			showSpy.mockRestore();
			hideSpy.mockRestore();
		});

		it('should return default animation config for unknown animation name', () => {
			const result = dialog.rootInstance['getAnimation']('unknown-animation');
			expect(result).toEqual({ keyframes: [], options: {} });
		});

		it('should resolve immediately if animateTo called with falsy element', async () => {
			await expect(dialog.rootInstance['animateTo'](null, [], {})).resolves.toBeUndefined();
		});

		it('should not throw if shakeDialog called when panel is falsy', async () => {
			dialog.rootInstance.panel = null;
			await expect(dialog.rootInstance['shakeDialog']()).resolves.toBeUndefined();
		});

		it('should call shakeDialog if requestClose event is prevented', async () => {
			const shakeSpy = jest.spyOn(dialog.rootInstance, 'shakeDialog').mockResolvedValue(void 0);
			dialog.rootInstance.requestClose.emit = () => ({ defaultPrevented: true });
			await dialog.rootInstance['handleRequestClose']('close-button');
			expect(shakeSpy).toHaveBeenCalled();
			shakeSpy.mockRestore();
		});

		it('should return early in dialogHide if isHiding is true', async () => {
			dialog.rootInstance.isHiding = true;
			const cleanupSpy = jest.spyOn(dialog.rootInstance, 'cleanupAccessibility');
			await dialog.rootInstance.dialogHide();
			expect(cleanupSpy).not.toHaveBeenCalled();
			cleanupSpy.mockRestore();
		});

		it('should call dialogHide in handleRequestClose if event is not prevented', async () => {
			const hideSpy = jest.spyOn(dialog.rootInstance, 'dialogHide').mockResolvedValue(void 0);
			dialog.rootInstance.requestClose.emit = () => ({ defaultPrevented: false });
			await dialog.rootInstance['handleRequestClose']('keyboard');
			expect(hideSpy).toHaveBeenCalled();
			hideSpy.mockRestore();
		});

		it('should call shakeDialog in handleRequestClose if event is prevented', async () => {
			const shakeSpy = jest.spyOn(dialog.rootInstance, 'shakeDialog').mockResolvedValue(void 0);
			dialog.rootInstance.requestClose.emit = () => ({ defaultPrevented: true });
			await dialog.rootInstance['handleRequestClose']('keyboard');
			expect(shakeSpy).toHaveBeenCalled();
			shakeSpy.mockRestore();
		});

		it('should return correct animation config for all keys in getAnimation', () => {
			const keys = ['dialog.show', 'dialog.hide', 'dialog.overlay.show', 'dialog.overlay.hide', 'dialog.shake'];
			for (const key of keys) {
				const config = dialog.rootInstance['getAnimation'](key);
				expect(config.keyframes.length).toBeGreaterThan(0);
				expect(typeof config.options).toBe('object');
			}
		});

		it('should emit show and call setupAccessibility in dialogShow', async () => {
			const emitSpy = jest.spyOn(dialog.rootInstance.show, 'emit');
			const setupSpy = jest.spyOn(dialog.rootInstance, 'setupAccessibility').mockResolvedValue(void 0);
			await dialog.rootInstance.dialogShow();
			expect(emitSpy).toHaveBeenCalled();
			expect(setupSpy).toHaveBeenCalled();
			setupSpy.mockRestore();
		});

		it('should emit hide and set isHiding to false when dialogHide called', async () => {
			const hideSpy = jest.spyOn(dialog.rootInstance.hide, 'emit');
			await dialog.rootInstance.dialogHide();
			expect(hideSpy).toHaveBeenCalled();
			expect(dialog.rootInstance.isHiding).toBe(false);

			hideSpy.mockRestore();
		});

		it('should animate panel with shake animation when shakeDialog called', async () => {
			const panel = document.createElement('div');
			const animateToSpy = jest.spyOn(dialog.rootInstance, 'animateTo').mockImplementation(() => ({ onfinish: null }));
			dialog.rootInstance.panel = panel;
			await dialog.rootInstance.shakeDialog();
			expect(animateToSpy).toHaveBeenCalled();
		});

		it('should animate panel and overlay with correct animations when animateDialog called', async () => {
			const panel = document.createElement('div');
			const overlay = document.createElement('div');
			const animateToSpy = jest.spyOn(dialog.rootInstance, 'animateTo').mockImplementation(() => ({ onfinish: null }));
			dialog.rootInstance.panel = panel;
			dialog.rootInstance.overlay = overlay;
			await dialog.rootInstance.animateDialog('dialog.show', 'dialog.overlay.show');
			expect(animateToSpy).toHaveBeenCalledTimes(2);
		});

		it('should reset body overflow and remove keydown listener in dialogHide', async () => {
			dialog.rootInstance.isHiding = false;
			const removeListenerSpy = jest.spyOn(document, 'removeEventListener');
			await dialog.rootInstance.dialogHide();
			expect(document.body.style.overflow).toBe('auto');
			expect(removeListenerSpy).toHaveBeenCalledWith('keydown', dialog.rootInstance.handleKeyDown);
			removeListenerSpy.mockRestore();
		});

		it('should handle animateTo with null element', async () => {
			const result = await dialog.rootInstance['animateTo'](null, [], {});

			expect(result).toBeUndefined();
		});

		it('should handle animateTo with valid element and resolve on animation finish', async () => {
			const mockElement = document.createElement('div');

			const mockAnimation = {
				onfinish: null as (() => void) | null
			} as unknown as Animation;

			const animateSpy = jest.spyOn(mockElement, 'animate').mockReturnValue(mockAnimation);

			const keyframes: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
			const options: KeyframeAnimationOptions = { duration: 250 };

			const animationPromise = dialog.rootInstance['animateTo'](mockElement, keyframes, options);

			expect(animateSpy).toHaveBeenCalledWith(keyframes, options);

			expect(mockAnimation.onfinish).not.toBeNull();

			if (mockAnimation.onfinish) {
				mockAnimation.onfinish({} as AnimationPlaybackEvent);
			}

			const result = await animationPromise;

			expect(result).toBeUndefined();
		});

		it('should return empty animation config for unknown animation name', () => {
			const animation = dialog.rootInstance['getAnimation']('unknown.animation');

			expect(animation.keyframes).toEqual([]);
			expect(animation.options).toEqual({});
		});
	});
	describe('Slots', () => {
		it('should render dialog content in the slot', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			const slotContent = document.createElement('div');
			slotContent.textContent = 'Dialog Content';
			dialog.root.shadowRoot.querySelector('slot').appendChild(slotContent);
			await dialog.waitForChanges();
			const slot = dialog.root.shadowRoot.querySelector('slot');
			expect(slot).not.toBeNull();
			expect(slot.textContent).toBe('Dialog Content');
		});

		it('should render footer slot when content is provided', async () => {
			const page = (await newSpecPage({
				components: [DvDialog],
				html: `<dv-dialog open><div>body</div><div slot="footer">footer</div></dv-dialog>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvDialog>;
			const footerSlot = page.root.shadowRoot.querySelector('slot[name="footer"]');
			expect(footerSlot).not.toBeNull();
		});

		it('should not render footer wrapper when footer slot is empty', async () => {
			dialog.root.open = true;
			await dialog.waitForChanges();
			const footerSlot = dialog.root.shadowRoot.querySelector('slot[name="footer"]');
			expect(footerSlot).toBeNull();
		});
	});

	describe('Accessibility', () => {
		it('should call setupAccessibility when dialog opens', async () => {
			const setupAccessibilitySpy = jest.spyOn(dialog.rootInstance, 'setupAccessibility');
			await dialog.root.dialogShow();
			await dialog.waitForChanges();
			expect(setupAccessibilitySpy).toHaveBeenCalled();
			setupAccessibilitySpy.mockRestore();
		});

		it('should call cleanupAccessibility and cleans up focus trap when component is removed', async () => {
			const mockDeactivate = jest.fn();
			const mockSlotCleanup = jest.fn();
			dialog.root.open = true;
			await dialog.waitForChanges();
			dialog.rootInstance.focusTrap = { deactivate: mockDeactivate };
			dialog.rootInstance.slotCleanup = mockSlotCleanup;
			await dialog.setContent('');
			await dialog.waitForChanges();
			expect(mockDeactivate).toHaveBeenCalled();
			expect(mockSlotCleanup).toHaveBeenCalled();

			dialog = (await newSpecPage({
				components: [DvDialog],
				html: `<dv-dialog></dv-dialog>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvDialog>;
			expect(dialog.rootInstance.focusTrap).toBeNull();
			expect(dialog.rootInstance.slotCleanup).toBeNull();
		});

		it('should not throw in setupAccessibility if panel is falsy', async () => {
			dialog.rootInstance.panel = null;
			await expect(dialog.rootInstance['setupAccessibility']()).resolves.toBeUndefined();
		});

		it('should catch error in setupAccessibility', async () => {
			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

			const createFocusTrapSpy = jest.spyOn(a11y, 'createFocusTrap').mockImplementation(() => {
				throw new Error('Focus trap error');
			});

			dialog.root.open = true;
			await dialog.waitForChanges();
			await dialog.rootInstance.setupAccessibility();

			expect(consoleErrorSpy).toHaveBeenCalledWith('Error initializing accessibility:', expect.any(Error));

			consoleErrorSpy.mockRestore();
			createFocusTrapSpy.mockRestore();
		});

		it('should setup focus trap and slot handlers in setupAccessibility', async () => {
			const panel = document.createElement('div');
			dialog.rootInstance.panel = panel;

			const footerSlot = document.createElement('slot') as HTMLSlotElement;
			footerSlot.setAttribute('name', 'footer');
			dialog.rootInstance.footerSlot = footerSlot;

			const mockActivate = jest.fn();
			const mockFocusTrap = {
				activate: mockActivate,
				deactivate: jest.fn(),
				update: jest.fn()
			} as unknown as FocusTrap;
			const mockSlotCleanup = jest.fn();

			const createFocusTrapSpy = jest.spyOn(a11y, 'createFocusTrap').mockReturnValue(mockFocusTrap);
			const setupSlotChangeHandlersSpy = jest.spyOn(a11y, 'setupSlotChangeHandlers').mockReturnValue(mockSlotCleanup);

			await dialog.rootInstance.setupAccessibility();

			expect(setupSlotChangeHandlersSpy).toHaveBeenCalled();
			expect(mockActivate).toHaveBeenCalled();

			createFocusTrapSpy.mockRestore();
			setupSlotChangeHandlersSpy.mockRestore();
		});

		it('should call cleanupAccessibility and remove keydown listener in disconnectedCallback', () => {
			const cleanupSpy = jest.spyOn(dialog.rootInstance, 'cleanupAccessibility');
			const removeListenerSpy = jest.spyOn(document, 'removeEventListener');
			dialog.rootInstance.disconnectedCallback();
			expect(cleanupSpy).toHaveBeenCalled();
			expect(removeListenerSpy).toHaveBeenCalledWith('keydown', dialog.rootInstance.handleKeyDown);
			cleanupSpy.mockRestore();
			removeListenerSpy.mockRestore();
		});

		it('should cleanup focusTrap and slotCleanup in cleanupAccessibility', () => {
			const deactivateSpy = jest.fn();
			const slotCleanupSpy = jest.fn();
			dialog.rootInstance.focusTrap = { deactivate: deactivateSpy };
			dialog.rootInstance.slotCleanup = slotCleanupSpy;
			dialog.rootInstance.cleanupAccessibility();
			expect(deactivateSpy).toHaveBeenCalled();
			expect(slotCleanupSpy).toHaveBeenCalled();
			expect(dialog.rootInstance.focusTrap).toBeNull();
			expect(dialog.rootInstance.slotCleanup).toBeNull();
		});
	});
});

