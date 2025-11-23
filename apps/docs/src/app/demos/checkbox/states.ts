import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-checkbox-states',
  imports: [NgnCheckbox],
  template: `<ngn-checkbox [disabled]="true" [value]="false" />
    <ngn-checkbox [invalid]="true" [value]="false" />`,
})
export class Demo_Checkbox_States {}
