import type { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';
import type { DvDatePicker } from './dv-date-picker';

jest.mock('cally', () => ({}), { virtual: true });

interface TypedSpecPage<T> extends Omit<SpecPage, 'root'> {
	root?: HTMLElement & T;
}

describe('dv-date-picker', () => {
	let datePicker: TypedSpecPage<DvDatePicker>;
	const getDatePickerInstance = () => datePicker.rootInstance as DvDatePicker & { [key: string]: any };

	beforeEach(async () => {
		const { DvDatePicker } = await import('./dv-date-picker');

		datePicker = (await newSpecPage({
			components: [DvDatePicker],
			html: `<dv-date-picker></dv-date-picker>`,
			supportsShadowDom: true
		})) as TypedSpecPage<DvDatePicker>;
	});

	afterEach(() => {
		datePicker = null;
	});

	describe('Initialization with default state', () => {
		it('should render with default properties', async () => {
			await datePicker.waitForChanges();
			expect(true).toBe(true);
		});

		it('should render textfield without disabled styling by default', async () => {
			await datePicker.waitForChanges();

			const textfield = datePicker.root.shadowRoot.querySelector('dv-base-input');
			expect(textfield).not.toBeNull();
			expect(textfield).not.toHaveAttribute('disabled');
		});

		it('should render textfield with medium size by default', async () => {
			await datePicker.waitForChanges();

			const textfield = datePicker.root.shadowRoot.querySelector('dv-base-input');
			expect(textfield).not.toBeNull();
			expect(textfield.getAttribute('size')).toBe('md');
		});

		it('should initialize the calendar to a valid value prop', async () => {
			const { DvDatePicker } = await import('./dv-date-picker');

			const page = (await newSpecPage({
				components: [DvDatePicker],
				html: `<dv-date-picker value="2025-03-15"></dv-date-picker>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvDatePicker>;
			const instance = page.rootInstance as DvDatePicker & { [key: string]: any };

			expect(instance.date.getFullYear()).toBe(2025);
			expect(instance.date.getMonth()).toBe(2);
			expect(instance.date.getDate()).toBe(15);
		});

		it('should fall back to today when the value prop cannot be parsed', async () => {
			const { DvDatePicker } = await import('./dv-date-picker');

			const page = (await newSpecPage({
				components: [DvDatePicker],
				html: `<dv-date-picker value="not-a-date"></dv-date-picker>`,
				supportsShadowDom: true
			})) as TypedSpecPage<DvDatePicker>;
			const instance = page.rootInstance as DvDatePicker & { [key: string]: any };

			const today = new Date();
			expect(instance.date.getFullYear()).toBe(today.getFullYear());
			expect(instance.date.getMonth()).toBe(today.getMonth());
			expect(instance.date.getDate()).toBe(today.getDate());
		});
	});

	describe('Props', () => {
		it('should render textfield with correct label when label prop set', async () => {
			datePicker.root.label = 'Select Date';
			await datePicker.waitForChanges();

			const textfield = datePicker.root.shadowRoot.querySelector('dv-base-input');
			expect(textfield.getAttribute('label')).not.toBeNull();
			expect(textfield.getAttribute('label')).toBe('Select Date');
		});

		it('should render textfield as disabled when disabled prop is true', async () => {
			datePicker.root.disabled = true;
			await datePicker.waitForChanges();

			const textfield = datePicker.root.shadowRoot.querySelector('dv-base-input');
			expect(textfield).not.toBeNull();
			expect(textfield).toHaveAttribute('disabled');
		});

		it('should prevent calendar from opening when disabled prop is true', async () => {
			datePicker.root.disabled = true;
			await datePicker.waitForChanges();

			const trigger = datePicker.root.shadowRoot.querySelector('dv-icon-button[name="calendar"]') as HTMLElement;
			trigger.click();

			expect(datePicker.root.open).toBe(false);
		});

		it('should close calendar when disabled prop is set to true while calendar is open', async () => {
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			expect(datePicker.rootInstance.popup.active).toBe(true);
			expect(datePicker.rootInstance.body.hidden).toBe(false);

			datePicker.root.disabled = true;
			await datePicker.waitForChanges();

			expect(datePicker.rootInstance.popup.active).toBe(false);
			expect(datePicker.rootInstance.body.hidden).toBe(true);
		});

		it('should render textfield with small size when size prop is set to sm', async () => {
			datePicker.root.size = 'sm';
			await datePicker.waitForChanges();

			const textfield = datePicker.root.shadowRoot.querySelector('dv-base-input');
			expect(textfield).not.toBeNull();
			expect(textfield.getAttribute('size')).toBe('sm');
		});
	});

	describe('Methods', () => {
		it('should open date picker when the calendar icon button is clicked', async () => {
			await datePicker.waitForChanges();

			expect(datePicker.root.open).toBe(false);

			const trigger = datePicker.root.shadowRoot.querySelector('dv-icon-button[name="calendar"]') as HTMLElement;
			trigger.click();
			await datePicker.waitForChanges();

			expect(datePicker.root.open).toBe(true);
			expect(datePicker.rootInstance.popup.active).toBe(true);
			expect(datePicker.rootInstance.body.hidden).toBe(false);
		});

		it('should toggle the popup open and closed via the trigger and respect disabled', () => {
			const instance = getDatePickerInstance();
			instance.disabled = false;
			instance.open = false;

			instance.handleTriggerClick();
			expect(instance.open).toBe(true);

			instance.handleTriggerClick();
			expect(instance.open).toBe(false);

			instance.disabled = true;
			instance.handleTriggerClick();
			expect(instance.open).toBe(false);
		});

		it('should not open or close on Enter or Space from the input', () => {
			const instance = getDatePickerInstance();

			instance.open = false;
			instance.handleDocumentKeyDown({
				key: 'Enter',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent);
			expect(instance.open).toBe(false);

			instance.open = true;
			instance.handleDocumentKeyDown({
				key: ' ',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent);
			expect(instance.open).toBe(true);
		});

		it('should open month picker when month label is clicked', async () => {
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const labels = Array.from(
				datePicker.root.shadowRoot.querySelectorAll('div.flex.justify-center.w-full div')
			) as HTMLElement[];
			labels[0].click();

			expect(datePicker.rootInstance.monthOpen).toBe(true);
		});

		it('should open month picker on month label Enter', () => {
			const instance = getDatePickerInstance();

			const event = {
				key: 'Enter',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent;

			instance.handleMonthLabelKeydown(event);

			expect(instance.monthOpen).toBe(true);
		});

		it('should keep picker open after selecting a month and return to day calendar', () => {
			const instance = getDatePickerInstance();
			instance.open = true;
			instance.monthOpen = true;
			instance.yearOpen = false;
			instance.displayDate = new Date(2026, 4, 20);

			instance.handleMonthClick(6);

			expect(instance.open).toBe(true);
			expect(instance.monthOpen).toBe(false);
			expect(instance.yearOpen).toBe(false);
			expect(instance.displayDate.getMonth()).toBe(6);
		});

		it('should open year picker when year label is clicked', async () => {
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const labels = Array.from(
				datePicker.root.shadowRoot.querySelectorAll('div.flex.justify-center.w-full div')
			) as HTMLElement[];
			labels[1].click();

			expect(datePicker.rootInstance.yearOpen).toBe(true);
		});

		it('should open year picker on year label on Space', () => {
			const instance = getDatePickerInstance();

			const event = {
				key: ' ',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent;

			instance.handleYearLabelKeydown(event);

			expect(instance.yearOpen).toBe(true);
		});

		it('should keep picker open after selecting a year and return to day calendar', () => {
			const instance = getDatePickerInstance();
			instance.open = true;
			instance.monthOpen = false;
			instance.yearOpen = true;
			instance.displayDate = new Date(2026, 4, 20);

			instance.handleYearClick(2028);

			expect(instance.open).toBe(true);
			expect(instance.monthOpen).toBe(false);
			expect(instance.yearOpen).toBe(false);
			expect(instance.displayDate.getFullYear()).toBe(2028);
		});

		it('should return focus to calendar after selecting month or year', () => {
			const instance = getDatePickerInstance();
			const focusMock = jest.fn();
			instance['calendar'] = { focus: focusMock } as unknown as HTMLElement;

			const originalRaf = globalThis.requestAnimationFrame;
			(globalThis as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame =
				(cb: FrameRequestCallback): number => {
					cb(0);
					return 1;
				};

			instance.handleMonthClick(6);
			instance.handleYearClick(2028);

			expect(focusMock).toHaveBeenCalledTimes(2);
			(globalThis as unknown as { requestAnimationFrame: typeof originalRaf }).requestAnimationFrame = originalRaf;
		});

		it('should close date picker popup on Escape key when open', () => {
			const instance = getDatePickerInstance();
			instance.open = true;
			instance['triggerButton'] = { focus: jest.fn() } as unknown as HTMLDvIconButtonElement;

			const event = new KeyboardEvent('keydown', { key: 'Escape' });
			instance.handleDocumentKeyDown(event);

			expect(instance.open).toBe(false);
		});

		it('should update calendar ref when calendar element is remounted', () => {
			const instance = getDatePickerInstance();

			const oldCalendar = {
				addEventListener: jest.fn(),
				removeEventListener: jest.fn()
			} as unknown as HTMLElement;
			const newCalendar = {
				addEventListener: jest.fn(),
				removeEventListener: jest.fn()
			} as unknown as HTMLElement;

			instance['setCalendarRef'](oldCalendar);
			instance['setCalendarRef'](newCalendar);

			expect(instance['calendar']).toBe(newCalendar);
		});

		it('should update display month/year on keyboard focus navigation without changing selected value', () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 23);
			instance.displayDate = new Date(2026, 4, 23);
			instance.headerDate = new Date(2026, 4, 23);
			instance.dateChanged();

			const focusEvent = {
				detail: '2026-06-02'
			} as unknown as Event;

			instance.calendarFocusChanged(focusEvent);

			expect(instance.headerDate.getFullYear()).toBe(2026);
			expect(instance.headerDate.getMonth()).toBe(5);
			expect(instance.displayDate.getDate()).toBe(23);
			expect(instance.displayDate.getMonth()).toBe(4);
			expect(instance.date.getFullYear()).toBe(2026);
			expect(instance.date.getMonth()).toBe(4);
			expect(instance.date.getDate()).toBe(23);
			expect(instance.value).toBe('2026-05-23');
		});

		it('should not change selected value when navigating month until a day is selected', () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 23);
			instance.displayDate = new Date(2026, 4, 23);
			instance.dateChanged();

			instance.previousClicked();

			expect(instance.value).toBe('2026-05-23');
			expect(instance.date.getMonth()).toBe(4);
			expect(instance.displayDate.getMonth()).toBe(3);
		});

		it('should set ISO date value on the base input after calendar date selection', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 20);
			instance.displayDate = new Date(2026, 4, 20);
			await datePicker.waitForChanges();

			const selectEvent = {
				detail: '2026-05-21',
				target: {
					value: '2026-05-21'
				}
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);
			await datePicker.waitForChanges();

			// The inner control is `<input type="date">`, so its value is the ISO
			// `yyyy-mm-dd` string; the browser renders the locale-aware display itself.
			const textfield = datePicker.root.shadowRoot.querySelector('dv-base-input') as HTMLElement;

			expect(datePicker.root.value).toBe('2026-05-21');
			expect(textfield.getAttribute('value')).toBe('2026-05-21');
		});

		it('should keep current month/year when day is selected after next/previous navigation', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 20);
			instance.displayDate = new Date(2026, 4, 20);

			instance.previousClicked();
			expect(instance.date.getMonth()).toBe(4);
			expect(instance.displayDate.getMonth()).toBe(3);

			const selectEvent = {
				target: {
					value: '2026-04-09'
				}
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);

			expect(instance.date.getFullYear()).toBe(2026);
			expect(instance.date.getMonth()).toBe(3);
			expect(instance.date.getDate()).toBe(9);
			expect(instance.value).toBe('2026-04-09');
		});

		it('should keep month from header month menu when selecting a new day', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 31);
			instance.displayDate = new Date(2026, 4, 31);

			instance.handleMonthClick(3);
			expect(instance.date.getMonth()).toBe(4);
			expect(instance.displayDate.getMonth()).toBe(3);

			const selectEvent = {
				target: {
					value: '2026-04-12'
				}
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);

			expect(instance.date.getFullYear()).toBe(2026);
			expect(instance.date.getMonth()).toBe(3);
			expect(instance.date.getDate()).toBe(12);
			expect(instance.value).toBe('2026-04-12');
		});

		it('should keep year from header year menu when selecting a new day', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2024, 1, 29);
			instance.displayDate = new Date(2024, 1, 29);

			instance.handleYearClick(2025);
			expect(instance.date.getFullYear()).toBe(2024);
			expect(instance.displayDate.getFullYear()).toBe(2025);

			const selectEvent = {
				target: {
					value: '2025-02-14'
				}
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);

			expect(instance.date.getFullYear()).toBe(2025);
			expect(instance.date.getMonth()).toBe(1);
			expect(instance.date.getDate()).toBe(14);
			expect(instance.value).toBe('2025-02-14');
		});

		it('should keep month when selecting a new day after next button navigation', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 0, 31);
			instance.displayDate = new Date(2026, 0, 31);

			instance.nextClicked();
			expect(instance.date.getMonth()).toBe(0);
			expect(instance.displayDate.getMonth()).toBe(1);

			const selectEvent = {
				target: {
					value: '2026-02-08'
				}
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);

			expect(instance.date.getFullYear()).toBe(2026);
			expect(instance.date.getMonth()).toBe(1);
			expect(instance.date.getDate()).toBe(8);
			expect(instance.value).toBe('2026-02-08');
		});

		it('should update selected date on first click after month/year changes', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 0, 10);
			instance.displayDate = new Date(2026, 0, 10);

			instance.handleMonthClick(1);
			instance.handleYearClick(2027);

			const selectEvent = {
				detail: '2027-02-15',
				target: {
					value: '2027-02-10'
				}
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);

			expect(instance.value).toBe('2027-02-15');
			expect(instance.date.getFullYear()).toBe(2027);
			expect(instance.date.getMonth()).toBe(1);
			expect(instance.date.getDate()).toBe(15);
		});

		it('should fall back to target value when change event detail is missing', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 0, 10);
			instance.displayDate = new Date(2026, 0, 10);

			const selectEvent = {
				target: {
					value: '2026-01-22'
				}
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);

			expect(instance.value).toBe('2026-01-22');
			expect(instance.date.getFullYear()).toBe(2026);
			expect(instance.date.getMonth()).toBe(0);
			expect(instance.date.getDate()).toBe(22);
		});

		it('should prefer calendar value over stale target value', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 31);
			instance.displayDate = new Date(2026, 4, 31);
			instance.previousClicked();

			instance['calendar'] = {
				value: '2026-04-30'
			} as unknown as HTMLElement;

			const selectEvent = {
				target: {
					value: '2026-04-31'
				}
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);

			expect(instance.date.getFullYear()).toBe(2026);
			expect(instance.date.getMonth()).toBe(3);
			expect(instance.date.getDate()).toBe(30);
			expect(instance.value).toBe('2026-04-30');
		});

		it('should apply animated popup classes when opened and closed', async () => {
			const originalRaf = globalThis.requestAnimationFrame;
			(globalThis as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame =
				(cb: FrameRequestCallback): number => {
					cb(0);
					return 1;
				};

			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const popupBody = datePicker.root.shadowRoot.querySelector('dv-popup > div') as HTMLElement;
			expect(popupBody).not.toBeNull();
			expect(popupBody.className).toContain('transition-all');
			expect(popupBody.className).toContain('duration-200');
			expect(popupBody.className).toContain('opacity-100');
			expect(popupBody.className).toContain('translate-y-0');

			datePicker.root.open = false;
			await datePicker.waitForChanges();

			expect(popupBody.className).toContain('opacity-0');
			expect(popupBody.className).toContain('-translate-y-1');
			expect(popupBody.className).toContain('pointer-events-none');

			(globalThis as unknown as { requestAnimationFrame: typeof originalRaf }).requestAnimationFrame = originalRaf;
		});

		it('should apply active and inactive animation classes for month/day/year panels', async () => {
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const instance = getDatePickerInstance();
			instance.monthOpen = true;
			instance.yearOpen = false;
			await datePicker.waitForChanges();

			const panels = Array.from(
				datePicker.root.shadowRoot.querySelectorAll('div.relative.grid.mt-1 > div')
			) as HTMLElement[];
			const [monthPanel, yearPanel, dayPanel] = panels;

			expect(monthPanel.className).toContain('opacity-100');
			expect(monthPanel.className).toContain('pointer-events-auto');
			expect(dayPanel.className).toContain('opacity-0');
			expect(dayPanel.className).toContain('pointer-events-none');

			instance.monthOpen = false;
			instance.yearOpen = true;
			await datePicker.waitForChanges();

			expect(yearPanel.className).toContain('opacity-100');
			expect(yearPanel.className).toContain('pointer-events-auto');
			expect(monthPanel.className).toContain('opacity-0');
			expect(monthPanel.className).toContain('pointer-events-none');
		});

		it('should reflect a keyboard-typed date into the calendar via valueChange', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 0, 1);
			instance.displayDate = new Date(2026, 0, 1);
			instance.headerDate = new Date(2026, 0, 1);
			await datePicker.waitForChanges();

			const event = {
				detail: { value: '2026-08-15' },
				stopPropagation: jest.fn()
			} as unknown as Event;

			instance.handleInputValueChange(event);
			await datePicker.waitForChanges();

			expect(event.stopPropagation).toHaveBeenCalledTimes(1);
			expect(instance.date.getFullYear()).toBe(2026);
			expect(instance.date.getMonth()).toBe(7);
			expect(instance.date.getDate()).toBe(15);
			expect(instance.displayDate.getMonth()).toBe(7);
			expect(instance.headerDate.getMonth()).toBe(7);
			expect(instance.value).toBe('2026-08-15');

			const calendar = datePicker.root.shadowRoot.querySelector('calendar-date');
			expect(calendar.getAttribute('value')).toBe('2026-08-15');
			expect(calendar.getAttribute('focusedDate')).toBe('2026-08-15');
		});

		it('should ignore an invalid or cleared keyboard value on valueChange', () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 0, 1);
			instance.displayDate = new Date(2026, 0, 1);
			instance.headerDate = new Date(2026, 0, 1);
			instance.dateChanged();

			const event = {
				detail: { value: '' },
				stopPropagation: jest.fn()
			} as unknown as Event;

			instance.handleInputValueChange(event);

			expect(event.stopPropagation).toHaveBeenCalledTimes(1);
			expect(instance.value).toBe('2026-01-01');
			expect(instance.date.getMonth()).toBe(0);
			expect(instance.date.getDate()).toBe(1);
		});

		it('should run day panel transition hardening focus only for supported transition events', () => {
			const instance = getDatePickerInstance();
			const focusAfterTransitionSpy = jest.spyOn(instance as any, 'focusDayCellAfterTransition');

			instance.pendingDayCellFocus = true;
			instance.open = true;
			instance.monthOpen = false;
			instance.yearOpen = false;
			instance['dayPanel'] = {} as HTMLElement;

			const ignoredEvent = {
				target: instance['dayPanel'],
				propertyName: 'width'
			} as unknown as TransitionEvent;
			instance['handleDayPanelTransitionEnd'](ignoredEvent);
			expect(focusAfterTransitionSpy).not.toHaveBeenCalled();

			const validEvent = {
				target: instance['dayPanel'],
				propertyName: 'opacity'
			} as unknown as TransitionEvent;
			instance['handleDayPanelTransitionEnd'](validEvent);
			expect(focusAfterTransitionSpy).toHaveBeenCalledTimes(1);
		});

		it('should skip transition focus when no focus is pending or the target is not the day panel', () => {
			const instance = getDatePickerInstance();
			const focusAfterTransitionSpy = jest.spyOn(instance as any, 'focusDayCellAfterTransition');
			instance['dayPanel'] = {} as HTMLElement;

			instance.pendingDayCellFocus = false;
			instance['handleDayPanelTransitionEnd']({
				target: instance['dayPanel'],
				propertyName: 'opacity'
			} as unknown as TransitionEvent);

			instance.pendingDayCellFocus = true;
			instance['handleDayPanelTransitionEnd']({
				target: {},
				propertyName: 'opacity'
			} as unknown as TransitionEvent);

			expect(focusAfterTransitionSpy).not.toHaveBeenCalled();
		});

		it('should skip transition focus while a month or year view is open', () => {
			const instance = getDatePickerInstance();
			const focusAfterTransitionSpy = jest.spyOn(instance as any, 'focusDayCellAfterTransition');
			instance['dayPanel'] = {} as HTMLElement;
			instance.pendingDayCellFocus = true;
			instance.open = true;
			instance.monthOpen = true;
			instance.yearOpen = false;

			instance['handleDayPanelTransitionEnd']({
				target: instance['dayPanel'],
				propertyName: 'transform'
			} as unknown as TransitionEvent);

			expect(focusAfterTransitionSpy).not.toHaveBeenCalled();
		});

		it('should focus the first focusable day cell once the day panel transition completes', () => {
			const instance = getDatePickerInstance();
			const dayCell = { focus: jest.fn() };
			instance['calendar'] = {
				focus: jest.fn(),
				querySelector: jest.fn(() => null),
				shadowRoot: {
					querySelector: jest.fn((selector: string) => (selector === '[aria-selected="true"]' ? dayCell : null))
				}
			} as unknown as HTMLElement;
			instance['dayPanel'] = {} as HTMLElement;
			instance.pendingDayCellFocus = true;
			instance.open = true;
			instance.monthOpen = false;
			instance.yearOpen = false;

			const originalRaf = globalThis.requestAnimationFrame;
			(globalThis as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame =
				(cb: FrameRequestCallback): number => {
					cb(0);
					return 1;
				};

			instance['handleDayPanelTransitionEnd']({
				target: instance['dayPanel'],
				propertyName: 'opacity'
			} as unknown as TransitionEvent);

			expect(dayCell.focus).toHaveBeenCalledTimes(1);
			expect(instance.pendingDayCellFocus).toBe(false);
			(globalThis as unknown as { requestAnimationFrame: typeof originalRaf }).requestAnimationFrame = originalRaf;
		});

		it('should fall back to focusing the calendar when no day cell is found', () => {
			const instance = getDatePickerInstance();
			const calendarFocus = jest.fn();
			instance['calendar'] = {
				focus: calendarFocus,
				querySelector: jest.fn(() => null),
				shadowRoot: { querySelector: jest.fn(() => null) }
			} as unknown as HTMLElement;
			instance['dayPanel'] = {} as HTMLElement;
			instance.pendingDayCellFocus = true;
			instance.open = true;
			instance.monthOpen = false;
			instance.yearOpen = false;

			const originalRaf = globalThis.requestAnimationFrame;
			(globalThis as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame =
				(cb: FrameRequestCallback): number => {
					cb(0);
					return 1;
				};

			instance['handleDayPanelTransitionEnd']({
				target: instance['dayPanel'],
				propertyName: 'opacity'
			} as unknown as TransitionEvent);

			expect(calendarFocus).toHaveBeenCalledTimes(1);
			expect(instance.pendingDayCellFocus).toBe(false);
			(globalThis as unknown as { requestAnimationFrame: typeof originalRaf }).requestAnimationFrame = originalRaf;
		});

		it('should search the month root and calendar root to find a focusable day cell', () => {
			const instance = getDatePickerInstance();
			const dayCell = { focus: jest.fn() };
			const monthElement = {
				shadowRoot: { querySelector: jest.fn(() => null) }
			};
			instance['calendar'] = {
				focus: jest.fn(),
				querySelector: jest.fn((selector: string) => (selector === 'calendar-month' ? monthElement : null)),
				shadowRoot: {
					querySelector: jest.fn((selector: string) =>
						selector === '[tabindex]:not([tabindex="-1"])' ? dayCell : null
					)
				}
			} as unknown as HTMLElement;
			instance['dayPanel'] = {} as HTMLElement;
			instance.pendingDayCellFocus = true;
			instance.open = true;
			instance.monthOpen = false;
			instance.yearOpen = false;

			const originalRaf = globalThis.requestAnimationFrame;
			(globalThis as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame =
				(cb: FrameRequestCallback): number => {
					cb(0);
					return 1;
				};

			instance['handleDayPanelTransitionEnd']({
				target: instance['dayPanel'],
				propertyName: 'opacity'
			} as unknown as TransitionEvent);

			// The month root is searched first and exhausted, then the calendar
			// root yields the day cell via the final fallback selector.
			expect(monthElement.shadowRoot.querySelector).toHaveBeenCalled();
			expect(dayCell.focus).toHaveBeenCalledTimes(1);
			expect(instance.pendingDayCellFocus).toBe(false);
			(globalThis as unknown as { requestAnimationFrame: typeof originalRaf }).requestAnimationFrame = originalRaf;
		});

		it('should tolerate a missing calendar reference when hardening focus', () => {
			const instance = getDatePickerInstance();
			instance['calendar'] = null as unknown as HTMLElement;
			instance['dayPanel'] = {} as HTMLElement;
			instance.pendingDayCellFocus = true;
			instance.open = true;
			instance.monthOpen = false;
			instance.yearOpen = false;

			const originalRaf = globalThis.requestAnimationFrame;
			(globalThis as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame =
				(cb: FrameRequestCallback): number => {
					cb(0);
					return 1;
				};

			expect(() =>
				instance['handleDayPanelTransitionEnd']({
					target: instance['dayPanel'],
					propertyName: 'opacity'
				} as unknown as TransitionEvent)
			).not.toThrow();

			expect(instance.pendingDayCellFocus).toBe(false);
			(globalThis as unknown as { requestAnimationFrame: typeof originalRaf }).requestAnimationFrame = originalRaf;
		});

		it('should not focus when the calendar element lacks a focus method', () => {
			const instance = getDatePickerInstance();
			instance['calendar'] = {
				querySelector: jest.fn(() => null),
				shadowRoot: { querySelector: jest.fn(() => null) }
			} as unknown as HTMLElement;
			instance['dayPanel'] = {} as HTMLElement;
			instance.pendingDayCellFocus = true;
			instance.open = true;
			instance.monthOpen = false;
			instance.yearOpen = false;

			const originalRaf = globalThis.requestAnimationFrame;
			(globalThis as unknown as { requestAnimationFrame: (cb: FrameRequestCallback) => number }).requestAnimationFrame =
				(cb: FrameRequestCallback): number => {
					cb(0);
					return 1;
				};

			expect(() =>
				instance['handleDayPanelTransitionEnd']({
					target: instance['dayPanel'],
					propertyName: 'opacity'
				} as unknown as TransitionEvent)
			).not.toThrow();

			expect(instance.pendingDayCellFocus).toBe(false);
			(globalThis as unknown as { requestAnimationFrame: typeof originalRaf }).requestAnimationFrame = originalRaf;
		});

		it('should ignore a date selection when no value can be resolved from the event', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 20);
			instance.displayDate = new Date(2026, 4, 20);
			instance.dateChanged();
			instance['calendar'] = undefined as unknown as HTMLElement;
			const changeSpy = jest.spyOn(instance.change, 'emit');

			const selectEvent = {
				detail: undefined,
				target: null
			} as unknown as Event;

			await instance.newDateSelected(selectEvent);

			expect(changeSpy).not.toHaveBeenCalled();
			expect(instance.value).toBe('2026-05-20');
		});

		it('should apply default locale, format, and month when formatting month names', () => {
			const instance = getDatePickerInstance();

			expect(instance.getMonth()).toBe('January');

			const months = instance.getMonthsList();
			expect(months).toHaveLength(12);
			expect(months[0]).toBe('January');
			expect(months[11]).toBe('December');
		});

		it('should return to the day view from the month view via back to day', () => {
			const instance = getDatePickerInstance();
			instance.monthOpen = true;
			const previousKey = instance.dayViewKey;

			instance.handleMonthBackToDay();

			expect(instance.monthOpen).toBe(false);
			expect(instance.pendingDayCellFocus).toBe(true);
			expect(instance.dayViewKey).toBe(previousKey + 1);
		});

		it('should return to the day view from the year view via back to day', () => {
			const instance = getDatePickerInstance();
			instance.yearOpen = true;
			const previousKey = instance.dayViewKey;

			instance.handleYearBackToDay();

			expect(instance.yearOpen).toBe(false);
			expect(instance.pendingDayCellFocus).toBe(true);
			expect(instance.dayViewKey).toBe(previousKey + 1);
		});

		it('should close the month view when the month label is clicked while already open', () => {
			const instance = getDatePickerInstance();
			instance.monthOpen = true;

			instance.handleMonthLabelClick();

			expect(instance.monthOpen).toBe(false);
		});

		it('should close the year view when the year label is clicked while already open', () => {
			const instance = getDatePickerInstance();
			instance.yearOpen = true;

			instance.handleYearLabelClick();

			expect(instance.yearOpen).toBe(false);
		});

		it('should ignore month label keydown for keys other than Enter or Space', () => {
			const instance = getDatePickerInstance();
			const event = {
				key: 'Tab',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent;

			instance.handleMonthLabelKeydown(event);

			expect(instance.monthOpen).toBe(false);
			expect(event.preventDefault).not.toHaveBeenCalled();
		});

		it('should ignore year label keydown for keys other than Enter or Space', () => {
			const instance = getDatePickerInstance();
			const event = {
				key: 'Tab',
				preventDefault: jest.fn(),
				stopPropagation: jest.fn()
			} as unknown as KeyboardEvent;

			instance.handleYearLabelKeydown(event);

			expect(instance.yearOpen).toBe(false);
			expect(event.preventDefault).not.toHaveBeenCalled();
		});

		it('should shift the year list backward when navigating previous in the year view', () => {
			const instance = getDatePickerInstance();
			instance.yearOpen = true;
			instance.yearsList = instance.getYearsList(2026);
			const anchor = instance.yearsList[10];

			instance.previousClicked();

			expect(instance.yearsList[10]).toBe(anchor - 12);
		});

		it('should shift the year list forward when navigating next in the year view', () => {
			const instance = getDatePickerInstance();
			instance.yearOpen = true;
			instance.yearsList = instance.getYearsList(2026);
			const anchor = instance.yearsList[10];

			instance.nextClicked();

			expect(instance.yearsList[10]).toBe(anchor + 12);
		});

		it('should wrap to December of the previous year when navigating previous from January', () => {
			const instance = getDatePickerInstance();
			instance.displayDate = new Date(2026, 0, 15);

			instance.previousClicked();

			expect(instance.displayDate.getMonth()).toBe(11);
			expect(instance.displayDate.getFullYear()).toBe(2025);
		});

		it('should wrap to January of the next year when navigating next from December', () => {
			const instance = getDatePickerInstance();
			instance.displayDate = new Date(2026, 11, 15);

			instance.nextClicked();

			expect(instance.displayDate.getMonth()).toBe(0);
			expect(instance.displayDate.getFullYear()).toBe(2027);
		});

		it('should default setDateForMonthYear to the current date when no base date is given', () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 20);

			const result = instance.setDateForMonthYear(2027, 7);

			expect(result.getFullYear()).toBe(2027);
			expect(result.getMonth()).toBe(7);
			expect(result.getDate()).toBe(20);
		});

		it('should ignore a valueChange event that carries no detail', () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 0, 1);
			instance.dateChanged();

			const event = {
				stopPropagation: jest.fn()
			} as unknown as Event;

			instance.handleInputValueChange(event);

			expect(event.stopPropagation).toHaveBeenCalledTimes(1);
			expect(instance.value).toBe('2026-01-01');
		});

		it('should ignore an invalid focused date on calendar focus change', () => {
			const instance = getDatePickerInstance();
			instance.headerDate = new Date(2026, 4, 20);

			instance.calendarFocusChanged({ detail: 'invalid' } as unknown as Event);

			expect(instance.headerDate.getFullYear()).toBe(2026);
			expect(instance.headerDate.getMonth()).toBe(4);
			expect(instance.headerDate.getDate()).toBe(20);
		});

		it('should ignore setting the calendar ref to the same element', () => {
			const instance = getDatePickerInstance();
			const calendar = { focus: jest.fn() } as unknown as HTMLElement;

			instance['setCalendarRef'](calendar);
			instance['setCalendarRef'](calendar);

			expect(instance['calendar']).toBe(calendar);
		});

		it('should parse a Date instance into a normalized date', () => {
			const instance = getDatePickerInstance();

			const parsed = instance.parseDateValue(new Date(2025, 2, 15, 10, 30));

			expect(parsed.getFullYear()).toBe(2025);
			expect(parsed.getMonth()).toBe(2);
			expect(parsed.getDate()).toBe(15);
		});

		it('should parse an object with year, month, and day fields', () => {
			const instance = getDatePickerInstance();

			const parsed = instance.parseDateValue({ year: 2025, month: 3, day: 15 });

			expect(parsed.getFullYear()).toBe(2025);
			expect(parsed.getMonth()).toBe(2);
			expect(parsed.getDate()).toBe(15);
		});

		it('should parse an object via its string representation', () => {
			const instance = getDatePickerInstance();

			const parsed = instance.parseDateValue({ toString: () => '2025-06-10' });

			expect(parsed.getFullYear()).toBe(2025);
			expect(parsed.getMonth()).toBe(5);
			expect(parsed.getDate()).toBe(10);
		});

		it('should return null for an object without a usable string representation', () => {
			const instance = getDatePickerInstance();

			expect(instance.parseDateValue({ foo: 'bar' })).toBeNull();
		});

		it('should return null for a non-string, non-object primitive value', () => {
			const instance = getDatePickerInstance();

			expect(instance.parseDateValue(12345)).toBeNull();
		});

		it('should return null for a malformed date string', () => {
			const instance = getDatePickerInstance();

			expect(instance.parseDateValue('not-a-date')).toBeNull();
		});

		it('should build a month formatter via formatMonth', () => {
			const instance = getDatePickerInstance();

			const formatter = instance.formatMonth('short', 'en-US');

			expect(typeof formatter.format(new Date(2024, 0, 15))).toBe('string');
		});

		it('should clear the pending close animation timeout when reopened before it settles', async () => {
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			datePicker.root.open = false;
			await datePicker.waitForChanges();

			const instance = getDatePickerInstance();
			expect(instance['closeAnimationTimeout']).toBeDefined();

			datePicker.root.open = true;
			await datePicker.waitForChanges();

			expect(instance['closeAnimationTimeout']).toBeUndefined();
		});

		it('should clear a lingering close timeout when the popup closes again', async () => {
			const instance = getDatePickerInstance();
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			// Simulate a close animation timer that never settled before the next close.
			instance['closeAnimationTimeout'] = setTimeout(() => undefined, 1000);

			datePicker.root.open = false;
			await datePicker.waitForChanges();

			expect(instance.popupClosing).toBe(true);
			clearTimeout(instance['closeAnimationTimeout']);
		});

		it('should tear down the popup after the close animation timeout elapses', async () => {
			const originalSetTimeout = globalThis.setTimeout;
			let capturedCallback: (() => void) | undefined;
			// Intercept only the picker's 200ms close timer so we can fire it
			// deterministically; forward every other timer to the real one so
			// Stencil's render loop keeps working.
			(globalThis as unknown as { setTimeout: typeof setTimeout }).setTimeout = ((
				callback: () => void,
				delay?: number,
				...rest: unknown[]
			) => {
				if (delay === 200) {
					capturedCallback = callback;
					return 1 as unknown as ReturnType<typeof setTimeout>;
				}
				return (originalSetTimeout as (...args: unknown[]) => ReturnType<typeof setTimeout>)(callback, delay, ...rest);
			}) as unknown as typeof setTimeout;

			try {
				datePicker.root.open = true;
				await datePicker.waitForChanges();

				datePicker.root.open = false;
				await datePicker.waitForChanges();

				const instance = getDatePickerInstance();
				capturedCallback?.();

				expect(instance['popup'].active).toBe(false);
				expect(instance['body'].hidden).toBe(true);
				expect(instance.popupClosing).toBe(false);
				expect(instance['closeAnimationTimeout']).toBeUndefined();
			} finally {
				globalThis.setTimeout = originalSetTimeout;
			}
		});

		it('should navigate to the previous month when the chevron-left button is clicked', async () => {
			const instance = getDatePickerInstance();
			// Opening the popup resyncs displayDate from date, so seed date here.
			instance.date = new Date(2026, 4, 20);
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const previous = datePicker.root.shadowRoot.querySelector('dv-icon-button[name="chevron-left"]') as HTMLElement;
			previous.click();

			expect(instance.displayDate.getMonth()).toBe(3);
		});

		it('should navigate to the next month when the chevron-right button is clicked', async () => {
			const instance = getDatePickerInstance();
			// Opening the popup resyncs displayDate from date, so seed date here.
			instance.date = new Date(2026, 4, 20);
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const next = datePicker.root.shadowRoot.querySelector('dv-icon-button[name="chevron-right"]') as HTMLElement;
			next.click();

			expect(instance.displayDate.getMonth()).toBe(5);
		});

		it('should open the year view via keyboard on the rendered year label', async () => {
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const labels = Array.from(
				datePicker.root.shadowRoot.querySelectorAll('div.flex.justify-center.w-full div')
			) as HTMLElement[];
			labels[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

			expect(datePicker.rootInstance.yearOpen).toBe(true);
		});

		it('should select a month and return to the day view from the rendered month panel', async () => {
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const panels = Array.from(
				datePicker.root.shadowRoot.querySelectorAll('div.relative.grid.mt-1 > div')
			) as HTMLElement[];
			const monthPanel = panels[0];

			(monthPanel.querySelector('dv-date-picker-button') as HTMLElement).click();
			expect(datePicker.rootInstance.displayDate.getMonth()).toBe(0);

			(monthPanel.querySelector('dv-button') as HTMLElement).click();
			expect(datePicker.rootInstance.monthOpen).toBe(false);
		});

		it('should select a year and return to the day view from the rendered year panel', async () => {
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const panels = Array.from(
				datePicker.root.shadowRoot.querySelectorAll('div.relative.grid.mt-1 > div')
			) as HTMLElement[];
			const yearPanel = panels[1];
			const firstYear = datePicker.rootInstance.yearsList[0];

			(yearPanel.querySelector('dv-date-picker-button') as HTMLElement).click();
			expect(datePicker.rootInstance.displayDate.getFullYear()).toBe(firstYear);

			(yearPanel.querySelector('dv-button') as HTMLElement).click();
			expect(datePicker.rootInstance.yearOpen).toBe(false);
		});

		it('should wire the calendar change and focusday events to the picker handlers', async () => {
			const instance = getDatePickerInstance();
			instance.date = new Date(2026, 4, 20);
			instance.displayDate = new Date(2026, 4, 20);
			instance.headerDate = new Date(2026, 4, 20);
			datePicker.root.open = true;
			await datePicker.waitForChanges();

			const calendar = datePicker.root.shadowRoot.querySelector('calendar-date') as HTMLElement;

			calendar.dispatchEvent(new CustomEvent('focusday', { detail: '2026-06-02' }));
			expect(instance.headerDate.getMonth()).toBe(5);

			calendar.dispatchEvent(new CustomEvent('change', { detail: '2026-05-21' }));
			await datePicker.waitForChanges();
			expect(instance.value).toBe('2026-05-21');
		});
	});

	describe('Events', () => {
		it('should emit a change event when the date is changed', async () => {
			datePicker.rootInstance.date = new Date(2026, 4, 20);
			datePicker.rootInstance.displayDate = new Date(2026, 4, 20);

			const changeSpy = jest.spyOn(datePicker.rootInstance.change, 'emit');
			const selectEvent = {
				detail: '2026-05-21',
				target: {
					value: '2026-05-21'
				}
			} as unknown as Event;

			datePicker.rootInstance.newDateSelected(selectEvent);

			expect(changeSpy).toHaveBeenCalledTimes(1);
			expect(datePicker.root.value).toBe('2026-05-21');
			expect(datePicker.rootInstance.date.getFullYear()).toBe(2026);
			expect(datePicker.rootInstance.date.getMonth()).toBe(4);
			expect(datePicker.rootInstance.date.getDate()).toBe(21);
		});

		it('should not emit a change event when the display month or year is changed', async () => {
			datePicker.rootInstance.date = new Date(2026, 4, 20);
			datePicker.rootInstance.displayDate = new Date(2026, 4, 20);

			const changeSpy = jest.spyOn(datePicker.rootInstance.change, 'emit');

			datePicker.rootInstance.handleMonthClick(6);
			datePicker.rootInstance.handleYearClick(2028);
			datePicker.rootInstance.previousClicked();
			datePicker.rootInstance.nextClicked();

			expect(changeSpy).not.toHaveBeenCalled();
			expect(datePicker.root.value).toBe('2026-05-20');
		});

		it('should re-emit change and stop propagation when a typed date is committed', () => {
			const instance = getDatePickerInstance();
			const changeSpy = jest.spyOn(instance.change, 'emit');

			const event = {
				stopPropagation: jest.fn()
			} as unknown as Event;

			instance.handleInputChange(event);

			expect(event.stopPropagation).toHaveBeenCalledTimes(1);
			expect(changeSpy).toHaveBeenCalledTimes(1);
		});
	});
});

