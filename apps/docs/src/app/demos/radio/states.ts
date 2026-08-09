import { Component, signal } from '@angular/core';
import { NgnRadio, NgnRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'awd-demo-radio-states',
  imports: [NgnRadioGroup, NgnRadio],
  template: `
    <awd-radio-group [(value)]="value" orientation="vertical">
      <awd-radio value="a">Enabled</awd-radio>
      <awd-radio value="b" [disabled]="true">Disabled option</awd-radio>
      <awd-radio value="c">Also enabled</awd-radio>
    </awd-radio-group>
  `,
})
export class Demo_Radio_States {
  protected readonly value = signal('a');
}
