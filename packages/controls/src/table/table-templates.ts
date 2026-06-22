import { Component, contentChild, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@ngneers/controls/api/ng';
import { NgnBase } from '@ngneers/controls/base';

import type { FormattedTableDataRow } from './types';

export type GroupHeaderContext = {
  $implicit: {
    groupKey: unknown;
    groupValue: unknown;
    count: number;
    expanded: boolean;
  };
};

@Component({
  template: '',
})
export abstract class NgnTableTemplates<T extends object> extends NgnBase<'table'> {
  private readonly _headerTemplate = contentChild<TemplateRef<unknown>>('header');
  private readonly _bodyTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.body>>('body');
  private readonly _groupHeaderTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.groupHeader>>('groupHeader');

  protected readonly headerTemplate = this._headerTemplate;
  protected readonly bodyTemplate = this._bodyTemplate;
  protected readonly groupHeaderTemplate = this._groupHeaderTemplate;

  /**
   * Types for the table templates.
   */
  public readonly templateTypes = templateTypesFn<{
    /**
     * Type of the template variable for the body template.
     */
    body: { $implicit: FormattedTableDataRow<T> };
    /**
     * Type of the template variable for the group header template.
     */
    groupHeader: GroupHeaderContext;
  }>();
}
