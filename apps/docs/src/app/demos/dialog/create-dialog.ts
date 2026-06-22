import { Component, inject, Injector } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { createDialog } from '@ngneers/controls/dialog';

import { DummyLoremIpsumComponent1 } from '../dummies/lorem-ipsum';

@Component({
  selector: 'ngn-demo-dialog-create-dialog',
  imports: [NgnButton],
  template: `<button ngnButton (click)="showDialog()">Open Dialog</button>
    <button ngnButton (click)="showComponentDialog()">Open Component Dialog</button>`,
})
export class Demo_Dialog_CreateDialog {
  private readonly _injector = inject(Injector);

  protected showDialog() {
    createDialog(this._injector, {
      title: 'Test Dialog',
      content: 'This is a test dialog',
    });
  }

  protected showComponentDialog() {
    createDialog(this._injector, {
      title: 'Test Dialog',
      content: DummyLoremIpsumComponent1,
      size: {
        maxWidth: '70vw',
      },
      closeBy: 'escape',
    });
  }
}
