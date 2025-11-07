import { Component } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  imports: [NgnCheckbox],
  selector: 'ngn-checkbox-disabled',
  template: `<ngn-checkbox disabled [value]="false" />
    <ngn-checkbox [invalid]="true" [value]="false" />`,
})
export class Demo_Checkbox_States {}
