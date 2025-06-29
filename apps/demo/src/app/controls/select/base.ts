import { Component } from '@angular/core';
import { Select } from '@ngneers/controls/select';

@Component({
  imports: [Select],
  template: ` <ngn-select [popoverOptions]="{ width: 1, maxWidth: 2 }" /> `,
})
export class Select_Base_Component {
  constructor() {}
}
