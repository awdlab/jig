import { Component } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  imports: [NgnCheckbox],
  selector: 'ngn-checkbox-indeterminate',
  template: `<ngn-checkbox [allowIndeterminate]="true" (valueChange)="($event)" [value]="null" />`,
})
export class Demo_Checkbox_Indeterminate {}
