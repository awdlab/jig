import { Component } from '@angular/core';
import { injectThemeColors } from '@awdlab/jig/api/ng';
import { NgnSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'awd-demo-spinner-colors',
  imports: [NgnSpinner],
  template: `
    <awd-spinner />
    @for (color of colors(); track color) {
      <awd-spinner [color]="color" />
    }
    <awd-spinner style="color: #ff0042;" />
  `,
})
export class Demo_Spinner_Colors {
  protected readonly colors = injectThemeColors();
}
