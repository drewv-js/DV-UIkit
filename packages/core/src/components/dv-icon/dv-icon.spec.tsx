import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvIcon } from './dv-icon';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-icon', () => {
	let icon: TypedSpecPage<DvIcon>;

	beforeEach(async () => {
		icon = (await newSpecPage({
			components: [DvIcon],
			html: '<dv-icon></dv-icon>',
			supportsShadowDom: false
		})) as TypedSpecPage<DvIcon>;
	});

	afterEach(() => {
		icon = null as unknown as TypedSpecPage<DvIcon>;
	});

	it('renders default wrapper with default size class', async () => {
		await icon.waitForChanges();
		const wrapper = icon.root?.querySelector('div');

		expect(wrapper).toBeTruthy();
		expect(wrapper?.classList.contains('size-4')).toBe(true);
	});

	it('applies semantic status class for success color', async () => {
		icon.root?.setAttribute('color', 'success');
		await icon.waitForChanges();

		const wrapper = icon.root?.querySelector('div');
		expect(wrapper?.classList.contains('text-status-success')).toBe(true);
	});

	it('renders svg markup for a valid icon name', async () => {
		if (!icon.root) return;
		icon.root.name = 'house';
		await icon.waitForChanges();

		const svg = icon.root.querySelector('svg');
		expect(svg).toBeTruthy();
	});

	it('updates size class', async () => {
		if (!icon.root) return;
		icon.root.size = 'xl';
		await icon.waitForChanges();

		const wrapper = icon.root.querySelector('div');
		expect(wrapper?.classList.contains('size-10')).toBe(true);
	});
});
