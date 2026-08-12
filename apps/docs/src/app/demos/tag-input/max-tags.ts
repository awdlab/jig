import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-max-tags',
  imports: [JigInputField, JigTagInput],
  template: `
    <jig-input-field [label]="'Up to 3 labels'" [labelKind]="'on'" inputId="tag-max">
      <jig-tag-input inputId="tag-max" [delimiters]="','" [maxTags]="3" [value]="['design']" />
    </jig-input-field>
  `,
  host: { class: 'w-72' },
})
export class Demo_TagInput_MaxTags {}
