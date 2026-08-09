import { Component, signal } from '@angular/core';
import { NgnRadio, NgnRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'awd-demo-radio-orientation',
  imports: [NgnRadioGroup, NgnRadio],
  template: `
    <awd-radio-group [(value)]="value" orientation="vertical">
      <awd-radio value="card">Credit card</awd-radio>
      <awd-radio value="paypal">PayPal</awd-radio>
      <awd-radio value="transfer">Bank transfer</awd-radio>
    </awd-radio-group>
  `,
})
export class Demo_Radio_Orientation {
  protected readonly value = signal('card');
}
