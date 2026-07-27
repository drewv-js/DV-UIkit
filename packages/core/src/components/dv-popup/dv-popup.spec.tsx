import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvPopup } from './dv-popup';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-popup', () => {
	describe('rendering', () => {
		let popup: TypedSpecPage<DvPopup>;

		beforeEach(async () => {
			popup = (await newSpecPage({
				components: [DvPopup],
				html: `
          <dv-popup>
            <div slot="anchor"></div>
            <div></div>
          </dv-popup>
        `,
				supportsShadowDom: true
			})) as TypedSpecPage<DvPopup>;
		});

		afterEach(() => {
			popup = null;
		});

		describe('Initialization with default state', () => {
			it('should render closed popup by default', async () => {
				// Check component's properties
				expect(popup.root.active).toBe(false);

				// Query popup container in the shadow DOM
				const divElement = popup.root.shadowRoot.querySelector('div');
				expect(divElement).toHaveClass('isolate');
				expect(divElement).toHaveClass('hidden');
			});

			it('should render absolute positioned popup by default', async () => {
				// Check component's properties
				expect(popup.root.strategy).toBe('absolute');

				// Query popup container in the shadow DOM
				const divElement = popup.root.shadowRoot.querySelector('div');
				expect(divElement).toHaveClass('isolate');
				expect(divElement).toHaveClass('absolute');
			});

			it('should handle lifecycle methods', async () => {
				const mockCleanup = jest.fn();
				const timeoutId = 54321;
				const cancelSpy = jest.spyOn(global, 'cancelAnimationFrame');

				// Simulate component having active cleanup state
				(popup.rootInstance as any).cleanup = mockCleanup;
				(popup.rootInstance as any).repositionTimeout = timeoutId;

				// Test connectedCallback
				popup.rootInstance.connectedCallback();

				// Test disconnectedCallback - should clean up resources
				await popup.rootInstance.disconnectedCallback();

				// Verify cleanup happened during disconnection
				expect(cancelSpy).toHaveBeenCalledWith(timeoutId);
				expect(mockCleanup).toHaveBeenCalledTimes(1);
				expect((popup.rootInstance as any).repositionTimeout).toBeUndefined();
				expect((popup.rootInstance as any).cleanup).toBeUndefined();
				expect(popup.rootInstance).toBeDefined();

				cancelSpy.mockRestore();
			});
		});

		describe('Props', () => {
			it('should render open popup when active property is set', async () => {
				popup.root.active = true;
				await popup.waitForChanges();

				// Check component's properties
				expect(popup.root.active).toBe(true);
				// Query popup container in the shadow DOM
				const divElement = popup.root.shadowRoot.querySelector('div');
				expect(divElement).toHaveClass('isolate');
				expect(divElement).toHaveClass('absolute');
				expect(divElement).toHaveClass('z-40');
			});

			it('should render popup with fixed position when property is set', async () => {
				popup.root.strategy = 'fixed';
				await popup.waitForChanges();

				// Check component's properties
				expect(popup.root.strategy).toBe('fixed');
				// Query popup container in the shadow DOM
				const divElement = popup.root.shadowRoot.querySelector('div');
				expect(divElement).toHaveClass('fixed');
			});

			it('should render the hover bridge when hover bridge is true and active', async () => {
				popup.root.hoverBridge = true;
				popup.root.active = true;
				await popup.waitForChanges();

				// Query the hover bridge in the shadow DOM
				const hoverBridge = popup.root.shadowRoot.querySelector('span');

				// Check if the hover bridge property is set
				expect(hoverBridge).not.toHaveClass('hidden');
			});

			it('should not render the hover bridge when hover bridge is false', async () => {
				popup.root.hoverBridge = false;
				await popup.waitForChanges();

				// Query the hover bridge in the shadow DOM
				const hoverBridge = popup.root.shadowRoot.querySelector('span');

				// Check if the hover bridge property is set
				expect(hoverBridge).toHaveClass('hidden');
			});

			it('should render the arrow when arrow is true and active', async () => {
				popup.root.arrow = true;
				popup.root.active = true;
				await popup.waitForChanges();

				// Query the hover bridge in the shadow DOM
				const arrow = popup.root.shadowRoot.querySelector('div div[role="presentation"]');

				// Check if the hover bridge property is set
				expect(arrow).not.toHaveClass('hidden');
			});

			it('should not render the arrow when arrow is false', async () => {
				popup.root.arrow = false;
				await popup.waitForChanges();

				// Query the hover bridge in the shadow DOM
				const arrow = popup.root.shadowRoot.querySelector('[role="presentation"]');

				// Check if the hover bridge property is set
				expect(arrow).toBeNull();
			});
		});
		describe('Methods', () => {
			it('should resolve stop function immediately when cleanup is not set', async () => {
				const rafSpy = jest.spyOn(global, 'requestAnimationFrame');

				(popup.rootInstance as any).cleanup = undefined;
				(popup.rootInstance as any).repositionTimeout = undefined;

				await expect((popup.rootInstance as any).stop()).resolves.toBeUndefined();
				expect(rafSpy).not.toHaveBeenCalled();

				rafSpy.mockRestore();
			});

			it('should handle cleanup function properly', async () => {
				const mockCleanup = jest.fn();

				// Manually set the cleanup function (bypassing the jest guard)
				(popup.rootInstance as any).cleanup = mockCleanup;

				// Call destroyAutoUpdate to trigger cleanup
				(popup.rootInstance as any).destroyAutoUpdate();

				// Verify cleanup was called
				expect(mockCleanup).toHaveBeenCalledTimes(1);

				// Verify cleanup is cleared
				expect((popup.rootInstance as any).cleanup).toBeUndefined();
			});

			it('should handle reposition timeout cleanup', async () => {
				const timeoutId = 12345;
				(popup.rootInstance as any).repositionTimeout = timeoutId;

				const cancelSpy = jest.spyOn(global, 'cancelAnimationFrame');

				// Call destroyAutoUpdate which should clean up the timeout
				(popup.rootInstance as any).destroyAutoUpdate();

				// Verify cancelAnimationFrame was called with the timeout ID
				expect(cancelSpy).toHaveBeenCalledWith(timeoutId);

				// Verify repositionTimeout is cleared
				expect((popup.rootInstance as any).repositionTimeout).toBeUndefined();

				cancelSpy.mockRestore();
			});

			it('should handle anchor change properly', async () => {
				const destroySpy = jest.spyOn(popup.rootInstance as any, 'destroyAutoUpdate');

				popup.root.active = true;
				await (popup.rootInstance as any).handleAnchorChange();

				expect(destroySpy).toHaveBeenCalledTimes(1);
				expect(popup.rootInstance.anchorEl).toBeTruthy();

				destroySpy.mockRestore();
			});
		});
		describe('Slots', () => {
			it('should render the anchor slot correctly', async () => {
				await popup.waitForChanges();

				const slotEl = popup.root.shadowRoot.querySelector<HTMLSlotElement>('slot[name="anchor"]');

				const changeEvent = new Event('slotchange');
				slotEl.dispatchEvent(changeEvent);
				await popup.waitForChanges();

				// Check if the anchor slot is rendered
				expect(slotEl).not.toBeNull();
				expect(popup.rootInstance.anchorEl).toBeTruthy();
			});

			it('should render the default slot correctly', async () => {
				await popup.waitForChanges();

				// Query the default slot in the shadow DOM
				const popupSlot = popup.root.shadowRoot.querySelector('div slot');
				// Check if the default slot is rendered
				expect(popupSlot).not.toBeNull();
			});
		});
	});
});

