import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { injectToastCreator, type JigToastRef } from '@awdlab/jig/toast';

@Component({
  imports: [JigButton],
  selector: 'jig-demo-toast-persistent',
  template: `
    <button ngnButton kind="text" (click)="showToast()">Show Toast</button>
    <button ngnButton kind="text" (click)="hideToast()">Hide Toast</button>
  `,
})
export class Demo_Toast_Persistent {
  private readonly _toastCreator = injectToastCreator();

  private _toastRef?: JigToastRef;

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
