import type { EventEmitter } from '@stencil/core';
import { Component, Element, Host, Method, Prop, State, Watch, h, Event } from '@stencil/core';
import { CHANGE_EVENT } from '../../events/change';

/**
 * ## Overview
 * `dv-select` provides a form control for selecting an option from a dropdown list. It includes form
 * validation, keyboard navigation, and custom styling with animation support.
 *
 * The component implements a robust selection interface with proper form association and ARIA attributes
 * while providing smooth animations and positioning for the dropdown menu.
 *
 * Select maintains its own state management and keyboard navigation while integrating with native form
 * validation and submission.
 *
 * The `<dv-select>` component supports these interaction patterns:
 * - **Keyboard Navigation**: Arrow keys to move between options

 * - **Dropdown Control**: Click or Enter to open/close
 * - **Form Integration**: Native form value handling
 * - **Focus Management**: Proper focus states and transitions
 *
 * ## Accessibility
 * - Uses `role="combobox"` and `role="listbox"`.
 * - Maintains proper ARIA attributes.
 * - Keyboard navigation support.
 * - Focus management.
 * - Required field indication.
 * - View [Accessibility](/docs/getting-started-accessibility--docs) docs for more information.
 *
 * ## Resources
 * - [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
 *
 * ## Dependencies
 * | Component | Purpose |
 * |---|---|
 * | `<dv-label>` | Provides accessible label |
 * | `<dv-icon>` | Displays chevron indicator |
 * | `<dv-popup>` | Positions and animates the dropdown |
 * | `<dv-option>` | Selectable items within the listbox |
 *
 * @summary A dropdown select component with form integration, keyboard navigation, and validation.
 *
 * @tag dv-select
 *
 * @slot - Container for `dv-option` and `dv-divider` components.
 * @slot startIcon - Icon displayed at the start of the select field. Icon size is controlled by the select's `size` prop; a `size` set directly on the slotted `<dv-icon>` is overridden and has no effect.
 */
@Component({
	tag: 'dv-select',
	styleUrl: 'dv-select.scss',
	shadow: true,
	formAssociated: true
})
export class DvSelect {
	private listbox: HTMLSlotElement;
	private popup: HTMLDvPopupElement;
	private displayInput: HTMLInputElement;
	private valueInput: HTMLInputElement;
	private internals: ElementInternals | null = null;
	private defaultValue: string = '';
	private valueHasChanged: boolean = false;
	private currentOption: HTMLDvOptionElement;
	private openedByKeyboard: boolean = false;

	/** @internal Host element reference used for form association and option queries. */
	@Element() host: HTMLDvSelectElement;

	/** Label for the select */
	@Prop() label: string;

	/** The name attribute for the input - default is 'default' */
	@Prop() nameValue: string = 'default';

	/** Sets the starting open state of the select */
	@Prop({ mutable: true }) open: boolean = false;

	/** Sets where the listbox will popup relative to the display input - default is bottom placement */
	@Prop() placement: 'top' | 'bottom' = 'bottom';

	/** Placeholder text for the display input */
	@Prop() placeholder: string = '';

	/** Indicates the disabled state for the select - default is false */
	@Prop({ reflect: true }) disabled: boolean = false;

	/** Help text to display below the select */
	@Prop() helpText: string;

	/** Indicates whether the select is a required field */
	@Prop() required: boolean = false;

	/** Error text to display below the select */
	@Prop() errorText: string = '';

	/** Value of the select */
	@Prop({ mutable: true, reflect: true }) value?: string = '';

	/** When true, uses fixed CSS positioning to prevent the listbox from being clipped inside overflow containers. */
	@Prop() hoist: boolean = false;

	/** Size variant of the select. Accepts `'sm'` or `'md'`. Defaults to `'md'`. */
	@Prop({ reflect: true }) size: 'sm' | 'md' = 'md';

	/** @internal Tracks the rendered open state for animation and popup sync. */
	@State() isOpen: boolean = false;

	/** @internal Stores the selected option label shown in the combobox input. */
	@State() displayLabel = '';

	/** @internal Tracks focus styling for the combobox wrapper. */
	@State() hasFocus: boolean = false;

	/** @internal Tracks whether validation should render the error state. */
	@State() hasError: boolean = false;

	/** Emitted when the select value changes */
	@Event({
		eventName: CHANGE_EVENT
	})
	change: EventEmitter<void>;

	constructor() {
		// Validation to allow unit tests to run without ElementInternals support
		try {
			if (typeof this.host.attachInternals === 'function') {
				this.internals = this.host.attachInternals();
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('ElementInternals not supported', e.message);
		}
	}

	/** @private */
	componentWillLoad() {
		this.validateInput(this.value);
		this.updateFormValue(this.value);
	}

	/** @private */
	componentDidLoad() {
		this.defaultValue = this.value;
		this.syncIcons();
	}

	/** @private */
	@Watch('open')
	async handleOpenChange() {
		if (this.open && !this.disabled) {
			// reset current option
			const allOptions = this.getAllOptions();
			const selectedOption = allOptions.find((el) => el.selected);
			this.setCurrentOption(selectedOption ?? allOptions[0], this.openedByKeyboard);
			this.isOpen = true;
			this.addListeners();
			this.listbox.hidden = false;
			this.popup.active = true;

			requestAnimationFrame(() => {
				this.setCurrentOption(this.currentOption, this.openedByKeyboard);
				this.openedByKeyboard = false;
			});

			const { keyframes, options } = this.getAnimation('select.show');
			await Promise.resolve(this.animateTo(this.popup?.shadowRoot?.querySelector('div'), keyframes, options));
		} else {
			this.isOpen = false;
			this.removeListeners();
			this.popup.active = false;
			this.listbox.hidden = true;

			const { keyframes, options } = this.getAnimation('select.hide');
			await Promise.resolve(this.animateTo(this.popup?.shadowRoot?.querySelector('div'), keyframes, options));
		}
	}

	/** @private */
	@Watch('disabled')
	handleDisabledChange() {
		if (this.disabled) {
			this.open = false;
		}
		this.syncIcons();
	}

	/** @private */
	@Watch('size')
	sizeChanged() {
		this.syncIcons();
	}

	/** @private */
	@Watch('value')
	async handleValueChange(newValue: string) {
		if (!this.valueHasChanged && this.defaultValue === newValue) {
			return;
		}

		const allOptions = this.getAllOptions();
		await this.setSelectedOption(allOptions.find((el) => this.value === el.value));

		this.validateInput(newValue);
		this.updateFormValue(newValue);
		this[CHANGE_EVENT].emit();
		this.valueHasChanged = true;
	}

	/* istanbul ignore next */
	/** @private */
	@Watch('errorText')
	errorTextChanged() {
		this.validateInput(this.value);
	}

	/** Opens the select dropdown. */
	@Method()
	async selectShow() {
		if (this.open || this.disabled) {
			return;
		}

		this.open = true;
	}

	/** Closes the select dropdown. */
	@Method()
	async selectHide() {
		this.open = false;
	}

	/** @private */
	handleFocus() {
		this.hasFocus = true;
	}

	/** @private */
	handleBlur() {
		this.hasFocus = false;
	}

	/** @private */
	handleDefaultSlotChange() {
		const allOptions = this.getAllOptions();
		if (this.value) void this.setSelectedOption(allOptions.find((el) => this.value === el.value));
	}

	/* istanbul ignore next */
	/** @private */
	addListeners() {
		document.addEventListener('focusin', this.handleDocumentFocusIn);
		document.addEventListener('mousedown', this.handleDocumentMouseDown);
		document.addEventListener('keydown', this.handleDocumentKeyDown);
	}

	/* istanbul ignore next */
	/** @private */
	removeListeners() {
		document.removeEventListener('focusin', this.handleDocumentFocusIn);
		document.removeEventListener('mousedown', this.handleDocumentMouseDown);
		document.removeEventListener('keydown', this.handleDocumentKeyDown);
	}

	/** @private */
	handleDocumentKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && this.open) {
			event.preventDefault();
			event.stopPropagation();
			void this.selectHide();
			this.displayInput.focus({ preventScroll: true });
		}

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopImmediatePropagation();

			if (!this.open) {
				this.openedByKeyboard = true;
				void this.selectShow();
				return;
			}

			if (this.currentOption && !this.currentOption.disabled) {
				this.valueHasChanged = true;
				void this.setSelectedOption(this.currentOption);

				void this.selectHide();
				this.displayInput.focus({ preventScroll: true });
			}

			return;
		}

		if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
			const allOptions = this.getAllOptions();

			const currentIndex = allOptions.indexOf(this.currentOption);
			let newIndex: number;

			event.preventDefault();

			if (!this.open) {
				this.openedByKeyboard = true;
				void this.selectShow();

				if (this.currentOption) {
					return;
				}
			}

			if (event.key === 'ArrowDown') {
				newIndex = currentIndex + 1;
				if (newIndex > allOptions.length - 1) newIndex = 0;
			} else if (event.key === 'ArrowUp') {
				newIndex = currentIndex - 1;
				if (newIndex < 0) newIndex = allOptions.length - 1;
			} else if (event.key === 'Home') {
				newIndex = 0;
			} else if (event.key === 'End') {
				newIndex = allOptions.length - 1;
			}

			this.setCurrentOption(allOptions[newIndex], true);
		}
	};

	/* istanbul ignore next */
	/** @private */
	handleDocumentMouseDown = (event: MouseEvent) => {
		const path = event.composedPath();
		if (this.host && !path.includes(this.host)) void this.selectHide();
	};

	/* istanbul ignore next */
	/** @private */
	handleDocumentFocusIn = (event: FocusEvent) => {
		// Close when focusing out of the select
		const path = event.composedPath();
		if (this.host && !path.includes(this.host)) {
			this.selectHide();
		}
	};

	/* istanbul ignore next */
	/** @private */
	handleComboboxMouseDown = (event: MouseEvent) => {
		if (this.disabled) {
			return;
		}

		this.openedByKeyboard = false;
		event.preventDefault();
		this.displayInput.focus({ preventScroll: true });
		this.open = !this.open;
	};

	/** @private */
	handleComboboxKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Tab') {
			return;
		}

		event.stopPropagation();
		this.handleDocumentKeyDown(event);
	};

	/* istanbul ignore next */
	/** @private */
	handleOptionClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		const option = target.closest('dv-option');

		if (option && !option.disabled && !(this.value === option?.value)) {
			this.valueHasChanged = true;
			void this.setSelectedOption(option);
		}

		this.displayInput.focus({ preventScroll: true });
		void this.selectHide();
	};

	/** @private */
	getAllOptions() {
		return Array.from(this.host.querySelectorAll('dv-option'));
	}

	/** @private */
	async setSelectedOption(option: HTMLDvOptionElement) {
		const allOptions = this.getAllOptions();
		allOptions.forEach((el) => (el.selected = false));

		if (option) option.selected = true;

		await this.updateSelection();
	}

	/** @private */
	async updateSelection() {
		// ensure updateSelection does not count as update to dirty state
		const cachedValueHasChanged = this.valueHasChanged;

		const options = this.getAllOptions();
		const selectedOption = options.filter((el) => el.selected)[0];
		this.value = selectedOption?.value ?? '';
		this.displayLabel = (await selectedOption?.getTextContent?.()) ?? '';

		this.valueHasChanged = cachedValueHasChanged;
	}

	/** @private */
	setCurrentOption(option: HTMLDvOptionElement, focusVisible = false) {
		const allOptions = this.getAllOptions();

		allOptions.forEach((el) => {
			el.current = false;
			el.tabIndex = -1;
		});

		if (option) {
			this.currentOption = option;
			option.current = true;
			option.tabIndex = 0;
			void option.setFocus(focusVisible);
		}
	}

	/** @private */
	validateInput(_value: string) {
		this.hasError = this.errorText.trim() !== '';
		this.updateValidityState();
		this.syncIcons();
	}

	private updateValidityState() {
		if (!this.internals) return;
		try {
			/* istanbul ignore if */
			if (this.hasError) {
				this.internals.setValidity?.({ customError: true }, this.errorText, this.valueInput);
			} else {
				this.internals.setValidity?.({});
			}
		} catch (e) {
			/* istanbul ignore next */
			console.warn('Validity state update not supported', e.message);
		}
	}

	/** Propagates size and color to every slotted dv-icon element based on current state. */
	private syncIcons() {
		const icons = this.host.querySelectorAll<HTMLDvIconElement>('[slot="startIcon"] dv-icon, dv-icon[slot="startIcon"]');
		const color: HTMLDvIconElement['color'] = this.hasError ? 'error' : undefined;
		const iconSize: HTMLDvIconElement['size'] = this.size === 'sm' ? 'xs' : 'md';
		icons.forEach((icon) => {
			icon.size = iconSize;
			icon.color = color;
		});
	}

	/** @private */
	updateFormValue(value: string) {
		/* istanbul ignore if */
		if (this.internals?.setFormValue) {
			try {
				this.internals.setFormValue(value || null);
			} catch (e) {
				console.warn('Form value update not supported', e.message);
			}
		}
	}

	/** @private */
	getAnimation(animationName: string) {
		const animations = {
			'select.show': {
				keyframes: [
					{ opacity: 0, scale: 0.9 },
					{ opacity: 1, scale: 1 }
				],
				options: { duration: 100, easing: 'ease' }
			},
			'select.hide': {
				keyframes: [
					{ opacity: 1, scale: 1 },
					{ opacity: 0, scale: 0.9 }
				],
				options: { duration: 100, easing: 'ease' }
			}
		};

		return animations[animationName] || { keyframes: [], options: {} };
	}

	/** @private */
	async animateTo(element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
		if (element) {
			const animation = element.animate(keyframes, options);
			return new Promise<void>((resolve) => {
				animation.onfinish = () => resolve();
			});
		} else {
			return Promise.resolve();
		}
	}

	/** @private */
	render() {
		const baseComboboxClasses = `rounded-radius-lg border grow flex w-full min-w-0 relative items-center justify-start align-middle overflow-hidden -mt-2 ${this.size === 'sm' ? 'body-sm pr-4' : 'body-default pr-4'}`;
		const focusBorderClasses = `outline outline-visible outline-width-lg outline-offset-0 border-transparent ${this.hasError ? 'outline-focus-ring-destructive' : 'outline-focus-ring-default'}`;
		const comboboxClasses = this.disabled
			? `${baseComboboxClasses} text-disabled bg-form-disabled cursor-not-allowed outline-none border-form-disabled`
			: this.hasFocus
				? `${baseComboboxClasses} bg-default cursor-pointer ${focusBorderClasses}`
				: this.hasError
					? `${baseComboboxClasses} bg-default cursor-pointer border-status-error`
					: `${baseComboboxClasses} bg-default cursor-pointer border-form-default`;

		const listboxId = `${this.nameValue}-listbox`;
		const hasStartIcon = !!this.host.querySelector('[slot="startIcon"]');

		return (
			<Host>
				<div>
					{this.label && (
						<dv-label
							htmlFor={this.nameValue}
							label={this.label}
							variant={this.hasError ? 'error' : this.disabled ? 'disabled' : undefined}
							required={this.required}
							floating={true}
						></dv-label>
					)}
					<dv-popup
						ref={(el) => (this.popup = el)}
						placement={this.placement}
						flip
						distance={this.placement === 'top' ? 15 : 3}
						sync="width"
						class="inline-flex flex-auto w-full relative align-middle"
						strategy={this.hoist ? 'fixed' : 'absolute'}
					>
						<div
							slot="anchor"
							class={comboboxClasses}
							onMouseDown={this.handleComboboxMouseDown}
							onKeyDown={this.handleComboboxKeyDown}
						>
							{/* Conditionally render Start Icon Slot */}
							{hasStartIcon && (
								<div
									class={`absolute inset-y-0 left-4 flex items-center pointer-events-none ${this.disabled ? 'text-disabled' : 'text-subtle'}`}
								>
									<slot name="startIcon"></slot>
								</div>
							)}
							<input
								ref={(el) => (this.displayInput = el)}
								class={`w-full ${this.size === 'sm' ? 'body-sm py-1' : 'body-default py-2'} ${this.size === 'sm' ? 'placeholder:pl-1' : 'placeholder:pl-1.5'} border-transparent focus:border-transparent focus:ring-0 rounded-radius-lg overflow-hidden m-0 focus:outline-none ${hasStartIcon ? (this.size === 'sm' ? 'pl-9' : 'pl-11') : ''} ${
									this.disabled
										? 'bg-form-disabled text-disabled placeholder:text-disabled cursor-not-allowed'
										: this.hasError
											? 'text-default placeholder:text-status-error cursor-pointer'
											: 'text-default placeholder:text-subtle cursor-pointer'
								}`}
								type="text"
								placeholder={this.placeholder}
								value={this.displayLabel}
								disabled={this.disabled}
								readonly
								aria-controls={listboxId}
								aria-expanded={this.open ? 'true' : 'false'}
								aria-haspopup="listbox"
								aria-labelledby="label"
								aria-disabled={this.disabled ? 'true' : 'false'}
								role="combobox"
								tabIndex={0}
								onFocus={() => this.handleFocus()}
								onBlur={() => this.handleBlur()}
							></input>
							<input
								ref={(el) => (this.valueInput = el)}
								class={`opacity-0 absolute size-full body-default border-none rounded-radius-lg p-0 m-0 -z-10`}
								type="text"
								disabled={this.disabled}
								value={this.value}
								tabIndex={-1}
								aria-hidden="true"
							></input>
							<dv-icon
								color={this.hasError ? 'error' : undefined}
								class={`${
									this.isOpen ? 'rotate-180' : 'rotate-0'
								} flex-none flex items-center ms-2 transition-[rotate] duration-[250ms] ${this.disabled ? 'text-disabled' : 'text-subtle'}`}
								name="chevron-down"
								size={this.size === 'sm' ? 'xs' : 'md'}
							></dv-icon>
						</div>
						<div
							id={listboxId}
							class="block py-4 px-2 relative shadow-lg bg-default rounded-radius-lg overflow-auto overscroll-none max-h-40"
							role="listbox"
							tabIndex={-1}
							onMouseUp={this.handleOptionClick}
						>
							<slot
								ref={(el) => (this.listbox = el as HTMLSlotElement)}
								onSlotchange={() => this.handleDefaultSlotChange()}
							></slot>
						</div>
					</dv-popup>
					{this.helpText && !this.hasError && (
						<div class={`body-xs mt-1 flex justify-between ${this.disabled ? 'text-disabled' : 'text-subtle'}`}>
							<span class="mr-2 line-clamp-2">{this.helpText}</span>
						</div>
					)}
					{this.hasError && (
						<div class="body-xs mt-1 flex justify-between">
							<span class="text-status-error mr-2 line-clamp-2">{this.errorText}</span>
						</div>
					)}
				</div>
			</Host>
		);
	}
}

