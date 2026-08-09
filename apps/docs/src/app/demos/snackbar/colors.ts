import { Component } from '@angular/core';
import { injectThemeColors } from '@awdlab/jig/api/ng';
import { JigButton } from '@awdlab/jig/button';
import { injectSnackbarCreator } from '@awdlab/jig/snackbar';

import type { CustomColor } from '@awdlab/jig-custom-types';

@Component({
  imports: [JigButton],
  selector: 'jig-demo-snackbar-colors',
  template: `
    @for (color of colors(); track color) {
      <button jigButton kind="text" [color]="color" (click)="showSnackbar(color)">
        {{ color }}
      </button>
    }
  `,
})
export class Demo_Snackbar_Colors {
  protected readonly colors = injectThemeColors('snackbar');
  private readonly _snackbarCreator = injectSnackbarCreator();

  protected showSnackbar(color: CustomColor) {
    this._snackbarCreator.show({
      header: 'Notification',
      content: `This is a basic snackbar message with color ${color}.`,
      color,
    });
  }
}
