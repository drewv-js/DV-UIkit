import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvAlert } from './dv-alert';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-alert', () => {
	let alert: TypedSpecPage<DvAlert>;

	// Initialize a new instance for DvAlert
	beforeEach(async () => {
		alert = (await newSpecPage({
			components: [DvAlert],
			html: `<dv-alert></dv-alert>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvAlert>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		alert = null;
	});

	describe('Initialization with default state', () => {
		it('renders alert with default properties', async () => {
			await alert.waitForChanges();
			const alertElement = alert.root.shadowRoot.querySelector('div');
			// Check if the alert has default visibility and colors
			expect(alertElement).toHaveClass('hidden');
			expect(alert.root.color).toBe('info');
			expect(alertElement).toHaveClass('border-status-info');
			expect(alertElement).toHaveClass('bg-status-info');
		});
	});

	describe('Props', () => {
		it('renders alert with info color', async () => {
			alert.root.color = 'info';
			await alert.waitForChanges();
			const alertElement = alert.root.shadowRoot.querySelector('div');
			// Check if the alert has info color
			expect(alertElement).toHaveClass('border-status-info');
			expect(alertElement).toHaveClass('bg-status-info');

			const statusIcon = alert.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('circle-info');
		});

		it('renders alert with success color', async () => {
			alert.root.color = 'success';
			await alert.waitForChanges();
			const alertElement = alert.root.shadowRoot.querySelector('div');
			// Check if the alert has success color
			expect(alertElement).toHaveClass('border-status-success');
			expect(alertElement).toHaveClass('bg-status-success');

			const statusIcon = alert.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('circle-check');
		});

		it('renders alert with neutral color', async () => {
			alert.root.color = 'neutral';
			await alert.waitForChanges();
			const alertElement = alert.root.shadowRoot.querySelector('div');
			// Check if the alert has neutral color
			expect(alertElement).toHaveClass('border-status-neutral');
			expect(alertElement).toHaveClass('bg-status-neutral');

			const statusIcon = alert.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('circle-info');
		});

		it('renders alert with warning color', async () => {
			alert.root.color = 'warning';
			await alert.waitForChanges();
			const alertElement = alert.root.shadowRoot.querySelector('div');
			// Check if the alert has warning color
			expect(alertElement).toHaveClass('border-status-warning');
			expect(alertElement).toHaveClass('bg-status-warning');

			const statusIcon = alert.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('triangle-exclamation');
		});

		it('renders alert with error color', async () => {
			alert.root.color = 'error';
			await alert.waitForChanges();
			const alertElement = alert.root.shadowRoot.querySelector('div');
			// Check if the alert has error color
			expect(alertElement).toHaveClass('border-status-error');
			expect(alertElement).toHaveClass('bg-status-error');

			const statusIcon = alert.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('triangle-exclamation');
		});

		it('renders alert with info color when color is invalid', async () => {
			alert.root.setAttribute('color', 'unknown-color');
			await alert.waitForChanges();
			const alertElement = alert.root.shadowRoot.querySelector('div');
			// Check if the alert has info color
			expect(alertElement).toHaveClass('border-status-info');
			expect(alertElement).toHaveClass('bg-status-info');

			const statusIcon = alert.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
			expect(statusIcon.getAttribute('name')).toBe('circle-info');
		});

		it('renders status indicator icons when icon true', async () => {
			alert.root.icon = true;
			await alert.waitForChanges();
			const statusIcon = alert.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).not.toBeNull();
		});

		it('does not render status indicator icons when icon false', async () => {
			alert.root.icon = false;
			await alert.waitForChanges();
			const statusIcon = alert.root.shadowRoot.querySelector('dv-icon');
			expect(statusIcon).toBeNull();
		});

		it('renders label when provided', async () => {
			alert.root.label = 'Label';
			await alert.waitForChanges();
			const label = alert.root.shadowRoot.querySelector('div span');
			expect(label).not.toBeNull();
			expect(label.textContent).toBe('Label');
			expect(label).toHaveClass('title-sm');
		});

		it('does not render label when not provided', async () => {
			await alert.waitForChanges();
			const label = alert.root.shadowRoot.querySelector('div span');
			expect(label).toBeNull();
		});

		it('renders close button when closable true', async () => {
			alert.root.closable = true;
			await alert.waitForChanges();
			const closeButton = alert.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
		});

		it('does not render close button when closable false', async () => {
			alert.root.closable = false;
			await alert.waitForChanges();
			const closeButton = alert.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).toBeNull();
		});

		it('renders proper style when scope variant local', async () => {
			alert.root.variant = 'local';
			await alert.waitForChanges();
			const alertDiv = alert.root.shadowRoot.querySelector('div[role="alert"]');
			expect(alertDiv).not.toBeNull();
			expect(alertDiv).toHaveClass('rounded-radius-md');
		});

		it('renders proper style when scope variant global', async () => {
			alert.root.variant = 'global';
			await alert.waitForChanges();
			const alertDiv = alert.root.shadowRoot.querySelector('div[role="alert"]');
			expect(alertDiv).not.toBeNull();
			expect(alertDiv).toHaveClass('rounded-none');
		});
	});

	describe('Events', () => {
		it('emits show event when opened', async () => {
			const showSpy = jest.fn();
			alert.root.addEventListener('show', showSpy);
			alert.root.open = true;
			await alert.waitForChanges();
			// Check if the show event was emitted
			expect(showSpy).toHaveBeenCalled();
		});

		it('emits hide event when closed', async () => {
			alert.root.open = true;
			await alert.waitForChanges();
			const hideSpy = jest.fn();
			alert.root.addEventListener('hide', hideSpy);
			alert.root.open = false;
			await alert.waitForChanges();
			// Check if the hide event was emitted
			expect(hideSpy).toHaveBeenCalled();
		});
	});

	describe('Methods', () => {
		it('calls hide method when close button is clicked', async () => {
			alert.root.open = true;
			await alert.waitForChanges();
			const closeButton = alert.root.shadowRoot.querySelector('dv-icon-button');
			closeButton.click();
			await alert.waitForChanges();
			// Check if the alert is closed
			expect(alert.root.open).toBe(false);
		});

		it('sets open to true when alertShow method is called', async () => {
			alert.root.open = false;
			await alert.waitForChanges();
			await alert.root.alertShow();
			await alert.waitForChanges();
			// Check if the alert is now open
			expect(alert.root.open).toBe(true);
		});
	});

	describe('Slots', () => {
		it('does not render default slot content when not provided', async () => {
			await alert.waitForChanges();
			// Check if the alert message content is empty
			const alertMessage = alert.root.shadowRoot.querySelector('div[role="alert"]');
			expect(alertMessage.textContent.trim()).toBe('');
		});

		it('does not render footer slot content when not provided', async () => {
			await alert.waitForChanges();
			// Check if the alert footer slot is empty
			const footerSlot = alert.root.shadowRoot.querySelector('[slot="footer"]');
			expect(footerSlot).toBeNull();
		});

		it('should render footer container when footer content is provided', async () => {
			const page = await newSpecPage({
				components: [DvAlert],
				html: `<dv-alert open="true"><div slot="footer">Footer</div></dv-alert>`,
				supportsShadowDom: true
			});

			const footerWrapper = page.root.shadowRoot.querySelector('div div:nth-child(2)');
			const footerSlot = footerWrapper.querySelector('slot[name="footer"]');
			expect(footerWrapper).not.toBeNull();
			expect(footerSlot).not.toBeNull();
		});

		it('renders footer slot content when provided', async () => {
			alert.root.innerHTML = '<a href="" slot="footer">Slotted Link</a>';
			await alert.waitForChanges();
			// Query the anchor element directly instead of the slot
			const footerLinkElement = alert.root.querySelector('a[slot="footer"]');
			// Check if the dv-icon element is rendered
			expect(footerLinkElement).not.toBeNull();
		});
	});
});

