import { Component, computed, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Platform } from '@ngneers/controls/api/ng';
import { NgnBaseSafe } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
import { NgnInput } from '@ngneers/controls/input';
import { MASKS, NgnInputMask } from '@ngneers/controls/input-mask';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-calendar-time',
  templateUrl: './time.html',
  imports: [NgnInput, NgnInputMask],
})
export class CalendarTime {
  protected readonly i18n = inject(I18n).translations;
  protected readonly isTouchDevice = inject(Platform).isTouchDevice();

  public readonly component = input.required<NgnBaseSafe<'calendar'>>();
  public readonly currentValue = input.required<Date | null>();
  public readonly showSeconds = input.required<boolean>();
  public readonly timeChange = output<Date | null>();
  public readonly mask = computed(() => (this.showSeconds() ? MASKS.timeSeconds : MASKS.time));

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
    const [hours, minutes, seconds] = value.split(':').map(Number);

    if (isNaN(hours)) {
      this.timeChange.emit(null);
    }

    const fixedSeconds = isNaN(seconds) ? 0 : seconds;
    const fixedMinutes = isNaN(minutes) ? 0 : minutes;

    const currentDate = this.currentValue();
    const newDate = new Date(currentDate || new Date());
    newDate.setHours(hours);
    newDate.setMinutes(fixedMinutes);
    newDate.setSeconds(this.showSeconds() ? fixedSeconds : 0);

    if (
      newDate.getMinutes() !== currentDate?.getMinutes() ||
      newDate.getHours() !== currentDate?.getHours() ||
      (this.showSeconds() && newDate.getSeconds() !== currentDate?.getSeconds())
    ) {
      this.timeChange.emit(newDate);
    }
  }
}
