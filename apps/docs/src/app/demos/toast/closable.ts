import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { injectToastCreator } from '@ngneers/controls/toast';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnButton],
  selector: 'ngn-demo-toast-closable',
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
