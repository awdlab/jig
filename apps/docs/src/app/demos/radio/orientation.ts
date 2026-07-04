import { Component, signal } from '@angular/core';
import { NgnRadio, NgnRadioGroup } from '@ngneers/controls/radio';

@Component({
  selector: 'ngn-demo-radio-orientation',
  imports: [NgnRadioGroup, NgnRadio],
  template: `
    <ngn-radio-group [(value)]="value" orientation="vertical">
      <ngn-radio value="card">Credit card</ngn-radio>
      <ngn-radio value="paypal">PayPal</ngn-radio>
      <ngn-radio value="transfer">Bank transfer</ngn-radio>
    </ngn-radio-group>
  `,
})
export class Demo_Radio_Orientation {
  protected readonly value = signal('card');
}
