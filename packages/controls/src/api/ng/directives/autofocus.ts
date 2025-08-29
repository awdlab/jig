import {
  AfterViewChecked,
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

@Directive({ selector: '[ngnAutofocus]' })
export class NgnAutofocus implements AfterViewInit, AfterViewChecked {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  private _focused = false;

  public readonly ngnAutofocus = input(true, { transform: value => !!value });

  public ngAfterViewInit() {
    if (!this._focused && this.ngnAutofocus()) {
      this.autoFocus();
    }
  }

  public ngAfterViewChecked() {
    if (!this._focused && this.ngnAutofocus()) {
      this.autoFocus();
    }
  }

  private autoFocus() {
    this._el.nativeElement.focus();
    this._focused = true;
  }
}
