import { Component } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  selector: 'ngn-demo-checkbox-indeterminate',
  imports: [NgnCheckbox],
  template: `<ngn-checkbox [allowIndeterminate]="true" (valueChange)="($event)" [value]="null" />`,
})
export class Demo_Checkbox_Indeterminate {}
