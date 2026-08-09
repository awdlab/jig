import { Component, signal } from '@angular/core';
import { NgnRadio, NgnRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'awd-demo-radio-base',
  imports: [NgnRadioGroup, NgnRadio],
  template: `
    <awd-radio-group [(value)]="value">
      <awd-radio value="small">Small</awd-radio>
      <awd-radio value="medium">Medium</awd-radio>
      <awd-radio value="large">Large</awd-radio>
    </awd-radio-group>
  `,
})
export class Demo_Radio_Base {
  protected readonly value = signal('medium');
}
