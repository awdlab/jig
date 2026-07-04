import { Component } from '@angular/core';
import { injectThemeColors } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { injectSnackbarCreator } from '@ngneers/controls/snackbar';

import type { CustomColor } from '@ngneers/controls-custom-types';

@Component({
  imports: [NgnButton],
  selector: 'ngn-demo-snackbar-colors',
  template: `
    @for (color of colors(); track color) {
      <button ngnButton kind="text" [color]="color" (click)="showSnackbar(color)">
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
