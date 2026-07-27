import { Component, Element, Host, h, Prop, Method, State } from '@stencil/core';
import type { IconName } from '../../icon-name.generated';
import type { getColorGroups } from '../../internal/color';

/**
 * ## Overview
 * The Icon Button component combines the functionality of a button with a single icon display. It provides a compact,
 * icon-based interaction pattern for actions and toolbars while maintaining proper accessibility and form integration.
 *
 * The component builds upon native button behavior while adding support for icon display and consistent styling across
 * different sizes and states.
 *
 * Icon buttons provide clear touch targets and visual feedback states while maintaining proper accessibility
 * through required labeling.
 *
 * The `<dv-icon-button>` component supports these display patterns:
 * - **Size Variants**: Five size options (xs, sm, md, lg, xl)
 * - **Interactive States**: Hover, focus, active, and disabled
 * - **Color Customization**: Optional color override
 * - **Form Integration**: Native form submission support
 * - **Icon Display**: Centered icon with proper spacing
 *
 * ## Accessibility
 * - Uses native `<button>` element
 * - Requires `label` prop for screen readers
 * - Maintains focus visibility
 * - Proper disabled state handling
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
 * - [dv-icon](/docs/components-icon--docs)
 *
 * ## Dependencies
 * | Component   | Purpose                            |
 * |-------------|------------------------------------|
 * | `<dv-icon>`  | Renders the icon within the button |
 *
 * @summary A compact icon-only button with size variants, optional color, and accessible labeling.
 *
 * @tag dv-icon-button
 */
@Component({
	tag: 'dv-icon-button',
	styleUrl: 'dv-icon-button.scss',
	shadow: { delegatesFocus: true },
	formAssociated: true
})
export class DvIconButton {
	/** @internal */
	@Element() host!: HTMLDvIconButtonElement;

	private internals: ElementInternals | null = null;

	/** Indicates whether the button is disabled, preventing user interaction. */
	@Prop({ reflect: true }) disabled?: boolean = false;

	/** The name of the icon to be rendered. */
	@Prop({ reflect: true }) name?: IconName;

	/** The size of the icon, can be 'xs, 'sm', 'md', 'lg', 'xl'. */
	@Prop({ reflect: true }) size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'xs';

	/** A description that gets read by assistive devices. */
	@Prop({ reflect: true }) label?: string = '';

	/** Optional color for the icon, can be 'success', 'info', 'neutral', 'warning', 'error'. If not provided, inherits parent color. */
	@Prop({ reflect: true, mutable: true }) color?: keyof ReturnType<typeof getColorGroups>;

	/** The type of the button, can be "button", "submit", "reset". */
	@Prop() type: 'button' | 'submit' | 'reset' = 'submit';

	/** @internal */
	@State() currentColor: string;

	/** Reference to the internal button element */
	private buttonEl: HTMLButtonElement;

	constructor() {
		try {
			if (typeof this.host.attachInternals === 'function') {
				this.internals = this.host.attachInternals();
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('ElementInternals not supported', e.message);
		}
	}

	/** Handles click events on the button or link. */
	private handleClick = (event: MouseEvent) => {
		if (this.disabled) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}
		if (this.type === 'button') return;
		event.preventDefault();
		const form = this.internals?.form ?? this.host.closest<HTMLFormElement>('form');
		if (!form) return;
		if (this.type === 'reset') {
			form.reset();
			return;
		}
		form.requestSubmit();
	};

	/** Programmatically focuses the button element. */
	@Method()
	async setFocus(): Promise<void> {
		this.buttonEl?.focus();
	}

	/** @private */
	render() {
		const baseClasses = 'p-2 shadow-none';
		const defaultClasses = !this.disabled
			? `${baseClasses} focus-visible:p-1 focus-visible:m-1 focus-visible:rounded-radius-md focus-visible:outline focus-visible:outline-width-lg focus:-outline-offset-2  focus:outline-focus-ring-default focus-visible:ring-focus-ring-default`
			: '';
		const disabledClasses = this.disabled ? `${baseClasses} cursor-not-allowed text-disabled` : '';

		return (
			<Host>
				<button
					class={`${disabledClasses} ${defaultClasses}`}
					disabled={this.disabled}
					onClick={this.handleClick}
					aria-label={this.label}
					type={this.type}
					ref={(el) => (this.buttonEl = el as HTMLButtonElement)}
					tabIndex={0}
				>
					<span class="flex items-center gap-2">
						<dv-icon name={this.name} size={this.size} color={this.disabled ? undefined : this.color}></dv-icon>
					</span>
				</button>
			</Host>
		);
	}
}

