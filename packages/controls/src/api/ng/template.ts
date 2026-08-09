import { Directive, input } from '@angular/core';

@Directive({
  selector: 'ng-template[ngnTemplate]',
})
export class JigTemplate<T> {
  public readonly ngnTemplate = input.required<T>();

  public static ngTemplateContextGuard<T>(dir: JigTemplate<T>, ctx: unknown): ctx is T {
    return true;
  }
}

/**
 * A noop with return type T.
 * This function is used to define typed properties to use in a template.
 */
export function templateTypesFn<T extends Record<string, Record<string, any>>>() {
  return {} as T & { $implicit: { [K in keyof T]: Partial<T[K]> } };
}

/**
 * A noop with return type `{ $implicit: Implicit } & Named`.
 * This function is used to define a typed property to use in a template.
 */
export function templateTypeFn<Implicit, Named extends Record<string, any> = object>() {
  return {} as ([Implicit] extends [undefined] ? unknown : { $implicit: Implicit }) & Named;
}
