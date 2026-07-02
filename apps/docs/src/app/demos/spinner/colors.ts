import { Component } from '@angular/core';
import { injectThemeColors } from '@ngneers/controls/api/ng';
import { NgnSpinner } from '@ngneers/controls/spinner';

@Component({
  selector: 'ngn-demo-spinner-colors',
  imports: [NgnSpinner],
  template: `
    <ngn-spinner />
    @for (color of colors(); track color) {
      <ngn-spinner [color]="color" />
    }
    <ngn-spinner style="color: #ff0042;" />
  `,
})
export class Demo_Spinner_Colors {
  protected readonly colors = injectThemeColors();
}
