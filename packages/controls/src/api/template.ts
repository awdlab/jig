import { Directive, inject, input, OnInit, TemplateRef } from '@angular/core';
import { TemplateContext } from '@ngneers/controls/utils';

@Directive({
  selector: 'ng-template[ngnTemplate]',
})
export class TemplateDirective<T> implements OnInit {
  public readonly ngnTemplate = input.required<T>();

  // The directive gets the template from Angular
  private readonly _contentTemplate = inject<TemplateRef<T>>(TemplateRef<T>);
  private readonly _templateContext = inject(TemplateContext);

  public ngOnInit(): void {
    this._templateContext.register(this.ngnTemplate, this._contentTemplate);
  }

  public static ngTemplateContextGuard<T>(
    dir: TemplateDirective<T>,
    ctx: unknown,
  ): ctx is T {
    return true;
  }
}

/**
 * A noop with return type T.
 * This function is used to define a typed property to use in a template.
 */
export function templateTypesFn<T>() {
  return {} as T;
}
