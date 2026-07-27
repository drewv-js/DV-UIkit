import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvMenuLabel } from './dv-menu-label';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-menu-label', () => {
	let menuLabelSpec: TypedSpecPage<DvMenuLabel>;

	beforeEach(async () => {
		menuLabelSpec = (await newSpecPage({
			components: [DvMenuLabel],
			html: `<dv-menu-label></dv-menu-label>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvMenuLabel>;
	});

	afterEach(() => {
		menuLabelSpec = null;
	});

	describe('Initialization with default state', () => {
		it('should create a component instance', () => {
			expect(new DvMenuLabel()).toBeInstanceOf(DvMenuLabel);
		});

		it('renders menu-label with default styles', async () => {
			await menuLabelSpec.waitForChanges();

			const spanElement = menuLabelSpec.root.shadowRoot.querySelector('span');
			expect(spanElement).toHaveClasses(['inline-block', 'label-default', 'text-default', 'px-4', 'py-2']);
		});
	});
});

