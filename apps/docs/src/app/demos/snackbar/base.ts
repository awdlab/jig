import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { injectSnackbarCreator } from '@awdlab/jig/snackbar';

@Component({
  imports: [AwdButton],
  selector: 'jig-demo-snackbar-base',
  template: ` <button ngnButton kind="text" (click)="showSnackbar()">Show Snackbar</button> `,
})
export class Demo_Snackbar_Base {
  private readonly _snackbarCreator = injectSnackbarCreator();

  protected showSnackbar() {
    this._snackbarCreator.show({
      header: 'Notification',
      content: 'This is a basic snackbar message.',
    });
  }
}
