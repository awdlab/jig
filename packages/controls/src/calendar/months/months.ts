import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, output, TemplateRef } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { I18n } from '@ngneers/controls/i18n';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

import { MONTHS, MonthTemplateType } from '../types';

@Component({
  selector: 'ngn-calendar-months',
  templateUrl: './months.html',
  imports: [NgTemplateOutlet, NgClass],
})
export class CalendarMonths {
  protected readonly theme = injectThemeTemplate(calendarControlTemplate);
  public readonly year = input.required<number>();
  public readonly currentValue = input.required<Date | null>();
  public readonly monthSelected = output<number>();
  public readonly monthTemplate = input.required<TemplateRef<MonthTemplateType>>();

  protected readonly i18n = inject(I18n).translations;
  protected readonly months = Array.from({ length: 12 }, (_, i) =>
    this.i18n[`calendar_months_${MONTHS[i]}`]()
  );

  public readonly previousYear = output();
  public readonly nextYear = output();

  protected prev() {
    this.previousYear.emit();
  }

  protected next() {
    this.nextYear.emit();
  }

  protected selectMonth(index: number) {
    this.monthSelected.emit(index);
  }
}
