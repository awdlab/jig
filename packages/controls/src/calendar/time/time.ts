import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectThemeTemplate, Platform } from '@ngneers/controls/api';
import { I18n } from '@ngneers/controls/i18n';
import { MASKS, TextField } from '@ngneers/controls/text-field';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

@Component({
  selector: 'ngn-calendar-time',
  templateUrl: './time.html',
  imports: [FormsModule, TextField],
})
export class CalendarTime {
  protected readonly theme = injectThemeTemplate(calendarControlTemplate);
  protected readonly i18n = inject(I18n).translations;
  protected readonly inputMask = computed(() =>
    this.showSeconds() ? MASKS.timeSeconds : MASKS.time
  );

  protected readonly isMobile = inject(Platform).isTouchDevice();

  public readonly currentValue = input.required<Date | null>();
  public readonly showSeconds = input.required<boolean>();
  public readonly timeChange = output<Date | null>();

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
