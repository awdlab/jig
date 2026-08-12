import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

@Component({
  selector: 'jig-demo-tag-input-suggestions-static',
  imports: [JigInputField, JigTagInput],
  template: `
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-suggest">
      <jig-tag-input inputId="tag-suggest" [delimiters]="','" [suggestions]="suggestions" />
    </jig-input-field>
  `,
  host: { class: 'w-72' },
})
export class Demo_TagInput_SuggestionsStatic {
  protected readonly suggestions = [
    'accessibility',
    'angular',
    'design',
    'documentation',
    'frontend',
    'performance',
    'signals',
    'testing',
  ];
}
