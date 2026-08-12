import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-states',
  imports: [JigInputField, JigTagInput],
  template: `
    Default:
    <jig-input-field>
      <jig-tag-input [delimiters]="','" [value]="tags" />
    </jig-input-field>
    Readonly:
    <jig-input-field>
      <jig-tag-input [delimiters]="','" [value]="tags" readonly />
    </jig-input-field>
    Disabled:
    <jig-input-field>
      <jig-tag-input [delimiters]="','" [value]="tags" disabled />
    </jig-input-field>
    Invalid:
    <jig-input-field>
      <jig-tag-input [delimiters]="','" [value]="tags" [invalidOn]="'immediate'" invalid />
    </jig-input-field>
    Invalid + Readonly:
    <jig-input-field>
      <jig-tag-input [delimiters]="','" [value]="tags" [invalidOn]="'immediate'" invalid readonly />
    </jig-input-field>
    Invalid + Disabled:
    <jig-input-field>
      <jig-tag-input [delimiters]="','" [value]="tags" [invalidOn]="'immediate'" invalid disabled />
    </jig-input-field>
  `,
  host: { class: 'w-72 flex flex-col gap-3' },
})
export class Demo_TagInput_States {
  protected readonly tags = ['design', 'frontend'];
}
