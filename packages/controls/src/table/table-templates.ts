import { Component, contentChild, TemplateRef } from '@angular/core';
import { templateTypesFn } from '@awdlab/jig/api/ng';
import { NgnBase } from '@awdlab/jig/base';

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
  private readonly _loadingTemplate = contentChild<TemplateRef<unknown>>('loading');
  private readonly _errorTemplate = contentChild<TemplateRef<unknown>>('error');

  protected readonly headerTemplate = this._headerTemplate;
  protected readonly bodyTemplate = this._bodyTemplate;
  protected readonly groupHeaderTemplate = this._groupHeaderTemplate;
  /** Custom rows shown while a lazy load is in flight, via `<ng-template #loading>`. */
  protected readonly loadingTemplate = this._loadingTemplate;
  /** Custom error row via `<ng-template #error>`; receives `{ error, retry }`, where `retry` re-issues the failed load. */
  protected readonly errorTemplate = this._errorTemplate;

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
