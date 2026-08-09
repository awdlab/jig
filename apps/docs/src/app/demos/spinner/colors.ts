import { Component } from '@angular/core';
import { injectThemeColors } from '@awdlab/jig/api/ng';
import { AwdSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'jig-demo-spinner-colors',
  imports: [AwdSpinner],
  template: `
    <jig-spinner />
    @for (color of colors(); track color) {
      <jig-spinner [color]="color" />
    }
    <jig-spinner style="color: #ff0042;" />
  `,
})
export class Demo_Spinner_Colors {
  protected readonly colors = injectThemeColors();
}
