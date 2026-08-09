import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { injectToastCreator } from '@awdlab/jig/toast';

@Component({
  imports: [AwdButton],
  selector: 'jig-demo-toast-closable',
  template: ` <button ngnButton kind="text" (click)="showToast()">Show Toast</button> `,
})
export class Demo_Toast_Closable {
  private readonly _toastCreator = injectToastCreator();

  protected showToast() {
    this._toastCreator.show({
      header: 'Notification',
      content: 'This is a basic toast message.',
      closable: true,
    });
  }
}
