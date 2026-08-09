import { Component, input } from '@angular/core';
import { injectToastCreator, type JigToastOptions, type JigToastRef } from '@awdlab/jig/toast';

/**
 * Test-only trigger for the toast service. Toasts can only be created
 * imperatively via `injectToastCreator()`, which needs an injection context —
 * something a raw template string can't provide. This component wraps that call
 * behind two buttons so e2e tests can show/hide a toast by clicking.
 */
@Component({
  selector: 'toast-trigger',
  template: `
    <button type="button" data-testid="show-toast" (click)="show()">Show Toast</button>
    <button type="button" data-testid="hide-toast" (click)="hide()">Hide Toast</button>
  `,
})
export class ToastTrigger {
  /** Options forwarded to `show()`; drive these from the test's `inputs()`. */
  public readonly options = input<JigToastOptions>({});

  private readonly _creator = injectToastCreator();
  private _ref?: JigToastRef;

  protected show(): void {
    this._ref = this._creator.show(this.options());
  }

  protected hide(): void {
    this._ref?.hide();
    this._ref = undefined;
  }
}
