import { Directive, ElementRef, inject } from '@angular/core';

@Directive()
export abstract class BaseDirective {
  public readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
}
