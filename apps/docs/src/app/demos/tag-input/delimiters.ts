import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-delimiters',
  imports: [JigInputField, JigTagInput],
  template: `
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-delims">
      <jig-tag-input inputId="tag-delims" [delimiters]="',; '" />
    </jig-input-field>
  `,
  host: { class: 'w-72' },
})
export class Demo_TagInput_Delimiters {}
