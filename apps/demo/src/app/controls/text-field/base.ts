import { Component } from '@angular/core';
import { TextField } from '@ngneers/controls/text-field';

@Component({
  imports: [TextField],
  template: ` <ngn-text-field [label]="'Test Label'" /> `,
})
export class TextField_Base_Component {
  constructor() {}
}
