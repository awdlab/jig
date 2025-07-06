import { Component, inject, input } from '@angular/core';
import { I18n } from '@ngneers/controls/i18n';
import { TextField } from '@ngneers/controls/text-field';

import { MONTHS } from '../types';

@Component({
  selector: 'ngn-calendar-time',
  templateUrl: './time.html',
  styleUrls: ['./time.scss'], // TODO: refactor into theme
  imports: [TextField],
})
export class CalendarTime {
  public readonly currentValue = input.required<Date | null>();
  public readonly showSeconds = input.required<boolean>();

  protected readonly i18n = inject(I18n).translations;
  protected readonly months = Array.from({ length: 12 }, (_, i) =>
    this.i18n[`calendar_months_${MONTHS[i]}`]()
  );
}
