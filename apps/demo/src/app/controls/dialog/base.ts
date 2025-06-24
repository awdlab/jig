import { Component } from '@angular/core';
import { Dialog } from '@ngneers/controls/dialog';

@Component({
  imports: [Dialog],
  template: `<ngn-dialog [open]="true"> Content </ngn-dialog>
    <ngn-dialog [open]="true"> Content2 </ngn-dialog>`,
})
export class Dialog_Base_Component {
  constructor() {}
}
