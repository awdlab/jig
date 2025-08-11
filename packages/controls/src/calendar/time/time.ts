import { Component, computed, inject, input, output } from '@angular/core';
import { injectThemeTemplate, Platform } from '@ngneers/controls/api';
import { I18n } from '@ngneers/controls/i18n';
import { MASKS, NgnInput, NgnInputMask } from '@ngneers/controls/input-mask';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

@Component({
  selector: 'ngn-calendar-time',
  templateUrl: './time.html',
  imports: [NgnInput, NgnInputMask],
})
export class CalendarTime {
  protected readonly theme = injectThemeTemplate(calendarControlTemplate);
  protected readonly i18n = inject(I18n).translations;
  protected readonly isTouchDevice = inject(Platform).isTouchDevice();

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
