import { Component, viewChild } from '@angular/core';
import { JigRadio, JigRadioGroup } from '@awdlab/jig/radio';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-radio-playground',
  imports: [JigRadioGroup, JigRadio, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigRadioGroup', component: component() }]">
      <jig-radio-group #ref>
        <jig-radio value="one">Option one</jig-radio>
        <jig-radio value="two">Option two</jig-radio>
        <jig-radio value="three">Option three</jig-radio>
      </jig-radio-group>
    </jig-docs-playground>
  `,
})
export class JigDocsRadioPlayground {
  protected readonly component = viewChild.required('ref', { read: JigRadioGroup });
}
