import { Component, viewChild } from '@angular/core';
import { AwdRadio, AwdRadioGroup } from '@awdlab/jig/radio';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-radio-playground',
  imports: [AwdRadioGroup, AwdRadio, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdRadioGroup', component: component() }]">
      <jig-radio-group #ref>
        <jig-radio value="one">Option one</jig-radio>
        <jig-radio value="two">Option two</jig-radio>
        <jig-radio value="three">Option three</jig-radio>
      </jig-radio-group>
    </jig-docs-playground>
  `,
})
export class AwdDocsRadioPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdRadioGroup });
}
