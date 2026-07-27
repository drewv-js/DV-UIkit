import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvToggleGroupItem } from './dv-toggle-group-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-toggle-group-item', () => {
	let page: TypedSpecPage<DvToggleGroupItem>;

	beforeEach(async () => {
		page = (await newSpecPage({
			components: [DvToggleGroupItem],
			html: `<dv-toggle-group-item value="test" label="Test label"></dv-toggle-group-item>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvToggleGroupItem>;
	});

	afterEach(() => {
		page = null;
	});

	describe('Initialization with default state', () => {
		it('should render a button item', async () => {
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.getAttribute('role')).toBe('radio');
		});

		it('should apply md size classes by default', async () => {
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.className).toContain('label-default');
			expect(btn.className).toContain('py-1');
			expect(btn.className).toContain('px-2');
		});
	});

	describe('Props', () => {
		it('should reflect the value prop', async () => {
			await page.waitForChanges();
			expect(page.root.value).toBe('test');
		});

		it('should render the label as visible text', async () => {
			await page.waitForChanges();
			const span = page.root.shadowRoot.querySelector('span.truncate');
			expect(span.textContent).toBe('Test label');
		});

		it('should not render a label span when label is not set', async () => {
			const p = (await newSpecPage({
				components: [DvToggleGroupItem],
				html: `<dv-toggle-group-item value="icon-only"></dv-toggle-group-item>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvToggleGroupItem>;
			await p.waitForChanges();
			const span = p.root.shadowRoot.querySelector('span.truncate');
			expect(span).toBeNull();
		});

		it('should mark the item as active when active prop is true', async () => {
			await page.waitForChanges();
			page.root.active = true;
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.className).toContain('bg-button-knockout');
			expect(btn.className).toContain('text-button-knockout');
		});

		it('should reflect aria-checked false when inactive', async () => {
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-checked')).toBe('false');
		});

		it('should reflect aria-checked true when active', async () => {
			await page.waitForChanges();
			page.root.active = true;
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-checked')).toBe('true');
		});

		it('should apply sm size classes when size is sm', async () => {
			await page.waitForChanges();
			page.root.size = 'sm';
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.className).toContain('label-sm');
			expect(btn.className).toContain('py-1');
			expect(btn.className).toContain('px-2');
		});

		it('should reflect the size prop', async () => {
			await page.waitForChanges();
			page.root.size = 'sm';
			await page.waitForChanges();
			expect(page.root.size).toBe('sm');
		});
	});

	describe('Accessibility', () => {
		it('should set tabIndex to -1 by default', async () => {
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.tabIndex).toBe(-1);
		});

		it('should apply itemTabIndex to the button', async () => {
			await page.waitForChanges();
			page.root.itemTabIndex = 0;
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.tabIndex).toBe(0);
		});

		it('should change tabIndex when itemTabIndex changes', async () => {
			await page.waitForChanges();
			page.root.itemTabIndex = 0;
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.tabIndex).toBe(0);

			page.root.itemTabIndex = -1;
			await page.waitForChanges();
			expect(btn.tabIndex).toBe(-1);
		});

		it('should forward host aria-label to the button when no label is set', async () => {
			const p = (await newSpecPage({
				components: [DvToggleGroupItem],
				html: `<dv-toggle-group-item value="bar" aria-label="Bar chart"></dv-toggle-group-item>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvToggleGroupItem>;
			await p.waitForChanges();
			const btn = p.root.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-label')).toBe('Bar chart');
		});

		it('should not set aria-label on the button when a visible label is provided', async () => {
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-label')).toBeNull();
		});
	});

	describe('Methods', () => {
		it('should expose a setFocus method', async () => {
			await page.waitForChanges();
			expect(page.rootInstance.setFocus).toBeDefined();
		});

		it('should focus the button when setFocus is called', async () => {
			await page.waitForChanges();
			const btn = page.root.shadowRoot.querySelector('button');
			const focusSpy = jest.spyOn(btn, 'focus');

			await page.rootInstance.setFocus();
			expect(focusSpy).toHaveBeenCalled();
		});

		it('should not throw when setFocus is called before the button ref is set', async () => {
			await page.waitForChanges();
			(page.rootInstance as unknown as { buttonEl?: HTMLButtonElement }).buttonEl = undefined;

			await expect(page.rootInstance.setFocus()).resolves.toBeUndefined();
		});
	});
});

