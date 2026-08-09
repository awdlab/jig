import { Component, signal } from '@angular/core';
import { AwdRadio, AwdRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'jig-demo-radio-states',
  imports: [AwdRadioGroup, AwdRadio],
  template: `
    <jig-radio-group [(value)]="value" orientation="vertical">
      <jig-radio value="a">Enabled</jig-radio>
      <jig-radio value="b" [disabled]="true">Disabled option</jig-radio>
      <jig-radio value="c">Also enabled</jig-radio>
    </jig-radio-group>
  `,
})
export class Demo_Radio_States {
  protected readonly value = signal('a');
}
