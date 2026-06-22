import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  TemplateRef,
  viewChildren,
} from '@angular/core';
import { type NgnBaseSafe, NgnPt } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

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

import type { ControlTemplateInfo } from '@ngneers/controls/api/ng';

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
  selector: 'ngn-calendar-days',
  templateUrl: './days.html',
  imports: [NgTemplateOutlet, NgnPt, NgnButton, NgnIcon],
})
export class CalendarDays {
  public readonly component = input.required<NgnBaseSafe<'calendar'>>();
  public readonly theme = input.required<ControlTemplateInfo<typeof calendarControlTemplate>>();
  public readonly year = input.required<number>();
  public readonly month = input.required<number>();
  public readonly currentValue = input.required<Date | null>();
  public readonly firstDayOfWeek = input.required<WeekDay>();
  public readonly dayTemplate = input.required<TemplateRef<DayTemplateType>>();
  public readonly weekDayTemplate = input.required<TemplateRef<WeekDayTemplateType>>();
  public readonly timeTemplate = input.required<TemplateRef<TimeTemplateType>>();
  public readonly yearTemplate = input.required<TemplateRef<YearTemplateType>>();
  public readonly monthTemplate = input.required<TemplateRef<MonthTemplateType>>();
  public readonly showTime = input.required<boolean>();
  public readonly showSeconds = input.required<boolean>();
  public readonly previousMonth = output();
  public readonly nextMonth = output();
  public readonly daySelected = output<DayModel>();
  public readonly yearSelected = output<number>();
  public readonly monthSelected = output<Month>();
  public readonly timeChanged = output<Date | null>();

  protected readonly MONTHS = MONTHS;
  protected readonly i18n = inject(I18n).translations;
  protected readonly todaysDay = new Date().getDate();
  protected readonly todaysMonth = new Date().getMonth();
  protected readonly todaysYear = new Date().getFullYear();
  protected readonly doTimeChange = (t: Date | null) => this.timeChanged.emit(t);
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

  protected prev() {
    this.previousMonth.emit();
  }

  protected next() {
    this.nextMonth.emit();
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
      if (event.key === 'ArrowRight') {
        if (index < daysInMonth - 1) {
          allDayButtons[index + 1]?.focus();
        } else {
          this.next();
          setTimeout(() => {
            getCurrentMonthButtons()[0]?.focus();
          });
        }
      } else if (event.key === 'ArrowLeft') {
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
