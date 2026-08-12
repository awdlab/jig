import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-tag-length',
  imports: [JigInputField, JigTagInput],
  template: `
    <jig-input-field [label]="'3 to 10 characters'" [labelKind]="'on'" inputId="tag-length">
      <jig-tag-input
        inputId="tag-length"
        [delimiters]="','"
        [minTagLength]="3"
        [maxTagLength]="10"
      />
    </jig-input-field>
  `,
  host: { class: 'w-72' },
})
export class Demo_TagInput_TagLength {}
