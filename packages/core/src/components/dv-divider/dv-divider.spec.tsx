import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvDivider } from './dv-divider';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-divider', () => {
	let dividerSpec: TypedSpecPage<DvDivider>;

	// Initialize a new instance for DvDivider
	beforeEach(async () => {
		dividerSpec = (await newSpecPage({
			components: [DvDivider],
			html: '<dv-divider></dv-divider>',
			supportsShadowDom: true
		})) as TypedSpecPage<DvDivider>;
	});

	// Teardown instance and restore after each test case
	afterEach(() => {
		dividerSpec = null;
	});

	describe('Initialization with default state', () => {
		it('defaults to horizontal variant', async () => {
			await dividerSpec.waitForChanges();

			expect(dividerSpec.root.variant).toBe('horizontal');

			const dividerDiv = dividerSpec.root.shadowRoot.querySelector('div');
			expect(dividerDiv).toHaveClass('w-full');
			expect(dividerDiv).toHaveClass('border-b-width-sm');
			expect(dividerDiv).toHaveClass('my-2');
		});
	});

	describe('Props', () => {
		it('changes to vertical when variant is set to vertical', async () => {
			dividerSpec.root.variant = 'vertical';
			await dividerSpec.waitForChanges();

			expect(dividerSpec.root.variant).toBe('vertical');

			const dividerDiv = dividerSpec.root.shadowRoot.querySelector('div');
			expect(dividerDiv).toHaveClass('h-full');
			expect(dividerDiv).toHaveClass('border-r-width-sm');
			expect(dividerDiv).toHaveClass('mx-2');
		});
	});
});

