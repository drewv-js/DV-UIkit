import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvToggleGroup } from './dv-toggle-group';
import { DvToggleGroupItem } from '../dv-toggle-group-item/dv-toggle-group-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

type ItemEl = HTMLElement & DvToggleGroupItem;

const defaultHtml = `
	<dv-toggle-group value="a" label="Test group">
		<dv-toggle-group-item value="a" label="Option A"></dv-toggle-group-item>
		<dv-toggle-group-item value="b" label="Option B"></dv-toggle-group-item>
		<dv-toggle-group-item value="c" label="Option C"></dv-toggle-group-item>
	</dv-toggle-group>
`;

describe('dv-toggle-group', () => {
	let page: TypedSpecPage<DvToggleGroup>;

	beforeEach(async () => {
		page = (await newSpecPage({
			components: [DvToggleGroup, DvToggleGroupItem],
			html: defaultHtml,
			supportsShadowDom: true
		})) as TypedSpecPage<DvToggleGroup>;
	});

	afterEach(() => {
		page = null;
	});

	describe('Initialization with default state', () => {
		it('should render as radiogroup container', async () => {
			await page.waitForChanges();
			const div = page.root.shadowRoot.querySelector('div');
			expect(div.getAttribute('role')).toBe('radiogroup');
		});

		it('should apply the aria-label to the group', async () => {
			await page.waitForChanges();
			const div = page.root.shadowRoot.querySelector('div');
			expect(div.getAttribute('aria-label')).toBe('Test group');
		});

		it('should render with md size by default', async () => {
			await page.waitForChanges();
			expect(page.root.size).toBe('md');
		});
	});

	describe('Props', () => {
		it('should propagate size to all items', async () => {
			await page.waitForChanges();
			page.root.size = 'sm';
			await page.waitForChanges();

			const items = Array.from(page.root.querySelectorAll('dv-toggle-group-item')) as unknown as ItemEl[];
			items.forEach((item) => expect(item.size).toBe('sm'));
		});

		it('should mark the item matching value as active', async () => {
			await page.waitForChanges();
			const items = Array.from(page.root.querySelectorAll('dv-toggle-group-item')) as unknown as ItemEl[];
			expect(items[0].active).toBe(true);
			expect(items[1].active).toBe(false);
			expect(items[2].active).toBe(false);
		});

		it('should update the active item when value changes', async () => {
			await page.waitForChanges();
			page.root.value = 'b';
			await page.waitForChanges();

			const items = Array.from(page.root.querySelectorAll('dv-toggle-group-item')) as unknown as ItemEl[];
			expect(items[0].active).toBe(false);
			expect(items[1].active).toBe(true);
		});

		it('should leave no item active when value does not match any item', async () => {
			await page.waitForChanges();
			page.root.value = 'z';
			await page.waitForChanges();

			const items = Array.from(page.root.querySelectorAll('dv-toggle-group-item')) as unknown as ItemEl[];
			items.forEach((item) => expect(item.active).toBe(false));
		});
	});

	describe('Accessibility', () => {
		it('should give the active item tabIndex 0', async () => {
			await page.waitForChanges();
			const items = Array.from(page.root.querySelectorAll('dv-toggle-group-item')) as unknown as ItemEl[];
			expect(items[0].itemTabIndex).toBe(0);
			expect(items[1].itemTabIndex).toBe(-1);
			expect(items[2].itemTabIndex).toBe(-1);
		});

		it('should give the first item tabIndex 0 when no value is set', async () => {
			await page.waitForChanges();
			const items = Array.from(page.root.querySelectorAll('dv-toggle-group-item')) as HTMLDvToggleGroupItemElement[];
			expect(items[0].itemTabIndex).toBe(0);
			expect(items[1].itemTabIndex).toBe(-1);
		});
	});

	describe('Slot', () => {
		it('should re-sync items when the slot fires slotchange', async () => {
			await page.waitForChanges();
			const syncSpy = jest.spyOn(page.rootInstance as unknown as { syncItems: () => void }, 'syncItems');

			const slot = page.root.shadowRoot.querySelector('slot');
			slot.dispatchEvent(new Event('slotchange'));
			await page.waitForChanges();

			expect(syncSpy).toHaveBeenCalled();
		});
	});
});

