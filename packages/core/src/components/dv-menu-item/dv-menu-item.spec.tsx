import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvMenuItem } from './dv-menu-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-menu-item', () => {
	let menuItemSpec: TypedSpecPage<DvMenuItem>;
	let menuItem: HTMLElement;

	beforeEach(async () => {
		menuItemSpec = (await newSpecPage({
			components: [DvMenuItem],
			html: `
          <dv-menu-item></dv-menu-item>
        `,
			supportsShadowDom: true
		})) as TypedSpecPage<DvMenuItem>;
		menuItem = menuItemSpec.root.shadowRoot.querySelector('[role="menuitem"]');
	});

	afterEach(() => {
		menuItem = null;
	});

	describe('Initialization with default state', () => {
		it('should render menu-item with default styles and attributes', async () => {
			await menuItemSpec.waitForChanges();

			expect(menuItem.getAttribute('aria-disabled')).toBe('false');
			expect(menuItem).toHaveClass('relative');
			expect(menuItem).toHaveClass('body-default');
			expect(menuItem).toHaveClass('px-4');
			expect(menuItem).toHaveClass('py-1');

			// text-default is applied to the inner content div
			const contentDiv = menuItem.querySelector('.flex');
			expect(contentDiv).toHaveClass('text-default');
		});
	});

	describe('Props', () => {
		it('should render menu-item as disabled when disabled prop is true', async () => {
			menuItemSpec.root.disabled = true;
			await menuItemSpec.waitForChanges();

			// Check component's properties
			expect(menuItemSpec.root.disabled).toBe(true);
			expect(menuItem.getAttribute('aria-disabled')).toBe('true');
			expect(menuItem).toHaveClass('outline-none');
			expect(menuItem).toHaveClass('cursor-not-allowed');
			expect(menuItem).toHaveClass('text-disabled');
		});
	});

	describe('Events', () => {
		it('should remain aria-disabled when disabled and clicked', async () => {
			const handleClickSpy = jest.fn();
			menuItemSpec.root.disabled = true;
			menuItemSpec.root.addEventListener('click', handleClickSpy);
			await menuItemSpec.waitForChanges();

			// Simulate a click event
			menuItem.click();

			expect(menuItem.getAttribute('aria-disabled')).toBe('true');
		});
	});

	describe('Methods', () => {
		it('should call setFocus method and focus the menu item element', async () => {
			await menuItemSpec.waitForChanges();
			const focusSpy = jest.spyOn(menuItem, 'focus');

			await menuItemSpec.root.setFocus();

			expect(focusSpy).toHaveBeenCalled();
			focusSpy.mockRestore();
		});
	});

	describe('Slots', () => {
		it('should render content in default slot', async () => {
			await menuItemSpec.waitForChanges();
			// Create slot content
			const slotContent = document.createElement('div');
			slotContent.textContent = 'slot content';
			menuItemSpec.root.shadowRoot.querySelector('slot').appendChild(slotContent);
			await menuItemSpec.waitForChanges();
			// Check if the slot content is rendered correctly
			const slot = menuItemSpec.root.shadowRoot.querySelector('slot');
			expect(slot).not.toBeNull();
			expect(slot.textContent).toBe('slot content');
		});

		it('should render startIcon slot when provided', async () => {
			const page = await newSpecPage({
				components: [DvMenuItem],
				html: `<dv-menu-item><dv-icon slot="startIcon" name="search"></dv-icon></dv-menu-item>`,
				supportsShadowDom: true
			});

			const startIcon = page.root.shadowRoot.querySelector('slot[name="startIcon"]');
			expect(startIcon).not.toBeNull();
		});

		it('should not render startIcon slot when not provided', async () => {
			await menuItemSpec.waitForChanges();
			// Query the startIcon slot in the shadow DOM
			const startIconSlot = menuItemSpec.root.shadowRoot.querySelector('slot[name="startIcon"]');
			// Check if the startIcon slot is not rendered
			expect(startIconSlot).toBeNull();
		});

		it('should render endIcon slot when provided', async () => {
			const page = await newSpecPage({
				components: [DvMenuItem],
				html: `<dv-menu-item><dv-icon slot="endIcon" name="search"></dv-icon></dv-menu-item>`,
				supportsShadowDom: true
			});

			const endIconContainer = page.root.shadowRoot.querySelector('div div div');
			expect(endIconContainer).not.toBeNull();
		});

		it('should not render endIcon slot when not provided', async () => {
			await menuItemSpec.waitForChanges();
			// Query the endIcon slot in the shadow DOM
			const endIconSlot = menuItemSpec.root.shadowRoot.querySelector('slot[name="endIcon"]');
			// Check if the endIcon slot is not rendered
			expect(endIconSlot).toBeNull();
		});
	});

	describe('href prop', () => {
		it('should render an anchor tag when href is provided', async () => {
			const page = await newSpecPage({
				components: [DvMenuItem],
				html: `<dv-menu-item href="/test">Link Item</dv-menu-item>`,
				supportsShadowDom: true
			});

			const anchor = page.root.shadowRoot.querySelector('a');
			expect(anchor).not.toBeNull();
			expect(anchor.getAttribute('href')).toBe('/test');
			expect(anchor).toHaveClass('contents');
		});

		it('should render a div instead of anchor when href is provided but disabled', async () => {
			const page = await newSpecPage({
				components: [DvMenuItem],
				html: `<dv-menu-item href="/test" disabled>Disabled Link</dv-menu-item>`,
				supportsShadowDom: true
			});

			const anchor = page.root.shadowRoot.querySelector('a');
			expect(anchor).toBeNull();

			const menuItemDiv = page.root.shadowRoot.querySelector('[role="menuitem"]');
			const innerDiv = menuItemDiv.querySelector('div.contents');
			expect(innerDiv).not.toBeNull();
		});

		it('should render a div when no href is provided', async () => {
			await menuItemSpec.waitForChanges();
			const anchor = menuItemSpec.root.shadowRoot.querySelector('a');
			expect(anchor).toBeNull();
		});

		it('should not apply text-default class to inner content when disabled', async () => {
			menuItemSpec.root.disabled = true;
			await menuItemSpec.waitForChanges();

			const contentDiv = menuItem.querySelector('.flex');
			expect(contentDiv).not.toHaveClass('text-default');
		});
	});

	describe('value prop', () => {
		it('should accept a value prop', async () => {
			const page = await newSpecPage({
				components: [DvMenuItem],
				html: `<dv-menu-item value="my-value">Item</dv-menu-item>`,
				supportsShadowDom: true
			});

			expect(page.rootInstance.value).toBe('my-value');
		});
	});

	describe('index prop', () => {
		it('should reflect tabIndex from index prop', async () => {
			menuItemSpec.root.index = 0;
			await menuItemSpec.waitForChanges();

			expect(menuItem.getAttribute('tabindex')).toBe('0');
		});

		it('should default tabIndex to -1', async () => {
			await menuItemSpec.waitForChanges();
			expect(menuItem.getAttribute('tabindex')).toBe('-1');
		});
	});

	describe('icon size enforcement', () => {
		it('should enforce xs size on slotted dv-icon in startIcon slot', async () => {
			const page = await newSpecPage({
				components: [DvMenuItem],
				html: `<dv-menu-item><dv-icon slot="startIcon" name="search" size="md"></dv-icon>Item</dv-menu-item>`,
				supportsShadowDom: true
			});

			const icon = page.root.querySelector('[slot="startIcon"]');
			expect((icon as any).size).toBe('xs');
		});

		it('should enforce xs size on slotted dv-icon in endIcon slot', async () => {
			const page = await newSpecPage({
				components: [DvMenuItem],
				html: `<dv-menu-item>Item<dv-icon slot="endIcon" name="search" size="lg"></dv-icon></dv-menu-item>`,
				supportsShadowDom: true
			});

			const icon = page.root.querySelector('[slot="endIcon"]');
			expect((icon as any).size).toBe('xs');
		});

		it('should not modify size on non-dv-icon elements in icon slots', async () => {
			const page = await newSpecPage({
				components: [DvMenuItem],
				html: `<dv-menu-item><span slot="startIcon" class="custom-icon">★</span>Item</dv-menu-item>`,
				supportsShadowDom: true
			});

			const icon = page.root.querySelector('[slot="startIcon"]');
			expect((icon as any).size).toBeUndefined();
		});
	});
});

