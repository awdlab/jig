import { Component } from '@angular/core';
import { JigCheckbox } from '@awdlab/jig/checkbox';

@Component({
  selector: 'jig-demo-checkbox-indeterminate',
  imports: [JigCheckbox],
  template: `<jig-checkbox [allowIndeterminate]="true" (valueChange)="($event)" [value]="null" />`,
})
export class Demo_Checkbox_Indeterminate {}
