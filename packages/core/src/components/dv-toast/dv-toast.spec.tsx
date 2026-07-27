import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvToast } from './dv-toast';
import { DvIcon } from '../dv-icon/dv-icon';
import { DvIconButton } from '../dv-icon-button/dv-icon-button';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-toast', () => {
	let toastSpec: TypedSpecPage<DvToast>;
	const originalAppend = document.body.append;

	beforeEach(async () => {
		// Mock the append method
		document.body.append = jest.fn();

		toastSpec = (await newSpecPage({
			components: [DvToast, DvIcon, DvIconButton],
			html: `<dv-toast></dv-toast>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvToast>;
	});

	// Teardown instance and restore after each test case
	afterEach(() => {
		document.body.append = originalAppend;
	});

	it('should render the component', async () => {
		expect(toastSpec.root).toBeTruthy();
	});

	describe('Props', () => {
		it('should show the toast when open is set to true', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			// check if the toast is visible
			expect(toastSpec.rootInstance.isVisible).toBe(true);
		});

		it('should hide the toast when open is set to false', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.root.setAttribute('open', 'false');
			await toastSpec.waitForChanges();
			// check if the toast is hidden
			expect(toastSpec.rootInstance.isVisible).toBe(false);
		});

		it('should show toast when component loads with open=true', async () => {
			const page = (await newSpecPage({
				components: [DvToast, DvIcon, DvIconButton],
				html: `<dv-toast open></dv-toast>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvToast>;

			await page.waitForChanges();

			expect(page.rootInstance.isVisible).toBe(true);
		});

		it('should return correct classes for success status color', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.rootInstance.color = 'success';
			await toastSpec.waitForChanges();

			const toastDiv = toastSpec.root.shadowRoot?.querySelector('div');
			// check if the success class is present
			expect(toastDiv).not.toBeNull();
			expect(toastDiv).toHaveClass('border-status-success');

			// query the toast icon in the shadow DOM
			const iconElement = toastSpec.root.shadowRoot.querySelector('dv-icon');
			// check if the correct icon is rendered
			expect(iconElement).not.toBeNull();
			expect(iconElement.getAttribute('name')).toBe('circle-check');
		});

		it('should return correct classes for warning status color', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.rootInstance.color = 'warning';
			await toastSpec.waitForChanges();

			const toastDiv = toastSpec.root.shadowRoot?.querySelector('div');
			// check if the warning class is present
			expect(toastDiv).not.toBeNull();
			expect(toastDiv).toHaveClass('border-status-warning');

			// query the toast icon in the shadow DOM
			const iconElement = toastSpec.root.shadowRoot.querySelector('dv-icon');
			// check if the correct icon is rendered
			expect(iconElement).not.toBeNull();
			expect(iconElement.getAttribute('name')).toBe('circle-exclamation');
		});

		it('should return correct classes for error status color', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.rootInstance.color = 'error';
			await toastSpec.waitForChanges();

			const toastDiv = toastSpec.root.shadowRoot?.querySelector('div');
			// check if the danger class is present
			expect(toastDiv).not.toBeNull();
			expect(toastDiv).toHaveClass('border-status-error');

			// query the toast icon in the shadow DOM
			const iconElement = toastSpec.root.shadowRoot.querySelector('dv-icon');
			// check if the correct icon is rendered
			expect(iconElement).not.toBeNull();
			expect(iconElement.getAttribute('name')).toBe('circle-xmark');
		});

		it('should return correct classes for neutral status color', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.rootInstance.color = 'neutral';
			await toastSpec.waitForChanges();

			const toastDiv = toastSpec.root.shadowRoot?.querySelector('div');
			// check if the neutral class is present
			expect(toastDiv).not.toBeNull();
			expect(toastDiv).toHaveClass('border-status-neutral');

			// query the toast icon in the shadow DOM
			const iconElement = toastSpec.root.shadowRoot.querySelector('dv-icon');
			// check if the correct icon is rendered
			expect(iconElement).not.toBeNull();
			expect(iconElement.getAttribute('name')).toBe('circle-info');
		});

		it('should return correct classes for info status color', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.rootInstance.color = 'info';
			await toastSpec.waitForChanges();

			const toastDiv = toastSpec.root.shadowRoot?.querySelector('div');
			// check if the info class is present
			expect(toastDiv).not.toBeNull();
			expect(toastDiv).toHaveClass('border-status-info');

			// query the toast icon in the shadow DOM
			const iconElement = toastSpec.root.shadowRoot.querySelector('dv-icon');
			// check if the correct icon is rendered
			expect(iconElement).not.toBeNull();
			expect(iconElement.getAttribute('name')).toBe('circle-info');
		});

		it('should return info status color classes for unsupported color', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.rootInstance.color = 'default';
			await toastSpec.waitForChanges();

			const toastDiv = toastSpec.root.shadowRoot?.querySelector('div');
			// check if the info class is present
			expect(toastDiv).not.toBeNull();
			expect(toastDiv).toHaveClass('border-status-info');

			// query the toast icon in the shadow DOM
			const iconElement = toastSpec.root.shadowRoot.querySelector('dv-icon');
			// check if the correct icon is rendered
			expect(iconElement).not.toBeNull();
			expect(iconElement.getAttribute('name')).toBe('circle-info');
		});

		it('should correctly handle autoHide functionality', async () => {
			toastSpec.rootInstance.open = true;
			toastSpec.rootInstance.duration = 1000;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			expect(toastSpec.rootInstance.isVisible).toBe(true);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			await toastSpec.waitForChanges();
			// Check if isVisible is false
			expect(toastSpec.rootInstance.isVisible).toBe(false);
		});

		it('should restart auto-hide when duration prop changes', async () => {
			toastSpec.rootInstance.open = true;
			toastSpec.rootInstance.duration = 5000;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();

			const pauseSpy = jest.spyOn(toastSpec.rootInstance as any, 'pauseAutoHide');
			const resetSpy = jest.spyOn(toastSpec.rootInstance as any, 'resetAutoHide');

			// Change duration to trigger handleDurationChange
			toastSpec.root.duration = 3000;
			await toastSpec.waitForChanges();

			expect(pauseSpy).toHaveBeenCalled();
			expect(resetSpy).toHaveBeenCalled();

			pauseSpy.mockRestore();
			resetSpy.mockRestore();
		});

		it('should apply exiting state class when isExiting is true', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();

			// Set isExiting to true and re-render
			toastSpec.rootInstance.isExiting = true;
			toastSpec.rootInstance.isVisible = true;
			await toastSpec.waitForChanges();

			const toastDiv = toastSpec.root.shadowRoot?.querySelector('div');
			expect(toastDiv).toHaveClass('opacity-0');
		});
	});

	describe('Events', () => {
		it('should emit show event when opened', async () => {
			const showEventSpy = jest.fn();
			toastSpec.rootInstance.host.addEventListener('show', showEventSpy);
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			// Check if the event was emitted
			expect(showEventSpy).toHaveBeenCalled();
		});

		it('should emit hide event when closed', async () => {
			const hideEventSpy = jest.fn();
			toastSpec.rootInstance.host.addEventListener('hide', hideEventSpy);
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.rootInstance.open = false;
			await toastSpec.rootInstance.toastHide();
			await toastSpec.waitForChanges();
			// check if the event was emitted
			expect(hideEventSpy).toHaveBeenCalled();
		});

		it('should not show the toast if show event is prevented', async () => {
			const showEventSpy = jest.fn((event) => {
				event.preventDefault();
			});
			toastSpec.rootInstance.host.addEventListener('show', showEventSpy);
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			// Check if the toast is not visible
			expect(toastSpec.rootInstance.isVisible).toBe(false);
			expect(toastSpec.rootInstance.open).toBe(false);
			expect(showEventSpy).toHaveBeenCalled();
		});

		it('should not hide the toast if hide event is prevented', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();

			const hideEventSpy = jest.fn((event) => {
				event.preventDefault();
			});
			toastSpec.rootInstance.host.addEventListener('hide', hideEventSpy);

			await toastSpec.rootInstance.toastHide();
			await toastSpec.waitForChanges();

			// Check if the toast is still visible because event was prevented
			expect(toastSpec.rootInstance.isVisible).toBe(true);
			expect(toastSpec.rootInstance.open).toBe(true);
			expect(hideEventSpy).toHaveBeenCalled();
		});
	});

	describe('Methods', () => {
		it('should not show the toast if already visible', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			const initialVisibleState = toastSpec.rootInstance.isVisible;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			// Check if the toast is still visible
			expect(toastSpec.rootInstance.isVisible).toBe(initialVisibleState);
		});

		it('should not hide the toast if hide is called and isVisible is false', async () => {
			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();
			toastSpec.rootInstance.isVisible = false;
			await toastSpec.rootInstance.toastHide();
			await toastSpec.waitForChanges();
			// Check if the toast is still visible
			expect(toastSpec.rootInstance.isVisible).toBe(false);
		});

		it('should call toast() method and set up event listener for hide', async () => {
			const addEventListenerSpy = jest.spyOn(toastSpec.rootInstance.host, 'addEventListener');

			// Call toast method
			toastSpec.rootInstance.toast();
			await toastSpec.waitForChanges();

			expect(addEventListenerSpy).toHaveBeenCalledWith('hide', expect.any(Function), { once: true });
			addEventListenerSpy.mockRestore();
		});

		it('should call toastHide after finite duration timeout within toastShow', async () => {
			const hideSpy = jest.spyOn(toastSpec.rootInstance, 'toastHide');
			const setTimeoutSpy = jest.spyOn(window, 'setTimeout').mockImplementation((handler: TimerHandler) => {
				if (typeof handler === 'function') {
					handler();
				}
				return 1 as unknown as ReturnType<typeof setTimeout>;
			});

			toastSpec.rootInstance.duration = 1000;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();

			expect(setTimeoutSpy).toHaveBeenCalled();
			expect(hideSpy).toHaveBeenCalled();

			setTimeoutSpy.mockRestore();
			hideSpy.mockRestore();
		});

		it('should fallback when requestAnimationFrame is unavailable within toastShow', async () => {
			const originalRequestAnimationFrame = globalThis.requestAnimationFrame;

			Object.defineProperty(globalThis, 'requestAnimationFrame', {
				value: undefined,
				writable: true,
				configurable: true
			});

			toastSpec.rootInstance.open = true;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();

			expect(toastSpec.rootInstance.isEntering).toBe(false);

			Object.defineProperty(globalThis, 'requestAnimationFrame', {
				value: originalRequestAnimationFrame,
				writable: true,
				configurable: true
			});
		});

		it('should invoke toastShow through requestAnimationFrame in toast()', async () => {
			const originalRaf = globalThis.requestAnimationFrame;
			const toastShowSpy = jest.spyOn(toastSpec.rootInstance, 'toastShow').mockResolvedValue(undefined);

			Object.defineProperty(globalThis, 'requestAnimationFrame', {
				value: (callback: FrameRequestCallback) => {
					callback(0);
					return 1;
				},
				writable: true,
				configurable: true
			});

			const toastPromise = toastSpec.rootInstance.toast();
			toastSpec.rootInstance.host.dispatchEvent(new CustomEvent('hide'));
			await toastPromise;

			expect(toastShowSpy).toHaveBeenCalled();

			toastShowSpy.mockRestore();
			Object.defineProperty(globalThis, 'requestAnimationFrame', {
				value: originalRaf,
				writable: true,
				configurable: true
			});
		});

		it('should resolve toast() promise when hide event is dispatched', async () => {
			const toastPromise = toastSpec.rootInstance.toast();

			// Dispatch the hide event to trigger resolve
			toastSpec.rootInstance.host.dispatchEvent(new CustomEvent('hide'));

			await expect(toastPromise).resolves.toBeUndefined();
		});

		it('should hide the toast when close button is clicked', async () => {
			const page = (await newSpecPage({
				components: [DvToast, DvIcon, DvIconButton],
				html: `<dv-toast open closable></dv-toast>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvToast>;

			await page.rootInstance.toastShow();
			await page.waitForChanges();

			const hideSpy = jest.spyOn(page.rootInstance, 'toastHide');

			// Trigger handleCloseClick
			(page.rootInstance as any).handleCloseClick();
			await page.waitForChanges();

			expect(hideSpy).toHaveBeenCalled();
			hideSpy.mockRestore();
		});

		it('should pause auto-hide on mouse enter', async () => {
			toastSpec.rootInstance.open = true;
			toastSpec.rootInstance.duration = 5000;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();

			const pauseSpy = jest.spyOn(toastSpec.rootInstance as any, 'pauseAutoHide');

			// Trigger handleMouseEnter
			(toastSpec.rootInstance as any).handleMouseEnter();

			expect(pauseSpy).toHaveBeenCalled();
			pauseSpy.mockRestore();
		});

		it('should reset auto-hide on mouse leave', async () => {
			toastSpec.rootInstance.open = true;
			toastSpec.rootInstance.duration = 5000;
			await toastSpec.rootInstance.toastShow();
			await toastSpec.waitForChanges();

			const resetSpy = jest.spyOn(toastSpec.rootInstance as any, 'resetAutoHide');

			// Trigger handleMouseLeave
			(toastSpec.rootInstance as any).handleMouseLeave();

			expect(resetSpy).toHaveBeenCalled();
			resetSpy.mockRestore();
		});

		it('should not set timeout in resetAutoHide when open is false', async () => {
			toastSpec.rootInstance.open = false;
			toastSpec.rootInstance.duration = 1000;

			// Call resetAutoHide directly when toast is closed
			(toastSpec.rootInstance as any).resetAutoHide();

			// autoHideTimeout should not be set
			expect((toastSpec.rootInstance as any).autoHideTimeout).toBeUndefined();
		});
	});
});

