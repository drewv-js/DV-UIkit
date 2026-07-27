import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvTabControl } from './dv-tab-control';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-tab-control', () => {
	let button: TypedSpecPage<DvTabControl>;

	beforeEach(async () => {
		button = (await newSpecPage({
			components: [DvTabControl],
			html: `<dv-tab-control></dv-tab-control>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvTabControl>;
	});

	afterEach(() => {
		button = null;
	});

	describe('Initialization with default state', () => {
		it('renders with default properties', async () => {
			button.root.name = 'chevron-right';
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct classes
			expect(buttonElement).toHaveClasses([
				'p-2',
				'text-default',
				'bg-default',
				'rounded-full',
				'shadow-sm-bottom',
				'shadow-none',
				'hover:bg-default-hover',
				'focus-visible:outline',
				'focus-visible:outline-width-lg',
				'focus:-outline-offset-2',
				'focus:outline-focus-ring-default',
				'focus-visible:ring-focus-ring-default'
			]);
			const buttonIconElement = button.root.shadowRoot.querySelector('dv-icon');
			// Check that the icon has the correct attribute value
			expect(buttonIconElement.getAttribute('name')).toBe('chevron-right');
		});
	});

	describe('Props', () => {
		it('renders with specified icon name', async () => {
			button.root.name = 'chevron-left';
			await button.waitForChanges();
			const iconElement = button.root.shadowRoot.querySelector('dv-icon');
			// Check that the icon has the correct attribute value
			expect(iconElement.getAttribute('name')).toBe('chevron-left');
		});

		it('renders with size sm', async () => {
			button.root.size = 'sm';
			await button.waitForChanges();
			// Check that the button has the correct size
			expect(button.root.getAttribute('size')).toBe('sm');
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

		it('renders button with type="button"', async () => {
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct type attribute
			expect(buttonElement.getAttribute('type')).toBe('button');
		});
	});

	describe('Accessibility', () => {
		it('should set aria-label attribute', async () => {
			button.root.label = 'Scroll right arrow';
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct aria-label attribute
			expect(buttonElement.getAttribute('aria-label')).toBe('Scroll right arrow');
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
			const instance = button.rootInstance as DvTabControl;
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

