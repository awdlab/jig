import { Component } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  imports: [NgnCheckbox],
  selector: 'ngn-checkbox-indeterminate',
  template: `<ngn-checkbox [allowIndeterminate]="true" [value]="null" />`,
})
export class Checkbox_Indeterminate_Component {}
