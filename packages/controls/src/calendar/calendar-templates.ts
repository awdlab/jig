import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn, ValueControlBase } from '@ngneers/controls/api';

import { DayTemplateType, MonthTemplateType, TimeTemplateType, WeekDayTemplateType } from './types';

@Directive()
export abstract class CalendarTemplates extends ValueControlBase<Date | null> {
  // Day template
  private readonly _defaultDayTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.day>>('defaultDayTemplate');
  private readonly _userDayTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.day>>('day');
  public readonly templateDay = input<TemplateRef<typeof this.templateTypes.day> | null>(null);
  protected readonly dayTemplate = computed(
    () => this._userDayTemplate() ?? this.templateDay() ?? this._defaultDayTemplate()
  );
  // Week day template
  private readonly _defaultWeekDayTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.weekDay>>('defaultWeekDayTemplate');
  private readonly _userWeekDayTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.weekDay>>('weekDay');
  public readonly templateWeekDay = input<TemplateRef<typeof this.templateTypes.weekDay> | null>(
    null
  );
  protected readonly weekDayTemplate = computed(
    () => this._userWeekDayTemplate() ?? this.templateWeekDay() ?? this._defaultWeekDayTemplate()
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
  // Time template
  private readonly _defaultTimeTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.time>>('defaultTimeTemplate');
  private readonly _userTimeTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.time>>('time');
  public readonly templateTime = input<TemplateRef<typeof this.templateTypes.time> | null>(null);
  protected readonly timeTemplate = computed(
    () => this._userTimeTemplate() ?? this.templateTime() ?? this._defaultTimeTemplate()
  );

  /**
   * Types for the dialog templates.
   */
  public readonly templateTypes = templateTypesFn<{
    day: DayTemplateType;
    weekDay: WeekDayTemplateType;
    month: MonthTemplateType;
    time: TimeTemplateType;
  }>();
}
