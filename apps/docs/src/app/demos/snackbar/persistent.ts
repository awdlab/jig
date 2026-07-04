import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { injectSnackbarCreator, type NgnSnackbarRef } from '@ngneers/controls/snackbar';

@Component({
  imports: [NgnButton],
  selector: 'ngn-demo-snackbar-persistent',
  template: `
    <button ngnButton kind="text" (click)="showSnackbar()">Show Snackbar</button>
    <button ngnButton kind="text" (click)="hideSnackbar()">Hide Snackbar</button>
  `,
})
export class Demo_Snackbar_Persistent {
  private readonly _snackbarCreator = injectSnackbarCreator();

  private _snackbarRef?: NgnSnackbarRef;

  protected hideSnackbar() {
    this._snackbarRef?.hide();
    this._snackbarRef = undefined;
  }

  protected showSnackbar() {
    this._snackbarRef ??= this._snackbarCreator.show({
      header: 'Notification',
      content: 'This is a basic snackbar message.',
      autoHide: false,
    });
  }
}
