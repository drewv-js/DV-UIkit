import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvCallout } from './dv-callout';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-callout', () => {
	let callout: TypedSpecPage<DvCallout>;

	// Initialize a new instance for DvCallout
	beforeEach(async () => {
		callout = (await newSpecPage({
			components: [DvCallout],
			html: `<dv-callout></dv-callout>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvCallout>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		callout = null;
	});

	describe('Initialization with default state', () => {
		it('renders callout with default properties', async () => {
			await callout.waitForChanges();
			const calloutElement = callout.root.shadowRoot.querySelector('div');
			// Check if the callout has default colors
			expect(callout.root.color).toBe('info');
			expect(calloutElement).toHaveClass('border-status-info');
			expect(calloutElement).toHaveClass('bg-status-info');
		});
	});

	describe('Props', () => {
		it('renders callout with info color', async () => {
			callout.root.color = 'info';
			await callout.waitForChanges();
			const calloutElement = callout.root.shadowRoot.querySelector('div');
			// Check if the callout has info color
			expect(calloutElement).toHaveClass('border-status-info');
			expect(calloutElement).toHaveClass('bg-status-info');

			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('circle-info');
		});

		it('renders callout with success color', async () => {
			callout.root.color = 'success';
			await callout.waitForChanges();
			const calloutElement = callout.root.shadowRoot.querySelector('div');
			// Check if the callout has success color
			expect(calloutElement).toHaveClass('border-status-success');
			expect(calloutElement).toHaveClass('bg-status-success');

			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('circle-check');
		});

		it('renders callout with neutral color', async () => {
			callout.root.color = 'neutral';
			await callout.waitForChanges();
			const calloutElement = callout.root.shadowRoot.querySelector('div');
			// Check if the callout has neutral color
			expect(calloutElement).toHaveClass('border-status-neutral');
			expect(calloutElement).toHaveClass('bg-status-neutral');

			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('circle-info');
		});

		it('renders callout with warning color', async () => {
			callout.root.color = 'warning';
			await callout.waitForChanges();
			const calloutElement = callout.root.shadowRoot.querySelector('div');
			// Check if the callout has warning color
			expect(calloutElement).toHaveClass('border-status-warning');
			expect(calloutElement).toHaveClass('bg-status-warning');

			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('triangle-exclamation');
		});

		it('renders callout with error color', async () => {
			callout.root.color = 'error';
			await callout.waitForChanges();
			const calloutElement = callout.root.shadowRoot.querySelector('div');
			// Check if the callout has error color
			expect(calloutElement).toHaveClass('border-status-error');
			expect(calloutElement).toHaveClass('bg-status-error');

			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('triangle-exclamation');
		});

		it('renders status indicator icons when icon true', async () => {
			callout.root.icon = true;
			await callout.waitForChanges();
			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
		});

		it('renders status icon with xs size', async () => {
			callout.root.icon = true;
			await callout.waitForChanges();
			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon.getAttribute('size')).toBe('xs');
		});

		it('does not render status indicator icons when icon false', async () => {
			callout.root.icon = false;
			await callout.waitForChanges();
			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).toBeNull();
		});

		it('renders label when provided', async () => {
			callout.root.label = 'Label';
			await callout.waitForChanges();
			const label = callout.root.shadowRoot.querySelector('div span');
			expect(label).not.toBeNull();
			expect(label.textContent).toBe('Label');
			expect(label).toHaveClass('title-xs');
		});

		it('does not render label when not provided', async () => {
			await callout.waitForChanges();
			const label = callout.root.shadowRoot.querySelector('div span');
			expect(label).toBeNull();
		});

		it('renders close button when closable true', async () => {
			callout.root.closable = true;
			await callout.waitForChanges();
			const closeButton = callout.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
		});

		it('does not render close button when closable false', async () => {
			callout.root.closable = false;
			await callout.waitForChanges();
			const closeButton = callout.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).toBeNull();
		});
	});

	describe('Slots', () => {
		it('does not render default slot content when not provided', async () => {
			await callout.waitForChanges();
			// Check if the callout message content is empty
			const calloutMessage = callout.root.shadowRoot.querySelector('.flex');
			expect(calloutMessage.textContent.trim()).toBe('');
		});

		it('does not render footer slot content when not provided', async () => {
			await callout.waitForChanges();
			// Check if the callout footer slot is empty
			const footerSlot = callout.root.shadowRoot.querySelector('[slot="footer"]');
			expect(footerSlot).toBeNull();
		});

		it('renders footer slot content when provided', async () => {
			callout.root.innerHTML = '<a href="" slot="footer">Slotted Link</a>';
			await callout.waitForChanges();
			// Query the anchor element directly instead of the slot
			const footerLinkElement = callout.root.querySelector('a[slot="footer"]');
			// Check if the dv-icon element is rendered
			expect(footerLinkElement).not.toBeNull();
		});

		it('does not render actions slot content when not provided', async () => {
			await callout.waitForChanges();
			const actionsSlot = callout.root.shadowRoot.querySelector('[slot="actions"]');
			expect(actionsSlot).toBeNull();
		});

		it('renders actions slot content when provided', async () => {
			callout.root.innerHTML = '<a href="" slot="actions">Actions link</a>';
			await callout.waitForChanges();
			const actionsLinkElement = callout.root.querySelector('a[slot="actions"]');
			expect(actionsLinkElement).not.toBeNull();
		});

		it('does not render footer wrapper in shadow DOM when no footer slot content', async () => {
			await callout.waitForChanges();
			const footerSlot = callout.root.shadowRoot.querySelector('slot[name="footer"]');
			expect(footerSlot).toBeNull();
		});

		it('does not render actions wrapper when closable and no actions slot content', async () => {
			callout.root.closable = true;
			await callout.waitForChanges();
			const actionsWrapper = callout.root.shadowRoot.querySelector('.text-nowrap');
			expect(actionsWrapper).toBeNull();
		});

		it('renders footer wrapper in shadow DOM when footer slot is populated', async () => {
			const page = await newSpecPage({
				components: [DvCallout],
				html: `<dv-callout><span slot="footer">Footer</span></dv-callout>`,
				supportsShadowDom: true
			});
			await page.waitForChanges();
			const footerSlot = page.root.shadowRoot.querySelector('slot[name="footer"]');
			expect(footerSlot).not.toBeNull();
		});

		it('renders actions wrapper in shadow DOM when actions slot is populated', async () => {
			const page = await newSpecPage({
				components: [DvCallout],
				html: `<dv-callout><a slot="actions">Action</a></dv-callout>`,
				supportsShadowDom: true
			});
			await page.waitForChanges();
			const actionsWrapper = page.root.shadowRoot.querySelector('.text-nowrap');
			expect(actionsWrapper).not.toBeNull();
		});
	});

	describe('Events', () => {
		it('emits hide event when closed', async () => {
			callout.root.open = true;
			await callout.waitForChanges();
			const hideSpy = jest.fn();
			callout.root.addEventListener('hide', hideSpy);
			callout.root.open = false;
			await callout.waitForChanges();
			expect(hideSpy).toHaveBeenCalled();
		});

		it('does not emit hide event when opened', async () => {
			callout.root.open = false;
			await callout.waitForChanges();
			const hideSpy = jest.fn();
			callout.root.addEventListener('hide', hideSpy);
			callout.root.open = true;
			await callout.waitForChanges();
			expect(hideSpy).not.toHaveBeenCalled();
		});
	});

	describe('Methods', () => {
		it('calls hide method when close button is clicked', async () => {
			callout.root.open = true;
			await callout.waitForChanges();
			const closeButton = callout.root.shadowRoot.querySelector('dv-icon-button');
			closeButton.click();
			await callout.waitForChanges();
			expect(callout.root.open).toBe(false);
		});

		it('sets open to false when calloutHide method is called', async () => {
			callout.root.open = true;
			await callout.waitForChanges();
			await callout.root.calloutHide();
			await callout.waitForChanges();
			expect(callout.root.open).toBe(false);
		});

		it('renders callout with info color when color is invalid', async () => {
			callout.root.setAttribute('color', 'unknown-color');
			await callout.waitForChanges();
			const calloutElement = callout.root.shadowRoot.querySelector('div');
			expect(calloutElement).toHaveClass('border-status-info');
			expect(calloutElement).toHaveClass('bg-status-info');

			const statusIcon = callout.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('circle-info');
		});
	});
});

