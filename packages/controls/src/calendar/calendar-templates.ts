import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn, ValueControlBase } from '@ngneers/controls/api';

import { DayTemplateType, MonthTemplateType } from './types';

@Directive()
export abstract class CalendarTemplates extends ValueControlBase<Date> {
  // Day template
  private readonly _defaultDayTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.day>>('defaultDayTemplate');
  private readonly _userDayTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.day>>('day');
  public readonly templateDay = input<TemplateRef<typeof this.templateTypes.day> | null>(null);
  protected readonly dayTemplate = computed(
    () => this._userDayTemplate() ?? this.templateDay() ?? this._defaultDayTemplate()
  );
  // Month template
  private readonly _defaultMonthTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.month>>('defaultMonthTemplate');
  private readonly _userMonthTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.month>>('month');
  public readonly templateMonth = input<TemplateRef<typeof this.templateTypes.month> | null>(null);
  protected readonly monthTemplate = computed(
    () => this._userMonthTemplate() ?? this.templateMonth() ?? this._defaultMonthTemplate()
  );

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    day: DayTemplateType;
    month: MonthTemplateType;
  }>();
}
