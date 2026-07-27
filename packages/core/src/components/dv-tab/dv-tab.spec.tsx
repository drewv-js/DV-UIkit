import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvTab } from './dv-tab';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-tab', () => {
	let tabSpec: TypedSpecPage<DvTab>;

	// Initialize a new instance for DvTab
	beforeEach(async () => {
		tabSpec = (await newSpecPage({
			components: [DvTab],
			html: `<dv-tab></dv-tab>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvTab>;
	});

	// Teardown instance and restore after each test case
	afterEach(() => {
		tabSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should render with correct default structure', async () => {
			await tabSpec.waitForChanges();

			const wrapperDiv = tabSpec.root.shadowRoot.querySelector('div.relative');
			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]');

			expect(wrapperDiv).toBeTruthy();
			expect(tabElement).toBeTruthy();
			expect(wrapperDiv).toHaveClass('group');
		});

		it('should use generated component id when host element id is not provided', async () => {
			// Ensure no ID is set (default case)
			await tabSpec.waitForChanges();

			const wrapperDiv = tabSpec.root.shadowRoot.querySelector('div.relative');
			expect(wrapperDiv.id).toMatch(/^tab-\d+$/);
		});
	});

	describe('Props', () => {
		it('should render the tab with active styles when active prop is true', async () => {
			tabSpec.root.active = true;
			await tabSpec.waitForChanges();

			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]');
			expect(tabElement).toHaveClass('text-brand');
			expect(tabElement.getAttribute('aria-selected')).toBe('true');
		});

		it('should render the tab with disabled styles when disabled prop is true', async () => {
			tabSpec.root.disabled = true;
			await tabSpec.waitForChanges();

			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]');
			expect(tabElement).toHaveClass('cursor-not-allowed');
			expect(tabElement.getAttribute('aria-disabled')).toBe('true');
			expect(tabElement.getAttribute('tabindex')).toBe('-1');
		});

		it('should apply small size variant classes when size prop is set to sm', async () => {
			tabSpec.root.size = 'sm';
			await tabSpec.waitForChanges();

			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]');
			expect(tabElement).toHaveClass('py-1');
			expect(tabElement).toHaveClass('label-sm');
		});

		it('should apply medium size variant classes when size prop is set to md', async () => {
			tabSpec.root.size = 'md';
			await tabSpec.waitForChanges();

			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]');
			expect(tabElement).toHaveClass('py-2');
			expect(tabElement).toHaveClass('label-default');
		});
	});

	describe('Methods', () => {
		it('should call setFocus method and focus the tab element', async () => {
			await tabSpec.waitForChanges();
			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]') as HTMLElement;
			const focusSpy = jest.spyOn(tabElement, 'focus');

			await tabSpec.root.setFocus();

			expect(focusSpy).toHaveBeenCalled();
			focusSpy.mockRestore();
		});

		it('should call removeFocus method and blur the tab element', async () => {
			await tabSpec.waitForChanges();
			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]') as HTMLElement;
			const blurSpy = jest.spyOn(tabElement, 'blur');

			await tabSpec.root.removeFocus();

			expect(blurSpy).toHaveBeenCalled();
			blurSpy.mockRestore();
		});

		it('should handle setFocus gracefully when tab is not yet available', async () => {
			const originalTab = tabSpec.rootInstance.tab;
			tabSpec.rootInstance.tab = undefined;

			// Should not throw when tab is undefined
			await expect(tabSpec.rootInstance.setFocus()).resolves.not.toThrow();
			// Restore original tab
			tabSpec.rootInstance.tab = originalTab;
		});

		it('should handle removeFocus gracefully when tab is not yet available', async () => {
			const originalTab = tabSpec.rootInstance.tab;
			tabSpec.rootInstance.tab = undefined;

			// Should not throw when tab is undefined
			await expect(tabSpec.rootInstance.removeFocus()).resolves.not.toThrow();
			// Restore original tab
			tabSpec.rootInstance.tab = originalTab;
		});
	});

	describe('Slots', () => {
		it('should render slot content when provided', async () => {
			const slotContent = document.createElement('div');
			slotContent.className = 'testslot';
			slotContent.textContent = 'Tab Content';
			tabSpec.root.shadowRoot.querySelector('div[role="tab"]').appendChild(slotContent);
			await tabSpec.waitForChanges();
			// Query the tab element
			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]');
			expect(tabElement).not.toBeNull();
			// Check if the slot content is rendered
			const renderedContent = tabElement.querySelector('div.testslot');
			expect(renderedContent).not.toBeNull();
			expect(renderedContent.textContent).toBe('Tab Content');
		});

		it('should not render slot content when not provided', async () => {
			await tabSpec.waitForChanges();
			// Query the tab element
			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]');
			expect(tabElement).not.toBeNull();
			// Check if the slot content is not rendered
			const renderedContent = tabElement.querySelector('div');
			expect(renderedContent).toBeNull();
		});
	});

	describe('Accessibility', () => {
		it('should render the tab with the correct role and aria attributes', async () => {
			await tabSpec.waitForChanges();
			const tabElement = tabSpec.root.shadowRoot.querySelector('div[role="tab"]');
			expect(tabElement).toBeTruthy();
			expect(tabElement.getAttribute('aria-disabled')).toBe('false');
			expect(tabElement.getAttribute('aria-selected')).toBe('false');
		});
	});
});

