import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { injectToastCreator } from '@awdlab/jig/toast';

@Component({
  imports: [NgnButton],
  selector: 'awd-demo-toast-closable',
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
