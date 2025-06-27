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

  public static ngTemplateContextGuard<T>(dir: TemplateDirective<T>, ctx: unknown): ctx is T {
    return true;
  }
}

/**
 * A noop with return type T.
 * This function is used to define a typed property to use in a template.
 * @returns A function that returns a value of type T[keyof T].
 * @template T - The type of the template context.
 */
export function templateTypesFn<T>() {
  return (_: keyof T): T[keyof T] => {
    // This function is intentionally left empty.
    // It is used to provide a strongly typed context for the template.
    return {} as T[keyof T];
  };
}
