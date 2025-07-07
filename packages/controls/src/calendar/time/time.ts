import { Component, inject, input } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { I18n } from '@ngneers/controls/i18n';
import { TextField } from '@ngneers/controls/text-field';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

import { MONTHS } from '../types';

@Component({
  selector: 'ngn-calendar-time',
  templateUrl: './time.html',
  imports: [TextField],
})
export class CalendarTime {
  protected readonly theme = injectThemeTemplate(calendarControlTemplate);

  public readonly currentValue = input.required<Date | null>();
  public readonly showSeconds = input.required<boolean>();

  protected readonly i18n = inject(I18n).translations;
  protected readonly months = Array.from({ length: 12 }, (_, i) =>
    this.i18n[`calendar_months_${MONTHS[i]}`]()
  );
}
