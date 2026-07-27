import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvCarouselItem } from './dv-carousel-item';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-carousel-item', () => {
	let carouselItemSpec: TypedSpecPage<DvCarouselItem>;

	// Initialize a new instance for DvCarouselItem
	beforeEach(async () => {
		carouselItemSpec = (await newSpecPage({
			components: [DvCarouselItem],
			html: `<dv-carousel-item></dv-carousel-item>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvCarouselItem>;
	});

	// Teardown instance after each test case
	afterEach(() => {
		carouselItemSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should render the component', async () => {
			// Check that the component is rendered
			expect(carouselItemSpec.root).toBeTruthy();
		});

		it('should render the component with the correct classes', async () => {
			await carouselItemSpec.waitForChanges();
			const carouselItemContainer = carouselItemSpec.root.shadowRoot.querySelector('div');
			// Check that the container div is rendered with the correct classes
			expect(carouselItemContainer).toHaveClass('flex');
			expect(carouselItemContainer).toHaveClass('justify-center');
			expect(carouselItemContainer).toHaveClass('w-full');
			expect(carouselItemContainer).toHaveClass('max-h-full');
		});
	});
});

