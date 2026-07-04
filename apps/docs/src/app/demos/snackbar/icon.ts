import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnButton } from '@ngneers/controls/button';
import { injectSnackbarCreator } from '@ngneers/controls/snackbar';

@Component({
  imports: [NgnButton],
  selector: 'ngn-demo-snackbar-icon',
  template: ` <button ngnButton kind="text" (click)="showSnackbar()">Show Snackbar</button> `,
})
export class Demo_Snackbar_Icon {
  private readonly _snackbarCreator = injectSnackbarCreator();

  protected showSnackbar() {
    this._snackbarCreator.show({
      header: 'Notification',
      content: 'This is a basic snackbar message.',
      icon: tablerUser,
    });
  }
}
