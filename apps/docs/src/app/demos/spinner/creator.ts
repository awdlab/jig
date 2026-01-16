import { Component, ChangeDetectionStrategy } from '@angular/core';
import { injectSpinnerCreator } from '@ngneers/controls/spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-spinner-creator',
  imports: [],
  template: `
    <div id="some-area" style="width: 550px; height: 300px; background: lightgray;">
      Some content
    </div>
    <button (click)="show()">Show Spinner</button>
  `,
})
export class Demo_Spinner_Creator {
  private readonly _spinnerCreator = injectSpinnerCreator();

  protected show() {
    const ref = this._spinnerCreator.show('#some-area');
    setTimeout(() => {
      ref.hide();
    }, 2000);
  }
}
