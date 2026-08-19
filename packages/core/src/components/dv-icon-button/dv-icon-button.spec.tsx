import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvIconButton } from './dv-icon-button';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-icon-button', () => {
	let button: TypedSpecPage<DvIconButton>;

	beforeEach(async () => {
		button = (await newSpecPage({
			components: [DvIconButton],
			html: `<dv-icon-button></dv-icon-button>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvIconButton>;
	});

	afterEach(() => {
		button = null;
	});

	describe('Initialization with default state', () => {
		it('renders with default properties', async () => {
			button.root.name = 'house';
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct class
			expect(buttonElement).toHaveClasses([
				'shadow-none',
				'p-2',
				'focus-visible:p-1',
				'focus-visible:m-1',
				'focus-visible:rounded-radius-md',
				'focus-visible:outline',
				'focus-visible:outline-width-lg',
				'focus:-outline-offset-2',
				'focus:outline-focus-ring-default',
				'focus-visible:ring-focus-ring-default'
			]);
			const buttonIconElement = button.root.shadowRoot.querySelector('dv-icon');
			// Check that the icon has the correct attribute value
			expect(buttonIconElement.getAttribute('name')).toBe('house');
		});
	});

	describe('Props', () => {
		it('renders with disabled classes when disabled', async () => {
			button.root.disabled = true;
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct class
			expect(buttonElement).toHaveClasses(['p-2', 'shadow-none', 'cursor-not-allowed']);
		});

		it('renders button as disabled and prevents click events', async () => {
			button.root.disabled = true;
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button is disabled
			expect(buttonElement).toHaveAttribute('disabled');
			// Check button's classes for disabled state
			expect(buttonElement).toHaveClass('cursor-not-allowed');
			// Simulate a click event
			const clickEvent = new MouseEvent('click', { bubbles: true });
			buttonElement.dispatchEvent(clickEvent);
			// Check if the click event is prevented
			expect(clickEvent.defaultPrevented).toBe(true);
		});

		it('renders with specified icon name', async () => {
			button.root.name = 'house';
			await button.waitForChanges();
			const iconElement = button.root.shadowRoot.querySelector('dv-icon');
			// Check that the icon has the correct attribute value
			expect(iconElement.getAttribute('name')).toBe('house');
		});

		it('renders with size md', async () => {
			button.root.size = 'md';
			await button.waitForChanges();
			// Check that the button has the correct size
			expect(button.root.getAttribute('size')).toBe('md');
		});

		it('renders with size lg', async () => {
			button.root.size = 'lg';
			await button.waitForChanges();
			// Check that the button has the correct size
			expect(button.root.getAttribute('size')).toBe('lg');
		});

		it('renders button with type prop set to "button"', async () => {
			button.root.type = 'button';
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct type attribute
			expect(buttonElement.getAttribute('type')).toBe('button');
		});

		it('renders button with type prop set to "submit"', async () => {
			button.root.type = 'submit';
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct type attribute
			expect(buttonElement.getAttribute('type')).toBe('submit');
		});

		it('renders button with type prop set to "reset"', async () => {
			button.root.type = 'reset';
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct type attribute
			expect(buttonElement.getAttribute('type')).toBe('reset');
		});
	});

	describe('Events', () => {
		it('calls form.requestSubmit() when submit button is clicked inside a form', async () => {
			await button.waitForChanges();
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			form.appendChild(button.root);
			document.body.appendChild(form);

			const buttonElement = button.root.shadowRoot.querySelector('button');
			buttonElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

			expect(form.requestSubmit).toHaveBeenCalledTimes(1);
			expect(form.requestSubmit).toHaveBeenCalledWith();
			form.remove();
		});

		it('does not call requestSubmit when type is button', async () => {
			button.root.type = 'button';
			await button.waitForChanges();
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			form.appendChild(button.root);

			const buttonElement = button.root.shadowRoot.querySelector('button');
			buttonElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

			expect(form.requestSubmit).not.toHaveBeenCalled();
			form.remove();
		});
	});

	describe('Accessibility', () => {
		it('should set aria-label attribute', async () => {
			button.root.label = 'House Icon Button';
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct aria-label attribute
			expect(buttonElement.getAttribute('aria-label')).toBe('House Icon Button');
		});
	});

	describe('Methods', () => {
		it('should call setFocus method to focus the button element', async () => {
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			const focusSpy = jest.spyOn(buttonElement, 'focus');

			await button.root.setFocus();

			expect(focusSpy).toHaveBeenCalled();
			focusSpy.mockRestore();
		});

		it('should handle setFocus gracefully when buttonEl is not yet available', async () => {
			// Access the internal state before render completes
			const instance = button.rootInstance as DvIconButton;
			// Temporarily set buttonEl to undefined to test defensive code
			const originalButtonEl = (instance as any).buttonEl;
			(instance as any).buttonEl = undefined;

			// Should not throw when buttonEl is undefined
			await expect(instance.setFocus()).resolves.not.toThrow();

			// Restore original buttonEl
			(instance as any).buttonEl = originalButtonEl;
		});
	});
});
