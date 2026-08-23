import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import { DvAvatar } from './dv-avatar';

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-avatar', () => {
	let avatarSpec: TypedSpecPage<DvAvatar>;

	//Initialize a new instance for DvAvatar
	beforeEach(async () => {
		avatarSpec = (await newSpecPage({
			components: [DvAvatar],
			html: '<dv-avatar></dv-avatar>',
			supportsShadowDom: true
		})) as TypedSpecPage<DvAvatar>;
	});

	// Teardown instance and restore after each test case
	afterEach(() => {
		avatarSpec = null;
	});

	describe('Initialization with default state', () => {
		it('avatar renders with the default styling', async () => {
			await avatarSpec.waitForChanges();
			// Check default properties
			const wrapperDiv = avatarSpec.root.shadowRoot.querySelector('div');
			expect(wrapperDiv.className).toBe(
				'size-10 border-width-sm border-brand bg-brand text-brand-knockout label-default flex grow-0 shrink-0 items-center justify-center rounded-radius-full overflow-hidden'
			);
		});
	});

	describe('Props', () => {
		it('should display max two characters as initials', async () => {
			avatarSpec.root.initials = 'JDDV';
			await avatarSpec.waitForChanges();

			const initials = avatarSpec.root.shadowRoot.textContent?.trim();
			expect(initials).toHaveLength(2); // Should be exactly 2 characters
		});

		it('should capitalize initials', async () => {
			avatarSpec.root.initials = 'jd';
			await avatarSpec.waitForChanges();

			const initials = avatarSpec.root.shadowRoot.textContent?.trim();
			expect(initials).toBe('JD'); // Should be capitalized
		});

		it('should display only the first two alphabetical characters, ignoring spaces and special characters', async () => {
			avatarSpec.root.initials = '*J(D VD';
			await avatarSpec.waitForChanges();

			const initials = avatarSpec.root.shadowRoot.textContent?.trim();
			expect(initials).toBe('JD'); // Only "J" and "D" should be included
		});

		it('should display only 1 character for initials when size is sm', async () => {
			avatarSpec.root.size = 'sm';
			avatarSpec.root.initials = 'JD';
			await avatarSpec.waitForChanges();

			const initials = avatarSpec.root.shadowRoot.textContent?.trim();
			expect(initials).toBe('J'); // Should only show first character
		});

		it('should apply size-10 class for md size (default)', async () => {
			avatarSpec.root.size = 'md';
			await avatarSpec.waitForChanges();

			const wrapperDiv = avatarSpec.root.shadowRoot.querySelector('div');
			expect(wrapperDiv.className).toContain('size-10');
		});

		it('should apply size-8 class for sm size', async () => {
			avatarSpec.root.size = 'sm';
			await avatarSpec.waitForChanges();

			const wrapperDiv = avatarSpec.root.shadowRoot.querySelector('div');
			expect(wrapperDiv.className).toContain('size-8');
		});

		it('should reflect size attribute on host element', async () => {
			avatarSpec.root.size = 'sm';
			await avatarSpec.waitForChanges();

			expect(avatarSpec.root.getAttribute('size')).toBe('sm');
		});

		it('should render icon with md size by default', async () => {
			avatarSpec.root.size = 'md';
			await avatarSpec.waitForChanges();

			const icon = avatarSpec.root.shadowRoot.querySelector('dv-icon');
			expect(icon.getAttribute('size')).toBe('md');
		});

		it('should render icon with xs size when avatar is sm', async () => {
			avatarSpec.root.size = 'sm';
			await avatarSpec.waitForChanges();

			const icon = avatarSpec.root.shadowRoot.querySelector('dv-icon');
			expect(icon.getAttribute('size')).toBe('xs');
		});

		it('should apply knockout styling when knockout is true', async () => {
			avatarSpec.root.knockout = true;
			await avatarSpec.waitForChanges();

			const wrapperDiv = avatarSpec.root.shadowRoot.querySelector('div');
			expect(wrapperDiv.className).toContain('bg-brand-knockout');
			expect(wrapperDiv.className).toContain('text-brand');
		});

		it('should apply default brand styling when knockout is false', async () => {
			avatarSpec.root.knockout = false;
			await avatarSpec.waitForChanges();

			const wrapperDiv = avatarSpec.root.shadowRoot.querySelector('div');
			expect(wrapperDiv.className).toContain('border-brand');
			expect(wrapperDiv.className).toContain('bg-brand');
			expect(wrapperDiv.className).toContain('text-brand-knockout');
			expect(wrapperDiv.className).not.toContain('bg-brand-knockout');
		});

		it('should reflect knockout attribute on host element', async () => {
			avatarSpec.root.knockout = true;
			await avatarSpec.waitForChanges();

			expect(avatarSpec.root).toHaveAttribute('knockout');
		});

		it('should render img element when image prop is provided', async () => {
			avatarSpec.root.image = 'https://example.com/avatar.jpg';
			avatarSpec.root.label = 'User Avatar';
			await avatarSpec.waitForChanges();

			const img = avatarSpec.root.shadowRoot.querySelector('img');
			expect(img).toBeTruthy();
			expect(img.getAttribute('src')).toBe('https://example.com/avatar.jpg');
		});

		it('should apply object-cover and size classes to image', async () => {
			avatarSpec.root.image = 'https://example.com/avatar.jpg';
			avatarSpec.root.label = 'User Avatar';
			await avatarSpec.waitForChanges();

			const img = avatarSpec.root.shadowRoot.querySelector('img');
			expect(img.className).toContain('size-full');
			expect(img.className).toContain('object-cover');
			expect(img.className).toContain('rounded-radius-full');
		});

		it('should not apply styling classes when image is present', async () => {
			avatarSpec.root.image = 'https://example.com/avatar.jpg';
			avatarSpec.root.knockout = false;
			await avatarSpec.waitForChanges();

			const wrapperDiv = avatarSpec.root.shadowRoot.querySelector('div');
			// When image is present, styling classes should be empty, only size and flex classes
			expect(wrapperDiv.className).not.toContain('border-brand');
			expect(wrapperDiv.className).not.toContain('bg-brand');
		});

		it('should hide icon when image is provided', async () => {
			avatarSpec.root.image = 'https://example.com/avatar.jpg';
			avatarSpec.root.label = 'User Avatar';
			await avatarSpec.waitForChanges();

			const icon = avatarSpec.root.shadowRoot.querySelector('dv-icon');
			expect(icon).toBeFalsy();
		});

		it('should render initials when provided, even if image is also provided', async () => {
			avatarSpec.root.initials = 'JD';
			avatarSpec.root.image = 'https://example.com/avatar.jpg';
			avatarSpec.root.label = 'User Avatar';
			await avatarSpec.waitForChanges();

			const initials = avatarSpec.root.shadowRoot.textContent?.trim();
			expect(initials).toBe('JD');

			const img = avatarSpec.root.shadowRoot.querySelector('img');
			expect(img).toBeFalsy(); // Image should not render
		});

		it('should render image when no initials provided', async () => {
			avatarSpec.root.image = 'https://example.com/avatar.jpg';
			avatarSpec.root.label = 'User Avatar';
			await avatarSpec.waitForChanges();

			const img = avatarSpec.root.shadowRoot.querySelector('img');
			expect(img).toBeTruthy();
		});

		it('should render icon when neither initials nor image are provided', async () => {
			await avatarSpec.waitForChanges();

			const icon = avatarSpec.root.shadowRoot.querySelector('dv-icon');
			expect(icon).toBeTruthy();
		});
	});

	describe('Accessibility', () => {
		it('renders with the default icon and contains the required attributes', async () => {
			await avatarSpec.waitForChanges();

			const icon = avatarSpec.root.shadowRoot.querySelector('dv-icon');
			expect(icon).toHaveAttribute('name');
			expect(icon).toHaveAttribute('size');
		});

		it('renders icon when not given initials', async () => {
			await avatarSpec.waitForChanges();

			const icon = avatarSpec.root.shadowRoot.querySelector('dv-icon');
			expect(icon).toBeTruthy(); // Expect the icon to exist
		});

		it('should set the correct aria-label from the label prop', async () => {
			avatarSpec.root.label = 'Custom Label';
			await avatarSpec.waitForChanges();

			const avatarDiv = avatarSpec.root.shadowRoot.querySelector('div');
			expect(avatarDiv.getAttribute('aria-label')).toBe('Custom Label');
		});

		it('should set alt attribute from label prop on image', async () => {
			avatarSpec.root.image = 'https://example.com/avatar.jpg';
			avatarSpec.root.label = 'John Doe';
			await avatarSpec.waitForChanges();

			const img = avatarSpec.root.shadowRoot.querySelector('img');
			expect(img.getAttribute('alt')).toBe('John Doe');
		});
	});
});
