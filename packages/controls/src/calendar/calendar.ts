import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  type Signal,
  signal,
  viewChild,
} from '@angular/core';
import { JigTemplate, Platform } from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { I18n } from '@awdlab/jig/i18n';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { getDateOrTimeMask, JigMaskInput } from '@awdlab/jig/mask-input';
import { JigPopover } from '@awdlab/jig/popover';
import { JigSelect } from '@awdlab/jig/select';
import { JigError, throwExp } from '@awdlab/jig/utils';
import { calendarControlTemplate } from '@awdlab/jig-themes/templates/calendar';

import { CalendarTemplates } from './calendar-templates';
import { CalendarDays } from './days/days';
import { formatDate, parseDate } from './formatter';
import { CalendarTime } from './time/time';
import { type DayModel, type Month, MONTHS, type WeekDay } from './types';

import type { JigItem } from '@awdlab/jig/api';

function generateYearOptions(): JigItem[] {
  const MAX_ITEMS = 200;
  const currentYear = new Date().getFullYear();
  return Array.from({ length: MAX_ITEMS }, (_, i) => ({
    label: (currentYear - MAX_ITEMS / 2 + i).toString(),
    value: currentYear - MAX_ITEMS / 2 + i,
  }));
}

type MonthItemType = JigItem<{ $: (typeof MONTHS)[number] }, '$'>;

/**
 * @category control
 */
@Component({
  selector: 'jig-calendar',
  templateUrl: './calendar.html',
  imports: [
    NgTemplateOutlet,
    JigTemplate,
    JigPt,
    JigInput,
    JigIcon,
    JigSelect,
    JigPopover,
    CalendarDays,
    CalendarTime,
    JigInputField,
    JigMaskInput,
  ],
  providers: [provideSelf(JigCalendar)],
  host: {
    '[style.display]': '"block"',
    '[style.width]': 'inline() ? "fit-content" : "100%"',
    '[attr.aria-invalid]': 'invalidState() ? "true" : null',
  },
})
export class JigCalendar extends CalendarTemplates {
  /**
   * Set the first day of the week.
   * @default 'monday'
   */
  public readonly firstDayOfWeek = input<WeekDay>('monday');
  /**
   * Whether to show the time input.
   * @default false
   */
  public readonly showTime = input(false, { transform: booleanAttribute });
  /**
   * Whether to show seconds in the time input.
   * @default false
   */
  public readonly showSeconds = input(false, { transform: booleanAttribute });
  /**
   * Whether to show the calendar inline instead of with a input field & popup.
   * @default false
   */
  public readonly inline = input(false, { transform: booleanAttribute });
  /**
   * The format of the date displayed in the input field.
   * @default 'MM/dd/yyyy'
   */
  public readonly format = input('MM/dd/yyyy');

  private readonly _popover = viewChild<JigPopover>(JigPopover);
  private readonly _mask = viewChild(JigMaskInput);
  private readonly _platform = inject(Platform);
  protected readonly i18n = inject(I18n).translations;
  public override readonly isFieldControl = true;
  protected readonly theme = this.injectThemeTemplate(calendarControlTemplate);

  // Mask emits emptiness per keystroke; `value` only lands once the date is
  // complete, so float detection must read the mask, not `value`.
  public override readonly empty = computed(() => this._mask()?.empty() ?? this.value() == null);
  protected get anchorElement(): HTMLElement {
    return (
      (this.element.nativeElement.closest('jig-input-field') as HTMLElement | null) ??
      this.element.nativeElement
    );
  }
  protected readonly year = linkedSignal(
    () => this.value()?.getFullYear() || new Date().getFullYear()
  );
  protected readonly month = linkedSignal(() => this.value()?.getMonth() ?? new Date().getMonth());
  protected readonly yearOptions = generateYearOptions();
  protected readonly monthOptions: Signal<JigItem<MonthItemType>[]> = computed(() => {
    const months = Array.from(
      { length: 12 },
      (_, i) =>
        <JigItem>{
          label:
            this.i18n[
              `calendar_months_${MONTHS[i] ?? throwExp('calendar', 'invalid month index')}`
            ],
          value: MONTHS[i],
          testId: `calendar-month-${MONTHS[i]}`,
        }
    );
    return months;
  });
  protected readonly valueStr = computed(() => {
    const value = this.value();
    const format = this.format();
    if (!value) {
      return null;
    }
    return formatDate(value, format);
  });
  protected readonly maskCfg = computed(() => {
    const format = this.format();
    const mask = getDateOrTimeMask(format);
    const value = this.value();
    if (!value) {
      return mask;
    }
    // Narrow the day field's max to the current month's length (leap-aware) so
    // the mask wraps/limits the day correctly within the month (e.g. Feb caps at
    // 28/29, stepping up from 28 wraps to 1). The mask keeps the typed value
    // across this change because only min/max — not the structure — differs.
    const daysInMonth = new Date(value.getFullYear(), value.getMonth() + 1, 0).getDate();
    return mask.map(seg =>
      typeof seg !== 'string' && seg.kind === 'number' && seg.segment === 'day'
        ? { ...seg, max: daysInMonth }
        : seg
    );
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
    this.value.set(newValue);
  }

  protected changeTime(newTime: Date | null) {
    if (!newTime) {
      this.value.set(null);
      return;
    }
    const currentValue = this.value();
    if (currentValue) {
      const newValue = new Date(currentValue);
      newValue.setHours(newTime.getHours());
      newValue.setMinutes(newTime.getMinutes());
      newValue.setSeconds(newTime.getSeconds());
      this.value.set(newValue);
    }
  }

  /**
   * Places focus from a pointer event: forwards the location to the embedded
   * mask so the section nearest the cursor is selected, then opens the popup.
   * Implemented as the `JigBase.focusFromPointer` hook so it also works when the
   * calendar is wrapped in an `jig-input-field` — the outer field delegates the
   * click here (with the real coordinates) instead of synthesising a
   * coordinate-less click. Invoked by the calendar's own field click too.
   */
  public override focusFromPointer(event: MouseEvent): boolean {
    const handled = this._mask()?.focusFromPointer(event) ?? false;
    if (!this.inline()) {
      this.show();
    }
    return handled;
  }

  /**
   * Shows the calendar popup. Only works if `inline` is `false`.
   */
  public show() {
    if (this.inline()) {
      throw new JigError('calendar', 'cannot open inline calendar');
    }
    if (this._platform.isTouchDevice() || this.disabled() || this.readonly()) {
      return;
    }
    const popover = this._popover();
    if (!popover) {
      throw new JigError('calendar', 'popover not found despite inline being false');
    }
    popover.show();
  }

  /**
   * Hides the calendar popup. Only works if `inline` is `false`.
   */
  public hide() {
    if (this.inline()) {
      throw new JigError('calendar', 'cannot close inline calendar');
    }
    const popover = this._popover();
    if (!popover) {
      throw new JigError('calendar', 'popover not found despite inline being false');
    }
    popover.hide();
  }

  protected onKeyDown(event: KeyboardEvent) {
    // @todo: handle date selection with keys

    // if event is not handled by the listbox, we can handle it here
    if (event.key === 'Enter' && !this.inline()) {
      const popover = this._popover();
      if (!popover) {
        throw new JigError('calendar', 'popover not found despite inline being false');
      }
      popover.toggle();
      event.stopPropagation();
      event.preventDefault();
    }
  }

  /** The current (possibly partial) text in the mask field, awaiting blur. */
  private readonly _inputString = signal<string | null>(null);
  private readonly _clearingMaskInput = signal(false);

  private readonly _clearValueWhenMaskBecomesEmpty = effect(() => {
    if (!this._clearingMaskInput() || !this._mask()?.empty()) {
      return;
    }
    this._clearingMaskInput.set(false);
    this.value.set(null);
  });

  protected stringValueChange(newValue: string | null) {
    this._inputString.set(newValue);
    // The mask emits null both while mid-typing and when fully cleared. Only the
    // fully-cleared case should null out the bound value; a partially-typed entry
    // leaves the previous value intact (one-directional sync).
    if (!newValue) {
      if (this._mask()?.empty()) {
        this._clearingMaskInput.set(false);
        this.value.set(null);
      } else {
        this._clearingMaskInput.set(true);
      }
      return;
    }
    this._clearingMaskInput.set(false);
    // One-directional sync: typing updates the calendar value (and thus the
    // dropdown UI) only once the mask is COMPLETE — a fully filled, parseable
    // date. Half-typed input never moves the calendar and is never reformatted
    // back over the input. The calendar UI updates the value directly via
    // selectDay / selectMonth / selectYear / changeTime (which then flow back
    // out to the mask text via `valueStr`).
    if (this._mask()?.complete()) {
      this.parseInputString();
    }
  }

  /** Parse the complete mask string into the calendar value. */
  private parseInputString() {
    const raw = this._inputString();
    if (!raw) {
      return;
    }
    // Format-aware parse that clamps an out-of-range day to the month's length
    // (e.g. Feb 31 → Feb 28) instead of rolling over into the next month.
    const date = parseDate(raw, this.format());
    if (!date) {
      return;
    }
    if (!this.showTime()) {
      date.setHours(this.value()?.getHours() ?? 0);
      date.setMinutes(this.value()?.getMinutes() ?? 0);
      date.setSeconds(this.value()?.getSeconds() ?? 0);
    } else if (!this.showSeconds()) {
      date.setSeconds(this.value()?.getSeconds() ?? 0);
    }
    // Skip if unchanged — prevents an echo loop when our own valueStr→input
    // write re-emits a (complete) valueChange for the value we just set.
    const current = this.value();
    if (current && current.getTime() === date.getTime()) {
      // The value is unchanged, but the mask may be showing a non-canonical
      // string (e.g. a clamped Feb 31 → Feb 28). Push the canonical text back so
      // the displayed sections match the real value.
      const canonical = formatDate(date, this.format());
      if (canonical !== raw) {
        this._mask()?.value.set(canonical);
      }
      return;
    }
    this.value.set(date);
  }

  // Popover panel focus lives outside the host, so a plain focusout can't tell a
  // real blur from opening the calendar — mark touched from this popover-aware
  // check instead.
  protected potentiallyBlurred() {
    setTimeout(() => {
      if (this.element.nativeElement.contains(document.activeElement) || this._popover()?.open()) {
        return;
      }
      this.markTouched();
    });
  }
}
