import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-duplicates',
  imports: [JigInputField, JigTagInput],
  template: `
    Refused (default):
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-unique">
      <jig-tag-input inputId="tag-unique" [delimiters]="','" [value]="['design']" />
    </jig-input-field>
    Allowed:
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-dupes">
      <jig-tag-input
        inputId="tag-dupes"
        [delimiters]="','"
        [allowDuplicates]="true"
        [value]="['design']"
      />
    </jig-input-field>
  `,
  host: { class: 'w-72 flex flex-col gap-3' },
})
export class Demo_TagInput_Duplicates {}
