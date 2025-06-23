import { Dialog } from '@ngneers/controls/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  imports: [Dialog],
  template: `<ngn-dialog [open]="true"> Content </ngn-dialog>`,
})
export class Dialog_Base_Component {
  constructor() {}
}
