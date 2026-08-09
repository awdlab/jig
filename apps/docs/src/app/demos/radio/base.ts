import { Component, signal } from '@angular/core';
import { AwdRadio, AwdRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'jig-demo-radio-base',
  imports: [AwdRadioGroup, AwdRadio],
  template: `
    <jig-radio-group [(value)]="value">
      <jig-radio value="small">Small</jig-radio>
      <jig-radio value="medium">Medium</jig-radio>
      <jig-radio value="large">Large</jig-radio>
    </jig-radio-group>
  `,
})
export class Demo_Radio_Base {
  protected readonly value = signal('medium');
}
