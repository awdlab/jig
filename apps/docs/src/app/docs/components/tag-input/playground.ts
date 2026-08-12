import { Component, viewChild } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-tag-input-playground',
  imports: [JigTagInput, JigInputField, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigTagInput', component: component() }]">
      <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-playground">
        <jig-tag-input #ref inputId="tag-playground" [delimiters]="','" [value]="['design']" />
      </jig-input-field>
    </jig-docs-playground>
  `,
})
export class JigDocsTagInputPlayground {
  protected readonly component = viewChild.required('ref', { read: JigTagInput });
}
