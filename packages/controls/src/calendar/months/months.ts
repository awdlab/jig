import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, output, TemplateRef } from '@angular/core';
import { NgnItem } from '@ngneers/controls/api';
import { injectThemeTemplate } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

import { MONTHS, MonthTemplateType, YearTemplateType } from '../types';

@Component({
  selector: 'ngn-calendar-months',
  templateUrl: './months.html',
  imports: [NgTemplateOutlet, NgClass, NgnButton, NgnIcon],
})
export class CalendarMonths {
  protected readonly theme = injectThemeTemplate(calendarControlTemplate);
  public readonly year = input.required<number>();
  public readonly currentValue = input.required<Date | null>();
  public readonly monthSelected = output<number>();
  public readonly yearSelected = output<number>();
  public readonly monthTemplate = input.required<TemplateRef<MonthTemplateType>>();
  public readonly yearTemplate = input.required<TemplateRef<YearTemplateType>>();
  protected readonly doYearChange = (t: number) => this.yearSelected.emit(t);

  protected readonly years = Array.from({ length: 1000 }, (_, i) => 1500 + i).map(
    y =>
      <NgnItem>{
        label: y.toString(),
        value: y,
        testId: `calendar-year-${y}`,
      }
  );

  protected selectYear(year: number) {
    this.yearSelected.emit(year);
  }

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
