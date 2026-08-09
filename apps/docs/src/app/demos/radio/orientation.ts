import { Component, signal } from '@angular/core';
import { AwdRadio, AwdRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'jig-demo-radio-orientation',
  imports: [AwdRadioGroup, AwdRadio],
  template: `
    <jig-radio-group [(value)]="value" orientation="vertical">
      <jig-radio value="card">Credit card</jig-radio>
      <jig-radio value="paypal">PayPal</jig-radio>
      <jig-radio value="transfer">Bank transfer</jig-radio>
    </jig-radio-group>
  `,
})
export class Demo_Radio_Orientation {
  protected readonly value = signal('card');
}
