import { Component, viewChild } from '@angular/core';
import { NgnRadio, NgnRadioGroup } from '@ngneers/controls/radio';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-radio-playground',
  imports: [NgnRadioGroup, NgnRadio, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnRadioGroup', component: component() }]">
      <ngn-radio-group #ref>
        <ngn-radio value="one">Option one</ngn-radio>
        <ngn-radio value="two">Option two</ngn-radio>
        <ngn-radio value="three">Option three</ngn-radio>
      </ngn-radio-group>
    </ngn-docs-playground>
  `,
})
export class NgnDocsRadioPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnRadioGroup });
}
