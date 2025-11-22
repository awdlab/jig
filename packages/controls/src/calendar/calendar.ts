import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  Signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgnItem } from '@ngneers/controls/api';
import { NgnTemplate, Platform } from '@ngneers/controls/api/ng';
import { provideSelf, valueControlBaseProvider } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnPopover } from '@ngneers/controls/popover';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnError } from '@ngneers/controls/utils';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

import { CalendarTemplates } from './calendar-templates';
import { CalendarDays } from './days/days';
import { CalendarTime } from './time/time';
import { DayModel, Month, MONTHS, WeekDay } from './types';

function generateYearOptions(): NgnItem[] {
  const MAX_ITEMS = 200;
  const currentYear = new Date().getFullYear();
  return Array.from({ length: MAX_ITEMS }, (_, i) => ({
    label: (currentYear - MAX_ITEMS / 2 + i).toString(),
    value: currentYear - MAX_ITEMS / 2 + i,
  }));
}

type MonthItemType = NgnItem<{ $: (typeof MONTHS)[number] }, '$'>;

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-calendar',
  templateUrl: './calendar.html',
  imports: [
    NgTemplateOutlet,
    NgnTemplate,
    NgClass,
    NgnInput,
    NgnIcon,
    NgnInputField,
    NgnSelect,
    NgnPopover,
    CalendarDays,
    CalendarTime,
  ],
  providers: [valueControlBaseProvider(NgnCalendar), provideSelf(NgnCalendar)],
})
export class NgnCalendar extends CalendarTemplates {
  /**
   * Set the first day of the week.
   * @default 'monday'
   */
  public readonly firstDayOfWeek = input<WeekDay>('monday');
  /**
   * Whether to show the time input.
   * @default false
   */
  public readonly showTime = input<boolean>(false);
  /**
   * Whether to show seconds in the time input.
   * @default false
   */
  public readonly showSeconds = input<boolean>(false);
  /**
   * Whether to show the calendar inline instead of with a input field & popup.
   * @default false
   */
  public readonly inline = input<boolean>(false);

  private readonly _popover = viewChild.required<NgnPopover>(NgnPopover);
  private readonly _platform = inject(Platform);
  private readonly i18n = inject(I18n).translations;
  protected readonly theme = this.injectThemeTemplate(calendarControlTemplate);
  protected readonly year = linkedSignal(
    () => this.value()?.getFullYear() || new Date().getFullYear()
  );
  protected readonly month = linkedSignal(() => this.value()?.getMonth() ?? new Date().getMonth());
  protected readonly yearOptions = generateYearOptions();
  protected readonly monthOptions: Signal<MonthItemType[]> = computed(() => {
    return Array.from({ length: 12 }, (_, i) => this.i18n[`calendar_months_${MONTHS[i]}`]()).map(
      (label, index) =>
        <MonthItemType>{ label, value: MONTHS[index], testId: `calendar-month-${MONTHS[index]}` }
    );
  });
  protected readonly valueStr = computed(() => {
    const value = this.value();
    if (!value) {
      return null;
    }
    // Format as YYYY-MM-DD(THH:MM(:SS))
    return `${String(value.getFullYear()).padStart(4, '0')}-${String(value.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(value.getDate()).padStart(2, '0')}${
      this.showTime()
        ? `T${String(value.getHours()).padStart(
            2,
            '0'
          )}:${String(value.getMinutes()).padStart(2, '0')}${
            this.showSeconds() ? `:${String(value.getSeconds()).padStart(2, '0')}` : ''
          }`
        : ''
    }`;
  });

  protected readonly previousMonth = () => {
    const currentMonth = this.month();
    const currentYear = this.year();
    if (currentMonth === 0) {
      this.year.set(currentYear - 1);
      this.month.set(11); // December
    } else {
      this.month.set(currentMonth - 1);
    }
  };

  protected readonly nextMonth = () => {
    const currentMonth = this.month();
    const currentYear = this.year();
    if (currentMonth === 11) {
      this.year.set(currentYear + 1);
      this.month.set(0); // January
    } else {
      this.month.set(currentMonth + 1);
    }
  };

  protected readonly previousYear = () => {
    this.year.set(this.year() - 1);
  };

  protected readonly nextYear = () => {
    this.year.set(this.year() + 1);
  };

  protected selectMonth(month: Month) {
    this.month.set(MONTHS.indexOf(month));
  }

  protected selectYear(year: number) {
    this.year.set(year);
  }

  protected selectDay(day: DayModel) {
    const newValue = new Date(this.value() || new Date());
    newValue.setFullYear(this.year());
    newValue.setMonth(this.month() + day.monthOffset);
    newValue.setDate(day.date);
    this.onChange(newValue);
  }

  protected changeTime(newTime: Date | null) {
    if (!newTime) {
      this.onChange(null);
      return;
    }
    const currentValue = this.value();
    if (currentValue) {
      const newValue = new Date(currentValue);
      newValue.setHours(newTime.getHours());
      newValue.setMinutes(newTime.getMinutes());
      newValue.setSeconds(newTime.getSeconds());
      this.onChange(newValue);
    }
  }

  /**
   * Shows the calendar popup. Only works if `inline` is `false`.
   */
  public show() {
    if (this.inline()) {
      throw new NgnError('calendar', 'cannot open inline calendar');
    }
    if (this._platform.isTouchDevice()) {
      return;
    }
    this._popover().show();
  }

  /**
   * Hides the calendar popup. Only works if `inline` is `false`.
   */
  public hide() {
    if (this.inline()) {
      throw new NgnError('calendar', 'cannot close inline calendar');
    }
    this._popover().hide();
  }

  protected onKeyDown(event: KeyboardEvent) {
    // @todo: handle date selection with keys

    // if event is not handled by the listbox, we can handle it here
    if (event.key === 'Enter') {
      this._popover().toggle();
      event.stopPropagation();
      event.preventDefault();
    }
  }

  protected stringValueChange(newValue: string | null) {
    if (!newValue) {
      return true;
    }

    const date = new Date(newValue);
    if (!isNaN(date.getTime())) {
      if (!this.showTime()) {
        date.setHours(this.value()?.getHours() || 0);
        date.setMinutes(this.value()?.getMinutes() || 0);
        date.setSeconds(this.value()?.getSeconds() || 0);
      } else if (!this.showSeconds()) {
        date.setSeconds(this.value()?.getSeconds() || 0);
      }
      this.onChange(date);
    }
    return true;
  }
}
