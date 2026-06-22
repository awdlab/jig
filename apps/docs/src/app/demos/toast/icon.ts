import { Component } from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnButton } from '@ngneers/controls/button';
import { injectToastCreator } from '@ngneers/controls/toast';

@Component({
  imports: [NgnButton],
  selector: 'ngn-demo-toast-icon',
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
