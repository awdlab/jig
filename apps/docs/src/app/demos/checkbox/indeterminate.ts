import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-checkbox-indeterminate',
  imports: [NgnCheckbox],
  template: `<ngn-checkbox [allowIndeterminate]="true" (valueChange)="($event)" [value]="null" />`,
})
export class Demo_Checkbox_Indeterminate {}
