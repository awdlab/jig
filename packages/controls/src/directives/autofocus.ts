import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

@Directive({ selector: '[ngnAutofocus]' })
export class NgnAutofocus implements AfterViewInit {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private readonly _focused = signal(false);
  private readonly _isInitialized = signal(false);

  public readonly ngnAutofocus = input(true, { transform: booleanAttribute });

  constructor() {
    effect(() => {
      if (!this.ngnAutofocus()) {
        this._focused.set(false);
      }
    });
    effect(() => {
      this.autoFocus();
    });
  }

  public ngAfterViewInit() {
    this._isInitialized.set(true);
  }

  private autoFocus() {
    if (!this._isInitialized()) {
      return;
    }
    if (!this.ngnAutofocus()) {
      return;
    }
    if (this._focused()) {
      return;
    }
    this._el.nativeElement.focus();
    this._focused.set(true);
  }
}
