import { Component, signal } from '@angular/core';
import { JigRadio, JigRadioGroup } from '@awdlab/jig/radio';

@Component({
  selector: 'jig-demo-radio-base',
  imports: [JigRadioGroup, JigRadio],
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
