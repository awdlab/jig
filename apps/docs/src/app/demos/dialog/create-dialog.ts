import { Component, inject, Injector } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { createDialog } from '@awdlab/jig/dialog';

import { DummyLoremIpsumComponent1 } from '../dummies/lorem-ipsum';

@Component({
  selector: 'jig-demo-dialog-create-dialog',
  imports: [JigButton],
  template: `<button jigButton (click)="showDialog()">Open Dialog</button>
    <button jigButton (click)="showComponentDialog()">Open Component Dialog</button>`,
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
