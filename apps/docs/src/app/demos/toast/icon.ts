import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { AwdButton } from '@awdlab/jig/button';
import { injectToastCreator } from '@awdlab/jig/toast';

@Component({
  imports: [AwdButton],
  selector: 'jig-demo-toast-icon',
  template: ` <button ngnButton kind="text" (click)="showToast()">Show Toast</button> `,
})
export class Demo_Toast_Icon {
  private readonly _toastCreator = injectToastCreator();

  protected showToast() {
    this._toastCreator.show({
      header: 'Notification',
      content: 'This is a basic toast message.',
      icon: tablerUser,
    });
  }
}
