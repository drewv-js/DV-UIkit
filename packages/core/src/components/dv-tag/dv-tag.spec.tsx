import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvTag } from './dv-tag';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-tag', () => {
	let tag: TypedSpecPage<DvTag>;

	// Initialize a new instance for DvTag
	beforeEach(async () => {
		tag = (await newSpecPage({
			components: [DvTag],
			html: `<dv-tag></dv-tag>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvTag>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		tag = null;
	});

	describe('Initialization with default state', () => {
		it('renders the component with the correct default classes', async () => {
			await tag.waitForChanges();
			const wrapperDiv = tag.root.shadowRoot.querySelector('div');

			expect(wrapperDiv).toHaveClass('inline-flex');
			expect(wrapperDiv).toHaveClass('items-center');
			expect(wrapperDiv).toHaveClass('justify-center');
			expect(wrapperDiv).toHaveClass('label-sm');
			expect(wrapperDiv).toHaveClass('rounded-radius-full');
			expect(wrapperDiv).toHaveClass('px-2');
			expect(wrapperDiv).toHaveClass('py-1');
			expect(wrapperDiv).toHaveClass('max-w-full');
			expect(wrapperDiv).toHaveClass('truncate');
			expect(wrapperDiv).toHaveClass('border-width-sm');
		});

		it('renders span for content with the default styling', async () => {
			await tag.waitForChanges();
			const span = tag.root.shadowRoot.querySelector('span');
			expect(span).toHaveClass('truncate');
		});

		it('renders the start icon when the startIcon slot is applied', async () => {
			const startIcon = document.createElement('span');
			startIcon.setAttribute('slot', 'startIcon');
			startIcon.textContent = 'Icon';
			tag.root.appendChild(startIcon);
			await tag.waitForChanges();
			const renderedIcon = tag.root.shadowRoot.querySelector('slot[name="startIcon"]');
			expect(renderedIcon).not.toBeNull();
		});
	});

	describe('Props', () => {
		it('renders with the default status color by default', async () => {
			await tag.waitForChanges();
			const div = tag.root.shadowRoot.querySelector('div');
			expect(div).toHaveClass('text-status-neutral');
			expect(div).toHaveClass('border-status-neutral');
			expect(div).toHaveClass('bg-status-neutral');
		});

		it('renders the component with the success color class when the color prop is applied', async () => {
			tag.root.color = 'success';
			await tag.waitForChanges();
			const div = tag.root.shadowRoot.querySelector('div');
			expect(div).toHaveClass('text-status-success');
			expect(div).toHaveClass('border-status-success');
			expect(div).toHaveClass('bg-status-success');
		});

		it('renders the component with the warning color class when the color prop is applied', async () => {
			tag.root.color = 'warning';
			await tag.waitForChanges();
			const div = tag.root.shadowRoot.querySelector('div');
			expect(div).toHaveClass('text-status-warning');
			expect(div).toHaveClass('border-status-warning');
			expect(div).toHaveClass('bg-status-warning');
		});

		it('renders the component with the error color class when the color prop is applied', async () => {
			tag.root.color = 'error';
			await tag.waitForChanges();
			const div = tag.root.shadowRoot.querySelector('div');
			expect(div).toHaveClass('text-status-error');
			expect(div).toHaveClass('border-status-error');
			expect(div).toHaveClass('bg-status-error');
		});

		it('fallback to default color for invalid color value', async () => {
			tag.root.color = 'invalid' as any;
			await tag.waitForChanges();
			const div = tag.root.shadowRoot.querySelector('div');
			expect(div).toHaveClass('text-status-neutral');
			expect(div).toHaveClass('border-status-neutral');
			expect(div).toHaveClass('bg-status-neutral');
		});

		it('initializes dismissible prop as false', async () => {
			await tag.waitForChanges();
			expect(tag.root.dismissible).toBe(false);
		});

		it('updates dismissible prop dynamically', async () => {
			tag.root.dismissible = false;
			await tag.waitForChanges();
			expect(tag.root.shadowRoot.querySelector('dv-icon-button')).toBeNull();
			tag.root.dismissible = true;
			await tag.waitForChanges();
			expect(tag.root.shadowRoot.querySelector('dv-icon-button')).not.toBeNull();
		});

		it('supports deprecated closable prop', async () => {
			tag.root.closable = true;
			await tag.waitForChanges();
			expect(tag.root.shadowRoot.querySelector('dv-icon-button')).not.toBeNull();
		});

		it('updates color prop dynamically', async () => {
			tag.root.color = 'success';
			await tag.waitForChanges();
			let div = tag.root.shadowRoot.querySelector('div');
			expect(div).toHaveClass('text-status-success');
			tag.root.color = 'error';
			await tag.waitForChanges();
			div = tag.root.shadowRoot.querySelector('div');
			expect(div).toHaveClass('text-status-error');
		});

		it('renders the close button when dismissible is true', async () => {
			tag.root.dismissible = true;
			await tag.waitForChanges();
			const closeButton = tag.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
			expect(closeButton.getAttribute('color')).toBe('neutral');
		});

		it('renders the close button in the correct color when dismissible is true', async () => {
			tag.root.dismissible = true;
			tag.root.color = 'warning';
			await tag.waitForChanges();
			const closeButton = tag.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).not.toBeNull();
			expect(closeButton.getAttribute('color')).toBe('warning');
		});

		it('removes the component from the DOM when the close button is clicked', async () => {
			tag.root.dismissible = true;
			await tag.waitForChanges();
			const closeButton = tag.root.shadowRoot.querySelector('dv-icon-button');
			const spy = jest.spyOn(tag.root, 'remove');
			closeButton.click();
			await tag.waitForChanges();
			expect(spy).toHaveBeenCalled();
		});

		it('emits dismiss event when close button is clicked', async () => {
			tag.root.dismissible = true;
			await tag.waitForChanges();
			const dismissListener = jest.fn();
			tag.root.addEventListener('dismiss', dismissListener);
			const closeButton = tag.root.shadowRoot.querySelector('dv-icon-button');
			closeButton.click();
			await tag.waitForChanges();
			expect(dismissListener).toHaveBeenCalled();
		});

		it('has correct close button name attribute', async () => {
			tag.root.dismissible = true;
			await tag.waitForChanges();
			const closeButton = tag.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton.getAttribute('name')).toBe('circle-xmark');
		});

		it('applies correct classes to close button', async () => {
			tag.root.dismissible = true;
			await tag.waitForChanges();
			const closeButton = tag.root.shadowRoot.querySelector('dv-icon-button');
			expect(closeButton).toHaveClass('absolute');
			expect(closeButton).toHaveClass('right-0');
		});

		it('adds margin class to inner div when dismissible is true', async () => {
			tag.root.dismissible = true;
			await tag.waitForChanges();
			const innerDiv = tag.root.shadowRoot.querySelector('div.flex');
			expect(innerDiv).toHaveClass('mr-5');
		});

		it('removes margin class from inner div when dismissible is false', async () => {
			tag.root.dismissible = false;
			await tag.waitForChanges();
			const innerDiv = tag.root.shadowRoot.querySelector('div.flex');
			expect(innerDiv).not.toHaveClass('mr-4');
		});
	});

	describe('Events', () => {
		it('emits click event when tag is clicked', async () => {
			await tag.waitForChanges();
			const clickListener = jest.fn();
			tag.root.addEventListener('click', clickListener);
			const div = tag.root.shadowRoot.querySelector('div.inline-flex');
			div.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await tag.waitForChanges();
			expect(clickListener).toHaveBeenCalled();
		});

		it('prevents default behavior on tag click', async () => {
			await tag.waitForChanges();
			const event = new MouseEvent('click', { bubbles: true, cancelable: true });
			const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
			const div = tag.root.shadowRoot.querySelector('div.inline-flex');
			div.dispatchEvent(event);
			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it('stops propagation on close button click', async () => {
			tag.root.dismissible = true;
			await tag.waitForChanges();
			const event = new MouseEvent('click', { bubbles: true, cancelable: true });
			const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
			const closeButton = tag.root.shadowRoot.querySelector('dv-icon-button');
			closeButton.dispatchEvent(event);
			expect(stopPropagationSpy).toHaveBeenCalled();
		});
	});

	describe('Slots', () => {
		it('renders the text in the general slot', async () => {
			const slot = tag.root.shadowRoot.querySelector('slot');
			slot.innerHTML = 'default tag';
			await tag.waitForChanges();
			const tagElement = tag.root.shadowRoot.querySelector('slot');
			expect(tagElement.textContent.trim()).toBe('default tag');
		});

		it('renders empty tag without slot content', async () => {
			await tag.waitForChanges();
			const slot = tag.root.shadowRoot.querySelector('slot:not([name])');
			expect(slot).not.toBeNull();
			expect(slot.textContent).toBe('');
		});
	});
});

