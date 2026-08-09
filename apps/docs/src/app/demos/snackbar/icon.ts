import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { JigButton } from '@awdlab/jig/button';
import { injectSnackbarCreator } from '@awdlab/jig/snackbar';

@Component({
  imports: [JigButton],
  selector: 'jig-demo-snackbar-icon',
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
