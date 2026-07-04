import { Component, signal } from '@angular/core';
import { NgnRadio, NgnRadioGroup } from '@ngneers/controls/radio';

@Component({
  selector: 'ngn-demo-radio-base',
  imports: [NgnRadioGroup, NgnRadio],
  template: `
    <ngn-radio-group [(value)]="value">
      <ngn-radio value="small">Small</ngn-radio>
      <ngn-radio value="medium">Medium</ngn-radio>
      <ngn-radio value="large">Large</ngn-radio>
    </ngn-radio-group>
  `,
})
export class Demo_Radio_Base {
  protected readonly value = signal('medium');
}
