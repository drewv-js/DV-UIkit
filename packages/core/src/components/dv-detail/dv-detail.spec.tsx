import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvDetail } from './dv-detail';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-detail', () => {
	let detailSpec: TypedSpecPage<DvDetail>;

	// Initialize a new instance for DvDetail
	beforeEach(async () => {
		detailSpec = (await newSpecPage({
			components: [DvDetail],
			html: `
        <dv-detail></dv-detail>
      `,
			supportsShadowDom: true
		})) as TypedSpecPage<DvDetail>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		detailSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should render the component', () => {
			expect(new DvDetail()).toBeInstanceOf(DvDetail);
		});

		it('should render icon at end of summary by default', async () => {
			detailSpec.root.open = false;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			expect(summary).not.toHaveClass('flex-row-reverse');
		});
	});
	describe('Props', () => {
		it('should render aria-hidden as false when open property is true', async () => {
			detailSpec.root.open = true;
			await detailSpec.waitForChanges();

			const content = detailSpec.root.shadowRoot.querySelector('#content');
			expect(content.getAttribute('aria-hidden')).toBe('false');
		});

		it('should render aria-hidden as true when open property is false', async () => {
			detailSpec.root.open = false;
			await detailSpec.waitForChanges();

			const content = detailSpec.root.shadowRoot.querySelector('#content');
			expect(content.getAttribute('aria-hidden')).toBe('true');
		});

		it('should render icon at start of the summary when iconPlacement set to start', async () => {
			detailSpec.root.open = false;
			detailSpec.root.iconPlacement = 'start';
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			expect(summary).toHaveClass('flex-row-reverse');
		});

		it('should render icon at end of the summary when iconPlacement set to end', async () => {
			detailSpec.root.open = false;
			detailSpec.root.iconPlacement = 'end';
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			expect(summary).not.toHaveClass('flex-row-reverse');
		});

		it('should render icon at start placement rotated when open true', async () => {
			detailSpec.root.open = true;
			detailSpec.root.iconPlacement = 'start';
			await detailSpec.waitForChanges();

			const icon = detailSpec.root.shadowRoot.querySelector('dv-icon');
			expect(icon).toHaveClasses(['rotate-180', 'pl-4']);
		});

		it('should render icon at end placement rotated when open true', async () => {
			detailSpec.root.open = true;
			await detailSpec.waitForChanges();

			const icon = detailSpec.root.shadowRoot.querySelector('dv-icon');
			expect(icon).toHaveClasses(['rotate-180', 'pr-4']);
		});
	});
	describe('Events', () => {
		it('should open content when summary clicked if closed', async () => {
			detailSpec.root.open = false;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			summary.click();

			expect(detailSpec.root.open).toBe(true);
			expect(detailSpec.rootInstance.details.open).toBe(true);
		});

		it('should close content when summary clicked if open', async () => {
			detailSpec.root.open = true;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			summary.click();

			expect(detailSpec.root.open).toBe(false);
			expect(detailSpec.rootInstance.details.open).toBe(false);
		});

		it('should emit show event when opened', async () => {
			const showEventSpy = jest.fn();
			detailSpec.rootInstance.host.addEventListener('show', showEventSpy);
			detailSpec.rootInstance.open = true;
			await detailSpec.rootInstance.detailShow();
			await detailSpec.waitForChanges();

			expect(showEventSpy).toHaveBeenCalled();
		});

		it('should emit hide event when closed', async () => {
			const hideEventSpy = jest.fn();
			detailSpec.rootInstance.host.addEventListener('hide', hideEventSpy);
			detailSpec.rootInstance.open = true;
			await detailSpec.rootInstance.detailShow();
			await detailSpec.waitForChanges();
			detailSpec.rootInstance.open = false;
			await detailSpec.rootInstance.detailHide();
			await detailSpec.waitForChanges();

			expect(hideEventSpy).toHaveBeenCalled();
		});

		it('should not show the detail if show event is prevented', async () => {
			const showEventSpy = jest.fn((event) => {
				event.preventDefault();
			});
			detailSpec.rootInstance.host.addEventListener('show', showEventSpy);
			detailSpec.rootInstance.open = true;
			await detailSpec.rootInstance.detailShow();
			await detailSpec.waitForChanges();

			expect(detailSpec.rootInstance.open).toBe(false);
			expect(showEventSpy).toHaveBeenCalled();
		});

		it('should not hide the detail if hide event is prevented', async () => {
			const hideEventSpy = jest.fn((event) => {
				event.preventDefault();
			});
			detailSpec.rootInstance.host.addEventListener('hide', hideEventSpy);
			detailSpec.rootInstance.open = true;
			await detailSpec.rootInstance.detailShow();
			await detailSpec.waitForChanges();
			detailSpec.rootInstance.open = false;
			await detailSpec.rootInstance.detailHide();
			await detailSpec.waitForChanges();

			expect(detailSpec.rootInstance.open).toBe(true);
			expect(hideEventSpy).toHaveBeenCalled();
		});
	});
	describe('Methods', () => {
		it('should show the dropdown when the detailShow method is called', async () => {
			detailSpec.root.open = false;
			await detailSpec.waitForChanges();

			await detailSpec.rootInstance.detailShow();
			await detailSpec.waitForChanges();

			expect(detailSpec.root.open).toBe(true);
		});

		it('should hide the dropdown when the detailHide method is called', async () => {
			detailSpec.root.open = true;
			await detailSpec.waitForChanges();

			await detailSpec.rootInstance.detailHide();
			await detailSpec.waitForChanges();

			expect(detailSpec.root.open).toBe(false);
		});

		it('should set focus on the summary when setFocus called', async () => {
			const focusSpy = jest.spyOn(detailSpec.rootInstance.summary, 'focus');
			await detailSpec.rootInstance.setFocus();
			// Check that the focus method was called
			expect(focusSpy).toHaveBeenCalled();
			focusSpy.mockRestore();
		});

		it('should handle setFocus gracefully when summary is not yet available', async () => {
			detailSpec.rootInstance.summary = undefined;
			// Should not throw when summary is undefined
			await expect(detailSpec.rootInstance.setFocus()).resolves.not.toThrow();
		});
	});
	describe('Accessibility', () => {
		it('should show content when Enter key is pressed and select is closed', async () => {
			detailSpec.root.open = false;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			summary.dispatchEvent(event);

			expect(detailSpec.root.open).toBe(true);
			expect(detailSpec.rootInstance.details.open).toBe(true);
		});

		it('should hide content when Enter key is pressed and select is open', async () => {
			detailSpec.root.open = true;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			const event = new KeyboardEvent('keydown', { key: 'Enter' });
			summary.dispatchEvent(event);

			expect(detailSpec.root.open).toBe(false);
			expect(detailSpec.rootInstance.details.open).toBe(false);
		});

		it('should show content when ArrowDown key is pressed', async () => {
			detailSpec.root.open = false;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
			summary.dispatchEvent(event);

			expect(detailSpec.root.open).toBe(true);
			expect(detailSpec.rootInstance.details.open).toBe(true);
		});

		it('should show content when ArrowRight key is pressed', async () => {
			detailSpec.root.open = false;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
			summary.dispatchEvent(event);

			expect(detailSpec.root.open).toBe(true);
			expect(detailSpec.rootInstance.details.open).toBe(true);
		});

		it('should hide content when ArrowUp key is pressed', async () => {
			detailSpec.root.open = true;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
			summary.dispatchEvent(event);

			expect(detailSpec.root.open).toBe(false);
			expect(detailSpec.rootInstance.details.open).toBe(false);
		});

		it('should hide content when ArrowLeft key is pressed', async () => {
			detailSpec.root.open = true;
			await detailSpec.waitForChanges();

			const summary = detailSpec.root.shadowRoot.querySelector('summary');
			const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
			summary.dispatchEvent(event);

			expect(detailSpec.root.open).toBe(false);
			expect(detailSpec.rootInstance.details.open).toBe(false);
		});
	});
});

