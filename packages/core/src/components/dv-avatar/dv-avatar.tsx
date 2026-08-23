import { Component, h, Host, Prop } from '@stencil/core';

/**
 * ## Overview
 * The Avatar component represents a user through initials or a default icon, providing a consistent visual identifier
 * throughout the application. It automatically handles the display of initials or falls back to a default user icon.
 *
 * Each avatar maintains a circular shape with proper text contrast and alignment, making it suitable for various UI contexts
 * like user profiles, comment sections, or team member lists.
 *
 * The component handles text processing automatically, extracting up to two initials from provided names and
 * converting them to uppercase for consistent display.
 *
 * The `<dv-avatar>` component supports the following display modes:
 * - **Initials**: Displays up to two uppercase letters for the default size, one letter for small, and includes knockout versions for both sizes
 * - **Icon**: Shows a default user icon when no initials are provided and includes knockout versions for both md/sm size
 * - **Image**: Displays a user-provided image when available for both md/sm sizes
 *
 * ## Accessibility
 * - Includes `aria-label` for screen reader support
 * - Provides meaningful text alternatives
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [dv-icon](/docs/components-icon--docs)
 *
 * ## Dependencies
 * | Component    | Purpose                                     |
 * |--------------|---------------------------------------------|
 * | `<dv-icon>`   | Default user icon when no initials provided |
 *
 * @summary A circular avatar that displays user initials or a default icon as a visual identifier.
 *
 * @tag dv-avatar
 */
@Component({
	tag: 'dv-avatar',
	styleUrl: 'dv-avatar.scss',
	shadow: true
})
export class DvAvatar {
	/** Optional initials (2 characters for default size, 1 for small size) */
	@Prop() initials?: string;

	/** Label for Accessibility purposes  */
	@Prop() label: string;

	/**
	 * The size of the avatar.
	 *
	 * @prop size
	 * @type {'sm' | 'md'}
	 * @default 'md'
	 * @since 0.14.0
	 */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/**
	 * Uses knockout (inverse) color styling.
	 *
	 * @prop knockout
	 * @type {boolean}
	 * @default false
	 * @since 0.14.0
	 */
	@Prop({ reflect: true }) knockout: boolean = false;

	/**
	 * URL of an image to display as the avatar.
	 *
	 * @prop image
	 * @type {string}
	 * @since 0.14.0
	 */
	@Prop() image?: string;

	/** Ensure only up to 2 alphabetic characters are used (1 for small size) */
	private get characters(): string | null {
		if (!this.initials) return null;
		const maxChars = this.size === 'sm' ? 1 : 2;
		return this.initials
			.replace(/[^a-zA-Z]/g, '')
			.toUpperCase()
			.slice(0, maxChars);
	}

	/** Returns the Tailwind size class based on the size prop */
	private get sizeClass(): string {
		switch (this.size) {
			case 'sm':
				return 'size-8';
			case 'md':
				return 'size-10';
		}
	}

	/** Returns the color classes based on the knockout prop */
	private get stylingClasses(): string {
		// Only return empty styling if we're actually rendering an image (no initials present)
		if (this.image && !this.characters) {
			return '';
		}
		return this.knockout
			? 'bg-brand-knockout text-brand label-default'
			: 'border-width-sm border-brand bg-brand text-brand-knockout label-default';
	}

	/** Returns the icon size based on the size prop */
	private get iconSize(): 'xs' | 'md' {
		return this.size === 'sm' ? 'xs' : 'md';
	}

	/** Renders the avatar content based on priority: initials → icon → image */
	private renderContent() {
		if (this.characters) {
			return this.characters;
		}
		if (!this.image) {
			return <dv-icon name="user" size={this.iconSize}></dv-icon>;
		}
		return <img src={this.image} alt={this.label} class="size-full rounded-radius-full object-cover" />;
	}

	/** @private */
	render() {
		return (
			<Host>
				<div
					class={`${this.sizeClass} ${this.stylingClasses} flex grow-0 shrink-0 items-center justify-center rounded-radius-full overflow-hidden`}
					aria-label={this.label}
				>
					{this.renderContent()}
				</div>
			</Host>
		);
	}
}
