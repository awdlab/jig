import { Component, signal } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-multiline',
  imports: [JigInputField, JigTagInput],
  template: `
    Single line:
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-single">
      <jig-tag-input inputId="tag-single" [delimiters]="','" [value]="value()" />
    </jig-input-field>
    Multiline:
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-multi">
      <jig-tag-input inputId="tag-multi" [delimiters]="','" [multiline]="true" [value]="value()" />
    </jig-input-field>
  `,
  host: { class: 'w-72 flex flex-col gap-3' },
})
export class Demo_TagInput_Multiline {
  protected readonly value = signal<string[] | null>([
    'design',
    'frontend',
    'accessibility',
    'angular',
    'signals',
  ]);
}
