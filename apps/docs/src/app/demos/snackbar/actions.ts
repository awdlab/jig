import { Component } from '@angular/core';
import tablerCircleCheck from '@iconify/icons-tabler/circle-check';
import { NgnButton } from '@ngneers/controls/button';
import { injectSnackbarCreator } from '@ngneers/controls/snackbar';

@Component({
  imports: [NgnButton],
  selector: 'ngn-demo-snackbar-actions',
  template: ` <button ngnButton kind="text" (click)="showSnackbar()">Show with action</button> `,
})
export class Demo_Snackbar_Actions {
  private readonly _snackbarCreator = injectSnackbarCreator();

  protected showSnackbar() {
    this._snackbarCreator.show({
      color: 'success',
      icon: tablerCircleCheck,
      header: 'Deal added',
      content: 'Deal successfully added',
      closable: true,
      actions: [
        {
          label: 'UNDO',
          value: 'undo',
          kind: 'text',
          color: 'success',
          action: () => console.log('undo clicked'),
        },
      ],
    });
  }
}
