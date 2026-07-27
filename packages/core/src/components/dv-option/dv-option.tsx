import { Component, Element, Host, Method, Prop, State, Watch, h } from '@stencil/core';

/**
 * ## Overview
 * `dv-option` represents a single selectable item within an `dv-select` or similar list-based component.
 * It renders with a checkmark indicator when selected and supports disabled and keyboard-current states.
 *
 * ## Accessibility
 * - Uses `aria-selected` to communicate selection state to assistive technologies.
 * - Uses `aria-disabled` to communicate disabled state.
 * - Visual focus ring is applied when the option is the current keyboard-navigated item.
 *
 * @summary A selectable option item used inside list or select components.
 *
 * @tag dv-option
 *
 * @slot - The label text or content for the option.
 */
@Component({
	tag: 'dv-option',
	styleUrl: 'dv-option.scss',
	shadow: true
})
export class DvOption {
	@Element() host: HTMLDvOptionElement;

	/** The value associated with this option, submitted when the option is selected. */
	@Prop({ reflect: true, mutable: true }) value = '';

	/** When true, prevents the option from being selected and applies disabled styling. */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Indicates whether this option is currently selected. */
	@Prop({ mutable: true }) selected: boolean = false;

	/** Indicates whether this option is the current keyboard-focused item in the list. */
	@Prop({ mutable: true }) current: boolean = false;

	/** @private */
	@State() private focusVisible: boolean = false;

	@Watch('value')
	handleValueChange() {
		if (typeof this.value !== 'string') {
			this.value = String(this.value);
		}

		// replace spaces with underscores as spaces delimiters in multi-select scenarios
		if (this.value.includes(' ')) {
			this.value = this.value.replace(/ /g, '_');
		}
	}

	/**
	 * Programmatically focuses this option and optionally shows the keyboard focus ring.
	 * Called by `dv-select` during keyboard navigation.
	 *
	 * @param showFocusRing - When true, renders the focus ring outline on this option.
	 */
	@Method()
	async setFocus(showFocusRing = false) {
		this.focusVisible = showFocusRing;
		this.host.focus();
	}

	/** Returns the visible text content of the option, excluding slotted icon or decorative elements. */
	@Method()
	async getTextContent() {
		const nodes = Array.from(this.host.childNodes) as Node[];
		let label = '';

		[...nodes].forEach((node) => {
			if (node.nodeType === Node.ELEMENT_NODE) {
				if (!(node as HTMLElement).hasAttribute('slot')) {
					label += (node as HTMLElement).textContent;
				}
			}

			if (node.nodeType === Node.TEXT_NODE) {
				label += node.textContent;
			}
		});

		return label.trim();
	}

	render() {
		const baseClasses = 'body-default rounded-radius-lg relative flex items-center py-3 px-4 gap-2 mb-px';

		const selectedClasses = 'bg-default-active text-default';

		const disabledClasses = 'text-disabled cursor-not-allowed';

		const currentClasses = `bg-default-active text-default${this.focusVisible ? ' outline outline-width-lg -outline-offset-2 outline-focus-ring-default' : ''}`;

		return (
			<Host style={{ outline: 'none' }}>
				<div
					aria-selected={this.selected ? 'true' : 'false'}
					aria-disabled={this.disabled ? 'true' : 'false'}
					class={`${baseClasses} ${this.selected && !this.disabled ? selectedClasses : ''} ${
						this.disabled ? disabledClasses : 'cursor-pointer'
					} ${!this.selected && !this.disabled && !this.current ? 'text-default hover:bg-default-hover' : ''} ${
						this.current ? currentClasses : ''
					}`}
				>
					<div class={`flex-auto inline-block`}>
						<slot></slot>
					</div>
				</div>
			</Host>
		);
	}
}

