import { computed, contentChild, Directive, input, TemplateRef, viewChild } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';
import { ValueControlBase } from '@ngneers/controls/base';

import type {
  DayTemplateType,
  MonthTemplateType,
  TimeTemplateType,
  WeekDayTemplateType,
  YearTemplateType,
} from './types';

@Directive()
export abstract class CalendarTemplates extends ValueControlBase<'calendar', Date | null> {
  // Day template
  private readonly _defaultDayTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.day>>('defaultDayTemplate');
  private readonly _userDayTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.day>>('day');
  /**
   * Set a custom template for a day.
   * Can also be set using an `<ng-template>` element with `#day` template reference variable.
   */
  public readonly templateDay = input<TemplateRef<typeof this.templateTypes.day> | null>(null);
  protected readonly dayTemplate = computed(
    () => this._userDayTemplate() ?? this.templateDay() ?? this._defaultDayTemplate()
  );
  // Week day template
  private readonly _defaultWeekDayTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.weekDay>>('defaultWeekDayTemplate');
  private readonly _userWeekDayTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.weekDay>>('weekDay');
  /**
   * Set a custom template for a week day.
   * Can also be set using an `<ng-template>` element with `#weekDay` template reference variable.
   */
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
  /**
   * Set a custom template for a month.
   * Can also be set using an `<ng-template>` element with `#month` template reference variable.
   */
  public readonly templateMonth = input<TemplateRef<typeof this.templateTypes.month> | null>(null);
  protected readonly monthTemplate = computed(
    () => this._userMonthTemplate() ?? this.templateMonth() ?? this._defaultMonthTemplate()
  );
  // Time template
  private readonly _defaultTimeTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.time>>('defaultTimeTemplate');
  private readonly _userTimeTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.time>>('time');
  /**
   * Set a custom template for the time input.
   * Can also be set using an `<ng-template>` element with `#time` template reference variable.
   */
  public readonly templateTime = input<TemplateRef<typeof this.templateTypes.time> | null>(null);
  protected readonly timeTemplate = computed(
    () => this._userTimeTemplate() ?? this.templateTime() ?? this._defaultTimeTemplate()
  );
  // Year template
  private readonly _defaultYearTemplate =
    viewChild.required<TemplateRef<typeof this.templateTypes.year>>('defaultYearTemplate');
  private readonly _userYearTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.year>>('year');
  /**
   * Set a custom template for the year input.
   * Can also be set using an `<ng-template>` element with `#year` template reference variable.
   */
  public readonly templateYear = input<TemplateRef<typeof this.templateTypes.year> | null>(null);
  protected readonly yearTemplate = computed(
    () => this._userYearTemplate() ?? this.templateYear() ?? this._defaultYearTemplate()
  );

  /**
   * Types for the calendar templates.
   */
  public readonly templateTypes = templateTypesFn<{
    /**
     * Type of the template variable for the day template.
     */
    day: DayTemplateType;
    /**
     * Type of the template variable for the week day template.
     */
    weekDay: WeekDayTemplateType;
    /**
     * Type of the template variable for the month template.
     */
    month: MonthTemplateType;
    /**
     * Type of the template variable for the time template.
     */
    time: TimeTemplateType;
    /**
     * Type of the template variable for the year template.
     */
    year: YearTemplateType;
  }>();
}
