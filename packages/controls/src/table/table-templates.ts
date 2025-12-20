import { ChangeDetectionStrategy, Component, contentChild, TemplateRef } from '@angular/core';
import { NgnBase } from '@ngneers/controls/base';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class NgnTableTemplates<T extends object> extends NgnBase<'table'> {
  private readonly _headerTemplate = contentChild<TemplateRef<unknown>>('header');
  private readonly _bodyTemplate = contentChild<TemplateRef<unknown>>('body');

  protected readonly headerTemplate = this._headerTemplate;
  protected readonly bodyTemplate = this._bodyTemplate;
}
