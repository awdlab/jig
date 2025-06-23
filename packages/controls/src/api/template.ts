import { Directive, Input, OnInit, TemplateRef } from '@angular/core';
import { TemplateContext } from '../utils/template-context';

@Directive({
  selector: 'ng-template[ngnTemplate]',
})
export class TemplateDirective<T> implements OnInit {
  @Input({ required: true }) ngnTemplate!: T;

  // The directive gets the template from Angular
  constructor(
    private _contentTemplate: TemplateRef<T>,
    private _templateContext: TemplateContext
  ) {}

  public ngOnInit(): void {
    this._templateContext.register(this.ngnTemplate, this._contentTemplate);
  }

  static ngTemplateContextGuard<T>(dir: TemplateDirective<T>, ctx: unknown): ctx is T {
    return true;
  }
}
