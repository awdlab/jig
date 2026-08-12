import { Component, signal } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-base',
  imports: [JigInputField, JigTagInput],
  template: `
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-input-base">
      <jig-tag-input
        inputId="tag-input-base"
        [delimiters]="','"
        [value]="value()"
        (valueChange)="value.set($event)"
      />
    </jig-input-field>
  `,
  host: { class: 'w-72' },
})
export class Demo_TagInput_Base {
  protected readonly value = signal<string[] | null>(['design', 'frontend']);
}
