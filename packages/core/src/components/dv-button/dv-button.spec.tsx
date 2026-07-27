import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvButton } from './dv-button';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}
describe('dv-button', () => {
	let button: TypedSpecPage<DvButton>;

	// Initialize a new instance for DvButton
	beforeEach(async () => {
		button = (await newSpecPage({
			components: [DvButton],
			html: `<dv-button></dv-button>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvButton>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		button = null;
	});

	describe('Initialization with default state', () => {
		it('should have default prop values', () => {
			// Use the existing button instance from beforeEach
			const instance = button.rootInstance;
			expect(instance.variant).toBe('primary');
			expect(instance.destructive).toBe(false);
			expect(instance.disabled).toBe(false);
			expect(instance.loading).toBe(false);
			expect(instance.isButtonGroup).toBe(false);
			expect(instance.fullWidth).toBe(false);
			expect(instance.type).toBe('submit');
			expect(instance.size).toBe('md');
		});
	});
	describe('Props', () => {
		it('should render button with primary variant', async () => {
			button.root.variant = 'primary';
			// Create slot content
			const slot = button.root.shadowRoot.querySelector('slot');
			slot.innerHTML = 'primary button';
			await button.waitForChanges();
			// Check component's properties
			expect(button.root.getAttribute('variant')).toBe('primary');
			// Query button in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check button's classes
			expect(buttonElement).toHaveClass('label-default');
			expect(buttonElement).toHaveClass('max-w-full');
			expect(buttonElement).toHaveClass('truncate');
			expect(buttonElement).toHaveClass('rounded-radius-lg');
			expect(buttonElement).toHaveClass('px-4');
			expect(buttonElement).toHaveClass('transition');
			expect(buttonElement).toHaveClass('focus:outline-width-lg');
			expect(buttonElement).toHaveClass('focus:outline-offset-0');
			expect(buttonElement).toHaveClass('focus-visible:outline');
			expect(buttonElement).toHaveClass('focus-visible:outline-width-lg');
			expect(buttonElement).toHaveClass('inline-flex');
			expect(buttonElement).toHaveClass('items-center');
			expect(buttonElement).toHaveClass('justify-center');
			expect(buttonElement).toHaveClass('shadow-sm');
			expect(buttonElement).toHaveClass('border');
			expect(buttonElement).toHaveClass('text-button-knockout');
			expect(buttonElement).toHaveClass('bg-button-knockout');
			expect(buttonElement).toHaveClass('hover:bg-button-knockout-hover');
			expect(buttonElement).toHaveClass('focus:outline-focus-ring-default');
			expect(buttonElement).toHaveClass('focus-visible:ring-focus-ring-default');
			// Check button's inner text
			expect(buttonElement.textContent.trim()).toBe('primary button');
		});

		it('should render button with secondary variant', async () => {
			button.root.variant = 'secondary';
			// Create slot content
			const slot = button.root.shadowRoot.querySelector('slot');
			slot.innerHTML = 'secondary button';
			await button.waitForChanges();
			// Check component's properties
			expect(button.root.getAttribute('variant')).toBe('secondary');
			// Query button in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check button's classes
			expect(buttonElement).toHaveClass('label-default');
			expect(buttonElement).toHaveClass('max-w-full');
			expect(buttonElement).toHaveClass('truncate');
			expect(buttonElement).toHaveClass('rounded-radius-lg');
			expect(buttonElement).toHaveClass('px-4');
			expect(buttonElement).toHaveClass('transition');
			expect(buttonElement).toHaveClass('focus:outline-width-lg');
			expect(buttonElement).toHaveClass('focus:outline-offset-0');
			expect(buttonElement).toHaveClass('focus-visible:outline');
			expect(buttonElement).toHaveClass('focus-visible:outline-width-lg');
			expect(buttonElement).toHaveClass('inline-flex');
			expect(buttonElement).toHaveClass('items-center');
			expect(buttonElement).toHaveClass('justify-center');
			expect(buttonElement).toHaveClass('shadow-sm');
			expect(buttonElement).toHaveClass('border');
			expect(buttonElement).toHaveClass('text-button-default');
			expect(buttonElement).toHaveClass('bg-button-default');
			expect(buttonElement).toHaveClass('hover:bg-button-default-hover');
			expect(buttonElement).toHaveClass('focus:outline-focus-ring-default');
			expect(buttonElement).toHaveClass('focus-visible:ring-focus-ring-default');
			// Check if the slot content is rendered
			expect(buttonElement.textContent.trim()).toBe('secondary button');
		});

		it('should render button with text variant', async () => {
			button.root.variant = 'text';
			await button.waitForChanges();
			// Create slot content
			const slot = button.root.shadowRoot.querySelector('slot');
			slot.innerHTML = 'text button';
			await button.waitForChanges();
			// Check component's properties
			expect(button.root.getAttribute('variant')).toBe('text');
			// Query the button in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check text's classes
			expect(buttonElement).toHaveClass('label-default');
			expect(buttonElement).toHaveClass('max-w-full');
			expect(buttonElement).toHaveClass('truncate');
			expect(buttonElement).toHaveClass('rounded-radius-lg');
			expect(buttonElement).toHaveClass('px-4');
			expect(buttonElement).toHaveClass('transition');
			expect(buttonElement).toHaveClass('focus:outline-width-lg');
			expect(buttonElement).toHaveClass('focus:outline-offset-0');
			expect(buttonElement).toHaveClass('focus-visible:outline');
			expect(buttonElement).toHaveClass('focus-visible:outline-width-lg');
			expect(buttonElement).toHaveClass('text-button-default');
			expect(buttonElement).toHaveClass('bg-button-default');
			expect(buttonElement).toHaveClass('hover:bg-button-default-hover');
			expect(buttonElement).toHaveClass('focus:outline-focus-ring-default');
			expect(buttonElement).toHaveClass('focus-visible:ring-focus-ring-default');
			// Check if the slot content is rendered
			expect(buttonElement.textContent.trim()).toBe('text button');
		});

		it('should render button loading state', async () => {
			button.root.loading = true;
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check button's classes for Tailwind pointer-events
			expect(buttonElement).toHaveClass('pointer-events-none');
			// Query the button span tag in the shadow DOM
			const spanElement = button.root.shadowRoot.querySelector('span.relative > span');
			// Check button's span tag s for Tailwind invisible
			expect(spanElement).toHaveClass('invisible');
		});

		it('should render button as disabled and prevent click events', async () => {
			button.root.disabled = true;
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button is disabled
			expect(buttonElement).toHaveAttribute('disabled');
		});

		it('should render primary variant button with disabled styles', async () => {
			button.root.disabled = true;
			button.root.variant = 'primary';
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check button's classes for disabled state
			expect(buttonElement).toHaveClass('bg-button-knockout-disabled');
			expect(buttonElement).toHaveClass('text-button-knockout-disabled');
			expect(buttonElement).toHaveClass('cursor-not-allowed');
		});

		it('should render secondary variant button with disabled styles', async () => {
			button.root.disabled = true;
			button.root.variant = 'secondary';
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button is disabled
			expect(buttonElement).toHaveAttribute('disabled');
			// Check button's classes for disabled state
			expect(buttonElement).toHaveClass('bg-button-default-disabled');
			expect(buttonElement).toHaveClass('text-button-default-disabled');
			expect(buttonElement).toHaveClass('border-button-default-disabled');
			expect(buttonElement).toHaveClass('cursor-not-allowed');
		});

		it('should render text variant button with disabled styles', async () => {
			button.root.disabled = true;
			button.root.variant = 'text';
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button is disabled
			expect(buttonElement).toHaveAttribute('disabled');
			// Check button's classes for disabled state
			expect(buttonElement).toHaveClass('text-button-default-disabled');
			expect(buttonElement).toHaveClass('cursor-not-allowed');
			expect(buttonElement).toHaveClass('block');
		});

		it('should render button with sm size styling', async () => {
			button.root.size = 'sm';
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			expect(buttonElement).toHaveClass('label-sm');
			expect(buttonElement).toHaveClass('py-1');
		});

		it('should render button with md size styling by default', async () => {
			button.root.size = 'md';
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			expect(buttonElement).toHaveClass('label-default');
			expect(buttonElement).toHaveClass('py-2');
		});

		it('should render small destructive primary button correctly', async () => {
			button.root.variant = 'primary';
			button.root.destructive = true;
			button.root.size = 'sm';
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			expect(buttonElement).toHaveClass('text-button-destructive-knockout');
			expect(buttonElement).toHaveClass('label-sm');
			expect(buttonElement).toHaveClass('py-1');
		});

		it('should render button with primary variant in destructive colors', async () => {
			button.root.variant = 'primary';
			button.root.destructive = true;
			// Create slot content
			const slot = button.root.shadowRoot.querySelector('slot');
			slot.innerHTML = 'primary button';
			await button.waitForChanges();
			// Check component's properties
			expect(button.root.getAttribute('variant')).toBe('primary');
			// Query button in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check button's classes
			expect(buttonElement).toHaveClass('text-button-destructive-knockout');
			expect(buttonElement).toHaveClass('bg-button-destructive-knockout');
			expect(buttonElement).toHaveClass('hover:bg-button-destructive-knockout-hover');
			expect(buttonElement).toHaveClass('focus:outline-focus-ring-destructive');
			expect(buttonElement).toHaveClass('focus-visible:ring-focus-ring-destructive');
			// Check button's inner text
			expect(buttonElement.textContent.trim()).toBe('primary button');
		});

		it('should render button with secondary variant in destructive colors', async () => {
			button.root.variant = 'secondary';
			button.root.destructive = true;
			// Create slot content
			const slot = button.root.shadowRoot.querySelector('slot');
			slot.innerHTML = 'secondary button';
			await button.waitForChanges();
			// Check component's properties
			expect(button.root.getAttribute('variant')).toBe('secondary');
			// Query button in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check button's classes
			expect(buttonElement).toHaveClass('text-button-destructive');
			expect(buttonElement).toHaveClass('bg-button-destructive-default');
			expect(buttonElement).toHaveClass('hover:bg-button-destructive-hover');
			expect(buttonElement).toHaveClass('focus:outline-focus-ring-destructive');
			expect(buttonElement).toHaveClass('focus-visible:ring-focus-ring-destructive');
			// Check if the slot content is rendered
			expect(buttonElement.textContent.trim()).toBe('secondary button');
		});

		it('should render button with text variant in destructive colors', async () => {
			button.root.variant = 'text';
			button.root.destructive = true;
			await button.waitForChanges();
			// Create slot content
			const slot = button.root.shadowRoot.querySelector('slot');
			slot.innerHTML = 'text button';
			await button.waitForChanges();
			// Check component's properties
			expect(button.root.getAttribute('variant')).toBe('text');
			// Query the button in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check text's classes
			expect(buttonElement).toHaveClass('text-button-destructive');
			expect(buttonElement).toHaveClass('bg-button-destructive-default');
			expect(buttonElement).toHaveClass('hover:bg-button-destructive-hover');
			expect(buttonElement).toHaveClass('focus:outline-focus-ring-destructive');
			expect(buttonElement).toHaveClass('focus-visible:ring-focus-ring-destructive');
			// Check if the slot content is rendered
			expect(buttonElement.textContent.trim()).toBe('text button');
		});

		it('should set is-button-group attribute when isButtonGroup is true', async () => {
			button.root.isButtonGroup = true;
			await button.waitForChanges();
			expect(button.root).toHaveAttribute('is-button-group');
		});

		it('should remove is-button-group attribute when isButtonGroup is false', async () => {
			button.root.isButtonGroup = true;
			await button.waitForChanges();
			button.root.isButtonGroup = false;
			await button.waitForChanges();
			expect(button.root).not.toHaveAttribute('is-button-group');
		});

		it('should render button group without additional classes when not first/last/inner', async () => {
			button.root.isButtonGroup = true;
			// Don't add any of the special classes
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Should not have any of the special border radius classes
			expect(buttonElement).not.toHaveClass('rounded-r-none');
			expect(buttonElement).not.toHaveClass('rounded-l-none');
			expect(buttonElement).not.toHaveClass('rounded-radius-none');
			expect(buttonElement).not.toHaveClass('-ml-1');
		});

		it('should render first button in group with correct classes', async () => {
			button.root.isButtonGroup = true;
			button.root.classList.add('first-button');
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			expect(buttonElement).toHaveClass('rounded-r-none');
		});

		it('should render inner button in group with correct classes', async () => {
			button.root.isButtonGroup = true;
			button.root.classList.add('inner-button');
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			expect(buttonElement).toHaveClass('rounded-radius-none');
			expect(buttonElement).toHaveClass('-ml-1');
		});

		it('should render last button in group with correct classes', async () => {
			button.root.isButtonGroup = true;
			button.root.classList.add('last-button');
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			expect(buttonElement).toHaveClass('rounded-l-none');
			expect(buttonElement).toHaveClass('-ml-1');
		});

		it('should render full width classes while fullWidth is true', async () => {
			button.root.fullWidth = true;
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			expect(buttonElement).toHaveClass('w-full');
			expect(buttonElement).toHaveClass('flex');
			expect(buttonElement).toHaveClass('justify-center');
		});

		it('should render button with destructive text variant without border classes', async () => {
			button.root.variant = 'text';
			button.root.destructive = true;
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// This tests the specific branch where destructive + text variant doesn't get border classes
			expect(buttonElement).not.toHaveClass('border-button-destructive');
		});

		it('should render button with truncate class when not loading', async () => {
			button.root.loading = false;
			await button.waitForChanges();
			const spanElement = button.root.shadowRoot.querySelector('span.relative > span');
			expect(spanElement).toHaveClass('truncate');
			expect(spanElement).not.toHaveClass('invisible');
		});

		it('should render text variant without border classes', async () => {
			button.root.variant = 'text';
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			expect(buttonElement).not.toHaveClass('border');
			expect(buttonElement).not.toHaveClass('shadow-sm');
			expect(buttonElement).not.toHaveClass('inline-flex');
		});

		it('should sync slotted icon sizes to sm when size is sm', async () => {
			const icon = document.createElement('dv-icon') as HTMLDvIconElement;
			icon.setAttribute('slot', 'startIcon');
			icon.setAttribute('name', 'plus');
			button.root.appendChild(icon);
			button.root.size = 'sm';
			await button.waitForChanges();
			button.rootInstance['syncIcons']();
			expect(icon.size).toBe('sm');
		});

		it('should sync slotted icon sizes to md when size is md', async () => {
			const icon = document.createElement('dv-icon') as HTMLDvIconElement;
			icon.setAttribute('slot', 'startIcon');
			icon.setAttribute('name', 'plus');
			button.root.appendChild(icon);
			button.root.size = 'md';
			await button.waitForChanges();
			button.rootInstance['syncIcons']();
			expect(icon.size).toBe('md');
		});

		it('should sync loading icon sizes to xs when size is sm', async () => {
			button.root.loading = true;
			button.root.size = 'sm';
			await button.waitForChanges();
			const loadingIcon = button.root.shadowRoot.querySelector('dv-icon');
			expect(loadingIcon.getAttribute('size')).toBe('xs');
		});

		it('should sync loading icon sizes to xs when size is md', async () => {
			button.root.loading = true;
			button.root.size = 'md';
			await button.waitForChanges();
			const loadingIcon = button.root.shadowRoot.querySelector('dv-icon');
			expect(loadingIcon.getAttribute('size')).toBe('xs');
		});
	});

	describe('Events', () => {
		it('should prevent click events when loading', async () => {
			button.root.loading = true;
			await button.waitForChanges();
			const buttonElement = button.root.shadowRoot.querySelector('button');
			const clickEvent = new MouseEvent('click', { bubbles: true });
			const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
			buttonElement.dispatchEvent(clickEvent);
			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it('should prevent click events while disabled', async () => {
			button.root.disabled = true;
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button is disabled
			expect(buttonElement).toHaveAttribute('disabled');
			const clickEvent = new MouseEvent('click', { bubbles: true });
			buttonElement.dispatchEvent(clickEvent);
			// Check if the click event is prevented
			expect(clickEvent.defaultPrevented).toBe(true);
		});
	});

	describe('Methods', () => {
		it('should call form.requestSubmit() when handleClick is called on enabled submit button', async () => {
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			form.appendChild(button.root);
			document.body.appendChild(form);

			const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() } as any;
			(button.rootInstance as any).handleClick(mockEvent);

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(form.requestSubmit).toHaveBeenCalledWith();

			form.remove();
		});

		it('should not call requestSubmit when type is button', async () => {
			button.root.type = 'button';
			await button.waitForChanges();
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			form.appendChild(button.root);

			const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() } as any;
			(button.rootInstance as any).handleClick(mockEvent);

			expect(form.requestSubmit).not.toHaveBeenCalled();
			form.remove();
		});

		it('should call form.reset() when type is reset', async () => {
			button.root.type = 'reset';
			await button.waitForChanges();
			const form = document.createElement('form');
			form.requestSubmit = jest.fn();
			form.reset = jest.fn();
			form.appendChild(button.root);

			const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() } as any;
			(button.rootInstance as any).handleClick(mockEvent);

			expect(form.reset).toHaveBeenCalled();
			expect(form.requestSubmit).not.toHaveBeenCalled();
			form.remove();
		});

		it('should trigger watchIsButtonGroup when isButtonGroup property changes', async () => {
			// Test the watcher method directly
			const watcherSpy = jest.spyOn(button.rootInstance, 'watchIsButtonGroup');

			// Trigger the watcher by calling it directly with true
			button.rootInstance.watchIsButtonGroup(true);
			expect(watcherSpy).toHaveBeenCalledWith(true);
			expect(button.root).toHaveAttribute('is-button-group');
			expect(button.root.getAttribute('is-button-group')).toBe('true');

			// Trigger the watcher by calling it directly with false
			button.rootInstance.watchIsButtonGroup(false);
			expect(watcherSpy).toHaveBeenCalledWith(false);
			expect(button.root).not.toHaveAttribute('is-button-group');

			watcherSpy.mockRestore();
		});

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
			const instance = button.rootInstance as DvButton;
			// Temporarily set buttonEl to undefined to test defensive code
			const originalButtonEl = (instance as any).buttonEl;
			(instance as any).buttonEl = undefined;

			// Should not throw when buttonEl is undefined
			await expect(instance.setFocus()).resolves.not.toThrow();

			// Restore original buttonEl
			(instance as any).buttonEl = originalButtonEl;
		});
	});

	describe('Slots', () => {
		it('should render startIcon slot when provided', async () => {
			button.root.variant = 'primary';
			await button.waitForChanges();
			// Create slot content
			const slotContent = document.createElement('dv-icon');
			slotContent.setAttribute('slot', 'startIcon');
			slotContent.setAttribute('name', 'plus');
			// Append the slot content
			button.root.shadowRoot.querySelector('span').appendChild(slotContent);
			await button.waitForChanges();
			// Query the icon content in the shadow DOM
			const slotElement = button.root.shadowRoot.querySelector('dv-icon');
			// Check if the icon content is rendered
			expect(slotElement).not.toBeNull();
		});

		it('should not render startIcon slot when not provided', async () => {
			button.root.variant = 'primary';
			await button.waitForChanges();
			// Query the icon content in the shadow DOM
			const slotElement = button.root.shadowRoot.querySelector('dv-icon');
			// Check if the icon content is not rendered
			expect(slotElement).toBeNull();
		});

		it('should render label slot when provided', async () => {
			button.root.variant = 'primary';
			await button.waitForChanges();
			// Create slot content
			const slot = button.root.shadowRoot.querySelector('slot');
			slot.innerHTML = 'label text';
			await button.waitForChanges();
			// Append the slot content
			button.root.shadowRoot.querySelector('span').appendChild(slot);
			await button.waitForChanges();
			// Query the button in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check if the label content is rendered
			expect(buttonElement.textContent.trim()).toBe('label text');
		});

		it('should not render label slot when not provided', async () => {
			button.root.variant = 'primary';
			await button.waitForChanges();
			// Query the button in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check if the label content is not rendered
			expect(buttonElement.textContent.trim()).toBe('');
		});

		it('should render endIcon slot when provided', async () => {
			button.root.variant = 'primary';
			await button.waitForChanges();
			// Create slot content
			const slotContent = document.createElement('dv-icon');
			slotContent.setAttribute('slot', 'endIcon');
			slotContent.setAttribute('name', 'plus');
			// Append the slot content
			button.root.shadowRoot.querySelector('span').appendChild(slotContent);
			await button.waitForChanges();
			// Query the icon content in the shadow DOM
			const slotElement = button.root.shadowRoot.querySelector('dv-icon');
			// Check if the icon content is rendered
			expect(slotElement).not.toBeNull();
		});

		it('should render both startIcon and endIcon slots when provided', async () => {
			button.root.variant = 'primary';
			await button.waitForChanges();
			// Create slot content
			const startIconSlotContent = document.createElement('dv-icon');
			startIconSlotContent.setAttribute('slot', 'endIcon');
			startIconSlotContent.setAttribute('name', 'plus');
			// Create slot content
			const endIconSlotContent = document.createElement('dv-icon');
			endIconSlotContent.setAttribute('slot', 'endIcon');
			endIconSlotContent.setAttribute('name', 'plus');
			// Append the slot content
			button.root.shadowRoot.querySelector('span').appendChild(startIconSlotContent);
			button.root.shadowRoot.querySelector('span').appendChild(endIconSlotContent);
			await button.waitForChanges();
			// Query the icon content in the shadow DOM
			const slotElements = button.root.shadowRoot.querySelectorAll('dv-icon');
			// Check if the icon content is rendered
			expect(slotElements.length).toBe(2);
		});
	});

	describe('Form handling', () => {
		it('should call form.requestSubmit() when submit button is clicked inside a form', async () => {
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

		it('should use internals.form when available (external form association)', async () => {
			const externalForm = document.createElement('form');
			externalForm.requestSubmit = jest.fn();
			document.body.appendChild(externalForm);

			(button.rootInstance as any).internals = { form: externalForm };

			const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() } as any;
			(button.rootInstance as any).handleClick(mockEvent);

			expect(externalForm.requestSubmit).toHaveBeenCalled();
			externalForm.remove();
		});

		it('should reflect form attribute on host', async () => {
			button.root.form = 'myForm';
			await button.waitForChanges();
			expect(button.root.getAttribute('form')).toBe('myForm');
		});

		it('should not render form attribute on host when form prop is not set', async () => {
			await button.waitForChanges();
			expect(button.root.hasAttribute('form')).toBe(false);
		});

		it('should render button with type prop set to "submit"', async () => {
			button.root.type = 'submit';
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct type attribute
			expect(buttonElement.getAttribute('type')).toBe('submit');
		});

		it('should render button with type prop set to "reset"', async () => {
			button.root.type = 'reset';
			await button.waitForChanges();
			// Query the button element in the shadow DOM
			const buttonElement = button.root.shadowRoot.querySelector('button');
			// Check that the button has the correct type attribute
			expect(buttonElement.getAttribute('type')).toBe('reset');
		});
	});

	describe('Accessibility', () => {
		it('should support focus via setFocus method', async () => {
			await button.waitForChanges();
			await button.rootInstance.setFocus();
			// Verify the button element reference exists
			expect(button.rootInstance['buttonEl']).toBeTruthy();
		});
	});
});

