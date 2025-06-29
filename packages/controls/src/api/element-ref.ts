import { Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[ngnElementRef]', exportAs: 'ngnElementRef' })
export class GetElementRef {
  public readonly elementRef = inject(ElementRef);
  public readonly nativeElement = this.elementRef.nativeElement;
}
