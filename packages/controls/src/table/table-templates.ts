import { ChangeDetectionStrategy, Component, contentChild, TemplateRef } from '@angular/core';
import { NgnBase } from '@ngneers/controls/base';

import { FormattedTableRow } from './types';
import { templateTypesFn } from '../api/ng';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class NgnTableTemplates<T extends object> extends NgnBase<'table'> {
  private readonly _headerTemplate = contentChild<TemplateRef<unknown>>('header');
  private readonly _bodyTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.body>>('body');

  protected readonly headerTemplate = this._headerTemplate;
  protected readonly bodyTemplate = this._bodyTemplate;

  /**
   * Types for the calendar templates.
   */
  public readonly templateTypes = templateTypesFn<{
    /**
     * Type of the template variable for the body template.
     */
    body: { $implicit: FormattedTableRow<T> };
  }>();
}
