import { Component } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  selector: 'ngn-demo-checkbox-states',
  imports: [NgnCheckbox],
  template: `<ngn-checkbox disabled [value]="false" />
    <ngn-checkbox [invalid]="true" [value]="false" />`,
})
export class Demo_Checkbox_States {}
