import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';
import { CHANGE_EVENT, VALUE_CHANGE_EVENT } from '../../events';
import type { ValueChangeEventDetail } from '../../events';

/**
 * ## Overview
 * `<dv-base-input>` is an **internal-only** base component that provides the shared chrome —
 * label, error/help text, icon slots, sizing, and disabled state — used by textfield-family
 * variant components such as `<dv-textfield>`, `<dv-select>`, and `<dv-date-picker>`.
 *
 * It is **not intended for direct use** by consumers. Variant components render it inside
 * their own shadow DOM and re-emit its events through their own public event surface.
 *
 * ## Architecture
 * - Not form-associated (form integration is the variant's responsibility).
 * - Exposes a `::part(input)` CSS part so variants can style the inner `<input>`.
 * - Icon slots use always-rendered wrapper divs hidden via CSS so `slotchange` fires reliably.
 *
 * ## Events
 * Variants should listen for these events on `<dv-base-input>` and re-emit as their own:
 * | Event | When |
 * |---|---|
 * | `valueChange` | User types; carries `{ value: string }` detail |
 * | `change` | User commits value (native `change`) |
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-label>` | Provides accessible label for the input |
 * | `<dv-icon>` | Optional icons via `startIcon` / `endIcon` slots |
 *
 * @internal
 *
 * @tag dv-base-input
 *
 * @slot startIcon - Icon displayed at the start of the input field. Icon size is controlled by this component's `size` prop; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 * @slot endIcon - Icon displayed at the end of the input field. Icon size is controlled by this component's `size` prop; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 * @slot actions - One or more interactive icon buttons displayed before the end icon (e.g. clear, visibility toggle).
 *
 * @part input - The native `<input>` element. Exposed for variant-level style overrides.
 */
@Component({
	tag: 'dv-base-input',
	styleUrl: 'dv-base-input.scss',
	shadow: true
})
export class DvBaseInput {
	/** Reference to the host element */
	@Element() host: HTMLElement;

	/** The name attribute for the input. */
	@Prop() nameValue: string = 'default';

	/** Label for the text field */
	@Prop()
	label: string = '';

	/** Placeholder text for the input */
	@Prop() placeholder: string = '';

	/** Input type (e.g., text, password, email) */
	@Prop() type: 'text' | 'password' | 'email' | 'number' | 'time' | 'date' = 'text';

	/** Indicates if the input is required */
	@Prop() required: boolean = false;

	/** Indicates if the input is disabled */
	@Prop({ mutable: true, reflect: true }) disabled: boolean = false;

	/** Error message displayed when validation fails. */
	@Prop({ mutable: true }) errorText: string = '';

	/** Help text to display below the input */
	@Prop() helpText: string = '';

	/** Size variant of the textfield. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** Value of the input field */
	@Prop({ mutable: true, reflect: true }) value?: string = '';

	@State() hasStartIcon: boolean = false;
	@State() hasEndIcon: boolean = false;
	@State() hasActions: boolean = false;

	/** Emitted when the input value changes. */
	@Event({ eventName: VALUE_CHANGE_EVENT }) valueChange: EventEmitter<ValueChangeEventDetail>;

	/** Emitted when the input value is committed (native change). */
	@Event({ eventName: CHANGE_EVENT }) change: EventEmitter<void>;

	componentDidLoad() {
		const startSlot = this.host.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="startIcon"]');
		const endSlot = this.host.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="endIcon"]');
		const actionsSlot = this.host.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="actions"]');
		this.hasStartIcon = (startSlot?.assignedElements({ flatten: true }) ?? []).length > 0;
		this.hasEndIcon = (endSlot?.assignedElements({ flatten: true }) ?? []).length > 0;
		this.hasActions = (actionsSlot?.assignedElements({ flatten: true }) ?? []).length > 0;
		this.syncIconSizes();
		this.syncIconColors();
	}

	/** @private */
	@Watch('size')
	sizeChanged() {
		this.syncIconSizes();
	}

	/** @private */
	@Watch('disabled')
	disabledChanged() {
		this.syncIconColors();
	}

	/** @private */
	@Watch('errorText')
	errorTextChanged() {
		this.syncIconColors();
	}

	private handleNativeInput = (event: Event): void => {
		const input = event.target as HTMLInputElement;
		this.value = input.value;
		this.valueChange.emit({ value: this.value });
	};

	private handleNativeChange = (): void => {
		this.change.emit();
	};

	private handleStartIconSlotChange = (event: Event) => {
		const slot = event.target as HTMLSlotElement;
		this.hasStartIcon = slot.assignedElements({ flatten: true }).length > 0;
		this.syncIconSizes();
		this.syncIconColors();
	};

	private handleEndIconSlotChange = (event: Event) => {
		const slot = event.target as HTMLSlotElement;
		this.hasEndIcon = slot.assignedElements({ flatten: true }).length > 0;
		this.syncIconSizes();
		this.syncIconColors();
	};

	private handleActionsSlotChange = (event: Event) => {
		const slot = event.target as HTMLSlotElement;
		this.hasActions = slot.assignedElements({ flatten: true }).length > 0;
		this.syncIconSizes();
		this.syncIconColors();
	};

	/**
	 * Returns all dv-icon elements assigned to the startIcon or endIcon slots,
	 * following forwarded slot chains via assignedElements({ flatten: true }).
	 */
	private getSlottedIcons(): HTMLDvIconElement[] {
		const icons: HTMLDvIconElement[] = [];
		const slots = Array.from(
			this.host.shadowRoot?.querySelectorAll<HTMLSlotElement>('slot[name="startIcon"], slot[name="endIcon"]') ?? []
		);
		for (const slot of slots) {
			for (const el of slot.assignedElements({ flatten: true })) {
				if ((el as HTMLElement).tagName?.toLowerCase() === 'dv-icon') {
					icons.push(el as HTMLDvIconElement);
				}
				icons.push(...Array.from((el as HTMLElement).querySelectorAll<HTMLDvIconElement>('dv-icon')));
			}
		}
		return icons;
	}

	/**
	 * Returns all dv-icon-button elements assigned to the actions slot,
	 * following forwarded slot chains via assignedElements({ flatten: true }).
	 */
	private getSlottedActions(): HTMLDvIconButtonElement[] {
		const actions: HTMLDvIconButtonElement[] = [];
		const slot = this.host.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="actions"]');
		for (const el of slot?.assignedElements({ flatten: true }) ?? []) {
			if ((el as HTMLElement).tagName?.toLowerCase() === 'dv-icon-button') {
				actions.push(el as HTMLDvIconButtonElement);
			}
			actions.push(...Array.from((el as HTMLElement).querySelectorAll<HTMLDvIconButtonElement>('dv-icon-button')));
		}
		return actions;
	}

	/** Propagates the size prop to every slotted dv-icon element and action icon button. */
	private syncIconSizes() {
		const iconSize = this.size === 'sm' ? 'xs' : 'md';
		this.getSlottedIcons().forEach((icon) => {
			icon.size = iconSize;
		});
		this.getSlottedActions().forEach((action) => {
			action.size = iconSize;
		});
	}

	/** Propagates the color prop to every slotted dv-icon element based on current state. */
	private syncIconColors() {
		const hasError = this.errorText.trim() !== '';
		const color = hasError ? 'error' : this.disabled ? 'disabled' : undefined;
		this.getSlottedIcons().forEach((icon) => {
			icon.color = color as any;
		});
	}

	/** @private */
	render() {
		const hasError = this.errorText.trim() !== '';

		const baseClasses = `border-width-sm rounded-radius-lg ${
			this.size === 'sm' ? 'py-1 px-4 body-sm' : 'py-2 px-4 body-default'
		} w-full appearance-none focus:outline-width-lg focus:-outline-offset-2 focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default`;

		const inputClasses = this.disabled
			? `${baseClasses} placeholder:text-disabled text-disabled border-form-disabled bg-form-disabled cursor-not-allowed`
			: hasError
				? `${baseClasses} placeholder:text-status-error text-status-error border-status-error focus:outline-focus-ring-destructive focus-visible:ring-focus-ring-destructive`
				: `${baseClasses} placeholder:text-subtle text-default border-form-default bg-form-default`;

		// Firefox renders a native calendar/clear control for `type="date"` that
		// cannot be hidden with CSS (unlike Chromium's `::-webkit-*` pseudo-elements,
		// suppressed in the stylesheet). When a variant supplies its own trailing
		// trigger, we mask the native control by rendering the trailing controls as
		// an opaque, right-flush cover that sits above the input. See ADR-0005.
		const maskNativePicker = this.type === 'date' && (this.hasActions || this.hasEndIcon);

		const rightSlotCount = (this.hasActions ? 1 : 0) + (this.hasEndIcon ? 1 : 0);
		// Firefox anchors its native date controls to the right edge of the input's
		// content box, so their position tracks the right padding: MORE right padding
		// pushes them further LEFT, out from under a right-pinned mask. We therefore
		// use a SMALL right padding for masked date inputs, which keeps the native
		// controls near the right edge (under the custom trigger and mask panel). The
		// date value/segments are short and left-aligned, so they never reach it.
		const rightPaddingClass = maskNativePicker
			? 'pr-3'
			: rightSlotCount === 2
				? this.size === 'sm'
					? 'pr-16'
					: 'pr-20'
				: rightSlotCount === 1
					? this.size === 'sm'
						? 'pr-9'
						: 'pr-10'
					: '';
		const iconPaddingClasses =
			`${this.hasStartIcon ? (this.size === 'sm' ? 'pl-9' : 'pl-11') : ''} ${rightPaddingClass}`.trim();

		// Opaque backing panel that masks Firefox's native picker control (which has
		// no CSS hide). A fixed-width rectangle layered above the input but below the
		// trailing controls, so the custom trigger sits on top of it. `w-16` (4rem)
		// covers the native clear + calendar cluster, which sits near the right edge
		// thanks to the small right padding above. The panel is inset ~6px from the
		// edges (`inset-y-1.5 right-1.5`) so it clears the input's inset focus ring
		// (`outline-width-lg` 3px at `-outline-offset-2`, i.e. 2–5px inside the
		// border) — otherwise it would paint over the ring's right edge. The native
		// control sits ~13px in (1px border + `pr-3`), still well within the panel.
		const nativePickerMaskClass = `absolute inset-y-1.5 right-1.5 z-10 w-16 ${
			this.disabled ? 'bg-form-disabled' : 'bg-form-default'
		}`;

		// Trailing controls keep their normal right-anchored position; raised above
		// the mask panel when masking so the trigger stays visible and clickable.
		const trailingControlsClass = maskNativePicker
			? 'absolute inset-y-0 right-3 z-20 flex items-center gap-x-1'
			: 'absolute inset-y-0 right-3 flex items-center gap-x-1';

		return (
			<Host>
				<div class="antialiased relative">
					{this.label && (
						<dv-label
							htmlFor={this.nameValue}
							label={this.label}
							variant={hasError ? 'error' : this.disabled ? 'disabled' : undefined}
							required={this.required}
							floating={true}
						></dv-label>
					)}
					<div class="relative -mt-2">
						{/* Always rendered so slotchange fires; hidden via CSS when empty */}
						<div
							class={`absolute inset-y-0 left-4 flex items-center pointer-events-none ${this.disabled ? 'text-disabled' : 'text-subtle'}${!this.hasStartIcon ? ' hidden' : ''}`}
						>
							<slot name="startIcon" onSlotchange={this.handleStartIconSlotChange}></slot>
						</div>
						<input
							class={`${inputClasses} ${iconPaddingClasses}`.trim()}
							part="input"
							id={this.nameValue}
							type={this.type}
							placeholder={this.placeholder}
							value={this.value}
							disabled={this.disabled}
							required={this.required}
							onInput={this.handleNativeInput}
							onChange={this.handleNativeChange}
						/>
						{maskNativePicker && <div aria-hidden="true" class={nativePickerMaskClass}></div>}
						<div class={trailingControlsClass}>
							{/* Always rendered so slotchange fires; hidden via CSS when empty */}
							<div
								class={`flex items-center gap-x-1 pointer-events-auto ${this.disabled ? 'text-disabled' : 'text-subtle'}${!this.hasActions ? ' hidden' : ''}`}
							>
								<slot name="actions" onSlotchange={this.handleActionsSlotChange}></slot>
							</div>
							{/* Always rendered so slotchange fires; hidden via CSS when empty */}
							<div
								class={`flex items-center pointer-events-none ${this.disabled ? 'text-disabled' : 'text-subtle'}${!this.hasEndIcon ? ' hidden' : ''}`}
							>
								<slot name="endIcon" onSlotchange={this.handleEndIconSlotChange}></slot>
							</div>
						</div>
					</div>
					{hasError && (
						<div class="body-xs mt-1 flex justify-between">
							<span class="text-status-error mr-2">{this.errorText}</span>
						</div>
					)}
					{!hasError && this.helpText && (
						<div class={`body-xs mt-1 flex justify-between  ${this.disabled ? 'text-disabled' : 'text-subtle'}`}>
							<span class="mr-2 line-clamp-2">{this.helpText}</span>
						</div>
					)}
				</div>
			</Host>
		);
	}
}

