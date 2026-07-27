import type { EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import 'cally';
import { CHANGE_EVENT } from '../../events/change';
import type { ValueChangeEventDetail } from '../../events';

/**
 * ## Overview
 * The Date Picker component provides accessible date selection functionality.
 *
 * The component renders an input-style trigger and calendar popup that supports
 * date navigation by month and year.
 *
 * ## Accessibility
 * - Uses a textfield trigger with clear labeling support via the `label` prop.
 * - Preserves disabled behavior by preventing popup interaction when disabled.
 * - Uses semantic date/month elements from the calendar UI for screen-reader compatibility.
 *
 * ## Resources
 * - [MDN Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
 * - [WAI-ARIA Date Picker Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
 *
 * ## Dependencies
 * | Component          | Purpose                                                     |
 * |--------------------|-------------------------------------------------------------|
 * | `<dv-icon-button>`  | Used for the navigation buttons for date and year selection |
 *
 * @summary A date picker with support for date, month, and year selection.
 *
 * @tag dv-date-picker
 *
 * @slot - This component does not expose consumer-provided slot content.
 */
@Component({
	tag: 'dv-date-picker',
	styleUrl: 'dv-date-picker.scss',
	shadow: true
})
export class DvDatePicker {
	private body: HTMLElement;
	private popup: HTMLDvPopupElement;
	private calendar: HTMLElement;
	private triggerButton: HTMLDvIconButtonElement;
	private dayPanel: HTMLElement;
	private closeAnimationTimeout?: ReturnType<typeof setTimeout>;

	@Element() host: HTMLDvDatePickerElement;

	/** The name attribute for the input. */
	@Prop() nameValue: string = 'default';

	/** The open state for the calendar date picker */
	@Prop({ mutable: true }) open: boolean = false;

	/** The label for the date picker's textfield */
	@Prop() label: string = '';

	/** The locale used for month label formatting. */
	@Prop() locale: string = 'en-US';

	/** Disables the date picker trigger and popup interaction when true. */
	@Prop() disabled: boolean = false;

	/** The size of the textfield element */
	@Prop() size: 'sm' | 'md' = 'md';

	/** The starting value of the date - if not provided, calendar opens to today's date */
	@Prop({ mutable: true, reflect: true }) value: string;

	/** @internal */
	@State() date: Date;

	/** @internal */
	@State() displayDate: Date;

	/** @internal */
	@State() headerDate: Date;

	/** @internal */
	@State() monthOpen = false;

	/** @internal */
	@State() yearOpen = false;

	/** @internal */
	@State() yearsList = [];

	/** @internal */
	@State() popupVisible = false;

	/** @internal */
	@State() popupClosing = false;

	/** @internal */
	@State() dayViewKey = 0;

	/** @internal */
	@State() pendingDayCellFocus = false;

	@Event({ eventName: CHANGE_EVENT }) change: EventEmitter<void>;

	/** @private */
	componentWillLoad() {
		if (this.value) {
			this.date = this.parseDateValue(this.value) ?? new Date(Date.now());
		} else {
			this.date = new Date(Date.now());
		}
		this.displayDate = new Date(this.date);
		this.headerDate = new Date(this.date);
		this.yearsList = this.getYearsList(this.getCurrentYear());
	}

	/** @private */
	disconnectedCallback() {
		if (this.closeAnimationTimeout) {
			clearTimeout(this.closeAnimationTimeout);
			this.closeAnimationTimeout = undefined;
		}
		document.removeEventListener('keydown', this.handleDocumentKeyDown);
		this.setCalendarRef(null);
	}

	private setCalendarRef = (element: HTMLElement | null) => {
		if (this.calendar === element) {
			return;
		}

		this.calendar = element;
	};

	private focusCalendar() {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.calendar?.focus?.();
			});
		});
	}

	private findFirstFocusableDayCell() {
		const calendarRoot = this.calendar?.shadowRoot;
		const monthElement = this.calendar?.querySelector('calendar-month') as HTMLElement | null;
		const monthRoot = monthElement?.shadowRoot;
		const roots = [monthRoot, calendarRoot, this.calendar, monthElement].filter(Boolean) as ParentNode[];
		const selectors = [
			'[aria-selected="true"]',
			'[aria-current="date"]',
			'[part~="selected"]',
			'[part~="day"][tabindex="0"]',
			'button[tabindex="0"]',
			'button:not([disabled])',
			'[tabindex]:not([tabindex="-1"])'
		];

		for (const root of roots) {
			for (const selector of selectors) {
				const element = root.querySelector(selector) as HTMLElement | null;
				if (element) {
					return element;
				}
			}
		}

		return null;
	}

	private focusDayCellAfterTransition() {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const dayCell = this.findFirstFocusableDayCell();
				if (dayCell) {
					dayCell.focus();
					this.pendingDayCellFocus = false;
					return;
				}

				this.focusCalendar();
				this.pendingDayCellFocus = false;
			});
		});
	}

	private handleDayPanelTransitionEnd = (event: TransitionEvent) => {
		if (!this.pendingDayCellFocus || event.target !== this.dayPanel) {
			return;
		}

		if (event.propertyName !== 'opacity' && event.propertyName !== 'transform') {
			return;
		}

		if (this.monthOpen || this.yearOpen || !this.open) {
			return;
		}

		this.focusDayCellAfterTransition();
	};

	private closePopupImmediately() {
		document.removeEventListener('keydown', this.handleDocumentKeyDown);
		if (this.closeAnimationTimeout) {
			clearTimeout(this.closeAnimationTimeout);
			this.closeAnimationTimeout = undefined;
		}
		this.popupVisible = false;
		this.popupClosing = false;
		if (this.popup) {
			this.popup.active = false;
		}
		if (this.body) {
			this.body.hidden = true;
		}
	}

	/** @private */
	@Watch('open')
	async handleOpenChange() {
		if (this.open && !this.disabled) {
			if (this.closeAnimationTimeout) {
				clearTimeout(this.closeAnimationTimeout);
				this.closeAnimationTimeout = undefined;
			}
			document.addEventListener('keydown', this.handleDocumentKeyDown);
			this.displayDate = new Date(this.date);
			this.headerDate = new Date(this.date);
			this.body.hidden = false;
			this.popup.active = true;
			this.popupClosing = false;
			requestAnimationFrame(() => {
				this.popupVisible = true;
			});
		} else {
			document.removeEventListener('keydown', this.handleDocumentKeyDown);
			this.popupClosing = true;
			this.popupVisible = false;
			if (this.closeAnimationTimeout) {
				clearTimeout(this.closeAnimationTimeout);
			}
			this.closeAnimationTimeout = setTimeout(() => {
				if (!this.open) {
					this.popup.active = false;
					this.body.hidden = true;
					this.popupClosing = false;
				}
				this.closeAnimationTimeout = undefined;
			}, 200);
		}
	}

	/** @private */
	@Watch('disabled')
	handleDisabledChange() {
		if (this.disabled) {
			this.closePopupImmediately();
			this.open = false;
		}
	}

	/** @private */
	@Watch('date')
	handleDateChange() {
		this.value = this.formatDateValue(this.date);
	}

	/** Closes the date picker popup */
	@Method()
	async datePickerHide() {
		this.open = false;
	}

	/** @private */
	parseDateValue(value?: unknown) {
		if (!value) {
			return null;
		}

		if (value instanceof Date) {
			return new Date(value.getFullYear(), value.getMonth(), value.getDate());
		}

		if (typeof value === 'object') {
			const dateObject = value as { year?: unknown; month?: unknown; day?: unknown; toString?: () => string };
			if (
				typeof dateObject.year === 'number' &&
				typeof dateObject.month === 'number' &&
				typeof dateObject.day === 'number'
			) {
				return new Date(dateObject.year, dateObject.month - 1, dateObject.day);
			}

			if (typeof dateObject.toString === 'function') {
				const stringValue = dateObject.toString();
				if (stringValue && stringValue !== '[object Object]') {
					return this.parseDateValue(stringValue);
				}
			}

			return null;
		}

		if (typeof value !== 'string') {
			return null;
		}

		const [year, month, day] = value.split('-').map(Number);
		if (!year || !month || !day) {
			return null;
		}

		return new Date(year, month - 1, day);
	}

	/** @private */
	formatDateValue(date: Date) {
		const year = date.getFullYear();
		const month = `${date.getMonth() + 1}`.padStart(2, '0');
		const day = `${date.getDate()}`.padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	/** @private */
	newDateSelected = async (event: Event) => {
		const selectedDateEvent = event as CustomEvent<string>;
		const target = event.target as HTMLInputElement | null;
		const calendarValue = (this.calendar as HTMLInputElement | undefined)?.value;
		const selectedValue = selectedDateEvent.detail || calendarValue || target?.value;
		const selectedDate = this.parseDateValue(selectedValue);
		if (selectedDate) {
			this.date = selectedDate;
			this.displayDate = new Date(selectedDate);
			this.headerDate = new Date(selectedDate);
			this.dateChanged();
			this[CHANGE_EVENT].emit();
		}
		await this.datePickerHide();
	};

	/** @private */
	calendarFocusChanged = (event: Event) => {
		const focusedDateEvent = event as CustomEvent<string>;
		const focusedDate = this.parseDateValue(focusedDateEvent.detail);
		if (!focusedDate) {
			return;
		}
		this.headerDate = focusedDate;
	};

	/**
	 * Syncs the popup calendar to a date typed directly into the base input.
	 *
	 * The native `<input type="date">` emits a `valueChange` (carrying the ISO
	 * `yyyy-mm-dd` value) whenever the user completes a valid date via the
	 * keyboard. We consume it here so the calendar's selected and focused dates
	 * follow the typed value, and stop it from leaking past the picker's public
	 * event surface.
	 * @private
	 */
	handleInputValueChange = (event: Event) => {
		event.stopPropagation();
		const { value } = (event as CustomEvent<ValueChangeEventDetail>).detail ?? {};
		const typedDate = this.parseDateValue(value);
		if (!typedDate) {
			return;
		}
		this.date = typedDate;
		this.displayDate = new Date(typedDate);
		this.headerDate = new Date(typedDate);
		// Remount the calendar so its displayed month follows the typed date.
		// cally's <calendar-date> does not move its view on a `focusedDate` prop
		// update alone — the same reason month/year navigation bumps this key.
		this.dayViewKey += 1;
	};

	/**
	 * Re-emits the base input's native `change` as the picker's own `change`
	 * when a keyboard-entered date is committed, keeping a single public event
	 * surface for consumers.
	 * @private
	 */
	handleInputChange = (event: Event) => {
		event.stopPropagation();
		this[CHANGE_EVENT].emit();
	};

	/** @private */
	handleYearClick(year: number) {
		this.displayDate = this.setDateForMonthYear(year, this.displayDate.getMonth(), this.displayDate);
		this.headerDate = new Date(this.displayDate);
		this.yearOpen = false;
		this.dayViewKey += 1;
		this.pendingDayCellFocus = true;
		this.focusCalendar();
	}

	/** @private */
	dateChanged() {
		this.date = new Date(this.date);
		this.value = this.formatDateValue(this.date);
	}

	/** @private */
	handleMonthClick(month: number) {
		this.displayDate = this.setDateForMonthYear(this.displayDate.getFullYear(), month, this.displayDate);
		this.headerDate = new Date(this.displayDate);
		this.monthOpen = false;
		this.dayViewKey += 1;
		this.pendingDayCellFocus = true;
		this.focusCalendar();
	}

	/** @private */
	handleMonthBackToDay() {
		this.monthOpen = false;
		this.dayViewKey += 1;
		this.pendingDayCellFocus = true;
		this.focusCalendar();
	}

	/** @private */
	handleYearBackToDay() {
		this.yearOpen = false;
		this.dayViewKey += 1;
		this.pendingDayCellFocus = true;
		this.focusCalendar();
	}

	/** @private */
	setDateForMonthYear(year: number, month: number, baseDate: Date = this.date) {
		const currentDay = baseDate.getDate();
		const maxDay = new Date(year, month + 1, 0).getDate();
		const clampedDay = Math.min(currentDay, maxDay);

		return new Date(year, month, clampedDay);
	}

	/** @private */
	handleMonthLabelClick() {
		if (this.monthOpen) {
			this.monthOpen = false;
			return;
		}
		this.yearOpen = false;
		this.monthOpen = true;
	}

	/** @private */
	handleMonthLabelKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopPropagation();
			this.handleMonthLabelClick();
		}
	};

	/** @private */
	handleYearLabelClick() {
		if (this.yearOpen) {
			this.yearOpen = false;
			return;
		}
		this.monthOpen = false;
		this.yearOpen = true;
	}

	/** @private */
	handleYearLabelKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopPropagation();
			this.handleYearLabelClick();
		}
	}

	/**
	 * Toggles the calendar popup. The calendar icon button is the sole trigger —
	 * the input itself neither opens nor closes the popup (it is used only for
	 * typing a date). Being a native button, it also activates on Enter/Space.
	 * @private
	 */
	handleTriggerClick = () => {
		if (this.disabled) {
			return;
		}
		this.open = !this.open;
	};

	/* istanbul ignore next */
	handleDocumentKeyDown = (event: KeyboardEvent) => {
		if (this.disabled) {
			return;
		}

		if (event.key === 'Escape' && this.open) {
			event.preventDefault();
			event.stopPropagation();
			void this.datePickerHide().then(() => {
				this.triggerButton?.focus();
			});
			return;
		}
	};

	/** @private */
	formatMonth(dateStyle: 'short', locale?: string) {
		return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', dateStyle: dateStyle });
	}

	/** @private */
	previousClicked() {
		if (this.yearOpen) {
			this.yearsList = this.getYearsList(this.yearsList[10] - 12);
		} else {
			const currentMonth = this.displayDate.getMonth();
			const currentYear = this.displayDate.getFullYear();
			const targetMonth = currentMonth === 0 ? 11 : currentMonth - 1;
			const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;

			this.displayDate = this.setDateForMonthYear(targetYear, targetMonth, this.displayDate);
			this.headerDate = new Date(this.displayDate);
		}
	}

	/** @private */
	nextClicked() {
		if (this.yearOpen) {
			this.yearsList = this.getYearsList(this.yearsList[10] + 12);
		} else {
			const currentMonth = this.displayDate.getMonth();
			const currentYear = this.displayDate.getFullYear();
			const targetMonth = currentMonth === 11 ? 0 : currentMonth + 1;
			const targetYear = currentMonth === 11 ? currentYear + 1 : currentYear;

			this.displayDate = this.setDateForMonthYear(targetYear, targetMonth, this.displayDate);
			this.headerDate = new Date(this.displayDate);
		}
	}

	/** @private */
	getMonth(locale: string | Intl.Locale = 'en-US', format: 'short' | 'long' = 'long', month: number = 0) {
		const formatter = new Intl.DateTimeFormat(locale, { month: format });
		// Using the 15th to avoid timezone shifts near the month boundaries
		return formatter.format(new Date(2024, month, 15));
	}

	/** @private */
	getMonthsList(locale: string | Intl.Locale = 'en-US', format: 'short' | 'long' = 'long') {
		return Array.from({ length: 12 }, (_, i) => {
			return this.getMonth(locale, format, i);
		});
	}

	/** @private */
	getCurrentYear() {
		return new Date().getFullYear();
	}

	/** @private */
	getYearsList(year: number) {
		const startYear = year - 10;
		const endYear = year + 2;
		return Array.from({ length: endYear - startYear }, (_, i) => startYear + i);
	}

	/** @private */
	render() {
		const dateValue = this.formatDateValue(this.date);
		const focusedDateValue = this.formatDateValue(this.displayDate);
		const currentMonth = this.getMonth(this.locale, 'long', this.headerDate.getMonth());
		const activeView = this.monthOpen ? 'month' : this.yearOpen ? 'year' : 'day';
		const popupBodyClass = [
			'shadow-sm-bottom p-3 rounded-lg origin-top transition-all duration-200 ease-in-out',
			this.popupVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-[0.98]',
			this.popupClosing ? 'pointer-events-none' : ''
		]
			.filter(Boolean)
			.join(' ');
		const getViewPanelClass = (view: 'day' | 'month' | 'year') => {
			const isActive = activeView === view;
			const hiddenOffset = view === 'day' ? 'translate-y-1' : '-translate-y-1';

			return [
				'col-start-1 row-start-1 transition-all duration-200 ease-in-out',
				isActive
					? 'opacity-100 visible pointer-events-auto translate-y-0'
					: `opacity-0 invisible pointer-events-none ${hiddenOffset}`
			]
				.filter(Boolean)
				.join(' ');
		};
		const headerStyles =
			'body-default text-default p-1 rounded focus:outline focus:outline-width-lg focus:-outline-offset-2 focus-visible:outline-width-lg focus:outline-focus-ring-default focus-visible:ring-focus-ring-default hover:bg-default-hover hover:cursor-pointer rounded-md';
		const chevronButtonStyles = 'text-subtle hover:bg-default-hover rounded-lg';

		return (
			<Host>
				<dv-popup ref={(el) => (this.popup = el)} distance={8} placement="bottom">
					<dv-base-input
						slot="anchor"
						id={this.nameValue}
						label={this.label}
						type="date"
						value={dateValue}
						disabled={this.disabled}
						size={this.size}
						onValueChange={this.handleInputValueChange}
						onChange={this.handleInputChange}
					>
						<dv-icon-button
							ref={(el) => (this.triggerButton = el as HTMLDvIconButtonElement)}
							slot="actions"
							name="calendar"
							label="Toggle calendar"
							type="button"
							disabled={this.disabled}
							onClick={() => this.handleTriggerClick()}
						></dv-icon-button>
					</dv-base-input>
					<div ref={(el) => (this.body = el)} class={popupBodyClass}>
						<div class="flex flex-col">
							<div class="flex justify-center items-center gap-2">
								{!this.monthOpen && (
									<dv-icon-button
										name="chevron-left"
										class={chevronButtonStyles}
										onClick={() => this.previousClicked()}
									></dv-icon-button>
								)}
								<div class="flex justify-center w-full">
									<div
										class={headerStyles}
										tabIndex={0}
										onClick={() => this.handleMonthLabelClick()}
										onKeyDown={this.handleMonthLabelKeydown}
										role="button"
									>
										{currentMonth}
									</div>
									<div
										class={headerStyles}
										tabIndex={0}
										onClick={() => this.handleYearLabelClick()}
										onKeyDown={(event) => this.handleYearLabelKeydown(event)}
										role="button"
									>
										{this.headerDate.getFullYear()}
									</div>
								</div>
								{!this.monthOpen && (
									<dv-icon-button
										name="chevron-right"
										class={chevronButtonStyles}
										onClick={() => this.nextClicked()}
									></dv-icon-button>
								)}
							</div>
							<div class="relative grid mt-1" data-view={activeView}>
								<div class={getViewPanelClass('month')}>
									<div class="mt-2">
										<div class="grid grid-cols-3 justify-items-center">
											{this.getMonthsList(this.locale, 'short').map((name, index) => (
												<dv-date-picker-button
													selected={index === this.date.getMonth()}
													onClick={() => this.handleMonthClick(index)}
												>
													{name}
												</dv-date-picker-button>
											))}
										</div>
										<dv-divider></dv-divider>
										<dv-button
											class="flex justify-self-center"
											variant="text"
											size="sm"
											onClick={() => this.handleMonthBackToDay()}
										>
											<dv-icon name="chevron-left" slot="startIcon"></dv-icon>
											Back to day
										</dv-button>
									</div>
								</div>
								<div class={getViewPanelClass('year')}>
									<div class="mt-1">
										<div class="grid grid-cols-3 justify-items-center">
											{this.yearsList.map((name) => (
												<dv-date-picker-button
													selected={name === this.date.getFullYear()}
													onClick={() => this.handleYearClick(name)}
												>
													{name}
												</dv-date-picker-button>
											))}
										</div>
										<dv-divider></dv-divider>
										<dv-button
											class="flex justify-self-center"
											variant="text"
											size="sm"
											onClick={() => this.handleYearBackToDay()}
										>
											<dv-icon name="chevron-left" slot="startIcon"></dv-icon>
											Back to day
										</dv-button>
									</div>
								</div>
								<div
									class={getViewPanelClass('day')}
									ref={(el) => (this.dayPanel = el as HTMLElement)}
									onTransitionEnd={this.handleDayPanelTransitionEnd}
								>
									<calendar-date
										key={`day-view-${this.dayViewKey}`}
										ref={(el) => this.setCalendarRef(el as HTMLElement | null)}
										firstDayOfWeek={0}
										value={dateValue}
										focusedDate={focusedDateValue}
										onChange={(event) => this.newDateSelected(event)}
										onFocusday={(event) => this.calendarFocusChanged(event)}
									>
										<calendar-month></calendar-month>
									</calendar-date>
								</div>
							</div>
						</div>
					</div>
				</dv-popup>
			</Host>
		);
	}
}

