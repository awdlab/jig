import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  TemplateRef,
  viewChildren,
} from '@angular/core';
import { type JigBaseSafe, JigPt } from '@awdlab/jig/base';
import { JigButton } from '@awdlab/jig/button';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { calendarControlTemplate } from '@awdlab/jig-themes/templates/calendar';

import {
  type DayModel,
  type DayTemplateType,
  type Month,
  MONTHS,
  type MonthTemplateType,
  type TimeTemplateType,
  WEEK_DAYS,
  type WeekDay,
  type WeekDayTemplateType,
  type YearTemplateType,
} from '../types';
import { isWithinBounds } from '../bounds';

import type { ControlTemplateInfo } from '@awdlab/jig/api/ng';
import { inlineArrowStep } from '@awdlab/jig/api/ng';

// Configuration: Number of weeks to show before and after the current month
const WEEKS_BEFORE = 1;
const WEEKS_AFTER = 1;

type MonthModel = {
  weeks: WeekModel[];
};

type WeekModel = {
  days: DayModel[];
};

@Component({
  selector: 'jig-calendar-days',
  templateUrl: './days.html',
  imports: [NgTemplateOutlet, JigPt, JigButton, JigIcon],
})
export class JigCalendarDays {
  /** The owning calendar, used for theme pass-through. */
  public readonly component = input.required<JigBaseSafe<'calendar'>>();
  /** The calendar's resolved theme template. */
  public readonly theme = input.required<ControlTemplateInfo<typeof calendarControlTemplate>>();
  /** The displayed year. */
  public readonly year = input.required<number>();
  /** The displayed month, zero-based. */
  public readonly month = input.required<number>();
  /** The selected date, or `null` when nothing is selected. */
  public readonly currentValue = input.required<Date | null>();
  /** The weekday the grid starts on. */
  public readonly firstDayOfWeek = input.required<WeekDay>();
  /** The earliest selectable date, or `null` for no lower bound. */
  public readonly min = input.required<Date | null>();
  /** The latest selectable date, or `null` for no upper bound. */
  public readonly max = input.required<Date | null>();
  /** Template that renders each day cell. */
  public readonly templateDay = input.required<TemplateRef<DayTemplateType>>();
  /** Template that renders each weekday header cell. */
  public readonly templateWeekDay = input.required<TemplateRef<WeekDayTemplateType>>();
  /** Template that renders the time picker below the grid. */
  public readonly templateTime = input.required<TemplateRef<TimeTemplateType>>();
  /** Template that renders the year picker in the header. */
  public readonly templateYear = input.required<TemplateRef<YearTemplateType>>();
  /** Template that renders the month picker in the header. */
  public readonly templateMonth = input.required<TemplateRef<MonthTemplateType>>();
  /** Whether the time picker is shown below the grid. */
  public readonly showTime = input.required({ transform: booleanAttribute });
  /** Whether the time picker includes seconds. */
  public readonly showSeconds = input.required({ transform: booleanAttribute });
  /** Emitted when the previous-month button is pressed. */
  public readonly previousMonthRequested = output();
  /** Emitted when the next-month button is pressed. */
  public readonly nextMonthRequested = output();
  /** Emitted when a day cell is picked. */
  public readonly daySelected = output<DayModel>();
  /** Emitted when a year is picked in the header. */
  public readonly yearSelected = output<number>();
  /** Emitted when a month is picked in the header. */
  public readonly monthSelected = output<Month>();
  /** Emitted with the new date when the time picker changes, or `null` when cleared. */
  public readonly timeChange = output<Date | null>();

  protected readonly MONTHS = MONTHS;
  protected readonly i18n = inject(I18n).translations;
  protected readonly todaysDay = new Date().getDate();
  protected readonly todaysMonth = new Date().getMonth();
  protected readonly todaysYear = new Date().getFullYear();
  protected readonly doTimeChange = (t: Date | null) => this.timeChange.emit(t);
  protected readonly doYearChange = (t: number) => this.yearSelected.emit(t);
  protected readonly doMonthChange = (t: Month) => this.monthSelected.emit(t);

  protected readonly weekDaysSorted = computed(() =>
    WEEK_DAYS.slice(this._firstDayOfWeekIndex())
      .concat(WEEK_DAYS.slice(0, this._firstDayOfWeekIndex()))
      .map(day => ({
        weekDay: day,
        translation: this.i18n[`calendar_weekdaysShort_${day}`],
      }))
  );

  private readonly _dayButton = viewChildren<ElementRef<HTMLButtonElement>>('dayButton');
  private readonly _firstDayOfWeekIndex = computed(() => WEEK_DAYS.indexOf(this.firstDayOfWeek()));
  private readonly _daysInMonth = computed(() =>
    new Date(this.year(), this.month() + 1, 0).getDate()
  );
  private readonly _daysInPreviousMonth = computed(() =>
    new Date(this.year(), this.month(), 0).getDate()
  );
  private readonly _firstDayOfMonth = computed(() =>
    new Date(this.year(), this.month(), 1).getDay()
  );

  protected readonly monthModel = computed((): MonthModel => {
    const firstDayOfMonth = this._firstDayOfMonth();
    const firstDayOfWeek = this._firstDayOfWeekIndex();
    const daysInMonth = this._daysInMonth();
    const daysInPreviousMonth = this._daysInPreviousMonth();

    // Calculate starting point and total days needed
    const firstDayOffset = (firstDayOfMonth - firstDayOfWeek + 7) % 7;
    const daysFromPreviousMonth = firstDayOffset + WEEKS_BEFORE * 7;
    const daysToNextMonth = (7 - ((daysFromPreviousMonth + daysInMonth) % 7)) % 7;
    const totalDays = daysFromPreviousMonth + daysInMonth + daysToNextMonth + WEEKS_AFTER * 7;
    const startDay = daysInPreviousMonth - daysFromPreviousMonth + 1;

    // Build all days in one pass
    const allDays: DayModel[] = [];
    let currentDate = startDay;
    let currentMonth = -1; // -1 = previous, 0 = current, 1 = next

    for (let i = 0; i < totalDays; i++) {
      // Determine which month we're in
      if (currentDate > daysInPreviousMonth && currentMonth === -1) {
        currentDate = 1;
        currentMonth = 0;
      } else if (currentDate > daysInMonth && currentMonth === 0) {
        currentDate = 1;
        currentMonth = 1;
      }

      allDays.push({
        date: currentDate,
        monthOffset: currentMonth,
      });

      currentDate++;
    }

    // Group into weeks
    const weeks: WeekModel[] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push({
        days: allDays.slice(i, i + 7),
      });
    }

    return { weeks };
  });

  protected readonly tabFocusDay = computed(() => {
    const val = this.currentValue();
    if (val && val.getMonth() === this.month() && val.getFullYear() === this.year()) {
      return val.getDate();
    }
    return 1;
  });

  /** Accessible name of the day grid — the visible month and year. */
  protected readonly gridLabel = computed(() =>
    new Date(this.year(), this.month(), 1).toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    })
  );

  private _dateOf(day: DayModel): Date {
    return new Date(this.year(), this.month() + day.monthOffset, day.date);
  }

  /** Full, localized date used as each day cell's accessible name (e.g. "Thursday, 15 January 2026"). */
  protected dayLabel(day: DayModel): string {
    return this._dateOf(day).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /** Whether the given day cell lies outside the min/max bounds. */
  protected isDisabled(day: DayModel): boolean {
    return !isWithinBounds(this._dateOf(day), this.min(), this.max());
  }

  /** Whether the given day cell holds the currently selected value. */
  protected isSelected(day: DayModel): boolean {
    const val = this.currentValue();
    return (
      !!val &&
      val.getDate() === day.date &&
      val.getMonth() === this.month() + day.monthOffset &&
      val.getFullYear() === this.year()
    );
  }

  /** Whether the given day cell is today. */
  protected isToday(day: DayModel): boolean {
    return (
      this.todaysMonth === this.month() + day.monthOffset &&
      this.todaysDay === day.date &&
      this.todaysYear === this.year()
    );
  }

  protected prev() {
    this.previousMonthRequested.emit();
  }

  protected next() {
    this.nextMonthRequested.emit();
  }

  protected selectYear(year: number) {
    this.yearSelected.emit(year);
  }

  protected dayKeydown(event: KeyboardEvent, day: HTMLButtonElement) {
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();

      const getCurrentMonthButtons = () => {
        return this._dayButton()
          .map(ref => ref.nativeElement)
          .filter(x => !x.classList.contains(this.theme().class('day-other-month')));
      };

      const allDayButtons = getCurrentMonthButtons();
      const index = allDayButtons.indexOf(day);
      const daysInMonth = this._daysInMonth();
      // The day grid runs along the inline axis, so RTL reverses which key advances.
      const inline = inlineArrowStep(day, event.key);
      if (inline === 1) {
        if (index < daysInMonth - 1) {
          allDayButtons[index + 1]?.focus();
        } else {
          this.next();
          setTimeout(() => {
            getCurrentMonthButtons()[0]?.focus();
          });
        }
      } else if (inline === -1) {
        if (index > 0) {
          allDayButtons[index - 1]?.focus();
        } else {
          this.prev();
          setTimeout(() => {
            const buttons = getCurrentMonthButtons();
            buttons[buttons.length - 1]?.focus();
          });
        }
      } else if (event.key === 'ArrowDown') {
        if (index < daysInMonth - 7) {
          allDayButtons[index + 7]?.focus();
        } else {
          this.next();
          const nextIndex = (index + 7) % daysInMonth;
          setTimeout(() => {
            getCurrentMonthButtons()[nextIndex]?.focus();
          });
        }
      } else if (event.key === 'ArrowUp') {
        if (index >= 7) {
          allDayButtons[index - 7]?.focus();
        } else {
          this.prev();
          setTimeout(() => {
            const buttons = getCurrentMonthButtons();
            const targetIndex = Math.min(buttons.length - 7 + index, buttons.length - 1);
            buttons[targetIndex]?.focus();
          });
        }
      }
    }
  }
}
