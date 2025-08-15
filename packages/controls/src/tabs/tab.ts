import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core';
import { NgnBase } from '@ngneers/controls/base';

@Component({
  selector: 'ngn-tab',
  imports: [],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgnTab extends NgnBase {
  public readonly tabId = input.required<string>();

  public readonly content = contentChild<TemplateRef<unknown>>('content');
  public readonly header = contentChild<TemplateRef<unknown>>('header');

  constructor() {
    super();
  }
}
