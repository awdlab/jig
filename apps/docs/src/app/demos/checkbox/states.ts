import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-checkbox-states',
  imports: [NgnCheckbox],
  template: `
    Disabled: <ngn-checkbox [disabled]="true" [value]="false" /> Invalid:
    <ngn-checkbox [invalid]="true" [value]="false" /> Readonly:
    <ngn-checkbox [readonly]="true" [value]="true" />
  `,
})
export class Demo_Checkbox_States {}
