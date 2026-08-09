import { Component } from '@angular/core';
import { NgnCheckbox } from '@awdlab/jig/checkbox';

@Component({
  selector: 'awd-demo-checkbox-indeterminate',
  imports: [NgnCheckbox],
  template: `<awd-checkbox [allowIndeterminate]="true" (valueChange)="($event)" [value]="null" />`,
})
export class Demo_Checkbox_Indeterminate {}
