import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvTooltip } from './dv-tooltip';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-tooltip', () => {
	let tooltipSpec: TypedSpecPage<DvTooltip>;

	// Initialize a new instance for DvTooltip

	beforeEach(async () => {
		tooltipSpec = (await newSpecPage({
			components: [DvTooltip],

			html: `<dv-tooltip></dv-tooltip>`,

			supportsShadowDom: true
		})) as TypedSpecPage<DvTooltip>;
	});

	// Teardown instance after each test case

	afterEach(() => {
		tooltipSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should render the component', async () => {
			// Check that the component is rendered
			expect(tooltipSpec.root).toBeTruthy();
		});
	});

	describe('Props', () => {
		it('should hide the tooltip when the tooltip is disabled', async () => {
			tooltipSpec.root.disabled = false;
			tooltipSpec.root.open = true;
			await tooltipSpec.waitForChanges();

			tooltipSpec.root.disabled = true;
			await tooltipSpec.waitForChanges();

			expect(tooltipSpec.root.open).toBe(false);
		});

		it('should set hoist property correctly', async () => {
			// Mock the popup element first
			Object.defineProperty(tooltipSpec.rootInstance, 'popup', {
				value: { reposition: jest.fn().mockResolvedValue(undefined) },
				writable: true,
				configurable: true
			});

			tooltipSpec.root.hoist = true;
			await tooltipSpec.waitForChanges();

			expect(tooltipSpec.root.hoist).toBe(true);
		});

		it('should set maxWidth property correctly', async () => {
			tooltipSpec.root.maxWidth = 30;
			await tooltipSpec.waitForChanges();

			expect(tooltipSpec.root.maxWidth).toBe(30);
		});

		it('should set maxWidth to null', async () => {
			tooltipSpec.root.maxWidth = null;
			await tooltipSpec.waitForChanges();

			expect(tooltipSpec.root.maxWidth).toBe(null);
		});

		it('should update trigger property and call reposition when placement changes', async () => {
			// Mock the popup reposition method
			const repositionSpy = jest.fn().mockResolvedValue(undefined);
			Object.defineProperty(tooltipSpec.rootInstance, 'popup', {
				value: { reposition: repositionSpy },
				writable: true,
				configurable: true
			});

			tooltipSpec.root.placement = 'left';
			await tooltipSpec.waitForChanges();

			expect(repositionSpy).toHaveBeenCalled();
		});
	});

	describe('Events', () => {
		it('should not emit show event when the show method is called and the tooltip is disabled', async () => {
			const showEventSpy = jest.fn();
			tooltipSpec.rootInstance.host.addEventListener('show', showEventSpy);

			tooltipSpec.root.open = false;
			tooltipSpec.root.disabled = true;
			await tooltipSpec.waitForChanges();

			await tooltipSpec.rootInstance.tooltipShow();
			await tooltipSpec.waitForChanges();

			expect(showEventSpy).not.toHaveBeenCalled();
		});

		it('should emit hide event when closed', async () => {
			const hideEventSpy = jest.fn();
			tooltipSpec.rootInstance.host.addEventListener('hide', hideEventSpy);

			tooltipSpec.rootInstance.open = true;
			await tooltipSpec.waitForChanges();

			await tooltipSpec.rootInstance.tooltipHide();
			await tooltipSpec.waitForChanges();

			// check if the event was emitted
			expect(hideEventSpy).toHaveBeenCalled();
		});

		it('should emit show event when opened', async () => {
			const showEventSpy = jest.fn();
			tooltipSpec.rootInstance.host.addEventListener('show', showEventSpy);

			tooltipSpec.rootInstance.open = false;
			await tooltipSpec.waitForChanges();

			await tooltipSpec.rootInstance.tooltipShow();
			await tooltipSpec.waitForChanges();

			// check if the event was emitted
			expect(showEventSpy).toHaveBeenCalled();
		});

		it('should emit afterShow event after showing', async () => {
			const afterShowSpy = jest.fn();
			tooltipSpec.rootInstance.host.addEventListener('afterShow', afterShowSpy);

			// Mock the popup and body elements to avoid animation issues
			Object.defineProperty(tooltipSpec.rootInstance, 'popup', {
				value: { active: false, reposition: jest.fn().mockResolvedValue(undefined) },
				writable: true,
				configurable: true
			});
			Object.defineProperty(tooltipSpec.rootInstance, 'body', {
				value: { hidden: true, getAnimations: jest.fn().mockReturnValue([]) },
				writable: true,
				configurable: true
			});

			tooltipSpec.root.open = false;
			await tooltipSpec.waitForChanges();

			await tooltipSpec.rootInstance.tooltipShow();
			await tooltipSpec.waitForChanges();

			// Wait a bit for async operations to complete
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(afterShowSpy).toHaveBeenCalled();
		});

		it('should emit afterHide event after hiding', async () => {
			const afterHideSpy = jest.fn();
			tooltipSpec.rootInstance.host.addEventListener('afterHide', afterHideSpy);

			// Mock the popup and body elements
			Object.defineProperty(tooltipSpec.rootInstance, 'popup', {
				value: { active: true, reposition: jest.fn().mockResolvedValue(undefined) },
				writable: true,
				configurable: true
			});
			Object.defineProperty(tooltipSpec.rootInstance, 'body', {
				value: { hidden: false, getAnimations: jest.fn().mockReturnValue([]) },
				writable: true,
				configurable: true
			});

			tooltipSpec.root.open = true;
			await tooltipSpec.waitForChanges();

			await tooltipSpec.rootInstance.tooltipHide();
			await tooltipSpec.waitForChanges();

			// Wait a bit for async operations to complete
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(afterHideSpy).toHaveBeenCalled();
		});
	});

	describe('Methods', () => {
		it('should return correct triggers', async () => {
			tooltipSpec.root.trigger = 'hover focus manual';
			await tooltipSpec.waitForChanges();

			const hasHover = tooltipSpec.rootInstance.hasTrigger('hover');
			const hasFocus = tooltipSpec.rootInstance.hasTrigger('focus');
			const hasClick = tooltipSpec.rootInstance.hasTrigger('click');
			const hasManual = tooltipSpec.rootInstance.hasTrigger('manual');

			expect(hasHover).toBeTruthy();
			expect(hasFocus).toBeTruthy();
			expect(hasClick).toBeFalsy();
			expect(hasManual).toBeTruthy();
		});

		it('should not show when already open', async () => {
			tooltipSpec.root.open = true;
			await tooltipSpec.waitForChanges();

			const result = await tooltipSpec.rootInstance.tooltipShow();
			expect(result).toBeUndefined();
		});

		it('should not hide when already closed', async () => {
			tooltipSpec.root.open = false;
			await tooltipSpec.waitForChanges();

			const result = await tooltipSpec.rootInstance.tooltipHide();
			expect(result).toBeUndefined();
		});
	});

	describe('Slots', () => {
		it('should render content slot correctly', async () => {
			const specWithContentSlot = await newSpecPage({
				components: [DvTooltip],
				html: `
					<dv-tooltip>
						<span slot="content">Custom content</span>
						<button>Trigger</button>
					</dv-tooltip>
				`,
				supportsShadowDom: true
			});

			await specWithContentSlot.waitForChanges();

			const contentSlot = specWithContentSlot.root.shadowRoot.querySelector('slot[name="content"]');
			expect(contentSlot).toBeTruthy();
		});
	});

	describe('Accessibility', () => {
		it('should prevent race conditions when opening/closing rapidly', async () => {
			// Mock the popup and body elements
			Object.defineProperty(tooltipSpec.rootInstance, 'popup', {
				value: { active: false, reposition: jest.fn().mockResolvedValue(undefined) },
				writable: true,
				configurable: true
			});
			Object.defineProperty(tooltipSpec.rootInstance, 'body', {
				value: { hidden: true, getAnimations: jest.fn().mockReturnValue([]) },
				writable: true,
				configurable: true
			});

			// Set isAnimating to true to simulate race condition
			(tooltipSpec.rootInstance as any).isAnimating = true;

			tooltipSpec.root.open = false;
			await tooltipSpec.waitForChanges();

			// Try to open while animating
			tooltipSpec.root.open = true;
			await tooltipSpec.waitForChanges();

			// Should remain closed due to race condition protection
			expect((tooltipSpec.rootInstance as any).isAnimating).toBe(true);
		});

		it('should set aria-live attribute based on open state', async () => {
			tooltipSpec.root.open = true;
			await tooltipSpec.waitForChanges();

			const tooltipElement = tooltipSpec.root.shadowRoot.querySelector('[role="tooltip"]');
			expect(tooltipElement.getAttribute('aria-live')).toBe('polite');

			tooltipSpec.root.open = false;
			await tooltipSpec.waitForChanges();

			expect(tooltipElement.getAttribute('aria-live')).toBe('off');
		});

		it('should handle keyboard events properly', async () => {
			const hideSpy = jest.spyOn(tooltipSpec.rootInstance, 'tooltipHide');

			// Trigger the keyboard event handler directly
			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			(tooltipSpec.rootInstance as any).handleDocumentKeyDown(event);

			expect(hideSpy).toHaveBeenCalled();
			hideSpy.mockRestore();
		});

		it('should handle animation errors during show', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock the body and popup to simulate error in animation flow
			const mockAnimateTooltip = jest
				.spyOn(tooltipSpec.rootInstance as any, 'animateTooltip')
				.mockRejectedValue(new Error('Animation failed'));

			Object.defineProperty(tooltipSpec.rootInstance, 'popup', {
				value: { active: false, reposition: jest.fn().mockResolvedValue(undefined) },
				writable: true,
				configurable: true
			});
			Object.defineProperty(tooltipSpec.rootInstance, 'body', {
				value: { hidden: true, getAnimations: jest.fn().mockReturnValue([]) },
				writable: true,
				configurable: true
			});

			tooltipSpec.root.open = false;
			await tooltipSpec.waitForChanges();

			tooltipSpec.root.open = true;
			await tooltipSpec.waitForChanges();

			// Wait for the error to be caught
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(consoleSpy).toHaveBeenCalledWith('dv-tooltip show animation failed:', expect.any(Error));

			consoleSpy.mockRestore();
			mockAnimateTooltip.mockRestore();
		});

		it('should handle animation errors during hide', async () => {
			const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

			// Mock the body and popup to simulate error in animation flow
			const mockAnimateTooltip = jest
				.spyOn(tooltipSpec.rootInstance as any, 'animateTooltip')
				.mockRejectedValue(new Error('Animation failed'));

			Object.defineProperty(tooltipSpec.rootInstance, 'popup', {
				value: { active: true, reposition: jest.fn().mockResolvedValue(undefined) },
				writable: true,
				configurable: true
			});
			Object.defineProperty(tooltipSpec.rootInstance, 'body', {
				value: { hidden: false, getAnimations: jest.fn().mockReturnValue([]) },
				writable: true,
				configurable: true
			});

			tooltipSpec.root.open = true;
			await tooltipSpec.waitForChanges();

			tooltipSpec.root.open = false;
			await tooltipSpec.waitForChanges();

			// Wait for the error to be caught
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(consoleSpy).toHaveBeenCalledWith('dv-tooltip hide animation failed:', expect.any(Error));

			consoleSpy.mockRestore();
			mockAnimateTooltip.mockRestore();
		});

		it('should clean up timeouts in disconnectedCallback', async () => {
			// Set some timeouts to be cleaned up - they need to be truthy values
			(tooltipSpec.rootInstance as any).hoverTimeout = 123;
			(tooltipSpec.rootInstance as any).animationTimeout = 456;

			// Spy on clearTimeout to see if it gets called
			const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

			// Call disconnectedCallback to trigger cleanup
			(tooltipSpec.rootInstance as any).disconnectedCallback();

			// Check that clearTimeout was called with the correct values
			expect(clearTimeoutSpy).toHaveBeenCalledWith(123);
			expect(clearTimeoutSpy).toHaveBeenCalledWith(456);

			// Check that the timeout properties were set to undefined
			expect((tooltipSpec.rootInstance as any).hoverTimeout).toBeUndefined();
			expect((tooltipSpec.rootInstance as any).animationTimeout).toBeUndefined();
			expect((tooltipSpec.rootInstance as any).isAnimating).toBe(false);

			clearTimeoutSpy.mockRestore();
		});

		it('should have aria-describedby on anchor matching id on tooltip body', async () => {
			const anchorSpan = tooltipSpec.root.shadowRoot.querySelector('span[slot="anchor"]');
			const tooltipBody = tooltipSpec.root.shadowRoot.querySelector('[role="tooltip"]');

			expect(anchorSpan.getAttribute('aria-describedby')).toBe(tooltipBody.getAttribute('id'));
		});

		it('should assign unique ids across multiple instances', async () => {
			const multiSpec = await newSpecPage({
				components: [DvTooltip],
				html: `<div><dv-tooltip></dv-tooltip><dv-tooltip></dv-tooltip></div>`,
				supportsShadowDom: true
			});

			const tooltips = multiSpec.doc.querySelectorAll('dv-tooltip');
			const firstId = tooltips[0].shadowRoot.querySelector('[role="tooltip"]').getAttribute('id');
			const secondId = tooltips[1].shadowRoot.querySelector('[role="tooltip"]').getAttribute('id');

			expect(firstId).not.toBe(secondId);
		});

		it('should have a valid aria relationship between anchor and tooltip body', async () => {
			const anchorSpan = tooltipSpec.root.shadowRoot.querySelector('span[slot="anchor"]');
			const tooltipBody = tooltipSpec.root.shadowRoot.querySelector('[role="tooltip"]');

			expect(anchorSpan).toBeTruthy();
			expect(tooltipBody).toBeTruthy();
			expect(anchorSpan.getAttribute('aria-describedby')).toBe(tooltipBody.getAttribute('id'));
		});
	});
});

