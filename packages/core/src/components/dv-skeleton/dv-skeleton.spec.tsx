import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvSkeleton } from './dv-skeleton';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-skeleton', () => {
	let skeleton: TypedSpecPage<DvSkeleton>;

	beforeEach(async () => {
		skeleton = (await newSpecPage({
			components: [DvSkeleton],
			html: `<dv-skeleton></dv-skeleton>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvSkeleton>;
	});

	afterEach(() => {
		skeleton = null;
	});

	describe('Initialization with default state', () => {
		it('should create a component instance', () => {
			expect(new DvSkeleton()).toBeInstanceOf(DvSkeleton);
		});

		it('renders inside dv-card', async () => {
			skeleton.root.innerHTML = `<dv-card><dv-skeleton></dv-skeleton></dv-card>`;
			await skeleton.waitForChanges();

			const card = skeleton.root.querySelector('dv-card');
			expect(card).not.toBeNull();

			const innerSkeleton = card.querySelector('dv-skeleton');
			expect(innerSkeleton).not.toBeNull();
		});
	});
});

