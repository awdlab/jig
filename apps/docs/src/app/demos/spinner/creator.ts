import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { createConditionalSpinner, injectSpinnerCreator } from '@awdlab/jig/spinner';

@Component({
  selector: 'jig-demo-spinner-creator',
  imports: [JigButton],
  template: `
    <div
      id="some-area"
      style="width: 450px; height: 200px; background: var(--jig-color-surface-100); padding: 30px;"
    >
      Some content
    </div>
    <button ngnButton kind="secondary" (click)="show()">Show Spinner</button>
    <button ngnButton kind="secondary" (click)="toggleVisible()">Toggle Conditional Spinner</button>
  `,
})
export class Demo_Spinner_Creator {
  private readonly _spinnerCreator = injectSpinnerCreator();
  private readonly _spinnerVisible = signal(false);

  constructor() {
    createConditionalSpinner(this._spinnerVisible, {
      element: '#some-area',
      spinnerOptions: {
        size: 48,
        thickness: '6px',
        color: 'primary',
      },
    });
  }

  protected show() {
    const ref = this._spinnerCreator.show('#some-area');
    setTimeout(() => {
      ref.hide();
    }, 2000);
  }

  protected toggleVisible() {
    this._spinnerVisible.update(visible => !visible);
  }
}
