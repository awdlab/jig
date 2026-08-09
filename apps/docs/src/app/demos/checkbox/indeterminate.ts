import { Component } from '@angular/core';
import { AwdCheckbox } from '@awdlab/jig/checkbox';

@Component({
  selector: 'jig-demo-checkbox-indeterminate',
  imports: [AwdCheckbox],
  template: `<jig-checkbox [allowIndeterminate]="true" (valueChange)="($event)" [value]="null" />`,
})
export class Demo_Checkbox_Indeterminate {}
