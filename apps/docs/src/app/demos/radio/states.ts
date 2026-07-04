import { Component, signal } from '@angular/core';
import { NgnRadio, NgnRadioGroup } from '@ngneers/controls/radio';

@Component({
  selector: 'ngn-demo-radio-states',
  imports: [NgnRadioGroup, NgnRadio],
  template: `
    <ngn-radio-group [(value)]="value" orientation="vertical">
      <ngn-radio value="a">Enabled</ngn-radio>
      <ngn-radio value="b" [disabled]="true">Disabled option</ngn-radio>
      <ngn-radio value="c">Also enabled</ngn-radio>
    </ngn-radio-group>
  `,
})
export class Demo_Radio_States {
  protected readonly value = signal('a');
}
