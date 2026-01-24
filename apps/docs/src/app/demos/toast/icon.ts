import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { injectToastCreator } from '@ngneers/controls/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      icon: 'img/icons/user.svg',
    });
  }
}
