import { Component, computed, inject, input, output } from '@angular/core';
import { Platform } from '@ngneers/controls/api/ng';
import { I18n } from '@ngneers/controls/i18n';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { DATE_TIME_MASKS, NgnInputMask } from '@ngneers/controls/input-mask';

import type { NgnBaseSafe } from '@ngneers/controls/base';

@Component({
  selector: 'ngn-calendar-time',
  templateUrl: './time.html',
  imports: [NgnInput, NgnInputMask, NgnInputField],
})
export class CalendarTime {
  protected readonly i18n = inject(I18n).translations;
  protected readonly isTouchDevice = inject(Platform).isTouchDevice();

  public readonly component = input.required<NgnBaseSafe<'calendar'>>();
  public readonly currentValue = input.required<Date | null>();
  public readonly showSeconds = input.required<boolean>();
  public readonly timeChange = output<Date | null>();
  public readonly mask = computed(() =>
    this.showSeconds() ? DATE_TIME_MASKS.time : DATE_TIME_MASKS.timeShort
  );

  protected readonly value = computed(() => {
    const currentValue = this.currentValue();
    if (!currentValue) return null;

    function padZero(num: number): string {
      return num < 10 ? `0${num}` : `${num}`;
    }

    const hours = padZero(currentValue.getHours());
    const minutes = padZero(currentValue.getMinutes());
    const seconds = padZero(currentValue.getSeconds());

    return this.showSeconds() ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
  });

  protected onValueChange(value: string) {
    if (!value) {
      this.timeChange.emit(null);
      return;
    }

    const [hours, minutes, seconds] = value.split(':').map(Number);

    if (hours === undefined || minutes === undefined) {
      throw new Error(`Invalid time value: ${value}`);
    }

    if (isNaN(hours)) {
      this.timeChange.emit(null);
      return;
    }

    const fixedMinutes = isNaN(minutes) ? 0 : minutes;

    const currentDate = this.currentValue();
    const newDate = new Date(currentDate || new Date());
    newDate.setHours(hours);
    newDate.setMinutes(fixedMinutes);

    if (this.showSeconds()) {
      const fixedSeconds = isNaN(seconds ?? 0) ? 0 : (seconds ?? 0);
      newDate.setSeconds(fixedSeconds);
    } else {
      newDate.setSeconds(0);
    }

    if (
      newDate.getMinutes() !== currentDate?.getMinutes() ||
      newDate.getHours() !== currentDate?.getHours() ||
      (this.showSeconds() && newDate.getSeconds() !== currentDate?.getSeconds())
    ) {
      this.timeChange.emit(newDate);
    }
  }
}
