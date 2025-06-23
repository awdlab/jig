import { Directive, inject, Input, OnInit, TemplateRef } from '@angular/core';

import { TemplateContext } from '../utils/template-context';

@Directive({
  selector: 'ng-template[ngnTemplate]',
})
export class TemplateDirective<T> implements OnInit {
  @Input({ required: true }) public ngnTemplate!: T;

  // The directive gets the template from Angular
  private readonly _contentTemplate = inject<TemplateRef<T>>(TemplateRef<T>);
  private readonly _templateContext = inject(TemplateContext);

  public ngOnInit(): void {
    this._templateContext.register(this.ngnTemplate, this._contentTemplate);
  }

  public static ngTemplateContextGuard<T>(dir: TemplateDirective<T>, ctx: unknown): ctx is T {
    return true;
  }
}
