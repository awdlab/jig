import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { injectSnackbarCreator } from '@awdlab/jig/snackbar';

@Component({
  imports: [NgnButton],
  selector: 'awd-demo-snackbar-closable',
  template: ` <button ngnButton kind="text" (click)="showSnackbar()">Show Snackbar</button> `,
})
export class Demo_Snackbar_Closable {
  private readonly _snackbarCreator = injectSnackbarCreator();

  protected showSnackbar() {
    this._snackbarCreator.show({
      header: 'Notification',
      content: 'This is a basic snackbar message.',
      closable: true,
    });
  }
}
