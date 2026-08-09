import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { injectToastCreator, type NgnToastRef } from '@awdlab/jig/toast';

@Component({
  imports: [NgnButton],
  selector: 'awd-demo-toast-persistent',
  template: `
    <button ngnButton kind="text" (click)="showToast()">Show Toast</button>
    <button ngnButton kind="text" (click)="hideToast()">Hide Toast</button>
  `,
})
export class Demo_Toast_Persistent {
  private readonly _toastCreator = injectToastCreator();

  private _toastRef?: NgnToastRef;

  protected hideToast() {
    this._toastRef?.hide();
    this._toastRef = undefined;
  }

  protected showToast() {
    this._toastRef ??= this._toastCreator.show({
      header: 'Notification',
      content: 'This is a basic toast message.',
      autoHide: false,
    });
  }
}
