import { Directive, ElementRef, inject, Injector } from '@angular/core';

@Directive()
export abstract class NgnBase {
  public readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  public readonly injector = inject(Injector);
}
