import { Directive, ElementRef, inject, Injector } from '@angular/core';

@Directive()
export abstract class NgnBase {
  /**
   * The element reference for the host element.
   */
  public readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  /**
   * The injector for the component.
   */
  public readonly injector = inject(Injector);
}
