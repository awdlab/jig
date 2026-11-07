import { Component, inject, Injector } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { createDialog } from '@awdlab/jig/dialog';

import { Demo_Dummies_LoremIpsum_1 } from '../_shared/dummies/lorem-ipsum';

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
      content: Demo_Dummies_LoremIpsum_1,
      size: {
        maxWidth: '70vw',
      },
      closeBy: 'escape',
    });
  }
}
