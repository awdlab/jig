import { Component, computed, inject, input, output } from '@angular/core';
import { Platform } from '@awdlab/jig/api/ng';
import { I18n } from '@awdlab/jig/i18n';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, AwdMaskInput } from '@awdlab/jig/mask-input';

import type { AwdBaseSafe } from '@awdlab/jig/base';

@Component({
  selector: 'jig-calendar-time',
  templateUrl: './time.html',
  imports: [AwdInput, AwdMaskInput, AwdInputField],
})
export class CalendarTime {
  protected readonly i18n = inject(I18n).translations;
  protected readonly isTouchDevice = inject(Platform).isTouchDevice();

  public readonly component = input.required<AwdBaseSafe<'calendar'>>();
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
