import { Component, viewChild } from '@angular/core';
import { NgnRadio, NgnRadioGroup } from '@awdlab/jig/radio';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-radio-playground',
  imports: [NgnRadioGroup, NgnRadio, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnRadioGroup', component: component() }]">
      <awd-radio-group #ref>
        <awd-radio value="one">Option one</awd-radio>
        <awd-radio value="two">Option two</awd-radio>
        <awd-radio value="three">Option three</awd-radio>
      </awd-radio-group>
    </awd-docs-playground>
  `,
})
export class NgnDocsRadioPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnRadioGroup });
}
